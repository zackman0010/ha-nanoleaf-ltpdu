# nanoleaf-ltpdu scene card — build

TypeScript + [Lit](https://lit.dev), bundled with [esbuild](https://esbuild.github.io/)
into one ES module. Lit is bundled *into* the output rather than relying on any
global `window.LitElement` — not guaranteed stable across Home Assistant versions.

The compiled output (`../custom_components/nanoleaf_ltpdu/www/nanoleaf-scene-card.js`)
is committed to the repo — HACS users never run `npm`, so that file has to ship as a
built artifact in every release, just like any other file in this integration.

## Rebuild after any change under `src/`

```
npm install   # first time only
npm run build
npm run typecheck   # optional, esbuild doesn't type-check on its own
```

Then commit the updated `www/nanoleaf-scene-card.js` alongside your `src/` change,
and bump `custom_components/nanoleaf_ltpdu/manifest.json`'s version — the card's
auto-registered URL includes that version as a cache-busting query string
(`__init__.py`'s `_async_register_scene_card`), so a HACS update won't get served a
stale browser-cached bundle.

## How the card gets loaded

Nothing manual — `__init__.py`'s `async_setup` serves this file as a static path and
registers it via `homeassistant.components.frontend.add_extra_js_url`, so it's
auto-injected into every dashboard once the integration loads. No "add resource"
step for the user; just install via HACS and restart Home Assistant.
