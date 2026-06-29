// Music beds: the "bgm under the VO" library, mirroring gameplayBackgrounds.
// We ship NO copyrighted music. Drop CC0/licensed loops in public/music/ and add
// entries with a `src`; pickMusic() chooses one deterministically per reel. With
// none, pickMusic returns null → the export has no music bed (just VO + SFX).

export const MUSIC_BEDS = [
  // { id: "lofi", label: "Lo-fi loop", src: "/music/lofi-90s.mp3", credit: "your-license" },
];

function hash(str) {
  let h = 5381;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

/** @returns {string|null} a music-bed URL, deterministic per roast, or null. */
export function pickMusic(result) {
  if (!MUSIC_BEDS.length) return null;
  const seed = `${(result && result.roasterId) || ""}|music`;
  const bed = MUSIC_BEDS[hash(seed) % MUSIC_BEDS.length];
  return bed.src || null;
}
