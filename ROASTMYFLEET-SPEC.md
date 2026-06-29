# Roast My ___ : Per-App Product Spec

Concrete, build-ready spec for each app in the fleet. Companion to `ROASTMYFLEET-PLAN.md`
(strategy). This is the *what each app actually is*. Each app = the shared shell +
the subject pack (`services/brain/src/subjects/`) + the per-app tokens below.

---

## The Constant (identical in every app, never varies)

These are the shared design system and engine. Do **not** fork them per app.

- **Foundation palette** (`core/tokens/colors.css`): `--canvas` cream `var(--cream)`,
  `--surface` `#FFFFFF`, `--ink` `var(--charcoal-900)`, `--ink-soft` `#5C4631`,
  `--hairline` `#EAD9C9`. Warm "calico paper" base, every app.
- **Sticker decoration set** (fixed): yellow `#FFCB2B`, lime `#8BE04E`, cyan `#2BD4E8`,
  pink `#FF4FA3`, purple `#8B5CF6`, sky `#3B9DFF`. Decoration layer only.
- **Typography**: Schibsted display + the core type scale. **Motion**: core timings.
- **Brand ramp aliases** (`--ember/--flame/--heat`) resolve to the app's accent, so a
  reskin overrides the accent ramp **alone**.
- **Engine**: Callie mascot + reaction rig, the 8-comedian cast, the
  cook → reveal → reel flow, the grade/anti-cringe rubric, credits/paywall, share/reel render.

**The differentiation budget per app = one accent ramp + icon + input flow + chips +
comedic targeting + output theme + ASO.** Everything below is exactly that.

> **Accent ramp shape** (mirror `apps/roastmyride-app/theme.css`): 8 stops.
> `--accent-700` (darkest) → `-600` (the **AA white-text** stop, target ≥4.5:1) →
> `-500` → `-bright` → `-bright-2` → `-warm` → `-warm-2` → `-soft` (lightest tint).
> Hex below are chosen to that structure; **contrast-check each `-600` before shipping.**

---

## 1. Roast My Ride: `car` *(shipped, reference)*

| Field | Value |
|---|---|
| **App name (ASO)** | Roast My Ride |
| **Subtitle** | Your car. Roasted by a comedian. In a video. |
| **Keywords** | roast, car, funny, AI comedy, car roast, roast my ride |
| **Accent** | **Ember / flame** (existing `theme.css`): 700 `#9E2709` · 600 `#C7340F` · 500 `#E5481B` · bright `#FF6A1A` · bright-2 `#FF8330` · warm `#FF9D4D` · warm-2 `#FFB877` · soft `#FFF3E2` |
| **Icon** | ¾-view car silhouette on ember; corner flame family-badge |
| **Input** | `single-photo` — one car photo *(built)* |
| **AI grounding** | Web-research the model's real reputation (running jokes, known problems) → `researchCar` *(built)* |
| **Chips (fair game)** | 🚗 The car · 🎨 My taste · 🔧 The mods · 🏁 How I drive · 💸 Price tag |
| **Targeting / safety** | "Jokes about the CAR, never the driver/owner. PG-13." |
| **Output / share** | "Tonight's victim" stage reel — the car on a polaroid sticker |
| **4.3 / 4.2 note** | Unique function: live web research of a specific vehicle. Lasting value: 8 comics × replay, saved reels. |

---

## 2. Roast My Texts: `texts` *(shipped, flagship)*

| Field | Value |
|---|---|
| **App name (ASO)** | Roast My Texts |
| **Subtitle** | Your texts. Roasted by a comedian. In a video. |
| **Keywords** | roast, text, text roast, messages, screenshot, AI comedy, roast my texts |
| **Accent** | **iMessage blue** — 700 `#0B3E8F` · 600 `#1257C2` *(AA white)* · 500 `#2D6FE0` · bright `#3B9DFF` · bright-2 `#5FB0FF` · warm `#8AC6FF` · warm-2 `#B9DCFF` · soft `#EAF3FF`. *(Green bubbles are the "victim" — used as accent-clash, not the brand color.)* |
| **Icon** | Two chat bubbles — a big blue one and a tiny grey "k" reply; corner flame badge |
| **Input** | `screenshot` — 1–3 convo screenshots → vision transcription *(built: `/transcribe` + `analyzeConversation`)* |
| **AI grounding** | Transcribe the thread, read the **dynamic** (dry replies, left-on-read, double-texts, the ick) → `textsPack.ground` *(built)* |
| **Chips (fair game)** | 🧵 The thread · 🗣️ My replies · 🟢 Green bubbles · ✅ Read receipts · ⏳ Response time · 😂 Emoji game |
| **Targeting / safety** | "Jokes about the TEXTS and the dynamic, never the people. PG-13." |
| **Output / share** | "Group-chat roast" verdict — reel framed as a read-receipt / message-thread card |
| **4.3 / 4.2 note** | Strongest non-duplicate proof: it reads *your* conversation (OCR + dynamic analysis). Lasting value: every thread is new content. **Ship this first.** |

---

## 3. Roast My Fit: `outfit`

| Field | Value |
|---|---|
| **App name (ASO)** | Roast My Fit |
| **Subtitle** | Your outfit. Judged by a comedian. Fit check, roasted. |
| **Keywords** | roast, outfit, fit check, fashion, ootd, style roast, roast my fit |
| **Accent** | **Hot magenta** — 700 `#A1115E` · 600 `#C81E74` *(AA white)* · 500 `#E63A92` · bright `#FF4FA3` · bright-2 `#FF74B8` · warm `#FF9BCD` · warm-2 `#FFC2E0` · soft `#FFEAF4` |
| **Icon** | A clothes hanger / mannequin pose silhouette on magenta; corner flame badge |
| **Input** | `single-photo` (full-body) — **NEW: head-to-toe framing overlay** + "stand back, full body" coaching |
| **AI grounding** | Vision: identify garments, fit, color theory, brand vibes, "trying too hard?" → new `outfitPack.ground` (vision analyze, no web) |
| **Chips (fair game)** | 👗 The fit · 🎨 Color combo · 👟 The shoes · 🧢 Accessories · 💅 Effort level · 🪞 The mirror pic |
| **Targeting / safety** | "Jokes about the OUTFIT and styling choices, never the body or the person. PG-13." *(body-neutrality is a hard rule here)* |
| **Output / share** | "Fit check verdict" — runway/score card reel (e.g., a "rating out of 10" stamp) |
| **4.3 / 4.2 note** | Unique function: garment/color vision analysis + full-body capture flow. Replay: re-roast new fits daily. |

---

## 4. Roast My Room: `room`

| Field | Value |
|---|---|
| **App name (ASO)** | Roast My Room |
| **Subtitle** | Your room. Roasted by a comedian. In a video. |
| **Keywords** | roast, room, bedroom, apartment, decor, room tour, roast my room |
| **Accent** | **Sage green** — 700 `#1B5E36` · 600 `#2E7D44` *(AA white)* · 500 `#3E9A57` · bright `#56C06E` · bright-2 `#74D188` · warm `#97DEA6` · warm-2 `#BDEBC6` · soft `#ECF9EF`. *(Distinct from semantic `--success` and sticker-lime.)* |
| **Icon** | A room-in-perspective / doorway or a lone couch silhouette on sage; corner flame badge |
| **Input** | `single-photo` (wide) — **NEW: "step back, landscape" coaching** for a wide shot |
| **AI grounding** | Vision: read layout, clutter, decor signals, "what this room says about you" → new `roomPack.ground` |
| **Chips (fair game)** | 🛏️ The setup · 🧹 Cleanliness · 🖼️ The decor · 🪴 Plant situation · 💡 Lighting · 🎮 The cave |
| **Targeting / safety** | "Jokes about the ROOM and its choices, never the person's circumstances/income. PG-13." |
| **Output / share** | "Eviction notice" / interior-verdict reel (mock notice stamp = strong share format) |
| **4.3 / 4.2 note** | Unique function: spatial/decor vision read + wide-capture flow + the eviction-notice output. |

---

## 5. Roast My Profile: `profile` *(dating)*

| Field | Value |
|---|---|
| **App name (ASO)** | Roast My Profile |
| **Subtitle** | Your dating profile. Roasted before they swipe. |
| **Keywords** | roast, dating profile, tinder, hinge, bio roast, dating, roast my profile |
| **Accent** | **Violet** — 700 `#5B21B6` · 600 `#6D28D9` *(AA white)* · 500 `#7C3AED` · bright `#8B5CF6` *(=sticker-purple)* · bright-2 `#A78BFA` · warm `#C4B5FD` · warm-2 `#DDD6FE` · soft `#F3EFFF` |
| **Icon** | A profile card with a heart / swipe-arrow silhouette on violet; corner flame badge |
| **Input** | `multi-photo` — **NEW: 2–6 screenshots (pics + bio + prompts), reorderable.** Biggest new build (multi-upload + thumbnails). |
| **AI grounding** | Vision over all images: read bio, prompts, photo choices, **red flags** → new `profilePack.ground` (multi-image analyze) |
| **Chips (fair game)** | 📸 The photos · 📝 The bio · 💬 The prompts · 🚩 Red flags · 🏋️ The gym selfie · 🐟 The fish pic |
| **Targeting / safety** | "Jokes about the PROFILE's choices and red flags, never the person's looks/worth. PG-13." *(looks-neutrality is a hard rule)* |
| **Output / share** | "Swipe verdict" dossier reel — a mock match-card / "verdict: left" stamp |
| **4.3 / 4.2 note** | Unique function: multi-image upload + bio/prompt/red-flag analysis. Own search intent (dating). Highly shareable. |

---

## +1. Roast My Wrapped: `wrapped` *(Q4 seasonal event, not in the core 5)*

| Field | Value |
|---|---|
| **App name (ASO)** | Roast My Wrapped |
| **Subtitle** | Your year in music. Roasted by a comedian. |
| **Keywords** | roast, wrapped, music taste, spotify, year in review, roast my wrapped |
| **Accent** | **Electric fuchsia + signature gradient** — 700 `#86198F` · 600 `#A21CAF` *(AA white)* · 500 `#C026D3` · bright `#E64FE0` · bright-2 `#F178EF` · warm `#F7A8F2` · warm-2 `#FBD0F8` · soft `#FDEFFC`. **Signature treatment: a cyan→magenta→amber gradient on hero surfaces** (the one app allowed a gradient — befits its "Wrapped" DNA). |
| **Icon** | Equalizer bars / play-bar silhouette on the gradient; corner flame badge |
| **Input** | `stats` (screenshot) — a Wrapped/stats screenshot → vision transcription (reuse `texts` capture) |
| **AI grounding** | Read top artists/genres/minutes; roast the **taste** → new `wrappedPack.ground` |
| **Chips (fair game)** | 🎧 Top artist · 🔁 On repeat · ⏱️ Minutes · 🎭 The genres · 😬 Guilty pleasure |
| **Targeting / safety** | "Jokes about the MUSIC TASTE, never the person. PG-13." |
| **Output / share** | "Wrapped roast" reel in Wrapped-style bold cards |
| **4.3 / 4.2 note** | Launch as a **timed Q4 event** when the engine is templatized — costs ~a day. Don't keep a dead listing 10 months/year. |

---

## Build checklist — what each app needs vs what's shared

| Per-app deliverable | Where it lives | Status |
|---|---|---|
| Accent ramp | `apps/<app>/theme.css` (override 8 stops) | spec'd above |
| Subject config (name, upload copy, chips, safety, ASO, legal, emoji) | `src/subjects/<id>.js` | pattern built (car, texts) |
| Brain pack (ground + offline sets + framing) | `services/brain/src/subjects/<id>.js` | car, texts built; fit/room/profile/wrapped = new |
| Vision read (per input mode) | `services/brain` + `/identify` or `/transcribe` (or new `/analyze`) | car `/identify`, texts `/transcribe` built; **outfit/room/profile need image analyze; profile needs multi-image** |
| Icon set | `apps/<app>/` assets | spec'd above |
| Input-capture flow + coaching | app screens | single-photo & screenshot built; **full-body, wide, and multi-photo flows = new** |
| Output/share theme | `share.template` (proposed token) | proposed |

### Proposed config tokens to add (to make the above config-driven)
- `theme.accent` — the 8-stop ramp (or just reference the per-app `theme.css`).
- `input.mode` — `single-photo | multi-photo | screenshot | stats` (drives the capture flow + coaching).
- `share.template` — the verdict/output theme id (stage reel · group-chat · fit-check · eviction · swipe-dossier · wrapped).

### The biggest real engineering (not cosmetic — and the strongest 4.3 defense)
1. **`multi-photo` input** (Profile) — multi-upload, reorder, multi-image vision.
2. **Per-mode vision** — a general `pack.analyze(images)` so outfit/room/profile/wrapped each read their input (generalizes the car `/identify` + texts `/transcribe` into the pack interface — the deferred Sprint C item).
3. **`share.template` themes** — per-subject output framing (the share format *is* the viral mechanic).

### Apple cadence (from the strategy)
Ship **Texts first** (clearest unique function), get it live, then release the rest
**1–2 weeks apart** with distinct icons + metadata + screenshots. Never batch-submit.
Keep the seam ready to collapse any 4.3-rejected app into a *mode* of an approved one.
