// Render a real MP4 of a PANEL ("Green Room") — brain → voice → Remotion, local.
//   ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, VOICE_*_ID, CHROMIUM_BIN required.
//   CAR="Kia K900 V8" PHOTO=live-panel-out/car.jpg node services/api/scripts/render-panel.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { generateRoast, resolvePerformer } from "@callies-universe/brain";
import { synthesizeSet } from "@callies-universe/voice";
import { renderStageVideo } from "@callies-universe/render";

const env = process.env;
if (!env.BRAIN_NO_SEARCH) env.BRAIN_NO_SEARCH = "1";
const DUO = (env.DUO || "mama,tony").split(",").map((s) => s.trim());
const CAR = env.CAR || "Kia K900 V8";
const PHOTO = env.PHOTO || "live-panel-out/car.jpg";
const OUT = env.OUT || "live-panel-out/panel-k900.mp4";
const SCALE = Number(env.SCALE) || 0.6;
const ENTRY = fileURLToPath(new URL("../../../apps/roastmyride-app/remotion/index.jsx", import.meta.url));
const CHROME = env.CHROMIUM_BIN || env.CHROME;
if (!CHROME) { console.error("set CHROMIUM_BIN"); process.exit(1); }

const photoDataUrl = `data:image/jpeg;base64,${readFileSync(PHOTO).toString("base64")}`;
const stingUrl = (p) => { try { return `data:audio/wav;base64,${readFileSync(p).toString("base64")}`; } catch { return undefined; } };
const introStingUrl = stingUrl("apps/roastmyride-app/remotion/assets/sting-intro.wav");
const outroStingUrl = stingUrl("apps/roastmyride-app/remotion/assets/sting-outro.wav");
const verdictStingUrl = stingUrl("apps/roastmyride-app/remotion/assets/sting-verdict.wav");
const whooshUrl = stingUrl("apps/roastmyride-app/remotion/assets/whoosh.wav");
const bedUrl = stingUrl("apps/roastmyride-app/remotion/assets/bed-loop.wav");

const BEAT_TYPE = { opener: "setup", setup: "setup", punchline: "punch", "act-out": "punch", callback: "punch", tag: "punch", "crowd-work": "crowd", closer: "closer" };
const splitPunch = (text, punch) => {
  if (!punch || !text.includes(punch)) return { lead: text, punch: undefined, tail: "" };
  const i = text.indexOf(punch);
  return { lead: text.slice(0, i), punch, tail: text.slice(i + punch.length) };
};

console.log(`generating panel — "${CAR}" — duo ${DUO.join(" + ")} …`);
const result = await generateRoast({
  subject: "car", format: "panel", roasterIds: DUO,
  car: { label: CAR, make: "Kia", model: "K900" },
  context: ["brutal"], config: { candidates: Number(env.CANDIDATES) || 4 },
});
const perfs = result.performers;
const idFor = (sp) => (sp === "b" ? perfs[1].id : perfs[0].id);
const nmeFor = (sp) => (sp === "b" ? perfs[1] : perfs[0]).name.replace(/[“"].*$/, "").split(" ")[0];
console.log(`engine=${result.engine} pass=${result.grade.pass} score=${result.grade.composite}`);
for (const b of result.set.beats) console.log(`  ${nmeFor(b.speaker).padEnd(7)} ${b.text}`);

const displayBeats = result.set.beats.map((b) => {
  const type = BEAT_TYPE[b.type] || "setup";
  const extra = b.speaker ? { speaker: b.speaker, performerId: idFor(b.speaker) } : {};
  if (type === "punch" || type === "closer") { const { lead, punch, tail } = splitPunch(b.text, b.punch); return { type, text: lead || b.text, punch, tail, ...extra }; }
  return { type, text: b.text, ...extra };
});

console.log("voicing per speaker (ElevenLabs)…");
const voice = await synthesizeSet(displayBeats, resolvePerformer(perfs[0].id), {});
console.log(`voice engine=${voice.engine} voiced=${voice.voiced} clips=${voice.clips.length}`);

// Trim to a social length budget: lead(2.5s) + content + tail(5.0s) ≤ TARGET_MS.
// Keep whole turns from the top until the budget is hit (min 4); the branded
// endcard cushions the cut so it never feels abrupt.
const TARGET_MS = Number(env.TARGET_MS) || 52000;
const BRANDING_MS = 2500 + 5000;
let acc = 0, keep = 0;
for (let i = 0; i < voice.clips.length; i++) {
  acc += (voice.clips[i].durationMs || 0) + 320; // + breath gap between turns
  keep = i + 1;
  if (acc + BRANDING_MS >= TARGET_MS && keep >= 4) break;
}
const beats = displayBeats.slice(0, keep);
const audio = voice.clips.slice(0, keep);
console.log(keep < displayBeats.length
  ? `trimmed to ${keep}/${displayBeats.length} turns for length (~${Math.round((acc + BRANDING_MS) / 1000)}s total)`
  : `all ${keep} turns fit (~${Math.round((acc + BRANDING_MS) / 1000)}s total)`);

const inputProps = {
  format: "panel",
  performers: perfs.map((p) => ({ id: p.id, name: p.name, tag: p.tag, register: p.register, comedicIdentity: p.comedicIdentity })),
  comedianId: perfs[0].id,
  performerName: perfs[0].name,
  subjectLabel: CAR,
  subjectPhoto: photoDataUrl,
  reaction: result.reaction,
  score: result.grade.composite,
  beats,
  audio,
  introStingUrl,
  outroStingUrl,
  verdictStingUrl,
  whooshUrl,
  bedUrl,
};

console.log(`rendering MP4 @ scale ${SCALE} (Chromium)…`);
const out = await renderStageVideo({
  entryPoint: ENTRY, compositionId: "stage", inputProps, outFile: OUT,
  browserExecutable: CHROME, scale: SCALE,
  onProgress: (p) => process.stdout.write(`\r  render ${Math.round(p * 100)}%   `),
});
console.log(`\n✓ wrote ${out}`);
