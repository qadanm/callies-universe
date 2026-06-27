// services/brain — the OFFLINE fallback brain.
//
// When no API key is present (dev / CI), or a live call fails, the brain falls
// back here so the app — and `pnpm verify` — still runs without any network.
// This is the spiritual successor to RoastMyRide's old mock, but it satisfies
// the EVOLVED contract: it returns the full structured, graded set shape, not a
// flat string.
//
// These sets are hand-curated (so they're genuinely character-shaped and pass
// the bar by construction) and DETERMINISTIC. They read cast metadata from core
// via persona.js — no cast data is duplicated here.

import { resolvePerformer } from "../persona.js";
import { buildResult } from "../assemble.js";
import { carLabel } from "../research/researchCar.js";

// Character-shaped offline sets. Each is built in that character's FORM, so even
// the offline path demonstrates "different set per character, not reskinned."
const OFFLINE_SETS = {
  reginald: {
    title: "Still, It Persists",
    performanceNote: "Nature-documentary field study; reverent narration, pathetic subject.",
    beats: [
      { type: "opener", text: "Observe. The vehicle has not moved in some time." },
      { type: "setup", text: "In the wild, a creature this still is usually being digested." },
      { type: "punchline", text: "Here, it is merely parked outside a cry for help.", punch: "a cry for help" },
      { type: "closer", text: "Magnificent. And yet… it persists." },
    ],
  },
  tony: {
    title: "What Is This?",
    performanceNote: "Fast incredulous rant, all hands, big heart underneath.",
    beats: [
      { type: "opener", text: "What is this? What am I lookin' at here?" },
      { type: "crowd-work", text: "Am I crazy? Somebody tell me I'm crazy." },
      { type: "punchline", text: "The bumper's held on by vibes and a prayer.", punch: "vibes and a prayer" },
      { type: "closer", text: "Beautiful. Get outta here." },
    ],
  },
  abuomar: {
    title: "My Son, No",
    performanceNote: "Warm uncle framing; love first, the dagger second.",
    beats: [
      { type: "opener", text: "My son. Come. Sit. The car, I do not love." },
      { type: "setup", text: "I say this because I love you, you understand." },
      { type: "punchline", text: "Even the rust looks tired of trying.", punch: "tired of trying" },
      { type: "closer", text: "Habibi… we will not speak of it again." },
    ],
  },
  mama: {
    title: "Baby, No",
    performanceNote: "Church-fan snap; the read, then the blessing.",
    beats: [
      { type: "opener", text: "Mm-mm-MM. Baby. Come here." },
      { type: "crowd-work", text: "You see this paint? You SEE it?" },
      { type: "punchline", text: "This paint job is a cry for help, and I'm answering.", punch: "a cry for help" },
      { type: "closer", text: "I say this with love… no." },
    ],
  },
  mateo: {
    title: "It Broke My Heart",
    performanceNote: "Telenovela melodrama; the car as a lover who betrayed him.",
    beats: [
      { type: "opener", text: "The car — the car has broken my heart." },
      { type: "act-out", text: "I gave it everything. EVERYTHING." },
      { type: "punchline", text: "And it broke my heart AND the axle.", punch: "AND the axle" },
      { type: "closer", text: "I cannot look at it. …I will look at it tomorrow." },
    ],
  },
  jeanluc: {
    title: "Unmoved",
    performanceNote: "Minimalist disdain; refuses to be impressed.",
    beats: [
      { type: "opener", text: "It is a car. It is here." },
      { type: "setup", text: "It is beige. Inside. And out. And, somehow, in spirit." },
      { type: "punchline", text: "I am… unmoved.", punch: "unmoved" },
      { type: "closer", text: "Eh." },
    ],
  },
  priya: {
    title: "Sharma-ji's Son",
    performanceNote: "Comparison auntie; everyone else's car is better, with love.",
    beats: [
      { type: "opener", text: "Beta. Come. We need to talk about the car." },
      { type: "setup", text: "Sharma-ji's son? He has the nice one. The clean one." },
      { type: "punchline", text: "But your rims are trying so hard, beta.", punch: "trying so hard" },
      { type: "closer", text: "It's nice. It's nice! …it's nice." },
    ],
  },
  kenji: {
    title: "It Is a Car",
    performanceNote: "Devastating minimalism; the silence is the joke.",
    beats: [
      { type: "opener", text: "…Hm." },
      { type: "setup", text: "(He looks at the car. He looks at you.)" },
      { type: "punchline", text: "It is a car.", punch: "It is a car." },
      { type: "closer", text: "…Hm." },
    ],
  },
};

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
  const performer = resolvePerformer(input.roasterId);
  const set = OFFLINE_SETS[performer.id] || OFFLINE_SETS.mama;
  const car = input.car || input.carPhoto?.identified || null;

  const research = {
    car: car || { label: "your ride" },
    summary: meta.degraded
      ? "Live research unavailable — running the offline set."
      : "Offline mode: no live research; using the character's curated set.",
    runningJokes: [],
    knownProblems: [],
    whatPeopleSay: [],
    sources: [],
    defaulted: !car,
    offline: true,
  };

  return buildResult({
    performer,
    research,
    set,
    grade: curatedGrade(),
    engine: "offline",
    durationMs: 600,
  });
}
