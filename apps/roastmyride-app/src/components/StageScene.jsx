// RoastMyRide — StageScene [ROASTMYRIDE-NEW: app-layer]. THE comedy special.
//
// One declarative, PROP-DRIVEN scene = the single source of truth. It is rendered
// live by StagePlayer (which drives `activeIndex` over time) and — next milestone —
// the same component, same props, drives the exported video, so the saved file is
// exactly what played. No timers / no state here: deterministic from props.
//
// Fixed slots (the product rules, made structural):
//   • the CAR is ALWAYS on screen — a "monitor" on stage showing the photo
//     (or a placeholder if none was added).
//   • the PROFILE appears only if one was submitted (blurred if the user asked).
//   • the COMIC performs under the spotlight; Callie reacts from the crowd.
//
// CORE-REUSED: Roaster (the comic), Callie (audience), Confetti.
//
// DETERMINISM NOTE (for the #3 video export): the DISCRETE content here (active
// beat, caption, Callie state) is deterministic from `activeIndex`. The ambient
// motion is NOT — the spotlight/bob/marquee CSS loops and <Confetti/>'s random
// particles run on the browser clock. That's fine for live playback and for
// client-side capture (which records the real pixels), but a frame-exact SERVER
// render (e.g. Remotion) must drive ambient + confetti from the frame clock /
// a seed. Pinned to the video milestone.
import React from "react";
import { Roaster, Callie, Confetti } from "@callies-universe/core";
import { callieStateForBeat } from "../standup.js";

export const StageScene = React.memo(function StageScene({
  comedianId,
  performerName,
  bit,
  carLabel,
  carPhoto, // dataUrl | null
  profile, // { dataUrl, blur, kind } | null
  segments = [],
  activeIndex = 0,
  reaction = "savage",
  engineLabel, // optional "offline" tag
}) {
  const seg = activeIndex >= 0 && activeIndex < segments.length ? segments[activeIndex] : null;
  const beat = seg ? seg.beat : null;
  const type = beat ? beat.type : "setup";
  const delivering = type === "punch" || type === "closer";
  const callieState = callieStateForBeat(type, reaction);
  const hasProfile = !!(profile && profile.dataUrl);

  return (
    <div className="rmr-stage" data-testid="stage-scene">
      <div className="rmr-stage__spot" aria-hidden="true" />

      {/* marquee / billing */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "10px 12px 6px", textAlign: "center", zIndex: 3 }}>
        <Bulbs />
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
          {carPhoto ? (
            <img src={carPhoto} alt="The car on trial" style={imgFill} />
          ) : (
            <Placeholder glyph="🚗" caption={carLabel || "your ride"} />
          )}
        </Screen>
        {hasProfile && (
          <Screen label={profile.kind === "profile" ? "The profile" : "The owner"} tone="#8FC2FF">
            <img src={profile.dataUrl} alt="The owner" style={{ ...imgFill, filter: profile.blur ? "blur(8px)" : "none" }} />
          </Screen>
        )}
      </div>

      {/* the comic on stage under the spotlight */}
      <div style={{ position: "absolute", top: "40%", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 2 }}>
        <div className={`rmr-comic${delivering ? " rmr-comic--deliver" : ""}`} key={`comic-${delivering ? activeIndex : "idle"}`} style={{ position: "relative" }}>
          <Roaster id={comedianId} size={130} />
          {/* mic stand */}
          <div aria-hidden="true" style={{ position: "absolute", bottom: 14, left: "calc(50% + 52px)", width: 4, height: 64, background: "#15100a", borderRadius: 4 }}>
            <div style={{ position: "absolute", top: -9, left: -6, width: 16, height: 16, borderRadius: "50%", background: "#15100a" }} />
          </div>
        </div>
      </div>

      {/* caption lower-third (the active beat) */}
      <div style={{ position: "absolute", left: 12, right: 12, bottom: "16%", zIndex: 3 }}>
        {beat && (
          <div className="rmr-caption" key={`cap-${activeIndex}`} style={{ background: "rgba(20,12,5,0.78)", borderRadius: "var(--radius-lg)", padding: "12px 14px", border: "1px solid rgba(255,201,138,0.35)" }}>
            <BeatTag type={type} />
            <p style={{ margin: "4px 0 0", font: "var(--type-d4)", fontSize: "clamp(15px, 4.6vw, 20px)", lineHeight: 1.25, color: "#fff" }}>
              <Caption beat={beat} />
            </p>
          </div>
        )}
      </div>

      {/* the crowd — Callie reacting among silhouettes */}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "12%", background: "repeating-linear-gradient(90deg, #0a0604 0 20px, #140a05 20px 38px)", maskImage: "radial-gradient(16px 22px at 10px 0, #000 60%, transparent 62%)", WebkitMaskImage: "radial-gradient(16px 22px at 10px 0, #000 60%, transparent 62%)", maskSize: "38px 100%", WebkitMaskSize: "38px 100%", zIndex: 2 }} />
      <div style={{ position: "absolute", left: "10%", bottom: "1%", zIndex: 3 }} className={type === "crowd" ? "rmr-crowd-callie--pop" : ""} key={`callie-${type === "crowd" ? activeIndex : "idle"}`}>
        <Callie state={callieState} size={52} />
      </div>

      {type === "closer" && <Confetti count={26} />}
    </div>
  );
});

const imgFill = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

function Screen({ label, tone, children }) {
  return (
    <div style={{ width: "40%", maxWidth: 150, textAlign: "center" }}>
      <div
        className="rmr-screen"
        style={{
          width: "100%",
          aspectRatio: "4 / 3",
          borderRadius: 10,
          overflow: "hidden",
          background: "#0c0805",
          border: "3px solid #15100a",
          outline: `2px solid ${tone}`,
        }}
      >
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
  const tag =
    type === "crowd" ? "🎤 Crowd work" : type === "closer" ? "🎤 Mic drop" : type === "punch" ? "Punchline" : "Setup";
  return (
    <span style={{ font: "var(--type-legal)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 800, color: "var(--sticker-yellow)" }}>
      {tag}
    </span>
  );
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

function Bulbs() {
  return (
    <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 4 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--sticker-yellow)",
            boxShadow: "0 0 6px var(--sticker-yellow)",
            animation: "rmr-marquee-bulb 1.6s ease-in-out infinite",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}
