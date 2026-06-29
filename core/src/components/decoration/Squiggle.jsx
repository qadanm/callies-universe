import React from "react";

/**
 * Squiggle — a hand-drawn marker underline. Sits under a headline keyword.
 * Inked via #ink2 so the stroke wobbles like a felt-tip swipe.
 */
export function Squiggle({
  width = 210,
  color = "var(--ember-600)",
  thickness = 4.5,
  style,
  ...rest
}) {
  return (
    <svg
      width={width}
      height={15}
      viewBox="0 0 210 15"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", ...style }}
      {...rest}
    >
      <path
        d="M4 8 Q28 2 52 8 T100 8 T148 8 T206 7"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        filter="url(#ink2)"
      />
    </svg>
  );
}
