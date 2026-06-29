// Screen 9 — Settings / account. The quiet functional zone — now wired: live
// credit balance, restore purchases, reset-local-data, and links to the legal docs.
// CORE-REUSED: CallieHost. ROASTMYRIDE-NEW: functional setting rows.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CallieHost } from "@callies-universe/core";
import { resolvePerformer } from "@callies-universe/brain";
import { restore } from "../services/purchases.js";
import { useFlow } from "../flow/FlowContext.jsx";

const reduceMotionLabel = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "On (system)"
    : "Follow system";

export function Settings() {
  const go = useNavigate();
  const { input, credits, setCredits } = useFlow();
  const [msg, setMsg] = useState("");

  const onRestore = async () => {
    try {
      const r = await restore();
      if (r && typeof r.credits === "number") { setCredits(r.credits); setMsg(`Restored — ${r.credits} roasts`); }
      else setMsg("Nothing to restore");
    } catch (e) {
      setMsg("Restore failed — try again");
    }
  };
  const onReset = () => {
    try { localStorage.removeItem("rmr.credits"); localStorage.removeItem("rmr.deviceId"); } catch { /* no storage */ }
    setMsg("Local data cleared — reload to apply");
  };

  const roasterName = resolvePerformer(input.roasterId).name;
  const SECTIONS = [
    { g: "Account", items: [
      { label: "Credits", val: `${credits} left` },
      { label: "Restore purchases", val: "", onClick: onRestore },
      { label: "Reset local data", val: "", onClick: onReset },
    ] },
    { g: "Roasting", items: [
      { label: "Default roaster", val: roasterName },
      { label: "Spice ceiling", val: "Medium" },
      { label: "Spice ceiling", val: "Medium" },
    ] },
    { g: "Accessibility", items: [
      { label: "Reduce motion", val: reduceMotionLabel() },
      { label: "Captions on videos", val: "On" },
    ] },
    { g: "About", items: [
      { label: "Privacy & data", val: "", onClick: () => go("/legal/privacy") },
      { label: "Terms", val: "", onClick: () => go("/legal/terms") },
      { label: "Version", val: "0.3.0" },
    ] },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--canvas-sink)" }}>
      <div style={{ padding: "var(--space-5) var(--space-5) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <CallieHost context="settings" size={52} />
        <h1 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: 0 }}>Settings</h1>
      </div>
      {msg && (
        <div style={{ margin: "0 var(--space-5) var(--space-2)", font: "var(--type-sm)", color: "var(--text-muted)" }}>{msg}</div>
      )}
      {SECTIONS.map((sec) => (
        <div key={sec.g} style={{ padding: "var(--space-3) var(--space-5)" }}>
          <div style={{ font: "var(--type-cap)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-hint)", margin: "0 0 8px 4px" }}>{sec.g}</div>
          <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--elev-1)" }}>
            {sec.items.map((it, i) => {
              const clickable = !!it.onClick;
              return (
                <div
                  key={it.label}
                  onClick={it.onClick}
                  role={clickable ? "button" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderTop: i ? "1px solid var(--hairline)" : "none", minHeight: 48, cursor: clickable ? "pointer" : "default" }}
                >
                  <span style={{ font: "var(--type-body)", color: "var(--ink)" }}>{it.label}</span>
                  <span style={{ marginLeft: "auto", font: "var(--type-sm)", color: "var(--text-muted)" }}>{it.val}</span>
                  {clickable && <span style={{ marginLeft: 10, color: "var(--text-hint)" }}>›</span>}
                </div>
              );
            })}
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
