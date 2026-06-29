import React from "react";

/**
 * Burst: an outlined comic starburst chip (the "NEW" / "HOT" sticker).
 * Hand-inked via #ink2. Drop it next to a CTA or a price.
 */
export function Burst({
  children,
  color = "var(--ember-600)",
  textColor = "#fff",
  size = 84,
  rotate = -10,
  style,
  ...rest
}) {
  return (
    <span
      className="ink"
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: size,
        height: size,
        background: color,
        color: textColor,
        fontFamily: "var(--font-display)",
        fontWeight: 900,
        fontSize: Math.round(size * 0.19),
        lineHeight: 1,
        textAlign: "center",
        textShadow: "0 1px 0 rgba(0,0,0,0.3)",
        transform: `rotate(${rotate}deg)`,
        clipPath:
          "polygon(50% 0,61% 22%,86% 16%,78% 40%,100% 50%,78% 60%,86% 84%,61% 78%,50% 100%,39% 78%,14% 84%,22% 60%,0 50%,22% 40%,14% 16%,39% 22%)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
