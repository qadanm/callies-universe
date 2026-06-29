// useRoastVoice — fetch the comedian's per-beat audio for the LIVE reel.
//
// Only active when a backend is configured (VITE_ROAST_API). Cached per
// comedian+beats so revisits/replays don't re-synthesize. Returns
// { clips, durationsMs } or null (no backend / not loaded / failed) — callers
// treat null as "silent, use the word-count timeline", exactly as before.
import { useEffect, useState } from "react";
import { hasRoastApi, fetchVoice } from "../services/roastApi.js";

const voiceCache = new Map();

function hashBeats(beats) {
  // djb2 over the spoken text + per-line speaker, enough to key the cache
  // deterministically. performerId MUST be included: panel beats voice each line
  // in a different comic, so two panels with the same text but swapped speakers
  // are DIFFERENT audio and must not share a cache entry.
  const s = JSON.stringify((beats || []).map((b) => [b.type, b.text, b.punch, b.tail, b.performerId]));
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

export function useRoastVoice(comedianId, performerName, beats) {
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    if (!hasRoastApi() || !beats || !beats.length) {
      setVoice(null);
      return undefined;
    }
    const key = `${comedianId}:${hashBeats(beats)}`;
    if (voiceCache.has(key)) {
      setVoice(voiceCache.get(key));
      return undefined;
    }
    let alive = true;
    // One retry on a transient failure before falling back to silent — keeps the
    // live preview in step with the export (which always synthesizes server-side).
    const attempt = (tries) =>
      fetchVoice({ comedianId, performerName, beats })
        .then((v) => {
          const val = { clips: v.clips || [], durationsMs: v.durationsMs || [] };
          voiceCache.set(key, val);
          if (alive) setVoice(val);
        })
        .catch((e) => {
          if (tries > 0) return attempt(tries - 1);
          console.warn(`[reel] voice fetch failed (${(e && e.message) || e}); playing silent`);
        });
    attempt(1);
    return () => {
      alive = false;
    };
  }, [comedianId, performerName, beats]);

  return voice;
}
