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

// Per-candidate angle nudges → genuine variety across best-of-N candidates
// (without changing who the character is).
const ANGLES = [
  "Lead with the car's single most-roasted real flaw and build the set around it.",
  "Open with crowd work / a direct address, then pivot into the car's reputation.",
  "Structure it as an escalating run — each beat worse than the last, ending on the hardest line.",
  "Build around one specific, true, surprising detail from the research most people don't know.",
  "Frame the whole set through this character's signature device, start to finish.",
];

/**
 * @param {object} performer  resolved performer (persona seed + comedic DNA)
 * @param {import("../../contract").CarResearch} research
 * @param {string[]} context  user heat/angle/vibe chips
 * @param {object} model
 * @param {{ variant?: number }} [opts]
 * @returns {Promise<import("../../contract").StandUpSet>}
 */
export async function writeSet(performer, research, context, model, opts = {}) {
  const variant = opts.variant ?? 0;
  const angle = ANGLES[variant % ANGLES.length];
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
    `Perform your roast of the ${labelOf(research)}.`,
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

function labelOf(research) {
  const c = research.car || {};
  return c.label || [c.year, c.make, c.model, c.trim].filter(Boolean).join(" ") || "car";
}
