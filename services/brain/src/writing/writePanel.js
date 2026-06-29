// services/brain — PANEL writing: two comics roast the subject TOGETHER.
//
// The "Green Room" format: instead of one comic monologuing, TWO comics riff off
// each other about the subject — A sets up, B tops it; they interrupt, agree, and
// one-up, building to a shared kill. Same research + framing as the single set;
// the only new thing is the dialogue SHAPE (turns with a speaker).
//
// A panel `set` reuses the normal set shape, with a `speaker` ("a"|"b") on every
// beat — so the timeline, captions, audio, and scrubber all work unchanged. The
// two performers travel on the result as `performers: [A, B]`.

// Per-take reaction dynamics for the hosts reacting to the submission.
const PANEL_ANGLES = [
  "One host reacts to the photo first; the other leans in and they clock the same detail.",
  "They genuinely can't tell something about it and go back and forth guessing.",
  "One host low-key respects it; the other can't believe they'd say that.",
  "A detail reminds a host of someone they know who'd own this exact thing.",
  "They wrap by deciding what they'd actually say to the person who sent it in.",
];

const PANEL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "beats", "performanceNote"],
  properties: {
    title: { type: "string", description: "A short, punchy billing for the duo (2–4 words)." },
    beats: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["speaker", "type", "text"],
        properties: {
          speaker: { type: "string", enum: ["a", "b"], description: "which comic says this line" },
          type: { type: "string", enum: ["opener", "setup", "punchline", "act-out", "crowd-work", "callback", "tag", "closer"] },
          text: { type: "string" },
          punch: { type: "string" },
        },
      },
    },
    performanceNote: { type: "string" },
  },
};

/**
 * Build the {system, user} messages for one panel-writing call. Pure (no model
 * call) so it can be asserted in tests.
 *
 * The frame is a comedy PODCAST whose hosts react to listener-submitted photos
 * (which maps to the product: the user submits their thing, the panel reviews it).
 * The hard rules below exist to kill the "AI-jokey" feel — chiefly the relentless
 * "it doesn't X, it Y's" symmetrical-quip construction and every-line-a-punchline
 * density. Real podcast banter is mostly just two people talking, funny once in a
 * while and FOUND, not written.
 */
export function buildPanelMessages(a, b, research, context, framing, variant = 0) {
  const angle = PANEL_ANGLES[variant % PANEL_ANGLES.length];
  const chips = (context || []).filter(Boolean);
  const subject = framing.subjectPhrase(research);
  const system = [
    `You're writing a short clip from a popular comedy PODCAST where listeners send in photos of their ${framing.submissionNoun} for the two hosts to react to. The hosts just pulled up the newest submission — ${subject} — and they're reacting to it live, on mic.`,
    ``,
    `THE TWO HOSTS — write each as how they actually TALK on a podcast (their personality, not an act). They must NOT sound the same:`,
    `"a" — ${a.name}: ${a.comedicIdentity}`,
    `   talks like: ${a.rhythm}`,
    `"b" — ${b.name}: ${b.comedicIdentity}`,
    `   talks like: ${b.rhythm}`,
    ``,
    `HOW IT SHOULD SOUND — like a REAL podcast, not a written bit:`,
    `• They're reacting to a PHOTO. Open on a real reaction in WORDS — e.g. "wait, is that a—", "okay, they actually sent this in", "this one's a problem" — then talk about what they're looking at.`,
    `• REAL WORDS ONLY — no filler vocalizations or verbal tics. NEVER write "mm-mm-MM", "mmm", "ohh", "uh", "ok ok ok", "no no no", drawn-out sounds, or repeated stammers for effect (they sound robotic when voiced). If a host's style notes mention a signature sound or catchphrase noise, IGNORE it — their personality comes through WORD CHOICE, not noises.`,
    `• NORMAL SPEAKING VOLUME. No ALL-CAPS words, and almost no exclamation points — when a word is in caps or ends in "!", the voice literally YELLS, which is grating. These hosts are calm, dry, and conversational; nobody on a podcast shouts. Emphasis comes from word choice and timing, never from capitals or "!". Use plain sentences ending in periods.`,
    `• It's MOSTLY JUST TWO PEOPLE TALKING — reacting, describing, asking each other, small tangents. The funny lands maybe once every few lines and feels FOUND, not written. Do NOT make every line a joke.`,
    `• Real chemistry: they riff off each other, finish each other's thoughts, half-agree, crack each other up. There's warmth — they love doing this.`,
    ``,
    `WHAT MAKES IT SOUND LIKE AI — do NONE of this:`,
    `• The antithesis-quip construction — "it doesn't X, it Y's" / "that's not a Z, that's a W" / "a W with extra steps". This is the #1 AI tell. These are ALL BANNED:`,
    `    ✗ "That's not loyalty, that's a hostage situation."`,
    `    ✗ "It doesn't break down, it gives up."`,
    `    ✗ "That's not paid off, that's a payment plan with extra steps."`,
    `  React like a person instead, don't reframe: ✓ "loyalty to WHAT? the transmission?"  ✓ "honestly that thing's a hostage situation."`,
    `• Back-to-back zingers, every line a punchline. Real hosts mostly just talk; the funny is sparse and earned.`,
    `• Puns, wordplay, tidy little buttons, "let's just say", explaining why something's funny.`,
    ``,
    `GROUND IT in the real stuff about ${subject} below — its actual reputation and flaws; the specific true detail is what's funny, never generic "${framing.genericFiller}" filler.`,
    `PG-13: aim everything at ${framing.aimTarget}, never at a group, culture, or the ${framing.ownerNoun}'s worth. Two DISTINCT voices — a reader knows who's talking from the line alone.`,
    ``,
    `Write 5–7 SHORT turns — each line ideally under ~14 words; the whole exchange must read in UNDER about 30 seconds. Mostly alternate (a quick double is fine). End naturally: they decide what they'd actually tell the person who sent it in, or just move on. NOT a mic drop.`,
    `BEFORE YOU FINISH: reread every single line. If a line is built as "not X, it's Y", or any tidy symmetrical reframe, or could be lifted out as a stand-up punchline — REWRITE it as something a person would actually blurt out mid-conversation. When in doubt, make it a plain reaction, not a joke.`,
    `Give it a casual, episode-y title (2–4 words) in "title". Each turn: "speaker" ("a"/"b"), a "type", and in "punch" the single sharpest word/phrase of the one line that lands hardest (for the on-screen highlight).`,
  ].join("\n");

  const user = [
    `The submission they're reacting to: ${subject}.`,
    ``,
    `THE REAL STUFF (what's actually true about it — this is where the funny comes from):`,
    `Reputation: ${research.summary}`,
    research.runningJokes.length ? `What people rag on: ${research.runningJokes.join(" | ")}` : "",
    research.knownProblems.length ? `Real problems / quirks: ${research.knownProblems.join(" | ")}` : "",
    research.whatPeopleSay.length ? `What people say: ${research.whatPeopleSay.join(" | ")}` : "",
    chips.length ? `\nThe energy the listener asked for: ${chips.join(", ")}.` : "",
    ``,
    `Where this one drifts: ${angle}`,
  ].filter(Boolean).join("\n");

  return { system, user };
}

/**
 * @param {object} a  resolved performer (speaker "a")
 * @param {object} b  resolved performer (speaker "b")
 * @param {object} research
 * @param {string[]} context
 * @param {object} model
 * @param {{ variant?: number, framing?: object }} [opts]
 * @returns {Promise<{title:string, beats:Array, performanceNote:string}>}
 */
export async function writePanel(a, b, research, context, model, opts = {}) {
  const { system, user } = buildPanelMessages(a, b, research, context, opts.framing, opts.variant ?? 0);
  const set = await model.json({ system, user, schema: PANEL_SCHEMA, effort: "low", thinking: true, maxTokens: 3500 });
  const beats = (set.beats || []).filter((x) => x && (x.speaker === "a" || x.speaker === "b") && x.text);
  return {
    title: set.title || `${firstName(a.name)} × ${firstName(b.name)}`,
    beats,
    performanceNote: set.performanceNote || "",
  };
}

/* ---------------------------- OFFLINE panel ---------------------------- */

// Short, in-voice reactions woven between the partner's lines so the offline
// panel reads as banter, not two stitched monologues. Subject-agnostic.
// Short word-based reactions (no vocalizations / tics — they sound robotic voiced).
const INTERJECTIONS = {
  reginald: ["Observe.", "Fascinating.", "And yet it persists."],
  tony: ["Get outta here.", "Am I crazy here?", "What is this?"],
  abuomar: ["My son.", "No, I beg you.", "I say this with love."],
  mama: ["Now hold on.", "You see this?", "I said what I said."],
  mateo: ["My heart.", "It betrays us.", "I cannot look."],
  jeanluc: ["It is nothing.", "I am unmoved.", "No."],
  priya: ["Beta, no.", "Sharma-ji's son would never.", "But it's nice."],
  kenji: ["No.", "It is a lot.", "I have nothing to add."],
};

const interjection = (id, i) => {
  const list = INTERJECTIONS[id] || INTERJECTIONS.mama;
  return list[i % list.length];
};
const beatOfType = (set, type, fallbackIdx = 0) =>
  (set.beats || []).find((x) => x.type === type) || (set.beats || [])[fallbackIdx] || { type: "setup", text: "" };

/**
 * Deterministic offline panel: weave the two comics' curated solo sets into a
 * back-and-forth, with short in-voice interjections. No model, no network — the
 * no-key / CI path still produces a real two-comic dialogue for any duo.
 *
 * @param {object} a resolved performer
 * @param {object} b resolved performer
 * @param {Record<string, {title, performanceNote, beats}>} offlineSets  the subject pack's sets
 */
export function buildOfflinePanel(a, b, offlineSets) {
  const aSet = offlineSets[a.id] || offlineSets.mama;
  const bSet = offlineSets[b.id] || offlineSets.mama;
  const aOpen = beatOfType(aSet, "opener", 0);
  const aPunch = beatOfType(aSet, "punchline", 2);
  const bPunch = beatOfType(bSet, "punchline", 2);
  const bClose = beatOfType(bSet, "closer", (bSet.beats || []).length - 1);

  // Tight 6-turn weave (offline fallback): open → react → trade the two best
  // lines → react → button. Short, so it lands near the share-cut length.
  const beats = [
    { speaker: "a", type: "opener", text: aOpen.text, punch: aOpen.punch },
    { speaker: "b", type: "crowd-work", text: interjection(b.id, 0) },
    { speaker: "a", type: "punchline", text: aPunch.text, punch: aPunch.punch },
    { speaker: "b", type: "punchline", text: bPunch.text, punch: bPunch.punch },
    { speaker: "a", type: "crowd-work", text: interjection(a.id, 1) },
    { speaker: "b", type: "closer", text: bClose.text, punch: bClose.punch },
  ].filter((x) => x.text);

  return {
    title: `${firstName(a.name)} vs ${firstName(b.name)}`,
    beats,
    performanceNote: `${firstName(a.name)} and ${firstName(b.name)} in the green room, riffing off each other.`,
  };
}

function firstName(name) {
  return String(name || "").replace(/[“"].*$/, "").split(" ")[0] || "Comic";
}
