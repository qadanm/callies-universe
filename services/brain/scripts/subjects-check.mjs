// services/brain — SUBJECT-DISPATCH check (no network).
//
// Guards the Sprint B.5 seam:
//   1. CAR PARITY — the car-framed writer/grader prompts are BYTE-IDENTICAL to the
//      original inline templates (reproduced independently below), so the live car
//      path is provably unchanged. Persona fields cancel (both sides use the same
//      performer), so this isolates the framing substitution.
//   2. TEXTS WORKS — text-shaped offline sets (not car jokes), text-worded framing,
//      the app-facing keyed research identity, and correct subject dispatch.
//
// Run: node scripts/subjects-check.mjs

import { resolveSubjectPack, resolvePerformer, offlineBrain, generateRoast, analyzeConversation } from "../index.js";
import { buildWriteMessages } from "../src/writing/writeSet.js";
import { buildGradeMessages } from "../src/grading/gradeSet.js";
import { CAR_FRAMING, TEXTS_FRAMING } from "../src/subjects/framing.js";
import { AXES, GATES, AXIS_DESCRIPTIONS } from "../src/grading/rubric.js";
import { Roaster } from "@callies-universe/core";

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };
const has = (hay, needle, label) => assert(hay.includes(needle), `${label}: missing ${JSON.stringify(needle)}`);
const hasNot = (hay, needle, label) => assert(!hay.includes(needle), `${label}: should NOT contain ${JSON.stringify(needle)}`);

// ---------------------------------------------------------------------------
// LEGACY CAR TEMPLATES — an independent copy of the original (pre-refactor)
// prompt strings. If the car-framed builders ever drift from these, parity fails.
// ---------------------------------------------------------------------------
const LEGACY_ANGLES = [
  "Lead with the car's single most-roasted real flaw and build the set around it.",
  "Open with crowd work / a direct address, then pivot into the car's reputation.",
  "Structure it as an escalating run — each beat worse than the last, ending on the hardest line.",
  "Build around one specific, true, surprising detail from the research most people don't know.",
  "Frame the whole set through this character's signature device, start to finish.",
];
const legacyCarLabel = (research) => {
  const c = research.car || {};
  return c.label || [c.year, c.make, c.model, c.trim].filter(Boolean).join(" ") || "car";
};
function legacyCarWrite(performer, research, context, variant) {
  const angle = LEGACY_ANGLES[variant % LEGACY_ANGLES.length];
  const chips = (context || []).filter(Boolean);
  const system = [
    `You are a stand-up comedian performing a short, brutal, GENUINELY FUNNY roast of a specific car.`,
    ``,
    `WHO YOU ARE — perform as this exact comic. This is not an accent; it is a comedic identity that shapes the FORM of your set:`,
    `• Name: ${performer.name} (${performer.tag})`,
    `• Register: ${performer.register}`,
    `• Comedic identity: ${performer.comedicIdentity}`,
    `• How you build a set (FORM): ${performer.form}`,
    `• Rhythm: ${performer.rhythm}`,
    `• Your kinds of jokes: ${performer.jokeKinds.join("; ")}`,
    `• Crowd work: ${performer.crowdWork}`,
    `• Signature moves: ${performer.signatureMoves.join("; ")}`,
    `• Your catchphrase energy (don't quote it verbatim, embody it): "${performer.catchphrase}"`,
    ``,
    `HARD RULES — these are the product bar, not suggestions:`,
    `1. GENUINELY FUNNY. A real club audience laughs, not groans. No groaners, no pun-for-pun's-sake.`,
    `2. NEVER SOUNDS LIKE AI. No corny phrasing, no "in a world where", no "let's just say", no tidy "but hey", no try-hard wordplay, no explaining the joke. If a line could be a generic AI roast, cut it.`,
    `3. USE THE SPECIFIC RESEARCH. Build on this car's REAL reputation and known problems below — not generic "your car is old" filler. Specificity is the funny.`,
    `4. PG-13, pushed HARD but never over: edgy, never slurs, never sexual, never cruel about a real person. Aim every joke at the CAR, never at a group, culture, or the owner's worth. ${performer.avoid}`,
    `5. IN YOUR VOICE AND YOUR COMEDIC STRUCTURE — the set's shape must be unmistakably yours, not a generic set with your accent painted on.`,
    ``,
    `Give the set a short, punchy BIT TITLE (2–4 words) in "title" — it's the billing for tonight's set.`,
    `Write 5–8 beats: an opener, setups + punchlines, optional act-outs / crowd-work, optional a callback, and a closer. Mark the single sharpest word of a punchline in its "punch" field. Keep each beat tight — this is performed aloud.`,
  ].join("\n");
  const user = [
    `Perform your roast of the ${legacyCarLabel(research)}.`,
    ``,
    `THE REAL MATERIAL (research — ground your set in this):`,
    `Reputation: ${research.summary}`,
    research.runningJokes.length ? `Running jokes: ${research.runningJokes.join(" | ")}` : "",
    research.knownProblems.length ? `Known problems/quirks: ${research.knownProblems.join(" | ")}` : "",
    research.whatPeopleSay.length ? `What people say: ${research.whatPeopleSay.join(" | ")}` : "",
    chips.length ? `\nThe user asked for this heat/angle: ${chips.join(", ")}.` : "",
    ``,
    `Angle for this take: ${angle}`,
  ].filter(Boolean).join("\n");
  return { system, user };
}
function legacyCarGrade(set, performer, research) {
  const setToText = (s) => s.beats.map((b) => `[${b.type}] ${b.text}`).join("\n");
  const system = [
    `You are a ruthless comedy-club booker grading a roast set before it goes on stage.`,
    `The bar is brutal: "genuinely funny, never sounds like AI, never corny, never cringe."`,
    `Default to skepticism. You are actively HUNTING for AI tells and corniness — list every one you find.`,
    ``,
    `Score each axis 0–10:`,
    ...AXES.map((a) => `• ${a} (gate ${GATES[a]}): ${AXIS_DESCRIPTIONS[a]}`),
    ``,
    `AI-TELLS to catch (these tank the "human" score and belong in aiTells): over-explaining a joke,`,
    `tidy bows like "but hey, at least…", "let's just say", "in a world where", "talk about…",`,
    `groaner puns played straight, listy "not only… but also", generic roast filler that fits any car,`,
    `try-hard alliteration, fake crowd reactions written in, or anything that reads as written-by-committee.`,
    ``,
    `For EACH tell, mark its severity honestly:`,
    `• "major" = genuinely corny / try-hard / sounds-like-AI — a real problem that should sink the set.`,
    `• "minor" = a small nit that mostly lands and a real comic might still say.`,
    `Don't inflate severity to seem tough, and don't downplay a genuinely corny line. A set with only a`,
    `minor nit or two is shippable; a single major tell is not.`,
    ``,
    `Be specific in reasoning. If it's genuinely funny and human, say so and score high — don't be stingy`,
    `with a set that actually lands. But if it smells like AI, the "human" score must be low.`,
  ].join("\n");
  const user = [
    `Performer: ${performer.name} — ${performer.comedicIdentity}`,
    `Their comedic structure should be: ${performer.form}`,
    `Car being roasted: ${legacyCarLabel(research)}`,
    `Real material the set was supposed to use: ${research.summary}`,
    `  running jokes: ${research.runningJokes.join(" | ") || "(none)"}`,
    `  known problems: ${research.knownProblems.join(" | ") || "(none)"}`,
    ``,
    `THE SET:`,
    setToText(set),
    set.performanceNote ? `\n(performer note: ${set.performanceNote})` : "",
    ``,
    `Grade it. Catch every AI tell. Score honestly.`,
  ].join("\n");
  return { system, user };
}

// ---------------------------------------------------------------------------
// 1. Subject dispatch
// ---------------------------------------------------------------------------
assert(resolveSubjectPack("car").id === "car", "dispatch: 'car' → car pack");
assert(resolveSubjectPack("texts").id === "texts", "dispatch: 'texts' → texts pack");
assert(resolveSubjectPack(undefined).id === "car", "dispatch: missing → car (default)");
assert(resolveSubjectPack("nope").id === "car", "dispatch: unknown → car (default)");

// Vision transcription degrades safely (no image / no key → null), like identifyCar.
assert((await analyzeConversation({})) === null, "analyzeConversation: no image → null");
assert((await analyzeConversation({ imageDataUrl: "data:image/png;base64,iVBORw0KGgo=" })) === null, "analyzeConversation: no key → null");

// ---------------------------------------------------------------------------
// 2. CAR PROMPT PARITY — byte-identical to the original templates, across every
//    angle variant and with/without chips.
// ---------------------------------------------------------------------------
const perf = resolvePerformer("mama");
const carResearch = {
  car: { year: 2006, make: "Chrysler", model: "PT Cruiser" },
  summary: "A retro econobox.",
  runningJokes: ["rental punchline"],
  knownProblems: ["gutless engine"],
  whatPeopleSay: ["character (the bad kind)"],
  sources: [],
};
const sampleSet = { beats: [{ type: "punchline", text: "x", punch: "x" }], performanceNote: "n" };

for (let v = 0; v < LEGACY_ANGLES.length + 1; v++) {
  for (const ctx of [[], ["brutal", "the mods"]]) {
    const built = buildWriteMessages(perf, carResearch, ctx, CAR_FRAMING, v);
    const legacy = legacyCarWrite(perf, carResearch, ctx, v);
    assert(built.system === legacy.system, `car write.system byte-parity (variant ${v}, chips ${ctx.length})`);
    assert(built.user === legacy.user, `car write.user byte-parity (variant ${v}, chips ${ctx.length})`);
  }
}
{
  const built = buildGradeMessages(sampleSet, perf, carResearch, CAR_FRAMING);
  const legacy = legacyCarGrade(sampleSet, perf, carResearch);
  assert(built.system === legacy.system, "car grade.system byte-parity");
  assert(built.user === legacy.user, "car grade.user byte-parity");
}

// ---------------------------------------------------------------------------
// 3. TEXTS FRAMING — text-worded, free of car wording.
// ---------------------------------------------------------------------------
const textsResearch = { texts: { label: "a text conversation" }, summary: "dry thread", runningJokes: [], knownProblems: [], whatPeopleSay: [], sources: [] };
{
  const { system, user } = buildWriteMessages(perf, textsResearch, [], TEXTS_FRAMING, 0);
  has(system, "roast of someone's text messages.", "texts write.system");
  has(system, "Aim every joke at the TEXTS", "texts write.system");
  hasNot(system, "a specific car", "texts write.system");
  has(user, "Perform your roast of this text conversation.", "texts write.user");
}
{
  const { system, user } = buildGradeMessages(sampleSet, perf, textsResearch, TEXTS_FRAMING);
  has(system, "generic roast filler that fits any text thread,", "texts grade.system");
  has(system, "grounded in THIS conversation's real", "texts grade.system (axis override)");
  has(user, "Conversation being roasted: a text conversation", "texts grade.user");
}

// ---------------------------------------------------------------------------
// 4. TEXTS OFFLINE SETS — text-shaped, distinct, passing; DIFFERENT from car;
//    and exposing the app-facing keyed research identity.
// ---------------------------------------------------------------------------
const textsResults = [];
for (const r of Roaster.roster) {
  const t = offlineBrain({ subject: "texts", roasterId: r.id, config: { offline: true } });
  const c = offlineBrain({ subject: "car", roasterId: r.id, config: { offline: true } });
  textsResults.push(t);

  assert(t.engine === "offline", `${r.id}: texts engine offline`);
  assert(t.set && t.set.beats.length >= 3, `${r.id}: texts set has >=3 beats`);
  assert(t.grade.pass === true, `${r.id}: curated texts set should pass`);
  assert(typeof t.plainText === "string" && t.plainText.length > 0, `${r.id}: texts plainText present`);
  assert(t.segments.some((s) => s.punch), `${r.id}: texts has a punch segment`);
  assert(t.plainText !== c.plainText, `${r.id}: texts set must differ from the car set (dispatch works)`);
  // App-facing keying contract: research[subject].label must resolve (the bug the
  // review caught). Car exposes research.car; texts exposes research.texts.
  assert(t.research.texts && typeof t.research.texts.label === "string", `${r.id}: texts research must expose research.texts.label`);
  assert(c.research.car, `${r.id}: car research must expose research.car`);
}

const tTexts = textsResults.map((r) => r.plainText);
assert(new Set(tTexts).size === tTexts.length, "texts offline sets are not all distinct");
const tNotes = textsResults.map((r) => r.set.performanceNote);
assert(new Set(tNotes).size === tNotes.length, "texts performance notes are not all distinct");

const corpus = tTexts.join(" \n ").toLowerCase();
assert(/\b(text|reply|read|message|bubble|seen)\b/.test(corpus), "texts corpus should read as texting");
const carWords = corpus.match(/\b(axle|bumper|rims|rust|paint job|pt cruiser|engine)\b/);
assert(!carWords, `texts corpus leaked car wording: ${carWords && carWords[0]}`);

// ---------------------------------------------------------------------------
// 5. BILLING CONTRACT — a LIVE texts attempt with no transcript must degrade to
//    the free curated offline set (degraded=true), never bill an ungrounded roast.
//    (_model is truthy so the live path is taken; ground() throws before using it.)
// ---------------------------------------------------------------------------
{
  const origErr = console.error;
  console.error = () => {}; // mute the expected "[brain] … using offline fallback" line
  let res;
  try {
    res = await generateRoast({ subject: "texts", roasterId: "mama", config: { _model: { id: "dummy" } } });
  } finally {
    console.error = origErr;
  }
  assert(res.engine === "offline", "texts live w/o transcript → offline fallback");
  assert(res.degraded === true, "texts live w/o transcript → degraded=true (not billed)");
  assert(res.set.title === "Baby, Double-Text", "texts fallback uses the texts curated set, not car");
}

// ---------------------------------------------------------------------------
if (failures.length) {
  console.error("✗ brain subject-dispatch check FAILED:");
  for (const f of failures) console.error("   - " + f);
  process.exit(1);
}

console.log(`✓ brain subject-dispatch check passed — ${Roaster.roster.length} performers per subject.`);
console.log("  · car writer/grader prompts BYTE-IDENTICAL to the original templates (all angles ± chips)");
console.log("  · texts framing is text-worded; car wording absent");
console.log("  · texts offline sets are text-shaped, distinct, passing, differ from car, and keyed for the app");
