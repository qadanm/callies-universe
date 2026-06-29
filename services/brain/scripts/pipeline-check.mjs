// services/brain: LIVE-ORCHESTRATION check (no network).
//
// Exercises the real research → best-of-N write → grade → pick → assemble path
// by injecting a scripted FAKE model (same thin interface as the Claude model).
// This proves the orchestration logic (research grounding, best-of-N selection,
// the anti-AI gate, regeneration when nothing passes, and result assembly)
// without an API key, so CI covers the live path's wiring, not just the offline
// canned sets.
//
// Run: node scripts/pipeline-check.mjs

import { generateRoast } from "../index.js";
import { clearCache } from "../src/cache.js";

// Web search is now OPT-IN (model-knowledge grounding is the default; see
// researchCar.js). These cases exercise the search-orchestration path (sources
// flowing through), so enable it explicitly for the test.
process.env.BRAIN_WEB_SEARCH = "1";

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };

/**
 * A scripted model. `search` returns canned research; `json` branches on which
 * step is calling (research-structuring vs set-writing vs grading) by sniffing
 * the schema/prompt, and returns scripted outputs driven by `plan`.
 */
function fakeModel(plan) {
  let writeCount = 0;
  let gradeCount = 0;
  return {
    id: "fake-model",
    async search() {
      return {
        text: "The 2006 Chrysler PT Cruiser: retro styling people love to hate, gutless engine, infamous as a rental.",
        sources: [
          { title: "Reddit thread", url: "https://example.com/r/cars/ptcruiser" },
          { title: "Owner forum", url: "https://example.com/forum/pt" },
        ],
      };
    },
    async json({ schema }) {
      // Stages are told apart by their schema's shape: runningJokes → research,
      // beats → set-writing, scores → grading. runningJokes is the canonical
      // research-detection field shared by every subject's grounding schema.
      const props = schema.properties || {};
      if (props.runningJokes) {
        // research-structuring call
        return {
          summary: "A retro-styled econobox, beloved-ironically and famously underpowered.",
          runningJokes: ["the rental-car punchline", "the gangster-paint mod"],
          knownProblems: ["gutless engine", "cheap interior plastics"],
          whatPeopleSay: ["it has character (the bad kind)"],
        };
      }
      if (props.beats) {
        // set-writing call
        const i = writeCount++;
        return {
          performanceNote: `scripted set #${i}`,
          beats: [
            { type: "opener", text: `Opener variant ${i}` },
            { type: "setup", text: "This car was born a rental." },
            { type: "punchline", text: "It is gutless and proud.", punch: "gutless" },
            { type: "closer", text: "Magnificent." },
          ],
        };
      }
      if (props.scores) {
        // grading call, driven by the plan's grade script
        const g = plan.grades[gradeCount++ % plan.grades.length];
        return g;
      }
      throw new Error("unexpected json() call");
    },
  };
}

const baseInput = {
  carPhoto: { present: true },
  car: { year: 2006, make: "Chrysler", model: "PT Cruiser" },
  roasterId: "tony",
  context: ["brutal"],
};

// --- Case 1: best-of-N picks the highest-composite PASSING candidate ---
await clearCache();
{
  const grades = [
    { scores: { funny: 7, human: 8, specific: 6, edge: 6, voice: 7 }, aiTells: [], reasoning: "ok" },
    { scores: { funny: 9, human: 9, specific: 8, edge: 7, voice: 9 }, aiTells: [], reasoning: "great" }, // best
    { scores: { funny: 8, human: 8, specific: 7, edge: 6, voice: 8 }, aiTells: [], reasoning: "good" },
  ];
  const res = await generateRoast({ ...baseInput, config: { _model: fakeModel({ grades }), candidates: 3, maxRounds: 2 } });
  assert(res.engine === "live", "case1: engine should be live");
  assert(res.grade.pass === true, "case1: chosen should pass");
  assert(res.grade.scores.funny === 9 && res.grade.scores.voice === 9, "case1: should pick the highest-composite passing candidate");
  assert(res.grade.candidates === 3, `case1: candidates count should be 3, got ${res.grade.candidates}`);
  assert(res.grade.rounds === 1, `case1: should pass in round 1, got ${res.grade.rounds}`);
  assert(res.research.runningJokes.length === 2, "case1: research material should flow through");
  assert(res.research.sources.length === 2, "case1: research sources should flow through");
  assert(res.segments.some((s) => s.punch === true), "case1: legacy segments derived with punch");
  assert(res.set.beats.length === 4, "case1: structured set assembled");
}

// --- Case 2: a MAJOR AI-tell fails the gate even with high scores → regenerates ---
await clearCache();
{
  const grades = [
    // round 1: all have a MAJOR tell → must fail despite high scores
    { scores: { funny: 9, human: 9, specific: 9, edge: 8, voice: 9 }, aiTells: [{ severity: "major", note: "'let's just say'" }], reasoning: "smells AI" },
    { scores: { funny: 9, human: 9, specific: 9, edge: 8, voice: 9 }, aiTells: [{ severity: "major", note: "tidy bow" }], reasoning: "smells AI" },
    { scores: { funny: 9, human: 9, specific: 9, edge: 8, voice: 9 }, aiTells: [{ severity: "major", note: "over-explained" }], reasoning: "smells AI" },
    // round 2: a clean pass appears
    { scores: { funny: 8, human: 8, specific: 7, edge: 6, voice: 8 }, aiTells: [], reasoning: "clean" },
    { scores: { funny: 7, human: 8, specific: 6, edge: 6, voice: 7 }, aiTells: [], reasoning: "clean" },
    { scores: { funny: 7, human: 8, specific: 6, edge: 5, voice: 7 }, aiTells: [], reasoning: "clean" },
  ];
  const res = await generateRoast({ ...baseInput, config: { _model: fakeModel({ grades }), candidates: 3, maxRounds: 2 } });
  assert(res.grade.pass === true, "case2: should find a clean pass in round 2");
  assert(res.grade.rounds === 2, `case2: should take 2 rounds, got ${res.grade.rounds}`);
  assert(res.grade.candidates === 6, `case2: should have graded 6 candidates, got ${res.grade.candidates}`);
}

// --- Case 2b: a single MINOR tell still PASSES; two minors do NOT ---
await clearCache();
{
  const grades = [
    // one minor nit + clearing scores → shippable (the severity-aware gate)
    { scores: { funny: 8, human: 8, specific: 7, edge: 6, voice: 8 }, aiTells: [{ severity: "minor", note: "slightly cute button" }], reasoning: "mostly lands" },
    // two minors → fails
    { scores: { funny: 9, human: 9, specific: 9, edge: 8, voice: 9 }, aiTells: [{ severity: "minor", note: "a" }, { severity: "minor", note: "b" }], reasoning: "nitty" },
    { scores: { funny: 9, human: 9, specific: 9, edge: 8, voice: 9 }, aiTells: [{ severity: "minor", note: "a" }, { severity: "minor", note: "b" }], reasoning: "nitty" },
  ];
  const res = await generateRoast({ ...baseInput, config: { _model: fakeModel({ grades }), candidates: 3, maxRounds: 1 } });
  assert(res.grade.pass === true, "case2b: a single minor tell with clearing scores should PASS");
  assert(res.grade.aiTells.length === 1 && res.grade.aiTells[0].severity === "minor", "case2b: should ship the single-minor-tell candidate, not a two-minor one");
}

// --- Case 3: nothing passes after all rounds → best-effort, flagged not-passing ---
await clearCache();
{
  const grades = [
    { scores: { funny: 6, human: 9, specific: 6, edge: 6, voice: 7 }, aiTells: [], reasoning: "not funny enough" }, // funny < gate 7
    { scores: { funny: 5, human: 9, specific: 6, edge: 6, voice: 7 }, aiTells: [], reasoning: "weak" },
  ];
  const res = await generateRoast({ ...baseInput, config: { _model: fakeModel({ grades }), candidates: 2, maxRounds: 2 } });
  assert(res.grade.pass === false, "case3: nothing should pass");
  assert(res.grade.candidates === 4, `case3: should exhaust 2 rounds × 2 candidates = 4, got ${res.grade.candidates}`);
  assert(res.grade.scores.funny === 6, "case3: should still pick the highest-composite candidate as best-effort");
}

if (failures.length) {
  console.error("✗ brain pipeline check FAILED:");
  for (const f of failures) console.error("   - " + f);
  process.exit(1);
}

console.log("✓ brain pipeline check passed: live orchestration verified without a key:");
console.log("  · research material + sources flow into the result");
console.log("  · best-of-N picks the highest-composite passing candidate");
console.log("  · AI-tells fail the anti-cringe gate; the brain regenerates");
console.log("  · no pass after all rounds → best-effort, flagged not-passing");
