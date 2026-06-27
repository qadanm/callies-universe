# services/ — shared backend layer (reserved, not implemented)

The middle layer of Callie's Universe. Shared backend capabilities every app
calls into: **render**, **voice**, **brain**, **moderation**, **payments**.

**Status: scaffolded, empty.** This milestone builds `core/` only. No service is
implemented yet — this directory exists so the layer boundary and the
inward-only dependency rule are in place from day one.

## The dependency rule

```
apps/  →  services/  →  core/        (never the reverse)
```

- `services/*` packages may import `@callies-universe/core`.
- `services/*` packages may **not** import anything from `apps/`.
- `core/` imports nothing internal.

This is enforced by ESLint (`no-restricted-imports`) in the repo-root
`eslint.config.js`. The rule is active now even though only `core/` has content,
so the constraint can never be violated as services come online.

## Adding a service (future milestone)

Create `services/<name>/package.json` named `@callies-universe/<name>` and add
`core` as a dependency if needed. The workspace globs (`services/*`) and the lint
boundary pick it up automatically.
