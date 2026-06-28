// services/brain — photo car identification (vision).
//
// Given the car photo, name the vehicle so the brain researches the user's ACTUAL
// car instead of the default. Runs on the cheap utility model (vision-capable).
// No key / no image / low confidence / any error → null (the orchestrator then
// falls back to its default car), so the flow never breaks.

import { createClaudeModel } from "./model/claude.js";

const CAR_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["make", "model", "confidence"],
  properties: {
    year: { type: "integer" }, // omitted when not legible
    make: { type: "string" },
    model: { type: "string" },
    confidence: { type: "number" }, // 0..1
  },
};

const MIN_CONFIDENCE = 0.4;

/**
 * @param {{ imageDataUrl?: string }} input
 * @param {object} [config] - same shape as generateRoast config (apiKey/model/_model)
 * @returns {Promise<import("../contract").CarIdentity | null>}
 */
export async function identifyCar({ imageDataUrl } = {}, config = {}) {
  if (!imageDataUrl) return null;

  const models = config._model
    ? { utility: config._model }
    : await createClaudeModel(config);
  if (!models || !models.utility || !models.utility.visionJson) return null; // no key/SDK

  try {
    const out = await models.utility.visionJson({
      system:
        "You identify the car in a user's photo for a comedy app. Name the make and model " +
        "(and the year if it's legible) of the single most prominent vehicle. Give a 0..1 " +
        "confidence. If there's no clear car, return low confidence.",
      imageDataUrl,
      prompt: "What car is this? Return { year?, make, model, confidence }.",
      schema: CAR_SCHEMA,
    });
    if (!out || !out.make || !out.model || (out.confidence ?? 0) < MIN_CONFIDENCE) return null;
    const label = [out.year, out.make, out.model].filter(Boolean).join(" ");
    return { year: out.year || undefined, make: out.make, model: out.model, label, confidence: out.confidence };
  } catch {
    return null; // never break the flow on an ID failure
  }
}
