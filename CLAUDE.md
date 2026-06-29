# Callie's Universe

House rules for anyone working in this repo, human or AI. Two short canon docs govern
everything: [docs/WRITING-STYLE.md](docs/WRITING-STYLE.md) and [docs/CALLIE-BIBLE.md](docs/CALLIE-BIBLE.md).

## Write like a human (hard rule, enforced)
- NEVER use em dashes or en dashes in anything a user reads: the app UI, the six websites, and
  the roasts. Rewrite with a comma, a period, a colon, parentheses, or "..." for a pause. Plain
  hyphens and the ellipsis character are fine. (Internal engine code, scripts, and team docs are
  not policed, but keep copy human when it is easy.)
- Skip AI-tell words (seamless, leverage, robust, elevate, delve, and friends) and corporate
  cadence. Write the way a funny person actually talks.
- Unserious and playful, never cringe, and never force Gen-Z slang just to sound young.
- Enforced by `pnpm run lint:human` (runs inside `pnpm run verify`). Full rule in docs/WRITING-STYLE.md.

## Brand canon
- Callie is the wordless host. She never speaks and never roasts you; the comedians do that.
  Full canon in docs/CALLIE-BIBLE.md.
- The joke aims at the thing (the car, the texts, the fit, the room, the profile), never at the
  person. Clever, never cruel.

## Build and check
- `pnpm run verify` runs lint, the human-copy guard, the brain/voice/api smokes, and the builds.
- One shared `core` powers the app, the six websites, and the rendered videos. Dependencies point
  inward only: core imports nothing, services import core, apps import both.
