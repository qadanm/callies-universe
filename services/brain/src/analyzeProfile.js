// services/brain — analyze a dating/social profile screenshot into a structured description.
//
// The profile analog of identify.js / analyzeConversation.js: the material lives
// INSIDE the screenshot, so before the brain can ground a roast we read the image once
// with a vision model and return a structured description. No key / no image / any
// error → null, so the flow never breaks (the profile pack then degrades to its
// curated offline set).
//
// CRITICAL: this is the MOST SENSITIVE subject. The description MUST focus on the
// bio, prompts, and photo choices/composition — NEVER on the person's looks, body,
// or any identifying information.

import { createClaudeModel } from "./model/claude.js";

const PROFILE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["hasProfile", "label", "description"],
  properties: {
    hasProfile: { type: "boolean" },
    label: { type: "string" },      // short label, e.g. "a Hinge profile with gym selfies"
    description: { type: "string" }, // detailed description for the brain's ground()
  },
};

/**
 * @param {{ imageDataUrl?: string }} input
 * @param {object} [config]
 * @returns {Promise<{ label: string, description: string } | null>}
 */
export async function analyzeProfile({ imageDataUrl } = {}, config = {}) {
  if (!imageDataUrl) return null;

  const models = config._model
    ? { utility: config._model }
    : await createClaudeModel(config);
  if (!models || !models.utility || !models.utility.visionJson) return null;

  try {
    const out = await models.utility.visionJson({
      system:
        "You describe a dating or social media profile from a screenshot for a comedy app. " +
        "Analyze the bio text, prompt answers, photo choices, and composition. " +
        "Be specific about the CHOICES (wording, angles, clichés) — NEVER describe the person's " +
        "looks, body, race, gender, or any identifying traits. Focus on the content and strategy, " +
        "not the person. If there is no clear profile, set hasProfile false.",
      imageDataUrl,
      prompt: "Describe the profile's content and choices. Return { hasProfile, label, description }.",
      schema: PROFILE_SCHEMA,
    });
    if (!out || !out.hasProfile || !out.description || !out.description.trim()) return null;
    return { label: out.label || "a profile", description: out.description.trim() };
  } catch {
    return null;
  }
}
