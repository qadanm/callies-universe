// Env-gated client for @callies-universe/api (the roast backend).
//
// VITE_ROAST_API is the base URL of a running services/api server. When it is
// UNSET — dev, CI, e2e, and any build without it — hasRoastApi() is false and every
// caller falls back to today's behavior (Save downloads the render spec; the live
// reel stays silent). So the offline build/e2e never depend on a server.
//
// These throw on a non-2xx / network error; callers catch and fall back.
const BASE = import.meta.env.VITE_ROAST_API;

export const hasRoastApi = () => !!BASE;

// fetch with an abort timeout, so a hung/slow backend rejects (callers then fall
// back) instead of stranding a screen forever.
function fetchT(url, opts = {}, ms = 30000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return fetch(url, { ...opts, signal: ctl.signal }).finally(() => clearTimeout(t));
}

/** POST the car photo → an identified { year, make, model, label } or null (vision). */
export async function identifyCarViaApi(imageDataUrl) {
  const res = await fetchT(`${BASE}/identify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ imageDataUrl }),
  }, 25000);
  if (!res.ok) throw new Error(`identify ${res.status}`);
  const j = await res.json();
  return j.car || null;
}

/** POST a conversation screenshot → the transcript string or null (vision). */
export async function transcribeViaApi(imageDataUrl) {
  const res = await fetchT(`${BASE}/transcribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ imageDataUrl }),
  }, 25000);
  if (!res.ok) throw new Error(`transcribe ${res.status}`);
  const j = await res.json();
  return j.conversation || null;
}

/** POST an outfit photo → a structured description or null (vision). */
export async function analyzeOutfitViaApi(imageDataUrl) {
  const res = await fetchT(`${BASE}/analyze-outfit`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ imageDataUrl }),
  }, 25000);
  if (!res.ok) throw new Error(`analyze-outfit ${res.status}`);
  const j = await res.json();
  return j.outfit || null;
}

/** POST a room photo → a structured description or null (vision). */
export async function analyzeRoomViaApi(imageDataUrl) {
  const res = await fetchT(`${BASE}/analyze-room`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ imageDataUrl }),
  }, 25000);
  if (!res.ok) throw new Error(`analyze-room ${res.status}`);
  const j = await res.json();
  return j.room || null;
}

/** POST a profile screenshot → a structured description or null (vision). */
export async function analyzeProfileViaApi(imageDataUrl) {
  const res = await fetchT(`${BASE}/analyze-profile`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ imageDataUrl }),
  }, 25000);
  if (!res.ok) throw new Error(`analyze-profile ${res.status}`);
  const j = await res.json();
  return j.profile || null;
}

/** POST the sanitized RoastInput → the RoastResult (live brain runs server-side). */
export async function roastViaApi(input) {
  const res = await fetchT(`${BASE}/roast`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  }, 45000);
  if (!res.ok) throw new Error(`roast ${res.status}`);
  return await res.json();
}

/** POST the render spec → the exact MP4 as a Blob (synchronous; holds the connection). */
export async function renderVideo(spec) {
  const res = await fetchT(`${BASE}/render`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(spec),
  }, 240000);
  if (!res.ok) throw new Error(`render ${res.status}`);
  return await res.blob();
}

/**
 * Async render: enqueue a job, stream REAL progress over SSE, then fetch the MP4.
 * @param {object} spec
 * @param {(p:number)=>void} [onProgress] 0..1
 * @returns {Promise<Blob>}
 */
export async function renderVideoAsync(spec, onProgress) {
  const res = await fetchT(`${BASE}/render?async=1`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(spec),
  }, 30000);
  if (!res.ok) throw new Error(`render ${res.status}`);
  const { jobId } = await res.json();

  await new Promise((resolve, reject) => {
    const es = new EventSource(`${BASE}/render/${jobId}/events`);
    es.onmessage = (e) => {
      let d;
      try { d = JSON.parse(e.data); } catch { return; }
      if (typeof d.progress === "number" && onProgress) onProgress(d.progress);
      if (d.status === "done") { es.close(); resolve(); }
      else if (d.status === "error") { es.close(); reject(new Error(d.error || "render failed")); }
    };
    es.onerror = () => { es.close(); reject(new Error("render stream lost")); };
  });

  const fileRes = await fetchT(`${BASE}/render/${jobId}/file`, {}, 60000);
  if (!fileRes.ok) throw new Error(`render file ${fileRes.status}`);
  return await fileRes.blob();
}

/** POST the render spec → a poster PNG as a Blob (a shareable still). */
export async function renderPoster(spec) {
  const res = await fetchT(`${BASE}/poster`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(spec),
  }, 120000);
  if (!res.ok) throw new Error(`poster ${res.status}`);
  return await res.blob();
}

/** POST beats → SynthesizedSet ({ clips, durationsMs, voiced, engine }). */
export async function fetchVoice({ comedianId, performerName, beats }) {
  const res = await fetchT(`${BASE}/voice`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ comedianId, performerName, beats }),
  }, 45000);
  if (!res.ok) throw new Error(`voice ${res.status}`);
  return await res.json();
}
