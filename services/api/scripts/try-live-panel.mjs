// Try the LIVE Panel ("Green Room") end to end. Paste your keys, run this.
//
//   ANTHROPIC_API_KEY=...  (required: the comedy brain)
//   ELEVENLABS_API_KEY=... (optional: real voices; omit → silent timing only)
//   VOICE_DEFAULT_ID=...   (an ElevenLabs voiceId; or per-comic VOICE_MAMA_ID etc.)
//
//   node services/api/scripts/try-live-panel.mjs
//
// Knobs (env): SUBJECT=car|texts  DUO=mama,tony  CAR="2007 PT Cruiser"
//              CONVO="Them: wyd\nMe: ..."  HEAT=brutal  CANDIDATES=2  BRAIN_NO_SEARCH=1
import { writeFileSync, mkdirSync } from "node:fs";
import { generateRoast, resolvePerformer } from "@callies-universe/brain";
import { synthesizeSet } from "@callies-universe/voice";

const env = process.env;
const SUBJECT = env.SUBJECT || "car";
const DUO = (env.DUO || "mama,tony").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 2);
const HEAT = (env.HEAT || "brutal").split(",").map((s) => s.trim()).filter(Boolean);
const CANDIDATES = Number(env.CANDIDATES) || 2;
const OUT = "live-panel-out";

const SAMPLE_CONVO =
  "Them: heyy\nMe: hey! how was your weekend?\nMe: did you end up going to that thing?\n" +
  "(Read 9:41 AM)\n... (3 days later) ...\nThem: lol sorry just saw this\nThem: k\nMe: ...want to grab food sometime?\nThem: maybe";

const hr = (s) => console.log("\n" + "─".repeat(64) + (s ? `  ${s}` : ""));
const first = (n) => String(n || "").replace(/[“"].*$/, "").split(" ")[0];

if (!env.ANTHROPIC_API_KEY) {
  console.log("⚠  No ANTHROPIC_API_KEY, so this will run the OFFLINE (curated) panel, not the live brain.");
}

// --- Build the input ---
const input = {
  subject: SUBJECT,
  format: "panel",
  roasterIds: DUO,
  context: HEAT,
  config: { candidates: CANDIDATES },
};
if (SUBJECT === "car") input.car = env.CAR ? { label: env.CAR } : null; // null → brain's default car
if (SUBJECT === "texts") input.conversation = env.CONVO || SAMPLE_CONVO;

console.log(`Roasting subject="${SUBJECT}"  duo=[${DUO.join(", ")}]  heat=[${HEAT.join(", ")}]  candidates=${CANDIDATES}`);
if (SUBJECT === "texts") console.log("conversation:\n  " + input.conversation.replace(/\n/g, "\n  "));

// --- Generate the panel ---
const t0 = Date.now();
const result = await generateRoast(input);
const ms = Date.now() - t0;

hr("THE PANEL");
const names = (result.performers || []).map((p) => p.name);
console.log(`engine: ${result.engine}${result.degraded ? " (degraded → offline fallback)" : ""}  |  format: ${result.format}`);
console.log(`cast:   ${names.join("  vs  ")}`);
console.log(`bit:    "${result.set.title}"\n`);
const idName = (sp) => first((result.performers || [])[sp === "b" ? 1 : 0]?.name);
for (const b of result.set.beats) {
  const who = (idName(b.speaker) || b.speaker || "?").padEnd(9);
  console.log(`  ${who} ${b.text}${b.punch ? `   («${b.punch}»)` : ""}`);
}

hr("GRADE (anti-cringe bar)");
const g = result.grade;
console.log(`pass: ${g.pass}  composite: ${g.composite}  candidates: ${g.candidates}  rounds: ${g.rounds}`);
console.log(`scores: ${Object.entries(g.scores).map(([k, v]) => `${k} ${v}`).join("  ")}`);
if (g.aiTells?.length) console.log(`AI-tells: ${g.aiTells.map((t) => `${t.severity}:${t.note}`).join(" | ")}`);
console.log(`time: ${ms}ms  |  tokens: ${result.usage?.tokensIn || 0} in / ${result.usage?.tokensOut || 0} out  |  est. cost: $${result.cost?.usd ?? 0}`);

// --- Voice each turn in ITS speaker's voice (if a key is set) ---
hr("VOICE");
const voiceBeats = result.set.beats.map((b) => ({
  type: b.type,
  text: b.text, // full line only (no punch re-add → no duplication)
  performerId: b.speaker === "b" ? DUO[1] : DUO[0],
}));
const voice = await synthesizeSet(voiceBeats, resolvePerformer(DUO[0]), {});
console.log(`engine: ${voice.engine}  |  voiced: ${voice.voiced}  |  clips: ${voice.clips.length}  |  chars: ${voice.charCount}`);
if (!voice.voiced) {
  console.log("→ silent (set ELEVENLABS_API_KEY + VOICE_DEFAULT_ID or VOICE_<COMIC>_ID to hear real voices).");
} else {
  mkdirSync(OUT, { recursive: true });
  voice.clips.forEach((c, i) => {
    const m = /^data:([^;]+);base64,(.*)$/.exec(c.dataUrl) || [];
    const ext = (m[1] || "audio/wav").includes("mpeg") ? "mp3" : "wav";
    const who = voiceBeats[i].performerId;
    const file = `${OUT}/turn-${String(i + 1).padStart(2, "0")}-${who}.${ext}`;
    writeFileSync(file, Buffer.from(m[2] || "", "base64"));
    console.log(`  ${file}  (${who}, ${Math.round(c.durationMs)}ms)`);
  });
  console.log(`\n→ wrote ${voice.clips.length} clips to ./${OUT}/. Play them in order to hear the back-and-forth.`);
}

hr();
console.log(result.engine === "live"
  ? "✓ LIVE panel generated. This is the real two-comic dialogue the app produces."
  : "Ran OFFLINE (no ANTHROPIC_API_KEY). Set the key to see the live brain write it.");
