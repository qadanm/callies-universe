// Screen 1 — Onboarding (Callie introduces the app).
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
        <CallieHost context="onboarding" size={180} bubble />
        <Eyebrow>Meet your hype-cat</Eyebrow>
        <H style={{ fontSize: 44 }}>
          Hi, I'm Callie.
          <br />I just react.
        </H>
        <p style={{ font: "var(--type-lead)", color: "var(--text-muted)", margin: 0, maxWidth: 300 }}>
          {cfg("onboarding.body")}
        </p>
      </div>
      <div style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Button variant="primary" size="lg" block onClick={() => go("/home")}>
          {cfg("onboarding.cta")}
        </Button>
        <Button variant="ghost" block onClick={() => go("/home")}>
          I'll look around first
        </Button>
      </div>
    </div>
  );
}
