// services/brain — SUBJECT PACK: profile (Roast My Profile).
//
// The profile's material is INSIDE the screenshot — bio, prompts, photo choices,
// composition. This is the MOST SENSITIVE subject: we roast the CHOICES, never
// the person's looks, body, or worth. Grounding is a vision pass UPSTREAM that
// produces a structured description; ground() then extracts into the research shape.

import { PROFILE_FRAMING } from "./framing.js";

const EXTRACT_SCHEMA = {
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

const OFFLINE_SETS = {
  reginald: {
    title: "Observe, The Bio",
    performanceNote: "Nature-documentary field study of a dating profile; reverent narration, tragic self-awareness.",
    beats: [
      { type: "opener", text: "Observe. The male has listed 'fluent in sarcasm.'" },
      { type: "setup", text: "In the wild, this is the mating cry of the unoriginal." },
      { type: "punchline", text: "Here, it is merely a bio — and the photos are from 2017.", punch: "from 2017" },
      { type: "closer", text: "Magnificent. And yet… the profile persists." },
    ],
  },
  tony: {
    title: "What Is This Profile?",
    performanceNote: "Fast incredulous rant about the bio choices, all hands, big heart underneath.",
    beats: [
      { type: "opener", text: "What is this? 'Here for a good time not a long time'? That's the whole bio?" },
      { type: "crowd-work", text: "Am I crazy? Somebody read this back to me." },
      { type: "punchline", text: "You took six selfies and chose the one with the bathroom in it.", punch: "the bathroom in it" },
      { type: "closer", text: "Unbelievable. Get outta here." },
    ],
  },
  abuomar: {
    title: "My Son, The Prompts",
    performanceNote: "Warm uncle framing; love first, the dagger second — aimed at the choices, never the person.",
    beats: [
      { type: "opener", text: "My son. Come. Sit. The prompts, I do not love." },
      { type: "setup", text: "I say this because I love you, you understand." },
      { type: "punchline", text: "'My love language is quality time' — but the photos are all gym selfies?", punch: "all gym selfies" },
      { type: "closer", text: "Habibi… put the phone down." },
    ],
  },
  mama: {
    title: "Baby, The Bio",
    performanceNote: "Church-fan snap; the read on the profile choices, then the blessing.",
    beats: [
      { type: "opener", text: "Mm-mm-MM. Baby. Come here." },
      { type: "crowd-work", text: "You see this prompt? 'Two truths and a lie'? You SEE it?" },
      { type: "punchline", text: "Three lies, baby, and not one got a match.", punch: "not one got a match" },
      { type: "closer", text: "I say this with love… leave that app alone." },
    ],
  },
  mateo: {
    title: "The Profile That Broke My Heart",
    performanceNote: "Telenovela melodrama; the profile choices as a lover who betrayed him.",
    beats: [
      { type: "opener", text: "The bio — the bio has broken my heart." },
      { type: "act-out", text: "I poured my SOUL into that swipe. EVERYTHING." },
      { type: "punchline", text: "And beneath it, one word: 'Pizza.' Nothing more.", punch: "Pizza" },
      { type: "closer", text: "I cannot look at the app. …I will look at it tomorrow." },
    ],
  },
  jeanluc: {
    title: "It Is a Profile",
    performanceNote: "Minimalist disdain; refuses to be impressed by the dating choices.",
    beats: [
      { type: "opener", text: "It is a profile. It is here." },
      { type: "setup", text: "It is beige. The bio, also beige. In spirit, beige." },
      { type: "punchline", text: "'Just ask.' I am… unmoved.", punch: "unmoved" },
      { type: "closer", text: "Eh." },
    ],
  },
  priya: {
    title: "Sharma-ji's Son Has a Better Bio",
    performanceNote: "Comparison auntie; everyone else's profile is superior, with love.",
    beats: [
      { type: "opener", text: "Beta. Come. We need to talk about the profile." },
      { type: "setup", text: "Sharma-ji's son? He has the good one. The thoughtful one." },
      { type: "punchline", text: "But your 'about me' is trying so hard, beta.", punch: "trying so hard" },
      { type: "closer", text: "It's nice. It's nice! …it's nice." },
    ],
  },
  kenji: {
    title: "'Just Ask'",
    performanceNote: "Devastating minimalism; the silence is the joke about the bio.",
    beats: [
      { type: "opener", text: "…Hm." },
      { type: "setup", text: "(He scrolls up. He scrolls back down.)" },
      { type: "punchline", text: "He wrote 'just ask.'", punch: "just ask" },
      { type: "closer", text: "…Hm." },
    ],
  },
  buford: {
    title: "Bless This Profile",
    performanceNote: "Front-porch drawl applied to a dating profile; slow build, quiet deadpan button.",
    beats: [
      { type: "opener", text: "Well now… lemme get my readin' glasses for this one." },
      { type: "setup", text: "You wrote all that out. A whole paragraph. Straight from the heart." },
      { type: "punchline", text: "And the first photo is a group shot. Bless your heart.", punch: "a group shot" },
      { type: "closer", text: "Mm-mm. Leave it be, son." },
    ],
  },
  gord: {
    title: "No Offence, Eh, Profile",
    performanceNote: "Apologetic hoser reading a profile; soft jab, then immediate sorry.",
    beats: [
      { type: "opener", text: "Aw geez. Sorry, bud, but lemme read this back to ya." },
      { type: "crowd-work", text: "No offence, eh, but… oof." },
      { type: "punchline", text: "You wrote 'world traveler' and every photo is a mirror selfie. That's rough, buddy. Sorry.", punch: "mirror selfie" },
      { type: "closer", text: "She's got heart though, eh? Give'er." },
    ],
  },
};

export const profilePack = {
  id: "profile",
  framing: PROFILE_FRAMING,

  async ground(input, model /* , cache, config */) {
    const profile = input.profile || null;
    if (!profile || !profile.description) {
      throw new Error("profile: no description to ground the roast");
    }
    const structured = await model.json({
      system:
        "You are a comedy writer's researcher analyzing a description of someone's dating/social profile " +
        "from a screenshot. Pull the SPECIFIC, funny-but-true material a stand-up could build a bit on: " +
        "the bio clichés, prompt choices, photo composition crimes, red flags, and the overall strategy. " +
        "Be specific to THIS profile — never generic. Aim EVERY observation at the CHOICES (the bio, the " +
        "prompts, the photo angles), NEVER at the person's looks, body, worth, or any group. This is the " +
        "most sensitive subject — keep it on the profile, not the person.",
      user:
        `The profile description:\n${profile.description}\n\n` +
        `Extract: a one-paragraph read of the profile's strategy and choices; the running jokes it sets up; ` +
        `the cringe / red-flag bio/prompt moments; and a few punchy "what this profile says about them" lines.`,
      schema: EXTRACT_SCHEMA,
      effort: "low",
      thinking: false,
      maxTokens: 2048,
    });
    return {
      profile: { label: profile.label || "a profile" },
      summary: structured.summary,
      runningJokes: structured.runningJokes || [],
      knownProblems: structured.knownProblems || [],
      whatPeopleSay: structured.whatPeopleSay || [],
      sources: [],
      defaulted: false,
      offline: false,
    };
  },

  offlineSets: OFFLINE_SETS,

  offlineResearch(input, meta = {}) {
    return {
      profile: { label: "your profile" },
      summary: meta.degraded
        ? "Live analysis unavailable — running the offline set."
        : "Offline mode: no live analysis; using the character's curated set.",
      runningJokes: [],
      knownProblems: [],
      whatPeopleSay: [],
      sources: [],
      defaulted: true,
      offline: true,
    };
  },
};
