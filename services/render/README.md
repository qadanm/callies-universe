# @callies-universe/render: the video render capability

Turns a roast into a real **MP4 that is exactly the scene that plays on screen**.
It runs the app's Remotion composition (the same `StageScene` the app plays live,
driven by the frame clock), so the saved video is frame-identical by
construction, not a separately-generated thing.

```
apps/roastmyride-app (owns the StageScene + Remotion composition)
        │  scene spec (inputProps) + the composition entry
        ▼
services/render  →  Remotion bundle + render  →  roast.mp4
```

This package is **generic** (it executes *a* Remotion composition) and
**host-agnostic**: the same `renderStageVideo()` runs locally, in CI, on a small
Node server, or on AWS Lambda (`@remotion/lambda`) later. It never imports the
app; it's handed the app's composition entry as a path.

## Render locally (the loop, end to end)

```bash
# 1. Build a scene spec (the composition's inputProps). The app's "⤓ Save video"
#    button downloads this exact JSON; this script makes one from the offline brain.
node apps/roastmyride-app/scripts/sample-spec.mjs mama /tmp/spec.json

# 2. Render it to an MP4 (reuse an installed Chrome to skip the download).
pnpm --filter @callies-universe/render render -- \
  --entry apps/roastmyride-app/remotion/index.jsx \
  --props /tmp/spec.json \
  --out roast.mp4 \
  --browser "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  # optional: --scale 0.5 (half-res, faster)   --frames 0-90 (a short preview clip)
```

Output: an H.264 MP4 (plays everywhere, incl. iOS). The app builds the spec via
`buildRenderSpec(result, input)` (standup.js), carrying the real car photo as a dataUrl,
so the video shows the actual ride.

## API

```js
import { renderStageVideo } from "@callies-universe/render";

await renderStageVideo({
  entryPoint: "apps/roastmyride-app/remotion/index.jsx", // registerRoot composition
  inputProps: spec,            // the scene spec (see buildRenderSpec)
  outFile: "roast.mp4",
  browserExecutable: "/path/to/chrome", // optional; else Remotion fetches one
  scale: 1,                    // 0.5 for a faster half-res render
  frameRange: [0, 90],         // optional preview range
  onProgress: (p) => {},       // 0..1
});
```

## Hosting it (when you're ready)

`renderStageVideo()` is the core; wrap it in whatever you deploy:
- **Small Node server** (Fly/Railway/Render): one POST route → `renderStageVideo` →
  stream the MP4 back. About $5 to $10/mo flat.
- **AWS Lambda**: swap to `@remotion/lambda` (`renderMediaOnLambda`) for
  pay-per-render autoscaling (~cents/clip).
Then the app's "⤓ Save video" POSTs the spec and gets the MP4 instead of
downloading the spec JSON.

## Notes

- **Fonts:** the scene uses Baloo 2 / Hanken (Google Fonts via CSS `@import`). In a
  networked render they load; offline they fall back. For deterministic,
  guaranteed fonts in production, load them with `@remotion/google-fonts` (or
  self-host `@font-face`) in the Remotion entry.
- **Determinism:** the scene's `timeMs` mode (sceneMotion.js) makes ambient motion
  + confetti frame-exact, which is why the MP4 matches the live scene.
- **Remotion licensing:** free for individuals and companies ≤3 people; larger /
  funded companies need a Remotion company license. If that doesn't fit, this same
  shape works with a headless-Chromium + ffmpeg renderer instead (more glue, no
  license). The composition and scene spec are unchanged.
