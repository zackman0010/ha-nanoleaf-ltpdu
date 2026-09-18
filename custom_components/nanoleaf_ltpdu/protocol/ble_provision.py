"""
BLE provisioning client — pairs with a fresh/factory-reset strip over Bluetooth LE and
retrieves its auth token, using the proprietary LTPDU-over-BLE scheme (not Apple
HomeKit/HAP — the strip supports both, but only this route yields the Nanoleaf auth
token).

BleProvisioner accepts an optional, already-connected `client`. The config flow must
never let this module open its own parallel BleakClient — Home Assistant's
`bluetooth` integration owns and arbitrates the adapter for every integration, and a
second independent connection attempt would race/conflict with it. The config flow
instead obtains a BLEDevice via `bluetooth.async_ble_device_from_address()` and
connects it via `bleak_retry_connector.establish_connection()` (HA's blessed
replacement for bare `BleakClient(...).connect()`), then hands the resulting client in
here. When no client is injected, this falls back to opening its own (only used by
standalone CLI tooling outside HA).

Only the one-time pairing/auth-token exchange over CHARACTERISTIC_ENCRYPTION_SETUP
uses the 1-byte-tag/1-byte-length framing (_ble_tlv_encode below); ongoing commands
over CHARACTERISTIC_ENCRYPTED — including write_thread_credentials() — are wrapped in
a full synthetic CoAP frame (coap.build(), uri_path="nlltpdu") containing a 2-byte-tag
LTPDU [path,set] command (tlv.build_set(), the same framing real UDP/CoAP traffic
uses), then AES-CTR encrypted as one blob.

Requires: pip install bleak
"""
from __future__ import annotations

import random

from bleak import BleakClient

from . import coap
from . import crypto
from . import tlv
from .thread_credentials import ThreadCredentials, build_thread_credentials_tlv

# From homekitclient.networking.bluetooth.b (Android app, decompiled)
CHARACTERISTIC_ENCRYPTION_SETUP = "6D2ADFDA-9AEA-11EA-BB37-0242AC130002"
CHARACTERISTIC_ENCRYPTED = "6D2ADDA0-9AEA-11EA-BB37-0242AC130002"
CHARACTERISTIC_UNENCRYPTED = "A9E0A2DE-9AEA-11EA-BB37-0242AC130002"

# LTPDU endpoint path for Thread credential handoff (Endpoints.java: ThreadControl)
ENDPOINT_THREAD_CONTROL = "th/tc"

TAG_PUBLIC_KEY = 0x03  # TlvType.PUBLIC_KEY — carries the printed pairing code's ASCII bytes
TAG_SALT = 0x02  # TlvType.SALT — carries the cached auth token
NO_MORE_PAIRINGS_SENTINEL = b"\x86"


def _ble_tlv_encode(tag: int, value: bytes) -> bytes:
    """Setup-phase-only TLV framing: 1-byte tag + 1-byte length + value. Only used for
    the pairing/auth-token exchange over CHARACTERISTIC_ENCRYPTION_SETUP — ongoing
    commands over CHARACTERISTIC_ENCRYPTED use the CoAP-wrapped 2-byte tag/2-byte
    length framing from tlv.py instead (see write_thread_credentials). Sending the
    wrong one for the setup exchange produces GATT status 131
    (CanNotDecryptException) on real hardware.
    """
    if len(value) > 255:
        raise ValueError("BLE TLV values over 255 bytes need the real encoder's chunking loop")
    return bytes([tag, len(value)]) + value


class BleProvisionError(Exception):
    pass


class BleConnectionError(BleProvisionError):
    """The BLE transport itself failed (device not found, connect timeout, adapter/
    proxy error) — distinct from an application-layer pairing rejection (bad code,
    already paired), which raises plain BleProvisionError instead. Callers that only
    care about "pairing didn't work" can still catch BleProvisionError; callers that
    want to tell the two apart (e.g. to show a more accurate error message) can catch
    this subclass first."""


class BleProvisioner:
    """
    Mirrors homekitclient.networking.bluetooth.b's pairing sequence: write our pubkey,
    read the device's pubkey back, derive the session, write [pairing code, cached
    token], read back whichever token the device asserts as authoritative.
    """

    def __init__(self, ble_address: str, pairing_code: str, client: BleakClient | None = None):
        self.ble_address = ble_address
        self.pairing_code = pairing_code
        self._priv, self._pub = crypto.generate_keypair()
        self.session: crypto.SessionCrypto | None = None
        self._client: BleakClient | None = client
        # If a client was handed in, its connection lifecycle belongs to the caller
        # (the config flow, via bleak_retry_connector) — we must not disconnect it.
        self._owns_client = client is None

    async def __aenter__(self) -> "BleProvisioner":
        if self._client is None:
            self._client = BleakClient(self.ble_address)
            await self._client.connect()
        return self

    async def __aexit__(self, *exc) -> None:
        if self._owns_client and self._client is not None:
            await self._client.disconnect()

    async def pair(self, cached_token: bytes = b"") -> bytes:
        """Returns the strip's newly-issued auth token (raw bytes)."""
        assert self._client is not None, "use 'async with BleProvisioner(...) as p:' or inject a connected client"

        # 1. write our pubkey, read theirs back off the same characteristic
        await self._client.write_gatt_char(CHARACTERISTIC_ENCRYPTION_SETUP, self._pub, response=True)
        their_pub = await self._client.read_gatt_char(CHARACTERISTIC_ENCRYPTION_SETUP)
        if len(their_pub) != 32:
            raise BleProvisionError(f"expected a 32-byte pubkey back, got {len(their_pub)} bytes")

        shared = crypto.scalar_mult(self._priv, bytes(their_pub))
        key, iv = crypto.derive_session_keys(shared)
        self.session = crypto.SessionCrypto(key, iv)

        # 2. through the now-encrypted channel: present EITHER the pairing code OR a
        #    cached token, never both — exactly one TLV, PUBLIC_KEY(pairing code) when
        #    one was given, else SALT(cached token). Sending both concatenated leaves
        #    the peripheral unable to parse the decrypted body (GATT 131 /
        #    CanNotDecryptException).
        if self.pairing_code:
            plaintext = _ble_tlv_encode(TAG_PUBLIC_KEY, self.pairing_code.encode("ascii"))
        else:
            plaintext = _ble_tlv_encode(TAG_SALT, cached_token)
        ciphertext = self.session.process(plaintext)
        await self._client.write_gatt_char(CHARACTERISTIC_ENCRYPTION_SETUP, ciphertext, response=True)

        resp_ciphertext = await self._client.read_gatt_char(CHARACTERISTIC_ENCRYPTION_SETUP)
        resp_plain = self.session.process(bytes(resp_ciphertext))

        if len(resp_plain) == 0:
            raise BleProvisionError("empty response — invalid pairing code, or already paired elsewhere")
        if resp_plain == NO_MORE_PAIRINGS_SENTINEL:
            raise BleProvisionError("device reports no more pairings allowed")
        return resp_plain

    async def write_thread_credentials(self, creds: ThreadCredentials) -> coap.CoapMessage:
        """Sends the Thread-credential TLV to LTPDU endpoint `th/tc` over
        CHARACTERISTIC_ENCRYPTED, using the already-established session from pair().

        Every ongoing command, not just this one, is a full synthetic CoAP frame
        (coap.build(), uri_path="nlltpdu") whose payload is the ordinary 2-byte-tag
        [path,set] LTPDU command (tlv.build_set(), the same shape real UDP/CoAP
        traffic uses), with the entire CoAP-framed blob then AES-CTR encrypted as one
        unit before being written to the characteristic — BLE has no separate
        transport-level CoAP framing the way UDP does. The response read back off the
        same characteristic is symmetrically CoAP-framed.
        """
        if self.session is None:
            raise BleProvisionError("call pair() first")
        assert self._client is not None
        command_body = tlv.build_set(ENDPOINT_THREAD_CONTROL, build_thread_credentials_tlv(creds))
        message_id = random.randint(0, 0xFFFF)
        token = random.randint(0, 0xFFFF).to_bytes(2, "big")
        frame = coap.build(coap.CODE_POST, message_id, token, "nlltpdu", command_body)
        ciphertext = self.session.process(frame)
        await self._client.write_gatt_char(CHARACTERISTIC_ENCRYPTED, ciphertext, response=True)
        resp_ciphertext = await self._client.read_gatt_char(CHARACTERISTIC_ENCRYPTED)
        resp_plain = self.session.process(bytes(resp_ciphertext))
        return coap.parse(resp_plain)
