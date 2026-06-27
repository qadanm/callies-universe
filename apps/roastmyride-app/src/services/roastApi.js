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

/** POST the render spec → the exact MP4 as a Blob. */
export async function renderVideo(spec) {
  const res = await fetch(`${BASE}/render`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(spec),
  });
  if (!res.ok) throw new Error(`render ${res.status}`);
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
