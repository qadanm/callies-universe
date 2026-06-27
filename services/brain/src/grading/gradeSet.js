// services/brain — STEP 3: GRADE the set (the anti-cringe guarantee).
//
// The grader is the milestone's most important component — it's what makes
// "never corny" real. After writing, the brain judges each set against the
// explicit rubric and only ships one that PASSES; otherwise it regenerates.
//
// The grader is prompted as a tough comedy-club booker actively HUNTING for AI
// tells — its default is skepticism. `human` is a reject axis: anything that
// smells like AI fails, no matter how clever.

import { AXES, AXIS_DESCRIPTIONS, GATES, WEIGHTS, composite, passes } from "./rubric.js";

const GRADE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["scores", "aiTells", "reasoning"],
  properties: {
    scores: {
      type: "object",
      additionalProperties: false,
      required: AXES,
      // NOTE: Anthropic structured outputs don't support numeric constraints
      // (minimum/maximum/multipleOf) — they 400. The 0–10 range is stated in the
      // grader prompt and clamped in code (clampScore) instead.
      properties: Object.fromEntries(
        AXES.map((a) => [a, { type: "integer", description: "0–10" }])
      ),
    },
    aiTells: {
      type: "array",
      items: { type: "string" },
      description: "Specific phrases or moves that smell like AI / corny / try-hard. Empty if genuinely clean.",
    },
    reasoning: { type: "string" },
  },
};

function setToText(set) {
  return set.beats.map((b) => `[${b.type}] ${b.text}`).join("\n");
}

/** Coerce a model-returned score to an integer in [0, 10]. */
function clampScore(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(10, v));
}

/**
 * Grade one set against the rubric.
 * @returns {Promise<import("../../contract").Grade>}
 */
export async function gradeSet(set, performer, research, model) {
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
    `Be specific in reasoning. If it's genuinely funny and human, say so and score high — don't be stingy`,
    `with a set that actually lands. But if it smells like AI, the "human" score must be low.`,
  ].join("\n");

  const user = [
    `Performer: ${performer.name} — ${performer.comedicIdentity}`,
    `Their comedic structure should be: ${performer.form}`,
    `Car being roasted: ${labelOf(research)}`,
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

  const judged = await model.json({
    system,
    user,
    schema: GRADE_SCHEMA,
    effort: "high",
    maxTokens: 2048,
  });

  // Clamp to a 0–10 integer per axis (the range is no longer schema-enforced).
  const scores = {};
  for (const a of AXES) scores[a] = clampScore(judged.scores ? judged.scores[a] : 0);
  const aiTells = judged.aiTells || [];
  return {
    scores,
    composite: Number(composite(scores).toFixed(2)),
    pass: passes(scores, aiTells),
    aiTells,
    reasoning: judged.reasoning || "",
    candidates: 0, // filled in by the orchestrator
    rounds: 0,
  };
}

/**
 * Pick the best candidate: prefer passing ones by composite; if none pass, the
 * highest composite overall (flagged not-passing). Each candidate is { set, grade }.
 */
export function pickBest(candidates) {
  const passing = candidates.filter((c) => c.grade.pass);
  const pool = passing.length ? passing : candidates;
  return pool.reduce((best, c) => (c.grade.composite > best.grade.composite ? c : best), pool[0]);
}

export { WEIGHTS };

function labelOf(research) {
  const c = research.car || {};
  return c.label || [c.year, c.make, c.model, c.trim].filter(Boolean).join(" ") || "car";
}
