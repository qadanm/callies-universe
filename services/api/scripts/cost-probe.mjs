// Measure REAL brain cost + latency + voice char-count per roast across the cost
// levers (candidate count, web-search on/off, single vs panel). Hits /roast on a
// live server with real keys. Render compute is measured separately.
//   set -a; source ~/callies-keys.env; set +a
//   node services/api/scripts/cost-probe.mjs
import { createApiServer } from "../index.js";

const env = process.env;
if (!env.ANTHROPIC_API_KEY) { console.error("need ANTHROPIC_API_KEY"); process.exit(1); }
const CAR = { label: "2015 Kia K900 V8", make: "Kia", model: "K900", year: 2015 };

const srv = createApiServer({});
await new Promise((r) => srv.listen(0, r));
const base = `http://localhost:${srv.address().port}`;
const post = (p, body) => fetch(`${base}${p}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const spoken = (b) => [b.text, b.punch, b.tail].filter(Boolean).join("").length;

const CONFIGS = [
  { label: "panel  c=2  +search (CURRENT DEFAULT)", search: true,  body: { subject: "car", format: "panel", roasterIds: ["mama", "tony"], car: CAR, context: ["brutal"] } },
  { label: "panel  c=1  +search",                   search: true,  body: { subject: "car", format: "panel", roasterIds: ["mama", "tony"], car: CAR, context: ["brutal"], config: { candidates: 1 } } },
  { label: "panel  c=2  NO-search",                 search: false, body: { subject: "car", format: "panel", roasterIds: ["mama", "tony"], car: CAR, context: ["brutal"] } },
  { label: "single c=2  +search",                   search: true,  body: { subject: "car", roasterId: "mama", car: CAR, context: ["brutal"] } },
];

const rows = [];
for (const cfg of CONFIGS) {
  // Search is opt-in (BRAIN_WEB_SEARCH=1); model-knowledge grounding is the default.
  if (cfg.search) { env.BRAIN_WEB_SEARCH = "1"; delete env.BRAIN_NO_SEARCH; }
  else { delete env.BRAIN_WEB_SEARCH; delete env.BRAIN_NO_SEARCH; }
  const t = Date.now();
  const r = await (await post("/roast", cfg.body)).json();
  const ms = Date.now() - t;
  const beats = (r.set && r.set.beats) || [];
  const chars = beats.reduce((n, b) => n + spoken(b), 0);
  rows.push({
    label: cfg.label, ms, engine: r.engine, pass: r.grade && r.grade.pass,
    cand: r.grade && r.grade.candidates, turns: beats.length, chars,
    usd: (r.cost && r.cost.usd) || 0, tin: r.usage && r.usage.tokensIn, tout: r.usage && r.usage.tokensOut,
  });
  console.log(`  ✓ ${cfg.label.padEnd(34)} ${(ms / 1000).toFixed(1)}s  brain $${((r.cost && r.cost.usd) || 0).toFixed(4)}  ${beats.length} turns  ${chars} chars`);
}
srv.close();

console.log("\n=== BRAIN cost (measured) + VOICE estimate ===");
console.log("(voice: ElevenLabs ~$0.18/1k chars Creator tier, ~$0.24/1k pay-as-you-go; adjust to your plan)");
const VOICE_PER_K = 0.18;
for (const r of rows) {
  const voice = (r.chars / 1000) * VOICE_PER_K;
  console.log(`  ${r.label.padEnd(34)} brain $${r.usd.toFixed(4)} + voice ~$${voice.toFixed(4)} = ~$${(r.usd + voice).toFixed(4)}  (${(r.ms / 1000).toFixed(0)}s, ${r.cand} cand, ${r.tin}/${r.tout} tok)`);
}
console.log("\nNote: +search configs also incur Anthropic web-search fees (~$0.01/search, NOT in brain $).");
