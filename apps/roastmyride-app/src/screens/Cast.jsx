// Voice picking now happens inline on Home (the 2-voice picker with previews),
// so this standalone screen is retired. Kept as a redirect so any old link or
// the dev screen-picker lands somewhere sane instead of a dead route.
import React from "react";
import { Navigate } from "react-router-dom";

export function Cast() {
  return <Navigate to="/home" replace />;
}
