// services/api CLI entry. Boots the roast backend.
//
//   ELEVENLABS_API_KEY=... VOICE_MAMA_ID=... \
//   CHROMIUM_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
//   node services/api/server.mjs            # → http://localhost:8787
//
// With no ELEVENLABS_API_KEY the voice is silent (offline); with no Chrome the
// render fails per-request (use ROAST_RENDER_DRYRUN=1 to return the spec instead).
import { createApiServer } from "./index.js";

const PORT = Number(process.env.PORT) || 8787;
const srv = createApiServer();
srv.listen(PORT, () => {
  const voice = process.env.ELEVENLABS_API_KEY ? "elevenlabs" : "offline (silent)";
  const chrome = process.env.CHROMIUM_BIN || process.env.CHROME || "(Remotion will fetch one)";
  console.log(`[api] listening on http://localhost:${PORT}`);
  console.log(`[api] voice: ${voice}`);
  console.log(`[api] chrome: ${chrome}`);
  if (process.env.ROAST_RENDER_DRYRUN) console.log("[api] ROAST_RENDER_DRYRUN=1: /render returns inputProps JSON, no MP4");
});
