// RoastMyRide — StageScene [ROASTMYRIDE-NEW: app-layer]. THE roast reel.
//
// The viral "gameplay + voiceover + big subtitles" format: the comedian's roast
// plays as a VO over looping gameplay, with the comic as a static sticker, the
// car (and profile, if given) as stickers, and BIG word-by-word captions in the
// social-video style. One declarative, PROP-DRIVEN scene = the single source of
// truth: deterministic from `timeMs`, so the same scene the app plays live drives
// the exported video frame-identically (live = StagePlayer's rAF clock; video =
// Remotion's frame clock).
//
// The gameplay BACKGROUND is a host-layered, user-supplied licensed video
// (`backgroundUrl` → the host renders <video>/<OffthreadVideo> behind this scene,
// which then goes transparent). With no asset, a deterministic faux-gameplay
// backdrop renders so it always works. We do NOT ship copyrighted footage.
//
// Product rules kept structural: the CAR is ALWAYS shown (sticker); the PROFILE
// shows only if submitted (blurred per the toggle). Two-performer rule: the comic
// performs (VO); Callie only reacts (sticker).
//
// CORE-REUSED: Roaster (comic sticker), Callie (reaction sticker).
import React, { useMemo } from "react";
import { Roaster, Callie } from "@callies-universe/core";
import { activeIndexAt, callieStateForBeat } from "../standup.js";
import { popPulse } from "../sceneMotion.js";

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

export const StageScene = React.memo(function StageScene({
  comedianId,
  performerName,
  carLabel,
  carPhoto,
  profile,
  segments = [],
  timeMs = 0,
  reaction = "savage",
  backgroundUrl, // when set, the HOST layers the real gameplay video; we go transparent
  fauxStyle = "blocks", // which faux-gameplay backdrop to draw when there's no real loop
  clips = [], // per-beat voice clips (carry word timings for karaoke captions), aligned by beat index
  leadMs = 0, // opening-hook window: [0, leadMs)
  tailMs = 0, // closing-CTA window: [totalMs - tailMs, totalMs)
  totalMs = 0,
  reduceMotion = false, // live: honor prefers-reduced-motion. Export always animates (deterministic).
}) {
  const idx = activeIndexAt(segments, timeMs);
  const seg = idx >= 0 && idx < segments.length ? segments[idx] : null;
  const beat = seg ? seg.beat : null;
  const type = beat ? beat.type : "setup";
  const hasProfile = !!(profile && profile.dataUrl);
  const reacts = type === "punch" || type === "closer" || type === "crowd";
  const callieState = callieStateForBeat(type, reaction);
  const calliePop = reacts && !reduceMotion ? popPulse(timeMs, seg ? seg.startMs : 0, 700) : 0;
  // Per-comic caption signature: each comedian highlights in their core ring color,
  // so a Kenji reel and a Tony reel read differently at a glance.
  const seed = Roaster.roster.find((r) => r.id === comedianId) || Roaster.roster[0];
  const hiColor = (seed && seed.ring) || "var(--sticker-yellow)";
  // Punch-in: emphasis pulse on the punch/closer beats (the caption + the comic hit).
  const emphasize = (type === "punch" || type === "closer") && !reduceMotion;
  const beatPop = emphasize ? popPulse(timeMs, seg ? seg.startMs : 0, 600) : 0;
  // Chrome windows: hook (grab) at the open, CTA (convert) at the close.
  const inLead = leadMs > 0 && timeMs < leadMs;
  const inTail = tailMs > 0 && totalMs > 0 && timeMs >= totalMs - tailMs;
  // The car (and owner) are showcased BIG during the hook, then crossfade to their
  // corner stickers as the set starts. cornerReveal: 0 during the showcase → 1 after.
  const cornerReveal = leadMs > 0 && !reduceMotion ? clamp01((timeMs - (leadMs - 220)) / 300) : 1;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", color: "#fff", fontFamily: "var(--font-display, inherit)" }} data-testid="stage-scene">
      {/* background: real gameplay is layered by the host; else faux fallback */}
      {!backgroundUrl && <FauxGameplay timeMs={timeMs} style={fauxStyle} />}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 22%, transparent 62%, rgba(0,0,0,0.55) 100%)" }} />

      {/* brand chip */}
      <div style={{ position: "absolute", top: "2.5%", left: 0, right: 0, textAlign: "center", zIndex: 5 }}>
        <span style={{ font: "var(--type-cap)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", background: "rgba(0,0,0,0.45)", color: "var(--sticker-yellow)", padding: "5px 12px", borderRadius: "var(--radius-pill)" }}>
          🔥 RoastMyRide
        </span>
      </div>

      {/* the car — ALWAYS on screen, as a tilted polaroid sticker (crossfades in
          after the big showcase during the hook) */}
      <Sticker style={{ top: "8%", left: "4%", transform: "rotate(-5deg)", opacity: cornerReveal }} tag="🚗 the ride" tone="var(--sticker-yellow)">
        {carPhoto ? <img src={carPhoto} alt="The car" style={imgFill} /> : <PlaceholderCar label={carLabel} />}
      </Sticker>

      {/* the owner — only if a profile was submitted */}
      {hasProfile && (
        <Sticker style={{ top: "8%", right: "4%", transform: "rotate(5deg)", opacity: cornerReveal }} tag="the owner" tone="#8FC2FF">
          <img src={profile.dataUrl} alt="The owner" style={{ ...imgFill, filter: profile.blur ? "blur(8px)" : "none" }} />
        </Sticker>
      )}

      {/* center stage: opening hook → captions → closing CTA */}
      {inLead ? (
        <Hook carPhoto={carPhoto} carLabel={carLabel} profile={profile} timeMs={timeMs} leadMs={leadMs} reduceMotion={reduceMotion} />
      ) : inTail ? (
        <Outro performerName={performerName} timeMs={timeMs} startMs={totalMs - tailMs} reduceMotion={reduceMotion} />
      ) : (
        <Captions beat={beat} startMs={seg ? seg.startMs : 0} endMs={seg ? seg.endMs : 0} timeMs={timeMs} words={seg && clips[idx] ? clips[idx].words : undefined} hi={hiColor} emphasis={beatPop} reduceMotion={reduceMotion} />
      )}

      {/* the comic — sticker performer; hits a little on the punch/closer beats */}
      <div style={{ position: "absolute", bottom: "9%", left: "3%", zIndex: 5, textAlign: "center", transform: `translateY(${-8 * beatPop}px) scale(${1 + 0.08 * beatPop})`, transformOrigin: "bottom center" }}>
        <Comic comedianId={comedianId} />
        <div style={{ marginTop: -6, font: "var(--type-legal)", fontWeight: 800, background: "rgba(0,0,0,0.5)", display: "inline-block", padding: "2px 8px", borderRadius: 999 }}>
          🎤 {firstName(performerName)}
        </div>
      </div>

      {/* Callie reacts (mascot, never the performer) */}
      <div style={{ position: "absolute", bottom: "9%", right: "4%", zIndex: 5, transform: `translateY(${-10 * calliePop}px) scale(${1 + 0.14 * calliePop})` }}>
        <Reaction state={callieState} />
      </div>

      {/* watermark */}
      <div style={{ position: "absolute", bottom: "2.5%", left: 0, right: 0, textAlign: "center", zIndex: 5, font: "var(--type-cap)", fontWeight: 800, color: "rgba(255,255,255,0.92)", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
        @roastmyride
      </div>

    </div>
  );
});

/* --------------------------- captions --------------------------- */

function tokenize(beat) {
  if (!beat) return [];
  const out = [];
  const push = (s, punch) => {
    String(s || "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => out.push({ w, punch }));
  };
  push(beat.text, false);
  if (beat.punch) push(beat.punch, true);
  push(beat.tail, false);
  return out;
}

function Captions({ beat, startMs, endMs, timeMs, words: timedWords, hi = "var(--sticker-yellow)", emphasis = 0, reduceMotion = false }) {
  // tokenize is keyed on the beat (stable within a segment), so we don't re-split
  // the same text every animation frame as timeMs ticks.
  const tokens = useMemo(() => tokenize(beat), [beat]);
  if (!beat || !tokens.length) return null;
  const dur = Math.max(1, endMs - startMs);
  const rel = timeMs - startMs; // time into this beat's clip
  // Use REAL per-word timings when they line up 1:1 with our tokens (true karaoke);
  // otherwise fall back to the even-time estimate (offline / no key).
  const timed = Array.isArray(timedWords) && timedWords.length === tokens.length ? timedWords : null;
  let active = 0;
  if (timed) {
    for (let i = 0; i < timed.length; i++) { if (rel >= timed[i].startMs) active = i; else break; }
  } else {
    active = Math.min(tokens.length - 1, Math.floor(clamp01(rel / dur) * tokens.length));
  }
  // Long beats wrap to more lines → shrink so they stay in the safe center.
  const fs = tokens.length > 12 ? "clamp(20px, 6vw, 36px)" : tokens.length > 8 ? "clamp(23px, 7.5vw, 44px)" : "clamp(26px, 9vw, 52px)";
  // Gentle entrance on each beat change (the block rises into place over ~200ms).
  const enter = reduceMotion ? 1 : clamp01(rel / 200);

  return (
    <div style={{ position: "absolute", left: "8%", right: "8%", top: "50%", transform: `translateY(calc(-50% + ${(1 - enter) * 14}px)) scale(${1 + 0.06 * emphasis})`, zIndex: 6, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.18em 0.32em" }}>
      {tokens.map((tok, i) => {
        const revealed = i <= active;
        const isActive = i === active;
        const hot = tok.punch || isActive;
        // Reduced motion: show the whole caption, static (no per-word pop/reveal);
        // the active word is still color-highlighted (color ≠ motion).
        const scale = reduceMotion ? 1 : revealed ? (isActive ? 1.12 : 1) : 0.7;
        return (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-display, inherit)",
              fontWeight: 900,
              fontSize: fs,
              lineHeight: 1.04,
              textTransform: "uppercase",
              color: hot ? "var(--ink)" : "#fff",
              background: hot ? hi : "transparent",
              padding: hot ? "0 0.12em" : 0,
              borderRadius: 8,
              WebkitTextStroke: hot ? "0" : "2px #1a1008",
              textShadow: hot ? "none" : "0 3px 0 rgba(0,0,0,0.55)",
              opacity: reduceMotion || revealed ? 1 : 0,
              transform: `scale(${scale})`,
              transition: "none",
            }}
          >
            {tok.w}
          </span>
        );
      })}
    </div>
  );
}

/* --------------------------- chrome: hook + CTA --------------------------- */

const centerStage = { position: "absolute", left: "8%", right: "8%", top: "50%", transform: "translateY(-50%)", zIndex: 6, textAlign: "center" };
const bigText = { fontFamily: "var(--font-display, inherit)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.02, WebkitTextStroke: "2px #1a1008", textShadow: "0 4px 0 rgba(0,0,0,0.5)" };

// Opening hook = the SHOWCASE: the car (always) presented BIG, the owner too if
// submitted, then it crossfades to the corner stickers as the set starts.
function Hook({ carPhoto, carLabel, profile, timeMs, leadMs, reduceMotion }) {
  const inP = reduceMotion ? 1 : clamp01(timeMs / Math.max(1, leadMs * 0.4)); // entrance over first 40%
  const op = reduceMotion ? 1 : Math.min(inP, clamp01((leadMs - timeMs) / 250)); // fade out last 250ms
  const hasProfile = !!(profile && profile.dataUrl);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3%", opacity: op }}>
      <div style={{ font: "var(--type-cap)", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--sticker-yellow)" }}>tonight's victim</div>
      <div style={{ display: "flex", gap: "4%", alignItems: "center", justifyContent: "center", width: "100%", transform: `scale(${0.82 + 0.18 * inP})` }}>
        <ShowcaseFrame w={hasProfile ? "46%" : "64%"} rotate={-3}>
          {carPhoto ? <img src={carPhoto} alt="The car" style={imgFill} /> : <PlaceholderCar label={carLabel} />}
        </ShowcaseFrame>
        {hasProfile && (
          <ShowcaseFrame w="30%" rotate={4} tag="the owner">
            <img src={profile.dataUrl} alt="The owner" style={{ ...imgFill, filter: profile.blur ? "blur(8px)" : "none" }} />
          </ShowcaseFrame>
        )}
      </div>
      <div style={{ ...bigText, color: "#fff", fontSize: "clamp(26px, 9vw, 52px)", padding: "0 6%" }}>
        {carLabel || "your ride"} <span aria-hidden="true">💀</span>
      </div>
    </div>
  );
}

function ShowcaseFrame({ w, rotate = 0, tag, children }) {
  return (
    <div style={{ width: w, transform: `rotate(${rotate}deg)` }}>
      <div style={{ background: "#fff", padding: "3%", paddingBottom: tag ? "10%" : "3%", borderRadius: 12, boxShadow: "0 14px 34px rgba(0,0,0,0.55)" }}>
        <div style={{ aspectRatio: "1 / 1", borderRadius: 6, overflow: "hidden", background: "#0c0805" }}>{children}</div>
        {tag && <div style={{ marginTop: 4, font: "var(--type-legal)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink)", textAlign: "center" }}>{tag}</div>}
      </div>
    </div>
  );
}

// Closing CTA — convert.
function Outro({ performerName, timeMs, startMs, reduceMotion }) {
  const p = reduceMotion ? 1 : clamp01((timeMs - startMs) / 500);
  return (
    <div style={{ ...centerStage, opacity: p }}>
      <div style={{ ...bigText, color: "var(--sticker-yellow)", fontSize: "clamp(34px, 13vw, 72px)", transform: `scale(${0.92 + 0.08 * p})` }}>Roast<br />yours</div>
      <div style={{ fontFamily: "var(--font-display, inherit)", fontWeight: 900, color: "#fff", marginTop: 10, fontSize: "clamp(20px, 7vw, 36px)" }}>👉 @roastmyride</div>
    </div>
  );
}

/* --------------------------- background --------------------------- */

// Deterministic faux-gameplay backdrops (timeMs-driven, so live === export). A
// stand-in for a licensed loop (backgroundUrl); three distinct looks so different
// reels read differently. We ship no copyrighted footage.
function FauxGameplay({ timeMs, style = "blocks" }) {
  if (style === "runner") return <RunnerBg timeMs={timeMs} />;
  if (style === "parkour") return <ParkourBg timeMs={timeMs} />;
  return <BlocksBg timeMs={timeMs} />;
}

const bgBase = { position: "absolute", inset: 0, zIndex: 0 };

function BlocksBg({ timeMs }) {
  // Mining/voxel vibe: a blocky grid + parallax ore-dots scrolling up.
  const y1 = (timeMs * 0.1) % 112;
  const y2 = (timeMs * 0.2) % 220;
  return (
    <div aria-hidden="true" style={{ ...bgBase, background: "linear-gradient(180deg, #3a7bd5 0%, #0b2545 55%, #050b16 100%)" }}>
      <div style={{ position: "absolute", inset: "-20% 0", backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 56px), repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 56px)", backgroundPosition: `0 ${-y1}px, 0 0`, opacity: 0.7 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(7px 7px at 18% 30%, #7ee787 30%, transparent 32%), radial-gradient(9px 9px at 68% 60%, #ffd33d 30%, transparent 32%), radial-gradient(6px 6px at 44% 82%, #ff7b72 30%, transparent 32%), radial-gradient(8px 8px at 84% 22%, #a371f7 30%, transparent 32%)", backgroundSize: "100% 220px", backgroundPosition: `0 ${-y2}px`, opacity: 0.5 }} />
    </div>
  );
}

function RunnerBg({ timeMs }) {
  // Endless-runner vibe: a track with converging lanes + speed stripes rushing down.
  const s = (timeMs * 0.4) % 64;
  return (
    <div aria-hidden="true" style={{ ...bgBase, background: "linear-gradient(180deg, #10243f 0%, #16324f 38%, #244a6e 100%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "62%", background: "linear-gradient(180deg, #2a3550 0%, #3a4a6b 100%)", clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0% 100%)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.18) 0 6px, transparent 6px 64px)", backgroundPosition: `0 ${s}px` }} />
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: 0, top: "38%", width: 2, background: "rgba(255,255,255,0.22)", transform: "translateX(-50%) rotate(12deg)", transformOrigin: "top" }} />
      <div style={{ position: "absolute", left: "50%", bottom: 0, top: "38%", width: 2, background: "rgba(255,255,255,0.22)", transform: "translateX(-50%) rotate(-12deg)", transformOrigin: "top" }} />
    </div>
  );
}

function ParkourBg({ timeMs }) {
  // Neon-platform vibe: glowing bars drifting up at two parallax speeds.
  const y1 = (timeMs * 0.16) % 160;
  const y2 = (timeMs * 0.26) % 240;
  return (
    <div aria-hidden="true" style={{ ...bgBase, background: "radial-gradient(120% 80% at 50% 0%, #2a1a52 0%, #160d33 50%, #090616 100%)" }}>
      <div style={{ position: "absolute", inset: "-20% 0", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 120px, rgba(126,231,135,0.55) 120px 132px, transparent 132px 160px)", backgroundPosition: `0 ${-y1}px`, filter: "drop-shadow(0 0 6px rgba(126,231,135,0.6))" }} />
      <div style={{ position: "absolute", inset: "-20% 0", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 200px, rgba(255,79,163,0.4) 200px 210px, transparent 210px 240px)", backgroundPosition: `0 ${-y2}px`, opacity: 0.8 }} />
    </div>
  );
}

/* --------------------------- stickers --------------------------- */

function Sticker({ style, tag, tone, children }) {
  return (
    <div style={{ position: "absolute", width: "30%", maxWidth: 130, zIndex: 5, ...style }}>
      <div style={{ background: "#fff", padding: 5, paddingBottom: 18, borderRadius: 8, boxShadow: "0 8px 22px rgba(0,0,0,0.5)" }}>
        <div style={{ aspectRatio: "1 / 1", borderRadius: 4, overflow: "hidden", background: "#0c0805" }}>{children}</div>
        <div style={{ marginTop: 3, font: "var(--type-legal)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink)", textAlign: "center" }}>{tag}</div>
      </div>
      <span aria-hidden="true" style={{ position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)", width: 22, height: 14, background: tone, opacity: 0.85, borderRadius: 2 }} />
    </div>
  );
}

const imgFill = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

function PlaceholderCar({ label }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: "rgba(255,255,255,0.7)" }}>
      <span style={{ fontSize: 30 }}>🚗</span>
      <span style={{ font: "var(--type-legal)", padding: "0 4px", textAlign: "center" }}>{label || "your ride"}</span>
    </div>
  );
}

const Comic = React.memo(function Comic({ comedianId }) {
  return <Roaster id={comedianId} size={96} />;
});
const Reaction = React.memo(function Reaction({ state }) {
  return <Callie state={state} size={64} />;
});

function firstName(name) {
  return String(name || "").replace(/[“"].*$/, "").split(" ")[0] || "Comic";
}
