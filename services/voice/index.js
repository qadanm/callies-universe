// @callies-universe/voice public API.
//
// synthesizeSet(beats, performer, config) → SynthesizedSet (per-beat clips with
// real durations). Swappable provider (ElevenLabs reference) + deterministic
// silent fallback. Runs server-side; the render service calls it before
// rendering and feeds clips + durations into the Remotion composition.

export { synthesizeSet, clearVoiceCache } from "./src/synthesizeSet.js";
export { offlineVoiceSet } from "./src/offlineVoice.js";
export { voiceProfile, spokenText, estimateDurationMs } from "./src/voiceProfiles.js";
export { createElevenLabsProvider } from "./src/provider/elevenlabs.js";
