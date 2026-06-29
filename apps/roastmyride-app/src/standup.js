// RoastMyRide — the stand-up DISPLAY adapter [ROASTMYRIDE-NEW].
//
// The brain returns the rich RoastResult (contract.d.ts in @callies-universe/brain).
// The stand-up screens present the HANDOFF's StandupSet display shape — a 4-type
// beat vocabulary (setup | punch | crowd | closer) plus the bit title and a
// runtime for the billing/scrubber. This adapter is the one place that maps
// between them, so the screens stay simple and the brain contract stays rich.
//
// `comicStyle(id)` reads the comedian's one-line comedic identity straight from
// the brain's persona layer (which reads core's Roaster seed) — no duplication.

import { resolvePerformer } from "@callies-universe/brain";
import { pickBackground } from "./gameplayBackgrounds.js";
import { pickMusic } from "./musicBeds.js";
import { cfg } from "./subjects/index.js";

// Brain beat type → HANDOFF display type.
const BEAT_TYPE = {
  opener: "setup",
  setup: "setup",
  punchline: "punch",
  "act-out": "punch",
  callback: "punch",
  tag: "punch",
  "crowd-work": "crowd",
  closer: "closer",
};

/** One comedian's comedic-identity line, for the lineup / billing / share clip. */
export function comicStyle(roasterId) {
  return resolvePerformer(roasterId).comedicIdentity;
}

/** Rough runtime estimate from the set's word count (placeholder for the future
 *  stage-video scrubber): ~2.5 words/sec, floored at 0:20. */
function estimateRuntime(beats) {
  const words = beats.reduce((n, b) => n + (b.text ? b.text.trim().split(/\s+/).length : 0), 0);
  const secs = Math.max(20, Math.round(words / 2.5));
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Split a beat's text into the lead-in, the highlighted punch, and the tail. */
function splitPunch(text, punch) {
  if (!punch || !text.includes(punch)) return { lead: text, punch: undefined, tail: "" };
  const i = text.indexOf(punch);
  return { lead: text.slice(0, i), punch, tail: text.slice(i + punch.length) };
}

/**
 * Map a brain RoastResult into the StandupSet display shape.
 * @returns {{ comedianId, bit, runtime, beats: Array<{type,text,punch?,tail?}> }}
 */
export function toStandupSet(result) {
  const set = result.set || { beats: [] };
  // PANEL: map each beat's speaker ("a"/"b") to the performer id so the render can
  // highlight the right comic and voice can speak each line in the right voice.
  const performers = result.performers || null;
  const idForSpeaker = (sp) =>
    !performers ? result.roasterId : (sp === "b" ? performers[1]?.id : performers[0]?.id);

  const beats = (set.beats || []).map((b) => {
    const type = BEAT_TYPE[b.type] || "setup";
    const extra = b.speaker ? { speaker: b.speaker, performerId: idForSpeaker(b.speaker) } : {};
    if (type === "punch" || type === "closer") {
      const { lead, punch, tail } = splitPunch(b.text, b.punch);
      return { type, text: lead || b.text, punch, tail, ...extra };
    }
    return { type, text: b.text, ...extra };
  });
  return {
    comedianId: result.roasterId,
    bit: set.title || "Tonight's Set",
    runtime: estimateRuntime(set.beats || []),
    beats,
    format: result.format || "single",
    performers,
  };
}

/* ----------------------------- performance timeline ----------------------------- */

const WPS = 2.6; // speaking pace (words/sec)
const MIN_BEAT_MS = 1500;
const MAX_BEAT_MS = 6500;
const GAP_MS = 320; // breath between beats
// extra "let it land / laugh" beat after the funny ones
const LAUGH_MS = { punch: 750, closer: 900, crowd: 650, setup: 150 };
// "Chrome" around the set: an opening hook (grab) and a closing CTA (convert).
// These are timeMs windows the scene renders; beats keep their indices and just
// shift by LEAD_MS, so the per-beat audio mapping is untouched.
const LEAD_MS = 1300;
const TAIL_MS = 1700;

function beatDurationMs(beat) {
  const words = beat.text ? beat.text.trim().split(/\s+/).filter(Boolean).length : 0;
  const speak = (words / WPS) * 1000;
  const land = LAUGH_MS[beat.type] ?? 200;
  return Math.round(Math.max(MIN_BEAT_MS, Math.min(MAX_BEAT_MS, speak + land)));
}

/**
 * Turn the display beats into a timed performance: an opening hook (leadMs), each
 * beat with a start/end (ms) + a breath between, then a closing CTA (tailMs). This
 * drives both the live reel and the exported video — same timeline (parity).
 * Beats keep their indices and shift by leadMs, so per-beat audio mapping holds.
 * @returns {{ segments: Array<{beat, index, startMs, endMs}>, totalMs, leadMs, tailMs }}
 */
export function buildTimeline(beats, opts = {}) {
  // When real per-beat audio durations are supplied (voiced render), pace the
  // timeline to the SPOKEN audio so captions + scene track the performance.
  // Otherwise fall back to the word-count estimate (live / silent).
  const durationsMs = opts.durationsMs;
  const has = !!(beats && beats.length);
  const leadMs = has ? (opts.leadMs ?? LEAD_MS) : 0; // 0 disables a window
  const tailMs = has ? (opts.tailMs ?? TAIL_MS) : 0;
  let t = leadMs;
  const segments = (beats || []).map((beat, index) => {
    const dur =
      durationsMs && Number.isFinite(durationsMs[index]) && durationsMs[index] > 0
        ? durationsMs[index]
        : beatDurationMs(beat);
    const startMs = t;
    const endMs = t + dur;
    t = endMs + GAP_MS;
    return { beat, index, startMs, endMs };
  });
  // t now = end of last beat + breath; add the CTA tail. 0 segments → 0.
  return { segments, totalMs: has ? t + tailMs : 0, leadMs, tailMs };
}

/**
 * The active segment index at a given time. Caption N stays active from its own
 * start until the NEXT beat's start — so a beat naturally lingers through the
 * breath/gap that follows it rather than blanking out. Returns -1 for an empty
 * timeline; the last index once past the final start.
 */
export function activeIndexAt(segments, timeMs) {
  if (!segments.length) return -1;
  let idx = 0;
  for (let i = 0; i < segments.length; i++) {
    if (timeMs >= segments[i].startMs) idx = i;
    else break;
  }
  return idx;
}

/**
 * Which of Callie's 9 core states she shows as the audience for a given beat.
 * Crowd work + the hard-landing beats pop her to the roast's reaction; setups
 * are curious; everything else delighted. `reaction` is the result's headline state.
 */
export function callieStateForBeat(beatType, reaction = "savage") {
  if (!beatType) return "delighted";
  if (beatType === "crowd") return "savage";
  if (beatType === "punch" || beatType === "closer") return reaction || "savage";
  if (beatType === "setup") return "curious";
  return "delighted";
}

export function mmss(totalMs) {
  const secs = Math.max(0, Math.round(totalMs / 1000));
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
}

/**
 * Build the render spec = the EXACT inputProps the Remotion "stage" composition
 * consumes (services/render). Carries the real car photo as a dataUrl so the video
 * shows the actual car. This is the one shape the app hands to the render service
 * (locally via the CLI now; via an endpoint once hosted).
 */
export function buildRenderSpec(result, input) {
  const su = toStandupSet(result);
  const research = (result.research && result.research[cfg("research.key")]) || {};
  const labelFields = cfg("research.labelFields", []);
  const subjectLabel = research.label || labelFields.map((f) => research[f]).filter(Boolean).join(" ") || cfg("brain.subjectNoun");
  // The gameplay backdrop is chosen deterministically from the roast, so the saved
  // video uses the exact same backdrop the live reel shows.
  const bg = pickBackground(result);
  return {
    comedianId: result.roasterId,
    performerName: result.roasterName || "the comic",
    bit: su.bit,
    reaction: result.reaction,
    subjectLabel,
    engineLabel: result.engine === "offline" ? "offline" : undefined,
    beats: su.beats, // panel beats carry speaker + performerId
    subjectPhoto: (input && input.carPhoto && input.carPhoto.dataUrl) || null,
    backgroundUrl: bg.backgroundUrl,
    fauxStyle: bg.fauxStyle,
    musicUrl: pickMusic(result),
    // PANEL: the two performers + format so the render shows the two-shot, and the
    // grade composite as the show's "verdict" score in the outro.
    format: result.format || "single",
    performers: result.performers || undefined,
    score: (result.grade && result.grade.composite) || undefined,
  };
}
