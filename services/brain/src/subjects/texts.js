// services/brain — SUBJECT PACK: texts (Roast My Texts).
//
// The car subject RESEARCHES the web (a car has a public reputation). A text
// thread does not — its material is INSIDE the screenshot. So texts grounding is
// a single extraction pass over the conversation transcript (no web search),
// producing the SAME research shape the writer/grader already consume
// (summary / runningJokes / knownProblems / whatPeopleSay).
//
// The transcript reaches the brain as `input.conversation` (plain text), read
// from the screenshot by a vision pass UPSTREAM (the app/API layer) — mirroring
// how the car flow runs /identify before the brain. With no transcript (offline,
// or before that wire lands) ground() degrades gracefully so the flow never breaks.

import { TEXTS_FRAMING } from "./framing.js";

// Same property names as the car research schema, so writeSet/gradeSet are unchanged.
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

// Character-shaped offline sets — each roasts texting behavior in that comic's
// FORM, so the no-key / CI path proves "app #2 actually roasts texts," not cars.
const OFFLINE_SETS = {
  reginald: {
    title: "Observe, The Dry Reply",
    performanceNote: "Nature-documentary field study of a dying thread; reverent narration, pathetic replies.",
    beats: [
      { type: "opener", text: "Observe. The male has typed three full paragraphs." },
      { type: "setup", text: "He waits. In the wild, this is the moment before the strike." },
      { type: "punchline", text: "Her reply arrives. A single, merciless 'k'.", punch: "merciless 'k'" },
      { type: "closer", text: "Magnificent. And yet… he is typing again." },
    ],
  },
  tony: {
    title: "Who Texts Like This?",
    performanceNote: "Fast incredulous rant, all hands, big heart underneath.",
    beats: [
      { type: "opener", text: "What is this? 'Haha'? That's the whole reply? 'Haha'?" },
      { type: "crowd-work", text: "Am I crazy? Somebody read this thread back to me." },
      { type: "punchline", text: "You waited six hours to send two letters and a period.", punch: "two letters and a period" },
      { type: "closer", text: "Unbelievable. Get outta here." },
    ],
  },
  abuomar: {
    title: "My Son, The Read Receipt",
    performanceNote: "Warm uncle framing; love first, the dagger second.",
    beats: [
      { type: "opener", text: "My son. Come. Sit. This conversation, I do not love." },
      { type: "setup", text: "I say this because I love you, you understand." },
      { type: "punchline", text: "She read it on Tuesday. It is now the weekend.", punch: "It is now the weekend" },
      { type: "closer", text: "Habibi… put the phone down." },
    ],
  },
  mama: {
    title: "Baby, Double-Text",
    performanceNote: "Church-fan snap; the read, then the blessing.",
    beats: [
      { type: "opener", text: "Mm-mm-MM. Baby. Come here." },
      { type: "crowd-work", text: "You see this? You double-texted. Then you TRIPLE-texted." },
      { type: "punchline", text: "Three blue bubbles, baby, and not one got an answer.", punch: "not one got an answer" },
      { type: "closer", text: "I say this with love… leave that man on read." },
    ],
  },
  mateo: {
    title: "The 'Seen' That Killed Me",
    performanceNote: "Telenovela melodrama; the thread as a lover who betrayed him.",
    beats: [
      { type: "opener", text: "The message — the message has broken my heart." },
      { type: "act-out", text: "I poured my SOUL into that text. EVERYTHING." },
      { type: "punchline", text: "And beneath it, one word: 'Seen.' Nothing more.", punch: "Seen" },
      { type: "closer", text: "I cannot look at the phone. …I will look at it tomorrow." },
    ],
  },
  jeanluc: {
    title: "It Is a Text",
    performanceNote: "Minimalist disdain; refuses to be impressed.",
    beats: [
      { type: "opener", text: "It is a text. It is here." },
      { type: "setup", text: "It is grey. The reply, also grey. In spirit, beige." },
      { type: "punchline", text: "He sent 'wyd' at 2 a.m. I am… unmoved.", punch: "unmoved" },
      { type: "closer", text: "Eh." },
    ],
  },
  priya: {
    title: "Sharma-ji Texts Back",
    performanceNote: "Comparison auntie; everyone else replies faster, with love.",
    beats: [
      { type: "opener", text: "Beta. Come. We need to talk about this chat." },
      { type: "setup", text: "Sharma-ji's son? He replies in two minutes. Full sentences." },
      { type: "punchline", text: "But you — you are typing… and typing… and then nothing.", punch: "and then nothing" },
      { type: "closer", text: "It's fine. It's fine! …it's fine." },
    ],
  },
  kenji: {
    title: "'k'",
    performanceNote: "Devastating minimalism; the silence is the joke.",
    beats: [
      { type: "opener", text: "…Hm." },
      { type: "setup", text: "(He scrolls up. He scrolls back down.)" },
      { type: "punchline", text: "He typed 'k'.", punch: "k" },
      { type: "closer", text: "…Hm." },
    ],
  },
};

export const textsPack = {
  id: "texts",
  framing: TEXTS_FRAMING,

  /** STEP 1 — extract the funny, true material from the conversation transcript. */
  async ground(input, model /* , cache, config */) {
    const convo = String(input.conversation || "").trim();
    if (!convo) {
      // Live path reached with no transcript (the screenshot-read wire isn't in yet,
      // or the image had no legible conversation). THROW so the orchestrator falls
      // back to the curated offline set with degraded=true — the user gets a real
      // text set and is NOT billed for an ungrounded roast (the degradation contract).
      throw new Error("texts: no conversation transcript to ground the roast");
    }
    const structured = await model.json({
      system:
        "You are a comedy writer's researcher analyzing a transcript of someone's text conversation. " +
        "Pull the SPECIFIC, funny-but-true material a stand-up could build a bit on: the dynamic between " +
        "the texters, the cringe patterns, and the dead giveaways (dry replies, left-on-read, double-texting, " +
        "emoji overuse, the slow fade). Be specific to THIS thread — never generic. Aim every observation at " +
        "the TEXTS and the dynamic, never at a person's worth or any group.",
      user:
        `The text conversation:\n${convo}\n\n` +
        `Extract: a one-paragraph read of the conversation's dynamic; the running jokes the thread sets up; ` +
        `the cringe / red-flag moments; and a few punchy "what this thread says about them" lines.`,
      schema: EXTRACT_SCHEMA,
      effort: "low",
      thinking: false,
      maxTokens: 2048,
    });
    return {
      // Keyed identity (mirrors car's research.car) so the app's
      // result.research[cfg("research.key")] lookup resolves for texts too.
      texts: { label: "a text conversation" },
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
      texts: { label: "your texts" },
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
