// services/brain — the ORCHESTRATOR. Fulfils generateRoast(input) → RoastResult.
//
// Order of operations (this is the product's soul):
//   1. Research the specific car, live (the #1 anti-AI lever).
//   2. Write a stand-up set shaped to the performing character.
//   3. Grade it against the rubric; ship the best that PASSES; regenerate if
//      none do (best-of-N, not best-of-50).
//
// No API key (or a live failure) → the deterministic offline brain, so the app
// and CI run without any network. The signature never changes, so RoastMyRide's
// swap point stays a one-liner.

import { createClaudeModel } from "./model/claude.js";
import { resolvePerformer } from "./persona.js";
import { researchCar } from "./research/researchCar.js";
import { writeSet } from "./writing/writeSet.js";
import { gradeSet, pickBest } from "./grading/gradeSet.js";
import { buildResult } from "./assemble.js";
import { offlineBrain } from "./fallback/offlineBrain.js";

// A representative, very-roastable default until photo-ID lands. Heavily memed,
// so the live path has real material to ground against even in the app.
const DEFAULT_CAR = { year: 2006, make: "Chrysler", model: "PT Cruiser", _defaulted: true };

function normalizeCar(input) {
  return input.car || input.carPhoto?.identified || { ...DEFAULT_CAR };
}

/**
 * @param {import("../contract").RoastInput} input
 * @returns {Promise<import("../contract").RoastResult>}
 */
export async function generateRoast(input) {
  const config = input.config || {};
  // Explicit offline (tests, preview, CI) resolves instantly.
  if (config.offline) return offlineBrain(input);

  // `config._model` is a test seam: inject a model implementing the same thin
  // interface to exercise the full live orchestration without a network call.
  const model = config._model || (await createClaudeModel(config));
  if (!model) {
    // No key / SDK at app runtime → offline path, but hold a brief "cooking"
    // beat so the loading screen reads as a real generation (the live path
    // takes real seconds; this keeps the UX coherent).
    await sleep(1300);
    return offlineBrain(input);
  }

  const started = Date.now();
  try {
    const performer = resolvePerformer(input.roasterId);
    const car = normalizeCar(input);
    const research = await researchCar(car, model);

    const N = clamp(config.candidates ?? 3, 1, 6);
    const maxRounds = clamp(config.maxRounds ?? 2, 1, 4);

    let allCandidates = [];
    let rounds = 0;
    let chosen = null;

    for (let round = 0; round < maxRounds; round++) {
      rounds = round + 1;
      // Generate N candidates in parallel, then grade them in parallel.
      const sets = await Promise.all(
        Array.from({ length: N }, (_, i) =>
          writeSet(performer, research, input.context, model, { variant: round * N + i })
        )
      );
      const graded = await Promise.all(
        sets.map(async (set) => ({ set, grade: await gradeSet(set, performer, research, model) }))
      );
      allCandidates = allCandidates.concat(graded);

      if (graded.some((c) => c.grade.pass)) {
        chosen = pickBest(allCandidates);
        break; // a passing set exists — ship the best of them
      }
    }

    if (!chosen) chosen = pickBest(allCandidates); // none passed → best effort, flagged not-passing

    chosen.grade.candidates = allCandidates.length;
    chosen.grade.rounds = rounds;

    return buildResult({
      performer,
      research,
      set: chosen.set,
      grade: chosen.grade,
      engine: "live",
      durationMs: Date.now() - started,
    });
  } catch (err) {
    // Network / API failure mid-flight → don't break the app; fall back offline.
    const debug = typeof process !== "undefined" && process.env && process.env.BRAIN_DEBUG;
    if (debug) console.error("[brain] live path failed, falling back:", err);
    return offlineBrain(input, { degraded: true });
  }
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n | 0));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
