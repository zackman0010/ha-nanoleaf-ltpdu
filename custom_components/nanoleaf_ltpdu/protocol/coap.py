"""
Minimal CoAP (RFC 7252) framing for talking to the strip directly. Only what this
protocol actually uses: a single Uri-Path option ("nlsecure" or "nlltpdu"), CON/ACK
messages, GET(1)/POST(2) codes, TKL=2 tokens.
"""
from __future__ import annotations

from dataclasses import dataclass

OPT_URI_PATH = 11

CODE_GET = 0x01
CODE_POST = 0x02

TYPE_CON = 0
TYPE_NON = 1
TYPE_ACK = 2
TYPE_RST = 3


@dataclass
class CoapMessage:
    version: int
    msg_type: int  # 0=CON 1=NON 2=ACK 3=RST
    code: int
    message_id: int
    token: bytes
    options: dict[int, list[bytes]]
    payload: bytes
    header_len: int  # byte offset where payload starts

    @property
    def uri_path(self) -> str:
        segments = self.options.get(OPT_URI_PATH, [])
        return "/".join(s.decode("ascii", "replace") for s in segments)


def parse(msg: bytes) -> CoapMessage:
    if len(msg) < 4:
        raise ValueError("CoAP message shorter than the fixed 4-byte header")

    version = (msg[0] >> 6) & 0x03
    msg_type = (msg[0] >> 4) & 0x03
    tkl = msg[0] & 0x0F
    code = msg[1]
    message_id = int.from_bytes(msg[2:4], "big")

    pos = 4
    token = msg[pos:pos + tkl]
    pos += tkl

    options: dict[int, list[bytes]] = {}
    option_number = 0
    while pos < len(msg):
        first = msg[pos]
        if first == 0xFF:
            pos += 1
            break
        delta_nibble = (first >> 4) & 0x0F
        length_nibble = first & 0x0F
        pos += 1

        if delta_nibble == 13:
            delta = 13 + msg[pos]
            pos += 1
        elif delta_nibble == 14:
            delta = 269 + int.from_bytes(msg[pos:pos + 2], "big")
            pos += 2
        elif delta_nibble == 15:
            raise ValueError("reserved option delta nibble 15 encountered outside payload marker")
        else:
            delta = delta_nibble

        if length_nibble == 13:
            length = 13 + msg[pos]
            pos += 1
        elif length_nibble == 14:
            length = 269 + int.from_bytes(msg[pos:pos + 2], "big")
            pos += 2
        elif length_nibble == 15:
            raise ValueError("reserved option length nibble 15")
        else:
            length = length_nibble

        option_number += delta
        value = msg[pos:pos + length]
        pos += length
        options.setdefault(option_number, []).append(value)

    payload = msg[pos:]
    return CoapMessage(
        version=version,
        msg_type=msg_type,
        code=code,
        message_id=message_id,
        token=token,
        options=options,
        payload=payload,
        header_len=pos,
    )


def replace_payload(raw_msg: bytes, parsed: CoapMessage, new_payload: bytes) -> bytes:
    """Rebuild the wire message with `new_payload` swapped in, everything else untouched."""
    if len(new_payload) != len(parsed.payload):
        raise ValueError(
            f"payload length must match (AES-CTR preserves length): "
            f"got {len(new_payload)}, expected {len(parsed.payload)}"
        )
    return raw_msg[: parsed.header_len] + new_payload


def _encode_option_len(delta: int, length: int) -> bytes:
    """Encode one option's delta/length nibbles + any extended bytes (delta assumed < 13)."""
    assert delta < 13, "only single-digit Uri-Path deltas needed here"
    if length < 13:
        return bytes([(delta << 4) | length])
    if length < 269:
        return bytes([(delta << 4) | 13, length - 13])
    raise ValueError("option value too long for this minimal encoder")


def build(
    code: int,
    message_id: int,
    token: bytes,
    uri_path: str,
    payload: bytes = b"",
    msg_type: int = TYPE_CON,
) -> bytes:
    """Construct a fresh CoAP message with a single Uri-Path option."""
    version_type_tkl = (1 << 6) | ((msg_type & 0x03) << 4) | len(token)
    header = bytes([version_type_tkl, code]) + message_id.to_bytes(2, "big") + token

    path_bytes = uri_path.encode("ascii")
    options = _encode_option_len(OPT_URI_PATH, len(path_bytes)) + path_bytes

    if not payload:
        return header + options
    return header + options + b"\xff" + payload
