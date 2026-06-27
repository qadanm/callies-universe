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
  const beats = (set.beats || []).map((b) => {
    const type = BEAT_TYPE[b.type] || "setup";
    if (type === "punch" || type === "closer") {
      const { lead, punch, tail } = splitPunch(b.text, b.punch);
      return { type, text: lead || b.text, punch, tail };
    }
    return { type, text: b.text };
  });
  return {
    comedianId: result.roasterId,
    bit: set.title || "Tonight's Set",
    runtime: estimateRuntime(set.beats || []),
    beats,
  };
}
