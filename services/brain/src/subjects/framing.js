// services/brain — SUBJECT FRAMING.
//
// The writer and grader prompts are 95% subject-agnostic (the comedic DNA, the
// anti-AI bar, the rubric mechanics). The remaining 5% — the noun you're roasting
// ("a specific car" vs "someone's text messages"), the per-take angle nudges, and
// the two rubric axes that name the subject — lives HERE, one object per subject.
//
// CAR_FRAMING reproduces the original inline car wording VERBATIM, so the live car
// path stays byte-identical (asserted in scripts/subjects-check.mjs). New subjects
// supply their own framing; everything else in writeSet/gradeSet is shared.

import { AXIS_DESCRIPTIONS } from "../grading/rubric.js";

/** The display label for a car-shaped research object (the thing being roasted). */
export function carLabelOf(research) {
  const c = (research && research.car) || {};
  return c.label || [c.year, c.make, c.model, c.trim].filter(Boolean).join(" ") || "car";
}

/**
 * @typedef {Object} SubjectFraming
 * @property {string} roastTarget        writeSet system: "roast of {roastTarget}"
 * @property {string} possessive         writeSet rule 3: "Build on {possessive} REAL reputation"
 * @property {string} genericFiller      writeSet rule 3: the "not generic '{genericFiller}' filler" example
 * @property {string} aimTarget          writeSet rule 4: "Aim every joke at {aimTarget}"
 * @property {string} ownerNoun          writeSet rule 4: "never at ... the {ownerNoun}'s worth"
 * @property {string} fillerNoun         gradeSet system: "generic roast filler that fits any {fillerNoun}"
 * @property {string} gradeSubjectWord   gradeSet user: "{gradeSubjectWord} being roasted: ..."
 * @property {string[]} angles           best-of-N per-take angle nudges
 * @property {(research:object)=>string} subjectPhrase  writeSet user: "Perform your roast of {subjectPhrase}."
 * @property {(research:object)=>string} gradeLabel     gradeSet user: the label after "{gradeSubjectWord} being roasted: "
 * @property {Record<string,string>} axisDescriptions  the rubric axis copy the grader reads (defaults to the car-worded rubric)
 */

/** CAR — the reference subject. Values reproduce the original inline strings exactly. */
export const CAR_FRAMING = {
  roastTarget: "a specific car",
  possessive: "this car's",
  genericFiller: "your car is old",
  aimTarget: "the CAR",
  ownerNoun: "owner",
  fillerNoun: "car",
  gradeSubjectWord: "Car",
  submissionNoun: "cars", // "listeners send in photos of their ___"
  angles: [
    "Lead with the car's single most-roasted real flaw and build the set around it.",
    "Open with crowd work / a direct address, then pivot into the car's reputation.",
    "Structure it as an escalating run — each beat worse than the last, ending on the hardest line.",
    "Build around one specific, true, surprising detail from the research most people don't know.",
    "Frame the whole set through this character's signature device, start to finish.",
  ],
  subjectPhrase: (research) => `the ${carLabelOf(research)}`,
  gradeLabel: (research) => carLabelOf(research),
  axisDescriptions: AXIS_DESCRIPTIONS, // the default, car-worded rubric copy
};

/** TEXTS — roast the conversation and its dynamics, never the person. */
export const TEXTS_FRAMING = {
  roastTarget: "someone's text messages",
  possessive: "this conversation's",
  genericFiller: "your texts are dry",
  aimTarget: "the TEXTS",
  ownerNoun: "texter",
  fillerNoun: "text thread",
  gradeSubjectWord: "Conversation",
  submissionNoun: "texts", // "listeners send in screenshots of their ___"
  angles: [
    "Lead with the single most damning message or pattern in the thread and build the set around it.",
    "Open with crowd work about texting culture, then pivot into THIS thread's specific cringe.",
    "Structure it as an escalating run through the thread — each beat worse than the last, ending on the hardest line.",
    "Build around one specific, true, surprising detail in the conversation most people would skim past.",
    "Frame the whole set through this character's signature device, start to finish.",
  ],
  subjectPhrase: () => "this text conversation",
  gradeLabel: (research) => (research && research.texts && research.texts.label) || "a text conversation",
  axisDescriptions: {
    ...AXIS_DESCRIPTIONS,
    specific:
      "Is it grounded in THIS conversation's real, specific messages and dynamic — not generic " +
      "'your texts are dry' filler that would fit any thread?",
    edge:
      "Does it push PG-13 hard without crossing — edgy, never slurs/sexual/cruel, aimed at the TEXTS " +
      "and the dynamic, never at the person's worth or any group?",
  },
};

/** OUTFIT — roast the fit, the styling choices, never the person's body or worth. */
export const OUTFIT_FRAMING = {
  roastTarget: "someone's outfit",
  possessive: "this outfit's",
  genericFiller: "your outfit is bad",
  aimTarget: "the OUTFIT and the CHOICES",
  ownerNoun: "wearer",
  fillerNoun: "outfit",
  gradeSubjectWord: "Outfit",
  submissionNoun: "outfits", // "listeners send in photos of their ___"
  angles: [
    "Lead with the single most-roasted style choice or clash and build the set around it.",
    "Open with crowd work about fashion culture, then pivot into THIS outfit's specific crimes.",
    "Structure it as an escalating run — each beat worse than the last, ending on the hardest line.",
    "Build around one specific, true, surprising detail in the outfit most people would skim past.",
    "Frame the whole set through this character's signature device, start to finish.",
  ],
  subjectPhrase: (research) => `the ${(research && research.outfit && research.outfit.label) || "outfit"}`,
  gradeLabel: (research) => (research && research.outfit && research.outfit.label) || "an outfit",
  axisDescriptions: {
    ...AXIS_DESCRIPTIONS,
    specific:
      "Is it grounded in THIS outfit's real, specific style choices, fit, and details — not generic " +
      "'your outfit is bad' filler that would fit any photo?",
    edge:
      "Does it push PG-13 hard without crossing — edgy, never slurs/sexual/cruel, aimed at the OUTFIT " +
      "and the CHOICES, never at the person's body, worth, or any group?",
  },
};

/** ROOM — roast the decor, layout, and mess, never the person's worth. */
export const ROOM_FRAMING = {
  roastTarget: "someone's room",
  possessive: "this room's",
  genericFiller: "your room is messy",
  aimTarget: "the ROOM and the DECOR",
  ownerNoun: "occupant",
  fillerNoun: "room",
  gradeSubjectWord: "Room",
  submissionNoun: "rooms", // "listeners send in photos of their ___"
  angles: [
    "Lead with the single most-roasted decor choice or layout crime and build the set around it.",
    "Open with crowd work about living spaces, then pivot into THIS room's specific chaos.",
    "Structure it as an escalating run — each beat worse than the last, ending on the hardest line.",
    "Build around one specific, true, surprising detail in the room most people would skim past.",
    "Frame the whole set through this character's signature device, start to finish.",
  ],
  subjectPhrase: (research) => `the ${(research && research.room && research.room.label) || "room"}`,
  gradeLabel: (research) => (research && research.room && research.room.label) || "a room",
  axisDescriptions: {
    ...AXIS_DESCRIPTIONS,
    specific:
      "Is it grounded in THIS room's real, specific decor, layout, and details — not generic " +
      "'your room is messy' filler that would fit any photo?",
    edge:
      "Does it push PG-13 hard without crossing — edgy, never slurs/sexual/cruel, aimed at the ROOM " +
      "and the DECOR, never at the person's worth or any group?",
  },
};

/** PROFILE — roast the bio, prompts, and photo choices. NEVER the person's looks or worth. */
export const PROFILE_FRAMING = {
  roastTarget: "someone's dating/social profile",
  possessive: "this profile's",
  genericFiller: "your profile is bad",
  aimTarget: "the PROFILE CHOICES — bio, prompts, and photo composition",
  ownerNoun: "profile owner",
  fillerNoun: "profile",
  gradeSubjectWord: "Profile",
  submissionNoun: "profiles", // "listeners send in screenshots of their ___"
  angles: [
    "Lead with the single most-roasted bio cliché or photo choice and build the set around it.",
    "Open with crowd work about dating apps, then pivot into THIS profile's specific choices.",
    "Structure it as an escalating run — each beat worse than the last, ending on the hardest line.",
    "Build around one specific, true, surprising detail in the profile most people would skim past.",
    "Frame the whole set through this character's signature device, start to finish.",
  ],
  subjectPhrase: (research) => `the ${(research && research.profile && research.profile.label) || "profile"}`,
  gradeLabel: (research) => (research && research.profile && research.profile.label) || "a profile",
  axisDescriptions: {
    ...AXIS_DESCRIPTIONS,
    specific:
      "Is it grounded in THIS profile's real, specific bio, prompts, and photo choices — not generic " +
      "'your profile is bad' filler that would fit any screenshot?",
    edge:
      "Does it push PG-13 hard without crossing — edgy, never slurs/sexual/cruel, aimed at the " +
      "PROFILE CHOICES (bio, prompts, photo composition), NEVER at the person's looks, body, worth, or any group?",
  },
};
