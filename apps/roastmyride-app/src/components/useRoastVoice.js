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
  // djb2 over the spoken text, enough to key the cache deterministically.
  const s = JSON.stringify((beats || []).map((b) => [b.type, b.text, b.punch, b.tail]));
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
    fetchVoice({ comedianId, performerName, beats })
      .then((v) => {
        const val = { clips: v.clips || [], durationsMs: v.durationsMs || [] };
        voiceCache.set(key, val);
        if (alive) setVoice(val);
      })
      .catch((e) => {
        console.warn(`[reel] voice fetch failed (${(e && e.message) || e}); playing silent`);
      });
    return () => {
      alive = false;
    };
  }, [comedianId, performerName, beats]);

  return voice;
}
