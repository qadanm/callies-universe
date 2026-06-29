// services/brain — analyze a room photo into a structured description.
//
// The room analog of identify.js / analyzeConversation.js: the material lives
// INSIDE the photo, so before the brain can ground a roast we read the image once
// with a vision model and return a structured description. No key / no image / any
// error → null, so the flow never breaks (the room pack then degrades to its
// curated offline set).

import { createClaudeModel } from "./model/claude.js";

const ROOM_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["hasRoom", "label", "description"],
  properties: {
    hasRoom: { type: "boolean" },
    label: { type: "string" },      // short label, e.g. "a cluttered bedroom with LED strip lights"
    description: { type: "string" }, // detailed description for the brain's ground()
  },
};

/**
 * @param {{ imageDataUrl?: string }} input
 * @param {object} [config]
 * @returns {Promise<{ label: string, description: string } | null>}
 */
export async function analyzeRoom({ imageDataUrl } = {}, config = {}) {
  if (!imageDataUrl) return null;

  const models = config._model
    ? { utility: config._model }
    : await createClaudeModel(config);
  if (!models || !models.utility || !models.utility.visionJson) return null;

  try {
    const out = await models.utility.visionJson({
      system:
        "You describe a room in a photo for a comedy app. Analyze the decor, furniture, layout, " +
        "color scheme, cleanliness, lighting, and overall vibe. Be specific and factual — do not roast or judge. " +
        "If there is no clear room or living space, set hasRoom false.",
      imageDataUrl,
      prompt: "Describe the room. Return { hasRoom, label, description }.",
      schema: ROOM_SCHEMA,
    });
    if (!out || !out.hasRoom || !out.description || !out.description.trim()) return null;
    return { label: out.label || "a room", description: out.description.trim() };
  } catch {
    return null;
  }
}
