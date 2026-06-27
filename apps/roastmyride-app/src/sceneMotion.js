// RoastMyRide — deterministic scene motion [ROASTMYRIDE-NEW].
//
// Pure, time-driven math for the StageScene's animation. Given a timeMs (and a
// stable seed), these return the exact same values every call — so a frame-exact
// video render (Remotion: useCurrentFrame → timeMs) produces frames identical to
// what plays live. The LIVE path uses CSS animation instead (cheaper, no per-
// frame React); these functions are only engaged in the "driven" export mode.

const TAU = Math.PI * 2;
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Ambient (looping) motion that runs regardless of the active beat. */
export function ambientAt(timeMs) {
  const t = timeMs || 0;
  return {
    spotRotateDeg: Math.sin((TAU * t) / 7000) * 3, // sway ±3°
    spotOpacity: 0.55 + 0.23 * (0.5 + 0.5 * Math.sin((TAU * t) / 4500)), // 0.55–0.78
    comicBobY: -3 - 3 * Math.sin((TAU * t) / 3200), // -6..0 px
    comicTiltDeg: Math.sin((TAU * t) / 3200) * 1.2, // ±1.2°
  };
}

/** Per-bulb marquee opacity (matches the CSS 1.6s cycle + 0.12s stagger). */
export function bulbOpacity(timeMs, i) {
  const phase = TAU * ((timeMs || 0) / 1600 - i * 0.12);
  return 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(phase));
}

/** 0→1 progress of a one-shot animation starting at startMs over durMs. */
export function enterProgress(timeMs, startMs, durMs) {
  if (!durMs) return 1;
  return clamp01(((timeMs || 0) - (startMs || 0)) / durMs);
}

/** A one-shot "pop" (scale up then settle) — peaks mid-way, ends neutral. */
export function popPulse(timeMs, startMs, durMs) {
  const p = enterProgress(timeMs, startMs, durMs);
  return Math.sin(p * Math.PI); // 0 → 1 (at p=0.5) → 0
}

/* ----------------------------- seeded confetti ----------------------------- */

function hashStr(s) {
  let h = 5381;
  const str = String(s || "seed");
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CONFETTI_COLORS = [
  "var(--sticker-yellow)",
  "var(--sticker-cyan, #5FD6C4)",
  "var(--sticker-pink, #FF4FA3)",
  "var(--sticker-lime, #C9D98F)",
  "#FF8330",
];

/** Deterministic confetti particles for a given seed (stable positions/timing). */
export function confettiParticles(seed, count = 26) {
  const rnd = mulberry32(hashStr(seed));
  return Array.from({ length: count }, () => ({
    leftPct: rnd() * 100,
    size: 6 + rnd() * 7,
    color: CONFETTI_COLORS[Math.floor(rnd() * CONFETTI_COLORS.length)],
    delayMs: rnd() * 500,
    fallMs: 1600 + rnd() * 1600,
    rot: rnd() * 360,
    drift: (rnd() - 0.5) * 16,
  }));
}

/** A particle's render state at `sinceMs` after the burst started, or null. */
export function confettiAt(p, sinceMs) {
  const prog = ((sinceMs || 0) - p.delayMs) / p.fallMs;
  if (prog < 0 || prog > 1) return null;
  return {
    topPct: prog * 116 - 12, // fall from above the top edge to below the bottom
    leftPct: p.leftPct + p.drift * prog,
    opacity: prog > 0.85 ? (1 - prog) / 0.15 : 1,
    rotateDeg: p.rot + prog * 220,
    size: p.size,
    color: p.color,
  };
}
