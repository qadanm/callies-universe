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
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { StageScene } from "../src/components/StageScene.jsx";
import { buildTimeline } from "../src/standup.js";

export function StageVideo(props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;
  const audio = Array.isArray(props.audio) ? props.audio : null;
  // When voiced, pace the timeline to the real per-beat audio durations so the
  // captions + scene motion track the spoken performance exactly.
  const durationsMs = audio ? audio.map((a) => a && a.durationMs) : undefined;
  const { segments } = buildTimeline(props.beats || [], { durationsMs });
  const msToFrames = (ms) => Math.max(1, Math.round((ms / 1000) * fps));

  return (
    <AbsoluteFill style={{ background: "#0d0805" }}>
      {/* the comedian's voice — one clip per beat, started at the beat's time */}
      {audio &&
        audio.map((clip, i) => {
          const seg = segments[i];
          if (!seg || !clip || !clip.dataUrl) return null;
          return (
            <Sequence key={i} from={msToFrames(seg.startMs)} durationInFrames={msToFrames(clip.durationMs)}>
              <Audio src={clip.dataUrl} />
            </Sequence>
          );
        })}

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
