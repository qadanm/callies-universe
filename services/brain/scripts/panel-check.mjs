// services/brain — PANEL ("Green Room") check (no network).
//
// Verifies the two-comic format end to end without a key: the deterministic
// offline weave, the live best-of-N dialogue path (scripted fake model), the
// prompt builder, duo resolution, and per-turn (per-speaker) voice.
//
// Run: node scripts/panel-check.mjs

import { offlineBrain, generateRoast, buildPanelMessages, resolvePanelPerformers, resolvePerformer } from "../index.js";
import { CAR_FRAMING } from "../src/subjects/framing.js";
import { buildGradeMessages } from "../src/grading/gradeSet.js";

// Ground from model knowledge (no web) so the fake model only needs json().
process.env.BRAIN_NO_SEARCH = "1";

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };

// ---------------------------------------------------------------------------
// 1. OFFLINE panel — deterministic weave of two curated solo sets.
// ---------------------------------------------------------------------------
const p = offlineBrain({ subject: "car", format: "panel", roasterIds: ["mama", "tony"], config: { offline: true } });
assert(p.format === "panel", "offline: format is panel");
assert(p.performers && p.performers.length === 2, "offline: two performers");
assert(p.performers[0].id === "mama" && p.performers[1].id === "tony", "offline: duo order [a,b]");
const speakers = new Set(p.set.beats.map((b) => b.speaker));
assert(speakers.has("a") && speakers.has("b"), "offline: both speakers present");
assert(p.set.beats.every((b) => b.speaker === "a" || b.speaker === "b"), "offline: every beat tagged with a speaker");
assert(p.grade.pass === true, "offline: panel grade passes");
assert(p.segments.length >= 1 && p.plainText.length > 0, "offline: legacy render surface present");
assert(p.roasterName === "Mama Denièce", "offline: legacy roasterName = performer A");
const single = offlineBrain({ subject: "car", roasterId: "mama", config: { offline: true } });
assert(p.plainText !== single.plainText, "offline: panel differs from the single set");

// texts subject too (cross-subject)
const pt = offlineBrain({ subject: "texts", format: "panel", roasterIds: ["mama", "kenji"], config: { offline: true } });
assert(pt.format === "panel" && pt.performers.length === 2, "offline: texts panel works");
assert(/text|reply|read|bubble|seen|'k'/i.test(pt.plainText), "offline: texts panel reads as texting");

// ---------------------------------------------------------------------------
// 2. Duo resolution edge cases.
// ---------------------------------------------------------------------------
assert(resolvePanelPerformers([]).length === 2, "resolve: empty → 2 distinct");
const [da, db] = resolvePanelPerformers(["mama", "mama"]);
assert(da.id !== db.id, "resolve: duplicate → distinct B");

// ---------------------------------------------------------------------------
// 3. Prompt builder — two distinct comics, subject framing, dialogue ask.
// ---------------------------------------------------------------------------
const A = resolvePerformer("mama"), B = resolvePerformer("kenji");
const research = { car: { label: "2006 Chrysler PT Cruiser" }, summary: "s", runningJokes: ["j"], knownProblems: ["p"], whatPeopleSay: ["w"], sources: [] };
{
  const { system, user } = buildPanelMessages(A, B, research, ["brutal"], CAR_FRAMING, 0);
  assert(system.toLowerCase().includes("podcast"), "panel msg: podcast-submission frame");
  assert(system.includes("#1 AI tell"), "panel msg: bans the antithesis-quip construction");
  assert(system.includes("Mama Denièce") && system.includes("Kenji"), "panel msg: both hosts named");
  assert(system.includes('"a" —') && system.includes('"b" —'), "panel msg: speaker labels");
  assert(user.includes("2006 Chrysler PT Cruiser"), "panel msg: grounded in the submission");
}

// ---------------------------------------------------------------------------
// 3b. Panel-aware GRADING — the grader sees both comics + speaker-attributed lines.
// ---------------------------------------------------------------------------
{
  const panelSet = { beats: [
    { speaker: "a", type: "opener", text: "Look at this thing." },
    { speaker: "b", type: "punchline", text: "It is a car.", punch: "It is a car." },
  ] };
  const gm = buildGradeMessages(panelSet, A, research, CAR_FRAMING, [A, B]);
  assert(gm.user.includes("PODCAST HOSTS"), "grade msg: panel-aware podcast/naturalism guidance");
  assert(gm.user.includes(A.name) && gm.user.includes(B.name), "grade msg: both comics in grade context");
  assert(gm.user.includes("[A|opener]") && gm.user.includes("[B|punchline]"), "grade msg: lines attributed by speaker");
  // single grade is unchanged (no speaker → no panel guidance, single Performer line)
  const single = buildGradeMessages({ beats: [{ type: "opener", text: "x" }] }, A, research, CAR_FRAMING);
  assert(single.user.includes(`Performer: ${A.name}`) && !single.user.includes("PODCAST HOSTS"), "grade msg: single path unchanged");
}

// ---------------------------------------------------------------------------
// 4. LIVE panel — best-of-N dialogue via a scripted fake model.
// ---------------------------------------------------------------------------
function fakePanelModel() {
  return {
    id: "fake-panel",
    async search() { return { text: "PT Cruiser: retro, gutless, rental-famous.", sources: [] }; },
    async json({ schema }) {
      const props = schema.properties || {};
      if (props.beats && props.beats.items.properties.speaker) {
        return {
          title: "Mama vs Kenji",
          performanceNote: "banter",
          beats: [
            { speaker: "a", type: "opener", text: "Mm-mm. Look at this thing." },
            { speaker: "b", type: "setup", text: "…Hm." },
            { speaker: "a", type: "punchline", text: "It is a cry for help.", punch: "a cry for help" },
            { speaker: "b", type: "closer", text: "It is a car.", punch: "It is a car." },
          ],
        };
      }
      if (props.scores) return { scores: { funny: 9, human: 9, specific: 8, edge: 7, voice: 9 }, aiTells: [], reasoning: "great" };
      if (props.runningJokes) return { summary: "s", runningJokes: ["j"], knownProblems: ["p"], whatPeopleSay: ["w"] };
      throw new Error("unexpected json() call");
    },
  };
}
{
  const live = await generateRoast({
    subject: "car", format: "panel", roasterIds: ["mama", "kenji"],
    car: { year: 2006, make: "Chrysler", model: "PT Cruiser" },
    config: { _model: fakePanelModel(), candidates: 2, maxRounds: 1 },
  });
  assert(live.engine === "live", "live: engine is live");
  assert(live.format === "panel", "live: format is panel");
  assert(live.performers.length === 2, "live: two performers");
  assert(live.set.beats.some((b) => b.speaker === "a") && live.set.beats.some((b) => b.speaker === "b"), "live: both speakers in the set");
  assert(live.grade.pass === true, "live: graded + passes");
  assert(live.grade.candidates >= 2, "live: best-of-N ran");
}

// ---------------------------------------------------------------------------
if (failures.length) {
  console.error("✗ brain panel check FAILED:");
  for (const f of failures) console.error("   - " + f);
  process.exit(1);
}
console.log("✓ brain panel check passed — the Green Room works end to end:");
console.log("  · offline: deterministic two-comic weave (car + texts), distinct from single, graded");
console.log("  · live: best-of-N dialogue via the writer, both speakers, anti-cringe gate");
console.log("  · prompt names both comics + subject framing; duo resolution is robust");
