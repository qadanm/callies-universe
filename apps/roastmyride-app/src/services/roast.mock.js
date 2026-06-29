// RoastMyRide: MOCK roast pipeline [ROASTMYRIDE-NEW].
//
// Fulfils the `generateRoast` contract (see roast.contract.d.ts) with canned
// data. No model, no network, no services/, just enough to drive the flow:
// it returns a roast for the chosen cast member and the Callie reaction state.
//
// It reads the cast metadata (name/register/spice) straight from the CORE roster
// [CORE-REUSED] so the mock never duplicates cast data. Only the canned lines
// live here.

import { Roaster } from "@callies-universe/core";
import { ROAST_REACTION } from "../callieReactions.js";

/** Canned roast copy per cast member: every joke aimed at the CAR, PG-13. */
const LINES = {
  reginald: [
    { text: "Observe: the rare hatchback, motionless in " },
    { text: "a spot it will never leave", punch: true },
    { text: "." },
  ],
  tony: [
    { text: "What is this? A bumper held on by " },
    { text: "vibes and prayer", punch: true },
    { text: "? Get outta here." },
  ],
  abuomar: [
    { text: "My son… the car, I do not love. " },
    { text: "Even the rust looks tired", punch: true },
    { text: "." },
  ],
  mama: [
    { text: "Mm-mm-MM. Baby, this paint job is " },
    { text: "a cry for help", punch: true },
    { text: ", and I'm answering." },
  ],
  mateo: [
    { text: "The car... it has broken " },
    { text: "my heart AND the axle", punch: true },
    { text: "." },
  ],
  jeanluc: [
    { text: "It is a car. It is beige. I am, how you say… " },
    { text: "unmoved", punch: true },
    { text: "." },
  ],
  priya: [
    { text: "Sharma-ji's son has better, but " },
    { text: "those rims are trying", punch: true },
    { text: ", beta." },
  ],
  kenji: [
    { text: "…Hm. " },
    { text: "It is a car.", punch: true },
  ],
};

/** Map the roster's spice label → the ShareCard display spice. */
const SPICE_DISPLAY = { Mild: "mild", Medium: "medium", Spicy: "savage" };

let counter = 0;

/** @type {import("./roast.contract").generateRoast} */
export function generateRoast(input) {
  const entry =
    Roaster.roster.find((r) => r.id === input.roasterId) || Roaster.roster[0];

  const segments = LINES[entry.id] || LINES.mama;
  const spice = SPICE_DISPLAY[entry.spice] || "savage";
  // App-owned reaction mapping → a core Callie state, BY NAME.
  const reaction = ROAST_REACTION[spice] || "delighted";
  const durationMs = 3800;

  const result = {
    id: `roast_${++counter}`,
    roasterId: entry.id,
    roasterName: entry.name,
    register: entry.register,
    spice,
    segments,
    plainText: segments.map((s) => s.text).join(""),
    reaction,
    durationMs,
  };

  // Simulate the async render the real service will perform.
  return new Promise((resolve) => setTimeout(() => resolve(result), durationMs));
}
