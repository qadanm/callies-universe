# Callie's Universe

A character-IP company that ships **many apps from one shared system**. This
repository is the monorepo for that system. **Milestone 1 (this pass):** scaffold
the monorepo and stand up the shared **`core/`** as a real, installable,
renderable package — `@callies-universe/core@0.1.0`. No app, no app logic, no
backend yet.

The design is already specified; this code implements it faithfully:

- **Spec / source of truth:** [`project/core/HANDOFF.md`](project/core/HANDOFF.md)
  (the core handoff — tokens, component inventory, Callie's 9-state contract, the
  cast/picker spec, the accent-slot convention). The full design export, including
  every token CSS file and component, lives under [`project/`](project/).

## Architecture — three layers, dependencies point inward only

```
┌─────────────────────────────────────────────┐
│  apps/        product apps (empty this pass)  │   each app = core + one accent + hero screens
│    │                                          │
│    ▼                                          │
│  services/    shared backend (stub this pass) │   render · voice · brain · moderation · payments
│    │                                          │
│    ▼                                          │
│  core/        @callies-universe/core@0.1.0    │   tokens · components · Callie · the cast
└─────────────────────────────────────────────┘
        apps → services → core   (never the reverse)
```

- **`core/`** depends on nothing internal. The single source of truth: design
  tokens, the component library, Callie's 9-state mascot system, and the
  character cast. Published under the `@callies-universe/*` namespace.
- **`services/`** — the shared backend layer. **Scaffolded empty** this pass
  (see [`services/README.md`](services/README.md)). May consume `core`, never `apps`.
- **`apps/`** — individual products. **Empty** this pass
  (see [`apps/README.md`](apps/README.md)). May consume `services` + `core`.

### The inward-only rule is enforced from day one

Even though only `core/` has content, the boundary is wired up so it can never be
crossed as the other layers fill in. [`eslint.config.js`](eslint.config.js) uses
`no-restricted-imports` to block any outward import:

- `core/**` may not import `@callies-universe/services`, `…/preview`, or reach
  `apps/` — it imports nothing internal.
- `services/**` may not import from `apps/`.
- `apps/**` and `preview/**` sit outside and may consume inward freely.

Run it: `pnpm lint`.

## Layout

```
core/            @callies-universe/core@0.1.0  — the shared package
  styles.css        single CSS entry point (consumers link this)
  tokens/           calico base palette + --accent-* slot, type/space/radius/elevation/motion
  src/components/   core/ · feedback/ · mascot/ (Callie) · cast/ (Roaster + CastPicker)
  types/            hand-authored TypeScript contracts
services/        backend layer — scaffolded, empty
apps/            product layer — empty
preview/         @callies-universe/preview — the render sandbox (dev tool, not an app)
scripts/smoke.mjs  headless render check (no browser)
project/         the original design export (spec + design-tool prototypes)
```

> **Why `preview/` is not under `apps/`:** the preview is a developer sandbox for
> verifying the core renders, not a product. Keeping `apps/` genuinely empty
> preserves the discipline that the first real app is a later milestone.

## Tooling

- **pnpm workspaces** — chosen for first-class monorepo support and a
  non-flat `node_modules` that structurally prevents a package from importing
  what it didn't declare (it reinforces the inward-only rule). Workspace
  members are listed in [`pnpm-workspace.yaml`](pnpm-workspace.yaml).
- **tsup** (esbuild) builds `core` to ESM + CJS.
- **Vite** + React serves the preview.
- **ESLint** (flat config) enforces the layer boundary.

## Verify — clone → install → see Callie render

```bash
# 1. Install the whole workspace
pnpm install

# 2. Build the core package (→ core/dist: ESM + CJS)
pnpm build

# 3a. See it render — the visual acceptance test
pnpm preview            # opens http://localhost:5179

# 3b. …or verify headlessly (build + render-to-string assertions)
pnpm smoke

# Everything at once: lint boundary + smoke + static preview build
pnpm verify
```

`pnpm preview` renders every token, every component variant/state, **Callie
through all 9 states** (plus the imperative `setState`-by-name API and the
behavioral host), and the **CastPicker with all 8 avatars** — the proof that the
core installs cleanly, stands alone, and renders.

## Scope of this milestone

**Done:** the three layers exist; the inward-dependency lint rule is wired;
`@callies-universe/core@0.1.0` implements the tokens, components, Callie's 9
states, and the cast/picker per the handoff; a preview renders all of it from a
clean install.

**Deliberately not done:** any app, any roast/app logic, any real `services/`
implementation. The `--accent-*` slot, the versioned package boundary, the empty
`services/` interfaces, and the empty `apps/` dir are left as clean drop-ins for
the next milestones.
