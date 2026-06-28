// Turn ElevenLabs character-level alignment into word-level timings.
//
// The /with-timestamps endpoint returns, alongside the audio, an `alignment`:
//   { characters: ["H","e",...], character_start_times_seconds: [...],
//     character_end_times_seconds: [...] }
// We group runs of non-whitespace characters into words, each carrying the start
// of its first char and the end of its last — enough for true karaoke captions.
// Returns undefined when there's no usable alignment (caller falls back to an
// even-time estimate), so the offline/no-key path is unaffected.

export function wordsFromAlignment(alignment) {
  if (!alignment || !Array.isArray(alignment.characters)) return undefined;
  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds || [];
  const ends = alignment.character_end_times_seconds || [];

  const words = [];
  let cur = null;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (/\s/.test(ch)) {
      if (cur) { words.push(cur); cur = null; }
      continue;
    }
    const startMs = Math.round((Number(starts[i]) || 0) * 1000);
    const endMs = Math.round((Number(ends[i]) || Number(starts[i]) || 0) * 1000);
    if (!cur) cur = { text: ch, startMs, endMs };
    else { cur.text += ch; cur.endMs = endMs; }
  }
  if (cur) words.push(cur);
  return words.length ? words : undefined;
}
