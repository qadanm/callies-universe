// services/voice — per-character VOICE profiles.
//
// Like the brain's comedic-craft layer, this layers a delivery profile over the
// core Roaster seed: which voice each comedian uses + how they perform (pace,
// expressiveness). Voice IDs are provider-specific (ElevenLabs by default) and
// are meant to be configured per deployment — via config.voices[id] or env
// VOICE_<ID>_ID — so no real IDs are hard-coded here.

import { Roaster } from "@callies-universe/core";

// Delivery DNA per character (provider-agnostic 0..1 knobs the adapter maps).
const DELIVERY = {
  reginald: { pace: 0.85, stability: 0.8, expressiveness: 0.25, note: "dry, measured nature-doc narrator" },
  tony: { pace: 1.1, stability: 0.45, expressiveness: 0.58, note: "animated NY Italian-American — incredulous, hands-moving, slightly exaggerated; fast & clipped but conversational, never shouting" },
  abuomar: { pace: 0.95, stability: 0.45, expressiveness: 0.5, similarity: 0.95, note: "theatrical Egyptian uncle — the big accent lives in the designed voice; keep style moderate + similarity high so it doesn't drift American" },
  mama: { pace: 1.0, stability: 0.4, expressiveness: 0.9, note: "church-fan snap, big and loving" },
  mateo: { pace: 1.05, stability: 0.3, expressiveness: 0.95, note: "operatic telenovela melodrama" },
  jeanluc: { pace: 0.8, stability: 0.85, expressiveness: 0.2, note: "flat, bored, unbothered" },
  priya: { pace: 1.0, stability: 0.5, expressiveness: 0.7, note: "brisk, knowing, backhanded" },
  kenji: { pace: 0.7, stability: 0.9, expressiveness: 0.15, note: "glacial, serene, minimal" },
};

const DEFAULT_DELIVERY = { pace: 1.0, stability: 0.5, expressiveness: 0.6, note: "neutral" };

/** Resolve a comedian's voice profile: core name + delivery DNA + a voice id. */
export function voiceProfile(roasterId, config = {}) {
  const seed = Roaster.roster.find((r) => r.id === roasterId) || Roaster.roster[0];
  const delivery = DELIVERY[seed.id] || DEFAULT_DELIVERY;
  const env = typeof process !== "undefined" && process.env ? process.env : {};
  const voiceId =
    (config.voices && config.voices[seed.id]) ||
    env[`VOICE_${seed.id.toUpperCase()}_ID`] ||
    env.VOICE_DEFAULT_ID ||
    null; // null → provider uses its own default voice
  return { id: seed.id, name: seed.name, voiceId, ...delivery };
}

/** The words a beat is spoken as (lead + punch + tail), normalized. */
export function spokenText(beat) {
  return [beat.text, beat.punch, beat.tail].filter(Boolean).join("").replace(/\s+/g, " ").trim();
}

// Speaking pace (words/sec) used for offline duration estimates — kept in step
// with the app's timeline estimate so silent renders pace like voiced ones.
export const WPS = 2.6;

export function estimateDurationMs(text, pace = 1) {
  const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const base = (words / (WPS * pace)) * 1000;
  return Math.round(Math.max(900, base + 350)); // floor + a beat to land
}
