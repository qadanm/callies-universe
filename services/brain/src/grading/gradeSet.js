// services/brain — STEP 3: GRADE the set (the anti-cringe guarantee).
//
// The grader is the milestone's most important component — it's what makes
// "never corny" real. After writing, the brain judges each set against the
// explicit rubric and only ships one that PASSES; otherwise it regenerates.
//
// The grader is prompted as a tough comedy-club booker actively HUNTING for AI
// tells — its default is skepticism. `human` is a reject axis: anything that
// smells like AI fails, no matter how clever.

import { AXES, GATES, WEIGHTS, composite, passes } from "./rubric.js";
import { CAR_FRAMING } from "../subjects/framing.js";

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
      description: "Specific phrases or moves that smell like AI / corny / try-hard. Empty if genuinely clean.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["severity", "note"],
        properties: {
          severity: {
            type: "string",
            enum: ["minor", "major"],
            description: "major = genuinely corny/try-hard/sounds-like-AI, a real problem that should sink the set. minor = a small nit that mostly lands.",
          },
          note: { type: "string" },
        },
      },
    },
    reasoning: { type: "string" },
  },
};

function setToText(set) {
  // Panel beats carry a speaker → attribute each line so the grader can judge
  // whether the two voices are actually distinct. Single beats have no speaker
  // (output unchanged).
  return set.beats
    .map((b) => (b.speaker ? `[${b.speaker.toUpperCase()}|${b.type}] ${b.text}` : `[${b.type}] ${b.text}`))
    .join("\n");
}

/** Coerce a model-returned score to an integer in [0, 10]. */
function clampScore(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(10, v));
}

/**
 * Build the {system, user} grading messages. Pure (no model call) so it can be
 * asserted byte-for-byte in tests. With CAR_FRAMING this reproduces the original
 * car grading prompt exactly (see scripts/subjects-check.mjs).
 *
 * @param {object} set
 * @param {object} performer  the single performer (or A, for a panel)
 * @param {object} research
 * @param {import("../subjects/framing.js").SubjectFraming} framing
 * @param {object[]} [performers]  for a panel: both performers [A, B] — the grader
 *   then judges that BOTH voices land and are distinct. Omitted → single (unchanged).
 * @returns {{ system: string, user: string }}
 */
export function buildGradeMessages(set, performer, research, framing, performers) {
  const axisDescriptions = framing.axisDescriptions;
  const system = [
    `You are a ruthless comedy-club booker grading a roast set before it goes on stage.`,
    `The bar is brutal: "genuinely funny, never sounds like AI, never corny, never cringe."`,
    `Default to skepticism. You are actively HUNTING for AI tells and corniness — list every one you find.`,
    ``,
    `Score each axis 0–10:`,
    ...AXES.map((a) => `• ${a} (gate ${GATES[a]}): ${axisDescriptions[a]}`),
    ``,
    `AI-TELLS to catch (these tank the "human" score and belong in aiTells): over-explaining a joke,`,
    `tidy bows like "but hey, at least…", "let's just say", "in a world where", "talk about…",`,
    `groaner puns played straight, listy "not only… but also", generic roast filler that fits any ${framing.fillerNoun},`,
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

  const isPanel = Array.isArray(performers) && performers.length === 2;
  const performerBlock = isPanel
    ? [
        `This is two PODCAST HOSTS reacting to a listener-submitted photo — a real conversation, NOT a performed bit. Each line is labeled by speaker [A]/[B].`,
        `It should sound like two people actually talking, where the funny is sparse and FOUND in the truth, not a stream of written jokes.`,
        `Score "human" LOW (it sounds like AI) for: the "it doesn't X, it Y's" / "that's not a Z, that's a W" antithesis-quip construction (the #1 tell); back-to-back zingers / every line a punchline; puns or tidy buttons; and forced verbal tics or written-out sounds ("mm-mm-MM", "ok ok ok", "ohh", "no no no", repeated stammers). Reward natural, specific, conversational lines in real words.`,
        `Judge that BOTH voices land AND are DISTINCT — A reads as A, B as B, never interchangeable:`,
        `  A — ${performers[0].name}: ${performers[0].comedicIdentity} (form: ${performers[0].form})`,
        `  B — ${performers[1].name}: ${performers[1].comedicIdentity} (form: ${performers[1].form})`,
      ]
    : [
        `Performer: ${performer.name} — ${performer.comedicIdentity}`,
        `Their comedic structure should be: ${performer.form}`,
      ];
  const user = [
    ...performerBlock,
    `${framing.gradeSubjectWord} being roasted: ${framing.gradeLabel(research)}`,
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

/**
 * Grade one set against the rubric.
 * @param {{ framing?: object }} [opts]
 * @returns {Promise<import("../../contract").Grade>}
 */
export async function gradeSet(set, performer, research, model, opts = {}) {
  const framing = opts.framing || CAR_FRAMING;
  const { system, user } = buildGradeMessages(set, performer, research, framing, opts.performers);

  const judged = await model.json({
    system,
    user,
    schema: GRADE_SCHEMA,
    effort: "low",
    maxTokens: 1536,
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
