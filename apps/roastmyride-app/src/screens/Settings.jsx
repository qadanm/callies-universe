// Screen 9 — Settings / account (bones, not skin — the quiet functional zone).
// CORE-REUSED: CallieHost (context "settings"), tokens.
// ROASTMYRIDE-NEW: quiet settings rows.
import React from "react";
import { CallieHost } from "@callies-universe/core";

const SECTIONS = [
  { g: "Account", items: [["Profile & handle", "@dailydrifter"], ["Credits", "3 left"], ["Restore purchases", ""]] },
  { g: "Roasting", items: [["Default roaster", "Mama Denièce"], ["Spice ceiling", "Medium"], ["Profile roast consent", "On"]] },
  { g: "Accessibility", items: [["Reduce motion", "Follow system"], ["Captions on videos", "On"], ["Haptics", "On"]] },
  { g: "About", items: [["Privacy & data", ""], ["Terms", ""], ["Version", "0.1.0"]] },
];

export function Settings() {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--canvas-sink)" }}>
      <div style={{ padding: "var(--space-5) var(--space-5) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <CallieHost context="settings" size={52} />
        <h1 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: 0 }}>Settings</h1>
      </div>
      {SECTIONS.map((sec) => (
        <div key={sec.g} style={{ padding: "var(--space-3) var(--space-5)" }}>
          <div
            style={{
              font: "var(--type-cap)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-hint)",
              margin: "0 0 8px 4px",
            }}
          >
            {sec.g}
          </div>
          <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--elev-1)" }}>
            {sec.items.map(([label, val], i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderTop: i ? "1px solid var(--hairline)" : "none",
                  minHeight: 48,
                }}
              >
                <span style={{ font: "var(--type-body)", color: "var(--ink)" }}>{label}</span>
                <span style={{ marginLeft: "auto", font: "var(--type-sm)", color: "var(--text-muted)" }}>{val}</span>
                <span style={{ marginLeft: 10, color: "var(--text-hint)" }}>›</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ padding: "var(--space-5)", textAlign: "center" }}>
        <span style={{ font: "var(--type-legal)", color: "var(--text-hint)" }}>
          RoastMyRide · clever, never cruel · PG-13
        </span>
      </div>
    </div>
  );
}
