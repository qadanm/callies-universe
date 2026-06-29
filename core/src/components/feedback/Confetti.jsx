import React, { useMemo } from "react";

/**
 * Confetti: DECORATION-ONLY celebratory burst. pointer-events:none, so it
 * never blocks tap targets or text. Honors reduce-motion (renders nothing).
 */
export function Confetti({ count = 28, active = true, style }) {
  const prefersReduce = typeof window !== "undefined"
    && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const colors = [
    "var(--sticker-yellow)", "var(--sticker-cyan)", "var(--sticker-pink)",
    "var(--sticker-lime)", "var(--flame-500)", "var(--sticker-purple)",
  ];

  const bits = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    dur: 1.6 + Math.random() * 1.4,
    size: 8 + Math.random() * 10,
    color: colors[i % colors.length],
    round: Math.random() > 0.5,
    rot: Math.random() * 360,
  })), [count]);

  if (!active || prefersReduce) return null;

  return (
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0, overflow: "hidden",
      pointerEvents: "none", zIndex: 60, ...style,
    }}>
      {bits.map((b, i) => (
        <span key={i} style={{
          position: "absolute", top: 0, left: `${b.left}%`,
          width: b.size, height: b.size * (b.round ? 1 : 0.5),
          background: b.color,
          borderRadius: b.round ? "50%" : "2px",
          transform: `rotate(${b.rot}deg)`,
          animation: `rmr-confetti-fall ${b.dur}s var(--ease-in) ${b.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}
