import React from "react";

/**
 * Tape: a strip of translucent washi tape, for the "stuck on" scrapbook feel.
 * Absolutely positioned by the caller (e.g. top center of a card). Inked edges.
 */
export function Tape({
  width = 78,
  height = 26,
  rotate = -4,
  color = "rgba(255,224,130,0.72)",
  style,
  ...rest
}) {
  return (
    <span
      aria-hidden="true"
      className="ink"
      style={{
        position: "absolute",
        top: -12,
        left: "50%",
        width,
        height,
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        background: color,
        border: "1px dashed rgba(36,27,18,0.25)",
        zIndex: 3,
        pointerEvents: "none",
        ...style,
      }}
      {...rest}
    />
  );
}
