// services/api OPT-IN render smoke: actually renders a tiny MP4 through POST /render.
// Remotion needs a Chromium, so this is GATED on CHROMIUM_BIN/CHROME and is NOT in
// the default `verify` chain. Run where Chrome exists:
//
//   CHROMIUM_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
//     pnpm --filter @callies-universe/api render-smoke
import { createApiServer } from "../index.js";

const browser = process.env.CHROMIUM_BIN || process.env.CHROME;
if (!browser) {
  console.log("· api render-smoke skipped (set CHROMIUM_BIN/CHROME to run a real render)");
  process.exit(0);
}

const SPEC = {
  comedianId: "mama", performerName: "Mama Denièce", bit: "Baby, No", reaction: "savage", subjectLabel: "your ride",
  beats: [
    { type: "setup", text: "Mm-mm-MM. Baby. Come here." },
    { type: "punch", text: "This paint job is ", punch: "a cry for help", tail: "." },
  ],
  subjectPhoto: null,
};

const srv = createApiServer({ offline: true }); // silent voice, REAL render
await new Promise((r) => srv.listen(0, r));
const base = `http://localhost:${srv.address().port}`;
let ok = false;
try {
  console.log("[render-smoke] rendering 6 frames at scale 0.5 …");
  const res = await fetch(`${base}/render?frames=0-5&scale=0.5`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(SPEC),
  });
  const buf = Buffer.from(await res.arrayBuffer());
  // MP4 magic: bytes 4..8 == "ftyp"
  const vid = res.status === 200 && buf.length > 1000 && buf.toString("ascii", 4, 8) === "ftyp";
  console.log(`  ${vid ? "✓" : "✗"} POST /render → ${res.status}, ${buf.length} bytes, ftyp=${buf.toString("ascii", 4, 8)}`);

  console.log("[render-smoke] async render job (real Chrome) …");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const aStart = await fetch(`${base}/render?async=1&frames=0-3&scale=0.3`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(SPEC) });
  const { jobId } = await aStart.json();
  let st = { status: "running" };
  for (let i = 0; i < 120 && st.status === "running"; i++) { st = await (await fetch(`${base}/render/${jobId}`)).json(); if (st.status === "running") await sleep(500); }
  const aFile = await fetch(`${base}/render/${jobId}/file`);
  const aBuf = Buffer.from(await aFile.arrayBuffer());
  const asyncOk = st.status === "done" && aFile.status === 200 && aBuf.toString("ascii", 4, 8) === "ftyp";
  console.log(`  ${asyncOk ? "✓" : "✗"} async job → ${st.status}, file ${aBuf.length} bytes, ftyp=${aBuf.toString("ascii", 4, 8)}`);

  console.log("[render-smoke] rendering a poster PNG …");
  const pres = await fetch(`${base}/poster`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(SPEC) });
  const pbuf = Buffer.from(await pres.arrayBuffer());
  // PNG magic: 89 50 4E 47
  const png = pres.status === 200 && pbuf.length > 1000 && pbuf[0] === 0x89 && pbuf.toString("ascii", 1, 4) === "PNG";
  console.log(`  ${png ? "✓" : "✗"} POST /poster → ${pres.status}, ${pbuf.length} bytes, png=${pbuf[0] === 0x89}`);
  ok = vid && asyncOk && png;
} finally {
  srv.close();
}
console.log(ok ? "\n✓ api render-smoke passed" : "\n✗ api render-smoke failed");
process.exit(ok ? 0 : 1);
