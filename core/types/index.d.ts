/**
 * @callies-universe/core — public type contracts.
 *
 * Hand-authored to mirror the component `.d.ts` files in the design handoff.
 * The runtime is plain JSX; these declarations are the typed surface apps build
 * against. App-layer pieces (ShareCard, CreditTile) are intentionally absent.
 */
import * as React from "react";

/* ============================================================
   Core primitives
   ============================================================ */

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual role. primary = dominant accent CTA. */
  variant?: "primary" | "accent" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  /** Stretch to container width. */
  block?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}
export function Button(props: ButtonProps): JSX.Element;

export interface ChipProps {
  /** Selected = filled accent with a pop and a clear ✕ affordance. */
  selected?: boolean;
  /** Optional leading glyph/sticker. */
  emoji?: React.ReactNode;
  children?: React.ReactNode;
  /** Called with the next selected value. */
  onToggle?: (next: boolean) => void;
  style?: React.CSSProperties;
}
export function Chip(props: ChipProps): JSX.Element;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Decoration node pinned to a corner (the skin layer). */
  sticker?: React.ReactNode;
  stickerCorner?: "tl" | "tr" | "bl" | "br";
  /** Interior padding (CSS value or token). */
  pad?: string;
  children?: React.ReactNode;
}
export function Card(props: CardProps): JSX.Element;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  /** Error message — also flips border to danger and sets aria-invalid. */
  error?: string;
  iconLeft?: React.ReactNode;
}
export function Input(props: InputProps): JSX.Element;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "ember" | "flame" | "success" | "info" | "cool" | "pink" | "ink";
  children?: React.ReactNode;
}
export function Badge(props: BadgeProps): JSX.Element;

/* ============================================================
   Feedback
   ============================================================ */

export interface SheetProps {
  open?: boolean;
  title?: string;
  /** Optional node (e.g. <Callie/>) that hosts the header above the sheet. */
  header?: React.ReactNode;
  onClose?: () => void;
  /** Usually a <Button block> pinned to the bottom. */
  primaryAction?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Sheet(props: SheetProps): JSX.Element;

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "ink" | "success" | "danger" | "flame";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export function Toast(props: ToastProps): JSX.Element;

export interface ConfettiProps {
  count?: number;
  active?: boolean;
  style?: React.CSSProperties;
}
/** Decoration-only; renders nothing under prefers-reduced-motion. */
export function Confetti(props: ConfettiProps): JSX.Element | null;

/* ============================================================
   Callie — the 9-state mascot system
   ============================================================ */

export type CallieState =
  | "idle"
  | "curious"
  | "cooking"
  | "delighted"
  | "savage"
  | "comfort"
  | "celebrating"
  | "empty"
  | "error";

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
/** Renders Callie. `Callie` and `Mascot` are identical, purely presentational. */
export function Mascot(props: MascotProps): JSX.Element;
export function Callie(props: MascotProps): JSX.Element;

/** Imperative handle exposed by <CallieStage> via ref. */
export interface CallieController {
  /** Set Callie's expression by name — any of the nine states. */
  setState: (next: CallieState) => void;
  getState: () => CallieState;
}
export interface CallieStageProps extends Omit<MascotProps, "state"> {
  /** Starting expression before any imperative setState call. */
  initialState?: CallieState;
}
/**
 * Imperative wrapper over the same nine names. Drive it with a ref:
 * `callie.current.setState("savage")`. Keeps <Callie> presentational.
 */
export const CallieStage: React.ForwardRefExoticComponent<
  CallieStageProps & React.RefAttributes<CallieController>
>;

export type CallieContext =
  | "onboarding"
  | "home"
  | "seasoning"
  | "cast"
  | "roaster"
  | "cooking"
  | "reveal"
  | "celebrate"
  | "paywall"
  | "settings"
  | "call"
  | "empty"
  | "error";

export interface MascotHostProps {
  /** Which script entry drives entrance / idle pool / reactions / tips. */
  context?: CallieContext;
  /** Transient event name; maps to a reaction state via the script. */
  event?: string | null;
  size?: number;
  /** Float a dismissible, Clippy-style wordless tip bubble. */
  bubble?: boolean;
  bubblePlacement?: "top" | "right" | "left";
  reduceMotion?: boolean;
  style?: React.CSSProperties;
}
/**
 * Callie's behavior layer: plays an entrance state per context, idle-cycles a
 * context pool, reacts to a transient `event`, and floats an optional tip.
 * `CallieHost` and `MascotHost` are identical.
 */
export function MascotHost(props: MascotHostProps): JSX.Element;
export function CallieHost(props: MascotHostProps): JSX.Element;

/* ============================================================
   The character cast
   ============================================================ */

export type RoasterId =
  | "reginald"
  | "tony"
  | "abuomar"
  | "mama"
  | "mateo"
  | "jeanluc"
  | "priya"
  | "kenji";

export interface RoasterEntry {
  id: RoasterId;
  name: string;
  tag: string;
  register: string;
  spice: "Mild" | "Medium" | "Spicy";
  phrase: string;
  ring: string;
}

export interface RoasterProps {
  /** Which cast member. */
  id?: RoasterId;
  size?: number;
  /** Draw the character's signature background ring (for picker tiles). */
  ring?: boolean;
  style?: React.CSSProperties;
}
/** Roaster avatar. Static `Roaster.roster` carries the full cast metadata. */
export function Roaster(props: RoasterProps): JSX.Element;
export namespace Roaster {
  /** The cast, in display order. Add an entry to extend the universe. */
  const roster: RoasterEntry[];
}

export interface CastPickerProps {
  /** Roaster id to start on. */
  initialId?: RoasterId | string;
  /** Called with the full roster entry whenever the selection changes. */
  onChange?: (roaster: RoasterEntry) => void;
  style?: React.CSSProperties;
}
/** Featured roaster + tap-to-switch grid; reads Roaster.roster so it auto-extends. */
export function CastPicker(props: CastPickerProps): JSX.Element;
