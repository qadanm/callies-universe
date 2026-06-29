import React from "react";
import { createRoot } from "react-dom/client";

// The single CSS entry point. Pulls in every token file (calico base + accent slot,
// type, spacing, radius, elevation, motion, effects). This is exactly what an app links.
import "@callies-universe/core/styles.css";
import { FilterHost } from "@callies-universe/core";

import { App } from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FilterHost />
    <App />
  </React.StrictMode>
);
