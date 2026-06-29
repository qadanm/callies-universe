import React from "react";

/**
 * HalftoneBand — a full-bleed color section with a ben-day halftone overlay
 * (and an optional corner star). The contrast moment: put tinted sticker cards
 * on it. `bg` defaults to the page's own accent so each site/app keeps identity.
 */
export function HalftoneBand({
  children,
  bg = "var(--accent-700)",
  dotColor = "#fff",
  dotOpacity = 0.11,
  star = false,
  style,
  className = "",
  ...rest
}) {
  return (
    <section
      className={className}
      style={{ position: "relative", overflow: "hidden", background: bg, ...style }}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="halftone"
        style={{
          position: "absolute",
          inset: 0,
          color: dotColor,
          opacity: dotOpacity,
          pointerEvents: "none",
        }}
      />
      {star && (
        <span
          aria-hidden="true"
          className="ink"
          style={{
            position: "absolute",
            right: 54,
            top: 34,
            width: 56,
            height: 56,
            background: "var(--gold, #FFC526)",
            transform: "rotate(-8deg)",
            clipPath:
              "polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </section>
  );
}
