// services/brain — STEP 1: research the specific car (live).
//
// This is the #1 anti-AI lever. Generic models produce "your car is old" filler;
// grounding the comedy in the SPECIFIC car's real, current reputation — the
// running jokes, the known problems, what people actually say online right now —
// gives the writer true, specific material to be funny ABOUT.
//
// Two passes:
//   1. A live web_search pass that gathers the real material (+ sources).
//   2. A cheap structuring pass that turns that into a typed CarResearch object
//      (also kept in the result metadata, so we can always see what grounded a set).
//
// Research is cached per car (see cache.js) so the whole cast can roast one car
// off a single research pass.

import { cacheKey } from "../cache.js";

const RESEARCH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "runningJokes", "knownProblems", "whatPeopleSay"],
  properties: {
    summary: { type: "string" },
    runningJokes: { type: "array", items: { type: "string" } },
    knownProblems: { type: "array", items: { type: "string" } },
    whatPeopleSay: { type: "array", items: { type: "string" } },
  },
};

export function carLabel(car) {
  if (!car) return "an unidentified car";
  if (car.label) return car.label;
  return [car.year, car.make, car.model, car.trim].filter(Boolean).join(" ") || "an unidentified car";
}

/**
 * @param {import("../../contract").CarIdentity} car
 * @param {object} model  the Claude-backed model interface
 * @param {object} cache  a research cache (see cache.js) with .memo()
 * @returns {Promise<import("../../contract").CarResearch>}
 */
export async function researchCar(car, model, cache) {
  const label = carLabel(car);
  const noSearch =
    typeof process !== "undefined" && process.env && process.env.BRAIN_NO_SEARCH;
  return cache.memo(cacheKey(car), async () => {
    // Escape hatch (BRAIN_NO_SEARCH=1): skip the web entirely and ground from
    // the model's own knowledge. Guaranteed memory-bounded — one small json call,
    // no server tools, no page content. Less current than live search, but safe.
    if (noSearch) {
      const known = await model.json({
        system:
          "You are a comedy writer's researcher with deep car knowledge. From what " +
          "you already know (no web), give the REAL, SPECIFIC reputation of this car: " +
          "its running jokes, genuine known problems/quirks, and what people say about " +
          "owning one. Specific and true — never generic 'it's old' filler. Aim at the " +
          "car, never a group of people.",
        user: `Car: ${label}. Summarize its real reputation, running jokes, known problems, and what people say.`,
        schema: RESEARCH_SCHEMA,
        effort: "low",
        thinking: false,
        maxTokens: 2048,
      });
      return {
        car,
        summary: known.summary,
        runningJokes: known.runningJokes || [],
        knownProblems: known.knownProblems || [],
        whatPeopleSay: known.whatPeopleSay || [],
        sources: [],
        defaulted: !!car?._defaulted,
        offline: true, // model-only knowledge, no live web search — flag it honestly
      };
    }

    // --- Pass 1: live search for real, current material ---
    const { text, sources } = await model.search({
      system:
        "You are a comedy writer's researcher. You dig up the REAL, SPECIFIC, " +
        "CURRENT reputation of a particular car: the running jokes people make " +
        "about it, its genuine known problems and quirks, the culture and " +
        "stereotypes around who drives it, and what people actually say about it " +
        "online right now. You want true, specific, citable material a comedian " +
        "could build a bit on — never generic 'it's an old car' filler. Aim at " +
        "the car and its reputation, never at any group of people.",
      user:
        `Research the ${label}. Search the web for: its running jokes and memes, ` +
        `its real reliability problems and design quirks, its reputation and the ` +
        `stereotypes about it, and recent things people say about owning/driving ` +
        `one. Pull specific, true details (not vague generalities). Then write a ` +
        `tight briefing of the funniest TRUE material — the stuff a stand-up could ` +
        `actually use. Keep it to a handful of focused searches.`,
      maxTokens: 3000,
      maxUses: 4,
    });

    // --- Pass 2: structure the briefing into typed research ---
    const structured = await model.json({
      system:
        "Turn this car-research briefing into structured material for a comedy " +
        "writer. Keep only SPECIFIC, true points — cut anything generic. Each list " +
        "item is one crisp, concrete detail.",
      user:
        `Car: ${label}\n\nResearch briefing:\n${text}\n\n` +
        `Extract: a one-paragraph summary of the car's real reputation; the running ` +
        `jokes; the known problems/quirks; and a few "what people say" lines.`,
      schema: RESEARCH_SCHEMA,
      effort: "low",
      thinking: false,
      maxTokens: 2048,
    });

    return {
      car,
      summary: structured.summary,
      runningJokes: structured.runningJokes || [],
      knownProblems: structured.knownProblems || [],
      whatPeopleSay: structured.whatPeopleSay || [],
      sources,
      defaulted: !!car?._defaulted,
      offline: false,
    };
  });
}
