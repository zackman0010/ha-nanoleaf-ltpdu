"""Nanoleaf LTPDU integration for Home Assistant.

Direct control of SecretLab MagRGB (and related Nanoleaf LTPDU-family) light strips
over their real, reverse-engineered Thread/CoAP protocol — no Nanoleaf app, cloud, or
Matter bridge involved.
"""
from __future__ import annotations

from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.loader import async_get_integration

from . import services as scene_services
from .const import DOMAIN, SCENE_LIBRARY_KEY
from .coordinator import NanoleafLtpduCoordinator
from .scene_library import SceneLibrary

PLATFORMS: list[Platform] = [Platform.LIGHT]

SERVICE_GET_SCENE_CAPABILITIES = "get_scene_capabilities"
SERVICE_GET_SCENE_LIBRARY = "get_scene_library"

CARD_FILENAME = "nanoleaf-scene-card.js"
CARD_URL_PATH = f"/{DOMAIN}/{CARD_FILENAME}"


async def _async_register_scene_card(hass: HomeAssistant) -> None:
    """Serve the built card bundle (frontend/, compiled to www/ — see that
    directory's README) and auto-load it on every dashboard via
    add_extra_js_url(), so installing via HACS is enough — no manual "add
    resource" step. The query-string version cache-busts a HACS update against
    whatever the browser already has cached for this URL."""
    integration = await async_get_integration(hass, DOMAIN)
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                url_path=CARD_URL_PATH,
                path=str(Path(__file__).parent / "www" / CARD_FILENAME),
                cache_headers=True,
            )
        ]
    )
    add_extra_js_url(hass, f"{CARD_URL_PATH}?v={integration.version}")


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Domain-wide setup — registers the services that aren't tied to a specific
    strip (get_scene_capabilities just serializes ci.py's own constants;
    get_scene_library reads the shared scene-recipe Store, see scene_library.py),
    loads that shared library once, and registers the scene-editor card — all
    regardless of how many config entries exist."""
    library = SceneLibrary(hass)
    await library.async_load()
    hass.data[SCENE_LIBRARY_KEY] = library

    await _async_register_scene_card(hass)

    async def _handle_get_scene_capabilities(call: ServiceCall) -> ServiceResponse:
        return scene_services.get_scene_capabilities()

    async def _handle_get_scene_library(call: ServiceCall) -> ServiceResponse:
        return {"recipes": library.recipes}

    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_SCENE_CAPABILITIES,
        _handle_get_scene_capabilities,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_SCENE_LIBRARY,
        _handle_get_scene_library,
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
