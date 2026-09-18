"""
ciCommand (scene/effect) binary sub-format. This uses a DIFFERENT framing convention
than the outer TLV scheme used everywhere else in the protocol: each block here is
tag(1 byte) + len(1 byte) + data, not tag(2B)+len(2B).
"""
from __future__ import annotations

OPCODE = 0x07
SUB_WRITE = 0x01  # live preview while editing, not yet persisted
SUB_SAVE = 0x02  # commit to a scene ID
SUB_LIST = 0x03  # enumerate every scene ID currently stored on the device
SUB_GET = 0x04  # read back a stored scene's full motion+palette definition
SUB_DELETE = 0x05  # remove a stored scene
SUB_LOAD = 0x06  # activate a stored scene by ID
SUB_CURRENT = 0x07  # read the currently-active scene ID

BLOCK_MOTION = 0x01
BLOCK_PALETTE = 0x02

PREVIEW_MARKER = 0xFF  # SUB_WRITE's slot marker AND SUB_CURRENT's "live preview active" value
NO_SCENE_MARKER = 0x00  # SUB_CURRENT's "no scene playing" value (static color, or off)
FACTORY_NORTHERN_LIGHTS_ID = 0xFA

# Motion style ID -> name. Field order within `params` is always
# Speed -> Delay -> Direction -> Loop -> unique slider, with fields omitted when not
# applicable to that motion (see the table below). style id 0x04 does not exist.
MOTIONS = {
    0x06: "Stripes",  # params: Speed, Direction, Segment
    0x02: "Random",  # params: Speed, Delay
    0x03: "Highlight",  # params: Speed, Delay, First Colour Frequency
    0x05: "Flow",  # params: Speed, Delay, Direction, Loop
    0x01: "Fade",  # params: Speed, Delay, Loop
}

# Ranges (identical across every motion that has the field):
#   Speed: max=0x01, min=0x58 (88) — INVERTED, low byte = fast
#   Delay: min=0x00, max=0x58 (88)
#   Segment / First Colour Frequency: min=0x00, max=0x64 (100)
#   Direction / Loop: 0x00/0x01 toggle


def _block(tag: int, data: bytes) -> bytes:
    return bytes([tag, len(data)]) + data


def encode_palette(colors: list[tuple[int, int, int]]) -> bytes:
    """colors: list of (hue_degrees 0-360, saturation_pct 0-100, brightness_pct 0-100), 1-7 entries."""
    if not 1 <= len(colors) <= 7:
        raise ValueError("scenes take 1-7 color slots")
    body = bytes([len(colors)])
    for hue, sat, bright in colors:
        if not (0 <= hue <= 360 and 0 <= sat <= 100 and 0 <= bright <= 100):
            raise ValueError(f"color out of range: hue={hue} sat={sat} bright={bright}")
        body += bytes([round(hue / 4) & 0xFF, sat, bright])
    return _block(BLOCK_PALETTE, body)


def encode_motion(style_id: int, params: bytes, slot_id: int | None = None) -> bytes:
    """slot_id=None -> live preview (0xFF marker); an int -> committing to that scene ID."""
    if style_id not in MOTIONS:
        raise ValueError(f"unknown motion style id 0x{style_id:02x}")
    marker = PREVIEW_MARKER if slot_id is None else slot_id
    return _block(BLOCK_MOTION, bytes([marker, style_id]) + params)


def build_write(style_id: int, params: bytes, colors: list[tuple[int, int, int]]) -> bytes:
    body = encode_motion(style_id, params, slot_id=None) + encode_palette(colors)
    return bytes([OPCODE, SUB_WRITE]) + len(body).to_bytes(2, "big") + body


def build_save(scene_id: int, style_id: int, params: bytes, colors: list[tuple[int, int, int]]) -> bytes:
    body = encode_motion(style_id, params, slot_id=scene_id) + encode_palette(colors)
    return bytes([OPCODE, SUB_SAVE]) + len(body).to_bytes(2, "big") + body


def build_load(scene_id: int) -> bytes:
    return bytes([OPCODE, SUB_LOAD, 0x00, 0x01, scene_id])


def build_list() -> bytes:
    return bytes([OPCODE, SUB_LIST, 0x00, 0x00])


def build_get(scene_id: int) -> bytes:
    return bytes([OPCODE, SUB_GET, 0x00, 0x01, scene_id])


def build_delete(scene_id: int) -> bytes:
    return bytes([OPCODE, SUB_DELETE, 0x00, 0x01, scene_id])


def build_current() -> bytes:
    return bytes([OPCODE, SUB_CURRENT, 0x00, 0x00])


# -- decoding responses -----------------------------------------------------------
#
# Every ci response shares one header shape, confirmed live against real hardware:
#   [status=0x00][flag=0x87][echo_sub][len_hi][len_lo][body, len_hi:len_lo bytes]
# (build_load()/build_write()/build_save() never had their responses decoded before
# now — their response is a fixed ack, not an echo, so there was nothing to parse.
# SUB_LIST/SUB_GET/SUB_CURRENT's responses are genuine data, hence decoders here.)


def _response_body(raw: bytes, expected_sub: int) -> bytes:
    if len(raw) < 5 or raw[0] != 0x00 or raw[1] != 0x87 or raw[2] != expected_sub:
        raise ValueError(f"unexpected ci response header for sub 0x{expected_sub:02x}: {raw.hex()}")
    body_len = int.from_bytes(raw[3:5], "big")
    return raw[5:5 + body_len]


def decode_current(raw: bytes) -> int:
    """The currently-active scene ID: NO_SCENE_MARKER (0x00) if a static color/off
    is active, PREVIEW_MARKER (0xFF) if an unsaved live preview (build_write) is
    active, otherwise a real saved scene ID."""
    return _response_body(raw, SUB_CURRENT)[0]


def decode_list(raw: bytes) -> list[int]:
    """Every scene ID currently stored on the device, in whatever order the
    firmware returns them (not necessarily sorted, not necessarily contiguous)."""
    return list(_response_body(raw, SUB_LIST))


def _decode_color(b0: int, b1: int, b2: int) -> tuple[int, int, int]:
    """SUB_GET's palette readback uses a DIFFERENT wire encoding than
    encode_palette()'s write-side format (hue/4, saturation, brightness as three
    separate bytes): a single big-endian 24-bit value packing
    hue<<14 | saturation<<7 | brightness (10/7/7 bits). Verified byte-exact against
    Northern Lights' independently-known real palette (227/182/125/62/31/2/307
    degrees, all saturation=100/brightness=100)."""
    value = (b0 << 16) | (b1 << 8) | b2
    hue = value >> 14
    saturation = (value >> 7) & 0x7F
    brightness = value & 0x7F
    return (hue, saturation, brightness)


def decode_get(raw: bytes) -> tuple[int, bytes, list[tuple[int, int, int]]]:
    """Returns (style_id, params, colors) for a stored scene. `colors` uses the
    SUB_GET-specific decoding (_decode_color), so it is not byte-identical to what
    build_save() would send for the same colors — only value-equivalent (modulo the
    hue field's /4 write-side compression, which is lossy)."""
    body = _response_body(raw, SUB_GET)
    style_id: int | None = None
    params = b""
    colors: list[tuple[int, int, int]] = []
    pos = 0
    while pos < len(body):
        tag, length = body[pos], body[pos + 1]
        data = body[pos + 2:pos + 2 + length]
        pos += 2 + length
        if tag == BLOCK_MOTION:
            # data[0] is the marker (scene id or PREVIEW_MARKER) -- already known
            # from the request that asked for this scene_id, not new information.
            style_id = data[1]
            params = data[2:]
        elif tag == BLOCK_PALETTE:
            count = data[0]
            colors = [
                _decode_color(data[1 + 3 * i], data[2 + 3 * i], data[3 + 3 * i])
                for i in range(count)
            ]
    if style_id is None:
        raise ValueError(f"GetScene response missing a motion block: {raw.hex()}")
    return style_id, params, colors
