// services/brain — analyze an outfit photo into a structured description.
//
// The outfit analog of identify.js / analyzeConversation.js: the material lives
// INSIDE the photo, so before the brain can ground a roast we read the image once
// with a vision model and return a structured description. No key / no image / any
// error → null, so the flow never breaks (the outfit pack then degrades to its
// curated offline set).

import { createClaudeModel } from "./model/claude.js";

const OUTFIT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["hasOutfit", "label", "description"],
  properties: {
    hasOutfit: { type: "boolean" },
    label: { type: "string" },      // short label, e.g. "an oversized blazer with cargo pants"
    description: { type: "string" }, // detailed description for the brain's ground()
  },
};

/**
 * @param {{ imageDataUrl?: string }} input
 * @param {object} [config]
 * @returns {Promise<{ label: string, description: string } | null>}
 */
export async function analyzeOutfit({ imageDataUrl } = {}, config = {}) {
  if (!imageDataUrl) return null;

  const models = config._model
    ? { utility: config._model }
    : await createClaudeModel(config);
  if (!models || !models.utility || !models.utility.visionJson) return null;

  try {
    const out = await models.utility.visionJson({
      system:
        "You describe an outfit in a photo for a comedy app. Analyze the style, fit, color choices, " +
        "accessories, layering, and overall vibe. Be specific and factual — do not roast or judge. " +
        "If there is no clear outfit or person in clothing, set hasOutfit false.",
      imageDataUrl,
      prompt: "Describe the outfit. Return { hasOutfit, label, description }.",
      schema: OUTFIT_SCHEMA,
    });
    if (!out || !out.hasOutfit || !out.description || !out.description.trim()) return null;
    return { label: out.label || "an outfit", description: out.description.trim() };
  } catch {
    return null;
  }
}
