// services/voice — OFFLINE smoke. Verifies the silent fallback produces valid,
// correctly-timed audio for every character with no key/network, so the render
// pipeline (and CI) always runs. Run: node scripts/offline-check.mjs

import { synthesizeSet, offlineVoiceSet, voiceProfile, spokenText, estimateDurationMs } from "../index.js";
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

if (failures.length) {
  console.error("✗ voice offline smoke FAILED:");
  for (const f of failures) console.error("   - " + f);
  process.exit(1);
}
console.log(`✓ voice offline smoke passed — ${Roaster.roster.length} characters, valid timed silent clips.`);
