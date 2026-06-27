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

      const res = await fetch(`${API}/${encodeURIComponent(voiceId)}?output_format=pcm_24000`, {
        method: "POST",
        headers: { "xi-api-key": apiKey, "content-type": "application/json", accept: "audio/pcm" },
        body: JSON.stringify({
          text,
          model_id: env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2",
          voice_settings: {
            stability: clamp01(profile.stability),
            similarity_boost: 0.75,
            style: clamp01(profile.expressiveness),
            use_speaker_boost: true,
          },
        }),
      });
      if (!res.ok) throw new Error(`elevenlabs ${res.status}: ${(await safeText(res)).slice(0, 200)}`);

      const pcm = Buffer.from(await res.arrayBuffer()); // raw 16-bit mono PCM @ 24k
      const durationMs = Math.round((pcm.length / 2 / PCM_RATE) * 1000);
      return { dataUrl: pcmToWavDataUrl(pcm, PCM_RATE), mime: "audio/wav", durationMs };
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
