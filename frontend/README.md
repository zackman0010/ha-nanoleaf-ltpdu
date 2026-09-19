# nanoleaf-ltpdu scene panel — build

TypeScript + [Lit](https://lit.dev), bundled with [esbuild](https://esbuild.github.io/)
into one ES module. Lit is bundled *into* the output rather than relying on any
global `window.LitElement` — not guaranteed stable across Home Assistant versions.
`nanoleaf-scene-panel.ts` is the entry point (the sidebar page); it imports
`nanoleaf-scene-card.ts` (the embedded scene editor) as part of the same bundle.

The compiled output (`../custom_components/nanoleaf_ltpdu/www/nanoleaf-scene-panel.js`)
is committed to the repo — HACS users never run `npm`, so that file has to ship as a
built artifact in every release, just like any other file in this integration.

## Rebuild after any change under `src/`

```
npm install   # first time only
npm run build
npm run typecheck   # optional, esbuild doesn't type-check on its own
```

Then commit the updated `www/nanoleaf-scene-panel.js` alongside your `src/` change,
and bump `custom_components/nanoleaf_ltpdu/manifest.json`'s version — the panel's
registered URL includes that version as a cache-busting query string
(`__init__.py`'s `_async_register_scene_panel`), so a HACS update won't get served a
stale browser-cached bundle.

## How the panel gets loaded

Nothing manual — `__init__.py`'s `async_setup` serves this file as a static path and
registers it as a sidebar page via `homeassistant.components.panel_custom`, so a
"Nanoleaf Scenes" entry appears in HA's sidebar once the integration loads. No "add
resource" step for the user; just install via HACS and restart Home Assistant.
