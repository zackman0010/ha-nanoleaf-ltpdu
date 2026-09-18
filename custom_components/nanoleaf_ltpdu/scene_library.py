"""Shared scene-recipe library — domain-wide, one instance total, separate from
coordinator.py's per-config-entry name->scene_id registry.

A scene "recipe" (motion_style/motion_params/colors) is device-independent data; a
scene *ID* is not (it's an offset into one physical strip's own flash, so the same
name on two strips is two independently-allocated IDs). This module owns the former
only. Every successful save_scene call writes/overwrites its name's recipe here, so a
future save (on the same device, to tweak it, or on a different device, to copy it)
has something to start from — see light.py's async_save_scene and the domain service
get_scene_library.

Deliberately NOT a live link: editing a recipe and re-saving only affects the device
you targeted. A device's already-saved on-device scene is never retroactively changed
by a later library edit, and nothing here talks to a device directly.
"""
from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN


class SceneLibrary:
    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, dict[str, Any]]] = Store(hass, version=1, key=f"{DOMAIN}_scene_library")
        self.recipes: dict[str, dict[str, Any]] = {}

    async def async_load(self) -> None:
        self.recipes = await self._store.async_load() or {}

    async def async_save_recipe(self, name: str, motion_style: str, motion_params: dict, colors: list[dict]) -> None:
        """Stored in exactly the shape a save_scene call receives — reading one back
        needs zero transformation before feeding it into another save_scene call."""
        self.recipes[name] = {"motion_style": motion_style, "motion_params": motion_params, "colors": colors}
        await self._store.async_save(self.recipes)
