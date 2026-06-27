// Screen 6 — Roast reveal + share (the hero moment).
// CORE-REUSED: Callie (state from the result's reaction), Confetti, Button.
// ROASTMYRIDE-NEW (app-layer): ShareCard frame; reveal layout + actions.
//
// The roast text, voice, spice AND Callie's reaction state all come from the
// mock result (flow.result). Callie reacts by name — the cast voiced it, Callie
// only reacts (the two-performer rule).
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Callie, Confetti } from "@callies-universe/core";
import { ShareCard } from "../components/ShareCard.jsx";
import { Eyebrow } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";

export function Reveal() {
  const go = useNavigate();
  const { result, previewResult } = useFlow();
  const roast = result || previewResult; // fallback so a direct /reveal still renders
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "radial-gradient(120% 60% at 50% 0%, var(--heat-300) 0%, var(--canvas) 50%)",
      }}
    >
      {revealed && <Confetti count={34} />}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-5)",
          gap: "var(--space-4)",
        }}
      >
        <Eyebrow>
          Voiced by {roast.roasterName} · Callie {roast.reaction === "savage" ? "lost it 😹" : "approves 😻"}
        </Eyebrow>
        <div style={{ animation: revealed ? "rmr-pop-in var(--dur-4) var(--ease-spring) both" : "none" }}>
          <ShareCard
            width={260}
            roasterName={roast.roasterName}
            spice={roast.spice}
            mascot={<Callie state={roast.reaction} size={84} />}
            roast={roast.segments}
          />
        </div>
      </div>
      <div
        style={{
          padding: "var(--space-5)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          background: "var(--canvas)",
          borderTopLeftRadius: "var(--radius-xl)",
          borderTopRightRadius: "var(--radius-xl)",
          boxShadow: "0 -8px 24px rgba(120,52,12,0.12)",
        }}
      >
        <Button variant="primary" size="lg" block onClick={() => go("/celebrate")}>
          Share video
        </Button>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <Button variant="secondary" style={{ flex: 1 }} onClick={() => go("/reveal")}>
            Save
          </Button>
          <Button variant="secondary" style={{ flex: 1 }} onClick={() => go("/cooking")}>
            Re-roast
          </Button>
        </div>
      </div>
    </div>
  );
}
