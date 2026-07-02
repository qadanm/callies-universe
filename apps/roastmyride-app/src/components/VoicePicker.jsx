// The 2-voice picker + the real voice-preview UI. This is the heart of the app:
// pick the two voices that will roast the car, and HEAR each one first.
//
// - Tap a card to select it (exactly two; a third tap swaps out the oldest).
// - Tap "Hear voice" to play that voice's real sample clip (voicePreview.js).
//   While playing, the button becomes an animated equalizer.
import React, { useEffect, useState } from "react";
import { Roaster } from "@callies-universe/core";
import { haptic } from "../native.js";
import { playPreview, stopPreview, subscribe, playingId } from "../services/voicePreview.js";

const firstName = (name) => String(name || "").replace(/[“"].*$/, "").split(" ")[0];

/** Subscribe a component to "which voice is currently playing". */
export function usePlayingVoice() {
  const [id, setId] = useState(playingId());
  useEffect(() => subscribe(setId), []);
  return id;
}

/** The active (non comingSoon) voices. */
export function activeVoices() {
  return Roaster.roster.filter((r) => !r.comingSoon);
}

/**
 * VoicePicker: grid of voice cards. `selected` is an ordered array of up to two
 * ids; `onChange(nextIds)` fires on every pick. Selecting a third swaps the oldest.
 */
export function VoicePicker({ selected = [], onChange, size = 68 }) {
  const voices = activeVoices();
  const toggle = (id) => {
    haptic();
    let next;
    if (selected.includes(id)) next = selected.filter((x) => x !== id);
    else if (selected.length < 2) next = [...selected, id];
    else next = [selected[1], id]; // drop the oldest, keep it forgiving
    onChange && onChange(next);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
      {voices.map((v) => (
        <VoiceCard
          key={v.id}
          voice={v}
          size={size}
          slot={selected.indexOf(v.id)}
          onSelect={() => toggle(v.id)}
        />
      ))}
    </div>
  );
}

function VoiceCard({ voice, size, slot, onSelect }) {
  const playing = usePlayingVoice() === voice.id;
  const [unavailable, setUnavailable] = useState(false);
  const picked = slot >= 0;

  const preview = async (e) => {
    e.stopPropagation();
    haptic();
    try {
      await playPreview(voice.id);
      setUnavailable(false);
    } catch {
      setUnavailable(true); // clip not shipped yet → gentle state, no crash
    }
  };

  return (
    <button
      onClick={onSelect}
      role="checkbox"
      aria-checked={picked}
      aria-label={`${voice.name}${picked ? ", selected" : ""}`}
      data-testid={`voice-${voice.id}`}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "var(--space-3) var(--space-2) var(--space-2)",
        borderRadius: "var(--radius-card)",
        cornerShape: "var(--corner-card)",
        border: `2.5px solid ${picked ? "var(--ember-600)" : "var(--hairline)"}`,
        background: picked ? "var(--surface)" : "var(--canvas-sink)",
        boxShadow: picked ? "var(--gloss-card)" : "none",
        cursor: "pointer",
        transition: "border-color .15s, background .15s",
      }}
    >
      {/* selection badge: A / B so the order (who leads) reads clearly */}
      <span style={{ ...selBadge, ...(picked ? selOn : selOff) }}>{picked ? (slot === 0 ? "A" : "B") : ""}</span>

      <Roaster id={voice.id} size={size} ring />
      <span style={{ font: "var(--type-d4)", color: "var(--ink)", lineHeight: 1.1 }}>{firstName(voice.name)}</span>
      <span style={{ font: "var(--type-legal)", color: "var(--text-hint)", textAlign: "center", minHeight: 14 }}>{voice.register}</span>

      {/* the real preview control */}
      <span
        onClick={preview}
        role="button"
        aria-label={playing ? `Stop ${firstName(voice.name)}` : `Hear ${firstName(voice.name)}`}
        style={{
          marginTop: 2,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          minHeight: 34,
          width: "100%",
          borderRadius: "var(--radius-pill)",
          cornerShape: "var(--corner-chip)",
          border: `1.5px solid ${playing ? "var(--ember-600)" : "var(--hairline)"}`,
          background: playing ? "var(--ember-600)" : "var(--surface)",
          color: playing ? "#fff" : unavailable ? "var(--text-hint)" : "var(--ember-600)",
          font: "var(--type-cap)",
          fontWeight: 800,
        }}
      >
        {playing ? <><Equalizer /> Playing</> : unavailable ? "Preview soon" : <>▶ Hear voice</>}
      </span>
    </button>
  );
}

/** Three animated bars while a clip plays (see @keyframes rmr-eq in app.css). */
function Equalizer() {
  return (
    <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 13 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 3, height: 13, borderRadius: 2, background: "#fff", transformOrigin: "bottom", animation: `rmr-eq 0.8s ease-in-out ${i * 0.15}s infinite` }} />
      ))}
    </span>
  );
}

const selBadge = {
  position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "var(--radius-pill)",
  display: "flex", alignItems: "center", justifyContent: "center",
  font: "var(--type-cap)", fontWeight: 800, fontSize: 12,
};
const selOn = { background: "var(--ember-600)", color: "#fff", border: "2px solid var(--canvas)" };
const selOff = { background: "transparent", border: "2px solid var(--hairline)", color: "transparent" };
