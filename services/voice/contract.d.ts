// @callies-universe/voice — contract.
//
// synthesizeSet turns the display beats of a stand-up set into per-beat spoken
// audio clips, each with a REAL duration, so the render's timeline (captions +
// scene motion) tracks the actual performance. Runs server-side (TTS keys, cost)
// — the render service calls it before rendering and feeds the clips into the
// Remotion composition.

import type { RoasterId } from "@callies-universe/core";

/** One display beat (from the app's standup adapter). */
export interface SpeakableBeat {
  type: "setup" | "punch" | "crowd" | "closer";
  text: string;
  punch?: string;
  tail?: string;
  /** PANEL only: which comic speaks this line. When set, synthesizeSet voices the
   *  line in THIS performer's voice (per-line), overriding the passed performer. */
  performerId?: RoasterId;
  /** PANEL only: the speaker slot ("a"|"b") this line belongs to. */
  speaker?: "a" | "b";
}

/** A synthesized line for one beat. */
export interface VoiceClip {
  index: number;
  /** Spoken audio as a data URL (audio/mpeg or audio/wav). */
  dataUrl: string;
  mime: string;
  /** Real clip length in ms — drives the performance timeline. */
  durationMs: number;
  /** The text that was spoken (beat text flattened). */
  text: string;
  /** Per-word timings (ms, relative to the clip start) for karaoke captions.
   *  Present when the provider returns alignment; absent offline → even-time fallback. */
  words?: { text: string; startMs: number; endMs: number }[];
}

export interface SynthesizedSet {
  clips: VoiceClip[];
  /** true if a real TTS provider voiced it; false = silent offline fallback. */
  voiced: boolean;
  /** "elevenlabs" | "offline" | the provider id. */
  engine: string;
  /** Per-beat durations (ms), in beat order — convenience for timeline building. */
  durationsMs: number[];
  /** Total characters synthesized (cost telemetry; provider bills by character). */
  charCount: number;
}

export interface VoiceConfig {
  apiKey?: string;
  /** Provider id (default "elevenlabs"). */
  provider?: string;
  /** Per-roaster voice id overrides: { mama: "<elevenlabs voice id>", ... }. */
  voices?: Partial<Record<RoasterId, string>>;
  /** Force the deterministic silent path even if a key is present (tests). */
  offline?: boolean;
}

/**
 * Synthesize the set. Never throws on a missing key / provider error — falls
 * back to deterministic silent clips (with estimated durations) so the render
 * pipeline always runs.
 */
export function synthesizeSet(
  beats: SpeakableBeat[],
  performer: { id: RoasterId; name: string },
  config?: VoiceConfig
): Promise<SynthesizedSet>;
