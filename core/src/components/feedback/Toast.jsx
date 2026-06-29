import React from "react";

/**
 * Toast: compact, bouncy status message. Functional layer: AA contrast,
 * readable companion font, sticker shadow for personality.
 */
export function Toast({ tone = "ink", icon = null, children, style, ...rest }) {
  const tones = {
    ink:     { bg: "var(--ink)",     fg: "var(--canvas)" },
    success: { bg: "var(--success)", fg: "#FFFFFF" },
    danger:  { bg: "var(--danger)",  fg: "#FFFFFF" },
    flame:   { bg: "var(--flame-500)", fg: "var(--ink)" },
  }[tone] || {};

  return (
    <div role="status" style={{
      display: "inline-flex", alignItems: "center", gap: "10px",
      padding: "12px 18px", borderRadius: "var(--radius-pill)",
      background: tones.bg, color: tones.fg,
      font: "var(--type-sm)", fontWeight: 600,
      boxShadow: "var(--elev-3)",
      animation: "rmr-pop-in var(--dur-4) var(--ease-spring) both",
      ...style,
    }} {...rest}>
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      {children}
    </div>
  );
}
