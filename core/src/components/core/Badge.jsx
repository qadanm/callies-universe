import React from "react";

/**
 * Badge: small status / count pill. Tone maps to semantic or sticker colors.
 */
export function Badge({ tone = "ember", ink = false, children, style, ...rest }) {
  const tones = {
    ember:   { bg: "var(--ember-600)", fg: "var(--on-ember)" },
    flame:   { bg: "var(--flame-500)", fg: "var(--ink)" },
    success: { bg: "var(--success)",   fg: "#FFFFFF" },
    info:    { bg: "var(--info)",      fg: "#FFFFFF" },
    cool:    { bg: "var(--pop-cyan)",  fg: "var(--ink)" },
    pink:    { bg: "var(--pop-pink)",  fg: "#FFFFFF" },
    ink:     { bg: "var(--ink)",       fg: "var(--canvas)" },
  }[tone] || {};

  return (
    <span className={ink ? "ink" : undefined} style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 11px", borderRadius: "var(--radius-pill)",
      cornerShape: "var(--corner-badge)",
      font: "var(--type-cap)", fontWeight: 700, lineHeight: 1,
      background: tones.bg, color: tones.fg,
      boxShadow: "var(--shadow-sticker)",
      ...style,
    }} {...rest}>
      {children}
    </span>
  );
}
