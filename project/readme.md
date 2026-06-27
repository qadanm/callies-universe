# Callie's Universe — Design System

> **The one line to remember:** Make it look like a beloved illustrator built a maximalist sticker-bomb toy around a squishy mascot — loud, warm, screenshot-able, unmistakably human — then engineered it to stay perfectly legible and AA-clean underneath. **Maximalist skin, clean bones.**

## Callie's Universe = one shared core, many apps
This is **not** a single-app design system. **Callie's Universe** is a parent brand whose **shared core** (the mascot Callie, the character cast, all design tokens, the component library, the art direction, motion, and the AA discipline) powers a **portfolio of apps**. Each app inherits the *entire* core and overrides only: its **one accent color** and its **hero-mechanic screens**. Apps never fork the core — *define once in the core, inherit everywhere.*

**Two tiers:**
- **Core (shared, single source of truth):** `styles.css` + `core/tokens/`, the component library in `components/` (Callie mascot, the Roaster cast, CastPicker, primitives), and the guidelines/cards.
- **Per-app layers in `apps/`:** each is just a `theme.css` (the one accent override) + its hero screens.
  - `apps/roastmyride-app/` + `apps/roastmyride-web/` — the first app (accent = ember/flame).
  - `apps/call-companion/` — a second app proving reuse (accent = indigo; one incoming-call hero screen).

## What RoastMyRide is (the first app)
RoastMyRide is a **viral roast-video factory** (iOS-first app + one marketing landing page). A user uploads a photo of their car, optionally adds a selfie/profile, picks a **roaster** from the cast, and the app generates a genuinely funny, **PG-13, clever-not-cruel** roast — performed by that cast character's voice, with **Callie reacting** on screen — rendered as a **signature short video that *is* the social content**.

The product's entire promise is *"doesn't feel like AI slop."* The system must look **authored, human, intentional** — never templated or generated-gradient — be inherently **screenshot-able**, and make **Callie the unmistakable main character** across every app.

## Sources
Built from standalone written briefs (the RoastMyRide brief + the Character Bible + the Callie's Universe architecture note; the bible text is saved at `uploads/character_bible.txt`). No external codebase or Figma was provided.

---

## CONTENT FUNDAMENTALS — how RoastMyRide writes

- **Voice:** a witty, self-deprecating friend who's roasting *with* you, never *at* a stranger. Clever, warm, a little unhinged. The hard rule: **PG-13, clever-not-cruel.** Punching at choices (body kits, eco-mode-in-a-V8), never at people, bodies, or money.
- **Person:** speaks to the user as **"you"** ("Your car. Cooked.", "Tell me about you"); the mascot speaks in **first person** ("Hi, I'm Callie. I roast cars."). The brand is a character, not a faceless app.
- **Casing:** Display copy is **sentence case** ("Roast my car", "Cooking your roast…"), not Title Case and not ALL CAPS. ALL CAPS appears only on tiny sticker labels and badges ("NEW", "BEST VALUE", "HOT").
- **Length:** ruthlessly short. Headlines are 2–5 words. Buttons are verbs ("Roast my car", "Share video", "Cook it"). Body copy is one or two plain sentences.
- **Punch-word:** most roasts and headlines have ONE highlighted word — the joke's payload — set in a yellow sticker highlight ("still **slower** than the bus").
- **Emoji:** used sparingly as **stickers/accents**, never inside body text or labels that need to stay legible. The 🔥 flame is the signature; 🎟️/📸/🏷️ appear as functional glyphs. Never decorate legal or settings copy with emoji.
- **Honesty:** monetization copy is plain and fair ("One-time purchase · no subscription · restore anytime"). Consent copy is explicit ("Nothing posts without your tap", "We never roast strangers").
- **Examples:** "Your car. Cooked." · "Hi, I'm Callie. I roast cars." · "Clever, never cruel." · "Cooking your roast…" · "Stock up & keep cooking" · "Posted! You menace 😈"

---

## VISUAL FOUNDATIONS

- **Color:** Saturated **ember/flame** palette (orange-red) on a **bright, warm cream-white canvas** (`#FFF7F0`) — **never dark mode** (dark reads cruel/cyberpunk; wrong for PG-13). Primary is `ember-600 #C7340F` (white text 5.35:1). A small **sticker-set** of saturated hues (yellow, cyan, pink, lime, purple, sky) and two **clash accents** (electric cyan, hot pink) live in the **decoration layer only** and never carry text contrast.
- **Type:** One chunky display face — **Baloo 2** (rounded, inflatable, confident) — owns headlines, buttons, speech bubbles, the reveal, used 22px and up. A quiet companion — **Hanken Grotesque** — carries all small functional text (captions, legal, settings). Dramatic size contrast: a 72px reveal down to 12px legal.
- **Backgrounds:** bright flat canvas, with occasional **warm radial washes** (heat-300 → canvas) behind hero/cooking/reveal moments. The mascot section flips to **ink (`#221403`)** for contrast. No photographic backgrounds; no glassmorphism. Decoration is **sticker collage** — peel-off shapes with crisp offset shadows, slight rotations.
- **Shape & radius:** chunky, **inflatable** rounding everywhere — pill buttons/chips (999px), 26px cards, 34px sheets. The squishy language is the brand.
- **Elevation:** **glossy, not flat.** Warm-tinted shadows plus an inner top-highlight ("gloss") on primary buttons, cards, and the mascot so they read pressable. Stickers get a crisp 2px offset shadow like a peel-off.
- **Animation:** **maximal & playful** — press *squishes* to scale 0.94 and springs back (`--ease-spring`, overshoot), entrances **pop-in/bounce**, the mascot **bobs**, the cooking state **pulses**, and the reveal/share fire **confetti**. Every loop has a **reduce-motion fallback**: loops stop, entrances become a calm cross-fade, confetti renders nothing — the content still lands.
- **Hover/press:** hover lifts slightly (`scale 1.03`) and brightens; press squishes down and swaps to a pressed inner-shadow gloss. Chips pop on toggle.
- **Borders:** low-contrast `--hairline #EAD9C9` for dividers; selected/active controls take a **chunky 2–3px ember border**. Inputs show a **cyan focus ring** (high-vis, AA).
- **Imagery vibe:** warm, bright, saturated, fun — never cold, never grainy, never menacing.
- **Cards:** white surface, 26px radius, soft glossy shadow, **clean interior** (the bones) with optional **corner stickers** (the skin) that never cover a tap target or reduce contrast.
- **Layout:** iOS-first 390–430px app canvas with sticky action bars keeping the CTA one thumb-reach away; 1120px marketing content max. Generous touch targets (≥48px, hero CTA 64–72px).

---

## ICONOGRAPHY
- RoastMyRide has **no custom icon font**. The system uses a small set of **emoji as functional + sticker glyphs** (🔥 flame = signature, 📸 upload, 🏷️ chips, 🎭 roaster, 🍳 cooking, 🎟️ credits, ⚙️ settings, 🤳 profile) plus a handful of **unicode marks** for sticker decoration (★ ✦ ♥ ✕ ▶ ›). This is deliberate: emoji read warm and human and ship everywhere, matching the sticker-bomb aesthetic. Keep emoji **out of body text and any legal/settings copy** — they're accents, not content.
- The one custom asset is the **glossy flame mark** (`assets/flame-mark.svg`), used in the logo lockup.
- For production: if a stroke-icon set is ever needed for the functional layer (e.g. settings chevrons), substitute **Lucide** (rounded, friendly stroke) from CDN — flagged as a substitution, not yet wired in.

---

## INDEX — what's in this project

**Foundations**
- `styles.css` — entry point (consumers link this). `@import`s only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `fonts.css`.
- `guidelines/*.card.html` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `assets/flame-mark.svg` — the glossy flame logo mark.

**Components** (`components/`, namespace `window.RoastMyRideDesignSystem_896616`)
- `core/` — **Button**, **Chip**, **Card**, **Input**, **Badge**
- `mascot/` — **Mascot** (60+ emote art) + **MascotHost** (the context-aware brain) + the `SIZZLE_SCRIPT` personality data — all in `Mascot.jsx`
- `cast/` — **Roaster** (the 8-member voice cast: unique kawaii avatars who deliver the roast; `Roaster.roster` carries their metadata)
- `feedback/` — **Sheet**, **Toast**, **Confetti**
- `share/` — **ShareCard** (signature output), **CreditTile** (paywall bundle)

**UI kits** (`ui_kits/`)
- `app/` — the iOS app: 9-screen interactive flow (`index.html`, `screensA.jsx`, `screensB.jsx`)
- `web/` — the single-CTA marketing landing page (`index.html`, `landing.jsx`)

**Other**
- `SKILL.md` — Agent-Skill manifest for using this system in Claude Code.

---

## The mascot host system — Callie, the reaction-cat
It's the brand's **main character** and a **live host that is on screen everywhere, always reacting**. **Callie is a chubby spotted blob-cat** (a cat/blob hybrid — big cat ears, orange fur spots, flame-tip tail) in the flat, thick-outline, genuinely-cute tradition of Pusheen & friends. Crucially, **Callie never narrates the roast** — the roast text/voice is the content (delivered by a separate *voice persona*: Ms. Burnt, Lil Lemon, The Valet, Coach…), and Callie is the bystander cat *reacting* to it: crying-laughing, watching with popcorn, shook, heart-eyes.

It's defined as a system of **EMOTES** (reaction poses), one consistent cat with **60+ emotes** — idle/blink/groom/stretch/yawn/sleepy, curious/sus/thinking/scheming, delighted/giggle/wink/clap/celebrating, love/shy/pleading, watching/cooking/drumroll, savage/crying-laughing/shook/mind-blown/money, plus weird little surprises (sneeze, hiccup, dizzy, bonk, drool). Each is a small, looping, gamified emote that stays cute and never distracting. The shipped art is a clearly-labeled **placeholder** built so final art (illustration / Lottie / sprite sheet) drops in keyed to the same emote names.

**Callie has a brain.** `MascotHost` (exported from the same `Mascot.jsx`) is a behavior layer over `Mascot`: it plays an entrance emote on each screen, **cycles a context-appropriate idle pool** while the user just sits (with an occasional weird surprise), **reacts** to what the user does, and can float a small, dismissible **Clippy-style tip**. All of that personality is plain DATA in the `SIZZLE_SCRIPT` block at the bottom of `Mascot.jsx` (per-context `enter` / `idle` / `react` / `tips`) — edit the data, not the component. Drop `<MascotHost context="home" bubble />` in and Callie is alive and on-message everywhere.

---

## Anti-slop + AA pass
- **Authored, not generated:** sticker collage, a characterful mascot, and one chunky display font — no generated gradients, no glassmorphism, no template energy.
- **Mascot present everywhere** as the proof-of-human element.
- **Chaos in the decoration layer only;** functional bones (buttons, inputs, all text) stay clean.
- **WCAG AA:** body text ≥ 4.5:1, large ≥ 3:1, validated for every functional pairing (see `guidelines/color-*` cards). Sticker/clash hues never carry text contrast. Tap targets ≥ 48px; decoration never overlaps them. Reduce-motion fallback on every animation. Cyan focus ring on inputs.

---

## Caveats / flags
- **Fonts load from Google Fonts (CDN), not self-hosted.** Baloo 2 + Hanken Grotesque are loaded via `@import` in `tokens/fonts.css`, so the design-system compiler reports 0 local `@font-face` rules — expected. For offline/production, drop `.woff2` files in `assets/fonts/` and replace the `@import` with local `@font-face`. **Please confirm the font choices or provide brand font files.**
- **Mascot is an explicit placeholder** ("Callie", a Pusheen-style reaction-cat). It's a from-scratch SVG stand-in built to be swapped — final mascot art isn't locked.
- **App-store badges are stylized placeholders**, not the official Apple/Google trademark assets.
