"""
LTPDU control client — talks directly to the MAGRGB strip over CoAP/Thread using the
reverse-engineered X25519+AES-CTR session protocol. No Nanoleaf Desktop, no debugger,
no MITM required — this IS the real client.

The HA integration never calls this directly from the event loop: see coordinator.py's
NanoleafLtpduRuntime, which wraps every call in hass.async_add_executor_job() behind an
asyncio.Lock (this class does blocking synchronous socket I/O and is not safe to call
concurrently against one instance).
"""
from __future__ import annotations

import random
import socket

from . import coap
from . import crypto
from . import tlv
from . import ci

STRIP_PORT = 5683
RECV_TIMEOUT = 5.0


class DeviceError(Exception):
    pass


class Device:
    def __init__(self, strip_addr: str, auth_token_hex: str, strip_port: int = STRIP_PORT):
        self.strip_addr = strip_addr
        self.strip_port = strip_port
        self.auth_token = bytes.fromhex(auth_token_hex)
        self._priv, self._pub = crypto.generate_keypair()
        self.session: crypto.SessionCrypto | None = None
        self._sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)
        self._sock.settimeout(RECV_TIMEOUT)
        self._msg_id = random.randint(0, 0xFFFF)
        self._token_ctr = random.randint(0, 0xFFFF)

    # -- low-level framing ----------------------------------------------------

    def _next_message_id(self) -> int:
        self._msg_id = (self._msg_id + 1) % 0x10000
        return self._msg_id

    def _next_token(self) -> bytes:
        self._token_ctr = (self._token_ctr + 1) % 0x10000
        return self._token_ctr.to_bytes(2, "big")

    def _request(self, uri_path: str, payload: bytes, code: int = coap.CODE_POST) -> coap.CoapMessage:
        frame = coap.build(code, self._next_message_id(), self._next_token(), uri_path, payload)
        self._sock.sendto(frame, (self.strip_addr, self.strip_port))
        raw, _ = self._sock.recvfrom(2048)
        return coap.parse(raw)

    # -- handshake --------------------------------------------------------------

    def connect(self) -> None:
        """Perform the /nlsecure X25519 handshake and derive the session keys."""
        hello = tlv.encode(tlv.TAG_PUBKEY, self._pub)
        resp = self._request("nlsecure", hello)
        entries = tlv.parse(resp.payload)
        their_pub = next((v for t, v in entries if t == tlv.TAG_PUBKEY), None)
        if their_pub is None or len(their_pub) != 32:
            raise DeviceError(f"handshake failed: no valid pubkey in response ({resp.payload.hex()})")
        shared = crypto.scalar_mult(self._priv, their_pub)
        key, iv = crypto.derive_session_keys(shared)
        self.session = crypto.SessionCrypto(key, iv)

    def authenticate(self) -> None:
        """Send the auth token through the now-encrypted /nlsecure channel."""
        if self.session is None:
            raise DeviceError("call connect() first")
        plaintext = tlv.encode(tlv.TAG_AUTH_TOKEN, self.auth_token)
        ciphertext = self.session.process(plaintext)
        resp = self._request("nlsecure", ciphertext)
        resp_plain = self.session.process(resp.payload)
        records = tlv.describe(resp_plain)
        status = next((r["value"] for r in records if r.get("tag") == "status"), None)
        if status != 0:
            raise DeviceError(f"authentication failed: {records}")

    # -- ongoing control ----------------------------------------------------------

    def _ltpdu(self, plaintext: bytes, code: int = coap.CODE_POST) -> list[dict]:
        if self.session is None:
            raise DeviceError("not connected — call connect() and authenticate() first")
        ciphertext = self.session.process(plaintext)
        resp = self._request("nlltpdu", ciphertext, code=code)
        resp_plain = self.session.process(resp.payload)
        return tlv.describe(resp_plain)

    def set(self, path: str, value: bytes) -> list[dict]:
        """Direct SET responses are a fixed placeholder ack, not a real value echo —
        don't trust the returned records to confirm the new state; call get_state()
        separately if that's needed."""
        return self._ltpdu(tlv.build_set(path, value))

    def get_state(self) -> list[dict]:
        """MUST be sent as CoAP GET, not POST: the device treats the embedded
        [path,set] entries in this batch pattern as inert placeholders under GET
        (returning real current values), but applies the identical bytes as real
        writes under POST — e.g. zeroing oo/hu/sa/pb/ct, since that's what
        full_state_query()'s placeholder-zero values would become."""
        return self._ltpdu(tlv.full_state_query(), code=coap.CODE_GET)

    # -- convenience wrappers --------------------------------------------------

    def set_power(self, on: bool) -> None:
        self.set("lb/0/oo", bytes([1 if on else 0]))

    def set_brightness(self, percent: int) -> None:
        if not 0 <= percent <= 100:
            raise ValueError("brightness must be 0-100")
        self.set("lb/0/pb", percent.to_bytes(2, "big"))

    def set_hue(self, degrees: int) -> None:
        if not 0 <= degrees <= 360:
            raise ValueError("hue must be 0-360")
        self.set("lb/0/hu", degrees.to_bytes(2, "big"))

    def set_saturation(self, percent: int) -> None:
        if not 0 <= percent <= 100:
            raise ValueError("saturation must be 0-100")
        self.set("lb/0/sa", percent.to_bytes(2, "big"))

    def set_color(self, hue_degrees: int, saturation_percent: int, brightness_percent: int | None = None) -> None:
        """Batch hue+saturation(+brightness) in one message, matching Desktop's own behavior."""
        payload = tlv.build_set("lb/0/hu", hue_degrees.to_bytes(2, "big"))
        payload += tlv.build_set("lb/0/sa", saturation_percent.to_bytes(2, "big"))
        if brightness_percent is not None:
            payload += tlv.build_set("lb/0/pb", brightness_percent.to_bytes(2, "big"))
        self._ltpdu(payload)

    # -- scenes/effects (ci opcode family) ------------------------------------------

    # ci opcode bytes always travel as the VALUE of an outer [path="ci", set] TLV pair,
    # not raw on their own.

    def preview_scene(self, style_id: int, params: bytes, colors: list[tuple[int, int, int]]) -> None:
        self._ltpdu(tlv.build_set("ci", ci.build_write(style_id, params, colors)))

    def save_scene(self, scene_id: int, style_id: int, params: bytes, colors: list[tuple[int, int, int]]) -> None:
        self._ltpdu(tlv.build_set("ci", ci.build_save(scene_id, style_id, params, colors)))

    def load_scene(self, scene_id: int) -> None:
        self._ltpdu(tlv.build_set("ci", ci.build_load(scene_id)))

    # -- lifecycle -----------------------------------------------------------------

    def close(self) -> None:
        self._sock.close()

    def __enter__(self) -> "Device":
        self.connect()
        self.authenticate()
        return self

    def __exit__(self, *exc) -> None:
        self.close()
