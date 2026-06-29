// services/voice — ElevenLabs provider (the reference TTS adapter).
//
// The swap point: implements `synthesize({ text, profile }) → { dataUrl, mime,
// durationMs }`. Requests PCM so we can compute the exact clip duration (and wrap
// it as a WAV data URL). Key-gated: no key → null (orchestrator goes offline).
// To use a different provider (OpenAI, Google, Cartesia, PlayHT), write another
// module with the same `synthesize` shape and select it in synthesizeSet.
//
// Env: ELEVENLABS_API_KEY (or config.apiKey). Per-character voice ids come from
// the voice profile (config.voices / VOICE_<ID>_ID).

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
          // Voices are DESIGNED on Eleven v3, so we must synthesize on v3 too —
          // re-rendering a designed voice on an older model (multilingual_v2)
          // flattens its accent toward a neutral American baseline. v3 supports
          // this /with-timestamps + pcm_24000 path (audio + word alignment).
          model_id: env.ELEVENLABS_MODEL_ID || "eleven_v3",
          voice_settings: {
            stability: clamp01(profile.stability),
            // similarity_boost is what keeps the OUTPUT faithful to the designed
            // voice — including its accent. Too low and a distinctively-accented
            // voice drifts toward the model's neutral English baseline. Default
            // high; per-profile override via profile.similarity.
            similarity_boost: clamp01(profile.similarity ?? 0.9),
            // style (exaggeration) above ~0.5 trades voice-similarity for "more
            // style" and flattens accents toward neutral American — so we keep it
            // moderate. The character's BIG accent lives in the designed voice
            // and the written word choice, not in cranking this knob.
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
