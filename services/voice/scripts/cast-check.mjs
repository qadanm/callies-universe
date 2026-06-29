// Voice cast-check. With an ELEVENLABS_API_KEY present, every comedian must have a
// resolvable voice id. Fail loudly (with the exact env vars to set) if not, so a
// live deploy never silently ships the wrong/halved cast. With no key it's a no-op
// (offline → all silent), so it's safe in the offline verify chain.

import { VOICE_CAST, missingVoiceIds, defaultedVoiceIds } from "../voices.config.js";

if (!process.env.ELEVENLABS_API_KEY) {
  console.log(`· voice cast-check skipped: no ELEVENLABS_API_KEY (offline; all ${VOICE_CAST.length} voices fall back to silent)`);
  process.exit(0);
}

const missing = missingVoiceIds();
const defaulted = defaultedVoiceIds();

if (defaulted.length) {
  console.warn(`! using VOICE_DEFAULT_ID for: ${defaulted.join(", ")} (no dedicated voice yet)`);
}
if (missing.length) {
  console.error("✗ voice cast: these comedians have no voice id. Set each (or set VOICE_DEFAULT_ID):");
  for (const v of missing) console.error("   - " + v);
  process.exit(1);
}
console.log(`✓ voice cast: all ${VOICE_CAST.length} comedians have a resolvable voice`);
