// services/voice: deterministic OFFLINE fallback.
//
// No TTS key / a provider failure → silent clips whose durations match the
// estimated speaking time. They're real, valid WAV files (low sample rate to
// keep them small), so the render still produces a video with a correctly-timed
// audio track, so the whole pipeline runs with no network. Swap in a real provider
// and the same shape carries spoken audio.

import { voiceProfile, spokenText, estimateDurationMs } from "./voiceProfiles.js";

const RATE = 8000; // mono 16-bit; silence so quality is irrelevant, size minimal

/** A valid silent WAV (data URL) of the given duration. */
function silentWavDataUrl(durationMs) {
  const samples = Math.max(1, Math.round((RATE * durationMs) / 1000));
  const dataLen = samples * 2;
  const buf = Buffer.alloc(44 + dataLen); // zero-filled = silence
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataLen, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataLen, 40);
  return `data:audio/wav;base64,${buf.toString("base64")}`;
}

/** @returns {import("../contract").SynthesizedSet} */
export function offlineVoiceSet(beats, performer, config = {}) {
  const clips = (beats || []).map((beat, index) => {
    // Panel beats carry a per-line performerId; single beats use the passed performer.
    const profile = voiceProfile((beat && beat.performerId) || performer.id, config);
    const text = spokenText(beat);
    const durationMs = estimateDurationMs(text, profile.pace);
    return { index, dataUrl: silentWavDataUrl(durationMs), mime: "audio/wav", durationMs, text };
  });
  return {
    clips,
    voiced: false,
    engine: "offline",
    durationsMs: clips.map((c) => c.durationMs),
    charCount: clips.reduce((n, c) => n + ((c.text || "").length), 0),
  };
}
