// @callies-universe/api — the roast backend.
//
// A tiny HTTP host (node:http, no framework) over the two server-side
// capabilities, so the app can turn "Save video" into one tap and play the
// reel's audio live — without ever holding a secret in the browser:
//
//   POST /voice   { comedianId, performerName, beats }      → SynthesizedSet (clips JSON)
//   POST /render  <buildRenderSpec output> [?dryRun&frames&scale] → video/mp4 (or the
//                                                            assembled inputProps as JSON
//                                                            when dryRun, for offline tests)
//   GET  /health                                            → { ok: true }
//
// Keys (ELEVENLABS_API_KEY, VOICE_<ID>_ID, ANTHROPIC_*) stay here. The app reaches
// this via VITE_ROAST_API; when that's unset the app falls back to its offline
// behavior, so the offline build/e2e never depend on this server.
//
// Layer rule: this service may import voice + render (services→services is allowed);
// it must NOT import apps/** — the Remotion entry is passed as a PATH STRING.

import http from "node:http";
import { readFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateRoast as defaultGenerateRoast, identifyCar as defaultIdentify } from "@callies-universe/brain";
import { synthesizeSet as defaultSynthesize } from "@callies-universe/voice";
import { renderStageVideo as defaultRender, renderStagePoster as defaultPoster } from "@callies-universe/render";

// The app's Remotion entry, resolved relative to this file so the server works
// from any cwd. Override with ROAST_REMOTION_ENTRY (a path string).
const DEFAULT_ENTRY = fileURLToPath(new URL("../../apps/roastmyride-app/remotion/index.jsx", import.meta.url));

const MAX_BODY = 96 * 1024 * 1024; // car/profile dataUrls ride in the spec; be generous
let tmpCounter = 0;

/**
 * Build the HTTP server. Dependencies are injectable for testing.
 * @param {object} [opts]
 * @param {Function} [opts.synthesize]  synthesizeSet override
 * @param {Function} [opts.render]      renderStageVideo override
 * @param {string}   [opts.entryPoint]  Remotion entry path
 * @param {boolean}  [opts.offline]     force silent voice (default: no ELEVENLABS_API_KEY)
 * @param {boolean}  [opts.dryRun]      /render returns inputProps JSON instead of an MP4
 * @param {number}   [opts.scale]       default render scale
 * @param {string}   [opts.browserExecutable]
 * @returns {import("node:http").Server}
 */
export function createApiServer(opts = {}) {
  const generateRoast = opts.generateRoast || defaultGenerateRoast;
  const identify = opts.identify || defaultIdentify;
  const synthesize = opts.synthesize || defaultSynthesize;
  const render = opts.render || defaultRender;
  const poster = opts.poster || defaultPoster;
  const entryPoint = opts.entryPoint || process.env.ROAST_REMOTION_ENTRY || DEFAULT_ENTRY;
  const offline = opts.offline ?? !process.env.ELEVENLABS_API_KEY;
  const defaultDryRun = opts.dryRun ?? !!process.env.ROAST_RENDER_DRYRUN;
  const defaultScale = opts.scale ?? (Number(process.env.ROAST_RENDER_SCALE) || 1);
  const browserExecutable = opts.browserExecutable || process.env.CHROMIUM_BIN || process.env.CHROME || undefined;

  // Async render jobs: POST /render?async=1 → { jobId }; progress streams over
  // GET /render/:id/events (SSE); the MP4 is fetched from GET /render/:id/file.
  // Storage is local-disk here (the tmp file); ROAST_STORAGE=s3 is the documented
  // seam to upload + serve from object storage instead.
  const jobs = new Map();
  const startRenderJob = (spec, { scale, frameRange }) => {
    const id = `job_${process.pid}_${Date.now()}_${tmpCounter++}`;
    const job = { id, status: "running", progress: 0, outFile: null, error: null };
    jobs.set(id, job);
    (async () => {
      try {
        spec.audio = await synthForSpec(spec);
        const outFile = join(tmpdir(), `roast-${id}.mp4`);
        await render({ entryPoint, inputProps: spec, outFile, browserExecutable, scale, frameRange, onProgress: (p) => { job.progress = p; } });
        job.outFile = outFile;
        job.progress = 1;
        job.status = "done";
      } catch (e) {
        job.status = "error";
        job.error = (e && e.message) || "render failed";
        console.error(`[api] render job ${id} failed:`, job.error);
      }
    })();
    return id;
  };

  const voiceConfig = () => ({ offline });
  const synthForSpec = async (spec) => {
    const v = await synthesize(
      spec.beats || [],
      { id: spec.comedianId, name: spec.performerName },
      voiceConfig()
    );
    // The SAME mapping the render CLI uses — keep these in lockstep.
    return v.clips.map((c) => ({ index: c.index, dataUrl: c.dataUrl, durationMs: c.durationMs, words: c.words }));
  };

  return http.createServer(async (req, res) => {
    // permissive CORS — the app is served from a different port (dev/self-host)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    if (req.method === "OPTIONS") return end(res, 204, "");

    let url;
    try {
      url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    } catch {
      return json(res, 400, { error: "bad url" });
    }
    const path = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (req.method === "GET" && (path === "/" || path === "/health")) {
        return json(res, 200, { ok: true, offline, dryRun: defaultDryRun });
      }

      if (req.method === "POST" && path === "/roast") {
        const input = await readJson(req); // sanitized RoastInput (no photo blobs)
        if (!input || !input.roasterId) {
          return json(res, 400, { error: "roasterId is required" });
        }
        const result = await generateRoast(input); // LIVE with ANTHROPIC_API_KEY, else offline
        return json(res, 200, result);
      }

      if (req.method === "POST" && path === "/identify") {
        const body = await readJson(req);
        // dryRun is a render/Chrome concern; identify is a model call (offline → null),
        // so only honor the explicit query flag here, not the server default.
        if (url.searchParams.get("dryRun") === "1") {
          return json(res, 200, { dryRun: true, hasImage: !!body.imageDataUrl });
        }
        const car = await identify({ imageDataUrl: body.imageDataUrl }); // null without a key
        return json(res, 200, { car });
      }

      if (req.method === "POST" && path === "/voice") {
        const body = await readJson(req);
        if (!Array.isArray(body.beats) || body.beats.length === 0) {
          return json(res, 400, { error: "beats must be a non-empty array" });
        }
        const v = await synthesize(
          body.beats || [],
          { id: body.comedianId, name: body.performerName },
          voiceConfig()
        );
        return json(res, 200, v);
      }

      // Async render job: returns { jobId } immediately; progress via SSE, file via /file.
      if (req.method === "POST" && path === "/render" && url.searchParams.get("async") === "1") {
        const spec = await readJson(req);
        if (!Array.isArray(spec.beats) || spec.beats.length === 0) {
          return json(res, 400, { error: "spec.beats must be a non-empty array" });
        }
        const scale = Number(url.searchParams.get("scale")) || defaultScale;
        const framesParam = url.searchParams.get("frames");
        const frameRange = framesParam ? framesParam.split("-").map((n) => Number(n)) : undefined;
        const jobId = startRenderJob(spec, { scale, frameRange });
        return json(res, 202, { jobId });
      }

      // Job status / progress (SSE) / file
      const jobMatch = req.method === "GET" && path.match(/^\/render\/([^/]+)(\/events|\/file)?$/);
      if (jobMatch) {
        const job = jobs.get(jobMatch[1]);
        const sub = jobMatch[2];
        if (!job) return json(res, 404, { error: "no such job" });

        if (sub === "/file") {
          if (job.status !== "done" || !job.outFile) return json(res, 409, { error: `job ${job.status}` });
          const buf = readFileSync(job.outFile);
          res.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": buf.length, "Content-Disposition": "attachment; filename=\"roast.mp4\"", "Access-Control-Allow-Origin": "*" });
          return res.end(buf);
        }

        if (sub === "/events") {
          res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive", "Access-Control-Allow-Origin": "*" });
          const send = (o) => res.write(`data: ${JSON.stringify(o)}\n\n`);
          send({ status: job.status, progress: job.progress });
          const iv = setInterval(() => {
            if (job.status === "done") { send({ status: "done", progress: 1, fileUrl: `/render/${job.id}/file` }); clearInterval(iv); res.end(); }
            else if (job.status === "error") { send({ status: "error", error: job.error }); clearInterval(iv); res.end(); }
            else send({ status: "running", progress: job.progress });
          }, 250);
          req.on("close", () => clearInterval(iv));
          return undefined;
        }

        return json(res, 200, { id: job.id, status: job.status, progress: job.progress, error: job.error, ready: job.status === "done" });
      }

      if (req.method === "POST" && path === "/render") {
        const spec = await readJson(req);
        if (!Array.isArray(spec.beats) || spec.beats.length === 0) {
          return json(res, 400, { error: "spec.beats must be a non-empty array" });
        }
        spec.audio = await synthForSpec(spec);

        const dryRun = defaultDryRun || url.searchParams.get("dryRun") === "1";
        if (dryRun) return json(res, 200, { dryRun: true, inputProps: spec });

        const scale = Number(url.searchParams.get("scale")) || defaultScale;
        const framesParam = url.searchParams.get("frames");
        const frameRange = framesParam ? framesParam.split("-").map((n) => Number(n)) : undefined;

        const outFile = join(tmpdir(), `roast-api-${process.pid}-${Date.now()}-${tmpCounter++}.mp4`);
        let lastPct = -1;
        const renderT0 = Date.now();
        await render({
          entryPoint,
          inputProps: spec,
          outFile,
          browserExecutable,
          scale,
          frameRange,
          onProgress: (p) => {
            const pct = Math.round(p * 100);
            if (pct !== lastPct && pct % 10 === 0) {
              lastPct = pct;
              console.log(`[api] render ${pct}%`);
            }
          },
        });

        console.log(`[api] render done in ${((Date.now() - renderT0) / 1000).toFixed(1)}s`);
        const buf = readFileSync(outFile);
        try { unlinkSync(outFile); } catch { /* best-effort cleanup */ }
        const name = `roastmyride-${String(spec.bit || "set").replace(/\W+/g, "-").toLowerCase()}.mp4`;
        res.writeHead(200, {
          "Content-Type": "video/mp4",
          "Content-Length": buf.length,
          "Content-Disposition": `attachment; filename="${name}"`,
          "Access-Control-Allow-Origin": "*",
        });
        return res.end(buf);
      }

      if (req.method === "POST" && path === "/poster") {
        const spec = await readJson(req); // no audio needed for a still
        if (!Array.isArray(spec.beats) || spec.beats.length === 0) {
          return json(res, 400, { error: "spec.beats must be a non-empty array" });
        }
        const dryRun = defaultDryRun || url.searchParams.get("dryRun") === "1";
        const at = Number(url.searchParams.get("at")) || 0.5;
        if (dryRun) return json(res, 200, { dryRun: true, at, inputProps: spec });

        const outFile = join(tmpdir(), `roast-poster-${process.pid}-${Date.now()}-${tmpCounter++}.png`);
        await poster({ entryPoint, inputProps: spec, outFile, browserExecutable, at });
        const buf = readFileSync(outFile);
        try { unlinkSync(outFile); } catch { /* best-effort */ }
        const name = `roastmyride-${String(spec.bit || "set").replace(/\W+/g, "-").toLowerCase()}.png`;
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": buf.length,
          "Content-Disposition": `attachment; filename="${name}"`,
          "Access-Control-Allow-Origin": "*",
        });
        return res.end(buf);
      }

      return json(res, 404, { error: "not found" });
    } catch (err) {
      console.error(`[api] ${req.method} ${path} failed:`, (err && err.message) || err);
      return json(res, 500, { error: (err && err.message) || "internal error" });
    }
  });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (e) {
        reject(new Error("invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function json(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(body);
}

function end(res, status, body) {
  res.writeHead(status);
  res.end(body);
}
