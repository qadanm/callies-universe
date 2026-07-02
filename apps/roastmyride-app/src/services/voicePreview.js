// Voice preview: play a short, bundled sample of a single voice on demand.
//
// The clips are real ElevenLabs renders of each voice's signature line, shipped
// as static assets at /voices/<id>.mp3 (public/voices, copied into the native
// bundle by cap sync). One shared <audio> means only ONE preview plays at a
// time: tapping a second voice stops the first. Everything is gesture-driven
// (a tap), so autoplay policies never block it, and it works fully offline.
//
// If a clip is missing (not generated yet), play() rejects and the UI shows a
// gentle "preview coming soon" state instead of breaking.

let el = null; // the single shared HTMLAudioElement
let currentId = null; // which voice is loaded/playing
const listeners = new Set(); // UI subscribers → re-render on play/stop/error

function audio() {
  if (!el) {
    el = new Audio();
    el.preload = "none";
    el.addEventListener("ended", () => setPlaying(null));
    el.addEventListener("pause", () => { if (el && el.currentTime === 0) setPlaying(null); });
  }
  return el;
}

function setPlaying(id) {
  currentId = id;
  for (const fn of listeners) fn(currentId);
}

/** src for a voice's bundled clip. Root-relative so it resolves inside the WKWebView bundle. */
function srcFor(id) {
  return `/voices/${id}.mp3`;
}

/** Subscribe to "which voice is playing" changes. Returns an unsubscribe fn. */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** The voice id currently playing, or null. */
export function playingId() {
  return currentId;
}

/** Stop any current preview. */
export function stopPreview() {
  if (el) {
    el.pause();
    try { el.currentTime = 0; } catch { /* not seekable yet */ }
  }
  setPlaying(null);
}

/**
 * Play a voice's sample. Tapping the one already playing stops it (toggle).
 * Resolves when playback STARTS; rejects if the clip can't be played (missing).
 */
export async function playPreview(id) {
  const a = audio();
  if (currentId === id && !a.paused) {
    stopPreview();
    return { toggledOff: true };
  }
  stopPreview();
  a.src = srcFor(id);
  setPlaying(id);
  try {
    await a.play();
    return { ok: true };
  } catch (e) {
    // Clip missing / not yet generated / blocked → clear state, let UI degrade.
    setPlaying(null);
    throw e;
  }
}
