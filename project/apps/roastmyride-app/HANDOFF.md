# RoastMyRide — APP HANDOFF SPEC
The **first app** in Callie's Universe, built as a **thin layer on `core/`**. It imports the entire core and adds only: (1) its accent, (2) its hero screens, (3) its app-specific Callie reactions. Engineering builds `apps/roastmyride/` importing `core/` — nothing here re-implements core.

Tags: **[CORE-REUSED]** = consumed from core unchanged · **[ROASTMYRIDE-NEW]** = genuinely new to this app. (If NEW were large, something's wrong — it isn't.)

---

## 1. Accent application — filling the core's accent slot  **[ROASTMYRIDE-NEW: 1 file]**
`apps/roastmyride-app/theme.css` re-declares only the accent slot; the calico base + every other token stay from core. Loaded after `styles.css`:
```css
:root{
  --accent-700:#9E2709; --accent-600:#C7340F; /* white text 5.35:1 AA ✓ */
  --accent-500:#E5481B; --accent-bright:#FF6A1A; --accent-bright-2:#FF8330;
  --accent-warm:#FF9D4D; --accent-warm-2:#FFB877; --accent-soft:#FFF3E2;
}
```
Because the core's brand ramp (`--ember-*/--flame-*/--heat-*`) is aliased to `--accent-*`, **every core component reskins to ember automatically** — zero component edits.

**Sticker-bomb decoration layer [ROASTMYRIDE-NEW]:** on top of the core's clean bones the app dials maximalism up — warm radial-wash backgrounds, corner stickers on `Card`, `Confetti` on reveal/celebrate, big display headlines, Callie everywhere. All decoration stays off the functional layer; text + controls remain AA. (`landing.jsx` adds page-level sticker collage.)

---

## 2. Screens — `apps/roastmyride-app/` + `-web/`
Flow (current, simplified): **Onboarding → Home (Photo 1: car) → Photo 2 (selfie/profile) → Tonight's lineup → Warming up → Reveal (the set) → Celebrate**, plus Credits & Settings. `index.html` = phone shell + router; `screensA.jsx` / `screensB.jsx` = the screens.

> **NEW DIRECTION (this update): the output is a stand-up comedy set, not a voiceover-over-gameplay video.** The chosen cast member is now a **comedian performing a researched, PG-13 stand-up bit about the user's car**, on stage at a comedy show. Each comedian has genuinely different material (not one script in 8 accents). The three screens the format actually changes — **lineup, warming-up, reveal** — were reworked; everything else (onboarding, upload, Photo 2, chips, paywall, settings) is unchanged. See §5 for the new set-shaped data the brain returns.

| Screen | Core components used [CORE-REUSED] | New to app [ROASTMYRIDE-NEW] |
|---|---|---|
| Onboarding | `CallieHost` (context `onboarding`), `Button` | copy, hero layout |
| Home / upload | `CallieHost` (`home`, with tip), `Card`, `Badge`, `Button`, `Callie` | upload target, "roast my car" CTA |
| Photo 2 (selfie/profile) | `CallieHost` (`seasoning`), `Button` | selfie/profile segmented upload, consent line |
| **Tonight's lineup** (was "The Cast") | **`CastPicker`** + `Roaster` (unchanged), `CallieHost` (`cast`), `Button`, `Card` | *reframe + light restyle:* playbill `Marquee`, per-comedian comedic-style line (`COMIC_STYLE`), "put {name} on stage" CTA. **No new picker component.** |
| **Warming up** (was "Cooking") | `CallieHost` (`cooking`) | reframed copy — "{comedian} is writing tonight's set" / "warming up the crowd"; Callie hosts backstage |
| **Reveal — the set** (reworked) | `ShareCard` (standup), `Confetti`, `Callie`/`Mascot` (`savage`), `Roaster`, `Button`, `Card` | comedy-special layout: warm-lit **`StageFrame`** (the perf-video placeholder), now-performing billing bar, **set transcript** (`SetBeat`: setup/punch/crowd/closer), Callie in the crowd, shareable clip |
| Celebrate (share success) | `Sheet`, `CallieHost` (`celebrate`), `Confetti`, `Badge`, `Button`, `ShareCard` (standup) | stand-up share copy + the posted clip |
| Credits / paywall | `CreditTile`, `CallieHost` (`paywall`, with tip), `Button` | bundle layout |
| Settings | `CallieHost` (`settings`), tokens | quiet settings rows |
| Marketing landing (`-web`) | `Button`, `Card`, `Badge`, `Callie`, `Roaster`, `ShareCard`, `Confetti` | single-CTA viral page sections (unchanged — still video framing) |

**App-only components [ROASTMYRIDE-NEW]:** `ShareCard` and `CreditTile` (RoastMyRide-specific, flagged "app-layer, NOT core" in the Design System tab). **`ShareCard` was updated this turn** with an additive `format="standup"` mode (a "🎤 Live set" mic badge, the comedian + their `act` style line, a stage-spotlight wash, a "stand-up clip" footer). The change is **backward-compatible** — `format` defaults to `"video"`, so the marketing landing and any existing caller render unchanged.

### Where the new work lives (all app-layer, no core edits)
- `screensA.jsx` — `COMIC_STYLE` + `STANDUP_SETS` data, the `Marquee` playbill, reworked `CastScreen` (lineup) and `CookingScreen` (warming up).
- `screensB.jsx` — `StageFrame`, `SetBeat`/`Punchline`, reworked `RevealScreen` and `CelebrateScreen`.
- `index.html` — threads the selected comedian (`comic`/`setComic`) through every screen so lineup → warming-up → reveal stay in sync.
- `components/share/ShareCard.jsx` — the additive `standup` framing (app-layer component).

---

## 3. App-specific Callie reactions  **[ROASTMYRIDE-NEW: data only]**
Callie's art + brain are core; RoastMyRide adds only the per-context **data** entries in `CALLIE_SCRIPT` (idle pools / entrance / reactions / tips) for this app's moments — using the core's 9 states by name, never new art:
- `home` → idle: idle/curious/comfort; reacts `upload → celebrating`; tips about car angle.
- `cooking` → enter `cooking`, idle cooking/curious/delighted; now reads as "backstage, Callie hosting."
- `reveal` → enter `savage`, idle savage/delighted/celebrating. **Callie is the audience surrogate** — she sits in the crowd silhouette inside `StageFrame` and pops up on every `crowd`-type beat (`savage`), losing it. She never takes the mic.
- `celebrate` → enter `celebrating`; share-success hype.
- `seasoning`/`cast`/`paywall`/`settings` → context-appropriate idle + tips.

**The two-performer rule (per Character Bible) — now sharper:** the **cast comedian** performs the stand-up set (the comedy); **Callie only reacts**, as the crowd. The reveal makes this literal — comedian on stage, Callie in the audience. Never blur them.

---

## 5. The stand-up format — the set-shaped data the brain now returns  **[ROASTMYRIDE-NEW]**
The backend no longer returns a single roast line + a video render job. It returns a **structured stand-up set** performed by the chosen comedian. The screens above are built to present exactly this shape. Reference material lives app-side in `screensA.jsx` (`STANDUP_SETS`, keyed by the core `Roaster` id) — swap it for the live API response; the shape is the contract:

```ts
interface StandupSet {
  comedianId: string;     // maps to a core Roaster id (mama, tony, kenji, …) — drives the on-stage avatar
  bit: string;            // short bit title, e.g. “Baby, No.” — shown as the set's heading
  runtime: string;        // e.g. "0:49" — billing + the (placeholder) video scrubber
  beats: Beat[];          // the set, in performance order
  // optional metadata the UI can surface later: tags, audience rating, language, render status…
}
interface Beat {
  type: "setup" | "punch" | "crowd" | "closer";
  text: string;           // the line; for crowd beats, the comedian's aside to the room
  punch?: string;         // punch | closer only: the highlighted payload word/phrase (yellow sticker)
  tail?: string;          // optional trailing text after the punch (“… and just as financed.”)
}
```

**How the UI maps it** (`screensB.jsx`):
- `comedianId` → `<Roaster id>` on stage in `StageFrame` + the billing bar; `COMIC_STYLE[id]` (app-layer, `screensA.jsx`) supplies the one-line comedic identity shown on the lineup, billing, and the share clip's `act`.
- `beats` → `SetBeat` renders each by `type`: `setup` = muted lead-in, `punch` = big display line with the `punch` word highlighted, `crowd` = a "🎤 crowd work" aside with **Callie reacting**, `closer` = the "🎤 mic drop".
- the `closer` (text + punch + tail) → the shareable **`ShareCard format="standup"`** still.

**Genuinely different material per comedian** is a content requirement, not a UI one: each comedian writes their own set (deadpan nature-doc vs. fast crowd work vs. three-word mic drops — see `COMIC_STYLE`). Same car, eight different shows. Still **PG-13, clever-not-cruel** — at the car and its choices, never the person.

**Not built (future milestone):** the actual AI-generated stage-performance video. The reveal ships the **frame it will sit in** — `StageFrame`, a warm-lit comedy-club poster (comedian + mic + spotlight + crowd) wrapped in video-player chrome (PREVIEW badge, play button, scrubber, "stage video — coming soon"). The set transcript is designed to land on its own **before any video exists**. When the render pipeline lands, drop the `<video>` into `StageFrame` keyed to `comedianId`/`runtime`; nothing else moves.

---

## 4. What this app does NOT touch (inherited from core, unchanged) **[CORE-REUSED]**
All tokens (calico base + the accent it fills), Button/Chip/Card/Input/Badge/Sheet/Toast/Confetti, Callie + CallieHost (art + brain), Roaster (8 avatars) + CastPicker, the motion language, "maximalist skin / clean bones", and WCAG AA. Change any of these in `core/` and RoastMyRide inherits it — the app never forks the core.

**Reuse check:** ~3 new files (theme + ShareCard + CreditTile) + screen compositions; everything else is core. The next app (Call Companion) is built the same way — its own `theme.css` accent + hero screen, same core.
