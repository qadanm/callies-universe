/**
 * @callies-universe/brain — the EVOLVED roast contract.
 *
 * This supersedes RoastMyRide's mock contract (apps/roastmyride-app/src/services/
 * roast.contract.d.ts). The function signature is UNCHANGED —
 *
 *     generateRoast(input: RoastInput): Promise<RoastResult>
 *
 * — so the app's swap point (roast.js) stays a one-liner. What grows is the
 * payload on both sides:
 *
 *   INPUT  — gains the car IDENTITY (so the brain can research the real car) on
 *            top of the fields the app already collected.
 *   OUTPUT — grows from a flat string into a structured, graded stand-up SET:
 *            the performed bit (beats), the performing character, the live
 *            research that grounded it, the grader's scores, and the Callie
 *            reaction state(s) to fire.
 *
 * The legacy fields (`segments`, `plainText`, `spice`, `reaction`, `roasterName`,
 * `register`, `durationMs`) are PRESERVED so existing screens (Reveal, ShareCard)
 * keep rendering with zero changes; new screens read the richer fields.
 *
 * --- CONTRACT DELTA (mock → brain) -----------------------------------------
 *  RoastInput:
 *    + car            : the make/model/year/trim to research (NEW)
 *    ~ carPhoto       : may now carry a photo-derived `identified` car (NEW field)
 *    = personal, roasterId, context  (unchanged)
 *  RoastResult:
 *    + set            : the structured stand-up set (beats) (NEW)
 *    + performer      : the performing character + their comedic identity (NEW)
 *    + research       : the live material that grounded the set + sources (NEW)
 *    + grade          : the grader's scores + verdict + AI-tells caught (NEW)
 *    + reactionSequence : ordered Callie states to fire across the reveal (NEW)
 *    + engine         : "live" | "offline" — which path produced this (NEW)
 *    = id, roasterId, roasterName, register, spice, segments, plainText,
 *      reaction, durationMs  (unchanged — legacy render surface)
 * ---------------------------------------------------------------------------
 */
import type { CallieState, RoasterId } from "@callies-universe/core";

/* ============================ INPUT ============================ */

/** A specific car to roast. Whatever is known is used to research it. */
export interface CarIdentity {
  year?: number | string;
  make?: string;
  model?: string;
  trim?: string;
  /** Free-form fallback if structured fields aren't available. */
  label?: string;
}

/** What the app collects across the flow and hands to the brain. */
export interface RoastInput {
  /** The car photo. Presence is tracked; `identified` carries any photo-derived ID. */
  carPhoto?: { present: boolean; identified?: CarIdentity | null };
  /** The car to research. Optional: the brain defaults to a representative car
   *  when neither this nor a photo-derived id is present (until photo-ID ships). */
  car?: CarIdentity | null;
  /** Optional selfie / profile screenshot from the "profile-roast" step. */
  personal?: { present: boolean; kind: "selfie" | "profile" | null };
  /** Which cast member performs the roast. */
  roasterId: RoasterId;
  /** Free-form context chips the user toggled (heat / angle / vibe). */
  context?: string[];
  /** Optional brain config (model id, candidate count, api key override). Dev/test only. */
  config?: BrainConfig;
}

export interface BrainConfig {
  apiKey?: string;
  /** Model for research + grading (the cheap "utility" stage). Default Haiku 4.5.
   *  Env: BRAIN_MODEL. */
  model?: string;
  /** Model for writing the set (the "funny" stage). Default Sonnet 4.6.
   *  Env: BRAIN_WRITE_MODEL. Set to claude-opus-4-8 for premium voice. */
  writeModel?: string;
  /** Candidates generated per round before grading (best-of-N). Default 2. */
  candidates?: number;
  /** Max regeneration rounds if nothing passes the rubric. Default 2. */
  maxRounds?: number;
  /** Force the offline path even if a key is present (deterministic tests). */
  offline?: boolean;

  /* --- research cache --- */
  /** Inject a shared/persistent store so a car is researched once across all
   *  users. Any object with async get(key)/set(key,value) (Redis, Upstash,
   *  Supabase, KV…). When set, it supersedes the default filesystem cache. */
  researchCache?: { get(key: string): Promise<any>; set(key: string, value: any): Promise<void> };
  /** Force in-process-only caching (no disk). Mainly for tests. */
  cacheMode?: "memory";
  /** Override the filesystem cache directory (Node). Env: BRAIN_CACHE_DIR. */
  cacheDir?: string;
  /** Research freshness TTL in ms (default 30 days). Env: BRAIN_CACHE_TTL_MS. */
  cacheTtlMs?: number;
}

/* ============================ RESEARCH ============================ */

export interface ResearchSource {
  title: string;
  url: string;
}

/** Structured material captured from the live research pass. */
export interface CarResearch {
  car: CarIdentity;
  /** One-paragraph synthesis of the car's real reputation. */
  summary: string;
  /** The running jokes people actually make about this car. */
  runningJokes: string[];
  /** Known, real problems / quirks (reliability, design, culture-around-it). */
  knownProblems: string[];
  /** Verbatim-flavored "what people say" lines, current. */
  whatPeopleSay: string[];
  /** Sources the material came from. */
  sources: ResearchSource[];
  /** True if the car was defaulted (no identity supplied) — flags un-grounded runs. */
  defaulted?: boolean;
  /** True when produced by the offline path (no live search). */
  offline?: boolean;
}

/* ============================ THE SET ============================ */

export type BeatType =
  | "opener"
  | "setup"
  | "punchline"
  | "act-out"
  | "crowd-work"
  | "callback"
  | "tag"
  | "closer";

export interface SetBeat {
  type: BeatType;
  text: string;
  /** The highlighted punch-word inside `text`, if any (drives ShareCard emphasis). */
  punch?: string;
}

/** A short stand-up set, shaped to the performing character. */
export interface StandUpSet {
  /** A short, punchy bit title (the billing for the set). */
  title: string;
  /** The structured beats, in performance order. */
  beats: SetBeat[];
  /** One line on how this set is shaped to THIS character's comedic form. */
  performanceNote: string;
}

/* ============================ GRADE ============================ */

/** The anti-cringe rubric, scored 0–10 per axis. */
export interface RubricScores {
  /** Would a real audience laugh, not groan? */
  funny: number;
  /** Sounds human, not AI. The reject axis — low here fails outright. */
  human: number;
  /** Grounded in THIS car's real, specific reputation (not generic filler). */
  specific: number;
  /** Pushes PG-13 hard without crossing; aimed at the car, never a group/culture. */
  edge: number;
  /** In THIS character's voice and comedic structure. */
  voice: number;
}

/** A corny / sounds-like-AI phrasing the grader caught, with its severity. */
export interface AiTell {
  /** major = genuinely corny, sinks the set; minor = a small nit that mostly lands. */
  severity: "minor" | "major";
  note: string;
}

export interface Grade {
  scores: RubricScores;
  /** Weighted composite (0–10). */
  composite: number;
  /** Did it clear the bar on every gate? (1 major tell, or >1 minor, fails.) */
  pass: boolean;
  /** Specific AI-tells the grader caught, with severity (empty on a clean pass). */
  aiTells: AiTell[];
  /** The grader's one-line justification. */
  reasoning: string;
  /** How many candidates were generated and how many rounds it took. */
  candidates: number;
  rounds: number;
}

/* ============================ RESULT ============================ */

/** Legacy run-of-copy segment (kept so ShareCard renders unchanged). */
export interface RoastSegment {
  text: string;
  punch?: boolean;
}

export interface PerformerSummary {
  id: RoasterId;
  name: string;
  tag: string;
  register: string;
  /** One line describing how this character does stand-up (the comedic identity). */
  comedicIdentity: string;
}

export interface RoastResult {
  id: string;
  roasterId: RoasterId;
  /** The voice persona who delivered it (the cast performs; Callie only reacts). */
  roasterName: string;
  /** The persona's register, e.g. "Church-fan snap". */
  register: string;
  /** Display spice level for the ShareCard tag. */
  spice: "mild" | "medium" | "savage";

  /* --- legacy render surface (unchanged shapes) --- */
  /** Flattened headline segments with punch-words (ShareCard reads this). */
  segments: RoastSegment[];
  /** Flattened plain text (share/copy/analytics). */
  plainText: string;
  /** The single Callie state the reveal shows. */
  reaction: CallieState;
  /** Generation time (ms). */
  durationMs: number;

  /* --- evolved, structured fields --- */
  /** The full performed stand-up set. */
  set: StandUpSet;
  /** Who performed it + their comedic identity. */
  performer: PerformerSummary;
  /** The live research that grounded the set. */
  research: CarResearch;
  /** The grader's scores + verdict. */
  grade: Grade;
  /** Ordered Callie states to fire across the reveal (by core-state name). */
  reactionSequence: CallieState[];
  /** Which path produced this set. */
  engine: "live" | "offline";
}

/**
 * Generate a graded, character-shaped stand-up roast for the given input.
 * Async + Promise-returning so the live service is a drop-in for the mock.
 * Never throws on a missing key or a network failure — it falls back to the
 * deterministic offline brain instead.
 */
export function generateRoast(input: RoastInput): Promise<RoastResult>;
