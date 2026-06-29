# Voice accents — troubleshooting log & decision (tabled)

**Status:** the strong-accent ("ethnic") cast is **tabled / coming soon**. We reverted
to the reliable older TTS path and ship a North-American / English active cast.
**Date:** 2026-06.

## What we wanted
Per-character ElevenLabs voices designed via **Voice Design** (text-to-voice from a
prompt). Several characters had strong non-American accents: Abu Omar (Egyptian),
Mateo (Latin), Jean-Luc (French), Priya (British-Indian), Kenji (Japanese).

## Symptom
Each designed voice sounded **on point in the ElevenLabs Studio preview**, but rendered
**flat / "trying to do an American accent"** through our pipeline. Abu Omar's Egyptian
also **drifted toward Indian** on some lines. Kenji **repeated each short line twice**.

## What we tried (in order)
1. **voice_settings.** Theory: `style` (exaggeration) too high flattens similarity.
   Lowered Abu Omar `style` 0.85 → 0.5; raised default `similarity_boost` 0.75 → 0.9.
   → **Almost no change.** Jean-Luc/Kenji had *low* style and were still American, so
   settings were not the lever.
2. **Model.** Voice Design generates on **Eleven v3**; our pipeline used
   `eleven_multilingual_v2`. An isolated A/B (4 models, same voice/line) confirmed
   **eleven_v3 = correct accent** ("definitely v3").
3. **Endpoint.** Suspected `/with-timestamps`. Switched to the basic endpoint +
   estimated word-timings. → **Still American.**
4. **Output format — ROOT CAUSE.** v3 only serves **MP3** on our plan:
   - `pcm_44100` → `403 subscription_required`.
   - `pcm_24000 / 22050 / 16000` → **silently downgrade to an older model** (American)
     and double very short lines. Proof: identical text produced **different
     durations** per pcm rate (7.20 / 7.28 / 7.36 s) vs **mp3 = 7.60 s** — same audio
     cannot have different durations, so the pcm path is a fallback, not real v3.
   Our pipeline requested `pcm_24000` (we need raw PCM for exact clip duration +
   `/with-timestamps` character alignment for karaoke captions), which is exactly why
   the in-app renders were American while the Studio (mp3) preview was correct.
5. **MP3 fix attempt.** Requested `mp3_44100_128` (real v3) and decoded it to PCM with
   **ffmpeg** for an exact duration; estimated caption word-timings from text. Result:
   accent **correct** (Abu Omar Egyptian) BUT:
   - **caption highlighting drifted out of sync** (estimated timings ≠ real audio; the
     v3 audio has no usable per-word timestamps here),
   - **accent still drifted** (Egyptian → Indian) on some lines,
   - added an **ffmpeg dependency**, more **cost + latency**, and complexity.

## Decision
**Not worth it.** We sacrifice exact subtitle sync, simplicity, cost, and latency for
a marginal, still-inconsistent accent gain. So:
- **Revert** to `eleven_multilingual_v2` + `/with-timestamps` + `pcm_24000` (exact
  alignment, in-sync karaoke, simple, reliable). See
  `services/voice/src/provider/elevenlabs.js`.
- **Table** the strong-accent cast — Abu Omar, Mateo, Jean-Luc, Priya, Kenji — as
  **coming soon** (kept defined everywhere, greyed in the cast picker with a banner).
- **Keep** Mama (US), Tony (NY Italian-American), Reginald (British RP) — these render
  cleanly on `multilingual_v2`.
- **Add** North-American / English characters that the safe model handles well
  (deep Southern, exaggerated Canadian).

## If we revisit later
- Full **v3 pipeline**: mp3 + ffmpeg decode + the ElevenLabs **forced-alignment API**
  for *real* word timings (extra call → cost/latency, but fixes the sync drift).
- Wait for **v3 to support PCM / timestamps** at GA.
- **Per-character model override** (v3 only for the few accented voices) once alignment
  is solved — `profile` already threads through the provider, so a `profile.model`
  field would be a small change.

## Touch points
- `services/voice/src/provider/elevenlabs.js` — model / endpoint / format.
- `services/voice/src/voiceProfiles.js` — delivery DNA (`pace/stability/expressiveness`,
  optional per-profile `similarity`).
- `core/src/components/cast/Roaster.jsx` — `comingSoon` flag on tabled characters.
