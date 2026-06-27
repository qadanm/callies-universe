// services/voice — orchestrator. Per-beat TTS in the comedian's voice, with real
// durations, cached per (voice, text) so repeat lines / re-renders are free.
// Never throws: any provider error → the deterministic offline (silent) set, so
// the render pipeline always produces a video.

import { voiceProfile, spokenText } from "./voiceProfiles.js";
import { offlineVoiceSet } from "./offlineVoice.js";
import { createElevenLabsProvider } from "./provider/elevenlabs.js";

// Module-level audio cache (per process). Production: back with a shared store
// keyed by voiceId+text hash so a popular line is synthesized once across users.
const audioCache = new Map();

function selectProvider(config) {
  const provider = config.provider || "elevenlabs";
  if (provider === "elevenlabs") return createElevenLabsProvider(config);
  return null; // unknown provider → offline
}

/** @returns {Promise<import("../contract").SynthesizedSet>} */
export async function synthesizeSet(beats, performer, config = {}) {
  if (config.offline) return offlineVoiceSet(beats, performer, config);

  const provider = selectProvider(config);
  if (!provider) return offlineVoiceSet(beats, performer, config);

  try {
    const profile = voiceProfile(performer.id, config);
    const clips = [];
    for (let index = 0; index < (beats || []).length; index++) {
      const text = spokenText(beats[index]);
      const key = `${provider.id}:${profile.voiceId || "default"}:${text}`;
      let audio = audioCache.get(key);
      if (!audio) {
        audio = await provider.synthesize({ text, profile });
        audioCache.set(key, audio);
      }
      clips.push({ index, dataUrl: audio.dataUrl, mime: audio.mime, durationMs: audio.durationMs, text });
    }
    return { clips, voiced: true, engine: provider.id, durationsMs: clips.map((c) => c.durationMs) };
  } catch (err) {
    const debug = typeof process !== "undefined" && process.env && process.env.VOICE_DEBUG;
    console.error(`[voice] synthesis failed — using silent fallback: ${(err && err.message) || err}`);
    if (debug) console.error(err);
    return offlineVoiceSet(beats, performer, config);
  }
}

export function clearVoiceCache() {
  audioCache.clear();
}
