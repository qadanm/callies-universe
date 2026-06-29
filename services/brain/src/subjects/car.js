// services/brain — SUBJECT PACK: car (the reference subject).
//
// A subject pack bundles everything subject-specific the engine needs:
//   • ground()         — STEP 1: produce the research the writer grounds on
//   • offlineSets      — per-character curated sets for the no-key / CI path
//   • offlineResearch()— the research stub the offline path attaches
//   • framing          — the subject-specific prompt wording (see framing.js)
//
// This pack reproduces the original car behavior EXACTLY (same grounding call,
// same default car, same curated sets), so the car path is byte-identical.

import { researchCar } from "../research/researchCar.js";
import { CAR_FRAMING } from "./framing.js";

// A representative, very-roastable default until photo-ID lands. Heavily memed,
// so the live path has real material to ground against even in the app.
const DEFAULT_CAR = { year: 2006, make: "Chrysler", model: "PT Cruiser", _defaulted: true };

function normalizeCar(input) {
  return input.car || input.carPhoto?.identified || { ...DEFAULT_CAR };
}

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
  buford: {
    title: "Bless Its Heart",
    performanceNote: "Front-porch drawl; long slow build, quiet deadpan button.",
    beats: [
      { type: "opener", text: "Well now… set still a minute. Lemme look at ya." },
      { type: "setup", text: "That thing's been parked so long the grass growed up through the floorboard." },
      { type: "punchline", text: "Bless its little heart — it ain't a car, it's a leftover.", punch: "a leftover" },
      { type: "closer", text: "I have known mules with more git-up." },
    ],
  },
  gord: {
    title: "Sorry Aboot Her",
    performanceNote: "Apologetic hoser; soft jab, then an immediate sorry.",
    beats: [
      { type: "opener", text: "Aw geez, sorry to say this aboot her, bud, but…" },
      { type: "crowd-work", text: "No offence, eh? You seein' this too?" },
      { type: "punchline", text: "Them rims look like a beer-league playoff overtime. Sorry.", punch: "playoff overtime" },
      { type: "closer", text: "But hey — she's got heart, eh? Give'er." },
    ],
  },
};

export const carPack = {
  id: "car",
  framing: CAR_FRAMING,

  /** STEP 1 — research the specific car (live). Identical to the original call. */
  async ground(input, model, cache /* , config */) {
    return researchCar(normalizeCar(input), model, cache);
  },

  offlineSets: OFFLINE_SETS,

  /** The research stub the offline path attaches (car-shaped, no live sources). */
  offlineResearch(input, meta = {}) {
    const car = input.car || input.carPhoto?.identified || null;
    return {
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
  },
};
