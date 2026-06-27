// Screen 6 — Reveal: the SET (the hero moment), reworked as a comedy special.
// CORE-REUSED: Callie, Confetti, Button (+ Roaster inside StageFrame).
// ROASTMYRIDE-NEW (app-layer): StageFrame (perf-video placeholder), billing bar,
// the set transcript (SetBeat), the standup ShareCard clip.
//
// The set, the performer, the research and the grade all come from the brain's
// RoastResult (flow.result); the app adapts it to the StandupSet display shape
// (standup.js). The cast comedian performs; Callie only reacts, as the crowd
// (the two-performer rule, now literal — comic on stage, Callie in the audience).
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Callie, Confetti } from "@callies-universe/core";
import { ShareCard } from "../components/ShareCard.jsx";
import { StageFrame } from "../components/StageFrame.jsx";
import { SetBeat } from "../components/SetBeat.jsx";
import { ScreenScroll, Eyebrow, stickyBar } from "../components/ui.jsx";
import { toStandupSet, comicStyle } from "../standup.js";
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

  const set = toStandupSet(roast);
  const act = roast.performer?.comedicIdentity || comicStyle(roast.roasterId);
  const closer = set.beats.find((b) => b.type === "closer");
  const clipSegments = closer
    ? [
        { text: closer.text },
        ...(closer.punch ? [{ text: closer.punch, punch: true }] : []),
        ...(closer.tail ? [{ text: closer.tail }] : []),
      ]
    : roast.segments;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", background: "radial-gradient(120% 60% at 50% 0%, var(--heat-300) 0%, var(--canvas) 50%)" }}>
      {revealed && <Confetti count={34} />}

      <ScreenScroll style={{ paddingBottom: "var(--space-4)" }}>
        {/* billing bar — now performing */}
        <div>
          <Eyebrow>🎤 Now performing{roast.engine === "live" ? "" : " · offline"}</Eyebrow>
          <h1 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: "2px 0 0", lineHeight: 1.05 }}>
            "{set.bit}"
          </h1>
          <p style={{ font: "var(--type-cap)", color: "var(--text-muted)", margin: "4px 0 0" }}>
            {roast.roasterName} · {act} · {set.runtime}
          </p>
        </div>

        {/* the stage (perf-video placeholder) */}
        <div style={{ animation: revealed ? "rmr-pop-in var(--dur-4) var(--ease-spring) both" : "none" }}>
          <StageFrame comedianId={roast.roasterId} runtime={set.runtime} callieState={roast.reaction} />
        </div>

        {/* the set transcript */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {set.beats.map((b, i) => (
            <SetBeat key={i} beat={b} />
          ))}
        </div>

        {/* grader verdict — the anti-cringe guarantee, made visible */}
        {roast.grade && (
          <div style={{ font: "var(--type-cap)", color: "var(--text-hint)", textAlign: "center" }}>
            Cleared the booker {roast.grade.pass ? "✅" : "⚠️"} · funny {roast.grade.scores.funny} ·
            {" "}not-AI {roast.grade.scores.human} · on-the-car {roast.grade.scores.edge}
            {roast.research?.sources?.length ? ` · grounded in ${roast.research.sources.length} sources` : ""}
          </div>
        )}

        {/* the shareable clip (the closer) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ShareCard
            width={240}
            format="standup"
            roasterName={roast.roasterName}
            act={act}
            spice={roast.spice}
            mascot={<Callie state={roast.reaction} size={76} />}
            roast={clipSegments}
          />
        </div>
      </ScreenScroll>

      <div style={stickyBar}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", width: "100%" }}>
          <Button variant="primary" size="lg" block onClick={() => go("/celebrate")}>
            Share the clip
          </Button>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <Button variant="secondary" style={{ flex: 1 }} onClick={() => go("/reveal")}>
              Save
            </Button>
            <Button variant="secondary" style={{ flex: 1 }} onClick={() => go("/cooking")}>
              New set
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
