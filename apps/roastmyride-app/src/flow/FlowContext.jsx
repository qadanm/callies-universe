// RoastMyRide — flow state [ROASTMYRIDE-NEW].
//
// Holds what the user assembles across the screens (car photo, optional
// selfie/profile, chosen roaster, context chips) and exposes generate(), which
// calls the roast SEAM (services/roast.js). The roast result is stored here and
// read by the Reveal screen. Mocked photos: we only track presence this pass.

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { generateRoast } from "../services/roast.js";

const DEFAULT_INPUT = {
  carPhoto: { present: false },
  personal: { present: false, kind: null },
  roasterId: "mama",
  context: [],
};

/** A canned result so a directly-opened /reveal still renders for click-through. */
const PREVIEW_RESULT = {
  id: "roast_preview",
  roasterId: "mama",
  roasterName: "Mama Denièce",
  register: "Church-fan snap",
  spice: "savage",
  segments: [
    { text: "Mm-mm-MM. Baby, this paint job is " },
    { text: "a cry for help", punch: true },
    { text: ", and I'm answering." },
  ],
  plainText: "Mm-mm-MM. Baby, this paint job is a cry for help, and I'm answering.",
  reaction: "savage",
  durationMs: 3800,
};

const FlowCtx = createContext(null);

export function FlowProvider({ children }) {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [result, setResult] = useState(null);
  const [credits, setCredits] = useState(3);

  const update = useCallback((patch) => setInput((prev) => ({ ...prev, ...patch })), []);

  // The one call into the roast pipeline. Swapping the mock for the real
  // service (in services/roast.js) requires no change here.
  const generate = useCallback(async () => {
    const r = await generateRoast(input);
    setResult(r);
    return r;
  }, [input]);

  const value = useMemo(
    () => ({
      input,
      update,
      result,
      previewResult: PREVIEW_RESULT,
      generate,
      credits,
      setCredits,
    }),
    [input, update, result, generate, credits]
  );

  return <FlowCtx.Provider value={value}>{children}</FlowCtx.Provider>;
}

export function useFlow() {
  const ctx = useContext(FlowCtx);
  if (!ctx) throw new Error("useFlow must be used inside <FlowProvider>");
  return ctx;
}
