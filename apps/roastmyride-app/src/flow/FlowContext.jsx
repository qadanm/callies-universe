// RoastMyRide flow state [ROASTMYRIDE-NEW].
//
// Holds what the user assembles across the screens (the real car photo, chosen
// roaster, context chips) and exposes generate(), which calls the roast SEAM
// (services/roast.js). The roast result is stored here and read by the Reveal screen.
//
// Photos: the compressed car image (dataUrl) lives HERE for the stage + video to
// render, but is STRIPPED before the brain call (sanitizeForBrain): the model
// only needs presence + identity, never megabytes of base64.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { generateRoast } from "../services/roast.js";
import { hasRoastApi, identifyCarViaApi, transcribeViaApi, analyzeOutfitViaApi, analyzeRoomViaApi, analyzeProfileViaApi } from "../services/roastApi.js";
import { hasCreditsApi, fetchCredits, consumeCredit } from "../services/credits.js";
import { offlineBrain } from "@callies-universe/brain";
import { cfg } from "../subjects/index.js";

const DEFAULT_INPUT = {
  carPhoto: { present: false },
  // The car the brain researches. Until photo-ID lands, the brain defaults to a
  // representative car for the live path; set this to a real {year,make,model}
  // (or carPhoto.identified) once identification ships. null → brain default.
  car: null,
  // For text-style subjects: the conversation transcript, populated by an upstream
  // vision read of the screenshot (the texts analog of car /identify). Until that
  // wire lands it stays null and the brain falls back to the curated offline set.
  conversation: null,
  // The roast is ALWAYS two voices trading lines about the car. roasterIds is the
  // ordered pair [a, b]; roasterId mirrors the lead (a) for anything that still
  // reads a single id. format stays "panel" internally (the render/brain term)
  // but nothing user-facing ever says "panel" or "green room": just "two voices".
  roasterId: "mama",
  format: "panel",
  roasterIds: ["mama", "tony"],
  // "How mean" = one heat level (gentle | medium | brutal). Default medium.
  context: ["medium"],
};

/**
 * A canned result so a directly-opened /reveal still renders for click-through.
 * Built from the brain's offline path so it matches the EVOLVED result shape
 * (structured set + research + grade), not a hand-maintained flat stub.
 */
const PREVIEW_RESULT = offlineBrain({
  subject: cfg("id"),
  carPhoto: { present: true },
  car: { label: cfg("brain.subjectNoun") },
  roasterId: "mama",
  context: [],
  config: { offline: true },
});

const FlowCtx = createContext(null);

// Credits persist across reloads (the monetization unit). localStorage only,
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
  const generatingRef = useRef(false); // guard against StrictMode double-fire

  // setCredits accepts a value or updater (like useState) and persists the result.
  const setCredits = useCallback((updater) => {
    setCreditsState((prev) => {
      const next = Math.max(0, typeof updater === "function" ? updater(prev) : updater);
      writeCredits(next);
      return next;
    });
  }, []);

  // When a backend is present, the SERVER ledger is the source of truth, so sync the
  // balance on mount (seeds free credits for a new identity). No backend → the
  // localStorage credits above stay authoritative.
  useEffect(() => {
    if (!hasCreditsApi()) return;
    fetchCredits().then((c) => setCredits(c)).catch(() => {});
  }, [setCredits]);

  const update = useCallback((patch) => setInput((prev) => ({ ...prev, ...patch })), []);

  // The one call into the roast pipeline. The brain gets a sanitized input
  // (presence + subject identity only, no image blobs); the full input (with photos)
  // stays in context for the stage + video to render. A successful roast costs a
  // credit (the funnel is gated to >=1 credit before we get here).
  // Guarded by generatingRef so StrictMode double-mounts don't deduct twice.
  const generate = useCallback(async () => {
    if (generatingRef.current) {
      // Another generation is already in progress; wait for it.
      while (generatingRef.current) {
        await new Promise((r) => setTimeout(r, 50));
      }
      return result;
    }
    generatingRef.current = true;
    try {
      // Server vision when a backend is present and we have an upload: read the
      // photo into what the (text-only) brain needs to ground the roast. The image
      // goes ONLY to the vision endpoint, never to the brain itself (sanitizeForBrain
      // strips it). Each subject uses its own read; subjects without a vision step
      // just skip this.
      let active = input;
      if (hasRoastApi() && input.carPhoto?.dataUrl) {
        if (cfg("id") === "car" && !input.car) {
          try {
            const car = await identifyCarViaApi(input.carPhoto.dataUrl);
            if (car) active = { ...input, car };
          } catch (e) {
            console.warn(`[flow] car identification failed (${(e && e.message) || e}); using default`);
          }
        } else if (cfg("id") === "texts" && !input.conversation) {
          try {
            const conversation = await transcribeViaApi(input.carPhoto.dataUrl);
            if (conversation) active = { ...input, conversation };
          } catch (e) {
            console.warn(`[flow] transcription failed (${(e && e.message) || e}); using offline`);
          }
        } else if (cfg("id") === "outfit" && !input.outfit) {
          try {
            const outfit = await analyzeOutfitViaApi(input.carPhoto.dataUrl);
            if (outfit) active = { ...input, outfit };
          } catch (e) {
            console.warn(`[flow] outfit analysis failed (${(e && e.message) || e}); using offline`);
          }
        } else if (cfg("id") === "room" && !input.room) {
          try {
            const room = await analyzeRoomViaApi(input.carPhoto.dataUrl);
            if (room) active = { ...input, room };
          } catch (e) {
            console.warn(`[flow] room analysis failed (${(e && e.message) || e}); using offline`);
          }
        } else if (cfg("id") === "profile" && !input.profile) {
          try {
            const profile = await analyzeProfileViaApi(input.carPhoto.dataUrl);
            if (profile) active = { ...input, profile };
          } catch (e) {
            console.warn(`[flow] profile analysis failed (${(e && e.message) || e}); using offline`);
          }
        }
      }
      const r = await generateRoast(sanitizeForBrain(active));
      setResult(r);
      // Charge for a delivered roast, but NOT when a live attempt degraded to the
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
    } finally {
      generatingRef.current = false;
    }
  }, [input, setCredits, result]);

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

/** Strip image blobs before handing the input to the brain: it only needs
 *  presence + subject identity, not the base64 photos. Also stamps the subject id
 *  so the brain dispatches to the right grounding strategy + offline sets. */
function sanitizeForBrain(input) {
  const carPhoto = input.carPhoto || {};
  return {
    ...input,
    subject: cfg("id"),
    carPhoto: { present: !!carPhoto.present, identified: carPhoto.identified ?? null },
  };
}
