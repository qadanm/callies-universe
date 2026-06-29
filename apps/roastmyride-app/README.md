# @callies-universe/roastmyride-app

RoastMyRide, the **first app** in Callie's Universe, built as a **thin layer** on
[`@callies-universe/core`](../../core). Implements
[`project/apps/roastmyride-app/HANDOFF.md`](../../project/apps/roastmyride-app/HANDOFF.md).

This milestone is a **navigable UI skeleton**: every screen clicks through, Callie
reacts through the flow via her 9 core states, and the roast is **mocked behind a
service-shaped seam**. No real backend, no `services/`.

## Run it: clone, install, click through

From the **repo root**:

```bash
pnpm install
pnpm app          # builds core, then serves the app at http://localhost:5180
```

Or from this folder (after `pnpm install` + `pnpm build` at the root so `core/dist` exists):

```bash
pnpm --filter @callies-universe/roastmyride-app dev
```

The flow: **Onboarding → Home (car photo) → Profile-roast (selfie/profile consent)
→ Context chips → The Cast → Cooking (mock generates) → Reveal (ShareCard) →
Share success**. The top **dev screen-picker** jumps straight to any screen, and the
bottom tab bar carries Home / Credits / Settings.

### Headless verification (optional)

A click-through test walks the whole flow and asserts every screen renders, the
ember theme applied, Callie reacts, and the mock roast reaches the reveal:

```bash
pnpm --filter @callies-universe/roastmyride-app dev &   # start the server
node apps/roastmyride-app/scripts/e2e.mjs               # from the repo root
```

It uses the environment's preinstalled Chromium via `playwright-core`.

## The inheritance: this app is mostly reused core

### The only three things RoastMyRide adds

1. **Ember accent: `theme.css` [ROASTMYRIDE-NEW, 1 file]**
   Re-declares only the `--accent-*` slot. Because core's brand ramp
   (`--ember-* / --flame-* / --heat-*`) is aliased to `--accent-*`, **every core
   component reskins to ember automatically**, with zero component edits. The calico
   base palette stays. Load order (in `src/main.jsx`): core `styles.css` →
   `theme.css` → `app.css` (decoration).
2. **App-layer components [ROASTMYRIDE-NEW]**: `ShareCard` and `CreditTile`.
   Correctly kept **out of core** (they fail the "every app would use this" test);
   they live in `src/components/`.
3. **App-specific Callie reactions [ROASTMYRIDE-NEW, data only]**:
   `src/callieReactions.js`. Maps this app's moments to core's nine state names.
   **No new Callie art**, her art and brain are core.

Everything else is **[CORE-REUSED]**: all tokens, Button / Chip / Card / Input /
Badge / Sheet / Toast / Confetti, Callie + CallieHost, Roaster + CastPicker, the
motion language, and WCAG AA.

### Screen → core components

| Screen | [CORE-REUSED] | [ROASTMYRIDE-NEW] |
|---|---|---|
| Onboarding | `CallieHost`("onboarding"), `Button`, `Confetti` | copy, hero layout |
| Home / upload | `CallieHost`("home", tip), `Card`, `Badge`, `Button`, `Callie` | upload target, CTA |
| Context chips | `Chip`, `CallieHost`, `Button` | the 3 chip buckets |
| Roaster picker (Cast) | `CastPicker`, `CallieHost`("cast"), `Button` | frame + sticky CTA |
| Cooking | `CallieHost`("cooking") | progress bar; **calls the mock seam** |
| Reveal + share | `Callie`(reaction), `Confetti`, `Button` | `ShareCard`, layout, actions |
| Share success | `Sheet`, `CallieHost`("celebrate"), `Confetti`, `Badge`, `Button` | success copy, stats |
| Profile-roast mode | `CallieHost`("seasoning"), `Button` | selfie/profile consent UI |
| Credits / paywall | `CallieHost`("paywall", tip), `Button` | `CreditTile`, bundle layout |
| Settings | `CallieHost`("settings"), tokens | quiet settings rows |

> **Reuse check:** the only genuinely new files are `theme.css`, `ShareCard`,
> `CreditTile`, `callieReactions.js`, and the mock seam. Everything visible on
> screen is reused core composed into layouts. `[ROASTMYRIDE-NEW]` stayed small,
> as the handoff requires.

## The mock seam (the part built to be swapped)

Roast "generation" is mocked, but behind a contract shaped exactly like the future
real service, so the swap is one line.

```
src/services/
  roast.contract.d.ts   the typed contract: generateRoast(input) → Promise<RoastResult>
  roast.mock.js         the mock implementation (canned roasts; reads core Roaster.roster)
  roast.js              the BOUNDARY: screens import from here
```

`roast.js` today:

```js
export { generateRoast } from "./roast.mock.js";
```

When `services/brain` ships, that single line becomes
`export { generateRoast } from "@callies-universe/brain";`. The contract is
unchanged, so **no screen changes**. Screens only ever import `generateRoast` from
`roast.js`; `Cooking` calls it (via `flow.generate()`), the result feeds `Reveal`,
and the result's `reaction` (a core Callie state) drives Callie by name.

## Boundary discipline

The app imports `@callies-universe/core` and **nothing from `services/`** this
pass. The inward-only lint rule (`pnpm lint` at the root) enforces it.

## Documented choices (no redesign)

- The design's retired `Mascot state="watching"` (a pre-9-state emote) is rendered
  as the nearest core state, **`curious`**.
- **Real routing** uses `react-router-dom` (hash router) so each screen is a URL.
- **Marketing landing page:** intentionally **deferred to its own milestone** to
  keep this skeleton lean. The design source (`project/apps/roastmyride-web/`) is
  ready to port as `apps/roastmyride-web/` when that milestone runs.
