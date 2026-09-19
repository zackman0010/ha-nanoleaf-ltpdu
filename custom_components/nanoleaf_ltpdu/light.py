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
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import services as scene_services
from .const import CONF_LABEL_ID, DOMAIN, SCENE_LIBRARY_KEY
from .coordinator import NanoleafLtpduCoordinator
from .protocol import ci
from .protocol import device as protocol_device
from .protocol import tlv

SERVICE_PREVIEW_SCENE = "preview_scene"
SERVICE_SAVE_SCENE = "save_scene"
SERVICE_DELETE_SCENE = "delete_scene"
SERVICE_LIST_DEVICE_SCENES = "list_device_scenes"

PREVIEW_SCENE_SCHEMA = scene_services.SCENE_FIELDS_SCHEMA
SAVE_SCENE_SCHEMA = {vol.Required("name"): str, **scene_services.SCENE_FIELDS_SCHEMA}
DELETE_SCENE_SCHEMA = {vol.Required("name"): str}


def _coerce_int(value: Any) -> int | None:
    """tlv.describe()'s _format_value() returns a plain int for 1- or 2-byte values
    but a "0x..." hex string for any other width, so never assume a fixed byte width
    when reading coordinator state."""
    if value is None:
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.startswith("0x"):
        return int(value, 16)
    return None


def _model_from_title(title: str, label_id: str) -> str:
    """entry.title is always "<model name> <label_id>" — strip the trailing
    label_id to get just the model name. Falls back to the full title if it
    doesn't end with label_id (e.g. the user renamed the entry)."""
    prefix, _, suffix = title.rpartition(" ")
    return prefix if suffix == label_id else title


def _device_identity_info(records: list[dict]) -> dict[str, str]:
    """Populate DeviceInfo's serial_number/sw_version/hw_version from the `di`
    record (see protocol.device.parse_device_info). Only includes fields that
    actually parsed."""
    di_value = tlv.get_value(records, "di")
    if not isinstance(di_value, str):
        return {}
    identity = protocol_device.parse_device_info(di_value)
    info: dict[str, str] = {}
    if identity.hw_version is not None:
        info["hw_version"] = identity.hw_version
    if identity.fw_version is not None:
        info["sw_version"] = identity.fw_version
    if identity.serial_number is not None:
        info["serial_number"] = identity.serial_number
    return info


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
    platform.async_register_entity_service(
        SERVICE_LIST_DEVICE_SCENES, {}, "async_list_device_scenes", supports_response=SupportsResponse.ONLY
    )


class NanoleafLtpduLight(CoordinatorEntity[NanoleafLtpduCoordinator], LightEntity):
    """One Nanoleaf LTPDU strip.

    `effect` is read live from the device every poll (ci's CurrentEffect, see
    coordinator.py's "current_scene_id"), not just tracked optimistically — so it
    reflects changes made from the physical remote or another client too. A running
    scene ID resolves to a name via the coordinator's registry when known, else a
    generic "Scene <id>" label. No scene playing or an unsaved live preview both
    report `effect=None`.
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
            "name": entry.title,  # reflects the device's own discovered model name
            "manufacturer": "Nanoleaf",
            "model": _model_from_title(entry.title, label_id),
            **_device_identity_info(coordinator.data["records"]),
        }

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
        scene_id = self.coordinator.data.get("current_scene_id")
        if scene_id in (None, ci.NO_SCENE_MARKER, ci.PREVIEW_MARKER):
            return None
        for name, sid in self.coordinator.scenes.items():
            if sid == scene_id:
                return name
        return f"Scene {scene_id}"

    async def async_turn_on(self, **kwargs: Any) -> None:
        if ATTR_EFFECT in kwargs:
            scene_id = self.coordinator.scenes[kwargs[ATTR_EFFECT]]
            await self.coordinator.runtime.load_scene(scene_id)
        elif ATTR_HS_COLOR in kwargs or ATTR_BRIGHTNESS in kwargs:
            hue, sat = kwargs.get(ATTR_HS_COLOR, self.hs_color or (0.0, 0.0))
            bright_pct: int | None = None
            if ATTR_BRIGHTNESS in kwargs:
                # Floor at 1, never 0 — HA brightness=1 must not map to device-off.
                bright_pct = max(1, round(kwargs[ATTR_BRIGHTNESS] / 255 * 100))
            await self.coordinator.runtime.set_color(round(hue), round(sat), bright_pct)
        else:
            await self.coordinator.runtime.set_power(True)
        self.async_write_ha_state()
        await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.coordinator.runtime.set_power(False)
        self.async_write_ha_state()
        await self.coordinator.async_request_refresh()

    # -- scene services -----------------------------------------------------------

    async def async_preview_scene(self, motion_style: str, motion_params: dict, colors: list[dict]) -> None:
        style_id = scene_services.resolve_motion_style(motion_style)
        params = scene_services.encode_motion_params(style_id, motion_params)
        await self.coordinator.runtime.preview_scene(style_id, params, scene_services.encode_colors(colors))

    async def async_save_scene(self, name: str, motion_style: str, motion_params: dict, colors: list[dict]) -> ServiceResponse:
        style_id = scene_services.resolve_motion_style(motion_style)
        params = scene_services.encode_motion_params(style_id, motion_params)
        scene_id = await self.coordinator.async_allocate_scene_id(name)
        await self.coordinator.runtime.save_scene(scene_id, style_id, params, scene_services.encode_colors(colors))
        # Also record the recipe in the shared library (scene_library.py) as a
        # starting template for future edits/copies.
        library = self.hass.data[SCENE_LIBRARY_KEY]
        await library.async_save_recipe(name, motion_style, motion_params, colors)
        return {"scene_id": scene_id}

    async def async_delete_scene(self, name: str) -> None:
        await self.coordinator.async_delete_scene(name)

    async def async_list_device_scenes(self) -> ServiceResponse:
        """Reads every scene actually stored on the strip (ci's ListScene +
        GetScene), not from the local name registry — sees scenes the registry
        doesn't know about (unnamed presets, scenes saved by another client)."""
        reverse_names = {sid: name for name, sid in self.coordinator.scenes.items()}
        scenes: dict[str, dict[str, Any]] = {}
        for scene_id in await self.coordinator.runtime.list_scenes():
            style_id, params, colors = await self.coordinator.runtime.get_scene(scene_id)
            scenes[str(scene_id)] = {
                "name": reverse_names.get(scene_id),
                "motion_style": ci.MOTIONS.get(style_id, f"0x{style_id:02x}").lower(),
                "motion_params": scene_services.decode_motion_params(style_id, params),
                "colors": scene_services.decode_colors(colors),
            }
        return {"scenes": scenes, "current_scene_id": self.coordinator.data.get("current_scene_id")}
