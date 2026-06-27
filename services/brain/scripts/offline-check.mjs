// services/brain — OFFLINE smoke (the CI half of the acceptance test).
//
// Runs the brain's offline path (no API key, no network) across the whole cast
// and asserts the EVOLVED contract holds: structured graded sets, the legacy
// render surface preserved, valid Callie reaction states, and — crucially —
// that different characters produce genuinely DIFFERENT sets (not reskins).
//
// This keeps `pnpm verify` green with no key. Run: node scripts/offline-check.mjs

import { generateRoast } from "../index.js";
import { Roaster } from "@callies-universe/core";

const CALLIE_STATES = new Set([
  "idle", "curious", "cooking", "delighted", "savage", "comfort", "celebrating", "empty", "error",
]);

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };

const car = { year: 2006, make: "Chrysler", model: "PT Cruiser" };
const results = [];

for (const r of Roaster.roster) {
  // offline: true forces the deterministic fallback regardless of environment.
  const res = await generateRoast({
    carPhoto: { present: true },
    car,
    roasterId: r.id,
    context: ["brutal"],
    config: { offline: true },
  });
  results.push(res);

  // --- evolved contract shape ---
  assert(res.engine === "offline", `${r.id}: engine should be offline, got ${res.engine}`);
  assert(res.set && Array.isArray(res.set.beats) && res.set.beats.length >= 3, `${r.id}: set must have >=3 beats`);
  assert(typeof res.set.title === "string" && res.set.title.length > 0, `${r.id}: set.title (the bit) missing`);
  assert(res.performer && res.performer.comedicIdentity, `${r.id}: performer.comedicIdentity missing`);
  assert(res.grade && typeof res.grade.composite === "number", `${r.id}: grade.composite missing`);
  assert(res.grade.pass === true, `${r.id}: curated offline set should pass`);
  assert(Array.isArray(res.research.sources), `${r.id}: research.sources missing`);

  // --- legacy render surface preserved ---
  assert(Array.isArray(res.segments) && res.segments.length >= 1, `${r.id}: segments missing`);
  assert(typeof res.plainText === "string" && res.plainText.length > 0, `${r.id}: plainText missing`);
  assert(res.segments.some((s) => s.punch), `${r.id}: at least one punch segment expected`);

  // --- Callie reaction by name, from the core 9 ---
  assert(CALLIE_STATES.has(res.reaction), `${r.id}: reaction "${res.reaction}" not a core state`);
  assert(res.reactionSequence.every((s) => CALLIE_STATES.has(s)), `${r.id}: reactionSequence has a non-core state`);

  // --- name comes from core, not duplicated ---
  assert(res.roasterName === r.name, `${r.id}: roasterName "${res.roasterName}" != core "${r.name}"`);
}

// --- cross-character difference: every set's plainText must be distinct ---
const texts = results.map((r) => r.plainText);
assert(new Set(texts).size === texts.length, "offline sets are not all distinct across characters");

// --- difference is structural, not just wording: performance notes differ too ---
const notes = results.map((r) => r.set.performanceNote);
assert(new Set(notes).size === notes.length, "performance notes (set FORM) are not distinct across characters");

if (failures.length) {
  console.error("✗ brain offline smoke FAILED:");
  for (const f of failures) console.error("   - " + f);
  process.exit(1);
}

console.log(`✓ brain offline smoke passed — ${results.length} characters, all distinct sets.`);
console.log(`  · evolved contract (set/performer/research/grade) intact`);
console.log(`  · legacy render surface (segments/plainText/reaction) preserved`);
console.log(`  · reactions are valid core Callie states`);
