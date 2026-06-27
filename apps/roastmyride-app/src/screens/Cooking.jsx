// Screen 5 — Warming up (was "Cooking"). Backstage while the comic writes tonight's set.
// CORE-REUSED: CallieHost (context "cooking" — now reads as Callie hosting backstage).
// ROASTMYRIDE-NEW: progress bar + "warming up" copy reframed around the performance.
//
// This screen calls the roast SEAM via flow.generate() → services/roast.js (the
// real brain: research → write → grade). When the set resolves, it advances to
// the reveal. Swapping behind the seam changed nothing here.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolvePerformer } from "@callies-universe/brain";
import { CookingProgress } from "../components/CookingProgress.jsx";
import { useFlow } from "../flow/FlowContext.jsx";

const STEPS = (name) => [
  `${name} is researching your ride…`,
  "Writing tonight's set…",
  "Working out the punchlines…",
  "Warming up the crowd…",
];

export function Cooking() {
  const go = useNavigate();
  const { generate, input } = useFlow();
  const [step, setStep] = useState(0);
  const firstName = resolvePerformer(input.roasterId).name.replace(/[“"].*$/, "").split(" ")[0];
  const steps = STEPS(firstName);

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

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(120% 70% at 50% 30%, var(--heat-300) 0%, var(--canvas) 60%)",
      }}
    >
      <CookingProgress title="Warming up…" steps={steps} step={step} hint="This usually takes ~10 seconds" size={200} />
    </div>
  );
}
