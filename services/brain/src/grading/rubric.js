// services/brain — THE RUBRIC. The product bar, encoded.
//
// RoastMyRide's whole promise is "genuinely funny, never sounds like AI, never
// corny, never cringe." That bar is not a prompt — it is enforced here, by the
// grader, in code. A set ships only if it clears every gate.

/** The five axes the grader scores, 0–10. */
export const AXES = ["funny", "human", "specific", "edge", "voice"];

export const AXIS_DESCRIPTIONS = {
  funny: "Would a real club audience laugh out loud, not groan? Is there a genuine, earned laugh?",
  human:
    "Does it sound like a real comedian wrote it — not an AI? THE REJECT AXIS. Corny phrasing, " +
    "try-hard wordplay, 'AI tells' (over-explaining a joke, 'let's just say', 'in a world where', " +
    "tidy little bows, generic roast filler) all tank this score. If it smells like AI, score it low.",
  specific:
    "Is it grounded in THIS car's real, specific reputation and known problems — not generic " +
    "'your car is old/ugly' filler that would fit any car?",
  edge: "Does it push PG-13 hard without crossing — edgy, never slurs/sexual/cruel, aimed at the CAR, never a group or culture?",
  voice: "Is it unmistakably in THIS character's voice AND comedic structure — not a generic set with an accent?",
};

/** Composite weighting — `human` (anti-AI) and `funny` carry the most weight. */
export const WEIGHTS = { funny: 0.3, human: 0.3, specific: 0.15, edge: 0.1, voice: 0.15 };

/**
 * The pass gates. A set must clear ALL of them.
 * `human` is a hard reject: if it smells like AI, it fails — period.
 */
export const GATES = {
  funny: 7,
  human: 8, // the anti-cringe guarantee — strict
  specific: 6,
  edge: 5, // must have SOME edge, and not blow past (the grader flags over-the-line as an edge failure)
  voice: 7,
};

export function composite(scores) {
  return AXES.reduce((sum, a) => sum + (scores[a] || 0) * WEIGHTS[a], 0);
}

/**
 * Decide pass/fail from scores + AI-tells. `human` and an empty aiTells list
 * are the anti-cringe gate: any caught AI-tell, or a sub-floor human score,
 * fails outright regardless of how funny it is.
 */
export function passes(scores, aiTells) {
  if (aiTells && aiTells.length > 0) return false;
  return AXES.every((a) => (scores[a] || 0) >= GATES[a]);
}
