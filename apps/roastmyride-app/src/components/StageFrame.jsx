// RoastMyRide — StageFrame [ROASTMYRIDE-NEW: app-layer].
//
// The reveal's hero: a warm-lit comedy-club poster (the chosen comedian on
// stage at the mic, spotlit, a crowd silhouette with Callie in it) wrapped in
// VIDEO-PLAYER chrome — a PREVIEW badge, a play button, a scrubber keyed to the
// set runtime, and a "stage video — coming soon" line. The actual AI stage
// video is a FUTURE milestone; this is the frame it will drop into. The set
// transcript below it carries the moment on its own until then.
//
// CORE-REUSED: Roaster (the comedian avatar), Callie (audience surrogate).
import React from "react";
import { Roaster, Callie } from "@callies-universe/core";

export function StageFrame({ comedianId, runtime = "0:42", callieState = "savage", width = "100%" }) {
  return (
    <div
      style={{
        position: "relative",
        width,
        aspectRatio: "4 / 3",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        background: "radial-gradient(80% 70% at 50% -5%, #FFD9A0 0%, #C7340F 38%, #2A1408 78%)",
        boxShadow: "var(--elev-4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* spotlight cone from above */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "78%",
          background: "linear-gradient(180deg, rgba(255,240,200,0.55) 0%, rgba(255,200,120,0.08) 70%, transparent 100%)",
          clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0% 100%)",
          pointerEvents: "none",
        }}
      />

      {/* comedian on stage at the mic */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-end", flex: 1, paddingTop: 18 }}>
        <Roaster id={comedianId} size={150} />
        {/* the mic stand */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: 36, left: "calc(50% + 60px)", width: 4, height: 70, background: "var(--ink)", borderRadius: 4 }}>
          <div style={{ position: "absolute", top: -10, left: -7, width: 18, height: 18, borderRadius: "50%", background: "var(--ink)" }} />
        </div>
      </div>

      {/* crowd silhouette with Callie in the audience (the bystander, never the act) */}
      <div style={{ position: "relative", height: 46 }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(90deg, #1A0E06 0 18px, #281408 18px 34px)",
            maskImage: "radial-gradient(14px 18px at 9px 0, #000 60%, transparent 62%)",
            WebkitMaskImage: "radial-gradient(14px 18px at 9px 0, #000 60%, transparent 62%)",
            maskSize: "34px 100%", WebkitMaskSize: "34px 100%",
            opacity: 0.95,
          }}
        />
        <div style={{ position: "absolute", left: 12, bottom: 2 }}>
          <Callie state={callieState} size={44} />
        </div>
      </div>

      {/* player chrome overlay */}
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
        <span style={chip}>PREVIEW</span>
      </div>
      <button
        aria-label="Play (stage video coming soon)"
        disabled
        style={{
          position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)",
          width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "default",
          background: "rgba(34,20,3,0.5)", color: "#fff", fontSize: 22,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >▶</button>

      {/* scrubber + coming-soon line */}
      <div style={{ position: "relative", padding: "0 12px 10px", color: "var(--on-ember)" }}>
        <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.3)", overflow: "hidden" }}>
          <div style={{ width: "22%", height: "100%", background: "var(--sticker-yellow)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, font: "var(--type-cap)", opacity: 0.92 }}>
          <span>stage video — coming soon</span>
          <span>{runtime}</span>
        </div>
      </div>
    </div>
  );
}

const chip = {
  font: "var(--type-cap)", fontWeight: 800, letterSpacing: "0.08em",
  background: "rgba(34,20,3,0.55)", color: "#fff",
  padding: "3px 8px", borderRadius: "var(--radius-pill)",
};
