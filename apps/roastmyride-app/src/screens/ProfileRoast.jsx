// Screen 7 — Profile-roast mode (self / opt-in only · consent UI).
// In the flow this doubles as the optional "Photo 2" personalization step:
// add a selfie OR a screenshot of your own profile, with a clear privacy line.
// CORE-REUSED: CallieHost (context "seasoning", reacts to "added"), Button.
// ROASTMYRIDE-NEW: selfie/profile segmented upload, consent copy.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CallieHost } from "@callies-universe/core";
import { ScreenScroll, Eyebrow, H, stickyBar } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";

export function ProfileRoast() {
  const go = useNavigate();
  const { update } = useFlow();
  const [mode, setMode] = useState("selfie"); // "selfie" | "profile"
  const [added, setAdded] = useState(false);

  const copy =
    mode === "selfie"
      ? { ico: "🤳", title: "Add a selfie", sub: "Snap or pick a photo of you" }
      : { ico: "📱", title: "Add a profile screenshot", sub: "A screenshot of your social profile" };

  const attach = () => {
    setAdded(true);
    update({ personal: { present: true, kind: mode } });
  };

  const next = () => {
    if (!added) update({ personal: { present: false, kind: null } });
    go("/chips");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <ScreenScroll style={{ paddingBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {/* Callie reacts with "delighted" when a photo is added (core script). */}
          <CallieHost context="seasoning" size={72} event={added ? "added" : null} />
          <div>
            <Eyebrow>Photo 2 of 2 · consent</Eyebrow>
            <H style={{ fontSize: 30 }}>Make it personal</H>
          </div>
        </div>
        <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: 0 }}>
          Add a selfie or a screenshot of your profile and the roast gets sharper. Totally optional — your car
          alone is plenty.
        </p>

        {/* segmented choice */}
        <div style={{ display: "flex", gap: 6, padding: 5, background: "var(--canvas-sink)", borderRadius: "var(--radius-pill)" }}>
          {[["selfie", "Selfie"], ["profile", "Profile screenshot"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => {
                setMode(k);
                setAdded(false);
              }}
              style={{
                flex: 1,
                minHeight: 44,
                border: "none",
                cursor: "pointer",
                borderRadius: "var(--radius-pill)",
                font: "var(--type-sm)",
                fontWeight: 700,
                background: mode === k ? "var(--surface)" : "transparent",
                color: mode === k ? "var(--ember-600)" : "var(--text-muted)",
                boxShadow: mode === k ? "var(--gloss-chip)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={attach}
          style={{
            width: "100%",
            border: `3px dashed ${added ? "var(--ember-600)" : "var(--heat-400)"}`,
            background: added ? "#FFF3E2" : "var(--canvas-sink)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-7) var(--space-4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 40 }}>{added ? "✅" : copy.ico}</span>
          <span style={{ font: "var(--type-d4)", color: "var(--ember-600)" }}>
            {added ? "Added — looking good" : copy.title}
          </span>
          <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>
            {added ? "Tap to replace" : copy.sub}
          </span>
        </button>

        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "var(--space-3)", background: "var(--canvas-sink)", borderRadius: "var(--radius-md)" }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <span style={{ font: "var(--type-cap)", color: "var(--text-muted)" }}>
            Private — we only ever roast you. Never your friends, never strangers.
          </span>
        </div>
      </ScreenScroll>
      <div style={stickyBar}>
        <Button variant="ghost" onClick={next}>
          Skip
        </Button>
        <Button variant="primary" size="lg" style={{ flex: 1 }} onClick={next}>
          {added ? "Next" : "Next · car only"}
        </Button>
      </div>
    </div>
  );
}
