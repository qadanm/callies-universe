import React from "react";

/**
 * ShareCard: the signature output frame, the still/video card that IS the
 * social content. Brand caption style, mascot tag, watermark, punch-word
 * highlight. Built 9:16-friendly; clean legible roast over an authored frame.
 *
 * `format` (additive, backward-compatible, defaults to "video"):
 *   "video"   : the original roast-clip frame.
 *   "standup" : the live-set clip: a "🎤 Live set" mic badge, the comedian +
 *               their `act` style line, a stage-spotlight wash, "stand-up clip"
 *               footer. The marketing landing + any existing caller are unchanged.
 */
export function ShareCard({
  roast,              // string OR array of {text, punch?:true} segments
  mascot = null,      // a <Mascot/> node: Callie REACTING in the corner (never the author)
  roasterName = "Ms. Burnt", // the VOICE persona that delivered the roast (not the cat)
  spice = "savage",   // "mild" | "savage"
  format = "video",   // "video" (default, unchanged) | "standup"
  act = null,         // standup only: the comedian's one-line comedic identity
  width = 300,
  watermark = "RoastMyRide",
  style,
  ...rest
}) {
  const segments = Array.isArray(roast)
    ? roast
    : [{ text: roast }];
  const standup = format === "standup";

  return (
    <div style={{
      position: "relative", width, aspectRatio: "9 / 16",
      borderRadius: "var(--radius-xl)", overflow: "hidden",
      background: standup
        ? "radial-gradient(90% 55% at 50% 8%, #FFC98A 0%, #E5481B 40%, #2A1408 100%)"
        : "radial-gradient(120% 90% at 30% 0%, #FFB877 0%, #FF6A1A 45%, #C7340F 100%)",
      boxShadow: "var(--elev-4)", color: "var(--on-ember)",
      display: "flex", flexDirection: "column",
      ...style,
    }} {...rest}>
      {/* sticker texture dots */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, opacity: 0.18, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, #fff 2px, transparent 2.5px)",
        backgroundSize: "26px 26px",
      }} />

      {/* top: the billing, a roast clip vs. a live-set clip */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "16px 18px 0" }}>
        <span style={{
          alignSelf: "flex-start",
          font: "var(--type-cap)", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.06em", background: "rgba(34,20,3,0.35)",
          padding: "5px 12px", borderRadius: "var(--radius-pill)",
        }}>{standup ? `🔊 ${roasterName}` : `🔥 ${roasterName} · ${spice}`}</span>
        {standup && act && (
          <span style={{ font: "var(--type-cap)", opacity: 0.92, fontStyle: "italic" }}>{act}</span>
        )}
      </div>

      {/* the roast: clean legible bones over the loud frame */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        padding: "8px 22px 0",
      }}>
        <p style={{
          font: "var(--type-d2)", fontSize: "30px", lineHeight: 1.12,
          margin: 0, textWrap: "balance",
          textShadow: "0 2px 0 rgba(120,30,0,0.45)",
        }}>
          {segments.map((s, i) => s.punch ? (
            <mark key={i} style={{
              background: "var(--sticker-yellow)", color: "var(--ink)",
              padding: "0 6px", borderRadius: "8px", boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}>{s.text}</mark>
          ) : <span key={i}>{s.text}</span>)}
        </p>
      </div>

      {/* Callie reacting, pinned bottom-right (the bystander cat, not the author) */}
      {mascot && (
        <div style={{ position: "absolute", right: 6, bottom: 40 }}>{mascot}</div>
      )}

      {/* watermark */}
      <div style={{
        padding: "0 18px 16px", display: "flex", alignItems: "center", gap: "6px",
        font: "var(--type-cap)", fontWeight: 700, opacity: 0.95,
      }}>
        <span style={{ display: "inline-flex", width: 18, height: 18, borderRadius: 6, background: "var(--ink)", color: "var(--flame-500)", alignItems: "center", justifyContent: "center", fontSize: 12 }}>R</span>
        {standup ? `roast clip · ${watermark}` : watermark}
      </div>
    </div>
  );
}
