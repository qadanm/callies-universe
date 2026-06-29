// services/brain: SUBJECT PACK: outfit (Roast My Outfit / Fit Check).
//
// The outfit's material is INSIDE the photo: its fit, colors, choices, vibe.
// Grounding is a vision pass UPSTREAM (the app/API layer reads the photo) that
// produces a structured description; ground() then extracts into the research
// shape the writer/grader already consume. With no description (offline, or
// before that wire lands) ground() degrades gracefully so the flow never breaks.

import { OUTFIT_FRAMING } from "./framing.js";

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
    title: "Observe, The Layering",
    performanceNote: "Nature-documentary field study of a fashion disaster; reverent narration, tragic subject.",
    beats: [
      { type: "opener", text: "Observe. The specimen has chosen seven layers." },
      { type: "setup", text: "In the wild, this much camouflage is reserved for prey." },
      { type: "punchline", text: "Here, it is a cry for help, and the belt is answering.", punch: "a cry for help" },
      { type: "closer", text: "Magnificent. And yet… the socks are visible." },
    ],
  },
  tony: {
    title: "What Is This Fit?",
    performanceNote: "Fast incredulous rant about fashion choices, all hands, big heart underneath.",
    beats: [
      { type: "opener", text: "What is this? What am I lookin' at here?" },
      { type: "crowd-work", text: "Am I crazy? Somebody tell me this is a costume." },
      { type: "punchline", text: "You dressed like you're hidin' from the fashion police.", punch: "fashion police" },
      { type: "closer", text: "Beautiful. Get outta here." },
    ],
  },
  abuomar: {
    title: "My Son, The Shoes",
    performanceNote: "Warm uncle framing; love first, the dagger second. Aimed at the outfit, not the person.",
    beats: [
      { type: "opener", text: "My son. Come. Sit. The shoes, I do not love." },
      { type: "setup", text: "I say this because I love you, you understand." },
      { type: "punchline", text: "Even the shirt looks embarrassed to be near them.", punch: "embarrassed" },
      { type: "closer", text: "Habibi… we will not speak of it again." },
    ],
  },
  mama: {
    title: "Baby, The Mismatch",
    performanceNote: "Church-fan snap; the read on the outfit, then the blessing.",
    beats: [
      { type: "opener", text: "Mm-mm-MM. Baby. Come here." },
      { type: "crowd-work", text: "You see this top? You SEE it with these pants?" },
      { type: "punchline", text: "This outfit is a cry for help, and I'm answering.", punch: "a cry for help" },
      { type: "closer", text: "I say this with love… no." },
    ],
  },
  mateo: {
    title: "The Fit That Betrayed Me",
    performanceNote: "Telenovela melodrama; the outfit as a lover who wronged him.",
    beats: [
      { type: "opener", text: "The fit… the fit has broken my heart." },
      { type: "act-out", text: "I gave it everything. EVERYTHING." },
      { type: "punchline", text: "And it broke my heart AND the color wheel.", punch: "AND the color wheel" },
      { type: "closer", text: "I cannot look at it. …I will look at it tomorrow." },
    ],
  },
  jeanluc: {
    title: "It Is an Outfit",
    performanceNote: "Minimalist disdain; refuses to be impressed by the fashion choices.",
    beats: [
      { type: "opener", text: "It is an outfit. It is here." },
      { type: "setup", text: "It is beige. And grey. And, somehow, beige again." },
      { type: "punchline", text: "I am… unmoved.", punch: "unmoved" },
      { type: "closer", text: "Eh." },
    ],
  },
  priya: {
    title: "Sharma-ji's Son Dressed Better",
    performanceNote: "Comparison auntie; everyone else's outfit is superior, with love.",
    beats: [
      { type: "opener", text: "Beta. Come. We need to talk about the fit." },
      { type: "setup", text: "Sharma-ji's son? He has the coordinated one. The pressed one." },
      { type: "punchline", text: "But your socks are trying so hard, beta.", punch: "trying so hard" },
      { type: "closer", text: "It's nice. It's nice! …it's nice." },
    ],
  },
  kenji: {
    title: "…Hm",
    performanceNote: "Devastating minimalism; the silence is the joke about the outfit.",
    beats: [
      { type: "opener", text: "…Hm." },
      { type: "setup", text: "(He looks at the outfit. He looks at you.)" },
      { type: "punchline", text: "It is an outfit.", punch: "It is an outfit." },
      { type: "closer", text: "…Hm." },
    ],
  },
  buford: {
    title: "Bless This Fit",
    performanceNote: "Front-porch drawl applied to fashion choices; slow build, quiet deadpan button.",
    beats: [
      { type: "opener", text: "Well now… set still a minute. Lemme look at ya." },
      { type: "setup", text: "That thing's been worn so long the colors gave up." },
      { type: "punchline", text: "Bless its little heart. It ain't a fit, it's a leftover.", punch: "a leftover" },
      { type: "closer", text: "I have known scarecrows with more coordination." },
    ],
  },
  gord: {
    title: "Sorry Aboot the Fit, Eh",
    performanceNote: "Apologetic hoser reading an outfit; soft jab, then immediate sorry.",
    beats: [
      { type: "opener", text: "Aw geez, sorry to say this aboot the fit, bud, but…" },
      { type: "crowd-work", text: "No offence, eh? You seein' this too?" },
      { type: "punchline", text: "Them shoes look like a beer-league playoff overtime. Sorry.", punch: "playoff overtime" },
      { type: "closer", text: "But hey, it's got heart, eh? Give'er." },
    ],
  },
};

export const outfitPack = {
  id: "outfit",
  framing: OUTFIT_FRAMING,

  async ground(input, model /* , cache, config */) {
    const outfit = input.outfit || null;
    if (!outfit || !outfit.description) {
      throw new Error("outfit: no description to ground the roast");
    }
    const structured = await model.json({
      system:
        "You are a comedy writer's researcher analyzing a description of someone's outfit from a photo. " +
        "Pull the SPECIFIC, funny-but-true material a stand-up could build a bit on: the style choices, " +
        "fit problems, color clashes, accessory crimes, and the overall vibe. Be specific to THIS outfit, " +
        "never generic. Aim every observation at the OUTFIT and the choices, never at the person's body, " +
        "worth, or any group.",
      user:
        `The outfit description:\n${outfit.description}\n\n` +
        `Extract: a one-paragraph read of the outfit's style and choices; the running jokes it sets up; ` +
        `the cringe / red-flag fashion moments; and a few punchy "what this outfit says about them" lines.`,
      schema: EXTRACT_SCHEMA,
      effort: "low",
      thinking: false,
      maxTokens: 2048,
    });
    return {
      outfit: { label: outfit.label || "an outfit" },
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
      outfit: { label: "your outfit" },
      summary: meta.degraded
        ? "Live analysis unavailable. Running the offline set."
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
