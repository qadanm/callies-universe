import { defineConfig } from "tsup";

// Builds @callies-universe/core to dist/ as ESM + CJS.
// - React is a peer dependency (kept external so apps dedupe a single copy).
// - Types are hand-authored in types/index.d.ts (the components are .jsx, and the
//   handoff already defines the prop contracts), so dts emit is off here.
// - Token CSS ships as-is via package.json "files" (styles.css + tokens/), not bundled.
export default defineConfig({
  entry: { index: "src/index.js" },
  format: ["esm", "cjs"],
  target: "es2020",
  platform: "browser",
  external: ["react", "react-dom", "react/jsx-runtime"],
  clean: true,
  dts: false,
  sourcemap: true,
  treeshake: true,
});
