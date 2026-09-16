"""Light platform for the Nanoleaf LTPDU integration."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components.light import (
    ATTR_BRIGHTNESS,
    ATTR_EFFECT,
    ATTR_HS_COLOR,
    ColorMode,
    LightEntity,
    LightEntityFeature,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceResponse, SupportsResponse
from homeassistant.helpers import entity_platform
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import services as scene_services
from .const import CONF_LABEL_ID, DOMAIN
from .coordinator import NanoleafLtpduCoordinator
from .protocol import tlv

SERVICE_PREVIEW_SCENE = "preview_scene"
SERVICE_SAVE_SCENE = "save_scene"
SERVICE_DELETE_SCENE = "delete_scene"

PREVIEW_SCENE_SCHEMA = scene_services.SCENE_FIELDS_SCHEMA
SAVE_SCENE_SCHEMA = {vol.Required("name"): str, **scene_services.SCENE_FIELDS_SCHEMA}
DELETE_SCENE_SCHEMA = {vol.Required("name"): str}


def _coerce_int(value: Any) -> int | None:
    """tlv.describe()'s _format_value() returns a plain int for 1- or 2-byte values
    but a "0x..." hex string for any other width — confirmed inconsistent for the same
    logical attribute across real captures (e.g. `hu` showed up both ways). Never
    assume a fixed byte width when reading coordinator state."""
    if value is None:
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.startswith("0x"):
        return int(value, 16)
    return None


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    coordinator: NanoleafLtpduCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([NanoleafLtpduLight(coordinator, entry)])

    platform = entity_platform.async_get_current_platform()
    platform.async_register_entity_service(
        SERVICE_PREVIEW_SCENE, PREVIEW_SCENE_SCHEMA, "async_preview_scene"
    )
    platform.async_register_entity_service(
        SERVICE_SAVE_SCENE, SAVE_SCENE_SCHEMA, "async_save_scene", supports_response=SupportsResponse.OPTIONAL
    )
    platform.async_register_entity_service(
        SERVICE_DELETE_SCENE, DELETE_SCENE_SCHEMA, "async_delete_scene"
    )


class NanoleafLtpduLight(CoordinatorEntity[NanoleafLtpduCoordinator], RestoreEntity, LightEntity):
    """One Nanoleaf LTPDU strip.

    `effect` is optimistic-only, not derived from coordinator data: the device's
    active-scene state is confirmed NOT readable — full_state_query()'s response never
    includes a `ci` path, and every `ci` write response is a fixed placeholder ack, not
    an echo of what was loaded (see device.py). So `effect` is set on a successful
    load_scene() call, restored across HA restarts via RestoreEntity, and cleared
    whenever a color is set directly (matches real device behavior: setting hue/
    saturation takes the strip out of whatever effect was running).
    """

    _attr_has_entity_name = True
    _attr_name = None
    _attr_color_mode = ColorMode.HS
    _attr_supported_color_modes = {ColorMode.HS}
    _attr_supported_features = LightEntityFeature.EFFECT
    _attr_should_poll = False

    def __init__(self, coordinator: NanoleafLtpduCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator)
        self._entry = entry
        label_id = entry.data[CONF_LABEL_ID]
        self._attr_unique_id = label_id
        self._attr_device_info = {
            "identifiers": {(DOMAIN, label_id)},
            "name": f"Secretlab MAGRGB {label_id}",
            "manufacturer": "Nanoleaf",
        }
        self._restored_effect: str | None = None

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        last_state = await self.async_get_last_state()
        if last_state is not None:
            self._restored_effect = last_state.attributes.get(ATTR_EFFECT)

    def _records(self) -> list[dict]:
        return self.coordinator.data["records"]

    @property
    def is_on(self) -> bool:
        return bool(_coerce_int(tlv.get_value(self._records(), "lb/0/oo")))

    @property
    def brightness(self) -> int | None:
        pct = _coerce_int(tlv.get_value(self._records(), "lb/0/pb"))
        if pct is None:
            return None
        return round(pct / 100 * 255)

    @property
    def hs_color(self) -> tuple[float, float] | None:
        hue = _coerce_int(tlv.get_value(self._records(), "lb/0/hu"))
        sat = _coerce_int(tlv.get_value(self._records(), "lb/0/sa"))
        if hue is None or sat is None:
            return None
        return (float(hue), float(sat))

    @property
    def effect_list(self) -> list[str]:
        return list(self.coordinator.scenes.keys())

    @property
    def effect(self) -> str | None:
        return self._restored_effect

    async def async_turn_on(self, **kwargs: Any) -> None:
        if ATTR_EFFECT in kwargs:
            scene_id = self.coordinator.scenes[kwargs[ATTR_EFFECT]]
            await self.coordinator.runtime.load_scene(scene_id)
            self._restored_effect = kwargs[ATTR_EFFECT]
        elif ATTR_HS_COLOR in kwargs or ATTR_BRIGHTNESS in kwargs:
            hue, sat = kwargs.get(ATTR_HS_COLOR, self.hs_color or (0.0, 0.0))
            bright_pct: int | None = None
            if ATTR_BRIGHTNESS in kwargs:
                # Floor at 1, never 0 — HA brightness=1 must not map to device-off.
                bright_pct = max(1, round(kwargs[ATTR_BRIGHTNESS] / 255 * 100))
            await self.coordinator.runtime.set_color(round(hue), round(sat), bright_pct)
            self._restored_effect = None
        else:
            await self.coordinator.runtime.set_power(True)
        self.async_write_ha_state()
        await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.coordinator.runtime.set_power(False)
        self.async_write_ha_state()
        await self.coordinator.async_request_refresh()

    # -- scene services (Milestone 3) ------------------------------------------------

    async def async_preview_scene(self, motion_style: str, motion_params: dict, colors: list[dict]) -> None:
        style_id = scene_services.resolve_motion_style(motion_style)
        params = scene_services.encode_motion_params(style_id, motion_params)
        await self.coordinator.runtime.preview_scene(style_id, params, scene_services.encode_colors(colors))

    async def async_save_scene(self, name: str, motion_style: str, motion_params: dict, colors: list[dict]) -> ServiceResponse:
        style_id = scene_services.resolve_motion_style(motion_style)
        params = scene_services.encode_motion_params(style_id, motion_params)
        scene_id = await self.coordinator.async_allocate_scene_id(name)
        await self.coordinator.runtime.save_scene(scene_id, style_id, params, scene_services.encode_colors(colors))
        return {"scene_id": scene_id}

    async def async_delete_scene(self, name: str) -> None:
        await self.coordinator.async_delete_scene(name)
