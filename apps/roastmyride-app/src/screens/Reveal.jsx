// Screen 6 — Reveal: the SET (the hero moment), the comedy special.
// CORE-REUSED: Callie, Button.
// ROASTMYRIDE-NEW (app-layer): StagePlayer (the animated stage scene — car on a
// screen, profile if present, comic performing, Callie in the crowd), the
// grader verdict, the standup ShareCard clip, and the full set transcript below.
//
// The set, performer, research and grade come from the brain's RoastResult
// (flow.result); the photos come from flow.input (carried, never sent to the
// model). The StagePlayer's scene is the single source of truth that the saved
// video will render identically (next milestone).
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Callie } from "@callies-universe/core";
import { ShareCard } from "../components/ShareCard.jsx";
import { StagePlayer } from "../components/StagePlayer.jsx";
import { SetBeat } from "../components/SetBeat.jsx";
import { ScreenScroll, Eyebrow, stickyBar } from "../components/ui.jsx";
import { toStandupSet, comicStyle, buildRenderSpec } from "../standup.js";
import { useFlow } from "../flow/FlowContext.jsx";

export function Reveal() {
  const go = useNavigate();
  const { result, previewResult, input } = useFlow();
  const roast = result || previewResult; // fallback so a direct /reveal still renders

  // Save-as-video: build the exact render spec (the Remotion composition's
  // inputProps) and download it. The render service turns this into a frame-
  // identical MP4 (locally: `pnpm --filter @callies-universe/render render`;
  // one tap once the render endpoint is hosted).
  const saveVideo = () => {
    const spec = buildRenderSpec(roast, input);
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roastmyride-${String(spec.bit || "set").replace(/\W+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const set = toStandupSet(roast);
  const act = roast.performer?.comedicIdentity || comicStyle(roast.roasterId);
  const carPhoto = input?.carPhoto?.dataUrl || null;
  const profile = input?.personal?.present && input?.personal?.dataUrl ? input.personal : null;
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
      <ScreenScroll style={{ paddingBottom: "var(--space-4)" }}>
        {/* the stage scene — the show plays here (and is what the video will be) */}
        <div style={{ animation: "rmr-pop-in var(--dur-4) var(--ease-spring) both" }}>
          <StagePlayer result={roast} carPhoto={carPhoto} profile={profile} />
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

        {/* the full set — text transcript (accessible, skimmable) */}
        <div>
          <Eyebrow>The full set</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
            {set.beats.map((b, i) => (
              <SetBeat key={i} beat={b} />
            ))}
          </div>
        </div>
      </ScreenScroll>

      <div style={stickyBar}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", width: "100%" }}>
          <Button variant="primary" size="lg" block onClick={() => go("/celebrate")}>
            Share the clip
          </Button>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <Button variant="secondary" style={{ flex: 1 }} onClick={saveVideo}>
              ⤓ Save video
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
