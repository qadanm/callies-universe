import React, { useState } from "react";

/**
 * CreditTile — a collectible, sticker-ish credit bundle for the paywall.
 * Playful but clear: obvious value and price, "best value" flag.
 */
export function CreditTile({
  credits,
  price,
  perRoast,
  best = false,
  selected = false,
  onSelect,
  style,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        position: "relative", textAlign: "left",
        display: "flex", flexDirection: "column", gap: "4px",
        minWidth: 140, padding: "18px 18px 16px",
        borderRadius: "var(--radius-lg)",
        border: `3px solid ${selected ? "var(--ember-600)" : "var(--hairline)"}`,
        background: best ? "linear-gradient(180deg,#FFF3E2,#FFE6CC)" : "var(--surface)",
        boxShadow: selected ? "var(--gloss-primary)" : "var(--gloss-card)",
        transform: pressed ? "scale(var(--press-scale))" : selected ? "scale(1.02)" : "scale(1)",
        transition: "transform var(--dur-1) var(--ease-spring), border-color var(--dur-2)",
        cursor: "pointer", WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      {best && (
        <span style={{
          position: "absolute", top: -12, right: 12,
          background: "var(--pop-pink)", color: "#fff",
          font: "var(--type-legal)", fontWeight: 800, letterSpacing: "0.04em",
          padding: "4px 10px", borderRadius: "var(--radius-pill)",
          transform: "rotate(6deg)", boxShadow: "var(--shadow-sticker)",
        }}>BEST VALUE</span>
      )}
      <span aria-hidden="true" style={{ fontSize: 28 }}>🎟️</span>
      <span style={{ font: "var(--type-d3)", color: "var(--ink)", lineHeight: 1 }}>{credits} roasts</span>
      <span style={{ font: "var(--type-body)", fontWeight: 700, color: "var(--ember-600)" }}>{price}</span>
      {perRoast && <span style={{ font: "var(--type-cap)", color: "var(--text-muted)" }}>{perRoast} each</span>}
    </button>
  );
}
