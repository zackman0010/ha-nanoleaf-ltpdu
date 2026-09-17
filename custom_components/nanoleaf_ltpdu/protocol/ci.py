"""
ciCommand (scene/effect) binary sub-format. This uses a DIFFERENT framing convention
than the outer TLV scheme used everywhere else in the protocol: each block here is
tag(1 byte) + len(1 byte) + data, not tag(2B)+len(2B).
"""
from __future__ import annotations

OPCODE = 0x07
SUB_WRITE = 0x01  # live preview while editing, not yet persisted
SUB_SAVE = 0x02  # commit to a scene ID
SUB_LOAD = 0x06  # activate a stored scene by ID

BLOCK_MOTION = 0x01
BLOCK_PALETTE = 0x02

PREVIEW_MARKER = 0xFF
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
