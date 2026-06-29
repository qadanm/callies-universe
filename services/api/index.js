// @callies-universe/api: the roast backend.
//
// A tiny HTTP host (node:http, no framework) over the two server-side
// capabilities, so the app can turn "Save video" into one tap and play the
// reel's audio live, without ever holding a secret in the browser:
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
// it must NOT import apps/**; the Remotion entry is passed as a PATH STRING.

import http from "node:http";
import crypto from "node:crypto";
import { readFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateRoast as defaultGenerateRoast, identifyCar as defaultIdentify, analyzeConversation as defaultTranscribe, analyzeOutfit as defaultAnalyzeOutfit, analyzeRoom as defaultAnalyzeRoom, analyzeProfile as defaultAnalyzeProfile } from "@callies-universe/brain";
import { createLedger } from "./ledger.js";
import { createLimiter } from "./limiter.js";
import { logRequest, captureError } from "./observability.js";
import { synthesizeSet as defaultSynthesize } from "@callies-universe/voice";
import { renderStageVideo as defaultRender, renderStagePoster as defaultPoster } from "@callies-universe/render";

// The app's Remotion entry, resolved relative to this file so the server works
// from any cwd. Override with ROAST_REMOTION_ENTRY (a path string).
const DEFAULT_ENTRY = fileURLToPath(new URL("../../apps/roastmyride-app/remotion/index.jsx", import.meta.url));

const MAX_BODY = 96 * 1024 * 1024; // car dataUrls ride in the spec; be generous
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
  const transcribe = opts.transcribe || defaultTranscribe;
  const analyzeOutfitFn = opts.analyzeOutfit || defaultAnalyzeOutfit;
  const analyzeRoomFn = opts.analyzeRoom || defaultAnalyzeRoom;
  const analyzeProfileFn = opts.analyzeProfile || defaultAnalyzeProfile;
  const synthesize = opts.synthesize || defaultSynthesize;
  const render = opts.render || defaultRender;
  const poster = opts.poster || defaultPoster;
  const entryPoint = opts.entryPoint || process.env.ROAST_REMOTION_ENTRY || DEFAULT_ENTRY;
  const offline = opts.offline ?? !process.env.ELEVENLABS_API_KEY;
  const defaultDryRun = opts.dryRun ?? !!process.env.ROAST_RENDER_DRYRUN;
  const defaultScale = opts.scale ?? (Number(process.env.ROAST_RENDER_SCALE) || 1);
  const browserExecutable = opts.browserExecutable || process.env.CHROMIUM_BIN || process.env.CHROME || undefined;

  // Credit ledger (server source of truth) keyed by identity. Anonymous identity =
  // the device id the app sends in x-roast-identity; a real auth adapter would
  // VERIFY a token → subject (documented). Exposed on the server for the webhook (grant).
  const ledger = opts.ledger || createLedger({ file: process.env.ROAST_LEDGER_FILE, free: Number(process.env.ROAST_FREE_CREDITS) || 3 });
  const identityOf = (req) => (req.headers["x-roast-identity"] || "").toString().slice(0, 128) || null;

  // Rate limiting + cost guardrails (in-memory; Redis is the documented swap).
  // `rate` throttles all work endpoints; `cost` is a tighter cap on the EXPENSIVE
  // ones (roast + render) over a longer window. Keyed by identity (else IP).
  const rate = opts.rateLimit || createLimiter({ windowMs: Number(process.env.ROAST_RATE_WINDOW_MS) || 60000, max: Number(process.env.ROAST_RATE_MAX) || 60 });
  const cost = opts.costLimit || createLimiter({ windowMs: Number(process.env.ROAST_COST_WINDOW_MS) || 3600000, max: Number(process.env.ROAST_COST_MAX) || 60 });
  const keyOf = (req) => identityOf(req) || (req.socket && req.socket.remoteAddress) || "anon";
  const tooMany = (res, r, label) => {
    res.setHeader("Retry-After", Math.ceil(r.resetMs / 1000));
    return json(res, 429, { error: `rate limited (${label})`, retryAfterMs: r.resetMs });
  };

  // Payments: Stripe Checkout (real) behind STRIPE_SECRET_KEY, else a verifiable
  // TEST mode (no key): a simulated session a fake webhook can complete. Either
  // way, a completed payment grants credits to the ledger.
  const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  const REVENUECAT_WEBHOOK_AUTH = process.env.REVENUECAT_WEBHOOK_AUTH; // shared bearer set in the RC dashboard
  // product id → credits granted (consumables). Override with ROAST_PRODUCT_CREDITS (JSON).
  const PRODUCT_CREDITS = (() => {
    try { return JSON.parse(process.env.ROAST_PRODUCT_CREDITS); } catch { /* default below */ }
    return { rmr_credits_1: 1, rmr_credits_5: 5, rmr_credits_15: 15, rmr_credits_40: 40 };
  })();
  const PUBLIC_URL = process.env.ROAST_PUBLIC_URL || "http://localhost:5180";
  const pendingSessions = new Map(); // sessionId → { identity, credits }
  const centsOf = (price) => Math.round((parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0) * 100);

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
    // The SAME mapping the render CLI uses; keep these in lockstep.
    return v.clips.map((c) => ({ index: c.index, dataUrl: c.dataUrl, durationMs: c.durationMs, words: c.words }));
  };

  return http.createServer(async (req, res) => {
    // permissive CORS: the app is served from a different port (dev/self-host)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type, x-roast-identity");
    if (req.method === "OPTIONS") return end(res, 204, "");

    let url;
    try {
      url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    } catch {
      return json(res, 400, { error: "bad url" });
    }
    const path = url.pathname.replace(/\/+$/, "") || "/";

    // structured request log on completion
    const t0 = Date.now();
    res.on("finish", () => logRequest({ method: req.method, path, status: res.statusCode, ms: Date.now() - t0, identity: identityOf(req) }));

    try {
      if (req.method === "GET" && (path === "/" || path === "/health")) {
        return json(res, 200, { ok: true, offline, dryRun: defaultDryRun });
      }

      // Rate limit + cost guardrail on the work endpoints (keyed by identity/IP).
      if (req.method === "POST" && ["/roast", "/identify", "/transcribe", "/analyze-outfit", "/analyze-room", "/analyze-profile", "/voice", "/render", "/poster"].includes(path)) {
        const k = keyOf(req);
        const r = rate.hit(k);
        if (!r.ok) return tooMany(res, r, "per-minute");
        if (path === "/roast" || path === "/render") {
          const c = cost.hit(k);
          if (!c.ok) return tooMany(res, c, "quota");
        }
      }

      // Credit ledger
      if (path === "/credits" && (req.method === "GET" || req.method === "POST")) {
        const id = identityOf(req);
        if (!id) return json(res, 400, { error: "missing x-roast-identity" });
        return json(res, 200, { credits: ledger.balance(id) });
      }
      if (req.method === "POST" && path === "/credits/consume") {
        const id = identityOf(req);
        if (!id) return json(res, 400, { error: "missing x-roast-identity" });
        const r = ledger.consume(id, 1);
        if (!r.ok) return json(res, 402, { error: "no credits", credits: r.credits });
        return json(res, 200, { credits: r.credits });
      }

      // Payments
      if (req.method === "GET" && path === "/entitlement") {
        const id = identityOf(req);
        if (!id) return json(res, 400, { error: "missing x-roast-identity" });
        return json(res, 200, { ok: true, credits: ledger.balance(id) });
      }
      if (req.method === "POST" && path === "/checkout") {
        const id = identityOf(req);
        const body = await readJson(req);
        const credits = Math.max(1, body.credits | 0);
        const sessionId = `cs_${Date.now()}_${tmpCounter++}`;
        pendingSessions.set(sessionId, { identity: id, credits });
        if (STRIPE_KEY) {
          // Real Stripe Checkout session via the REST API (no SDK needed).
          const form = new URLSearchParams({
            mode: "payment",
            "line_items[0][quantity]": "1",
            "line_items[0][price_data][currency]": "usd",
            "line_items[0][price_data][unit_amount]": String(centsOf(body.price)),
            "line_items[0][price_data][product_data][name]": `${credits} RoastMyRide credits`,
            success_url: `${PUBLIC_URL}/#/home`,
            cancel_url: `${PUBLIC_URL}/#/credits`,
            "metadata[identity]": id || "",
            "metadata[credits]": String(credits),
          });
          const sres = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: { authorization: `Bearer ${STRIPE_KEY}`, "content-type": "application/x-www-form-urlencoded" },
            body: form,
          });
          if (!sres.ok) return json(res, 502, { error: `stripe ${sres.status}` });
          const session = await sres.json();
          return json(res, 200, { sessionId: session.id, url: session.url });
        }
        return json(res, 200, { sessionId, url: null, testMode: true }); // verifiable offline
      }
      if (req.method === "POST" && path === "/webhook") {
        const raw = await readRaw(req);
        const parsed = JSON.parse(raw || "{}");

        // RevenueCat (Apple/Play IAP, consumables), shape: { event: { type, app_user_id, product_id } }.
        if (parsed && parsed.event && parsed.event.type) {
          if (REVENUECAT_WEBHOOK_AUTH && req.headers.authorization !== `Bearer ${REVENUECAT_WEBHOOK_AUTH}`) {
            return json(res, 401, { error: "bad auth" });
          }
          const e = parsed.event;
          const credits = PRODUCT_CREDITS[e.product_id];
          if ((e.type === "NON_RENEWING_PURCHASE" || e.type === "INITIAL_PURCHASE") && credits && e.app_user_id) {
            const bal = ledger.grant(e.app_user_id, credits);
            return json(res, 200, { ok: true, credits: bal });
          }
          return json(res, 200, { ok: true, ignored: true });
        }

        // Stripe (web checkout)
        let event;
        if (STRIPE_WEBHOOK_SECRET) {
          if (!verifyStripeSig(raw, req.headers["stripe-signature"], STRIPE_WEBHOOK_SECRET)) {
            return json(res, 400, { error: "bad signature" });
          }
          event = parsed;
        } else {
          event = parsed; // TEST mode: accept { sessionId } (or a stripe-shaped event)
        }
        const sessionId = event?.data?.object?.id || event.sessionId;
        const meta = event?.data?.object?.metadata;
        const pending = pendingSessions.get(sessionId);
        const identity = (meta && meta.identity) || (pending && pending.identity);
        const credits = (meta && Number(meta.credits)) || (pending && pending.credits);
        if (identity && credits) {
          const bal = ledger.grant(identity, credits);
          pendingSessions.delete(sessionId);
          return json(res, 200, { ok: true, credits: bal });
        }
        return json(res, 200, { ok: true, ignored: true });
      }

      if (req.method === "POST" && path === "/roast") {
        const input = await readJson(req); // sanitized RoastInput (no photo blobs)
        // Single needs roasterId; the panel ("Green Room") needs roasterIds[]. Accept either.
        const hasDuo = Array.isArray(input?.roasterIds) && input.roasterIds.length >= 2;
        if (!input || (!input.roasterId && !hasDuo)) {
          return json(res, 400, { error: "roasterId (single) or roasterIds[2] (panel) is required" });
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

      if (req.method === "POST" && path === "/transcribe") {
        const body = await readJson(req);
        if (url.searchParams.get("dryRun") === "1") {
          return json(res, 200, { dryRun: true, hasImage: !!body.imageDataUrl });
        }
        const conversation = await transcribe({ imageDataUrl: body.imageDataUrl });
        return json(res, 200, { conversation });
      }

      if (req.method === "POST" && path === "/analyze-outfit") {
        const body = await readJson(req);
        if (url.searchParams.get("dryRun") === "1") {
          return json(res, 200, { dryRun: true, hasImage: !!body.imageDataUrl });
        }
        const outfit = await analyzeOutfitFn({ imageDataUrl: body.imageDataUrl });
        return json(res, 200, { outfit });
      }

      if (req.method === "POST" && path === "/analyze-room") {
        const body = await readJson(req);
        if (url.searchParams.get("dryRun") === "1") {
          return json(res, 200, { dryRun: true, hasImage: !!body.imageDataUrl });
        }
        const room = await analyzeRoomFn({ imageDataUrl: body.imageDataUrl });
        return json(res, 200, { room });
      }

      if (req.method === "POST" && path === "/analyze-profile") {
        const body = await readJson(req);
        if (url.searchParams.get("dryRun") === "1") {
          return json(res, 200, { dryRun: true, hasImage: !!body.imageDataUrl });
        }
        const profile = await analyzeProfileFn({ imageDataUrl: body.imageDataUrl });
        return json(res, 200, { profile });
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
      captureError(err, { path, method: req.method });
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

function readRaw(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error("payload too large")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// Verify a Stripe webhook signature ("t=...,v1=...") via HMAC-SHA256 of `t.payload`.
function verifyStripeSig(rawBody, sigHeader, secret) {
  try {
    const parts = Object.fromEntries(String(sigHeader || "").split(",").map((kv) => kv.split("=")));
    if (!parts.t || !parts.v1) return false;
    const expected = crypto.createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(parts.v1);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
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
