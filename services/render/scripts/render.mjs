// services/render — render CLI. Renders a Remotion composition to an MP4 from a
// scene-spec JSON. Host-agnostic; reuse an installed Chrome via --browser.
//
// Usage:
//   node scripts/render.mjs --entry <remotion-entry.jsx> --props <spec.json> \
//        --out <out.mp4> [--browser <chrome>] [--scale 0.5] [--frames 0-90]
//
// Env fallbacks: BRAIN_* not used here; CHROME/CHROMIUM_BIN → --browser.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderStageVideo } from "../index.js";

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const entry = resolve(arg("entry", "apps/roastmyride-app/remotion/index.jsx"));
const out = resolve(arg("out", "roast.mp4"));
const propsPath = arg("props");
const browserExecutable = arg("browser", process.env.CHROMIUM_BIN || process.env.CHROME || undefined);
const scale = Number(arg("scale", "1")) || 1;
const framesArg = arg("frames");
const frameRange = framesArg ? framesArg.split("-").map((n) => Number(n)) : undefined;
const inputProps = propsPath ? JSON.parse(readFileSync(resolve(propsPath), "utf8")) : {};

console.log(`[render] entry=${entry}`);
console.log(`[render] out=${out} scale=${scale}${frameRange ? ` frames=${frameRange.join("-")}` : ""}`);

let lastPct = -1;
await renderStageVideo({
  entryPoint: entry,
  inputProps,
  outFile: out,
  browserExecutable,
  scale,
  frameRange,
  onProgress: (p) => {
    const pct = Math.round(p * 100);
    if (pct !== lastPct && pct % 10 === 0) {
      lastPct = pct;
      console.log(`[render] ${pct}%`);
    }
  },
});

console.log(`[render] done → ${out}`);
