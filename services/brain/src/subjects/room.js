// services/brain — SUBJECT PACK: room (Roast My Room).
//
// The room's material is INSIDE the photo — decor, layout, mess, furniture choices,
// vibe. Grounding is a vision pass UPSTREAM that produces a structured description;
// ground() then extracts into the research shape the writer/grader consume.

import { ROOM_FRAMING } from "./framing.js";

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
    title: "Observe, The Habitat",
    performanceNote: "Nature-documentary field study of a living space; reverent narration, tragic conditions.",
    beats: [
      { type: "opener", text: "Observe. The male has nested among seventeen objects." },
      { type: "setup", text: "In the wild, this density is reserved for hoarders." },
      { type: "punchline", text: "Here, it is merely a Tuesday — and the laundry is breeding.", punch: "the laundry is breeding" },
      { type: "closer", text: "Magnificent. And yet… the chair is buried." },
    ],
  },
  tony: {
    title: "What Is This Room?",
    performanceNote: "Fast incredulous rant about the decor, all hands, big heart underneath.",
    beats: [
      { type: "opener", text: "What is this? What am I lookin' at here?" },
      { type: "crowd-work", text: "Am I crazy? Somebody tell me this is storage." },
      { type: "punchline", text: "You live like you're campin' in your own apartment.", punch: "campin' in your own apartment" },
      { type: "closer", text: "Beautiful. Get outta here." },
    ],
  },
  abuomar: {
    title: "My Son, The Decor",
    performanceNote: "Warm uncle framing; love first, the dagger second — aimed at the room, not the person.",
    beats: [
      { type: "opener", text: "My son. Come. Sit. The room, I do not love." },
      { type: "setup", text: "I say this because I love you, you understand." },
      { type: "punchline", text: "Even the walls look tired of trying.", punch: "tired of trying" },
      { type: "closer", text: "Habibi… we will not speak of it again." },
    ],
  },
  mama: {
    title: "Baby, The Mess",
    performanceNote: "Church-fan snap; the read on the room, then the blessing.",
    beats: [
      { type: "opener", text: "Mm-mm-MM. Baby. Come here." },
      { type: "crowd-work", text: "You see this floor? You SEE it?" },
      { type: "punchline", text: "This room is a cry for help, and I'm answering.", punch: "a cry for help" },
      { type: "closer", text: "I say this with love… no." },
    ],
  },
  mateo: {
    title: "The Room That Killed Me",
    performanceNote: "Telenovela melodrama; the room as a lover who wronged him.",
    beats: [
      { type: "opener", text: "The room — the room has broken my heart." },
      { type: "act-out", text: "I gave it everything. EVERYTHING." },
      { type: "punchline", text: "And it broke my heart AND the Feng Shui.", punch: "AND the Feng Shui" },
      { type: "closer", text: "I cannot look at it. …I will look at it tomorrow." },
    ],
  },
  jeanluc: {
    title: "It Is a Room",
    performanceNote: "Minimalist disdain; refuses to be impressed by the living space.",
    beats: [
      { type: "opener", text: "It is a room. It is here." },
      { type: "setup", text: "It is beige. Inside. And out. And, somehow, in spirit." },
      { type: "punchline", text: "I am… unmoved.", punch: "unmoved" },
      { type: "closer", text: "Eh." },
    ],
  },
  priya: {
    title: "Sharma-ji's Room Is Cleaner",
    performanceNote: "Comparison auntie; everyone else's room is better, with love.",
    beats: [
      { type: "opener", text: "Beta. Come. We need to talk about the room." },
      { type: "setup", text: "Sharma-ji's son? He has the organized one. The clean one." },
      { type: "punchline", text: "But your pillows are trying so hard, beta.", punch: "trying so hard" },
      { type: "closer", text: "It's nice. It's nice! …it's nice." },
    ],
  },
  kenji: {
    title: "…Room",
    performanceNote: "Devastating minimalism; the silence is the joke about the space.",
    beats: [
      { type: "opener", text: "…Hm." },
      { type: "setup", text: "(He looks at the room. He looks at you.)" },
      { type: "punchline", text: "It is a room.", punch: "It is a room." },
      { type: "closer", text: "…Hm." },
    ],
  },
  buford: {
    title: "Bless This Room",
    performanceNote: "Front-porch drawl applied to a living space; slow build, quiet deadpan button.",
    beats: [
      { type: "opener", text: "Well now… set still a minute. Lemme look at this one." },
      { type: "setup", text: "That thing's been lived in so long the dust has dust." },
      { type: "punchline", text: "Bless its little heart — it ain't a room, it's a leftover.", punch: "a leftover" },
      { type: "closer", text: "I have known tool sheds with more order." },
    ],
  },
  gord: {
    title: "Sorry Aboot the Room, Eh",
    performanceNote: "Apologetic hoser reading a room; soft jab, then immediate sorry.",
    beats: [
      { type: "opener", text: "Aw geez, sorry to say this aboot the room, bud, but…" },
      { type: "crowd-work", text: "No offence, eh? You seein' this too?" },
      { type: "punchline", text: "Them curtains look like a beer-league playoff overtime. Sorry.", punch: "playoff overtime" },
      { type: "closer", text: "But hey — it's got heart, eh? Give'er." },
    ],
  },
};

export const roomPack = {
  id: "room",
  framing: ROOM_FRAMING,

  async ground(input, model /* , cache, config */) {
    const room = input.room || null;
    if (!room || !room.description) {
      throw new Error("room: no description to ground the roast");
    }
    const structured = await model.json({
      system:
        "You are a comedy writer's researcher analyzing a description of someone's room from a photo. " +
        "Pull the SPECIFIC, funny-but-true material a stand-up could build a bit on: the decor choices, " +
        "layout crimes, furniture, mess patterns, and overall vibe. Be specific to THIS room — never generic. " +
        "Aim every observation at the ROOM and the choices, never at the person's worth or any group.",
      user:
        `The room description:\n${room.description}\n\n` +
        `Extract: a one-paragraph read of the room's vibe and choices; the running jokes it sets up; ` +
        `the cringe / red-flag decor moments; and a few punchy "what this room says about them" lines.`,
      schema: EXTRACT_SCHEMA,
      effort: "low",
      thinking: false,
      maxTokens: 2048,
    });
    return {
      room: { label: room.label || "a room" },
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
      room: { label: "your room" },
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
