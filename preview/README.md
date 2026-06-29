# @callies-universe/preview

The **render sandbox** for `@callies-universe/core`, and the acceptance test for
this milestone. It is a dev tool, **not** a product app, which is why it lives at
the repo root rather than under `apps/` (that layer stays empty until the first
real app).

It renders, from a clean install:

- every **token** (color, sticker set, type scale, spacing, radius, elevation, motion),
- every **component** in its variants/states (Button, Chip, Card, Input, Badge, Sheet, Toast, Confetti),
- **Callie** through all **9 states**, plus the imperative `CallieStage` (`setState` by name) and the behavioral `CallieHost`,
- the **CastPicker** with all **8** avatars.

## Run

From the repo root (builds core first, then serves):

```bash
pnpm install
pnpm preview        # → http://localhost:5179
```

Or build a static bundle:

```bash
pnpm preview:build  # outputs preview/dist
```
