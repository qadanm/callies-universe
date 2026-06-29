// LIVE end-to-end test of the exact pipeline the app uses, against a real
// services/api server with REAL keys (Anthropic + ElevenLabs) + Chromium.
//   set -a; source ~/callies-keys.env; set +a
//   CHROMIUM_BIN=... PHOTO=live-panel-out/car.jpg node services/api/scripts/live-pipeline-test.mjs
//
// Walks: POST /identify -> POST /roast -> POST /voice -> POST /render?async=1 (SSE) ->
// GET /render/:id/file -> writes the MP4. This is the chain Reveal.jsx drives live.
import { readFileSync, writeFileSync } from "node:fs";
import { createApiServer } from "../index.js";

const env = process.env;
const PHOTO = env.PHOTO || "live-panel-out/car.jpg";
const OUT = env.OUT || "live-panel-out/live-pipeline.mp4";
const DUO = (env.DUO || "mama,tony").split(",").map((s) => s.trim());
const SCALE = Number(env.SCALE) || 0.5;
if (!env.CHROMIUM_BIN && !env.CHROME) { console.error("set CHROMIUM_BIN"); process.exit(1); }
if (!env.ANTHROPIC_API_KEY) console.warn("! no ANTHROPIC_API_KEY — identify/roast will be offline");
if (!env.ELEVENLABS_API_KEY) console.warn("! no ELEVENLABS_API_KEY — voice will be silent");

const photoDataUrl = `data:image/jpeg;base64,${readFileSync(PHOTO).toString("base64")}`;
const srv = createApiServer({}); // LIVE: real identify/roast/voice + real render
await new Promise((r) => srv.listen(0, r));
const base = `http://localhost:${srv.address().port}`;
const post = async (p, body) => fetch(`${base}${p}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const t0 = Date.now();
const ms = () => `${((Date.now() - t0) / 1000).toFixed(1)}s`;
let ok = true;
const step = (cond, label, extra = "") => { ok = ok && cond; console.log(`  ${cond ? "✓" : "✗"} ${label}${extra ? " — " + extra : ""}  [${ms()}]`); };

try {
  // 1) IDENTIFY (car photo -> make/model, vision)
  console.log("[1/4] POST /identify …");
  const idRes = await post("/identify", { imageDataUrl: photoDataUrl });
  const car = await idRes.json();
  step(idRes.status === 200, "identify", car && car.car ? JSON.stringify(car.car) : JSON.stringify(car));
  const carObj = (car && car.car) || { make: "Kia", model: "K900" };

  // 2) ROAST (panel)
  console.log("[2/4] POST /roast (panel) …");
  const rRes = await post("/roast", { subject: "car", format: "panel", roasterIds: DUO, car: carObj, context: ["brutal"], config: { candidates: 3 } });
  const roast = await rRes.json();
  const perfs = roast.performers || [];
  step(rRes.status === 200 && roast.set && roast.set.beats && roast.set.beats.length > 0,
    "roast", `engine=${roast.engine} pass=${roast.grade && roast.grade.pass} score=${roast.grade && roast.grade.composite} turns=${roast.set && roast.set.beats && roast.set.beats.length}`);

  // build display beats exactly like the app's standup adapter (panel speaker mapping)
  const BEAT_TYPE = { opener: "setup", setup: "setup", punchline: "punch", "act-out": "punch", callback: "punch", tag: "punch", "crowd-work": "crowd", closer: "closer" };
  const splitPunch = (text, punch) => { if (!punch || !text.includes(punch)) return { lead: text, punch: undefined, tail: "" }; const i = text.indexOf(punch); return { lead: text.slice(0, i), punch, tail: text.slice(i + punch.length) }; };
  const idFor = (sp) => (sp === "b" ? perfs[1]?.id : perfs[0]?.id);
  const beats = (roast.set.beats || []).map((b) => {
    const type = BEAT_TYPE[b.type] || "setup";
    const extra = b.speaker ? { speaker: b.speaker, performerId: idFor(b.speaker) } : {};
    if (type === "punch" || type === "closer") { const { lead, punch, tail } = splitPunch(b.text, b.punch); return { type, text: lead || b.text, punch, tail, ...extra }; }
    return { type, text: b.text, ...extra };
  });

  // 3) VOICE (the per-beat audio the live preview uses)
  console.log("[3/4] POST /voice …");
  const vRes = await post("/voice", { comedianId: perfs[0]?.id || roast.roasterId, performerName: perfs[0]?.name || roast.roasterName, beats });
  const voice = await vRes.json();
  step(vRes.status === 200 && voice.clips && voice.clips.length === beats.length,
    "voice", `engine=${voice.engine} voiced=${voice.voiced} clips=${voice.clips && voice.clips.length}`);

  if (env.SKIP_RENDER) { console.log("[4/4] render — SKIPPED (SKIP_RENDER=1)"); throw { __skip: true }; }
  // 4) RENDER (async, server voices during render) — the exact Save-video path
  console.log("[4/4] POST /render?async=1 (real Chromium, SSE) …");
  const spec = {
    comedianId: roast.roasterId, performerName: roast.roasterName || "the comic",
    bit: (roast.set && roast.set.title) || "set", reaction: roast.reaction,
    subjectLabel: carObj.label || [carObj.year, carObj.make, carObj.model].filter(Boolean).join(" ") || "your ride",
    beats, subjectPhoto: photoDataUrl,
    format: roast.format || "panel", performers: roast.performers || undefined,
    score: (roast.grade && roast.grade.composite) || undefined,
  };
  const aStart = await post(`/render?async=1&scale=${SCALE}`, spec);
  const { jobId } = await aStart.json();
  const sleep = (n) => new Promise((r) => setTimeout(r, n));
  let st = { status: "running" };
  for (let i = 0; i < 600 && (st.status === "running" || st.status === "queued"); i++) {
    st = await (await fetch(`${base}/render/${jobId}`)).json();
    if (st.status === "running" || st.status === "queued") { if (i % 8 === 0) console.log(`     … ${st.status} ${Math.round((st.progress || 0) * 100)}%  [${ms()}]`); await sleep(500); }
  }
  const fRes = await fetch(`${base}/render/${jobId}/file`);
  const buf = Buffer.from(await fRes.arrayBuffer());
  const isMp4 = fRes.status === 200 && buf.length > 5000 && buf.toString("ascii", 4, 8) === "ftyp";
  if (isMp4) writeFileSync(OUT, buf);
  step(st.status === "done" && isMp4, "render", `${st.status}, ${(buf.length / 1e6).toFixed(2)}MB -> ${OUT}`);
} catch (e) {
  if (!(e && e.__skip)) { ok = false; console.error("✗ threw:", e.message); }
} finally {
  srv.close();
}
console.log(ok ? `\n✓ LIVE pipeline passed (${ms()})` : `\n✗ LIVE pipeline FAILED (${ms()})`);
process.exit(ok ? 0 : 1);
