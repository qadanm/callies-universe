// CookingProgress: the "Callie is working" panel: mascot + title + a stepping
// status line + progress bar. Shared by the Warming-up screen (writing the set)
// and Reveal's render overlay (saving the video), so both read identically.
import React from "react";
import { CallieHost } from "@callies-universe/core";
import { H } from "./ui.jsx";

export function CookingProgress({ title = "Warming up…", steps = [], step = 0, hint, size = 200, pct }) {
  // Real progress (0..100) when provided (e.g. a render job); else step-based.
  const bar = typeof pct === "number" ? Math.max(0, Math.min(100, Math.round(pct))) : steps.length ? Math.min(100, Math.round(((step + 1) / steps.length) * 100)) : 0;
  const current = steps.length ? steps[Math.min(step, steps.length - 1)] : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-6)", padding: "var(--space-6)" }}>
      <CallieHost context="cooking" size={size} />
      <div style={{ textAlign: "center" }}>
        <H style={{ fontSize: 34 }}>{title}</H>
        {current && (
          <p style={{ font: "var(--type-lead)", color: "var(--text-muted)", margin: "8px 0 0", minHeight: 26 }}>{current}</p>
        )}
      </div>
      <div style={{ width: "100%", maxWidth: 280 }}>
        <div style={{ height: 16, borderRadius: 999, background: "var(--surface)", boxShadow: "var(--elev-1)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: bar + "%", borderRadius: 999, background: "linear-gradient(90deg,var(--flame-500),var(--ember-600))", transition: "width var(--dur-3) var(--ease-out)" }} />
        </div>
        {hint && <div style={{ textAlign: "center", font: "var(--type-cap)", color: "var(--text-hint)", marginTop: 8 }}>{hint}</div>}
      </div>
    </div>
  );
}
