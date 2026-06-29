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
import { resolvePerformer, resolvePanelPerformers } from "./persona.js";
import { resolveSubjectPack } from "./subjects/index.js";
import { defaultResearchCache, createResearchCache } from "./cache.js";
import { writeSet } from "./writing/writeSet.js";
import { writePanel } from "./writing/writePanel.js";
import { gradeSet, pickBest } from "./grading/gradeSet.js";
import { buildResult } from "./assemble.js";
import { offlineBrain } from "./fallback/offlineBrain.js";

/**
 * @param {import("../contract").RoastInput} input
 * @returns {Promise<import("../contract").RoastResult>}
 */
export async function generateRoast(input) {
  const config = input.config || {};
  // Explicit offline (tests, preview, CI) resolves instantly.
  if (config.offline) return offlineBrain(input);

  // `config._model` is a test seam: inject one model (used for every stage) to
  // exercise the full live orchestration without a network call. Otherwise we
  // get the cost-tiered pair { write, utility }.
  const models = config._model
    ? { write: config._model, utility: config._model }
    : await createClaudeModel(config);
  if (!models) {
    // No key / SDK at app runtime → offline path, but hold a brief "cooking"
    // beat so the loading screen reads as a real generation (the live path
    // takes real seconds; this keeps the UX coherent).
    await sleep(1300);
    return offlineBrain(input);
  }

  // Resolve the research cache. Tests with an injected model use a hermetic
  // in-memory cache (never touches disk); real runs reuse the persistent default
  // (filesystem, or an injected store via config.researchCache).
  const cache = config._model
    ? createResearchCache({ cacheMode: "memory" })
    : defaultResearchCache(config);

  // The subject pack owns everything subject-specific: how to ground the roast,
  // the offline sets, and the prompt framing. Unknown/missing subject → car.
  const pack = resolveSubjectPack(input.subject);

  const started = Date.now();
  try {
    const performer = resolvePerformer(input.roasterId);
    // STEP 1 — ground the roast in the subject (car → live web research; texts →
    // extract the conversation). Research + grading run on the cheap utility model;
    // writing on the writer. Car research is cached so the whole cast roasts one
    // car off one pass.
    const research = await pack.ground(input, models.utility, cache, config);

    // PANEL — two comics riff together. Same best-of-N + grade bar; the writer is
    // writePanel (a dialogue) instead of writeSet (a monologue).
    if (input.format === "panel") {
      const [a, b] = resolvePanelPerformers(input.roasterIds);
      const Np = clamp(config.candidates ?? 2, 1, 4);
      const maxRoundsP = clamp(config.maxRounds ?? 2, 1, 3);
      let allP = [];
      let roundsP = 0;
      let chosenP = null;
      for (let round = 0; round < maxRoundsP; round++) {
        roundsP = round + 1;
        const sets = await Promise.all(
          Array.from({ length: Np }, (_, i) =>
            writePanel(a, b, research, input.context, models.write, { variant: round * Np + i, framing: pack.framing })
          )
        );
        const graded = await Promise.all(
          sets.map(async (set) => ({ set, grade: await gradeSet(set, a, research, models.utility, { framing: pack.framing, performers: [a, b] }) }))
        );
        allP = allP.concat(graded);
        if (graded.some((c) => c.grade.pass)) { chosenP = pickBest(allP); break; }
      }
      if (!chosenP) chosenP = pickBest(allP);
      chosenP.grade.candidates = allP.length;
      chosenP.grade.rounds = roundsP;
      return buildResult({
        performer: a,
        performers: [a, b],
        format: "panel",
        research,
        set: chosenP.set,
        grade: chosenP.grade,
        engine: "live",
        durationMs: Date.now() - started,
        usage: collectUsage(models),
      });
    }

    const N = clamp(config.candidates ?? 2, 1, 6);
    const maxRounds = clamp(config.maxRounds ?? 2, 1, 4);

    let allCandidates = [];
    let rounds = 0;
    let chosen = null;

    for (let round = 0; round < maxRounds; round++) {
      rounds = round + 1;
      // Generate N candidates in parallel, then grade them in parallel.
      const sets = await Promise.all(
        Array.from({ length: N }, (_, i) =>
          writeSet(performer, research, input.context, models.write, { variant: round * N + i, framing: pack.framing })
        )
      );
      const graded = await Promise.all(
        sets.map(async (set) => ({ set, grade: await gradeSet(set, performer, research, models.utility, { framing: pack.framing }) }))
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
      usage: collectUsage(models),
    });
  } catch (err) {
    // Network / API failure mid-flight → don't break the app; fall back offline.
    // Always surface a one-line reason (silent degradation hid a 401 once);
    // full stack only under BRAIN_DEBUG.
    const debug = typeof process !== "undefined" && process.env && process.env.BRAIN_DEBUG;
    const msg = (err && err.message) || String(err);
    console.error(`[brain] live generation failed — using offline fallback: ${msg}`);
    if (debug) console.error(err);
    return offlineBrain(input, { degraded: true });
  }
}

// Gather per-model token usage from the (possibly shared) model objects, merged by
// model id. Dedupes the same object (the _model test seam uses one for both stages).
function collectUsage(models) {
  const objs = [...new Set([models.write, models.utility])].filter((m) => m && m.usage);
  const byId = new Map();
  for (const m of objs) {
    const u = m.usage;
    const e = byId.get(u.model);
    if (e) { e.inputTokens += u.inputTokens; e.outputTokens += u.outputTokens; e.calls += u.calls; }
    else byId.set(u.model, { ...u });
  }
  return [...byId.values()];
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n | 0));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
