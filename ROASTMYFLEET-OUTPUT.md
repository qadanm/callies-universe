# Roast My ___ : The Output (what the app actually produces)

The artifact is the product. It must do four jobs at once: **be genuinely funny**,
**feel premium/finished** (high perceived value), **be built to share** (a challenge
loop, a score, a tag), and **ride current formats** (serialized characters + real-voice
performance, not polished AI-slop). Grounded in 2026 short-form trends (see Sources).

---

## What 2026 actually rewards (and how we exploit it)

| Trend (2026) | Our move |
|---|---|
| **Output-driven challenges** ("try this → post your result → tag next") are the viral loop | Every roast ends with a **score + challenge CTA**; the artifact *is* the challenge entry |
| **Serialized recurring characters** drive return-watching/binge | The **8-comic cast** are the recurring stars: "roasted by Mama Denièce," collect/follow comics, comic-of-the-week |
| **Real-voice performance > polished AI-slop**; "looks like a friend showed you" wins | Designed character **voices (ElevenLabs v3)**, real comedic timing, a raw "AI actually roasted me" feel, not a slick ad |
| **60 to 90s gets a distribution bonus IF watch-time holds**; 20 to 35s wins completion/rewatch | Ship a **tight 25s share cut** (default) + an optional **50 to 60s "director's cut"** |
| **AI content is ~half the feed** → the bar is *taste*, not novelty | The grader (anti-cringe) + voice performance + writing are the moat |

---

## The deliverable: one roast → a content pack (not one file)

Perceived value comes from getting *a lot* from one tap:

1. **The Reel**: 9:16 MP4. Default **25s share cut**; optional **50 to 60s director's cut**.
2. **The Verdict Card**: a still PNG with the savage one-liner + the score. For Stories / feed / screenshot (screenshot-bait travels where video can't).
3. **The full set + transcript**: in-app, replayable, re-roastable by another comic.

---

## The hero format: **"The Set"**

A chosen comic performs a roast of the user's subject, grounded in the real thing,
built for retention. Beat structure (timing = retention):

| t | Beat | What's on screen |
|---|---|---|
| 0.0-1.5s | **HOOK** | "Mama Denièce is about to end your 2014 Civic." Subject hero shot slams in. No slow intro. |
| 1.5-4s | **First punch** | Open on the *hardest* line, not a warm-up (front-load the laugh). |
| 4-20s | **The set** | 3 to 4 beats, escalating; word-karaoke captions; punch-words pop; SFX stingers on punchlines. |
| 20-27s | **The closer** | The savage kill line, the screenshot moment. |
| 27-30s | **SCORE STAMP** | "🔥 COOKED: 9.2 / 10": comparable, challenge-able, screenshot-bait. |
| 30-33s | **Challenge CTA** | "Get roasted → [app] · tag who's next 👇" (subtle handle, not a billboard). |

---

## The 5 quality levers (priority order) + the exact tools

**1. Voice performance, the #1 lever.** This is what separates "a real comedian" from
"TTS slop." Use **ElevenLabs v3** (Feb 2026): inline **audio tags** (`[laughs]`,
`[scoffs]`, `[whispers]`, beat/pauses), **multi-speaker dialogue**, performed prosody.
~$100 / 1M chars → a ~700-char set ≈ **$0.07/roast** (cheap; it's the whole show).
*Already wired* (`fetchVoice` / `ELEVENLABS_API_KEY`). It needs the key, per-comic **voice
design** (a distinct voice ID + tag style per cast member), and v3-tag injection in the
set writer. For real-time/cost-at-scale later, **Cartesia Sonic** is the fast/cheap fallback.
*(Avoid PlayHT, acquired by Meta and deprecating.)*

**2. The performing character, the "wow" / premium tier.** Turn each illustrated comic
into an **animated talking head** lip-synced to the voice:
- **Hedra (Character-3)**: purpose-built to animate a *static image* (our comic art) into
  an expressive talking character. Best aesthetic fit. ~$2.88/min (Lite); manual-workflow-first.
- **HeyGen**: avatars + lip-sync with a real **developer API** (better for an automated
  render pipeline), ~$1.93/min, 40+ languages.
- A ~30s render ≈ **$1 to 1.5** → **gate behind premium credits**; run as an async job
  (the app already has async render + SSE progress). Standard tier stays the captioned stage.

**3. Word-karaoke captions + pacing, in-house, no new tool.** We already carry timed
words; finish the CapCut/"Hormozi" style: word-by-word reveal, punch-word emphasis (color/
scale pop), synced exactly to the voice clip durations (we already pace timeline to audio).

**4. Hook + score reveal + end card, in-house.** The 1.5s hook, the "🔥 Cook Level X/10"
stamp, and the challenge end-card. These are pure Remotion additions and drive both
retention and the share loop.

**5. Sound design, the taste layer.** Rimshot/airhorn stingers on punchlines, a light crowd
"oooh," a low music bed ducked under the VO. Use **original/royalty-free** audio; a custom
show theme/sting can be made once with **Suno**. *(Trending licensed audio is a copyright
trap on a downloadable/generated file, so don't.)*

---

## Format variants (toggle; platform- and subject-fit)

- **The Set** *(default; standard = captioned stage, premium = avatar comic)*. Best all-rounder.
- **The Panel / "Green Room"**: **two comics riff back-and-forth** about you, using
  ElevenLabs v3 **multi-speaker dialogue**. Rides the viral "AI two-host" format and feels
  like *"they're talking about ME."* Highest shareability per second.
- **Brainrot Mode**: gameplay split-screen + fast voice + captions. Algorithm candy, the
  "raw/authentic" lane, cheapest (no avatar). Opt-in.
- **The Verdict Card**: the auto still (always generated). The lowest-effort, highest-reach share.

---

## Virality mechanics (baked into the artifact, not bolted on)

- **Cook Level X/10**: quantified, comparable, screenshot-bait, challenge-able.
- **Challenge loop**: the end-card *is* the challenge entry ("post your score, tag who's next").
- **Serialized cast**: "Roasted by [comic]"; follow/collect comics; comic-of-the-week event.
- **Duet/stitch bait**: leave a 1 to 2s reaction beat at the end; "react to your friend's roast."
- **Tag-a-friend / personalization**: the share is about *you* or someone you tag (send
  the room app to your messy friend, the texts app to the dry texter).

---

## Production pipeline (maps to what's built)

```
ground (research / transcribe)              [built: researchCar, /transcribe]
  → write set (grader-passed, v3 tags)       [built: writeSet/grade; +v3 tag injection]
  → voice: ElevenLabs v3, per-comic voice    [wired: fetchVoice; +voice design]
  → STANDARD: Remotion captioned stage       [built: StageVideo; +caption/score polish]
    PREMIUM: Hedra/HeyGen avatar lip-sync     [NEW: avatar tier, async job]
  → compose: hook + captions + SFX + score + end-card   [built render; +new overlays]
  → OUTPUT: 9:16 MP4 (25s + 60s) + Verdict-Card PNG      [built render; +still export]
```

**Tiering / unit economics.** Free = standard captioned stage (≈$0.07 voice, instant-ish).
Premium credits = avatar performance (~$1 to 1.5) + premium voices + the Panel format. This
funds the wow-tier and gives a real upsell.

---

## Guardrails (don't get sued / rejected)

- **Original cast voices only**: design voices for our 8 comics; **never clone a real
  comedian's voice** (right-of-publicity lawsuit + App Store risk). Original illustrated
  characters = safe; real-person avatars = no.
- **Copyright-safe audio**: original/royalty-free SFX + music; no trending licensed tracks
  baked into a downloadable file.
- **Watermark/handle subtle**: authenticity beats a billboard, but keep attribution so
  shares drive installs.

---

## Build order (highest ROI first)

1. **Turn on the voice**: ELEVENLABS key + per-comic v3 voice design + tag injection. Single
   biggest jump in quality; mostly wiring + voice-design work.
2. **Caption polish + hook + Cook-Level score + end-card**: in-house Remotion; unlocks the
   share loop. No new vendor.
3. **Verdict-Card still export**: cheap, highest-reach share surface.
4. **The Panel (v3 multi-speaker)**: the killer shareable variant; reuses voice + render.
5. **Avatar premium tier (Hedra/HeyGen)**: the wow upgrade + monetization; async, gated.

---

### Sources
- [Short-Form Video Trends 2026 (Superside)](https://www.superside.com/blog/short-form-video-trends)
- [Trending Videos 2026 (Deeka AI)](https://deeka.ai/blog/trending-videos-2026)
- [Social Media Trends 2026 (Sprout Social)](https://sproutsocial.com/insights/social-media-trends/)
- [Voice Generation Models Compared 2026 (SurePrompts)](https://sureprompts.com/blog/voice-generation-models-compared-2026)
- [STT/TTS Providers 2026 incl. ElevenLabs v3, Sonic-3 (Softcery)](https://softcery.com/lab/how-to-choose-stt-tts-for-ai-voice-agents-in-2025-a-comprehensive-guide)
- [Hedra vs HeyGen 2026 (videoai.me)](https://videoai.me/compare/hedra-vs-heygen)
- [HeyGen vs Hedra lip-sync (lipsync.com)](https://lipsync.com/compare/heygen-vs-hedra)
