// RoastMyRide — the roast pipeline BOUNDARY.
//
// Screens import `generateRoast` from HERE, never from the mock directly. This
// file is the single swap point: when `services/brain` ships, replace the one
// line below with the real client and nothing in the screens changes.
//
//   // before (the mock milestone):
//   export { generateRoast } from "./roast.mock.js";
//
//   // now (the real brain — one-line drop-in, same signature):
//   export { generateRoast } from "@callies-universe/brain";
//
// The shape is locked by the contract, so the swap is type-safe. The brain
// returns the EVOLVED RoastResult (structured set + research + grade) while
// preserving every legacy field the screens already read. When no API key is
// present, the brain falls back to its own deterministic offline path, so the
// app still runs with no network (dev/CI). `roast.mock.js` is retained for
// reference but is no longer the wired implementation.
//
// SWAPPED: the real brain is now live.
export { generateRoast } from "@callies-universe/brain";
