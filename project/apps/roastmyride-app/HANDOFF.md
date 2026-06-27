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
Flow (current, simplified): **Onboarding → Home (Photo 1: car) → Photo 2 (selfie/profile) → The Cast → Cooking → Reveal → Celebrate**, plus Credits & Settings. `index.html` = phone shell + router; `screensA.jsx` / `screensB.jsx` = the screens.

| Screen | Core components used [CORE-REUSED] | New to app [ROASTMYRIDE-NEW] |
|---|---|---|
| Onboarding | `CallieHost` (context `onboarding`), `Button` | copy, hero layout |
| Home / upload | `CallieHost` (`home`, with tip), `Card`, `Badge`, `Button`, `Callie` | upload target, "roast my car" CTA |
| Photo 2 (selfie/profile) | `CallieHost` (`seasoning`), `Button` | selfie/profile segmented upload, consent line |
| The Cast (roaster picker) | **`CastPicker`**, `CallieHost` (`cast`), `Button` | screen frame + sticky CTA only |
| Cooking / loading | `CallieHost` (`cooking`) | progress bar, "cooking your roast" copy |
| Reveal + share | `ShareCard`, `Confetti`, `Callie` (`savage`), `Button` | reveal layout, share/save/re-roast actions |
| Celebrate (share success) | `Sheet`, `CallieHost` (`celebrate`), `Confetti`, `Badge`, `Button` | success copy, share stats |
| Credits / paywall | `CreditTile`, `CallieHost` (`paywall`, with tip), `Button` | bundle layout |
| Settings | `CallieHost` (`settings`), tokens | quiet settings rows |
| Marketing landing (`-web`) | `Button`, `Card`, `Badge`, `Callie`, `Roaster`, `ShareCard`, `Confetti` | single-CTA viral page sections |

**App-only components [ROASTMYRIDE-NEW]:** `ShareCard` (the roast-video share frame — roast text, punch-word highlight, roaster/voice tag, Callie reacting in-corner, watermark) and `CreditTile` (credit-bundle tile). These are RoastMyRide-specific and are flagged "app-layer, NOT core" in the Design System tab.

---

## 3. App-specific Callie reactions  **[ROASTMYRIDE-NEW: data only]**
Callie's art + brain are core; RoastMyRide adds only the per-context **data** entries in `CALLIE_SCRIPT` (idle pools / entrance / reactions / tips) for this app's moments — using the core's 9 states by name, never new art:
- `home` → idle: idle/curious/comfort; reacts `upload → celebrating`; tips about car angle.
- `cooking` → enter `cooking`, idle cooking/curious/delighted; "this one's gonna be good…"
- `reveal` → enter `savage`, idle savage/delighted/celebrating; "screenshot this."
- `celebrate` → enter `celebrating`; share-success hype.
- `seasoning`/`cast`/`paywall`/`settings` → context-appropriate idle + tips.

**The two-performer rule (per Character Bible):** the **cast** voices the roast (the comedy); **Callie only reacts** on screen. Never blur them.

---

## 4. What this app does NOT touch (inherited from core, unchanged) **[CORE-REUSED]**
All tokens (calico base + the accent it fills), Button/Chip/Card/Input/Badge/Sheet/Toast/Confetti, Callie + CallieHost (art + brain), Roaster (8 avatars) + CastPicker, the motion language, "maximalist skin / clean bones", and WCAG AA. Change any of these in `core/` and RoastMyRide inherits it — the app never forks the core.

**Reuse check:** ~3 new files (theme + ShareCard + CreditTile) + screen compositions; everything else is core. The next app (Call Companion) is built the same way — its own `theme.css` accent + hero screen, same core.
