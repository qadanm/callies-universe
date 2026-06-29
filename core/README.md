# @callies-universe/core

The **shared core** of Callie's Universe: the single source of truth every app
inherits. Depends on nothing; imports nothing internal. Implements the
[`core/HANDOFF.md`](../project/core/HANDOFF.md) spec.

What's inside:

- **Design tokens**: the fixed calico base palette (cream / ginger / charcoal,
  derived from Callie's coat) plus the documented `--accent-*` slot (default
  ginger), and type / spacing / radius / elevation / motion. Ship as plain CSS.
- **Component library**: `Button`, `Chip`, `Card`, `Input`, `Badge`, `Sheet`,
  `Toast`, `Confetti`. App-agnostic only.
- **Callie**: the 9-state mascot (`Mascot`/`Callie`), the `CallieHost` behavior
  brain, and `CallieStage` (imperative `setState` by name).
- **The cast**: `Roaster` (8 avatars + `Roaster.roster` metadata) and
  `CastPicker`.

> ShareCard and CreditTile are **app-layer**, per the handoff. They are *not* in
> this package.

## Install

```bash
pnpm add @callies-universe/core react react-dom
```

## Use

Link the single CSS entry point once (it `@import`s every token file), then
import components:

```jsx
import "@callies-universe/core/styles.css";
import { Button, Callie, CastPicker } from "@callies-universe/core";

<Button variant="primary" size="lg">Roast my ride</Button>
<Callie state="savage" size={140} />
```

### The accent slot

Every component references the brand ramp (`--ember-* / --flame-* / --heat-*`),
which is aliased to `--accent-*`. An app reskins the whole library by overriding
the accent **only**. Ship a `theme.css` and load it after `styles.css`:

```css
/* app theme.css — RoastMyRide ember/flame */
:root {
  --accent-700: #8a1c0a;
  --accent-600: #c7340f; /* primary-action bg — must pass white-text AA */
  --accent-500: #e85b2a;
  --accent-bright: #ff7a1a;
  /* … */
}
```

```html
<link rel="stylesheet" href="@callies-universe/core/styles.css" />
<link rel="stylesheet" href="./theme.css" />
```

### Callie, three ways

```jsx
// 1. Presentational — render any of the 9 states by name.
<Callie state="celebrating" size={120} />

// 2. Behavioral — entrance + idle-cycle + reactions + optional tip bubble.
<CallieHost context="cooking" bubble />

// 3. Imperative — drive by name over a ref.
const callie = useRef(null);
<CallieStage ref={callie} initialState="idle" />
callie.current.setState("savage");
```

## Build

```bash
pnpm --filter @callies-universe/core build
```

Produces `dist/index.js` (ESM) + `dist/index.cjs` (CJS). Types are in
`types/index.d.ts`; token CSS ships as-is under `styles.css` + `tokens/`.
