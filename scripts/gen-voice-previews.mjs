// Generate the bundled voice-preview clips.
//
// For each active voice, synthesize its one funny car line with ElevenLabs and
// write apps/roastmyride-app/public/voices/<id>.mp3. Those static files are what
// the in-app "Hear voice" button plays (services/voicePreview.js): real voice,
// instant, offline. Re-run this whenever the lines or voice ids change.
//
// Needs (same env convention as the render backend):
//   ELEVENLABS_API_KEY           your ElevenLabs key
//   VOICE_REGINALD_ID / VOICE_TONY_ID / VOICE_MAMA_ID / VOICE_BUFORD_ID
//   (or VOICE_DEFAULT_ID as a shared fallback)
//
// Run:  ELEVENLABS_API_KEY=... VOICE_MAMA_ID=... node scripts/gen-voice-previews.mjs
//
// The lines mirror Roaster.roster[*].phrase in core/src/components/cast/Roaster.jsx
// (kept in sync by hand so this script has no JSX import).

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../apps/roastmyride-app/public/voices");

// id → the line spoken in the preview (a dry, real car joke; no filler).
const LINES = {
  reginald: "Here we observe a car admired chiefly by the person selling it.",
  tony: "You paid for this. With money. That you earned.",
  mama: "It's a beautiful car, baby. For somebody who gave up.",
  buford: "That is a whole lot of car for a fella with nowhere to be.",
};

// Per-voice delivery: keep it natural. High stability = less sing-song / less
// "trying too hard"; modest style so it reads like a person, not a performance.
const SETTINGS = {
  stability: 0.55,
  similarity_boost: 0.8,
  style: 0.15,
  use_speaker_boost: true,
};

const API_KEY = process.env.ELEVENLABS_API_KEY;
const MODEL = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

function voiceIdFor(id) {
  return process.env[`VOICE_${id.toUpperCase()}_ID`] || process.env.VOICE_DEFAULT_ID || null;
}

async function synth(id, text, voiceId) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": API_KEY, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS }),
    }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${detail.slice(0, 200)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const path = resolve(OUT_DIR, `${id}.mp3`);
  writeFileSync(path, buf);
  return { path, bytes: buf.length };
}

async function main() {
  if (!API_KEY) {
    console.error("Missing ELEVENLABS_API_KEY. See the header of this file.");
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  for (const [id, text] of Object.entries(LINES)) {
    const voiceId = voiceIdFor(id);
    if (!voiceId) {
      console.warn(`- ${id}: SKIP (no VOICE_${id.toUpperCase()}_ID / VOICE_DEFAULT_ID)`);
      continue;
    }
    try {
      const { bytes } = await synth(id, text, voiceId);
      console.log(`✓ ${id}: ${(bytes / 1024).toFixed(0)} KB  "${text}"`);
      ok++;
    } catch (e) {
      console.error(`✗ ${id}: ${e.message}`);
    }
  }
  console.log(`\n${ok}/${Object.keys(LINES).length} clips written to ${OUT_DIR}`);
  if (!ok) process.exit(1);
}

main();
