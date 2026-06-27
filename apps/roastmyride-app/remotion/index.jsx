// RoastMyRide — Remotion entry. Loads the SAME stylesheets as the live app (so
// the scene renders pixel-identical) then registers the root. This file is the
// bundle entry the render service points at; it is NOT imported by the SPA, so
// it never enters the Vite app bundle.
import "@callies-universe/core/styles.css"; // [CORE-REUSED] tokens + base
import "../theme.css"; // [ROASTMYRIDE-NEW] ember accent
import "../src/app.css"; // [ROASTMYRIDE-NEW] stage-scene keyframes + decoration
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root.jsx";

registerRoot(RemotionRoot);
