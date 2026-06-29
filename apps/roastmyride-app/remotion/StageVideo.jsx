// RoastMyRide — the Remotion composition [ROASTMYRIDE-NEW].
//
// Wraps the SAME StageScene the app plays live, driven by Remotion's frame clock
// (useCurrentFrame → timeMs) instead of the live rAF clock. Because it's the same
// component + the deterministic `timeMs` mode (sceneMotion.js), the exported MP4
// is frame-identical to what plays on screen.
//
// inputProps (the "scene spec", built app-side at save time, serialisable):
//   { comedianId, performerName, bit, reaction, subjectLabel, engineLabel,
//     beats: StandupBeat[], subjectPhoto: dataUrl|null }
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { StageScene } from "../src/components/StageScene.jsx";
import { PodcastScene } from "../src/components/PodcastScene.jsx";
import { buildTimeline, panelWindows } from "../src/standup.js";
import { sfxFor } from "../src/sfx.js";

const GAMEPLAY_VOL = 0.18; // gameplay loop audio, ducked under the VO
const MUSIC_VOL = 0.12; // music bed, ducked under the VO
const SFX_VOL = 0.45; // punch/closer stingers

export function StageVideo(props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;
  const audio = Array.isArray(props.audio) ? props.audio : null;
  // When voiced, pace the timeline to the real per-beat audio durations so the
  // captions track the spoken performance exactly.
  const durationsMs = audio ? audio.map((a) => a && a.durationMs) : undefined;
  const { segments, totalMs, leadMs, tailMs } = buildTimeline(props.beats || [], { durationsMs, ...panelWindows(props.format) });
  const msToFrames = (ms) => Math.max(1, Math.round((ms / 1000) * fps));

  return (
    <AbsoluteFill style={{ background: "#06101f" }}>
      {/* gameplay background — the user's licensed loop (audio ducked under the VO).
          Skipped for the panel format, which renders its own opaque studio. */}
      {props.format !== "panel" && props.backgroundUrl && (
        <OffthreadVideo src={props.backgroundUrl} loop volume={GAMEPLAY_VOL} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      )}

      {/* optional music bed (none committed) — ducked under the VO */}
      {props.musicUrl && <Audio src={props.musicUrl} loop volume={MUSIC_VOL} />}

      {/* Callie's Universe brand stings: the ident chime over the intro, the button
          over the endcard. They sit in the gaps before/after the VO, so nothing clashes. */}
      {props.introStingUrl && <Audio src={props.introStingUrl} volume={0.55} />}
      {props.outroStingUrl && (
        <Sequence from={msToFrames(totalMs - tailMs)} durationInFrames={msToFrames(tailMs)}>
          <Audio src={props.outroStingUrl} volume={0.6} />
        </Sequence>
      )}

      {/* the comedian's voice — one clip per beat, started at the beat's time (full volume) */}
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

      {/* synthesized stingers on the punch + closer beats — skipped for the panel,
          a real podcast conversation has no canned rimshots */}
      {props.format !== "panel" && segments.map((seg, i) => {
        const src = sfxFor(seg.beat && seg.beat.type);
        if (!src) return null;
        return (
          <Sequence key={`sfx-${i}`} from={msToFrames(seg.startMs)} durationInFrames={msToFrames(500)}>
            <Audio src={src} volume={SFX_VOL} />
          </Sequence>
        );
      })}

      {props.format === "panel" && Array.isArray(props.performers) && props.performers.length === 2 ? (
        <PodcastScene
          performers={props.performers}
          carLabel={props.subjectLabel}
          carPhoto={props.subjectPhoto || null}
          segments={segments}
          timeMs={timeMs}
          clips={audio || []}
          leadMs={leadMs}
          tailMs={tailMs}
          totalMs={totalMs}
          reaction={props.reaction || "savage"}
          score={props.score}
        />
      ) : (
        <StageScene
          comedianId={props.comedianId}
          performerName={props.performerName}
          carLabel={props.subjectLabel}
          carPhoto={props.subjectPhoto || null}
          segments={segments}
          timeMs={timeMs}
          reaction={props.reaction || "savage"}
          backgroundUrl={props.backgroundUrl}
          fauxStyle={props.fauxStyle}
          clips={audio || []}
          leadMs={leadMs}
          tailMs={tailMs}
          totalMs={totalMs}
        />
      )}
    </AbsoluteFill>
  );
}
