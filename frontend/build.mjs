// Bundles the scene-editor card (TS + Lit) into one ES module, committed to
// custom_components/nanoleaf_ltpdu/www/ — HACS users never run npm, so the built
// output ships in the repo like any other file. Re-run `npm run build` and commit
// the result after any change under src/.
import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/nanoleaf-scene-card.ts"],
  bundle: true,
  format: "esm",
  target: "es2021",
  minify: true,
  sourcemap: false,
  outfile: "../custom_components/nanoleaf_ltpdu/www/nanoleaf-scene-card.js",
});

console.log("Built ../custom_components/nanoleaf_ltpdu/www/nanoleaf-scene-card.js");
