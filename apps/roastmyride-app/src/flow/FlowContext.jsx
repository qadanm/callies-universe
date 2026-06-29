// RoastMyRide — flow state [ROASTMYRIDE-NEW].
//
// Holds what the user assembles across the screens (the real car photo, chosen
// roaster, context chips) and exposes generate(), which calls the roast SEAM
// (services/roast.js). The roast result is stored here and read by the Reveal screen.
//
// Photos: the compressed car image (dataUrl) lives HERE for the stage + video to
// render, but is STRIPPED before the brain call (sanitizeForBrain) — the model
// only needs presence + identity, never megabytes of base64.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { generateRoast } from "../services/roast.js";
import { hasRoastApi, identifyCarViaApi } from "../services/roastApi.js";
import { hasCreditsApi, fetchCredits, consumeCredit } from "../services/credits.js";
import { offlineBrain } from "@callies-universe/brain";
import { cfg } from "../subjects/index.js";

const DEFAULT_INPUT = {
  carPhoto: { present: false },
  // The car the brain researches. Until photo-ID lands, the brain defaults to a
  // representative car for the live path; set this to a real {year,make,model}
  // (or carPhoto.identified) once identification ships. null → brain default.
  car: null,
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
  car: { label: cfg("brain.subjectNoun") },
  roasterId: "mama",
  context: [],
  config: { offline: true },
});

const FlowCtx = createContext(null);

// Credits persist across reloads (the monetization unit). localStorage only —
// no account yet. Guarded so a missing/blocked store just falls back to default.
const CREDITS_KEY = "rmr.credits";
const DEFAULT_CREDITS = 3;
function readCredits() {
  try {
    const v = localStorage.getItem(CREDITS_KEY);
    if (v !== null) {
      const n = parseInt(v, 10);
      if (Number.isFinite(n)) return Math.max(0, n);
    }
  } catch { /* no storage */ }
  return DEFAULT_CREDITS;
}
function writeCredits(n) {
  try { localStorage.setItem(CREDITS_KEY, String(n)); } catch { /* no storage */ }
}

export function FlowProvider({ children }) {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [result, setResult] = useState(null);
  const [credits, setCreditsState] = useState(readCredits);

  // setCredits accepts a value or updater (like useState) and persists the result.
  const setCredits = useCallback((updater) => {
    setCreditsState((prev) => {
      const next = Math.max(0, typeof updater === "function" ? updater(prev) : updater);
      writeCredits(next);
      return next;
    });
  }, []);

  // When a backend is present, the SERVER ledger is the source of truth — sync the
  // balance on mount (seeds free credits for a new identity). No backend → the
  // localStorage credits above stay authoritative.
  useEffect(() => {
    if (!hasCreditsApi()) return;
    fetchCredits().then((c) => setCredits(c)).catch(() => {});
  }, [setCredits]);

  const update = useCallback((patch) => setInput((prev) => ({ ...prev, ...patch })), []);

  // The one call into the roast pipeline. The brain gets a sanitized input
  // (presence + identity only — no image blobs); the full input (with photos)
  // stays in context for the stage + video to render. A successful roast costs a
  // credit (the funnel is gated to >=1 credit before we get here).
  const generate = useCallback(async () => {
    // Photo car-ID (server vision) when a backend is present and we have a photo
    // but no explicit car — so the brain researches the user's ACTUAL ride. The
    // photo goes ONLY to /identify, never to the text brain (sanitizeForBrain).
    let active = input;
    if (hasRoastApi() && input.carPhoto?.dataUrl && !input.car) {
      try {
        const car = await identifyCarViaApi(input.carPhoto.dataUrl);
        if (car) active = { ...input, car };
      } catch (e) {
        console.warn(`[flow] car identification failed (${(e && e.message) || e}); using default`);
      }
    }
    const r = await generateRoast(sanitizeForBrain(active));
    setResult(r);
    // Charge for a delivered roast — but NOT when a live attempt degraded to the
    // offline fallback (our failure shouldn't cost the user). Backend present →
    // consume from the server ledger (authoritative); else decrement locally.
    if (!r.degraded) {
      if (hasCreditsApi()) {
        try { const c = await consumeCredit(); if (c.ok) setCredits(c.credits); } catch { /* keep local */ }
      } else {
        setCredits((c) => c - 1);
      }
    }
    return r;
  }, [input, setCredits]);

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
  return {
    ...input,
    carPhoto: { present: !!carPhoto.present, identified: carPhoto.identified ?? null },
  };
}
