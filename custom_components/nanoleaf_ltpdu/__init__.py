"""Nanoleaf LTPDU integration for Home Assistant.

Direct control of SecretLab MagRGB (and related Nanoleaf LTPDU-family) light strips
over their real, reverse-engineered Thread/CoAP protocol — no Nanoleaf app, cloud, or
Matter bridge involved.
"""
from __future__ import annotations

from pathlib import Path

from homeassistant.components import panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.helpers import entity_registry as er
from homeassistant.loader import async_get_integration

from . import services as scene_services
from .const import CONF_LABEL_ID, DOMAIN, SCENE_LIBRARY_KEY
from .coordinator import NanoleafLtpduCoordinator
from .scene_library import SceneLibrary

PLATFORMS: list[Platform] = [Platform.LIGHT]

SERVICE_GET_SCENE_CAPABILITIES = "get_scene_capabilities"
SERVICE_GET_SCENE_LIBRARY = "get_scene_library"
SERVICE_LIST_STRIPS = "list_strips"

PANEL_FILENAME = "nanoleaf-scene-panel.js"
PANEL_URL_PATH = f"/{DOMAIN}/{PANEL_FILENAME}"


async def _async_register_scene_panel(hass: HomeAssistant) -> None:
    """Serve the built panel bundle (frontend/, compiled to www/ — see that
    directory's README) and register it as a sidebar page. panel_custom's
    registration isn't idempotent like add_extra_js_url was — a second call with
    the same frontend_url_path raises ValueError — so guard on it already being
    registered (matches how core integrations like insteon do this)."""
    if DOMAIN in hass.data.get("frontend_panels", {}):
        return
    integration = await async_get_integration(hass, DOMAIN)
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                url_path=PANEL_URL_PATH,
                path=str(Path(__file__).parent / "www" / PANEL_FILENAME),
                cache_headers=True,
            )
        ]
    )
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=DOMAIN,
        webcomponent_name="nanoleaf-scene-panel",
        sidebar_title="Nanoleaf Scenes",
        sidebar_icon="mdi:palette-swatch",
        module_url=f"{PANEL_URL_PATH}?v={integration.version}",
        require_admin=False,
    )


def _resolve_strips(hass: HomeAssistant) -> dict[str, dict[str, str]]:
    """Every config entry's light entity_id + display name, for the scene-editor
    panel's strip picker. An entry whose entity hasn't been registered yet (still
    setting up) is simply omitted."""
    registry = er.async_get(hass)
    strips: dict[str, dict[str, str]] = {}
    for entry in hass.config_entries.async_entries(DOMAIN):
        entity_id = registry.async_get_entity_id("light", DOMAIN, entry.data[CONF_LABEL_ID])
        if entity_id is not None:
            strips[entity_id] = {"name": entry.title}
    return strips


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Domain-wide setup — registers the services that aren't tied to a specific
    strip (get_scene_capabilities just serializes ci.py's own constants;
    get_scene_library reads the shared scene-recipe Store, see scene_library.py;
    list_strips resolves every config entry's light entity for the scene-editor
    panel's strip picker), loads that shared library once, and registers the
    scene-editor panel — all regardless of how many config entries exist."""
    library = SceneLibrary(hass)
    await library.async_load()
    hass.data[SCENE_LIBRARY_KEY] = library

    await _async_register_scene_panel(hass)

    async def _handle_get_scene_capabilities(call: ServiceCall) -> ServiceResponse:
        return scene_services.get_scene_capabilities()

    async def _handle_get_scene_library(call: ServiceCall) -> ServiceResponse:
        return {"recipes": library.recipes}

    async def _handle_list_strips(call: ServiceCall) -> ServiceResponse:
        return {"strips": _resolve_strips(hass)}

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
    hass.services.async_register(
        DOMAIN,
        SERVICE_LIST_STRIPS,
        _handle_list_strips,
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
