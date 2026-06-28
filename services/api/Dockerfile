# RoastMyRide backend (services/api). Bundles the brain + voice + render
# capabilities and Remotion (which needs a Chromium). Build from the REPO ROOT:
#   docker build -f services/api/Dockerfile -t roastmyride-api .
FROM node:20-bookworm-slim

# Chromium + the shared libs Remotion/headless Chrome needs.
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium fonts-liberation ca-certificates \
      libnss3 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdrm2 libgbm1 \
      libgtk-3-0 libasound2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 \
    && rm -rf /var/lib/apt/lists/*

ENV CHROMIUM_BIN=/usr/bin/chromium \
    PORT=8787 \
    ROAST_REMOTION_ENTRY=/app/apps/roastmyride-app/remotion/index.jsx \
    ROAST_LEDGER_FILE=/data/ledger.json

RUN corepack enable
WORKDIR /app

# Install with the whole workspace (api imports brain/voice/render; render bundles
# the app's Remotion entry at request time, so the app source must be present).
COPY . .
RUN pnpm install --frozen-lockfile \
    && pnpm --filter @callies-universe/core build

# Keys (ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, VOICE_*_ID, STRIPE_*) are provided
# at runtime by the host — never baked into the image.
EXPOSE 8787
VOLUME ["/data"]
CMD ["node", "services/api/server.mjs"]
