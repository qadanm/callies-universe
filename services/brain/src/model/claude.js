// services/brain — the MODEL interface (thin + swappable).
//
// Claude drives the writing and the grading — it's strongest at voice and
// comedic nuance — but the brain talks to it through this narrow interface so
// the model is swappable later. Everything the brain needs is three methods:
//
//   model.json({ system, user, schema, effort })  → validated object
//   model.search({ system, user })                → { text, sources }
//   model.id                                       → model identifier string
//
// The Anthropic SDK is imported DYNAMICALLY so the offline path never requires
// the dependency to be installed or a key to be present.

const DEFAULT_MODEL = "claude-opus-4-8";

/**
 * Build the Claude-backed model, or return null if no key / SDK is available
 * (the orchestrator then takes the offline path).
 *
 * @param {{ apiKey?: string, model?: string }} [config]
 * @returns {Promise<null | object>}
 */
export async function createClaudeModel(config = {}) {
  // Resolve the key from config or the Node environment. In a browser (Vite
  // build) there is no `process` and no key — and we'd never want to ship a key
  // to the client anyway — so we bail to the offline path before touching the SDK.
  const envKey =
    typeof process !== "undefined" && process.env ? process.env.ANTHROPIC_API_KEY : undefined;
  const apiKey = config.apiKey || envKey;
  if (!apiKey) return null;

  let Anthropic;
  try {
    // Variable specifier + @vite-ignore so the browser bundler never tries to
    // pull the Node SDK into the app bundle. Only reached server-side / in Node,
    // where a key actually exists.
    const sdk = "@anthropic-ai/sdk";
    ({ default: Anthropic } = await import(/* @vite-ignore */ sdk));
  } catch {
    // SDK not installed — fall back to offline.
    return null;
  }

  const client = new Anthropic({ apiKey });
  const modelId = config.model || DEFAULT_MODEL;

  /** Pull the first JSON text block out of a response and parse it. */
  function parseJSON(message) {
    const block = message.content.find(
      (b) => b.type === "text" && b.text && b.text.trim()
    );
    if (!block) throw new Error("model returned no text block");
    return JSON.parse(block.text);
  }

  return {
    id: modelId,

    /**
     * Structured generation. Returns an object validated against `schema`
     * (a JSON Schema). Uses adaptive thinking for comedic/judgement nuance.
     */
    async json({ system, user, schema, effort = "high", maxTokens = 4096, thinking = true }) {
      const req = {
        model: modelId,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
        output_config: {
          effort,
          format: { type: "json_schema", schema },
        },
      };
      if (thinking) req.thinking = { type: "adaptive" };
      const message = await client.messages.create(req);
      return parseJSON(message);
    },

    /**
     * Live web research. Runs the server-side web_search tool, handling the
     * pause_turn continuation loop, and returns the synthesized text plus the
     * sources the model actually pulled from.
     *
     * `maxUses` is kept low and the resume loop short on purpose: web_search
     * results carry the fetched page content, and resuming a pause_turn re-sends
     * the whole growing assistant turn back to the API. Letting that compound
     * over many rounds is what blew the heap on search-heavy cars — so we cap
     * searches and rounds, accumulate only the small text + source list we need,
     * and never retain the large content blocks beyond the resume that needs them.
     */
    async search({ system, user, maxTokens = 3000, maxUses = 4, maxRounds = 3 }) {
      const tools = [{ type: "web_search_20260209", name: "web_search", max_uses: maxUses }];
      let messages = [{ role: "user", content: user }];
      const sources = [];
      let text = "";

      for (let i = 0; i < maxRounds; i++) {
        const message = await client.messages.create({
          model: modelId,
          max_tokens: maxTokens,
          system,
          messages,
          thinking: { type: "adaptive" },
          tools,
        });
        collectSources(message, sources);
        // Keep the synthesized prose; drop everything else from our retained state.
        const prose = message.content
          .filter((b) => b.type === "text" && b.text)
          .map((b) => b.text)
          .join("\n")
          .trim();
        if (prose) text = prose;

        if (message.stop_reason !== "pause_turn") break;
        // Resume the server-tool turn (the API requires the assistant content back).
        messages = [...messages, { role: "assistant", content: message.content }];
      }

      return { text, sources: dedupeSources(sources) };
    },
  };
}

/** Pull web_search_result entries (title/url) out of a response's content. */
function collectSources(message, out) {
  for (const block of message.content) {
    if (block.type !== "web_search_tool_result") continue;
    const content = block.content;
    if (!Array.isArray(content)) continue; // error blocks carry an object, not a list
    for (const r of content) {
      if (r && r.type === "web_search_result" && r.url) {
        out.push({ title: r.title || r.url, url: r.url });
      }
    }
  }
}

function dedupeSources(sources) {
  const seen = new Set();
  const out = [];
  for (const s of sources) {
    if (seen.has(s.url)) continue;
    seen.add(s.url);
    out.push(s);
  }
  return out.slice(0, 12);
}
