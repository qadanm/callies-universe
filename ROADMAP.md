# RoastMyRide: Roadmap

## Shipped

**Milestone 1: core.** Tokens, Callie (9-state mascot), 8 Roaster avatars, primitives,
CastPicker; tsup-built, render-verified.

**Foundation (Sprint 1).** services/brain (research→write→grade + offline fallback + cache),
services/voice (ElevenLabs + silent fallback), services/render (Remotion → MP4), the app flow,
and the viral **roast reel**: gameplay background + sticker overlays + word-by-word captions.
Plus: real photos, the deterministic stage scene, exact-MP4 export, per-beat voice.

**Sprint 2: perfect the reel.** Word-level karaoke sync (ElevenLabs timestamps), opening
hook + CTA outro + safe margins + fonts, car/owner **showcase** moment, audio mix (ducked
gameplay/music + synth SFX), the full **8-voice cast** config + Voice Design prompts, per-comic
caption signatures + punch-in directing, **cost telemetry**, **poster/PNG** export, real
**monetization** (persist/gate/deduct + purchase seam), and a visual-polish + adversarial-review pass.

**Sprint 3: operate it.** Server-side **live brain** (`POST /roast`), **photo car-ID** (vision),
**async render jobs** (SSE progress + storage), **accounts + credit ledger**, **Stripe** checkout
+ webhook, **resilience** (error boundary, timeouts, offline indicator, degraded note),
**observability + rate limiting + cost guardrails**, **CI** (verify + e2e on PR),
**containerize + deploy** (Dockerfile + Fly/Vercel + DEPLOY.md), and **Settings + legal** wiring.

Every integration ships behind an env-gated seam (mock/offline default + real adapter + docs),
so the whole thing runs and `pnpm verify` + e2e stay green with zero config.

## To go live (your keys/host)

Documented + turnkey (see DEPLOY.md / .env.example): host `services/api` (+ Chromium),
set `ANTHROPIC_API_KEY` + `ELEVENLABS_API_KEY` + the 8 `VOICE_*_ID`s, a Stripe account
(`STRIPE_SECRET_KEY` + webhook secret), and point the app at it via `VITE_ROAST_API`.

## Next (Sprint 4 candidates)

- **Harden the seams for scale:** swap the in-memory ledger for a real DB (Postgres/Supabase),
  the local render storage for S3, the in-memory rate limiter for Redis, and add a real auth
  provider (`VITE_AUTH_PROVIDER`).
- **Real auth + history:** sign-in (magic link), per-account roast history / a shareable feed.
- **Footage + music:** wire a licensed/CC0 gameplay-loop + music-bed library into the seams.
- **Reel depth:** multiple aspect ratios (1:1, 16:9), versus/battle mode, leaderboards, more comics.
- **Quality:** live-key verification of brain + voice + the full mix; visual-regression snapshots.
- **Ops:** turn on the deploy workflow, dashboards, alerting, abuse/cost monitoring.
