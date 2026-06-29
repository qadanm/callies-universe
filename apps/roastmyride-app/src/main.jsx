import React from "react";
import { createRoot } from "react-dom/client";

/*
 * CSS load order matters — exactly as the handoff prescribes:
 *   1. core styles.css   → calico base palette + every token (the clean bones)
 *   2. theme.css         → RoastMyRide's ember accent fills the --accent-* slot
 *                          (every core component reskins automatically)
 *   3. app.css           → RoastMyRide's sticker-bomb decoration layer (the skin)
 */
import "@callies-universe/core/styles.css"; // [CORE-REUSED]
import "../theme.css";                       // [ROASTMYRIDE-NEW] accent slot
import "./app.css";                          // [ROASTMYRIDE-NEW] decoration layer

import { App } from "./App.jsx";
import { initNativeChrome } from "./native.js";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Native-only chrome (status bar, hide splash, mark <html class="native">). No-op on web.
initNativeChrome();
