import React from "react";

/**
 * Card: die-cut sticker. Superellipse corners + a bold ink outline + a hard
 * offset sticker shadow (the facelift surface, system-wide). With `ink` it splits
 * into a hand-wobbled border layer (the skin) behind crisp content (the bones) so
 * text stays sharp while the edge looks drawn. Chromium draws the squircle;
 * Safari/iOS fall back to rounded; the wobble drops out under reduce-motion/.no-ink.
 */
export function Card({
  sticker = null,        // optional decoration node, pinned to a corner
  stickerCorner = "tr",  // tl | tr | bl | br
  pad = "var(--space-6)",
  ink = false,           // true → wobble the border (content stays crisp)
  elevation = "sticker", // "sticker" (hard offset) | "soft" (glossy)
  rotate = 0,            // tiny tilt, degrees
  tint,                  // card-face color (per-character / per-section)
  style,
  className = "",
  children,
  ...rest
}) {
  const cornerPos = {
    tl: { top: -14, left: -14 },
    tr: { top: -14, right: -14 },
    bl: { bottom: -14, left: -14 },
    br: { bottom: -14, right: -14 },
  }[stickerCorner];

  const StickerCorner = sticker && (
    <div aria-hidden="true" style={{
      position: "absolute", ...cornerPos, zIndex: 2,
      filter: "drop-shadow(0 2px 0 rgba(34,20,3,0.18))",
      transform: "rotate(-8deg)", pointerEvents: "none",
    }}>{sticker}</div>
  );

  // Inked variant: face color rides the wobbled border layer; layout styles stay
  // on the outer wrapper; content is a crisp, unfiltered sibling.
  if (ink) {
    const { background, backgroundColor, ...restStyle } = style || {};
    const face = tint || background || backgroundColor || "var(--surface-card)";
    return (
      <div className={className} style={{
        position: "relative",
        ...(rotate ? { transform: `rotate(${rotate}deg)` } : null),
        ...(elevation === "sticker" ? { filter: "var(--drop-sticker)" } : null),
        ...restStyle,
      }} {...rest}>
        <div aria-hidden="true" className="ink" style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: face,
          border: "var(--ink-outline)",
          borderRadius: "var(--radius-card)",
          cornerShape: "var(--corner-card)",
          ...(elevation === "soft" ? { boxShadow: "var(--gloss-card)", border: "none" } : null),
        }} />
        <div style={{ position: "relative", zIndex: 1, padding: pad }}>{children}</div>
        {StickerCorner}
      </div>
    );
  }

  // Default: single-layer facelift surface (back-compat structure, children are
  // direct, so existing flex/layout styles on the card still apply).
  return (
    <div
      style={{
        position: "relative",
        background: tint || "var(--surface-card)",
        border: "var(--ink-outline)",
        borderRadius: "var(--radius-card)",
        cornerShape: "var(--corner-card)",
        boxShadow: elevation === "soft" ? "var(--gloss-card)" : "var(--shadow-sticker-lg)",
        padding: pad,
        ...(rotate ? { transform: `rotate(${rotate}deg)` } : null),
        ...style,
      }}
      className={className || undefined}
      {...rest}
    >
      {children}
      {StickerCorner}
    </div>
  );
}
