# Deploying RoastMyRide

Two pieces: the **backend** (`services/api` — brain + voice + render, needs Chromium)
and the **web app** (a static Vite SPA). Copy `.env.example` → fill in the keys you have.

## Backend (services/api) → Fly.io (example)

The image bundles the whole workspace + Chromium (Remotion renders need it).

```bash
fly launch --no-deploy                      # creates the app + the roast_data volume (fly.toml)
fly secrets set \
  ANTHROPIC_API_KEY=sk-ant-... \
  ELEVENLABS_API_KEY=... VOICE_MAMA_ID=... VOICE_TONY_ID=... (… all 8) \
  STRIPE_SECRET_KEY=sk_live_... STRIPE_WEBHOOK_SECRET=whsec_...
fly deploy                                   # builds services/api/Dockerfile
```

Locally / any Docker host:
```bash
docker build -f services/api/Dockerfile -t roastmyride-api .
docker run -p 8787:8787 --env-file .env -v "$PWD/data:/data" roastmyride-api
```

Health check: `GET /health`. Point Stripe's webhook at `https://<api>/webhook`.

Other hosts (Render/Railway/Cloud Run) work the same — they just need the Dockerfile,
2GB RAM, and a persistent volume at `/data` (or swap the ledger for a real DB).

## Web app → Vercel (example) / any static host

```bash
VITE_ROAST_API=https://<your-api-origin> pnpm --filter @callies-universe/roastmyride-app build
# deploy apps/roastmyride-app/dist/  (Vercel: see apps/roastmyride-app/vercel.json)
```

Set `VITE_ROAST_API` (your API origin) and optionally `VITE_PURCHASES_PROVIDER=stripe`
and `VITE_AUTH_PROVIDER=...` as build-time env. With none set, the app runs fully on
its offline/mock paths. Hash router → no SPA rewrites needed.

## CI/CD

`.github/workflows/ci.yml` runs `pnpm verify` + the e2e on every PR/push.
`.github/workflows/deploy.yml` is a manual, secrets-gated skeleton — set the repo
variable `DEPLOY_ENABLED=true` and the host secrets, then uncomment its steps.

## Graceful degradation (what works without each key)

| Missing | Behavior |
| --- | --- |
| `VITE_ROAST_API` | App runs the brain in-browser (offline set), no one-tap video/voice/poster, localStorage credits |
| `ANTHROPIC_API_KEY` | `/roast` + `/identify` return the offline set / no car-ID (not billed) |
| `ELEVENLABS_API_KEY` / `VOICE_*` | Silent voice clips (correctly timed) |
| Chromium | Renders fail per-request (set `ROAST_RENDER_DRYRUN=1` to return the spec) |
| `STRIPE_*` | Mock purchases (grant locally) |
