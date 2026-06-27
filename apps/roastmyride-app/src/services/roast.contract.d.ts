/**
 * RoastMyRide — the roast pipeline contract (the service-shaped SEAM).
 *
 * This is the boundary between the app and roast "generation". Today it is
 * fulfilled by a mock (`roast.mock.js`). Tomorrow it is fulfilled by the real
 * `services/brain` render service. The CONTRACT below does not change when that
 * swap happens — only the implementation behind `generateRoast` does. That is
 * the whole point: swapping the mock for the real service is a one-line change
 * in `roast.js`, never a refactor of the screens.
 *
 * Screens depend ONLY on this contract, never on the mock directly.
 */
import type { CallieState, RoasterId } from "@callies-universe/core";

/** What the app collects across the flow and hands to the pipeline. */
export interface RoastInput {
  /** The car photo (mocked — we only track presence this milestone). */
  carPhoto: { present: boolean };
  /** Optional selfie / profile screenshot from the "profile-roast" step. */
  personal: { present: boolean; kind: "selfie" | "profile" | null };
  /** Which cast member voices the roast. */
  roasterId: RoasterId;
  /** Free-form context chips the user toggled (heat / angle / vibe). */
  context: string[];
}

/** One run of roast copy. `punch` marks the highlighted "punch-word". */
export interface RoastSegment {
  text: string;
  punch?: boolean;
}

/** The pipeline's output — feeds the Reveal screen + drives Callie's reaction. */
export interface RoastResult {
  id: string;
  roasterId: RoasterId;
  /** The voice persona who delivered it (the cast performs; Callie only reacts). */
  roasterName: string;
  /** The persona's register, e.g. "Church-fan snap". */
  register: string;
  /** Display spice level for the ShareCard tag. */
  spice: "mild" | "medium" | "savage";
  /** The roast copy, with punch-word segments. */
  segments: RoastSegment[];
  /** Flattened plain text (for share/copy/analytics). */
  plainText: string;
  /**
   * How CALLIE should REACT to this roast — a core state name, by name.
   * The app owns this mapping (see callieReactions.js); Callie's art is core.
   */
  reaction: CallieState;
  /** Simulated generation time (ms) the Cooking screen paces against. */
  durationMs: number;
}

/**
 * Generate a roast for the given input. Async + Promise-returning so the real
 * service (network call) is a drop-in for the mock with no signature change.
 */
export function generateRoast(input: RoastInput): Promise<RoastResult>;
