// services/brain — the OFFLINE fallback brain.
//
// When no API key is present (dev / CI), or a live call fails, the brain falls
// back here so the app — and `pnpm verify` — still runs without any network.
// This is the spiritual successor to RoastMyRide's old mock, but it satisfies
// the EVOLVED contract: it returns the full structured, graded set shape, not a
// flat string.
//
// The curated sets and the offline research stub are SUBJECT-SPECIFIC, so they
// live in the subject pack (see ../subjects/*). This file just resolves the pack
// for input.subject, picks the performer's curated set, and assembles the result.
// Unknown / missing subject → car (the reference subject).

import { resolvePerformer } from "../persona.js";
import { buildResult } from "../assemble.js";
import { resolveSubjectPack } from "../subjects/index.js";

/** A perfect-by-construction grade for the curated offline sets. */
function curatedGrade() {
  return {
    scores: { funny: 8, human: 9, specific: 6, edge: 7, voice: 9 },
    composite: 8.0,
    pass: true,
    aiTells: [],
    reasoning: "Curated offline set — hand-authored to the character's form and the bar.",
    candidates: 1,
    rounds: 0,
  };
}

/**
 * The offline brain. Deterministic, no network, satisfies the evolved contract.
 * @param {import("../../contract").RoastInput} input
 * @param {{ degraded?: boolean }} [meta]
 * @returns {import("../../contract").RoastResult}
 */
export function offlineBrain(input, meta = {}) {
  const pack = resolveSubjectPack(input.subject);
  const performer = resolvePerformer(input.roasterId);
  const set = pack.offlineSets[performer.id] || pack.offlineSets.mama;
  const research = pack.offlineResearch(input, meta);

  return buildResult({
    performer,
    research,
    set,
    grade: curatedGrade(),
    engine: "offline",
    durationMs: 600,
    degraded: !!meta.degraded,
  });
}
