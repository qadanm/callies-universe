// PodcastScene — the PANEL ("Green Room") reel: a two-host podcast STUDIO.
//
// Static, unzoomed framing the whole time (no camera cuts/push-ins) — cleaner and
// reads better on a phone. Optimized for vertical social: BIG captions sized in
// container units (cqi) so they're large on a phone regardless of render scale.
// Hosts + Callie react subtly (no wobble/bounce); Callie reacts through her FACE
// (her own state engine). Deterministic from `timeMs` → live preview == export.
//
// CORE-REUSED: Roaster (host avatars), Callie (host mascot).
import React from "react";
import { Roaster, Callie } from "@callies-universe/core";
import { activeIndexAt, callieStateForBeat } from "../standup.js";
import { popPulse } from "../sceneMotion.js";
import { cfg } from "../subjects/index.js";

// Social safe zones (1080×1920): the studio BACKGROUND bleeds full-frame, but every
// face / caption / CTA stays inside this band so the platform UI (right action rail,
// bottom caption + buttons, top status) never covers it. Cross-platform compromise
// (TikTok ~120px right / ~320px bottom; Reels bottom ~420px) — graceful, not boxed-in.
const SAFE = { top: 9, right: 12, bottom: 18, left: 5 };
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const firstName = (n) => String(n || "").replace(/[“"].*$/, "").split(" ")[0] || "Host";
const ringOf = (id) => (Roaster.roster.find((r) => r.id === id) || {}).ring || "var(--sticker-yellow)";
const hash = (s) => { let h = 5381; for (let i = 0; i < (s || "").length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h >>> 0; };
const REACTIONS = ["💀", "😭", "🔥", "😩", "🚮", "🙏"];

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

  // Minimal motion: a small hit on the active host's beat; Callie reacts with her
  // FACE (her engine) + a tiny scale pop on the hard beats. No wobble, no zoom.
  const bob = !reduceMotion && seg ? popPulse(timeMs, seg.startMs, 650) : 0;
  const livePulse = reduceMotion ? 1 : 0.55 + 0.45 * Math.abs(Math.sin(timeMs / 430));
  const callieState = callieStateForBeat(beat && beat.type, reaction);
  const hardBeat = !!(beat && (beat.type === "punch" || beat.type === "closer"));
  const calliePop = hardBeat && !reduceMotion && seg ? popPulse(timeMs, seg.startMs, 550) : 0;

  return (
    <div data-testid="stage-scene" style={{ position: "absolute", inset: 0, overflow: "hidden", containerType: "inline-size", fontFamily: "var(--font-display, inherit)", color: "#fff", background: "#08060d" }}>
      {/* ===== STUDIO (static, full frame) ===== */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <StudioSet timeMs={timeMs} hideLogo={inLead} />
        <WallMonitor carPhoto={carPhoto} carLabel={carLabel} timeMs={timeMs} opacity={inLead || inTail ? 0 : 1} />
        <HostStation performer={a} side="left" active={aActive} bob={aActive ? bob : 0} timeMs={timeMs} />
        <HostStation performer={b} side="right" active={!aActive} bob={!aActive ? bob : 0} timeMs={timeMs} />
        <Desk />
        <CallieDesk state={callieState} pop={calliePop} />
      </div>

      {/* ===== OVERLAY UI ===== */}
      <div style={{ position: "absolute", top: `${SAFE.top}%`, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: `0 ${SAFE.left + 1}%`, zIndex: 7 }}>
        <span style={{ fontWeight: 800, fontSize: "2.8cqi", letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(0,0,0,0.45)", padding: "6px 13px", borderRadius: 999 }}>🔥 {cfg("appName")}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 800, fontSize: "2.8cqi", letterSpacing: "0.12em", background: "rgba(0,0,0,0.45)", padding: "6px 13px", borderRadius: 999 }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff3b3b", boxShadow: "0 0 9px #ff3b3b", opacity: livePulse }} /> ON AIR
        </span>
      </div>

      {inLead && <BrandedIntro carPhoto={carPhoto} carLabel={carLabel} timeMs={timeMs} leadMs={leadMs} />}
      {!inLead && !inTail && (
        <>
          <Caption beat={beat} seg={seg} timeMs={timeMs} words={seg && clips[idx] ? clips[idx].words : undefined} hi={hi} speaker={firstName(aActive ? a.name : b.name)} reduceMotion={reduceMotion} />
          <ReactionPop beat={beat} seg={seg} timeMs={timeMs} aActive={aActive} reduceMotion={reduceMotion} />
        </>
      )}
      {inTail && <BrandedOutro timeMs={timeMs} startMs={totalMs - tailMs} tailMs={tailMs} score={score} carPhoto={carPhoto} carLabel={carLabel} />}

      {/* film grade */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none", background: "radial-gradient(115% 95% at 50% 42%, transparent 54%, rgba(0,0,0,0.58) 100%)" }} />
      <Grain timeMs={timeMs} reduceMotion={reduceMotion} />

      {typeof window !== "undefined" && window.__SAFE_DEBUG && <SafeGuides />}
    </div>
  );
});

// Dev-only: translucent overlay of the platform dead zones to verify nothing
// important sits under the action rail / caption bar. Off in render (no window).
function SafeGuides() {
  const band = (s) => ({ position: "absolute", background: "rgba(255,0,80,0.22)", outline: "1px solid rgba(255,0,80,0.5)", zIndex: 30, ...s });
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none" }}>
      <div style={band({ top: 0, left: 0, right: 0, height: `${SAFE.top}%` })} />
      <div style={band({ bottom: 0, left: 0, right: 0, height: `${SAFE.bottom}%` })} />
      <div style={band({ top: 0, right: 0, bottom: 0, width: `${SAFE.right}%` })} />
      <div style={band({ top: 0, left: 0, bottom: 0, width: `${SAFE.left}%` })} />
    </div>
  );
}

/* --------------------------- studio set --------------------------- */

function StudioSet({ timeMs, hideLogo }) {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(125% 80% at 50% 8%, #2c2040 0%, #181024 50%, #0b0712 100%)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 18px, transparent 18px 36px), repeating-linear-gradient(45deg, rgba(0,0,0,0.25) 0 18px, transparent 18px 36px)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(36% 28% at 24% 70%, rgba(255,150,70,0.22), transparent 70%), radial-gradient(36% 28% at 76% 70%, rgba(110,150,255,0.18), transparent 70%)" }} />
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 8 + i * 13, drift = Math.sin(timeMs / (1800 + i * 220) + i) * 1.0;
        return <span key={i} style={{ position: "absolute", top: `${6 + (i % 2) * 4 + drift}%`, left: `${x}%`, width: 8, height: 8, borderRadius: "50%", background: i % 2 ? "#ffd98a" : "#ffb060", boxShadow: "0 0 10px currentColor", color: i % 2 ? "#ffd98a" : "#ffb060", opacity: 0.7 }} />;
      })}
      {!hideLogo && <div style={{ position: "absolute", top: "32%", left: 0, right: 0, textAlign: "center", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "2.8cqi", color: "#ff8a3d", textShadow: "0 0 10px #ff6a1a, 0 0 22px #ff6a1a", opacity: 0.4 }}>on the lot</div>}
      <Plant style={{ left: "1%", bottom: "15%" }} />
      <Plant style={{ right: "1%", bottom: "15%", transform: "scaleX(-1)" }} />
    </div>
  );
}

function Plant({ style }) {
  return <div aria-hidden style={{ position: "absolute", width: "13%", maxWidth: 70, zIndex: 1, ...style }}><div style={{ fontSize: "11cqi", lineHeight: 1, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5)) saturate(0.85) brightness(0.8)" }}>🪴</div></div>;
}

function Desk() {
  return (
    <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "15%", zIndex: 4, background: "linear-gradient(180deg, #221730 0%, #100a1a 100%)", borderTop: "2px solid rgba(255,255,255,0.07)", boxShadow: "0 -14px 34px rgba(0,0,0,0.55)" }}>
      <div style={{ position: "absolute", top: "26%", left: 0, right: 0, textAlign: "center", fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: "2.2cqi", color: "rgba(255,255,255,0.32)" }}>{cfg("appName")}</div>
    </div>
  );
}

function WallMonitor({ carPhoto, carLabel, timeMs, opacity }) {
  const zoom = 1.05 + 0.06 * (0.5 + 0.5 * Math.sin(timeMs / 4200));
  return (
    <div style={{ position: "absolute", top: "12%", left: "15%", right: "15%", zIndex: 3, opacity }}>
      <div style={{ position: "relative", aspectRatio: "16 / 10", borderRadius: 14, overflow: "hidden", background: "#06060a", border: "7px solid #0a0810", boxShadow: "0 20px 44px rgba(0,0,0,0.65), 0 0 0 2px rgba(255,255,255,0.05) inset" }}>
        {carPhoto ? <img src={carPhoto} alt={cfg("upload.alt")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, display: "block" }} /> : <Placeholder label={carLabel} />}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, transparent 28%)" }} />
        <div style={{ position: "absolute", left: 12, top: 12, fontWeight: 800, fontSize: "2.6cqi", letterSpacing: "0.05em", textTransform: "uppercase", background: "rgba(255,59,59,0.9)", padding: "4px 11px", borderRadius: 7 }}>● Now reviewing</div>
      </div>
      <div aria-hidden style={{ width: 64, height: 9, margin: "7px auto 0", borderRadius: 4, background: "rgba(0,0,0,0.55)" }} />
    </div>
  );
}

/* --------------------------- host stations --------------------------- */

function HostStation({ performer, side, active, bob, timeMs }) {
  const pos = side === "left" ? { left: `${SAFE.left}%` } : { right: `${SAFE.right + 0.5}%` };
  const ring = ringOf(performer.id);
  const lift = active ? -6 * bob : 0;
  const scale = (active ? 1.0 : 0.9) + (active ? 0.03 * bob : 0);
  return (
    <div style={{ position: "absolute", bottom: `${SAFE.bottom + 1}%`, width: "38%", maxWidth: 206, zIndex: 5, textAlign: "center", transformOrigin: "bottom center", transform: `translateY(${lift}px) scale(${scale})`, opacity: active ? 1 : 0.64, filter: active ? "none" : "saturate(0.72) brightness(0.8)", ...pos }}>
      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "linear-gradient(180deg, #281c3a, #150e22)", border: `3px solid ${active ? ring : "rgba(255,255,255,0.12)"}`, boxShadow: active ? `0 0 26px ${ring}66, 0 14px 30px rgba(0,0,0,0.55)` : "0 12px 24px rgba(0,0,0,0.45)" }}>
        <div style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingTop: "6%" }}>
          <Roaster id={performer.id} size={172} ring={false} />
        </div>
        {active && <span style={{ position: "absolute", top: 9, right: 9, display: "flex", alignItems: "center", gap: 4, fontWeight: 800, fontSize: "2.4cqi", background: "rgba(255,59,59,0.92)", padding: "3px 9px", borderRadius: 6 }}>● LIVE</span>}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "8px 8px", background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.8))", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontWeight: 900, fontSize: "3.2cqi", textTransform: "uppercase", letterSpacing: "0.04em" }}>{firstName(performer.name)}</span>
          {active && <Waveform ring={ring} timeMs={timeMs} />}
        </div>
      </div>
    </div>
  );
}

function Waveform({ ring, timeMs }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2, height: 16 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const h = 4 + 11 * Math.abs(Math.sin(timeMs / 120 + i * 1.3));
        return <span key={i} style={{ width: 3, height: h, borderRadius: 2, background: ring }} />;
      })}
    </span>
  );
}

// Callie HOSTS — desk center. She reacts with her FACE (her own state engine); a
// tiny scale pop on the hard beats. No rotation, no idle wobble.
function CallieDesk({ state, pop }) {
  return (
    <div style={{ position: "absolute", bottom: `${SAFE.bottom + 0.5}%`, left: "50%", zIndex: 6, transformOrigin: "bottom center", transform: `translateX(-50%) scale(${1 + 0.05 * pop})`, textAlign: "center" }}>
      <Callie state={state} size={104} />
      <div style={{ marginTop: -2, fontWeight: 900, fontSize: "2.6cqi", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(0,0,0,0.6)", display: "inline-block", padding: "3px 11px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)" }}>★ Callie</div>
    </div>
  );
}

/* --------------------------- hook / captions / chyron / outro --------------------------- */

// The branded cold open: Callie's Universe ident → Roast My Ride title → the
// submission. Three quick phases across the lead window (deterministic from time).
function BrandedIntro({ carPhoto, carLabel, timeMs, leadMs }) {
  const f = clamp01(timeMs / Math.max(1, leadMs));
  const IDENT = 0.40, TITLE = 0.62;
  let node;
  if (f < IDENT) node = <Ident timeMs={timeMs} p={f / IDENT} />;
  else if (f < TITLE) node = <ShowTitle p={(f - IDENT) / (TITLE - IDENT)} />;
  else node = <Showcase carPhoto={carPhoto} carLabel={carLabel} p={(f - TITLE) / (1 - TITLE)} />;
  return <div style={{ position: "absolute", inset: 0, zIndex: 11 }}>{node}</div>;
}

function Stars({ timeMs }) {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {Array.from({ length: 28 }).map((_, i) => {
        const x = (i * 73) % 100, y = (i * 41) % 100;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(timeMs / 500 + i));
        const s = 1 + (i % 3);
        const gold = i % 4 === 0;
        return <span key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: s, height: s, borderRadius: "50%", background: gold ? "var(--sticker-yellow)" : "#fff", color: gold ? "var(--sticker-yellow)" : "#fff", opacity: tw, boxShadow: "0 0 4px currentColor" }} />;
      })}
    </div>
  );
}

// Callie's Universe network ident.
function Ident({ timeMs, p }) {
  const op = clamp01(p * 4);
  const scale = 0.7 + 0.3 * clamp01(p * 2.4);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 42%, #1c1334 0%, #0a0714 56%, #04030a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: op }}>
      <Stars timeMs={timeMs} />
      <div style={{ transform: `scale(${scale})`, textAlign: "center", zIndex: 1 }}>
        <Callie state="celebrating" size={150} />
        <div style={{ marginTop: 8, fontWeight: 900, fontSize: "6.4cqi", letterSpacing: "0.06em", color: "var(--canvas)", textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}>
          <span style={{ color: "var(--sticker-yellow)" }}>✦</span> CALLIE'S UNIVERSE <span style={{ color: "var(--sticker-yellow)" }}>✦</span>
        </div>
        <div style={{ marginTop: 8, fontWeight: 800, fontSize: "2.8cqi", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>presents</div>
      </div>
    </div>
  );
}

// Roast My Ride show title card (the show's own ember identity).
function ShowTitle({ p }) {
  const show = cfg("appName").replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
  const op = clamp01(p * 4);
  const scale = 0.86 + 0.14 * clamp01(p * 2.2);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 45%, var(--flame-500) 0%, var(--ember-600) 46%, #2a0a02 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3%", opacity: op }}>
      <div style={{ fontWeight: 800, fontSize: "2.8cqi", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>★ a Callie's Universe show ★</div>
      <div style={{ transform: `scale(${scale})`, fontWeight: 900, fontSize: "13cqi", lineHeight: 0.95, textAlign: "center", color: "var(--canvas)", WebkitTextStroke: "2px #1a1008", textShadow: "0 6px 0 rgba(0,0,0,0.4)", padding: "0 6%" }}>{show}</div>
      <div style={{ fontWeight: 800, fontSize: "3.2cqi", letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.92)", padding: "0 8%", textAlign: "center" }}>{cfg("aso.subtitle")}</div>
    </div>
  );
}

// The submission reveal.
function Showcase({ carPhoto, carLabel, p }) {
  const op = clamp01(p * 4);
  const inP = clamp01(p * 1.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 42%, #1a1228 0%, #0a0714 60%, #05030a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3%", opacity: op }}>
      <div style={{ fontWeight: 800, fontSize: "3.4cqi", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sticker-yellow)" }}>tonight's submission</div>
      <div style={{ width: "78%", transform: `scale(${0.86 + 0.14 * inP})` }}>
        <div style={{ aspectRatio: "16 / 10", borderRadius: 16, overflow: "hidden", background: "#06060a", border: "6px solid #fff", boxShadow: "0 22px 50px rgba(0,0,0,0.6)" }}>
          {carPhoto ? <img src={carPhoto} alt={cfg("upload.alt")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <Placeholder label={carLabel} />}
        </div>
      </div>
      <div style={{ fontWeight: 900, textTransform: "uppercase", fontSize: "8cqi", WebkitTextStroke: "2px #1a1008", textShadow: "0 4px 0 rgba(0,0,0,0.5)", padding: "0 6%", textAlign: "center" }}>{carLabel || cfg("brain.subjectNoun")}</div>
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
  // BIG, phone-first captions sized in container units (cqi = % of frame width).
  const fs = tokens.length > 14 ? "5.6cqi" : tokens.length > 8 ? "7cqi" : "8.6cqi";
  const enter = reduceMotion ? 1 : clamp01(rel / 200);
  return (
    <div style={{ position: "absolute", left: `${SAFE.left + 3}%`, right: `${SAFE.right + 2}%`, top: "33%", transform: `translateY(${(1 - enter) * 12}px)`, zIndex: 7, textAlign: "center" }}>
      <div style={{ display: "inline-block", marginBottom: 10, fontWeight: 900, fontSize: "3.6cqi", letterSpacing: "0.07em", textTransform: "uppercase", color: "#1a1008", background: hi, padding: "4px 16px", borderRadius: 999, boxShadow: "0 3px 10px rgba(0,0,0,0.45)" }}>{speaker}</div>
      <div style={{ display: "inline-block", maxWidth: "100%", padding: "12px 16px", borderRadius: 18, background: "rgba(8,6,14,0.5)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.14em 0.3em" }}>
          {tokens.map((tok, i) => {
            const hot = tok.punch || i === active;
            const revealed = reduceMotion || i <= active;
            return (
              <span key={i} style={{ fontWeight: 900, fontSize: fs, lineHeight: 1.08, textTransform: "uppercase", color: hot ? "#1a1008" : "#fff", background: hot ? hi : "transparent", padding: hot ? "0 0.12em" : 0, borderRadius: 7, WebkitTextStroke: hot ? "0" : "2px #1a1008", textShadow: hot ? "none" : "0 3px 0 rgba(0,0,0,0.6)", opacity: revealed ? 1 : 0, transform: `scale(${i === active && !reduceMotion ? 1.06 : 1})` }}>{tok.w}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReactionPop({ beat, seg, timeMs, aActive, reduceMotion }) {
  if (!beat || !beat.punch || !seg || reduceMotion) return null;
  const rel = timeMs - seg.startMs;
  const life = 1200;
  if (rel < 0 || rel > life) return null;
  const p = clamp01(rel / life);
  const emoji = REACTIONS[hash(beat.text) % REACTIONS.length];
  return (
    <div style={{ position: "absolute", bottom: `${30 + 16 * p}%`, [aActive ? "left" : "right"]: "14%", zIndex: 7, fontSize: "10cqi", opacity: (1 - p) * 0.95, transform: `scale(${0.6 + 0.6 * Math.min(1, p * 3)}) rotate(${aActive ? -8 : 8}deg)`, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}>{emoji}</div>
  );
}

// The branded close: the verdict score, then a Callie's Universe endcard (show
// wordmark + Callie + submit-CTA + network sign-off).
function BrandedOutro({ timeMs, startMs, tailMs, score, carPhoto, carLabel }) {
  const f = clamp01((timeMs - startMs) / Math.max(1, tailMs));
  const VERDICT = 0.45;
  const node = f < VERDICT
    ? <Verdict score={score} p={f / VERDICT} />
    : <Endcard carPhoto={carPhoto} carLabel={carLabel} p={(f - VERDICT) / (1 - VERDICT)} />;
  return <div style={{ position: "absolute", inset: 0, zIndex: 11 }}>{node}</div>;
}

function Verdict({ score, p }) {
  const has = typeof score === "number" && score > 0;
  const cook = has ? Math.round(score * 10) / 10 : null;
  const op = clamp01(p * 4);
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(8,6,13,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2%", opacity: op }}>
      <div style={{ fontWeight: 800, fontSize: "3.4cqi", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.82)" }}>the verdict</div>
      {has && <div style={{ fontWeight: 900, fontSize: "20cqi", color: "var(--sticker-yellow)", WebkitTextStroke: "3px #1a1008", textShadow: "0 6px 0 rgba(0,0,0,0.5)", lineHeight: 1, transform: `scale(${0.8 + 0.2 * clamp01(p * 2)})` }}>{cook}<span style={{ fontSize: "0.42em" }}>/10</span></div>}
    </div>
  );
}

function Endcard({ carPhoto, carLabel, p }) {
  const show = cfg("appName").replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
  const op = clamp01(p * 4);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 40%, #1c1334 0%, #0a0714 58%, #04030a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3.5%", opacity: op }}>
      <Stars timeMs={p * 4000} />
      <div style={{ zIndex: 1, fontWeight: 900, fontSize: "9cqi", color: "var(--canvas)", WebkitTextStroke: "2px #1a1008", letterSpacing: "0.02em", textAlign: "center", padding: "0 6%" }}>{show}</div>
      <div style={{ zIndex: 1, transform: `scale(${0.9 + 0.1 * clamp01(p * 2)})` }}><Callie state="celebrating" size={116} /></div>
      <div style={{ zIndex: 1, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: "8cqi", textTransform: "uppercase", color: "var(--flame-500)" }}>Submit yours</div>
        <div style={{ fontWeight: 900, fontSize: "5cqi", marginTop: 8, color: "var(--canvas)" }}>👉 @{cfg("handle")}</div>
      </div>
      <div style={{ zIndex: 1, marginTop: "1%", fontWeight: 800, fontSize: "3cqi", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--sticker-yellow)" }}>✦ a Callie's Universe show ✦</div>
    </div>
  );
}

function Grain({ timeMs, reduceMotion }) {
  if (reduceMotion) return null;
  const shift = Math.floor(timeMs / 90) % 6;
  return <div aria-hidden style={{ position: "absolute", inset: "-6px", zIndex: 8, pointerEvents: "none", opacity: 0.05, transform: `translate(${shift}px, ${(shift * 2) % 6}px)`, backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 0.5px, transparent 0.6px)", backgroundSize: "3px 3px" }} />;
}

function Placeholder({ label }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, color: "rgba(255,255,255,0.7)", background: "#0c0810" }}>
      <span style={{ fontSize: "11cqi" }}>{cfg("theme.emoji")}</span>
      <span style={{ fontSize: "3cqi", padding: "0 6px", textAlign: "center" }}>{label || cfg("brain.subjectNoun")}</span>
    </div>
  );
}
