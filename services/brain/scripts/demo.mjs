// services/brain — the cross-character PROOF harness.
//
// Given a real car + a set of characters, it shows its work:
//   • the live research it used (with sources),
//   • the graded set each character produced,
//   • the grader's scores,
//   • a side-by-side that demonstrates the sets are genuinely DIFFERENT material,
//     not the same jokes reskinned.
//
// Runs LIVE when ANTHROPIC_API_KEY is set (real research + grading); otherwise
// runs the deterministic OFFLINE path so the demo still works with no network.
//
// Usage:
//   node services/brain/scripts/demo.mjs                       # default car + cast
//   node services/brain/scripts/demo.mjs "2006 Chrysler PT Cruiser" mama kenji abuomar
//   ANTHROPIC_API_KEY=... node services/brain/scripts/demo.mjs "2012 Nissan Juke" mama tony
//
// Writes a markdown report next to stdout for easy sharing.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Re-exec once with a roomier heap. The live path holds large web-search
// responses in memory while researching; the default heap can be tight on
// search-heavy cars. This guarantees the headroom regardless of how the demo
// is invoked, on any OS.
if (!process.env.__BRAIN_DEMO_REEXEC) {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync(
    process.execPath,
    ["--max-old-space-size=4096", fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    { stdio: "inherit", env: { ...process.env, __BRAIN_DEMO_REEXEC: "1" } }
  );
  process.exit(r.status ?? 0);
}

import { generateRoast } from "../index.js";
import { Roaster } from "@callies-universe/core";

const args = process.argv.slice(2);
const carArg = args[0] && !Roaster.roster.some((r) => r.id === args[0]) ? args.shift() : null;
const requested = args.length ? args : ["abuomar", "mama", "kenji"];
const car = parseCar(carArg) || { year: 2006, make: "Chrysler", model: "PT Cruiser" };
const live = !!process.env.ANTHROPIC_API_KEY;

const label = car.label || [car.year, car.make, car.model].filter(Boolean).join(" ");
const out = [];
const log = (s = "") => { console.log(s); out.push(s); };

// Generate first, THEN report — so the header reflects the engine that ACTUALLY
// ran (a live attempt can fall back to offline on an API error; don't claim LIVE
// when we silently degraded).
const results = [];
for (const id of requested) {
  const res = await generateRoast({
    carPhoto: { present: true },
    car,
    roasterId: id,
    context: ["brutal"],
    // Snappy proof defaults: best-of-3, one round. The brain's own defaults
    // (3 × 2 rounds) still apply in the app/server; this just keeps the demo light.
    config: live ? { candidates: 3, maxRounds: 1 } : { offline: true },
  });
  results.push(res);
}

const liveCount = results.filter((r) => r.engine === "live").length;
const engineLine =
  liveCount === results.length && live
    ? "LIVE (Claude research + grading)"
    : liveCount > 0
      ? `MIXED — ${liveCount}/${results.length} live, the rest fell back offline`
      : live
        ? "OFFLINE — the live attempt FAILED and fell back (re-run with BRAIN_DEBUG=1 to see why; common cause: invalid/missing ANTHROPIC_API_KEY)"
        : "OFFLINE (no API key — deterministic fallback)";

log(`# RoastMyRide — cross-character proof`);
log(``);
log(`**Car:** ${label}`);
log(`**Engine:** ${engineLine}`);
log(`**Characters:** ${requested.join(", ")}`);
log(``);
if (live && liveCount < results.length) {
  console.error(`\n⚠️  Live was requested but ${results.length - liveCount}/${results.length} set(s) fell back to OFFLINE. Re-run with BRAIN_DEBUG=1 for the error (most often an invalid ANTHROPIC_API_KEY).\n`);
}

// Research is shared across the cast — show it once.
const research = results[0].research;
log(`## The research that grounded these sets`);
log(``);
log(`> ${research.summary}`);
if (research.runningJokes.length) log(`\n**Running jokes:** ${research.runningJokes.join(" · ")}`);
if (research.knownProblems.length) log(`\n**Known problems:** ${research.knownProblems.join(" · ")}`);
if (research.sources.length) {
  log(`\n**Sources:**`);
  for (const s of research.sources) log(`- [${s.title}](${s.url})`);
}
log(``);

for (const res of results) {
  const g = res.grade;
  log(`## ${res.performer.name} — ${res.performer.comedicIdentity}`);
  log(``);
  log(`_${res.set.performanceNote}_`);
  log(``);
  for (const b of res.set.beats) {
    const t = b.punch && b.text.includes(b.punch)
      ? b.text.replace(b.punch, `**${b.punch}**`)
      : b.text;
    log(`- **[${b.type}]** ${t}`);
  }
  log(``);
  log(
    `**Grade** — composite ${g.composite}/10 · ${g.pass ? "✅ PASS" : "❌ did not pass"} ` +
    `(funny ${g.scores.funny}, human ${g.scores.human}, specific ${g.scores.specific}, ` +
    `edge ${g.scores.edge}, voice ${g.scores.voice}) · ${g.candidates} candidate(s), ${g.rounds} round(s)`
  );
  if (g.aiTells.length) log(`**AI-tells caught:** ${g.aiTells.join("; ")}`);
  log(`**Callie reacts:** ${res.reaction} → [${res.reactionSequence.join(", ")}]`);
  log(``);
}

// The proof: same car, different material.
log(`## Proof: same car, different sets`);
log(``);
log(`| Character | Comedic form | Headline punch |`);
log(`| --- | --- | --- |`);
for (const res of results) {
  const head = res.segments.find((s) => s.punch)?.text || res.plainText.slice(0, 40);
  log(`| ${res.performer.name} | ${res.set.performanceNote} | ${head} |`);
}
log(``);
const distinct = new Set(results.map((r) => r.plainText)).size === results.length;
log(distinct ? `✅ All ${results.length} sets are distinct material.` : `⚠️ Some sets overlap.`);

const path = new URL("../../../", import.meta.url).pathname + `brain-demo-${live ? "live" : "offline"}.md`;
try {
  writeFileSync(path, out.join("\n"));
  console.log(`\n(report written to ${path})`);
} catch { /* non-fatal */ }

function parseCar(s) {
  if (!s) return null;
  const m = s.match(/^(\d{4})\s+(\S+)\s+(.+)$/);
  if (m) return { year: Number(m[1]), make: m[2], model: m[3] };
  return { label: s };
}
