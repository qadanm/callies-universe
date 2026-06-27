// RoastMyRide — flow state [ROASTMYRIDE-NEW].
//
// Holds what the user assembles across the screens (the real car photo, an
// optional selfie/profile, chosen roaster, context chips) and exposes
// generate(), which calls the roast SEAM (services/roast.js). The roast result
// is stored here and read by the Reveal screen.
//
// Photos: the compressed image blobs (dataUrl) live HERE for the stage + video
// to render, but are STRIPPED before the brain call (sanitizeForBrain) — the
// model only needs presence + identity, never megabytes of base64.

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { generateRoast } from "../services/roast.js";
import { offlineBrain } from "@callies-universe/brain";

const DEFAULT_INPUT = {
  carPhoto: { present: false },
  // The car the brain researches. Until photo-ID lands, the brain defaults to a
  // representative car for the live path; set this to a real {year,make,model}
  // (or carPhoto.identified) once identification ships. null → brain default.
  car: null,
  personal: { present: false, kind: null },
  roasterId: "mama",
  context: [],
};

/**
 * A canned result so a directly-opened /reveal still renders for click-through.
 * Built from the brain's offline path so it matches the EVOLVED result shape
 * (structured set + research + grade), not a hand-maintained flat stub.
 */
const PREVIEW_RESULT = offlineBrain({
  carPhoto: { present: true },
  car: { label: "your ride" },
  roasterId: "mama",
  context: [],
  config: { offline: true },
});

const FlowCtx = createContext(null);

export function FlowProvider({ children }) {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [result, setResult] = useState(null);
  const [credits, setCredits] = useState(3);

  const update = useCallback((patch) => setInput((prev) => ({ ...prev, ...patch })), []);

  // The one call into the roast pipeline. The brain gets a sanitized input
  // (presence + identity only — no image blobs); the full input (with photos)
  // stays in context for the stage + video to render.
  const generate = useCallback(async () => {
    const r = await generateRoast(sanitizeForBrain(input));
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

/** Strip image blobs before handing the input to the brain — it only needs
 *  presence + car identity, not the base64 photos. */
function sanitizeForBrain(input) {
  const carPhoto = input.carPhoto || {};
  const personal = input.personal || {};
  return {
    ...input,
    carPhoto: { present: !!carPhoto.present, identified: carPhoto.identified ?? null },
    personal: { present: !!personal.present, kind: personal.kind ?? null },
  };
}
