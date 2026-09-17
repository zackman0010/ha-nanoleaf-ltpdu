"""Nanoleaf LTPDU integration for Home Assistant.

Direct control of SecretLab MagRGB (and related Nanoleaf LTPDU-family) light strips
over their real, reverse-engineered Thread/CoAP protocol — no Nanoleaf app, cloud, or
Matter bridge involved. See project_magrgb_protocol_reverse_engineering.md for the full
reverse-engineering history behind protocol/.
"""
from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse

from . import services as scene_services
from .const import DOMAIN
from .coordinator import NanoleafLtpduCoordinator

PLATFORMS: list[Platform] = [Platform.LIGHT]

SERVICE_GET_SCENE_CAPABILITIES = "get_scene_capabilities"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Domain-wide setup — registers the one service that isn't tied to a specific
    strip (get_scene_capabilities just serializes ci.py's own constants)."""

    async def _handle_get_scene_capabilities(call: ServiceCall) -> ServiceResponse:
        return scene_services.get_scene_capabilities()

    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_SCENE_CAPABILITIES,
        _handle_get_scene_capabilities,
        supports_response=SupportsResponse.ONLY,
    )
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up one strip's config entry."""
    coordinator = NanoleafLtpduCoordinator(hass, entry)
    await coordinator.async_load_scene_registry()
    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload one strip's config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        coordinator: NanoleafLtpduCoordinator = hass.data[DOMAIN].pop(entry.entry_id)
        coordinator.runtime.close()
    return unload_ok
