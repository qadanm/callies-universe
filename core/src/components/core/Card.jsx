import React from "react";

/**
 * Card — rounded, soft glossy elevation. Clean interior (the bones);
 * optional sticker accents on the corners (the skin).
 */
export function Card({
  sticker = null,        // optional decoration node, pinned to a corner
  stickerCorner = "tr",  // tl | tr | bl | br
  pad = "var(--space-6)",
  style,
  children,
  ...rest
}) {
  const cornerPos = {
    tl: { top: -14, left: -14 },
    tr: { top: -14, right: -14 },
    bl: { bottom: -14, left: -14 },
    br: { bottom: -14, right: -14 },
  }[stickerCorner];

  return (
    <div
      style={{
        position: "relative",
        background: "var(--surface-card)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--gloss-card)",
        padding: pad,
        ...style,
      }}
      {...rest}
    >
      {children}
      {sticker && (
        <div aria-hidden="true" style={{
          position: "absolute", ...cornerPos, zIndex: 2,
          filter: "drop-shadow(0 2px 0 rgba(34,20,3,0.18))",
          transform: "rotate(-8deg)", pointerEvents: "none",
        }}>{sticker}</div>
      )}
    </div>
  );
}
