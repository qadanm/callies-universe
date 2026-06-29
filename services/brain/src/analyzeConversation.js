// services/brain — read a text-message screenshot into a transcript (vision).
//
// The texts analog of identify.js: the conversation lives INSIDE the screenshot,
// so before the (text-only) brain can ground a roast we read the image once with
// a vision model and return a plain-text transcript. The image goes ONLY here,
// never to the writer/grader (mirrors how the car photo goes only to /identify).
//
// No key / no image / no legible conversation / any error → null, so the flow
// never breaks (the texts pack then degrades to its curated offline set).

import { createClaudeModel } from "./model/claude.js";

const TRANSCRIPT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["hasConversation", "transcript"],
  properties: {
    hasConversation: { type: "boolean" }, // false when there's no legible text thread
    transcript: { type: "string" },       // one message per line, sender-labeled
  },
};

/**
 * @param {{ imageDataUrl?: string }} input
 * @param {object} [config] - same shape as generateRoast config (apiKey/model/_model)
 * @returns {Promise<string | null>} the conversation transcript, or null
 */
export async function analyzeConversation({ imageDataUrl } = {}, config = {}) {
  if (!imageDataUrl) return null;

  const models = config._model
    ? { utility: config._model }
    : await createClaudeModel(config);
  if (!models || !models.utility || !models.utility.visionJson) return null; // no key/SDK

  try {
    const out = await models.utility.visionJson({
      system:
        "You transcribe a screenshot of a text-message conversation for a comedy app. Read every " +
        "message in order and output the conversation as plain text, ONE MESSAGE PER LINE, labeled by " +
        "sender: the user's own bubbles (right-aligned; blue or green) are 'Me:', the other person's " +
        "(left-aligned; grey) are 'Them:'. Include timestamps and 'Read'/'Delivered' receipts if visible, " +
        "in parentheses. Transcribe faithfully — do not invent, summarize, or roast. If there is no " +
        "legible text conversation, set hasConversation false.",
      imageDataUrl,
      prompt: "Transcribe this conversation. Return { hasConversation, transcript }.",
      schema: TRANSCRIPT_SCHEMA,
    });
    if (!out || !out.hasConversation || !out.transcript || !out.transcript.trim()) return null;
    return out.transcript.trim();
  } catch {
    return null; // never break the flow on a transcription failure
  }
}
