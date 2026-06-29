// RoastMyRide — Remotion root: registers the "stage" composition.
// Duration is derived from the set's own performance timeline (calculateMetadata),
// so each roast's video is exactly as long as the show.
import React from "react";
import { Composition } from "remotion";
import { StageVideo } from "./StageVideo.jsx";
import { buildTimeline } from "../src/standup.js";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920; // 9:16

// A minimal default so the composition is previewable without input props.
const DEFAULT_PROPS = {
  comedianId: "mama",
  performerName: "Mama Denièce",
  bit: "Baby, No",
  reaction: "savage",
  subjectLabel: "your ride",
  engineLabel: "offline",
  subjectPhoto: null,
  beats: [
    { type: "setup", text: "Mm-mm-MM. Baby. Come here." },
    { type: "crowd", text: "You see this paint? You SEE it?" },
    { type: "punch", text: "This paint job is ", punch: "a cry for help", tail: ", and I'm answering." },
    { type: "closer", text: "I say this with love… ", punch: "no.", tail: "" },
  ],
};

export function RemotionRoot() {
  return (
    <Composition
      id="stage"
      component={StageVideo}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={DEFAULT_PROPS}
      calculateMetadata={({ props }) => {
        const durationsMs = Array.isArray(props.audio) ? props.audio.map((a) => a && a.durationMs) : undefined;
        const { totalMs } = buildTimeline(props.beats || [], { durationsMs });
        return { durationInFrames: Math.max(1, Math.round((totalMs / 1000) * FPS)) };
      }}
    />
  );
}
