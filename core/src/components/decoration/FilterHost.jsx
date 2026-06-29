import React from "react";

/**
 * FilterHost: the single owner of the hand-inked SVG filter defs (#ink, #ink2).
 * Mount EXACTLY ONCE per page/app (web: Base.astro <body>; app: App root;
 * video: inside the Remotion <AbsoluteFill>). Every `.ink` element / `filter:url(#ink)`
 * reference resolves against these.
 *
 * Determinism: both filters use a FIXED `seed` and never animate baseFrequency/seed,
 * so the displacement is a pure function of seed + element geometry → frame-identical
 * in the Remotion render (no jitter). #ink2 is the slightly heavier "re-ink" used only
 * on :hover (live-only; never triggered during a render).
 *
 * The explicit filter region (x/y/width/height = 110%/112%) keeps displaced edges from
 * clipping at scale 7 to 9. Purely presentational; renders zero layout.
 */
export function FilterHost() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink2" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="17" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
