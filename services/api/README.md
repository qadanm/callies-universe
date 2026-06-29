# @callies-universe/api

The roast backend: a tiny HTTP host (`node:http`, no framework) over the
**voice** + **render** capabilities. It exists so the app can make "Save video"
one tap and play the reel's audio live, while every secret (ElevenLabs /
Anthropic keys) stays on the server.

## Endpoints

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `GET` | `/health` | (none) | `{ ok, offline, dryRun }` |
| `POST` | `/voice` | `{ comedianId, performerName, beats }` | `SynthesizedSet` (per-beat clips + durations) |
| `POST` | `/render` | `buildRenderSpec()` output (`+ backgroundUrl?`) | `video/mp4` (the exact reel) |

`/render` query flags: `?dryRun=1` (return the assembled `inputProps` JSON instead
of rendering; used by the offline smoke), `?frames=0-5`, `?scale=0.5`.

The server synthesizes the voice itself and injects `inputProps.audio` (the same
mapping the render CLI uses), so the app only ever POSTs the plain render spec.

## Run

```bash
ELEVENLABS_API_KEY=... VOICE_MAMA_ID=... \
CHROMIUM_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
node services/api/server.mjs                # → http://localhost:8787
```

Then point the app at it: `VITE_ROAST_API=http://localhost:8787 pnpm app`.
With **no** `ELEVENLABS_API_KEY` the voice is silent; with **no** Chrome use
`ROAST_RENDER_DRYRUN=1` (returns the spec, no MP4). When `VITE_ROAST_API` is unset
the app falls back to downloading the render spec, so the offline build never
depends on this server.

## Env

`PORT` (8787) · `ELEVENLABS_API_KEY` · `VOICE_<ID>_ID` · `CHROMIUM_BIN`/`CHROME` ·
`ROAST_REMOTION_ENTRY` (default the app's `remotion/index.jsx`) · `ROAST_RENDER_SCALE` ·
`ROAST_RENDER_DRYRUN`.

## Tests

- `pnpm --filter @callies-universe/api smoke` runs offline, no key/Chrome: boots on an
  ephemeral port, asserts `/voice` (silent clips) and `/render?dryRun=1` (voice→spec
  wiring). In the root `verify` chain.
- `pnpm --filter @callies-universe/api render-smoke` is **opt-in**, gated on
  `CHROMIUM_BIN`/`CHROME`: renders a 6-frame MP4 end to end. Not in `verify`.

## Hosting (later)

`renderStageVideo` is host-agnostic. For production, run this server behind a queue
or swap `/render` to enqueue + return a `jobId` with an SSE progress stream. The
request/response shape (the render spec in, MP4 out) stays identical.
