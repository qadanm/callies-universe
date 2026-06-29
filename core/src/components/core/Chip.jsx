import React, { useState } from "react";

/**
 * Chip — sticker-like tap pill for fast multi-select context.
 * Selected = filled ember with a tiny pop. Easy to deselect.
 */
export function Chip({
  selected = false,
  emoji = null,
  children,
  onToggle,
  style,
  ...rest
}) {
  const [pop, setPop] = useState(false);

  const base = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    minHeight: "var(--tap-min)", padding: "0 18px",
    font: "var(--type-d4)", fontSize: "16px",
    borderRadius: "var(--radius-chip)",
    cornerShape: "var(--corner-chip)",
    cursor: "pointer", whiteSpace: "nowrap",
    transition: "transform var(--dur-2) var(--ease-spring), background var(--dur-2) var(--ease-out), color var(--dur-2)",
    transform: pop ? "scale(1.08)" : "scale(1)",
    WebkitTapHighlightColor: "transparent", userSelect: "none",
    ...(selected
      ? { background: "var(--ember-600)", color: "var(--on-ember)", border: "2px solid var(--ink)", boxShadow: "var(--shadow-sticker-sm)" }
      : { background: "var(--surface)", color: "var(--ink)", border: "2px solid var(--ink)", boxShadow: "var(--shadow-sticker-sm)" }),
    ...style,
  };

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => { setPop(true); setTimeout(() => setPop(false), 180); onToggle && onToggle(!selected); }}
      style={base}
      {...rest}
    >
      {emoji && <span aria-hidden="true" style={{ fontSize: "18px" }}>{emoji}</span>}
      {children}
      {selected && <span aria-hidden="true" style={{ fontSize: "14px", opacity: 0.9 }}>✕</span>}
    </button>
  );
}
