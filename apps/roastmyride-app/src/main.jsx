import React from "react";
import { createRoot } from "react-dom/client";

/*
 * CSS load order matters, exactly as the handoff prescribes:
 *   1. core styles.css   → calico base palette + every token (the clean bones)
 *   2. theme.css         → fallback accent fills the --accent-* slot
 *   3. app.css           → decoration layer (the skin)
 *
 * Per-app distinctiveness (Guideline 4.3): each subject injects its own accent
 * ramp at runtime from the resolved config, overriding the fallback.
 */
import "@callies-universe/core/styles.css"; // [CORE-REUSED]
import "../theme.css";                       // fallback accent slot
import "./app.css";                          // decoration layer

// Inject the per-subject accent palette BEFORE React mounts, so every
// core component sees the right --accent-* variables from the first paint.
import { subject } from "./subjects/index.js";
if (subject && subject.theme && subject.theme.accent) {
  const css = Object.entries(subject.theme.accent)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  const style = document.createElement("style");
  style.textContent = `:root {\n${css}\n}`;
  document.head.appendChild(style);
}

import { App } from "./App.jsx";
import { initNativeChrome } from "./native.js";
import { initTrace } from "./trace.js";

// DIAGNOSTIC (inert unless VITE_TRACE_URL is set at build time).
initTrace();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Native-only chrome (status bar, hide splash, mark <html class="native">). No-op on web.
initNativeChrome();
