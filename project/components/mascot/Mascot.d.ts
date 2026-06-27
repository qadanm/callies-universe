/**
 * Callie — the mascot of Callie's Universe and the face of every app: a kawaii
 * calico cat (cream + ginger + charcoal), reused everywhere via a named state
 * system. Callie reacts, never narrates. Swappable PLACEHOLDER art.
 *
 * Exported as `Callie`/`CallieHost` (preferred) and `Mascot`/`MascotHost`
 * (legacy aliases — identical art/behavior).
 *
 * @startingPoint section="Brand" subtitle="Callie the calico — 9-state mascot" viewport="700x320"
 */
export type CallieState =
  | "idle" | "curious" | "cooking" | "delighted" | "savage"
  | "comfort" | "celebrating" | "empty" | "error";

export interface MascotProps {
  /** One of Callie's nine canonical expression states. */
  state?: CallieState;
  size?: number;
  /** Show the state's small extra (steam, sparkle, tear, sweat). Default true. */
  accessory?: boolean;
  /** Stamp a "PLACEHOLDER" tag so reviewers know this art is meant to be swapped. */
  placeholderTag?: boolean;
  /** Force the calm, non-looping render (mirrors prefers-reduced-motion). */
  reduceMotion?: boolean;
  style?: React.CSSProperties;
}
/** Renders Callie. `Callie` and `Mascot` are identical. */
export function Mascot(props: MascotProps): JSX.Element;
export function Callie(props: MascotProps): JSX.Element;

/**
 * Callie's behavior layer: plays an entrance state per context, idle-cycles a
 * context pool, reacts to a transient `event`, and floats an optional
 * Clippy-style tip. Personality is data (CALLIE_SCRIPT in Mascot.jsx).
 */
export interface MascotHostProps {
  context?:
    | "onboarding" | "home" | "seasoning" | "cast" | "roaster" | "cooking"
    | "reveal" | "celebrate" | "paywall" | "settings" | "call" | "empty" | "error";
  event?: string | null;
  size?: number;
  bubble?: boolean;
  bubblePlacement?: "top" | "right" | "left";
  reduceMotion?: boolean;
  style?: React.CSSProperties;
}
/** `CallieHost` and `MascotHost` are identical. */
export function MascotHost(props: MascotHostProps): JSX.Element;
export function CallieHost(props: MascotHostProps): JSX.Element;
