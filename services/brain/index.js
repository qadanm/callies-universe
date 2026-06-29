// @callies-universe/brain — public API.
//
// The contract entry is `generateRoast` (see contract.d.ts). It satisfies the
// same signature RoastMyRide's mock did, so the app's swap point stays one line:
//
//   // apps/roastmyride-app/src/services/roast.js
//   export { generateRoast } from "@callies-universe/brain";
//
// The remaining exports are for tooling (the offline smoke + the cross-character
// demo harness) — the app only needs generateRoast.

export { generateRoast } from "./src/generateRoast.js";

// Photo car identification (vision) — names the user's actual car for the research.
export { identifyCar } from "./src/identify.js";

// Offline path (used by the app's fallback story, the CI smoke, and demos).
export { offlineBrain } from "./src/fallback/offlineBrain.js";

// Pieces the demo harness + tests reason about.
export { createClaudeModel } from "./src/model/claude.js";
export { researchCar } from "./src/research/researchCar.js";
export { writeSet } from "./src/writing/writeSet.js";
export { gradeSet, pickBest } from "./src/grading/gradeSet.js";
export { resolvePerformer, allPerformers, COMEDIC_PROFILES } from "./src/persona.js";
// Subject packs — the per-subject grounding + offline sets + prompt framing.
export { resolveSubjectPack } from "./src/subjects/index.js";
export { GATES, WEIGHTS, AXES, composite, passes } from "./src/grading/rubric.js";
export { buildResult } from "./src/assemble.js";
// Research cache — clearCache busts the default; createResearchCache lets you
// inject a shared/persistent store (Redis/Upstash/Supabase) via config.researchCache.
export { clearCache, createResearchCache, defaultResearchCache, cacheKey } from "./src/cache.js";
