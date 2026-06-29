// services/brain — STEP 2: write a stand-up set, SHAPED to the performer.
//
// The core requirement: each character writes a DIFFERENT set — not the same
// jokes in a different accent. The set's structure, rhythm, kinds of jokes,
// crowd work, and bits are driven by the performer's comedic DNA (persona.js),
// built from the SPECIFIC car research (researchCar.js).
//
// Abu Omar constructs a set the way Abu Omar does stand-up; Mama Denièce builds
// hers in her rhythm; Kenji's is devastating minimalism. The persona's `form`,
// `rhythm`, `jokeKinds`, `crowdWork`, and `signatureMoves` drive the SHAPE; the
// car research supplies the material.
//
// Subject-specific wording (what's being roasted, the per-take angles) comes from
// the pack's `framing` (see ../subjects/framing.js); everything else is shared.
// `framing` defaults to CAR_FRAMING so direct callers stay unchanged.

import { CAR_FRAMING } from "../subjects/framing.js";

const SET_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "beats", "performanceNote"],
  properties: {
    title: { type: "string", description: "A short, punchy bit title (2–4 words), e.g. \"Baby, No.\"" },
    beats: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "text"],
        properties: {
          type: {
            type: "string",
            enum: ["opener", "setup", "punchline", "act-out", "crowd-work", "callback", "tag", "closer"],
          },
          text: { type: "string" },
          punch: { type: "string" },
        },
      },
    },
    performanceNote: { type: "string" },
  },
};

/**
 * Build the {system, user} messages for one set-writing call. Pure (no model
 * call) so it can be asserted byte-for-byte in tests. With CAR_FRAMING this
 * reproduces the original car prompt exactly (see scripts/subjects-check.mjs).
 *
 * @param {object} performer  resolved performer (persona seed + comedic DNA)
 * @param {object} research   the grounding material (subject-neutral shape)
 * @param {string[]} context  user heat/angle/vibe chips
 * @param {import("../subjects/framing.js").SubjectFraming} framing
 * @param {number} variant    best-of-N take index (selects the angle)
 * @returns {{ system: string, user: string }}
 */
export function buildWriteMessages(performer, research, context, framing, variant = 0) {
  const angle = framing.angles[variant % framing.angles.length];
  const chips = (context || []).filter(Boolean);

  const system = [
    `You are a stand-up comedian performing a short, brutal, GENUINELY FUNNY roast of ${framing.roastTarget}.`,
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
    `3. USE THE SPECIFIC RESEARCH. Build on ${framing.possessive} REAL reputation and known problems below — not generic "${framing.genericFiller}" filler. Specificity is the funny.`,
    `4. PG-13, pushed HARD but never over: edgy, never slurs, never sexual, never cruel about a real person. Aim every joke at ${framing.aimTarget}, never at a group, culture, or the ${framing.ownerNoun}'s worth. ${performer.avoid}`,
    `5. IN YOUR VOICE AND YOUR COMEDIC STRUCTURE — the set's shape must be unmistakably yours, not a generic set with your accent painted on.`,
    ``,
    `Give the set a short, punchy BIT TITLE (2–4 words) in "title" — it's the billing for tonight's set.`,
    `Write 5–8 beats: an opener, setups + punchlines, optional act-outs / crowd-work, optional a callback, and a closer. Mark the single sharpest word of a punchline in its "punch" field. Keep each beat tight — this is performed aloud.`,
  ].join("\n");

  const user = [
    `Perform your roast of ${framing.subjectPhrase(research)}.`,
    ``,
    `THE REAL MATERIAL (research — ground your set in this):`,
    `Reputation: ${research.summary}`,
    research.runningJokes.length ? `Running jokes: ${research.runningJokes.join(" | ")}` : "",
    research.knownProblems.length ? `Known problems/quirks: ${research.knownProblems.join(" | ")}` : "",
    research.whatPeopleSay.length ? `What people say: ${research.whatPeopleSay.join(" | ")}` : "",
    chips.length ? `\nThe user asked for this heat/angle: ${chips.join(", ")}.` : "",
    ``,
    `Angle for this take: ${angle}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { system, user };
}

/**
 * @param {object} performer  resolved performer (persona seed + comedic DNA)
 * @param {object} research   the grounding material (subject-neutral shape)
 * @param {string[]} context  user heat/angle/vibe chips
 * @param {object} model
 * @param {{ variant?: number, framing?: object }} [opts]
 * @returns {Promise<import("../../contract").StandUpSet>}
 */
export async function writeSet(performer, research, context, model, opts = {}) {
  const framing = opts.framing || CAR_FRAMING;
  const { system, user } = buildWriteMessages(performer, research, context, framing, opts.variant ?? 0);

  const set = await model.json({
    system,
    user,
    schema: SET_SCHEMA,
    // Low effort + a little thinking keeps the voice sharp without the token cost
    // of high effort. (effort/thinking apply only on models that support them.)
    effort: "low",
    thinking: true,
    maxTokens: 3000,
  });
  return {
    title: set.title || "Tonight's Set",
    beats: set.beats || [],
    performanceNote: set.performanceNote || "",
  };
}
