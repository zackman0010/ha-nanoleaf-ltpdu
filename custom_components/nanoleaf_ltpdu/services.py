"""
Scene service support — the encoding logic a future custom Lovelace scene-editor card
would drive, plus the domain-level `get_scene_capabilities` service that hands it the
motion styles/param field order/ranges directly from ci.py's own confirmed constants,
so a card never needs to hardcode or reverse-engineer them separately.

Deliberately NOT inventing a "friendly units" layer on top of the raw confirmed byte
ranges (e.g. un-inverting Speed, or rescaling anything to 0-100) — that would be
presenting an unvalidated UX guess as settled protocol knowledge. Every field here
takes the actual raw byte value ci.py documents, in the actual field order ci.py
documents. A future card is exactly the right place to add a friendlier UI on top of
this honest, direct mapping.
"""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from .protocol import ci

# Field order per motion style (ci.py: "Speed -> Delay -> Direction -> Loop -> unique
# slider, with fields omitted when not applicable to that motion").
MOTION_PARAM_FIELDS: dict[int, list[str]] = {
    0x01: ["speed", "delay", "loop"],  # Fade
    0x02: ["speed", "delay"],  # Random
    0x03: ["speed", "delay", "first_colour_frequency"],  # Highlight
    0x05: ["speed", "delay", "direction", "loop"],  # Flow
    0x06: ["speed", "direction", "segment"],  # Stripes
}

# Confirmed ranges (ci.py) — Speed is INVERTED: 0x01=fastest, 0x58(88)=slowest.
FIELD_RANGES: dict[str, tuple[int, int]] = {
    "speed": (0x01, 0x58),
    "delay": (0x00, 0x58),
    "direction": (0x00, 0x01),
    "loop": (0x00, 0x01),
    "segment": (0x00, 0x64),
    "first_colour_frequency": (0x00, 0x64),
}

MOTION_NAME_TO_ID: dict[str, int] = {name.lower(): style_id for style_id, name in ci.MOTIONS.items()}

COLOR_SCHEMA = vol.Schema(
    {
        vol.Required("hue"): vol.All(int, vol.Range(min=0, max=360)),
        vol.Required("saturation"): vol.All(int, vol.Range(min=0, max=100)),
        vol.Required("brightness"): vol.All(int, vol.Range(min=0, max=100)),
    }
)

SCENE_FIELDS_SCHEMA = {
    vol.Required("motion_style"): vol.In(sorted(MOTION_NAME_TO_ID)),
    vol.Required("motion_params"): dict,
    vol.Required("colors"): vol.All([COLOR_SCHEMA], vol.Length(min=1, max=7)),
}


class SceneEncodingError(vol.Invalid):
    """A motion_style/motion_params/colors combination that doesn't match ci.py's
    confirmed shape — distinguished from a generic vol.Invalid so callers can tell
    "your service call was malformed" apart from other validation failures."""


def resolve_motion_style(motion_style: str) -> int:
    try:
        return MOTION_NAME_TO_ID[motion_style.lower()]
    except KeyError as err:
        raise SceneEncodingError(f"unknown motion_style '{motion_style}', expected one of {sorted(MOTION_NAME_TO_ID)}") from err


def encode_motion_params(style_id: int, motion_params: dict[str, Any]) -> bytes:
    fields = MOTION_PARAM_FIELDS[style_id]
    values: list[int] = []
    for field_name in fields:
        if field_name not in motion_params:
            raise SceneEncodingError(f"motion '{ci.MOTIONS[style_id]}' requires param '{field_name}'")
        value = motion_params[field_name]
        lo, hi = FIELD_RANGES[field_name]
        if not isinstance(value, int) or not lo <= value <= hi:
            raise SceneEncodingError(f"'{field_name}' must be an int between {lo} and {hi} for motion '{ci.MOTIONS[style_id]}', got {value!r}")
        values.append(value)
    return bytes(values)


def encode_colors(colors: list[dict[str, int]]) -> list[tuple[int, int, int]]:
    return [(c["hue"], c["saturation"], c["brightness"]) for c in colors]


def get_scene_capabilities() -> dict[str, Any]:
    """Serialized straight from ci.py's own constants — see this module's docstring
    for why no unit conversion happens here."""
    return {
        "motion_styles": {
            name: {
                "style_id": style_id,
                "param_fields": MOTION_PARAM_FIELDS[style_id],
            }
            for style_id, name in ci.MOTIONS.items()
        },
        "field_ranges": {field: {"min": lo, "max": hi} for field, (lo, hi) in FIELD_RANGES.items()},
        "field_notes": {"speed": "inverted — lower value is faster, 0x01 is fastest, 0x58 (88) is slowest"},
        "color_slots": {"min": 1, "max": 7},
        "color_field_ranges": {"hue": {"min": 0, "max": 360}, "saturation": {"min": 0, "max": 100}, "brightness": {"min": 0, "max": 100}},
    }
