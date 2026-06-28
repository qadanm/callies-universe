// RoastMyRide — Remotion entry. Loads the SAME stylesheets as the live app (so
// the scene renders pixel-identical) then registers the root. This file is the
// bundle entry the render service points at; it is NOT imported by the SPA, so
// it never enters the Vite app bundle.
//
// FONTS: core/styles.css @imports "Baloo 2" + "Hanken Grotesque" from Google, the
// same as the app — so a networked render gets the real display font (--font-display),
// and offline it falls back to the system stack (graceful, no stall). For fully
// deterministic exports (no font flash, no network), the production upgrade is to
// self-host the woff2 files via @font-face, or use @remotion/google-fonts'
// loadFont() (which delayRenders until the font is ready). Deferred to keep offline
// renders fast + the install network-free.
import "@callies-universe/core/styles.css"; // [CORE-REUSED] tokens + base
import "../theme.css"; // [ROASTMYRIDE-NEW] ember accent
import "../src/app.css"; // [ROASTMYRIDE-NEW] stage-scene keyframes + decoration
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root.jsx";

registerRoot(RemotionRoot);
