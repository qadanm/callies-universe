// services/brain — assemble the evolved RoastResult from the parts.
//
// Builds the structured result AND the legacy render surface (segments,
// plainText) so the existing Reveal screen + ShareCard render unchanged while
// new screens read the richer fields.

import { reactionFor } from "./reactions.js";
import { usageCost } from "./model/claude.js";

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
 * @param {object} [args.performers]  for the panel format: both performers [A, B].
 *   The legacy single fields (roasterId/roasterName/performer) stay = A.
 * @param {"single"|"panel"} [args.format]
 * @returns {import("../contract").RoastResult}
 */
export function buildResult({ performer, performers, format, research, set, grade, engine, durationMs, usage, degraded }) {
  const { reaction, sequence } = reactionFor(performer.displaySpice, grade);
  const usageList = usage || []; // offline → [] (no tokens)
  const tokensIn = usageList.reduce((n, u) => n + (u.inputTokens || 0), 0);
  const tokensOut = usageList.reduce((n, u) => n + (u.outputTokens || 0), 0);
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
    // Format + cast: "single" carries one performer (above); "panel" adds both.
    format: format || "single",
    ...(performers && performers.length
      ? { performers: performers.map((p) => ({ id: p.id, name: p.name, tag: p.tag, register: p.register, comedicIdentity: p.comedicIdentity })) }
      : {}),
    // true only when a LIVE attempt failed and we fell back (don't bill the user).
    degraded: !!degraded,

    // cost & usage telemetry (brain/model spend; offline → zero)
    usage: { models: usageList, tokensIn, tokensOut },
    cost: { usd: usageCost(usageList), currency: "usd" },
  };
}
