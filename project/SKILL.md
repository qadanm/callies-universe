---
name: callies-universe-design
description: Use this skill to generate well-branded interfaces and assets for Callie's Universe and its apps (RoastMyRide, Call Companion, and future apps), for production or throwaway prototypes/mocks. Contains the shared core — Callie the mascot, the character cast, design tokens, components — plus per-app accent themes and UI kits.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## The architecture: one core, many apps
**Callie's Universe** is a shared core that powers a portfolio of apps. Define once in the core; inherit everywhere. An app = the whole core + ONE accent override + its hero screens. Apps never fork the core.

## Quick map
- `readme.md` — the full design guide: architecture (core vs app), brand DNA, content voice, visual foundations, Callie + the cast, anti-slop + AA rules.
- `styles.css` — link this one file to get every token + font. `core/tokens/` holds the source (palette = Callie's calico coat: cream/ginger/charcoal + a per-app `--accent-*`).
- `components/` — the core React library: **Callie** (`Mascot.jsx`, mascot + `CallieHost` brain, 9 states), **Roaster** + **CastPicker** (the cast), Button, Chip, Card, Input, Badge, Sheet, Toast, Confetti, ShareCard, CreditTile. Each has a `.d.ts` + `.prompt.md`.
- `apps/<app>/theme.css` — a per-app accent override (the ONLY color change). `apps/<app>/` also holds that app's hero screens.
  - `apps/roastmyride-app/`, `apps/roastmyride-web/` (accent = ember/flame), `apps/call-companion/` (accent = indigo).
- `assets/flame-mark.svg` — the RoastMyRide app mark.

## The rules
**Maximalist skin, clean bones.** Chaos (stickers, confetti, Callie, collage) lives in the decoration layer only; buttons, inputs, flow, and ALL text stay clean and WCAG-AA legible. Bright accent on calico cream — never dark mode. **Callie reacts, never narrates** — the cast does the talking. PG-13, clever-not-cruel.
