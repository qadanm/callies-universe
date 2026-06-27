// Screen 5 — Cooking / loading (where the MOCK "generates" the roast).
// CORE-REUSED: CallieHost (context "cooking").
// ROASTMYRIDE-NEW: progress bar + "cooking your roast" copy.
//
// This screen calls the roast SEAM via flow.generate() → services/roast.js.
// When the (mocked) result resolves, it advances to the reveal. Swapping the
// mock for the real service changes nothing here.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CallieHost } from "@callies-universe/core";
import { H } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";

const STEPS = [
  "Sizing up your ride…",
  "Checking the body kit…",
  "Loading the disrespect…",
  "Plating the roast…",
];

export function Cooking() {
  const go = useNavigate();
  const { generate } = useFlow();
  const [step, setStep] = useState(0);

  useEffect(() => {
    let alive = true;
    const ticker = setInterval(() => setStep((s) => s + 1), 900);

    // The single call into the roast pipeline.
    generate().then(() => {
      if (alive) go("/reveal");
    });

    return () => {
      alive = false;
      clearInterval(ticker);
    };
    // NOTE: run once on mount — generate() is stable for this screen's lifetime.
  }, []);

  const pct = Math.min(100, (step + 1) * 25);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-6)",
        padding: "var(--space-6)",
        background: "radial-gradient(120% 70% at 50% 30%, var(--heat-300) 0%, var(--canvas) 60%)",
      }}
    >
      <CallieHost context="cooking" size={200} />
      <div style={{ textAlign: "center" }}>
        <H style={{ fontSize: 34 }}>Cooking your roast…</H>
        <p style={{ font: "var(--type-lead)", color: "var(--text-muted)", margin: "8px 0 0", minHeight: 26 }}>
          {STEPS[Math.min(step, STEPS.length - 1)]}
        </p>
      </div>
      <div style={{ width: "100%", maxWidth: 280 }}>
        <div style={{ height: 16, borderRadius: 999, background: "var(--surface)", boxShadow: "var(--elev-1)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: pct + "%",
              borderRadius: 999,
              background: "linear-gradient(90deg,var(--flame-500),var(--ember-600))",
              transition: "width var(--dur-3) var(--ease-out)",
            }}
          />
        </div>
        <div style={{ textAlign: "center", font: "var(--type-cap)", color: "var(--text-hint)", marginTop: 8 }}>
          This usually takes ~10 seconds
        </div>
      </div>
    </div>
  );
}
