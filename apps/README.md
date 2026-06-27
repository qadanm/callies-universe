# apps/ — product layer (reserved, empty)

The outer layer of Callie's Universe. Each product (RoastMyRide first, then the
"call from a character" app, and beyond) lives here as its own package.

**Status: empty.** This milestone builds `core/` only — no app is created yet.

An app is **the core plus a thin, controlled skin**: it adds only

1. its **accent color** (one `theme.css` filling the core's `--accent-*` slot),
2. its **hero-mechanic screens**, and
3. its **app-specific Callie reactions/scenarios** (data in a script, no new art).

## The dependency rule

```
apps/  →  services/  →  core/        (never the reverse)
```

`apps/*` packages may import `@callies-universe/core` and `@callies-universe/*`
services. Nothing may import from `apps/`. Enforced by ESLint in the repo-root
`eslint.config.js`.

## Adding an app (future milestone)

Create `apps/<name>/package.json` named `@callies-universe/<name>`, depend on
`@callies-universe/core`, link `@callies-universe/core/styles.css` + the app's
`theme.css`, and build only the three things above. The workspace glob
(`apps/*`) and the lint boundary pick it up automatically.
