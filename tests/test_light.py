"""
Tests for light.py — brightness/color/effect property parsing, the brightness-floor
edge case, and the live-derived `effect` property (resolved from the coordinator's
polled current_scene_id, not optimistic tracking — see light.py's class docstring).

Constructed manually (fake coordinator + fake ConfigEntry, no real entity-platform
registration, `async_write_ha_state` monkeypatched per-instance) rather than via the
full `pytest_homeassistant_custom_component` `hass`/entity-platform fixtures — see
tests/test_coordinator.py's module docstring for why. This doesn't skip anything
load-bearing: CoordinatorEntity's async_added_to_hass() doesn't touch `self.hass` at
all, only `self.coordinator.async_add_listener(...)`, faked explicitly here.
"""
from __future__ import annotations

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.components.light import ATTR_BRIGHTNESS, ATTR_EFFECT, ATTR_HS_COLOR

from custom_components.nanoleaf_ltpdu.const import CONF_AUTH_TOKEN, CONF_HOST, CONF_LABEL_ID, DOMAIN
from custom_components.nanoleaf_ltpdu.light import NanoleafLtpduLight, _coerce_int, _model_from_title
from custom_components.nanoleaf_ltpdu.protocol import ci


class _FakeRuntime:
    def __init__(self) -> None:
        self.calls: list[tuple[str, tuple]] = []
        self.scene_ids: list[int] = []
        self.scene_defs: dict[int, tuple[int, bytes, list[tuple[int, int, int]]]] = {}

    async def set_power(self, on: bool) -> None:
        self.calls.append(("set_power", (on,)))

    async def set_color(self, hue: int, sat: int, bright_pct: int | None) -> None:
        self.calls.append(("set_color", (hue, sat, bright_pct)))

    async def load_scene(self, scene_id: int) -> None:
        self.calls.append(("load_scene", (scene_id,)))

    async def list_scenes(self) -> list[int]:
        return self.scene_ids

    async def get_scene(self, scene_id: int) -> tuple[int, bytes, list[tuple[int, int, int]]]:
        return self.scene_defs[scene_id]


class _FakeCoordinator:
    def __init__(
        self,
        records: list[dict],
        scenes: dict[str, int] | None = None,
        current_scene_id: int | None = None,
    ) -> None:
        self.data = {"records": records, "current_scene_id": current_scene_id}
        self.scenes = scenes or {"Northern Lights": 0xFA}
        self.runtime = _FakeRuntime()
        self.refresh_calls = 0

    def async_add_listener(self, update_callback, context=None):
        return lambda: None

    async def async_request_refresh(self) -> None:
        self.refresh_calls += 1

    async def async_assign_scene_id(self, name: str, scene_id: int) -> None:
        self.scenes[name] = scene_id


def _make_light(
    records: list[dict],
    scenes: dict[str, int] | None = None,
    current_scene_id: int | None = None,
) -> NanoleafLtpduLight:
    entry = MockConfigEntry(domain=DOMAIN, unique_id="AB12", data={CONF_LABEL_ID: "AB12", CONF_HOST: "::1", CONF_AUTH_TOKEN: "00"})
    coordinator = _FakeCoordinator(records, scenes, current_scene_id)
    light = NanoleafLtpduLight(coordinator, entry)  # type: ignore[arg-type]
    light.async_write_ha_state = lambda: None  # type: ignore[method-assign] — no real hass to write to
    return light


# -- _coerce_int: the mixed int/hex-string encoding tlv.describe() can return --------

@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        (None, None),
        (0, 0),
        (100, 100),
        ("0x000064", 100),
        ("0x00", 0),
        ("not an int", None),
    ],
)
def test_coerce_int(raw, expected) -> None:
    assert _coerce_int(raw) == expected


# -- property parsing, including the mixed-width case pulled from a real capture -----

def test_is_on_brightness_hs_color_from_records() -> None:
    records = [
        {"path": "lb/0/oo", "op": "current", "value": 1},
        {"path": "lb/0/hu", "op": "current", "value": "0x0000ce"},  # 3-byte hex-string form
        {"path": "lb/0/sa", "op": "current", "value": 52},  # plain-int form, same attribute family
        {"path": "lb/0/pb", "op": "current", "value": 100},
    ]
    light = _make_light(records)
    assert light.is_on is True
    assert light.hs_color == (206.0, 52.0)  # 0x00ce = 206
    assert light.brightness == 255  # 100% -> 255


def test_brightness_zero_percent_maps_to_zero_not_one() -> None:
    records = [{"path": "lb/0/pb", "op": "current", "value": 0}]
    light = _make_light(records)
    assert light.brightness == 0


def test_effect_list_reflects_coordinator_scenes() -> None:
    light = _make_light([], scenes={"Northern Lights": 0xFA, "Sunset": 1, "Ocean": 2})
    assert light.effect_list == ["Northern Lights", "Sunset", "Ocean"]


# -- effect: live-derived from the coordinator's polled current_scene_id, not
# optimistic tracking (see light.py's class docstring for why this changed) --------

def test_effect_resolves_known_scene_id_to_its_name() -> None:
    light = _make_light([], scenes={"Northern Lights": 0xFA, "Sunset": 1}, current_scene_id=1)
    assert light.effect == "Sunset"


def test_effect_falls_back_to_generic_label_for_unregistered_scene_id() -> None:
    """A scene ID the strip is running that isn't in this entry's name registry —
    an unnamed factory preset, or one saved by another client — still surfaces as
    something informative rather than silently vanishing to None."""
    light = _make_light([], scenes={"Northern Lights": 0xFA}, current_scene_id=0xFB)
    assert light.effect == "Scene 251"


def test_effect_is_none_when_no_scene_is_playing() -> None:
    light = _make_light([], current_scene_id=ci.NO_SCENE_MARKER)
    assert light.effect is None


def test_effect_is_none_during_a_live_unsaved_preview() -> None:
    light = _make_light([], current_scene_id=ci.PREVIEW_MARKER)
    assert light.effect is None


def test_effect_is_none_when_current_scene_id_not_yet_polled() -> None:
    light = _make_light([])  # current_scene_id defaults to None
    assert light.effect is None


# -- DeviceInfo population from the `di` record (Device Info page: model/serial/versions) --

def test_model_from_title_strips_trailing_label_id() -> None:
    assert _model_from_title("SecretLab MagRGB 4SZ5", "4SZ5") == "SecretLab MagRGB"


def test_model_from_title_falls_back_to_full_title_when_renamed() -> None:
    """entry.title can be freely renamed by the user in HA after setup — if it no
    longer ends with the label_id, showing the whole (renamed) title beats guessing
    wrong at which word was the model name."""
    assert _model_from_title("Living Room Strip", "4SZ5") == "Living Room Strip"


def test_device_info_includes_model_and_identity_from_di_record() -> None:
    """Byte-exact real captured `di` value (mitm_capture.jsonl, device N24250K0A48 /
    "4SZ5") — same one protocol/test_against_capture.py locks in for parse_device_info
    itself; this test proves it actually reaches DeviceInfo, not just the parser."""
    records = [
        {
            "path": "di",
            "op": "current",
            "value": "0x00322e302e300000000000312e362e343900004e32343235304b30413438385cfbfffed50072",
        },
    ]
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="4SZ5",
        title="SecretLab MagRGB 4SZ5",
        data={CONF_LABEL_ID: "4SZ5", CONF_HOST: "::1", CONF_AUTH_TOKEN: "00"},
    )
    coordinator = _FakeCoordinator(records)
    light = NanoleafLtpduLight(coordinator, entry)  # type: ignore[arg-type]

    assert light._attr_device_info["model"] == "SecretLab MagRGB"
    assert light._attr_device_info["serial_number"] == "N24250K0A48"
    assert light._attr_device_info["sw_version"] == "1.6.49"
    assert light._attr_device_info["hw_version"] == "2.0.0"


def test_device_info_omits_identity_fields_when_di_missing() -> None:
    """A poll response without a `di` record (shouldn't normally happen — di is part
    of every full_state_query() — but must not crash entity construction if it did)
    must not populate placeholder/None values for fields we have no data for."""
    light = _make_light([])

    assert "serial_number" not in light._attr_device_info
    assert "sw_version" not in light._attr_device_info
    assert "hw_version" not in light._attr_device_info


# -- async_turn_on branches -----------------------------------------------------------

async def test_turn_on_brightness_one_floors_to_one_percent_not_zero() -> None:
    """The bug this whole design explicitly guards against: HA brightness=1 must not
    map to device brightness 0% (which is effectively off)."""
    light = _make_light([{"path": "lb/0/hu", "op": "current", "value": 0}, {"path": "lb/0/sa", "op": "current", "value": 0}])
    await light.async_turn_on(**{ATTR_BRIGHTNESS: 1})
    assert light.coordinator.runtime.calls == [("set_color", (0, 0, 1))]


@pytest.mark.parametrize(("ha_brightness", "expected_pct"), [(1, 1), (2, 1), (128, 50), (255, 100)])
async def test_turn_on_brightness_rounding_never_maps_low_values_to_zero(ha_brightness, expected_pct) -> None:
    light = _make_light([{"path": "lb/0/hu", "op": "current", "value": 0}, {"path": "lb/0/sa", "op": "current", "value": 0}])
    await light.async_turn_on(**{ATTR_BRIGHTNESS: ha_brightness})
    (_, (_, _, got_pct)) = light.coordinator.runtime.calls[0]
    assert got_pct == expected_pct
    assert got_pct >= 1


async def test_turn_on_with_effect_loads_scene() -> None:
    light = _make_light([], scenes={"Northern Lights": 0xFA, "Sunset": 7})
    await light.async_turn_on(**{ATTR_EFFECT: "Sunset"})
    assert light.coordinator.runtime.calls == [("load_scene", (7,))]


async def test_turn_on_with_color_calls_set_color() -> None:
    light = _make_light([{"path": "lb/0/pb", "op": "current", "value": 50}])
    await light.async_turn_on(**{ATTR_HS_COLOR: (120.0, 80.0)})
    assert light.coordinator.runtime.calls == [("set_color", (120, 80, None))]


async def test_turn_on_with_no_kwargs_just_powers_on() -> None:
    light = _make_light([])
    await light.async_turn_on()
    assert light.coordinator.runtime.calls == [("set_power", (True,))]


async def test_turn_off_calls_set_power_false() -> None:
    light = _make_light([])
    await light.async_turn_off()
    assert light.coordinator.runtime.calls == [("set_power", (False,))]


# -- list_device_scenes: reads directly off the device (ci ListScene + GetScene),
# not the local name registry -----------------------------------------------------

async def test_list_device_scenes_reads_from_device_and_resolves_known_names() -> None:
    light = _make_light([], scenes={"Northern Lights": 0xFA, "Sunset": 1}, current_scene_id=1)
    light.coordinator.runtime.scene_ids = [0xFA, 1, 0xFB]
    light.coordinator.runtime.scene_defs = {
        0xFA: (0x06, bytes.fromhex("140014"), [(227, 100, 100)]),
        1: (0x01, bytes.fromhex("0e0001"), [(0, 96, 73)]),
        0xFB: (0x01, bytes.fromhex("0e0001"), [(1, 96, 73)]),
    }
    write_calls = 0

    def _count_write() -> None:
        nonlocal write_calls
        write_calls += 1

    light.async_write_ha_state = _count_write  # type: ignore[method-assign]

    response = await light.async_list_device_scenes()

    assert response["current_scene_id"] == 1
    scenes = response["scenes"]
    assert scenes["250"]["name"] == "Northern Lights"
    assert scenes["250"]["motion_style"] == "stripes"
    assert scenes["250"]["motion_params"] == {"speed": 0x14, "direction": 0x00, "segment": 0x14}
    assert scenes["250"]["colors"] == [{"hue": 227, "saturation": 100, "brightness": 100}]
    assert scenes["1"]["name"] == "Sunset"
    # An unregistered scene ID (e.g. saved by another client) is given a generic name
    # and registered on the spot, so it's visible on future loads without another
    # refresh.
    assert scenes["251"]["name"] == "Unknown Scene 251"
    assert light.coordinator.scenes["Unknown Scene 251"] == 251
    # effect_list (read from coordinator.scenes) just changed — state is pushed
    # immediately rather than waiting for the next poll.
    assert write_calls == 1


async def test_list_device_scenes_does_not_write_state_when_nothing_new_found() -> None:
    light = _make_light([], scenes={"Northern Lights": 0xFA, "Sunset": 1}, current_scene_id=1)
    light.coordinator.runtime.scene_ids = [0xFA, 1]
    light.coordinator.runtime.scene_defs = {
        0xFA: (0x06, bytes.fromhex("140014"), [(227, 100, 100)]),
        1: (0x01, bytes.fromhex("0e0001"), [(0, 96, 73)]),
    }
    write_calls = 0

    def _count_write() -> None:
        nonlocal write_calls
        write_calls += 1

    light.async_write_ha_state = _count_write  # type: ignore[method-assign]

    await light.async_list_device_scenes()

    assert write_calls == 0
