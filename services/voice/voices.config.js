// The voice cast: the 8 comedians and the env var that holds each one's ElevenLabs
// voice id. No real ids are hard-coded — they're configured per deployment (env
// VOICE_<ID>_ID, or VOICE_DEFAULT_ID as a shared fallback, or config.voices[id]).
// This is the single source the cast-check + docs read.

import { Roaster } from "@callies-universe/core";

export const VOICE_CAST = Roaster.roster.map((r) => ({
  id: r.id,
  name: r.name,
  tag: r.tag,
  envVar: `VOICE_${r.id.toUpperCase()}_ID`,
}));

const envOf = () => (typeof process !== "undefined" && process.env ? process.env : {});

/** Comedians with no resolvable voice id (no per-id env var AND no VOICE_DEFAULT_ID). */
export function missingVoiceIds(env = envOf()) {
  const hasDefault = !!env.VOICE_DEFAULT_ID;
  return VOICE_CAST.filter((v) => !env[v.envVar] && !hasDefault).map((v) => v.envVar);
}

/** Comedians resolving only via the shared VOICE_DEFAULT_ID (no dedicated voice yet). */
export function defaultedVoiceIds(env = envOf()) {
  if (!env.VOICE_DEFAULT_ID) return [];
  return VOICE_CAST.filter((v) => !env[v.envVar]).map((v) => v.id);
}
