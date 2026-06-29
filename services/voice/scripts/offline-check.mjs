// services/voice: OFFLINE smoke. Verifies the silent fallback produces valid,
// correctly-timed audio for every character with no key/network, so the render
// pipeline (and CI) always runs. Run: node scripts/offline-check.mjs

import { synthesizeSet, offlineVoiceSet, voiceProfile, spokenText, estimateDurationMs } from "../index.js";
import { wordsFromAlignment } from "../src/alignment.js";
import { Roaster } from "@callies-universe/core";

const failures = [];
const assert = (c, m) => { if (!c) failures.push(m); };

const beats = [
  { type: "setup", text: "Mm-mm-MM. Baby. Come here." },
  { type: "crowd", text: "You see this paint? You SEE it?" },
  { type: "punch", text: "This paint job is ", punch: "a cry for help", tail: ", and I'm answering." },
  { type: "closer", text: "I say this with love… ", punch: "no.", tail: "" },
];

for (const r of Roaster.roster) {
  // config.offline forces the silent path (also the no-key default).
  const out = await synthesizeSet(beats, { id: r.id, name: r.name }, { offline: true });
  assert(out.voiced === false && out.engine === "offline", `${r.id}: should be offline/silent`);
  assert(out.clips.length === beats.length, `${r.id}: one clip per beat`);
  assert(out.durationsMs.length === beats.length, `${r.id}: durations per beat`);
  for (const c of out.clips) {
    assert(c.durationMs > 0, `${r.id}[${c.index}]: positive duration`);
    assert(/^data:audio\/wav;base64,/.test(c.dataUrl), `${r.id}[${c.index}]: valid wav data url`);
    // valid RIFF/WAVE header?
    const head = Buffer.from(c.dataUrl.split(",")[1], "base64").subarray(0, 12).toString("latin1");
    assert(head.startsWith("RIFF") && head.includes("WAVE"), `${r.id}[${c.index}]: RIFF/WAVE header`);
  }
}

// determinism: same input → same durations
const a = offlineVoiceSet(beats, { id: "mama", name: "Mama" });
const b = offlineVoiceSet(beats, { id: "mama", name: "Mama" });
assert(JSON.stringify(a.durationsMs) === JSON.stringify(b.durationsMs), "offline durations deterministic");

// pace shapes duration: Kenji (slow) longer than Tony (fast) for the same line
const line = "This is one identical test line for pace comparison.";
const kenji = estimateDurationMs(line, voiceProfile("kenji").pace);
const tony = estimateDurationMs(line, voiceProfile("tony").pace);
assert(kenji > tony, `pace: kenji(${kenji}) should be slower than tony(${tony})`);

// spokenText flattens lead+punch+tail
assert(spokenText({ text: "a ", punch: "b", tail: " c" }) === "a b c", "spokenText flattens");

// word-level alignment → word timings (the karaoke path; offline clips have none → fallback)
assert(wordsFromAlignment(null) === undefined, "alignment: null → undefined (fallback)");
const al = {
  characters: ["H", "i", " ", "y", "o", "u"],
  character_start_times_seconds: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5],
  character_end_times_seconds: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
};
const w = wordsFromAlignment(al);
assert(Array.isArray(w) && w.length === 2, "alignment: 2 words from 'Hi you'");
assert(w[0].text === "Hi" && w[0].startMs === 0 && w[0].endMs === 200, "alignment: word 0 = Hi [0,200]");
assert(w[1].text === "you" && w[1].startMs === 300 && w[1].endMs === 600, "alignment: word 1 = you [300,600]");
assert(offlineVoiceSet(beats, { id: "mama", name: "Mama" }).clips.every((c) => c.words === undefined), "offline clips carry no word timings (fallback)");

// PANEL: a per-beat `performerId` routes each line to ITS speaker's voice (the
// Green Room format). Same text, different speaker → different pace → different
// duration, proving per-turn voice rather than one voice for the whole set.
const sameLine = "This is one identical line for the panel pace test.";
const panelBeats = [
  { type: "setup", text: sameLine, performerId: "kenji" }, // slow
  { type: "setup", text: sameLine, performerId: "tony" },  // fast
];
const pv = offlineVoiceSet(panelBeats, { id: "mama", name: "Mama" });
assert(pv.clips.length === 2, "panel voice: one clip per turn");
assert(pv.durationsMs[0] > pv.durationsMs[1], `panel voice: per-turn performerId routes voice (kenji ${pv.durationsMs[0]} > tony ${pv.durationsMs[1]})`);

if (failures.length) {
  console.error("✗ voice offline smoke FAILED:");
  for (const f of failures) console.error("   - " + f);
  process.exit(1);
}
console.log(`✓ voice offline smoke passed: ${Roaster.roster.length} characters, valid timed silent clips.`);
