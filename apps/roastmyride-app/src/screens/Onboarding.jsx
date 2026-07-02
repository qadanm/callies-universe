// Screen 1: First-launch onboarding. Three tiny steps, then never again
// (localStorage flag). Step 1 is Callie's ONE hero moment in the app (the
// good-cop canon beat); the comics own step 2; step 3 shows the payoff.
// CORE-REUSED: CallieHost, Callie, Roaster, Button, Confetti.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CallieHost, Callie, Roaster, Confetti } from "@callies-universe/core";
import { Eyebrow, H } from "../components/ui.jsx";
import { haptic } from "../native.js";
import { cfg } from "../subjects/index.js";

const SEEN_KEY = "rmr.onboarded.v1";

export function hasOnboarded() {
  try { return !!localStorage.getItem(SEEN_KEY); } catch { return false; }
}

function markOnboarded() {
  try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* no storage */ }
}

export function Onboarding() {
  const go = useNavigate();
  const [step, setStep] = useState(0);

  // Returning users skip straight to the app.
  useEffect(() => {
    if (hasOnboarded()) go("/home", { replace: true });
    // eslint-disable-next-line
  }, []);

  const finish = () => {
    haptic();
    markOnboarded();
    go("/home", { replace: true });
  };
  const next = () => {
    haptic();
    step < 2 ? setStep(step + 1) : finish();
  };

  const noun = cfg("brain.subjectNoun"); // e.g. "your ride"
  const steps = [
    {
      eyebrow: "Here's the idea",
      title: "Get your car roasted.",
      sub: `Add one photo. Two voices tear ${noun} apart. You keep the clip.`,
      visual: <ClipMock />,
    },
    {
      eyebrow: "Your call",
      title: "You pick the two voices.",
      sub: "Four to choose from. Tap any one to hear it before you decide.",
      visual: <VoicesRow />,
    },
    {
      eyebrow: "Don't worry",
      title: "Callie's on your side.",
      sub: "She's your host and she keeps it fun. She never roasts you.",
      visual: (
        <div style={{ position: "relative" }}>
          <CallieHost context="onboarding" size={150} />
        </div>
      ),
    },
  ];
  const s = steps[step];

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(120% 70% at 50% 0%, var(--heat-300) 0%, var(--canvas) 55%)",
      }}
    >
      {step === 0 && <Confetti count={14} />}

      {/* Skip: always available, top right, clear of the notch */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "calc(var(--space-3) + env(safe-area-inset-top)) var(--space-5) 0" }}>
        <button onClick={finish} style={skipBtn}>Skip</button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-4)",
          padding: "0 var(--space-6)",
          textAlign: "center",
        }}
      >
        <div style={{ minHeight: 170, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.visual}</div>
        <Eyebrow>{s.eyebrow}</Eyebrow>
        <H style={{ fontSize: 34 }}>{s.title}</H>
        <p style={{ font: "var(--type-lead)", color: "var(--text-muted)", margin: 0, maxWidth: 300 }}>{s.sub}</p>
      </div>

      {/* Dots + primary action, anchored above the home indicator */}
      <div style={{ padding: "var(--space-5)", paddingBottom: "calc(var(--space-5) + env(safe-area-inset-bottom))", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {steps.map((_, i) => (
            <span key={i} style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 999, background: i === step ? "var(--ember-600)" : "var(--heat-400)", transition: "width .25s ease" }} />
          ))}
        </div>
        <Button variant="primary" size="lg" block onClick={next}>
          {step < 2 ? "Next" : cfg("onboarding.cta")}
        </Button>
      </div>
    </div>
  );
}

/* Step 2: the voices you can pick, each with a little speaker cue. */
function VoicesRow() {
  const active = Roaster.roster.filter((r) => !r.comingSoon).slice(0, 3);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-3)" }}>
      {active.map((c, i) => (
        <div key={c.id} style={{ position: "relative" }}>
          <Roaster id={c.id} size={i === 1 ? 96 : 72} ring />
          <span aria-hidden="true" style={{ position: "absolute", bottom: -4, right: -4, fontSize: i === 1 ? 22 : 18 }}>🔊</span>
        </div>
      ))}
    </div>
  );
}

/* Step 1: a tiny mock of the finished clip: a photo with a play button. */
function ClipMock() {
  return (
    <div
      style={{
        position: "relative",
        width: 168,
        height: 168,
        borderRadius: "var(--radius-lg)",
        cornerShape: "var(--corner-card)",
        background: "linear-gradient(180deg, #241a12 0%, #17100a 100%)",
        border: "var(--ink-outline)",
        boxShadow: "var(--shadow-sticker-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: 44 }} aria-hidden="true">🚗</span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 30, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.6)",
        }}
      >▶️</span>
      <div style={{ position: "absolute", bottom: 6, right: 6 }}>
        <Callie state="delighted" size={40} />
      </div>
    </div>
  );
}

const skipBtn = {
  background: "none", border: "none", cursor: "pointer", padding: "8px 4px",
  font: "var(--type-cap)", fontWeight: 800, color: "var(--text-hint)",
  textTransform: "uppercase", letterSpacing: "0.06em",
};
