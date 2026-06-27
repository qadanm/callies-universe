// services/brain — Callie's reaction states (by name, from the core 9).
//
// The two-performer rule holds: the CAST performs the roast, Callie only REACTS.
// The brain returns which of Callie's nine CORE states to fire — by name — so
// the app doesn't have to infer it. Callie's art + behavior stay in core; the
// brain just names the states.
//
// Core states (the only allowed values): idle · curious · cooking · delighted ·
// savage · comfort · celebrating · empty · error.

/** Display spice → Callie's headline reaction at the reveal. */
const SPICE_REACTION = {
  mild: "delighted",
  medium: "savage",
  savage: "savage",
};

/**
 * Decide Callie's reaction from the display spice and the grade. A set that
 * scored very high on edge/funny earns the full "savage" delight; a gentler set
 * lands on "delighted".
 *
 * @returns {{ reaction: import("@callies-universe/core").CallieState, sequence: import("@callies-universe/core").CallieState[] }}
 */
export function reactionFor(displaySpice, grade) {
  let reaction = SPICE_REACTION[displaySpice] || "delighted";
  if (grade && grade.scores) {
    const heat = (grade.scores.edge || 0) + (grade.scores.funny || 0);
    if (heat >= 16) reaction = "savage";
    else if (reaction === "savage" && heat < 12) reaction = "delighted";
  }
  // The reveal plays a quick arc: lands the bit, then settles into the reaction.
  const sequence = reaction === "savage" ? ["savage", "celebrating"] : ["delighted", "celebrating"];
  return { reaction, sequence };
}
