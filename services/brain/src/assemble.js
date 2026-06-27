// services/brain — assemble the evolved RoastResult from the parts.
//
// Builds the structured result AND the legacy render surface (segments,
// plainText) so the existing Reveal screen + ShareCard render unchanged while
// new screens read the richer fields.

import { reactionFor } from "./reactions.js";

let counter = 0;

/**
 * Flatten the set into the legacy headline `segments` (with punch words) the
 * ShareCard renders. We use the hardest punchline beat as the headline so the
 * share card always leads with a landing line.
 */
export function setToSegments(set) {
  const beats = set.beats || [];
  const headline =
    beats.find((b) => b.type === "punchline" && b.punch) ||
    beats.find((b) => b.type === "punchline") ||
    beats.find((b) => b.type === "closer") ||
    beats[beats.length - 1] ||
    { text: "", punch: undefined };

  const text = headline.text || "";
  const punch = headline.punch;
  if (punch && text.includes(punch)) {
    const i = text.indexOf(punch);
    const segs = [];
    if (i > 0) segs.push({ text: text.slice(0, i) });
    segs.push({ text: punch, punch: true });
    const rest = text.slice(i + punch.length);
    if (rest) segs.push({ text: rest });
    return segs;
  }
  return [{ text }];
}

export function setToPlainText(set) {
  return (set.beats || []).map((b) => b.text).join(" ").trim();
}

/**
 * @param {object} args
 * @returns {import("../contract").RoastResult}
 */
export function buildResult({ performer, research, set, grade, engine, durationMs }) {
  const { reaction, sequence } = reactionFor(performer.displaySpice, grade);
  return {
    id: `roast_${++counter}`,
    roasterId: performer.id,
    roasterName: performer.name,
    register: performer.register,
    spice: performer.displaySpice,

    // legacy render surface
    segments: setToSegments(set),
    plainText: setToPlainText(set),
    reaction,
    durationMs,

    // evolved fields
    set,
    performer: {
      id: performer.id,
      name: performer.name,
      tag: performer.tag,
      register: performer.register,
      comedicIdentity: performer.comedicIdentity,
    },
    research,
    grade,
    reactionSequence: sequence,
    engine,
  };
}
