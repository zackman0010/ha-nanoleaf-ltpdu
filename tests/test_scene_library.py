"""
Tests for scene_library.py — the shared, domain-wide scene-recipe Store, distinct
from coordinator.py's per-config-entry scene ID registry (see that module's
docstring for why they're separate).

Bare HomeAssistant() instance, same approach as test_coordinator.py/test_light.py —
see that module's docstring for why not the full pytest_homeassistant_custom_component
fixture. Store works fine against a bare tmpdir-backed hass, no mocking needed.
"""
from __future__ import annotations

import tempfile

import pytest

from homeassistant.core import HomeAssistant

from custom_components.nanoleaf_ltpdu.scene_library import SceneLibrary


@pytest.fixture
async def hass():
    instance = HomeAssistant(tempfile.mkdtemp())
    yield instance
    await instance.async_stop()


async def test_empty_library_loads_as_empty_dict(hass: HomeAssistant) -> None:
    library = SceneLibrary(hass)
    await library.async_load()
    assert library.recipes == {}


async def test_save_recipe_round_trips_exact_save_scene_shape(hass: HomeAssistant) -> None:
    """Stored in exactly the shape a save_scene call receives — see the module
    docstring for why: reading it back needs zero transformation before it can be
    fed straight into another save_scene call."""
    library = SceneLibrary(hass)
    await library.async_load()

    colors = [{"hue": 0, "saturation": 50, "brightness": 100}]
    await library.async_save_recipe("Sunset", "fade", {"speed": 0x18, "delay": 0x00, "loop": 0x01}, colors)

    assert library.recipes["Sunset"] == {
        "motion_style": "fade",
        "motion_params": {"speed": 0x18, "delay": 0x00, "loop": 0x01},
        "colors": colors,
    }


async def test_save_recipe_overwrites_existing_name(hass: HomeAssistant) -> None:
    library = SceneLibrary(hass)
    await library.async_load()

    await library.async_save_recipe("Sunset", "fade", {"speed": 1, "delay": 1, "loop": 0}, [{"hue": 0, "saturation": 0, "brightness": 0}])
    await library.async_save_recipe("Sunset", "stripes", {"speed": 2, "direction": 1, "segment": 5}, [{"hue": 10, "saturation": 10, "brightness": 10}])

    assert library.recipes["Sunset"]["motion_style"] == "stripes"
    assert len(library.recipes) == 1


async def test_recipes_persist_across_reload(hass: HomeAssistant) -> None:
    library_a = SceneLibrary(hass)
    await library_a.async_load()
    await library_a.async_save_recipe("Sunset", "fade", {"speed": 1, "delay": 1, "loop": 0}, [{"hue": 0, "saturation": 0, "brightness": 0}])

    library_b = SceneLibrary(hass)
    await library_b.async_load()
    assert library_b.recipes["Sunset"]["motion_style"] == "fade"
