// RoastMyRide — tiny shared presentational helpers [ROASTMYRIDE-NEW].
// Screen chrome only (eyebrows, headlines, the wordmark, the scroll frame).
// All real UI affordances come from CORE components; these just lay out text.
import React from "react";

export function ScreenScroll({ children, style }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "var(--space-5)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }) {
  return (
    <span
      style={{
        font: "var(--type-cap)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--ember-600)",
        fontWeight: 800,
      }}
    >
      {children}
    </span>
  );
}

export function H({ children, style }) {
  return (
    <h1 style={{ font: "var(--type-d1)", color: "var(--ink)", margin: 0, lineHeight: 1, ...style }}>
      {children}
    </h1>
  );
}

import { cfg } from "../subjects/index.js";

export function Wordmark() {
  const name = cfg("appName");
  return (
    <span style={{ font: "var(--type-d3)", fontSize: 24, letterSpacing: "-0.02em", color: "var(--ink)" }}>
      {name}
    </span>
  );
}

export const stickyBar = {
  display: "flex",
  gap: "var(--space-3)",
  padding: "var(--space-4) var(--space-5)",
  borderTop: "1px solid var(--hairline)",
  background: "var(--canvas)",
};
