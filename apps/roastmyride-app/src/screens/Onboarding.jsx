// Screen 1: Onboarding (Callie introduces the app).
// CORE-REUSED: CallieHost (context "onboarding"), Button, Confetti.
// ROASTMYRIDE-NEW: copy + hero layout.
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, CallieHost, Confetti } from "@callies-universe/core";
import { Eyebrow, H } from "../components/ui.jsx";
import { cfg } from "../subjects/index.js";

export function Onboarding() {
  const go = useNavigate();
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(120% 70% at 50% 0%, var(--heat-300) 0%, var(--canvas) 55%)",
      }}
    >
      <Confetti count={16} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-5)",
          padding: "var(--space-6)",
          textAlign: "center",
        }}
      >
        <CallieHost context="onboarding" size={180} />
        <Eyebrow>Welcome to the show</Eyebrow>
        <H style={{ fontSize: 44 }}>
          Callie won't
          <br />roast you.
        </H>
        <p style={{ font: "var(--type-lead)", color: "var(--text-muted)", margin: 0, maxWidth: 320 }}>
          Her comedians handle that. Bring {cfg("brain.subjectNoun")}, they cook it, and Callie reacts from the corner, on your side the whole time. Clever, never cruel.
        </p>
      </div>
      <div style={{ padding: "var(--space-5)", paddingBottom: "calc(var(--space-5) + env(safe-area-inset-bottom))", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Button variant="primary" size="lg" block onClick={() => go("/home")}>
          {cfg("onboarding.cta")}
        </Button>
        <Button variant="ghost" block onClick={() => go("/cast")}>
          Meet the cast first
        </Button>
      </div>
    </div>
  );
}
