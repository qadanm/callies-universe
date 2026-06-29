// services/voice: ElevenLabs provider (the reference TTS adapter).
//
// The swap point: implements `synthesize({ text, profile }) → { dataUrl, mime,
// durationMs }`. Requests PCM so we can compute the exact clip duration (and wrap
// it as a WAV data URL). Key-gated: no key → null (orchestrator goes offline).
// To use a different provider (OpenAI, Google, Cartesia, PlayHT), write another
// module with the same `synthesize` shape and select it in synthesizeSet.
//
// Env: ELEVENLABS_API_KEY (or config.apiKey). Per-character voice ids come from
// the voice profile (config.voices / VOICE_<ID>_ID).
//
// MODEL CHOICE: we stay on eleven_multilingual_v2 (see
// docs/voice-accents-troubleshooting.md). Eleven v3 renders designed accents more
// faithfully BUT only serves MP3 (raw PCM downgrades to an older model), so it
// breaks our exact /with-timestamps karaoke alignment and needs an ffmpeg decode.
// We judged the alignment + simplicity worth more than marginal accent gain, so the
// "ethnic-accent" cast is tabled (coming soon) and the active cast uses North-
// American / English voices that multilingual_v2 renders cleanly.

import { wordsFromAlignment } from "../alignment.js";

const PCM_RATE = 24000; // pcm_24000 → exact duration = bytes / (rate*2)
const API = "https://api.elevenlabs.io/v1/text-to-speech";

export function createElevenLabsProvider(config = {}) {
  const env = typeof process !== "undefined" && process.env ? process.env : {};
  const apiKey = config.apiKey || env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  return {
    id: "elevenlabs",
    async synthesize({ text, profile }) {
      const voiceId = profile.voiceId || env.VOICE_DEFAULT_ID;
      if (!voiceId) throw new Error("elevenlabs: no voiceId (set config.voices[id] or VOICE_<ID>_ID)");

      // /with-timestamps returns JSON: { audio_base64, alignment, normalized_alignment }.
      // We request PCM so duration stays exact, and derive word timings from the
      // character alignment (for true karaoke captions).
      const res = await fetch(`${API}/${encodeURIComponent(voiceId)}/with-timestamps?output_format=pcm_24000`, {
        method: "POST",
        headers: { "xi-api-key": apiKey, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          text,
          model_id: env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2",
          voice_settings: {
            stability: clamp01(profile.stability),
            similarity_boost: clamp01(profile.similarity ?? 0.75),
            style: clamp01(profile.expressiveness),
            use_speaker_boost: true,
          },
        }),
      });
      if (!res.ok) throw new Error(`elevenlabs ${res.status}: ${(await safeText(res)).slice(0, 200)}`);

      const json = await res.json();
      const pcm = Buffer.from(json.audio_base64 || "", "base64"); // raw 16-bit mono PCM @ 24k
      const durationMs = Math.round((pcm.length / 2 / PCM_RATE) * 1000);
      const words = wordsFromAlignment(json.alignment);
      return { dataUrl: pcmToWavDataUrl(pcm, PCM_RATE), mime: "audio/wav", durationMs, words };
    },
  };
}

function clamp01(x) {
  const n = Number(x);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0.5;
}
async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

/** Wrap raw 16-bit mono PCM in a WAV container → data URL. */
function pcmToWavDataUrl(pcm, rate) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return `data:audio/wav;base64,${Buffer.concat([header, pcm]).toString("base64")}`;
}
