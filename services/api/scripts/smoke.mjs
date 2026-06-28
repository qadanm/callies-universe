// services/api offline smoke — boots the server on an ephemeral port with NO key,
// NO network, NO Chrome assumption, and asserts the HTTP wiring of both
// capabilities. Joins `pnpm verify`.
//
//   /voice            → offline silent clips (the voice service integrated over HTTP)
//   /render?dryRun=1  → the assembled inputProps incl. audio (proves voice→render
//                       wiring without invoking Remotion / needing Chrome)
import { createApiServer } from "../index.js";

let failures = 0;
const check = (cond, label) => {
  console.log(`  ${cond ? "✓" : "✗"} ${label}`);
  if (!cond) failures++;
};

const BEATS = [
  { type: "setup", text: "Mm-mm-MM. Baby. Come here." },
  { type: "crowd", text: "You see this paint? You SEE it?" },
  { type: "punch", text: "This paint job is ", punch: "a cry for help", tail: ", and I'm answering." },
  { type: "closer", text: "I say this with love… ", punch: "no.", tail: "" },
];
const SPEC = { comedianId: "mama", performerName: "Mama Denièce", bit: "Baby, No", reaction: "savage", carLabel: "your ride", beats: BEATS, carPhoto: null, profile: null };

function isWav(dataUrl) {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:audio/wav")) return false;
  const b = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  return b.length > 44 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WAVE";
}

const post = async (base, path, body) => {
  const res = await fetch(`${base}${path}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, json: await res.json() };
};

console.log("services/api offline smoke\n");

// offline voice (no key) + dryRun render (no Chrome)
const srv = createApiServer({ offline: true, dryRun: true });
await new Promise((r) => srv.listen(0, r));
const base = `http://localhost:${srv.address().port}`;

try {
  // health
  const health = await (await fetch(`${base}/health`)).json();
  check(health.ok === true, "GET /health → { ok: true }");

  // POST /roast — the brain runs server-side (offline here with no key)
  const roast = await post(base, "/roast", { carPhoto: { present: true }, car: { year: 2006, make: "Chrysler", model: "PT Cruiser" }, roasterId: "mama", context: ["brutal"] });
  check(roast.status === 200, "POST /roast → 200");
  check(roast.json && roast.json.engine === "offline", "roast is offline with no ANTHROPIC key");
  check(roast.json.set && Array.isArray(roast.json.set.beats) && roast.json.set.beats.length >= 3, "roast returns a structured set");
  check(roast.json.roasterId === "mama" && roast.json.grade, "roast carries roasterId + grade");
  const badRoast = await post(base, "/roast", { context: [] });
  check(badRoast.status === 400, "POST /roast without roasterId → 400");

  // POST /voice
  const voice = await post(base, "/voice", { comedianId: "mama", performerName: "Mama Denièce", beats: BEATS });
  check(voice.status === 200, "POST /voice → 200");
  check(voice.json.engine === "offline" && voice.json.voiced === false, "voice is offline/silent with no key");
  check(Array.isArray(voice.json.clips) && voice.json.clips.length === BEATS.length, `one clip per beat (${voice.json.clips?.length})`);
  check(voice.json.clips.every((c) => isWav(c.dataUrl)), "every clip is a valid RIFF/WAVE data URL");
  check(voice.json.durationsMs.every((d) => d > 0), "every clip has a positive duration");

  // POST /render?dryRun — proves voice→render wiring without Remotion/Chrome
  const dry = await post(base, "/render?dryRun=1", SPEC);
  check(dry.status === 200, "POST /render?dryRun=1 → 200");
  check(dry.json.dryRun === true && !!dry.json.inputProps, "dryRun returns assembled inputProps");
  const audio = dry.json.inputProps.audio;
  check(Array.isArray(audio) && audio.length === BEATS.length, `inputProps.audio built from voice (${audio?.length} clips)`);
  check(audio.every((a) => typeof a.dataUrl === "string" && a.durationMs > 0), "each audio entry has dataUrl + durationMs");
  check(dry.json.inputProps.comedianId === "mama" && Array.isArray(dry.json.inputProps.beats), "spec passed through intact");

  // POST /poster?dryRun — proves the poster wiring without Remotion/Chrome
  const poster = await post(base, "/poster?dryRun=1", SPEC);
  check(poster.status === 200 && poster.json.dryRun === true, "POST /poster?dryRun=1 → 200 dryRun");
  check(typeof poster.json.at === "number" && !!poster.json.inputProps, "poster dryRun returns frame fraction + inputProps");

  // input validation — empty beats → 400 (not a blank reel)
  const bad = await post(base, "/render", { comedianId: "mama", beats: [] });
  check(bad.status === 400, "POST /render with empty beats → 400");
  const badV = await post(base, "/voice", { comedianId: "mama", beats: [] });
  check(badV.status === 400, "POST /voice with empty beats → 400");

  // 404
  const nf = await fetch(`${base}/nope`, { method: "POST" });
  check(nf.status === 404, "unknown route → 404");
} finally {
  srv.close();
}

console.log(`\n${failures === 0 ? "✓ api offline smoke passed" : `✗ ${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
