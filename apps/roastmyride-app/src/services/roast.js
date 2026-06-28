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
//
// Server-side seam: when a backend is configured (VITE_ROAST_API), the brain runs
// SERVER-SIDE (POST /roast) where the API key + SDK live — that's the only place
// the LIVE, research-driven comedy actually runs. With no backend, or on any
// failure, we run the brain IN-BROWSER, which has no key/SDK and so returns the
// deterministic offline set (today's behavior). Either way the screens are unchanged.
import { generateRoast as brainInBrowser } from "@callies-universe/brain";
import { hasRoastApi, roastViaApi } from "./roastApi.js";

export async function generateRoast(input) {
  if (hasRoastApi()) {
    try {
      return await roastViaApi(input);
    } catch (e) {
      console.warn(`[roast] live brain unavailable (${(e && e.message) || e}); using offline`);
    }
  }
  return brainInBrowser(input);
}
