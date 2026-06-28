// services/brain — the MODEL interface (thin, swappable, cost-tiered).
//
// Claude drives the writing and the grading, but the brain talks to it through
// this narrow interface — three methods: json(), search(), id.
//
// COST TIERING (spend on the funny, economize on everything else):
//   • write   → Sonnet 4.6 by default — the comedy, where voice matters.
//   • utility → Haiku 4.5 by default — research + grading (judgment/extraction).
// Both are far cheaper than Opus. Override per stage:
//   BRAIN_WRITE_MODEL / config.writeModel   (the writer)
//   BRAIN_MODEL       / config.model        (research + grading)
// Set both to claude-opus-4-8 for premium, or claude-haiku-4-5 for rock-bottom.
//
// The SDK is imported DYNAMICALLY so the offline path never needs the dependency
// or a key, and the variable specifier + @vite-ignore keeps it out of the
// browser bundle.

const DEFAULT_WRITE_MODEL = "claude-sonnet-4-6"; // the funny
const DEFAULT_UTILITY_MODEL = "claude-haiku-4-5"; // research + grading

// Published $/1M tokens (input/output) for the cost estimate. Unknown model → 0.
export const COST_USD_PER_MTOK = {
  "claude-opus-4-8": { in: 5, out: 25 },
  "claude-opus-4-7": { in: 5, out: 25 },
  "claude-opus-4-6": { in: 5, out: 25 },
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-haiku-4-5": { in: 1, out: 5 },
  "claude-fable-5": { in: 10, out: 50 },
};

/** Estimate USD for a list of per-model token usages. Excludes web-search fees. */
export function usageCost(usages) {
  let usd = 0;
  for (const u of usages || []) {
    const rate = COST_USD_PER_MTOK[u.model] || { in: 0, out: 0 };
    usd += ((u.inputTokens || 0) / 1e6) * rate.in + ((u.outputTokens || 0) / 1e6) * rate.out;
  }
  return Math.round(usd * 1e4) / 1e4;
}

/** Which request features a model accepts (older/cheaper models reject some). */
function capabilities(modelId) {
  const effort = /(opus-4-[5-9]|sonnet-4-6|fable-5|mythos-5)/.test(modelId);
  const adaptive = /(opus-4-[6-9]|sonnet-4-6|fable-5|mythos-5)/.test(modelId);
  return { effort, adaptive };
}

/**
 * Build the Claude-backed models, or return null if no key / SDK is available
 * (the orchestrator then takes the offline path). Returns { write, utility }.
 *
 * @param {{ apiKey?: string, model?: string, writeModel?: string }} [config]
 * @returns {Promise<null | { write: object, utility: object }>}
 */
export async function createClaudeModel(config = {}) {
  const env = typeof process !== "undefined" && process.env ? process.env : {};
  const apiKey = config.apiKey || env.ANTHROPIC_API_KEY;
  if (!apiKey) return null; // browser / no key → offline path

  let Anthropic;
  try {
    const sdk = "@anthropic-ai/sdk";
    ({ default: Anthropic } = await import(/* @vite-ignore */ sdk));
  } catch {
    return null; // SDK not installed → offline
  }

  const client = new Anthropic({ apiKey });
  const writeModel = config.writeModel || env.BRAIN_WRITE_MODEL || DEFAULT_WRITE_MODEL;
  const utilityModel = config.model || env.BRAIN_MODEL || DEFAULT_UTILITY_MODEL;

  return {
    write: makeModel(client, writeModel),
    utility: makeModel(client, utilityModel),
  };
}

/** One model object bound to a model id (sharing the client). */
function makeModel(client, modelId) {
  const caps = capabilities(modelId);
  // Per-model token meter — every API call adds to this so the result can report cost.
  const usage = { model: modelId, inputTokens: 0, outputTokens: 0, calls: 0 };
  const meter = (message) => {
    const u = message && message.usage;
    if (!u) return;
    usage.inputTokens += u.input_tokens || 0;
    usage.outputTokens += u.output_tokens || 0;
    usage.calls += 1;
  };

  function parseJSON(message) {
    const block = message.content.find((b) => b.type === "text" && b.text && b.text.trim());
    if (!block) throw new Error("model returned no text block");
    return JSON.parse(block.text);
  }

  return {
    id: modelId,
    usage,

    /**
     * Structured generation → object validated against `schema`. `effort` and
     * `thinking` are applied only on models that support them (Haiku ignores
     * both — passing them would 400 / waste tokens).
     */
    async json({ system, user, schema, effort = "low", maxTokens = 4096, thinking = false }) {
      const output_config = { format: { type: "json_schema", schema } };
      if (caps.effort) output_config.effort = effort;
      const req = {
        model: modelId,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
        output_config,
      };
      if (thinking && caps.adaptive) req.thinking = { type: "adaptive" };
      const message = await client.messages.create(req);
      meter(message);
      return parseJSON(message);
    },

    /**
     * Live web research via the BASIC web_search_20250305 tool (small result
     * snippets + URLs — not the _20260209 dynamic-filtering variant, which buffers
     * full page bodies and blew the heap). max_uses + resume loop kept short; we
     * retain only the synthesized prose + sources, never the large content blocks.
     */
    async search({ system, user, maxTokens = 3000, maxUses = 5, maxRounds = 2 }) {
      const tools = [{ type: "web_search_20250305", name: "web_search", max_uses: maxUses }];
      let messages = [{ role: "user", content: user }];
      const sources = [];
      let text = "";

      for (let i = 0; i < maxRounds; i++) {
        const req = { model: modelId, max_tokens: maxTokens, system, messages, tools };
        if (caps.adaptive) req.thinking = { type: "adaptive" };
        const message = await client.messages.create(req);
        meter(message);
        collectSources(message, sources);
        const prose = message.content
          .filter((b) => b.type === "text" && b.text)
          .map((b) => b.text)
          .join("\n")
          .trim();
        if (prose) text = prose;

        if (message.stop_reason !== "pause_turn") break;
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
