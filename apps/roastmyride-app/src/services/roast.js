// RoastMyRide — the roast pipeline BOUNDARY.
//
// Screens import `generateRoast` from HERE, never from the mock directly. This
// file is the single swap point: when `services/brain` ships, replace the one
// line below with the real client and nothing in the screens changes.
//
//   // today (this milestone):
//   export { generateRoast } from "./roast.mock.js";
//
//   // tomorrow (one-line drop-in, same contract):
//   export { generateRoast } from "@callies-universe/brain";
//
// The shape is locked by roast.contract.d.ts, so the swap is type-safe.

export { generateRoast } from "./roast.mock.js";
