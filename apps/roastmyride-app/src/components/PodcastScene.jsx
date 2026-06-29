// PodcastScene — the PANEL ("Green Room") reel: a produced two-host podcast SHOW.
//
// This is the "podcast we're watching" format. It's edited like a real multicam
// show: a virtual CAMERA cuts and pushes between a wide two-shot, a close-up on
// whoever's talking, and the studio monitor — while the hosts react to a listener
// SUBMISSION (the user's photo) on the wall screen. Everything is deterministic
// from `timeMs`, so the live preview (StagePlayer) and the exported MP4
// (StageVideo) are frame-identical.
//
// CORE-REUSED: Roaster (host avatars).
import React from "react";
import { Roaster, Callie } from "@callies-universe/core";
import { activeIndexAt, callieStateForBeat } from "../standup.js";
import { popPulse } from "../sceneMotion.js";
import { cfg } from "../subjects/index.js";

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const firstName = (n) => String(n || "").replace(/[“"].*$/, "").split(" ")[0] || "Host";
const ringOf = (id) => (Roaster.roster.find((r) => r.id === id) || {}).ring || "var(--sticker-yellow)";
const hash = (s) => { let h = 5381; for (let i = 0; i < (s || "").length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h >>> 0; };
const REACTIONS = ["💀", "😭", "🔥", "😩", "🚮", "🙏"];

// The shot director: which "camera" we're on for the current beat. Cuts happen on
// beat changes (deterministic by index + active speaker); a slow push lives inside
// each shot. Wide every few beats to re-establish; the rest favor the talker.
function shotFor(idx, activeSpeaker, inLead, inTail, beatType) {
  if (inLead) return { kind: "monitor", scale: 1.0, ox: 50, oy: 50 };
  if (inTail) return { kind: "wide", scale: 1.0, ox: 50, oy: 54 };
  // Cut to Callie's reaction on the hardest beats + occasionally (the host's take).
  if ((beatType === "closer" || (idx > 0 && idx % 5 === 0))) return { kind: "callie", scale: 1.55, ox: 50, oy: 90 };
  if (idx <= 0 || idx % 4 === 0) return { kind: "wide", scale: 1.04, ox: 50, oy: 56 };
  return activeSpeaker === "a"
    ? { kind: "closeA", scale: 1.42, ox: 27, oy: 78 }
    : { kind: "closeB", scale: 1.42, ox: 73, oy: 78 };
}

export const PodcastScene = React.memo(function PodcastScene({
  performers = [],
  carLabel,
  carPhoto,
  segments = [],
  timeMs = 0,
  clips = [],
  leadMs = 0,
  tailMs = 0,
  totalMs = 0,
  reduceMotion = false,
  reaction = "savage",
  score,
}) {
  const idx = activeIndexAt(segments, timeMs);
  const seg = idx >= 0 && idx < segments.length ? segments[idx] : null;
  const beat = seg ? seg.beat : null;
  const a = performers[0] || {};
  const b = performers[1] || {};
  const activeSpeaker = (beat && beat.speaker) || "a";
  const aActive = activeSpeaker === "a";
  const hi = ringOf(aActive ? a.id : b.id);

  const inLead = leadMs > 0 && timeMs < leadMs;
  const inTail = tailMs > 0 && totalMs > 0 && timeMs >= totalMs - tailMs;

  // Camera: a per-beat shot with a slow push inside it, plus a tiny handheld drift.
  const shot = shotFor(idx, activeSpeaker, inLead, inTail, beat && beat.type);
  const pushProg = seg ? clamp01((timeMs - seg.startMs) / Math.max(1, seg.endMs - seg.startMs)) : 0;
  const camScale = (reduceMotion ? shot.scale : shot.scale + 0.05 * pushProg);
  const shakeX = reduceMotion ? 0 : Math.sin(timeMs / 700) * 0.35;
  const shakeY = reduceMotion ? 0 : Math.cos(timeMs / 900) * 0.35;
  const cam = {
    position: "absolute", inset: 0, zIndex: 1,
    transform: `translate(${shakeX}%, ${shakeY}%) scale(${camScale})`,
    transformOrigin: `${shot.ox}% ${shot.oy}%`,
  };

  // talking bob (active) + idle nod (listener)
  const bob = !reduceMotion && seg ? popPulse(timeMs, seg.startMs, 700) : 0;
  const talk = reduceMotion ? 0 : (0.5 + 0.5 * Math.sin(timeMs / 150)); // continuous while active
  const nod = reduceMotion ? 0 : Math.sin(timeMs / 520);
  const livePulse = reduceMotion ? 1 : 0.55 + 0.45 * Math.abs(Math.sin(timeMs / 430));
  // Callie HOSTS the show — her own reaction engine drives her face per beat, with
  // a pop on the hard-landing beats and a gentle idle sway so she's always alive.
  const reactive = !!(beat && (beat.type === "punch" || beat.type === "closer" || beat.type === "crowd"));
  const callieState = callieStateForBeat(beat && beat.type, reaction);
  const calliePop = reactive && !reduceMotion && seg ? popPulse(timeMs, seg.startMs, 600) : 0;
  const callieSway = reduceMotion ? 0 : Math.sin(timeMs / 600);

  return (
    <div data-testid="stage-scene" style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily: "var(--font-display, inherit)", color: "#fff", background: "#08060d" }}>
      {/* ===== FILMED LAYER (the camera moves over this) ===== */}
      <div style={cam}>
        <StudioSet timeMs={timeMs} hideLogo={inLead} />
        <WallMonitor carPhoto={carPhoto} carLabel={carLabel} timeMs={timeMs} opacity={inLead || inTail ? 0 : 1} />
        {/* two host stations */}
        <HostStation performer={a} side="left" active={aActive} bob={aActive ? bob : 0} talk={aActive ? talk : 0} nod={aActive ? 0 : nod} reduceMotion={reduceMotion} />
        <HostStation performer={b} side="right" active={!aActive} bob={!aActive ? bob : 0} talk={!aActive ? talk : 0} nod={!aActive ? 0 : nod} reduceMotion={reduceMotion} />
        {/* desk in front */}
        <Desk />
        {/* Callie HOSTS — center of the desk, reacting through her own engine */}
        <CallieDesk state={callieState} pop={calliePop} sway={callieSway} spotlight={shot.kind === "callie"} />
      </div>

      {/* ===== FIXED UI OVERLAY (doesn't move with the camera) ===== */}
      {/* top bar */}
      <div style={{ position: "absolute", top: "2.4%", left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4.5%", zIndex: 7 }}>
        <span style={{ font: "var(--type-cap)", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(0,0,0,0.45)", padding: "5px 12px", borderRadius: 999 }}>🔥 {cfg("appName")}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, font: "var(--type-cap)", fontWeight: 800, letterSpacing: "0.14em", background: "rgba(0,0,0,0.45)", padding: "5px 12px", borderRadius: 999 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff3b3b", boxShadow: "0 0 9px #ff3b3b", opacity: livePulse }} /> ON AIR
        </span>
      </div>

      {/* hook / captions / outro */}
      {inLead && <SubmissionHook carPhoto={carPhoto} carLabel={carLabel} timeMs={timeMs} leadMs={leadMs} reduceMotion={reduceMotion} />}
      {!inLead && !inTail && (
        <>
          <Caption beat={beat} seg={seg} timeMs={timeMs} words={seg && clips[idx] ? clips[idx].words : undefined} hi={hi} speaker={firstName(aActive ? a.name : b.name)} reduceMotion={reduceMotion} />
          <ReactionPop beat={beat} seg={seg} timeMs={timeMs} aActive={aActive} reduceMotion={reduceMotion} />
          <Chyron carLabel={carLabel} hi={hi} />
        </>
      )}
      {inTail && <Outro timeMs={timeMs} startMs={totalMs - tailMs} reduceMotion={reduceMotion} score={score} />}

      {/* film grade: vignette + grain */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none", background: "radial-gradient(115% 95% at 50% 42%, transparent 52%, rgba(0,0,0,0.6) 100%)" }} />
      <Grain timeMs={timeMs} reduceMotion={reduceMotion} />

      {/* watermark */}
      <div style={{ position: "absolute", bottom: "1.6%", left: 0, right: 0, textAlign: "center", zIndex: 9, font: "var(--type-cap)", fontWeight: 800, color: "rgba(255,255,255,0.92)", textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>@{cfg("handle")}</div>
    </div>
  );
});

/* --------------------------- studio set --------------------------- */

function StudioSet({ timeMs, hideLogo }) {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      {/* back wall gradient */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(125% 80% at 50% 8%, #2c2040 0%, #181024 50%, #0b0712 100%)" }} />
      {/* acoustic foam diamonds */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 18px, transparent 18px 36px), repeating-linear-gradient(45deg, rgba(0,0,0,0.25) 0 18px, transparent 18px 36px)" }} />
      {/* warm key + cool fill */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(36% 28% at 24% 70%, rgba(255,150,70,0.22), transparent 70%), radial-gradient(36% 28% at 76% 70%, rgba(110,150,255,0.18), transparent 70%)" }} />
      {/* bokeh string lights */}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 8 + i * 13, drift = Math.sin(timeMs / (1800 + i * 220) + i) * 1.2;
        return <span key={i} style={{ position: "absolute", top: `${6 + (i % 2) * 4 + drift}%`, left: `${x}%`, width: 7, height: 7, borderRadius: "50%", background: i % 2 ? "#ffd98a" : "#ffb060", boxShadow: "0 0 10px currentColor", color: i % 2 ? "#ffd98a" : "#ffb060", opacity: 0.7 }} />;
      })}
      {/* neon wall logo (hidden during the hook so it never crowds the title) */}
      {!hideLogo && <div style={{ position: "absolute", top: "33%", left: 0, right: 0, textAlign: "center", font: "var(--type-cap)", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 13, color: "#ff8a3d", textShadow: "0 0 10px #ff6a1a, 0 0 22px #ff6a1a", opacity: 0.45 }}>on the lot</div>}
      {/* potted plants */}
      <Plant style={{ left: "1%", bottom: "15%" }} />
      <Plant style={{ right: "1%", bottom: "15%", transform: "scaleX(-1)" }} />
    </div>
  );
}

function Plant({ style }) {
  return (
    <div aria-hidden style={{ position: "absolute", width: "13%", maxWidth: 70, zIndex: 1, ...style }}>
      <div style={{ fontSize: 54, lineHeight: 1, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5)) saturate(0.85) brightness(0.8)" }}>🪴</div>
    </div>
  );
}

function Desk() {
  return (
    <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "15%", zIndex: 4, background: "linear-gradient(180deg, #221730 0%, #100a1a 100%)", borderTop: "2px solid rgba(255,255,255,0.07)", boxShadow: "0 -14px 34px rgba(0,0,0,0.55)" }}>
      <div style={{ position: "absolute", top: "26%", left: 0, right: 0, textAlign: "center", font: "var(--type-cap)", fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{cfg("appName")}</div>
    </div>
  );
}

// The wall-mounted monitor showing the submitted photo (Ken-Burns push).
function WallMonitor({ carPhoto, carLabel, timeMs, opacity }) {
  const zoom = 1.05 + 0.06 * (0.5 + 0.5 * Math.sin(timeMs / 4200));
  return (
    <div style={{ position: "absolute", top: "8.5%", left: "15%", right: "15%", zIndex: 3, opacity }}>
      <div style={{ position: "relative", aspectRatio: "16 / 10", borderRadius: 14, overflow: "hidden", background: "#06060a", border: "7px solid #0a0810", boxShadow: "0 20px 44px rgba(0,0,0,0.65), 0 0 0 2px rgba(255,255,255,0.05) inset" }}>
        {carPhoto ? <img src={carPhoto} alt={cfg("upload.alt")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, display: "block" }} /> : <Placeholder label={carLabel} />}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, transparent 28%)" }} />
        <div style={{ position: "absolute", left: 10, top: 10, font: "var(--type-cap)", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", background: "rgba(255,59,59,0.9)", padding: "3px 9px", borderRadius: 6, fontSize: 11 }}>● Now reviewing</div>
      </div>
      <div aria-hidden style={{ width: 60, height: 9, margin: "7px auto 0", borderRadius: 4, background: "rgba(0,0,0,0.55)" }} />
    </div>
  );
}

/* --------------------------- host stations --------------------------- */

function HostStation({ performer, side, active, bob, talk, nod, reduceMotion }) {
  const pos = side === "left" ? { left: "3.5%" } : { right: "3.5%" };
  const ring = ringOf(performer.id);
  const lift = active ? -10 * bob - 2 * talk : -1.5 * Math.max(0, nod);
  const rot = active ? 0 : 1.2 * nod; // listener nods
  const scale = (active ? 1.0 : 0.92) + (active ? 0.05 * bob + 0.012 * talk : 0);
  return (
    <div style={{ position: "absolute", bottom: "7.5%", width: "40%", maxWidth: 224, zIndex: 5, textAlign: "center", transformOrigin: "bottom center", transform: `translateY(${lift}px) rotate(${rot}deg) scale(${scale})`, opacity: active ? 1 : 0.66, filter: active ? "none" : "saturate(0.72) brightness(0.8)", ...pos }}>
      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "linear-gradient(180deg, #281c3a, #150e22)", border: `3px solid ${active ? ring : "rgba(255,255,255,0.12)"}`, boxShadow: active ? `0 0 26px ${ring}66, 0 14px 30px rgba(0,0,0,0.55)` : "0 12px 24px rgba(0,0,0,0.45)" }}>
        <div style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingTop: "6%" }}>
          <Roaster id={performer.id} size={172} ring={false} />
        </div>
        {active && <span style={{ position: "absolute", top: 9, right: 9, display: "flex", alignItems: "center", gap: 4, font: "var(--type-legal)", fontWeight: 800, background: "rgba(255,59,59,0.92)", padding: "2px 7px", borderRadius: 6 }}>● LIVE</span>}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "7px 8px", background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.78))", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ font: "var(--type-cap)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>{firstName(performer.name)}</span>
          {active && <Waveform reduceMotion={reduceMotion} talk={talk} ring={ring} />}
        </div>
      </div>
    </div>
  );
}

// Callie HOSTS the show — at the desk center, reacting through her own engine. A
// warm spotlight blooms behind her when the camera cuts to her reaction.
function CallieDesk({ state, pop, sway, spotlight }) {
  return (
    <div style={{ position: "absolute", bottom: "5%", left: "50%", zIndex: 6, transformOrigin: "bottom center", transform: `translateX(-50%) translateY(${-10 * pop}px) rotate(${1.5 * sway}deg) scale(${1 + 0.14 * pop})`, textAlign: "center" }}>
      {spotlight && <div aria-hidden style={{ position: "absolute", inset: "-45% -70%", zIndex: -1, background: "radial-gradient(circle, rgba(255,210,120,0.30), transparent 66%)" }} />}
      <Callie state={state} size={92} />
      <div style={{ marginTop: -2, font: "var(--type-legal)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(0,0,0,0.6)", display: "inline-block", padding: "2px 9px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)" }}>★ Callie</div>
    </div>
  );
}

function Waveform({ talk, ring, reduceMotion }) {
  const bars = 5;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2, height: 12 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = reduceMotion ? 6 : 3 + 9 * Math.abs(Math.sin(talk * Math.PI + i));
        return <span key={i} style={{ width: 2.5, height: h, borderRadius: 2, background: ring }} />;
      })}
    </span>
  );
}

/* --------------------------- hook / captions / chyron / outro --------------------------- */

function SubmissionHook({ carPhoto, carLabel, timeMs, leadMs, reduceMotion }) {
  const inP = reduceMotion ? 1 : clamp01(timeMs / Math.max(1, leadMs * 0.4));
  const op = reduceMotion ? 1 : Math.min(inP, clamp01((leadMs - timeMs) / 280));
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 7, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3%", opacity: op }}>
      <div style={{ font: "var(--type-cap)", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sticker-yellow)" }}>tonight's submission</div>
      <div style={{ width: "74%", transform: `scale(${0.85 + 0.15 * inP})` }}>
        <div style={{ aspectRatio: "16 / 10", borderRadius: 16, overflow: "hidden", background: "#06060a", border: "6px solid #fff", boxShadow: "0 22px 50px rgba(0,0,0,0.6)" }}>
          {carPhoto ? <img src={carPhoto} alt={cfg("upload.alt")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <Placeholder label={carLabel} />}
        </div>
      </div>
      <div style={{ fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(24px, 8vw, 46px)", WebkitTextStroke: "2px #1a1008", textShadow: "0 4px 0 rgba(0,0,0,0.5)", padding: "0 6%", textAlign: "center" }}>{carLabel || cfg("brain.subjectNoun")}</div>
    </div>
  );
}

function tokenize(beat) {
  if (!beat) return [];
  const out = [];
  const push = (s, punch) => String(s || "").split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, punch }));
  push(beat.text, false);
  if (beat.punch) push(beat.punch, true);
  push(beat.tail, false);
  return out;
}

function Caption({ beat, seg, timeMs, words: timed, hi, speaker, reduceMotion }) {
  const tokens = React.useMemo(() => tokenize(beat), [beat]);
  if (!beat || !tokens.length) return null;
  const startMs = seg ? seg.startMs : 0;
  const dur = Math.max(1, (seg ? seg.endMs : 0) - startMs);
  const rel = timeMs - startMs;
  const aligned = Array.isArray(timed) && timed.length === tokens.length ? timed : null;
  let active = 0;
  if (aligned) { for (let i = 0; i < aligned.length; i++) { if (rel >= aligned[i].startMs) active = i; else break; } }
  else { active = Math.min(tokens.length - 1, Math.floor(clamp01(rel / dur) * tokens.length)); }
  const fs = tokens.length > 12 ? "clamp(17px, 4.6vw, 28px)" : tokens.length > 7 ? "clamp(20px, 6vw, 36px)" : "clamp(24px, 7.4vw, 44px)";
  const enter = reduceMotion ? 1 : clamp01(rel / 200);
  return (
    <div style={{ position: "absolute", left: "5%", right: "5%", top: "38%", transform: `translateY(${(1 - enter) * 12}px)`, zIndex: 7, textAlign: "center" }}>
      <div style={{ display: "inline-block", marginBottom: 8, font: "var(--type-cap)", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1008", background: hi, padding: "3px 13px", borderRadius: 999, boxShadow: "0 3px 10px rgba(0,0,0,0.45)" }}>{speaker}</div>
      {/* subtle scrim so the line reads cleanly over the busy studio */}
      <div style={{ display: "inline-block", maxWidth: "100%", padding: "9px 13px", borderRadius: 16, background: "rgba(8,6,14,0.42)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.13em 0.28em" }}>
          {tokens.map((tok, i) => {
            const hot = tok.punch || i === active;
            const revealed = reduceMotion || i <= active;
            return (
              <span key={i} style={{ fontWeight: 900, fontSize: fs, lineHeight: 1.08, textTransform: "uppercase", color: hot ? "#1a1008" : "#fff", background: hot ? hi : "transparent", padding: hot ? "0 0.12em" : 0, borderRadius: 7, WebkitTextStroke: hot ? "0" : "1.5px #1a1008", textShadow: hot ? "none" : "0 2px 0 rgba(0,0,0,0.6)", opacity: revealed ? 1 : 0, transform: `scale(${i === active && !reduceMotion ? 1.08 : 1})` }}>{tok.w}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// A reaction emoji pops near the active host on punch beats (viral-coded).
function ReactionPop({ beat, seg, timeMs, aActive, reduceMotion }) {
  if (!beat || !beat.punch || !seg || reduceMotion) return null;
  const rel = timeMs - seg.startMs;
  const life = 1200;
  if (rel < 0 || rel > life) return null;
  const p = clamp01(rel / life);
  const emoji = REACTIONS[hash(beat.text) % REACTIONS.length];
  return (
    <div style={{ position: "absolute", bottom: `${30 + 16 * p}%`, [aActive ? "left" : "right"]: "16%", zIndex: 7, fontSize: 56, opacity: (1 - p) * 0.95, transform: `scale(${0.6 + 0.6 * Math.min(1, p * 3)}) rotate(${aActive ? -8 : 8}deg)`, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}>{emoji}</div>
  );
}

function Chyron({ carLabel, hi }) {
  return (
    <div style={{ position: "absolute", left: 0, bottom: "24.5%", zIndex: 7, display: "flex", alignItems: "stretch", maxWidth: "92%" }}>
      <span style={{ background: hi, color: "#1a1008", font: "var(--type-cap)", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", padding: "5px 10px", display: "flex", alignItems: "center" }}>Now reviewing</span>
      <span style={{ background: "rgba(10,8,16,0.9)", color: "#fff", font: "var(--type-cap)", fontWeight: 800, padding: "5px 12px", display: "flex", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", textTransform: "uppercase", letterSpacing: "0.03em" }}>{carLabel || cfg("brain.subjectNoun")}</span>
    </div>
  );
}

function Outro({ timeMs, startMs, reduceMotion, score }) {
  const p = reduceMotion ? 1 : clamp01((timeMs - startMs) / 500);
  const has = typeof score === "number" && score > 0;
  const cook = has ? Math.round(score * 10) / 10 : null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4%", opacity: p, background: "rgba(8,6,13,0.88)" }}>
      {has && (
        <div style={{ textAlign: "center", transform: `scale(${0.85 + 0.15 * p})` }}>
          <div style={{ font: "var(--type-cap)", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>the verdict</div>
          <div style={{ fontWeight: 900, fontSize: "clamp(48px, 18vw, 100px)", color: "var(--sticker-yellow)", WebkitTextStroke: "3px #1a1008", textShadow: "0 6px 0 rgba(0,0,0,0.5)", lineHeight: 1 }}>{cook}<span style={{ fontSize: "0.4em" }}>/10</span></div>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 900, textTransform: "uppercase", color: "#fff", fontSize: "clamp(26px, 9vw, 52px)", WebkitTextStroke: "2px #1a1008" }}>Submit yours</div>
        <div style={{ fontWeight: 900, marginTop: 8, fontSize: "clamp(18px, 6vw, 32px)", color: "var(--sticker-yellow)" }}>👉 @{cfg("handle")}</div>
      </div>
    </div>
  );
}

function Grain({ timeMs, reduceMotion }) {
  if (reduceMotion) return null;
  const shift = Math.floor(timeMs / 90) % 6; // jitter the noise a few px per ~tenth-sec
  return (
    <div aria-hidden style={{ position: "absolute", inset: "-6px", zIndex: 8, pointerEvents: "none", opacity: 0.05, transform: `translate(${shift}px, ${(shift * 2) % 6}px)`, backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 0.5px, transparent 0.6px)", backgroundSize: "3px 3px" }} />
  );
}

function Placeholder({ label }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, color: "rgba(255,255,255,0.7)", background: "#0c0810" }}>
      <span style={{ fontSize: 34 }}>{cfg("theme.emoji")}</span>
      <span style={{ font: "var(--type-legal)", padding: "0 6px", textAlign: "center" }}>{label || cfg("brain.subjectNoun")}</span>
    </div>
  );
}
