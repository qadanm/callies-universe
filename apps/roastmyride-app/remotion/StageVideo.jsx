// RoastMyRide — the Remotion composition [ROASTMYRIDE-NEW].
//
// Wraps the SAME StageScene the app plays live, driven by Remotion's frame clock
// (useCurrentFrame → timeMs) instead of the live rAF clock. Because it's the same
// component + the deterministic `timeMs` mode (sceneMotion.js), the exported MP4
// is frame-identical to what plays on screen.
//
// inputProps (the "scene spec", built app-side at save time, serialisable):
//   { comedianId, performerName, bit, reaction, carLabel, engineLabel,
//     beats: StandupBeat[], carPhoto: dataUrl|null, profile: {dataUrl,blur,kind}|null }
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { StageScene } from "../src/components/StageScene.jsx";
import { buildTimeline } from "../src/standup.js";

export function StageVideo(props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;
  const { segments } = buildTimeline(props.beats || []);
  return (
    <AbsoluteFill style={{ background: "#0d0805" }}>
      <StageScene
        comedianId={props.comedianId}
        performerName={props.performerName}
        bit={props.bit}
        carLabel={props.carLabel}
        carPhoto={props.carPhoto || null}
        profile={props.profile || null}
        segments={segments}
        timeMs={timeMs}
        reaction={props.reaction || "savage"}
        engineLabel={props.engineLabel}
      />
    </AbsoluteFill>
  );
}
