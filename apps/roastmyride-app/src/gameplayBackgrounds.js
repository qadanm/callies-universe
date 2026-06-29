// Gameplay backgrounds: the "satisfying footage behind the VO" library.
//
// We ship NO copyrighted footage. Each entry is either a real licensed loop
// (`src`) OR a deterministic in-scene faux backdrop (`style`). pickBackground()
// chooses one per reel from a stable seed, so a given roast always renders the
// same backdrop (live === export), and different cars/comics look different.
//
// To use real loops: drop files in apps/roastmyride-app/public/gameplay/ (see the
// README there), add entries here with a `src`, and they take over automatically.

export const GAMEPLAY_BACKGROUNDS = [
  { id: "blocks", label: "Mining blocks", style: "blocks", src: null, credit: null },
  { id: "runner", label: "Endless runner", style: "runner", src: null, credit: null },
  { id: "parkour", label: "Neon parkour", style: "parkour", src: null, credit: null },
  // Example once you have a licensed loop (vertical 1080×1920, loops cleanly):
  // { id: "subway", label: "Subway run", style: "runner", src: "/gameplay/subway-1080.mp4", credit: "your-license" },
];

function hash(str) {
  let h = 5381;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

import { cfg } from "./subjects/index.js";

/**
 * Deterministically pick a backdrop for a roast.
 * @returns {{ backgroundUrl: string|null, fauxStyle: "blocks"|"runner"|"parkour" }}
 *   backgroundUrl: a real licensed loop (host layers <video>/<OffthreadVideo>), or
 *   null → the scene draws the faux `fauxStyle` backdrop.
 */
export function pickBackground(result) {
  if (!GAMEPLAY_BACKGROUNDS.length) return { backgroundUrl: null, fauxStyle: "blocks" };
  const key = cfg("research.key");
  const research = (result && result.research && result.research[key]) || {};
  const seed = `${(result && result.roasterId) || ""}|${research.label || (result && result.roasterName) || ""}`;
  const bg = GAMEPLAY_BACKGROUNDS[hash(seed) % GAMEPLAY_BACKGROUNDS.length];
  return { backgroundUrl: bg.src || null, fauxStyle: bg.style || "blocks" };
}
