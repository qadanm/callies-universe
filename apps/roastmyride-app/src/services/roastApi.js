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

/** POST the car photo → an identified { year, make, model, label } or null (vision). */
export async function identifyCarViaApi(imageDataUrl) {
  const res = await fetch(`${BASE}/identify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ imageDataUrl }),
  });
  if (!res.ok) throw new Error(`identify ${res.status}`);
  const j = await res.json();
  return j.car || null;
}

/** POST the sanitized RoastInput → the RoastResult (live brain runs server-side). */
export async function roastViaApi(input) {
  const res = await fetch(`${BASE}/roast`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`roast ${res.status}`);
  return await res.json();
}

/** POST the render spec → the exact MP4 as a Blob (synchronous; holds the connection). */
export async function renderVideo(spec) {
  const res = await fetch(`${BASE}/render`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(spec),
  });
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
  const res = await fetch(`${BASE}/render?async=1`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(spec),
  });
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

  const fileRes = await fetch(`${BASE}/render/${jobId}/file`);
  if (!fileRes.ok) throw new Error(`render file ${fileRes.status}`);
  return await fileRes.blob();
}

/** POST the render spec → a poster PNG as a Blob (a shareable still). */
export async function renderPoster(spec) {
  const res = await fetch(`${BASE}/poster`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(spec),
  });
  if (!res.ok) throw new Error(`poster ${res.status}`);
  return await res.blob();
}

/** POST beats → SynthesizedSet ({ clips, durationsMs, voiced, engine }). */
export async function fetchVoice({ comedianId, performerName, beats }) {
  const res = await fetch(`${BASE}/voice`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ comedianId, performerName, beats }),
  });
  if (!res.ok) throw new Error(`voice ${res.status}`);
  return await res.json();
}
