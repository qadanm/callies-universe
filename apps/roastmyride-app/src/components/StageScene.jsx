// RoastMyRide — StageScene [ROASTMYRIDE-NEW: app-layer]. THE comedy special.
//
// One declarative, PROP-DRIVEN scene = the single source of truth, rendered two ways:
//   • LIVE  (StagePlayer passes `activeIndex`): ambient motion runs via cheap CSS
//     animations; React re-renders only on beat change.
//   • DRIVEN (Remotion passes `timeMs`): every motion — ambient sway/bob/marquee,
//     the per-beat enters, and the confetti — is computed deterministically from
//     timeMs (sceneMotion.js), so the exported video is frame-identical to the
//     scene. Same component, same props, two clocks.
//
// Fixed slots (the product rules, made structural):
//   • the CAR is ALWAYS on screen — a "monitor" on stage (placeholder if no photo).
//   • the PROFILE appears only if submitted (blurred if the user asked).
//   • the COMIC performs under the spotlight; Callie reacts from the crowd.
//
// CORE-REUSED: Roaster (the comic), Callie (audience), Confetti (live only).
import React from "react";
import { Roaster, Callie, Confetti } from "@callies-universe/core";
import { activeIndexAt, callieStateForBeat } from "../standup.js";
import { ambientAt, bulbOpacity, enterProgress, popPulse, confettiParticles, confettiAt } from "../sceneMotion.js";

export const StageScene = React.memo(function StageScene({
  comedianId,
  performerName,
  bit,
  carLabel,
  carPhoto, // dataUrl | null
  profile, // { dataUrl, blur, kind } | null
  segments = [],
  activeIndex = 0,
  timeMs, // when a number → DRIVEN (deterministic) mode for video export
  reaction = "savage",
  engineLabel,
}) {
  const driven = typeof timeMs === "number";
  const idx = driven ? activeIndexAt(segments, timeMs) : activeIndex >= 0 ? activeIndex : 0;
  const seg = idx >= 0 && idx < segments.length ? segments[idx] : null;
  const beat = seg ? seg.beat : null;
  const type = beat ? beat.type : "setup";
  const delivering = type === "punch" || type === "closer";
  const callieState = callieStateForBeat(type, reaction);
  const hasProfile = !!(profile && profile.dataUrl);
  const amb = driven ? ambientAt(timeMs) : null;
  const startMs = seg ? seg.startMs : 0;

  // Driven inline styles (deterministic); live → undefined (CSS class drives it).
  const spotStyle = driven
    ? { animation: "none", transform: `translateX(-50%) rotate(${amb.spotRotateDeg}deg)`, opacity: amb.spotOpacity }
    : undefined;
  const comicStyle = driven
    ? {
        position: "relative",
        animation: "none",
        transform: `translateY(${amb.comicBobY + (delivering ? -4 * popPulse(timeMs, startMs, 600) : 0)}px) rotate(${amb.comicTiltDeg}deg) scale(${delivering ? 1 + 0.08 * popPulse(timeMs, startMs, 600) : 1})`,
      }
    : { position: "relative" };
  const captionStyle = driven
    ? (() => {
        const p = enterProgress(timeMs, startMs, 420);
        return { animation: "none", opacity: p, transform: `translateY(${(1 - p) * 14}px) scale(${0.96 + 0.04 * p})` };
      })()
    : undefined;
  const crowdPop = driven && type === "crowd" ? popPulse(timeMs, startMs, 700) : 0;
  const callieStyle = driven
    ? { animation: "none", transform: `translateY(${-7 * crowdPop}px) scale(${1 + 0.12 * crowdPop})` }
    : undefined;

  return (
    <div className="rmr-stage" data-testid="stage-scene">
      <div className="rmr-stage__spot" aria-hidden="true" style={spotStyle} />

      {/* marquee / billing */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "10px 12px 6px", textAlign: "center", zIndex: 3 }}>
        <Bulbs driven={driven} timeMs={timeMs} />
        <div style={{ font: "var(--type-cap)", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sticker-yellow)", fontWeight: 800 }}>
          🎤 Now performing{engineLabel ? ` · ${engineLabel}` : ""}
        </div>
        <div style={{ font: "var(--type-d3)", fontSize: "clamp(18px, 6vw, 26px)", lineHeight: 1.05, color: "#fff", textShadow: "0 2px 0 rgba(0,0,0,0.4)" }}>
          “{bit}”
        </div>
        <div style={{ font: "var(--type-cap)", color: "rgba(255,255,255,0.85)" }}>{performerName}</div>
      </div>

      {/* the screens flanking the stage — car ALWAYS, profile IF present */}
      <div style={{ position: "absolute", top: "21%", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "6%", padding: "0 8px", zIndex: 2 }}>
        <Screen label="The ride" tone="#FFC98A">
          {carPhoto ? <img src={carPhoto} alt="The car on trial" style={imgFill} /> : <Placeholder glyph="🚗" caption={carLabel || "your ride"} />}
        </Screen>
        {hasProfile && (
          <Screen label={profile.kind === "profile" ? "The profile" : "The owner"} tone="#8FC2FF">
            <img src={profile.dataUrl} alt="The owner" style={{ ...imgFill, filter: profile.blur ? "blur(8px)" : "none" }} />
          </Screen>
        )}
      </div>

      {/* the comic on stage under the spotlight */}
      <div style={{ position: "absolute", top: "40%", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 2 }}>
        <div
          className={driven ? "" : `rmr-comic${delivering ? " rmr-comic--deliver" : ""}`}
          key={driven ? undefined : `comic-${delivering ? activeIndex : "idle"}`}
          style={comicStyle}
        >
          <Comic comedianId={comedianId} />
        </div>
      </div>

      {/* caption lower-third (the active beat) */}
      <div style={{ position: "absolute", left: 12, right: 12, bottom: "16%", zIndex: 3 }}>
        {beat && (
          <div
            className={driven ? "" : "rmr-caption"}
            key={driven ? undefined : `cap-${activeIndex}`}
            style={{ background: "rgba(20,12,5,0.78)", borderRadius: "var(--radius-lg)", padding: "12px 14px", border: "1px solid rgba(255,201,138,0.35)", ...(captionStyle || {}) }}
          >
            <BeatTag type={type} />
            <p style={{ margin: "4px 0 0", font: "var(--type-d4)", fontSize: "clamp(15px, 4.6vw, 20px)", lineHeight: 1.25, color: "#fff" }}>
              <Caption beat={beat} />
            </p>
          </div>
        )}
      </div>

      {/* the crowd — Callie reacting among silhouettes */}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "12%", background: "repeating-linear-gradient(90deg, #0a0604 0 20px, #140a05 20px 38px)", maskImage: "radial-gradient(16px 22px at 10px 0, #000 60%, transparent 62%)", WebkitMaskImage: "radial-gradient(16px 22px at 10px 0, #000 60%, transparent 62%)", maskSize: "38px 100%", WebkitMaskSize: "38px 100%", zIndex: 2 }} />
      <div
        style={{ position: "absolute", left: "10%", bottom: "1%", zIndex: 3, ...(callieStyle || {}) }}
        className={!driven && type === "crowd" ? "rmr-crowd-callie--pop" : ""}
        key={driven ? undefined : `callie-${type === "crowd" ? activeIndex : "idle"}`}
      >
        <Audience state={callieState} />
      </div>

      {type === "closer" &&
        (driven ? <DrivenConfetti seed={comedianId || bit} sinceMs={timeMs - startMs} /> : <Confetti count={26} />)}
    </div>
  );
});

// Memoized avatars: in driven mode the scene re-renders every frame, but these
// only re-render when their (discrete) props change.
const Comic = React.memo(function Comic({ comedianId }) {
  return (
    <>
      <Roaster id={comedianId} size={130} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: 14, left: "calc(50% + 52px)", width: 4, height: 64, background: "#15100a", borderRadius: 4 }}>
        <div style={{ position: "absolute", top: -9, left: -6, width: 16, height: 16, borderRadius: "50%", background: "#15100a" }} />
      </div>
    </>
  );
});
const Audience = React.memo(function Audience({ state }) {
  return <Callie state={state} size={52} />;
});

function DrivenConfetti({ seed, sinceMs }) {
  const particles = confettiParticles(seed, 26);
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4, overflow: "hidden" }}>
      {particles.map((p, i) => {
        const s = confettiAt(p, sinceMs);
        if (!s) return null;
        return (
          <span
            key={i}
            style={{
              position: "absolute", top: `${s.topPct}%`, left: `${s.leftPct}%`, width: s.size, height: s.size,
              background: s.color, opacity: s.opacity, borderRadius: 2, transform: `rotate(${s.rotateDeg}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

const imgFill = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

function Screen({ label, tone, children }) {
  return (
    <div style={{ width: "40%", maxWidth: 150, textAlign: "center" }}>
      <div className="rmr-screen" style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: 10, overflow: "hidden", background: "#0c0805", border: "3px solid #15100a", outline: `2px solid ${tone}` }}>
        {children}
      </div>
      <div style={{ font: "var(--type-legal)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 800, color: tone, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Placeholder({ glyph, caption }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: "rgba(255,255,255,0.7)" }}>
      <span style={{ fontSize: 34, lineHeight: 1 }}>{glyph}</span>
      <span style={{ font: "var(--type-legal)", padding: "0 4px", textAlign: "center" }}>{caption}</span>
    </div>
  );
}

function BeatTag({ type }) {
  const tag = type === "crowd" ? "🎤 Crowd work" : type === "closer" ? "🎤 Mic drop" : type === "punch" ? "Punchline" : "Setup";
  return <span style={{ font: "var(--type-legal)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 800, color: "var(--sticker-yellow)" }}>{tag}</span>;
}

function Caption({ beat }) {
  if (beat.punch) {
    return (
      <>
        {beat.text}
        <mark style={{ background: "var(--sticker-yellow)", color: "var(--ink)", padding: "0 6px", borderRadius: 6, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{beat.punch}</mark>
        {beat.tail}
      </>
    );
  }
  return <>{beat.text}</>;
}

function Bulbs({ driven, timeMs }) {
  return (
    <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 4 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 6, height: 6, borderRadius: "50%", background: "var(--sticker-yellow)", boxShadow: "0 0 6px var(--sticker-yellow)",
            ...(driven
              ? { opacity: bulbOpacity(timeMs, i) }
              : { animation: "rmr-marquee-bulb 1.6s ease-in-out infinite", animationDelay: `${i * 0.12}s` }),
          }}
        />
      ))}
    </div>
  );
}
