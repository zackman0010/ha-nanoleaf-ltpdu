"""
Scene service encoding logic, cross-checked against the same ground-truth hex already
validated in tests/protocol/test_against_capture.py — not just internally
self-consistent, but tied back to real captured bytes.

Pure Python — no hass fixture needed for most of this (services.py's encoding
functions take no HA objects at all), except the entity-level save_scene test, which
reuses the bare-HomeAssistant approach from test_coordinator.py/test_light.py.
"""
from __future__ import annotations

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.nanoleaf_ltpdu import services as scene_services
from custom_components.nanoleaf_ltpdu.const import CONF_AUTH_TOKEN, CONF_HOST, CONF_LABEL_ID, DOMAIN, SCENE_LIBRARY_KEY
from custom_components.nanoleaf_ltpdu.light import NanoleafLtpduLight
from custom_components.nanoleaf_ltpdu.protocol import ci, tlv

# Reused verbatim from tests/protocol/test_against_capture.py's already-validated
# ground truth, so this file's checks are tied to real captured bytes, not just
# internally self-consistent.
HSB_TEST_COLORS = [(0, 50, 100), (120, 50, 100), (240, 50, 100), (240, 50, 100), (60, 50, 100), (300, 50, 100)]


def test_get_scene_capabilities_matches_ci_verbatim() -> None:
    caps = scene_services.get_scene_capabilities()
    assert set(caps["motion_styles"]) == set(ci.MOTIONS.values())
    for style_id, name in ci.MOTIONS.items():
        assert caps["motion_styles"][name]["style_id"] == style_id
        assert caps["motion_styles"][name]["param_fields"] == scene_services.MOTION_PARAM_FIELDS[style_id]
    # Every field referenced by every motion has a declared range — a future card
    # should never hit a field with no min/max.
    for fields in scene_services.MOTION_PARAM_FIELDS.values():
        for field in fields:
            assert field in caps["field_ranges"]
    assert caps["scene_id_range"] == {"min": 1, "max": 249}


def test_resolve_motion_style_case_insensitive_and_rejects_unknown() -> None:
    assert scene_services.resolve_motion_style("Fade") == 0x01
    assert scene_services.resolve_motion_style("STRIPES") == 0x06
    with pytest.raises(scene_services.SceneEncodingError):
        scene_services.resolve_motion_style("not-a-real-motion")


def test_encode_motion_params_fade_matches_ground_truth_bytes() -> None:
    """Fade (0x01), params speed=0x18 delay=0x00 loop=0x01 — the exact params bytes
    "180001" used in test_against_capture.py's "ci write (preview, Fade motion)"
    ground-truth check."""
    encoded = scene_services.encode_motion_params(0x01, {"speed": 0x18, "delay": 0x00, "loop": 0x01})
    assert encoded == bytes.fromhex("180001")

    # And feeding it through ci.build_write reproduces the SAME real captured frame
    # test_against_capture.py already validated.
    colors = scene_services.encode_colors([{"hue": h, "saturation": s, "brightness": b} for h, s, b in HSB_TEST_COLORS])
    assert colors == HSB_TEST_COLORS
    built = tlv.build_set("ci", ci.build_write(0x01, encoded, colors))
    assert built.hex() == "000100026369000200200701001c0105ff011800010213060032641e32643c32643c32640f32644b3264"


def test_encode_motion_params_stripes_matches_ground_truth_bytes() -> None:
    """Stripes (0x06), params speed=0x18 direction=0x01 segment=0x32 — the exact
    params bytes "180132" used in test_against_capture.py's "ci save (Stripes motion,
    scene id 2)" ground-truth check."""
    encoded = scene_services.encode_motion_params(0x06, {"speed": 0x18, "direction": 0x01, "segment": 0x32})
    assert encoded == bytes.fromhex("180132")

    colors = scene_services.encode_colors([{"hue": h, "saturation": s, "brightness": b} for h, s, b in HSB_TEST_COLORS])
    built = tlv.build_set("ci", ci.build_save(2, 0x06, encoded, colors))
    assert built.hex() == "000100026369000200200702001c010502061801320213060032641e32643c32643c32640f32644b3264"


def test_encode_motion_params_rejects_out_of_range_values() -> None:
    with pytest.raises(scene_services.SceneEncodingError):
        scene_services.encode_motion_params(0x01, {"speed": 0x00, "delay": 0x00, "loop": 0x01})  # speed min is 0x01
    with pytest.raises(scene_services.SceneEncodingError):
        scene_services.encode_motion_params(0x01, {"speed": 0x100, "delay": 0x00, "loop": 0x01})  # speed max is 0xFF


def test_encode_motion_params_rejects_missing_field() -> None:
    with pytest.raises(scene_services.SceneEncodingError):
        scene_services.encode_motion_params(0x01, {"speed": 0x18, "delay": 0x00})  # Fade also needs "loop"


# -- entity-level save_scene: allocation + byte-exact dispatch to runtime -------------

class _FakeRuntime:
    def __init__(self) -> None:
        self.calls: list[tuple] = []

    async def save_scene(self, scene_id: int, style_id: int, params: bytes, colors: list[tuple[int, int, int]]) -> None:
        self.calls.append((scene_id, style_id, params, colors))


class _FakeCoordinator:
    def __init__(self) -> None:
        self.runtime = _FakeRuntime()
        self._next_id = 1
        self._names: dict[str, int] = {}
        self.assigned_ids: list[tuple[str, int]] = []

    async def async_allocate_scene_id(self, name: str) -> int:
        if name not in self._names:
            self._names[name] = self._next_id
            self._next_id += 1
        return self._names[name]

    async def async_assign_scene_id(self, name: str, scene_id: int) -> None:
        self.assigned_ids.append((name, scene_id))
        self._names[name] = scene_id


class _FakeSceneLibrary:
    def __init__(self) -> None:
        self.saved_recipes: list[tuple] = []

    async def async_save_recipe(self, name: str, motion_style: str, motion_params: dict, colors: list[dict]) -> None:
        self.saved_recipes.append((name, motion_style, motion_params, colors))


class _FakeHass:
    """Just enough of hass for async_save_scene's `self.hass.data[SCENE_LIBRARY_KEY]`
    lookup — no real HomeAssistant instance needed for this test."""

    def __init__(self, scene_library: _FakeSceneLibrary) -> None:
        self.data = {SCENE_LIBRARY_KEY: scene_library}


async def test_light_save_scene_allocates_id_and_dispatches_byte_exact_params() -> None:
    entry = MockConfigEntry(domain=DOMAIN, unique_id="AB12", data={CONF_LABEL_ID: "AB12", CONF_HOST: "::1", CONF_AUTH_TOKEN: "00"})
    coordinator = _FakeCoordinator()
    scene_library = _FakeSceneLibrary()
    light = NanoleafLtpduLight.__new__(NanoleafLtpduLight)
    light.coordinator = coordinator  # type: ignore[assignment]
    light.hass = _FakeHass(scene_library)  # type: ignore[assignment]

    motion_params = {"speed": 0x18, "delay": 0x00, "loop": 0x01}
    colors = [{"hue": h, "saturation": s, "brightness": b} for h, s, b in HSB_TEST_COLORS]
    response = await light.async_save_scene(name="Sunset", motion_style="fade", motion_params=motion_params, colors=colors)

    assert response == {"scene_id": 1}
    (scene_id, style_id, params, dispatched_colors) = coordinator.runtime.calls[0]
    assert scene_id == 1
    assert style_id == 0x01
    assert params == bytes.fromhex("180001")
    assert dispatched_colors == HSB_TEST_COLORS

    # Also recorded in the shared scene library — see scene_library.py.
    assert scene_library.saved_recipes == [("Sunset", "fade", motion_params, colors)]


async def test_light_save_scene_with_explicit_scene_id_skips_allocation() -> None:
    entry = MockConfigEntry(domain=DOMAIN, unique_id="AB12", data={CONF_LABEL_ID: "AB12", CONF_HOST: "::1", CONF_AUTH_TOKEN: "00"})
    coordinator = _FakeCoordinator()
    scene_library = _FakeSceneLibrary()
    light = NanoleafLtpduLight.__new__(NanoleafLtpduLight)
    light.coordinator = coordinator  # type: ignore[assignment]
    light.hass = _FakeHass(scene_library)  # type: ignore[assignment]

    motion_params = {"speed": 0x18, "delay": 0x00, "loop": 0x01}
    colors = [{"hue": h, "saturation": s, "brightness": b} for h, s, b in HSB_TEST_COLORS]
    response = await light.async_save_scene(
        name="Sunset", motion_style="fade", motion_params=motion_params, colors=colors, scene_id=42
    )

    assert response == {"scene_id": 42}
    assert coordinator.assigned_ids == [("Sunset", 42)]
    (scene_id, *_rest) = coordinator.runtime.calls[0]
    assert scene_id == 42
