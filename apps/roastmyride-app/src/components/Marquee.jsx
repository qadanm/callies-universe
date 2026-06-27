// RoastMyRide — Marquee [ROASTMYRIDE-NEW: app-layer].
//
// The playbill header for "Tonight's lineup" — a lightbulb-framed theatre
// marquee. Pure decoration over core's clean bones; text stays AA.
import React from "react";

export function Marquee({ kicker = "Tonight only", title, children }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-4) var(--space-5)",
        textAlign: "center",
        color: "var(--on-ember)",
        background: "radial-gradient(120% 90% at 50% 0%, #FF8330 0%, #C7340F 70%)",
        boxShadow: "var(--elev-3)",
        border: "3px solid var(--sticker-yellow)",
      }}
    >
      {/* bulb run */}
      <div aria-hidden="true" style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--sticker-yellow)", boxShadow: "0 0 6px var(--sticker-yellow)" }} />
        ))}
      </div>
      <div style={{ font: "var(--type-cap)", textTransform: "uppercase", letterSpacing: "0.14em", opacity: 0.95 }}>
        🎤 {kicker}
      </div>
      <div style={{ font: "var(--type-d2)", fontSize: 30, lineHeight: 1.05, margin: "2px 0" }}>{title}</div>
      {children && <div style={{ font: "var(--type-cap)", opacity: 0.95 }}>{children}</div>}
      <div aria-hidden="true" style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--sticker-yellow)", boxShadow: "0 0 6px var(--sticker-yellow)" }} />
        ))}
      </div>
    </div>
  );
}
