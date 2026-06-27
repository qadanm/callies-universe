# Callie's Universe — CORE HANDOFF SPEC
**The single source of truth for engineering.** This package is `core/` — it depends on nothing and is imported by every app. Everything here is app-agnostic: no app's screens, copy, or purpose. Apps inherit ALL of this and add only (a) one accent color and (b) their hero screens.

> The test every item passed: *"would every app in the universe use this?"* If not, it's app-layer, not core (see the bottom).

---

## 1. Design tokens
Consumers link the single entry point **`styles.css`** (root), which `@import`s the files in `core/tokens/`. Token files, in load order:

| File | What it defines |
|---|---|
| `fonts.css` | `@font-face` / webfont loads. Display **Baloo 2**, body **Hanken Grotesque** (Google Fonts CDN — self-host for prod). |
| `palette.css` | **Callie's calico coat = the base palette** + the **accent slot**. |
| `colors.css` | Brand ramp aliased to the accent, foundation, sticker set, semantic, aliases. |
| `typography.css` | Families, weights, type scale, line-height, tracking, type roles. |
| `spacing.css` | 4px-base scale + semantic spacing + tap-target floors. |
| `radius.css` | Chunky/squishy radii incl. `--radius-pill`, `--radius-blob`. |
| `elevation.css` | Warm shadow ramp + the inflatable "gloss" shadows. |
| `motion.css` | Duration/easing tokens, keyframes, reduce-motion fallback. |

### 1.1 Color — the calico base (FIXED across all apps)
From Callie's coat. These never change between apps:
- **Cream** (white patch → canvas): `--cream #FFF6EC`, `--cream-50`, `--cream-200`.
- **Ginger** (orange patch): `--ginger-700 #8F4214 … --ginger-200 #F8C794`.
- **Charcoal** (black patch → ink/text): `--charcoal-900 #2A2420 … --charcoal-500`.
- Foundation aliases: `--canvas`, `--surface #FFF`, `--ink`, `--ink-soft`, `--ink-faint`, `--hairline`, `--focus-ring #07B6CE`.
- Sticker set (decoration only, never carries text contrast): `--sticker-yellow/lime/cyan/pink/purple/sky`, `--pop-cyan`, `--pop-pink`.
- Semantic (fixed regardless of accent): `--success #1E8E4E`, `--warning #B8730A`, `--danger #C7340F`, `--info #0A6E9E` (all white-text AA ✓).

### 1.2 The ACCENT SLOT (each app fills this — the ONLY color an app overrides)
The accent ramp is a documented slot with a **calico-ginger default** so the core stands alone:
```
--accent-700  --accent-600(*) --accent-500
--accent-bright  --accent-bright-2  --accent-warm  --accent-warm-2  --accent-soft
```
(*) `--accent-600` is the primary-action background and **MUST pass white-text WCAG AA (≥4.5:1)**.

The brand ramp components reference (`--ember-* / --flame-* / --heat-*`) is **aliased to `--accent-*`**, so overriding the accent reskins the whole library automatically — components never hardcode a brand color.

**Accent-slot convention for apps** — ship a `theme.css` that re-declares `:root { --accent-*: … }` and load it AFTER `styles.css`:
```html
<link rel="stylesheet" href="…/styles.css" />
<link rel="stylesheet" href="theme.css" />   <!-- the app's one accent override -->
```
Reference examples (app-layer, not core): RoastMyRide = ember/flame; Call Companion = indigo.

### 1.3 Type
`--font-display` (Baloo 2 — headlines, buttons, big moments) · `--font-body` (Hanken Grotesque — all small functional text). Weights `--fw-body…--fw-heavy(800)`. Scale `--fs-reveal 72 → --fs-legal 12`. Roles `--type-d1…d4`, `--type-button`, `--type-lead/body/sm/cap/legal`. Discipline: display never below ~18px; companion carries small text.

### 1.4 Spacing / radius / elevation / motion
- Spacing: `--space-0…12` (4px base); `--tap-min 48`, `--tap-cozy 56`, `--tap-hero 64`.
- Radius: `--radius-sm 12 … --radius-2xl 44`, `--radius-pill`, `--radius-blob`.
- Elevation: `--elev-1…4`; gloss `--gloss-card`, `--gloss-primary`, `--gloss-primary-pressed`, `--gloss-chip`; `--shadow-sticker`; `--ring` (focus).
- Motion: durations `--dur-1…4`,`--dur-cook`; easings incl. `--ease-spring` (overshoot), `--ease-bounce`; `--press-scale .94`; keyframes `rmr-squish-idle / rmr-pop-in / rmr-bob / rmr-jiggle / rmr-blink / rmr-float / rmr-cook-pulse / rmr-confetti-fall`. **All looped/entrance motion has a `prefers-reduced-motion` calm fallback** baked into `motion.css`.

---

## 2. Core component library
React, namespace `window.<DS namespace>`; each has a `.d.ts` contract + `.prompt.md`. All app-agnostic.

| Component | Key props | States / variants |
|---|---|---|
| **Button** | `variant, size, block, disabled, iconLeft/Right` | primary · accent · secondary · ghost; sm/md/lg; hover-lift, squish-press, disabled |
| **Chip** | `selected, emoji, onToggle` | default · selected (filled accent + ✕); pop on toggle |
| **Card** | `sticker, stickerCorner, pad` | clean interior + optional corner sticker |
| **Input** | `label, hint, error, iconLeft` | default · focus (cyan ring) · error (danger + aria-invalid) |
| **Badge** | `tone` | ember · flame · success · info · cool · pink · ink |
| **Sheet** | `open, title, header, onClose, primaryAction` | bouncy bottom sheet/modal; mascot may host header |
| **Toast** | `tone, icon` | ink · success · danger · flame |
| **Confetti** | `count, active` | decoration-only; pointer-events:none; renders nothing under reduce-motion |
| **Callie** *(alias `Mascot`)* | `state, size, accessory, placeholderTag, reduceMotion` | the 9-state mascot — see §3 |
| **CallieHost** *(alias `MascotHost`)* | `context, event, size, bubble, bubblePlacement` | the behavior layer — see §3 |
| **Roaster** | `id, size, ring` | the 8 cast avatars — see §4 |
| **CastPicker** | `initialId, onChange` | featured + tap-to-switch grid — see §4 |

Discipline for every component: **maximalist skin, clean bones** — a clean, AA-legible functional core; decoration (stickers, gloss, mascot) only on the optional decoration layer, never over a tap target or text. Apps dial maximalism up via accent + decoration; the core ships clean bones + the warm baseline.

---

## 3. Callie — the 9-state mascot system (the heart of the core)
A kawaii **calico cat** (cream + ginger + charcoal — the coat the palette derives from). Squishy, comically simple face, big readable emotions. **She reacts, never narrates** — wordless (no localization, ever); the user's emotional surrogate.

**Nine canonical states:** `idle · curious · cooking · delighted · savage · comfort · celebrating · empty · error`.

**Contract — how an app uses Callie:**
- Presentational: `<Callie state="savage" size={140} />` — render any state by name.
- Behavioral (recommended): `<CallieHost context="…" event="…" bubble />` — plays an entrance state, idle-cycles a context pool, reacts to a transient `event`, and can float a wordless tip bubble. All personality is **data** in the `CALLIE_SCRIPT` block of `Mascot.jsx` (`{ enter, idle[], react{event→state}, tips[] }` per context) — apps tune by editing data, never the component.
- An imperative wrapper is trivial to add over the same names (e.g. `callie.setState('savage')`).
- **Swapping art:** replace the SVG primitives in `Mascot.jsx` keyed to the same 9 state names (or drop in Lottie/sprite). Every app inherits the new art automatically — apps never commission their own.
- Honors `reduceMotion` (prop) and the global `prefers-reduced-motion`.

---

## 4. The character cast (also core)
Eight named comedic performers who narrate inside apps (distinct from Callie, who only reacts). Same kawaii art direction; each a unique bust.

`reginald` · `tony` · `abuomar` · `mama` · `mateo` · `jeanluc` · `priya` · `kenji`.

**Avatar:** `<Roaster id="mama" size={120} ring />`. Metadata travels on the static **`Roaster.roster`** array (`{ id, name, tag, register, spice, phrase, ring }`).

**Picker:** `<CastPicker initialId="mama" onChange={fn} />` — featured roaster (avatar, catchphrase, spice meter, favorite) over a tap-to-switch grid; reads `Roaster.roster` so it **auto-extends**.

**Extending the cast (trivial):** add one entry to `ROSTER` (`id → {name, tag, register, spice, phrase, ring}`) and one `ART[id]` art function in `Roaster.jsx`. The picker and roster pick it up with no other changes.

**Guardrail (universal):** every roaster's comedy aims at the subject, never their culture; affectionate, PG-13. (Per the Character Bible.)

---

## 5. Core vs app-layer (what's NOT in this session)
These exist in the repo but are **app-specific** (fail the "every app would use this" test) — they belong to RoastMyRide, not core:
- **ShareCard** — the roast-video share frame (roast text, punch-word, spice). RoastMyRide-only.
- **CreditTile** — credit-bundle paywall tile. App-monetization, not universal.

A future app session inherits §1–§4 and adds: its `theme.css` accent + its own hero screens/components like the above. Nothing in §1–§4 assumes any app's purpose — any app can be built on top.

---

## 6. Where things live
```
styles.css            ← single entry point (apps link this)
core/tokens/          ← all tokens (§1)
core/HANDOFF.md       ← this document
components/            ← the core library (§2–§4): core/, feedback/, mascot/, cast/
guidelines/            ← foundation specimen cards (Design System tab)
apps/<app>/theme.css   ← per-app accent override (the accent slot)
apps/<app>/…           ← per-app hero screens (NOT core)
```
