# Callie's Universe

A character-IP company that ships **many apps from one shared system**. This monorepo
holds the shared core and the first product built on it, **RoastMyRide**. Drop a photo
of your car, pick one of 8 comedians, and get a vertical, voiced, captioned **"roast reel"**
(gameplay-background + word-synced subtitles) you can save as a video.

The three layers, dependencies pointing inward only (enforced by ESLint):

```
apps/      RoastMyRide (Vite + React SPA) + its Remotion composition
   ▼
services/  brain (research→write→grade comedy) · voice (TTS) · render (Remotion→MP4) · api (HTTP host)
   ▼
core/      @callies-universe/core — tokens · components · Callie (9-state mascot) · the 8-comedian cast
```

## What's built

- **core**: design tokens, the Callie mascot, 8 Roaster avatars, primitives. Stand-alone, tsup-built.
- **brain**: live comedy. It identifies the car (vision), researches it, writes a character-shaped
  set, grades it against an anti-cringe rubric; deterministic offline fallback + cost telemetry.
- **voice**: per-character ElevenLabs TTS with word-level timestamps; deterministic silent fallback.
- **render**: Remotion composition → MP4 (and PNG poster); the *same* `timeMs`-driven scene the app
  plays live, so the export is frame-identical.
- **api**: a `node:http` host over brain+voice+render: `/roast`, `/identify`, `/voice`,
  `/render` (sync + async jobs w/ SSE), `/poster`, a credit `/credits` ledger, Stripe
  `/checkout`+`/webhook`, rate-limiting + telemetry. Keys stay server-side.
- **app**: the full flow + the reel (hook → car/owner showcase → karaoke captions → CTA + confetti),
  one-tap Save (MP4/PNG), live audio, monetization, settings, legal.

**Everything works with zero config** (offline brain, silent voice, faux background, mock
payments, anonymous identity). Add keys + a host to go live; see **[DEPLOY.md](DEPLOY.md)**
and **[.env.example](.env.example)**. The seam pattern (an env var selects a real adapter,
unset → the offline/mock path) is used throughout.

## Run

```bash
pnpm install
pnpm verify          # lint + every offline smoke (core/brain/voice/api) + builds — the gate
pnpm app             # the RoastMyRide app at http://localhost:5180  (offline by default)
pnpm preview         # the core render sandbox at http://localhost:5179
```

Go live locally (real comedy + one-tap video):

```bash
# backend (needs ANTHROPIC_API_KEY for live comedy; ELEVENLABS_API_KEY + VOICE_*_ID for voice; Chrome for render)
ANTHROPIC_API_KEY=... ELEVENLABS_API_KEY=... VOICE_MAMA_ID=... \
  CHROMIUM_BIN="/path/to/chrome" node services/api/server.mjs        # → :8787
# app pointed at it
VITE_ROAST_API=http://localhost:8787 pnpm app
```

## The inward-only rule

[`eslint.config.js`](eslint.config.js) (`no-restricted-imports`) blocks any outward import:
`core` imports nothing internal; `services` may import `core` (and other services); `apps`
consume inward freely. `services` never import `apps/**`; the Remotion entry is passed as a
path string instead. Run it: `pnpm lint`.

## Docs

- **[ROADMAP.md](ROADMAP.md)**: what's shipped (3 sprints) + what's next.
- **[DEPLOY.md](DEPLOY.md)**: backend (Docker/Fly) + web (Vercel/static) + graceful-degradation table.
- **[project/](project/)**: the original design export (spec + prototypes).
- Per-package READMEs under `services/*` and `apps/roastmyride-app/`.
