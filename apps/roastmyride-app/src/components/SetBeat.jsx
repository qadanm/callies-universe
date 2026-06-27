// RoastMyRide — SetBeat [ROASTMYRIDE-NEW: app-layer].
//
// Renders one beat of the stand-up set transcript by type:
//   setup  — a muted lead-in line
//   punch  — the big display line, with the punch word in a yellow sticker
//   crowd  — a "🎤 crowd work" aside, with Callie reacting (the audience)
//   closer — the "🎤 mic drop": the final big line + highlighted payload
//
// CORE-REUSED: Callie (reacts on crowd beats; she never takes the mic).
import React from "react";
import { Callie } from "@callies-universe/core";

function Highlighted({ text, punch, tail }) {
  if (!punch) return <>{text}</>;
  return (
    <>
      {text}
      <mark
        style={{
          background: "var(--sticker-yellow)", color: "var(--ink)",
          padding: "0 6px", borderRadius: 8, boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        }}
      >
        {punch}
      </mark>
      {tail}
    </>
  );
}

export function SetBeat({ beat }) {
  const { type } = beat;

  if (type === "setup") {
    return (
      <p style={{ margin: 0, font: "var(--type-lead)", color: "var(--text-muted)" }}>{beat.text}</p>
    );
  }

  if (type === "crowd") {
    return (
      <div
        style={{
          display: "flex", alignItems: "center", gap: "var(--space-3)",
          padding: "var(--space-3)", borderRadius: "var(--radius-lg)",
          background: "var(--heat-300)",
        }}
      >
        <Callie state="savage" size={40} />
        <div>
          <div style={{ font: "var(--type-cap)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ember-600)", fontWeight: 800 }}>
            🎤 crowd work
          </div>
          <p style={{ margin: "2px 0 0", font: "var(--type-body)", color: "var(--ink)" }}>{beat.text}</p>
        </div>
      </div>
    );
  }

  // punch + closer share the big display treatment; closer gets the mic-drop tag.
  const isCloser = type === "closer";
  return (
    <div>
      {isCloser && (
        <div style={{ font: "var(--type-cap)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ember-600)", fontWeight: 800, marginBottom: 4 }}>
          🎤 mic drop
        </div>
      )}
      <p
        style={{
          margin: 0,
          font: isCloser ? "var(--type-d2)" : "var(--type-d3)",
          fontSize: isCloser ? 28 : 22,
          lineHeight: 1.15,
          color: "var(--ink)",
          textWrap: "balance",
        }}
      >
        <Highlighted text={beat.text} punch={beat.punch} tail={beat.tail} />
      </p>
    </div>
  );
}
