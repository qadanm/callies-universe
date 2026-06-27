// RoastMyRide — StagePlayer [ROASTMYRIDE-NEW: app-layer].
//
// Plays the StageScene over its performance timeline: a requestAnimationFrame
// clock advances `activeIndex` beat-by-beat while the scrubber fills. The scene
// itself is deterministic from `activeIndex`, so the SAME scene + timeline will
// drive the exported video next milestone (live = this player; video = the same
// frames). Controls: auto-plays, with play/pause + replay.
//
// StrictMode-safe: each effect run owns its rAF and cancels it on cleanup;
// elapsed time lives in a ref so pause/resume/replay don't lose position.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StageScene } from "./StageScene.jsx";
import { toStandupSet, buildTimeline, activeIndexAt, mmss } from "../standup.js";

export function StagePlayer({ result, carPhoto, profile }) {
  const standup = useMemo(() => toStandupSet(result), [result]);
  const { segments, totalMs } = useMemo(() => buildTimeline(standup.beats), [standup]);

  const hasShow = segments.length > 0 && totalMs > 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(hasShow);
  const [finished, setFinished] = useState(false);
  const elapsedRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const scrubRef = useRef(null);

  useEffect(() => {
    if (!playing || !hasShow) return undefined;
    let alive = true;
    lastTsRef.current = 0;
    const tick = (ts) => {
      if (!alive) return;
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      elapsedRef.current = Math.min(totalMs, elapsedRef.current + dt);
      const e = elapsedRef.current;
      if (scrubRef.current) scrubRef.current.style.width = `${(e / totalMs) * 100}%`;
      const idx = activeIndexAt(segments, e);
      setActiveIndex((prev) => (prev === idx ? prev : idx));
      if (e >= totalMs) {
        setPlaying(false);
        setFinished(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [playing, hasShow, segments, totalMs]);

  const replay = () => {
    if (!hasShow) return;
    elapsedRef.current = 0;
    lastTsRef.current = 0;
    if (scrubRef.current) scrubRef.current.style.width = "0%";
    setActiveIndex(0);
    setFinished(false);
    setPlaying(true);
  };
  const toggle = () => {
    if (finished) return replay();
    lastTsRef.current = 0; // resume cleanly
    setPlaying((p) => !p);
  };

  return (
    <div style={{ width: "100%", maxWidth: 340, margin: "0 auto" }}>
      <StageScene
        comedianId={standup.comedianId}
        performerName={result.roasterName || "Tonight's comic"}
        bit={standup.bit}
        carLabel={carLabelOf(result)}
        carPhoto={carPhoto || null}
        profile={profile || null}
        segments={segments}
        activeIndex={activeIndex}
        reaction={result.reaction || "savage"}
        engineLabel={result.engine === "offline" ? "offline" : undefined}
      />

      {/* player chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
        <button
          onClick={toggle}
          aria-label={finished ? "Replay" : playing ? "Pause" : "Play"}
          style={{
            flexShrink: 0, width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer",
            background: "var(--ember-600)", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {finished ? "↻" : playing ? "❚❚" : "▶"}
        </button>
        <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--surface)", boxShadow: "var(--elev-1)", overflow: "hidden" }}>
          {/* width is owned by the rAF loop via scrubRef — NOT set in JSX, or each
              beat-change re-render would reset it to 0% and flicker (see review). */}
          <div ref={scrubRef} className="rmr-scrub-fill" style={{ height: "100%", background: "linear-gradient(90deg,var(--flame-500),var(--ember-600))" }} />
        </div>
        <span style={{ flexShrink: 0, font: "var(--type-cap)", color: "var(--text-hint)", minWidth: 34, textAlign: "right" }}>{mmss(totalMs)}</span>
      </div>
    </div>
  );
}

function carLabelOf(result) {
  const c = (result.research && result.research.car) || {};
  return c.label || [c.year, c.make, c.model].filter(Boolean).join(" ") || "your ride";
}
