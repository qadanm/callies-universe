// RoastMyRide — StagePlayer [ROASTMYRIDE-NEW: app-layer].
//
// Plays the roast reel (StageScene) over its performance timeline: a
// requestAnimationFrame clock advances `timeMs`, which drives the deterministic
// scene (word-by-word captions, sticker reactions). The SAME scene + timeline
// drives the exported video (live = this rAF clock; video = Remotion's frame
// clock). Auto-plays; play/pause + replay; scrubber via ref.
//
// If `backgroundUrl` is set, a looping gameplay <video> is layered behind the
// (transparent) scene — the same asset Remotion layers with <OffthreadVideo>.
// StrictMode-safe: each effect owns its rAF; elapsed lives in a ref.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StageScene } from "./StageScene.jsx";
import { PodcastScene } from "./PodcastScene.jsx";
import { toStandupSet, buildTimeline, activeIndexAt, mmss } from "../standup.js";
import { pickBackground } from "../gameplayBackgrounds.js";
import { useRoastVoice } from "./useRoastVoice.js";
import { cfg } from "../subjects/index.js";

export function StagePlayer({ result, subjectPhoto, backgroundUrl }) {
  const standup = useMemo(() => toStandupSet(result), [result]);
  const isPanel = standup.format === "panel" && Array.isArray(standup.performers) && standup.performers.length === 2;

  // Same deterministic backdrop the saved video uses (buildRenderSpec). A real
  // licensed loop (bgUrl) is layered as <video>; otherwise the scene draws fauxStyle.
  const pick = useMemo(() => pickBackground(result), [result]);
  const bgUrl = backgroundUrl ?? pick.backgroundUrl;

  // When a backend is configured, fetch the comedian's per-beat audio (cached) so
  // the live reel is voiced — and pace the timeline to the REAL spoken durations,
  // the same durations the exported MP4 uses, keeping live and export in lockstep.
  // No backend / any failure → null → silent + word-count estimate, exactly as before.
  const voice = useRoastVoice(standup.comedianId, result.roasterName, standup.beats);
  const { segments, totalMs, leadMs, tailMs } = useMemo(
    () => buildTimeline(standup.beats, voice ? { durationsMs: voice.durationsMs } : {}),
    [standup, voice]
  );

  const hasShow = segments.length > 0 && totalMs > 0;
  const [timeMs, setTimeMs] = useState(0);
  const [playing, setPlaying] = useState(hasShow);
  const [finished, setFinished] = useState(false);
  const elapsedRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const scrubRef = useRef(null);
  const videoRef = useRef(null);
  const audioRefs = useRef([]);
  const activeAudioRef = useRef(-1);
  const reduceMotion = usePrefersReducedMotion();

  const pauseAllAudio = () => audioRefs.current.forEach((a) => a && a.pause());

  useEffect(() => {
    if (!playing || !hasShow) return undefined;
    let alive = true;
    lastTsRef.current = 0;
    const tick = (ts) => {
      if (!alive) return;
      if (!lastTsRef.current) lastTsRef.current = ts;
      elapsedRef.current = Math.min(totalMs, elapsedRef.current + (ts - lastTsRef.current));
      lastTsRef.current = ts;
      const e = elapsedRef.current;
      if (scrubRef.current) scrubRef.current.style.width = `${(e / totalMs) * 100}%`;
      setTimeMs(e);
      // Voice: when the active beat changes, start its clip. Gate on the beat's
      // real start so nothing plays during the opening hook (timeMs < beat[0].start).
      const idx = activeIndexAt(segments, e);
      const audioIdx = idx >= 0 && segments[idx] && e >= segments[idx].startMs ? idx : -1;
      if (audioIdx !== activeAudioRef.current) {
        const prev = audioRefs.current[activeAudioRef.current];
        if (prev) prev.pause();
        activeAudioRef.current = audioIdx;
        const cur = audioRefs.current[audioIdx];
        if (cur) {
          try { cur.currentTime = 0; } catch { /* not yet seekable */ }
          cur.play().catch(() => {}); // autoplay policy / not loaded — stay silent
        }
      }
      if (e >= totalMs) {
        setPlaying(false);
        setFinished(true);
        pauseAllAudio();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      pauseAllAudio(); // don't leave a clip playing on pause/unmount
    };
  }, [playing, hasShow, segments, totalMs]);

  // Pause/resume the active clip with the timeline.
  useEffect(() => {
    const cur = audioRefs.current[activeAudioRef.current];
    if (!cur) return;
    if (playing) cur.play().catch(() => {});
    else cur.pause();
  }, [playing]);

  // Keep the live gameplay loop roughly in step with the scrubber. Only act on a
  // real divergence so a failed play() (autoplay policy) doesn't desync silently.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing && v.paused) v.play().catch(() => {});
    else if (!playing && !v.paused) v.pause();
  }, [playing]);

  const replay = () => {
    if (!hasShow) return;
    elapsedRef.current = 0;
    lastTsRef.current = 0;
    if (scrubRef.current) scrubRef.current.style.width = "0%";
    if (videoRef.current) videoRef.current.currentTime = 0;
    pauseAllAudio();
    activeAudioRef.current = -1;
    setTimeMs(0);
    setFinished(false);
    setPlaying(true);
  };
  const toggle = () => {
    if (finished) return replay();
    lastTsRef.current = 0;
    setPlaying((p) => !p);
  };

  return (
    <div style={{ width: "100%", maxWidth: 340, margin: "0 auto" }}>
      {/* the 9:16 reel box: optional gameplay video behind the transparent scene */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "9 / 16", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--elev-4)", background: "#06101f" }}>
        {bgUrl && !isPanel && (
          <video ref={videoRef} src={bgUrl} muted loop playsInline autoPlay aria-hidden="true" data-testid="stage-background-video" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {isPanel ? (
          <PodcastScene
            performers={standup.performers}
            carLabel={carLabelOf(result)}
            carPhoto={subjectPhoto || null}
            segments={segments}
            timeMs={timeMs}
            clips={voice ? voice.clips : []}
            leadMs={leadMs}
            tailMs={tailMs}
            totalMs={totalMs}
            reduceMotion={reduceMotion}
            reaction={result.reaction || "savage"}
            score={result.grade && result.grade.composite}
          />
        ) : (
          <StageScene
            comedianId={standup.comedianId}
            performerName={result.roasterName || "the comic"}
            carLabel={carLabelOf(result)}
            carPhoto={subjectPhoto || null}
            segments={segments}
            timeMs={timeMs}
            reaction={result.reaction || "savage"}
            backgroundUrl={bgUrl}
            fauxStyle={pick.fauxStyle}
            clips={voice ? voice.clips : []}
            leadMs={leadMs}
            tailMs={tailMs}
            totalMs={totalMs}
            reduceMotion={reduceMotion}
          />
        )}
      </div>

      {/* the comedian's voice — one hidden clip per beat, driven by the rAF tick */}
      {voice && voice.clips.length > 0 && (
        <div aria-hidden="true" style={{ display: "none" }}>
          {voice.clips.map((c, i) => (
            <audio key={i} ref={(el) => { audioRefs.current[i] = el; }} src={c.dataUrl} preload="auto" />
          ))}
        </div>
      )}

      {/* player chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
        <button
          onClick={toggle}
          aria-label={finished ? "Replay" : playing ? "Pause" : "Play"}
          style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer", background: "var(--ember-600)", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {finished ? "↻" : playing ? "❚❚" : "▶"}
        </button>
        <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--surface)", boxShadow: "var(--elev-1)", overflow: "hidden" }}>
          <div ref={scrubRef} className="rmr-scrub-fill" style={{ height: "100%", background: "linear-gradient(90deg,var(--flame-500),var(--ember-600))" }} />
        </div>
        <span style={{ flexShrink: 0, font: "var(--type-cap)", color: "var(--text-hint)", minWidth: 34, textAlign: "right" }}>{mmss(totalMs)}</span>
      </div>
    </div>
  );
}

function carLabelOf(result) {
  const c = (result.research && result.research[cfg("research.key")]) || {};
  const labelFields = cfg("research.labelFields", []);
  return c.label || labelFields.map((f) => c[f]).filter(Boolean).join(" ") || cfg("brain.subjectNoun");
}

// Live playback honors the OS "reduce motion" setting (the exported video always
// animates — it's deterministic and not tied to any viewer's preference).
function usePrefersReducedMotion() {
  const mqOf = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null);
  const [reduce, setReduce] = useState(() => !!mqOf()?.matches);
  useEffect(() => {
    const mq = mqOf();
    if (!mq) return undefined;
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduce;
}
