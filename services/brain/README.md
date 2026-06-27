# @callies-universe/brain — the comedy engine

The real brain behind RoastMyRide's `generateRoast` seam. It **researches the
specific car (live), writes a stand-up set shaped to the performing character,
and grades it** against an explicit anti-cringe rubric so nothing corny ships.

> Scope: **text set only.** No voice, no video, no stage — those are later
> milestones. The output is the graded written set.

```
apps/roastmyride-app  →  @callies-universe/brain  →  @callies-universe/core
        (consumes the seam)        (this package)         (persona seed + Callie states)
```

`services/brain` sits in the **services** layer. It depends on `core` (for the
cast persona seed and Callie's state names) and **never** on any app — the
inward-only dependency rule holds.

## What it does, in order

1. **Research the specific car (live).** `web_search` against the actual
   make/model/year: the running jokes, the real reputation, the known problems,
   what people say online *now*. This is the #1 anti-AI lever — it gives the
   comedy specific, true, current material instead of generic "your car is old"
   filler. Captured as structured `CarResearch` and kept in the result metadata.
   ([src/research/researchCar.js](src/research/researchCar.js))
2. **Write a stand-up set — shaped to the performer.** Each character writes a
   *different* set, not the same jokes in an accent. The set's structure,
   rhythm, joke kinds, crowd work and bits are driven by the character's comedic
   DNA, built from the researched material.
   ([src/writing/writeSet.js](src/writing/writeSet.js), [src/persona.js](src/persona.js))
3. **Grade it — the anti-cringe guarantee.** A tough-booker judge scores the set
   against the rubric and the brain ships the best that **passes**; if none
   pass, it regenerates (best-of-N, not best-of-50). The grader is the most
   important component — it's what makes "never corny" real.
   ([src/grading/gradeSet.js](src/grading/gradeSet.js), [src/grading/rubric.js](src/grading/rubric.js))

## Where the persona comes from

Core owns the canonical persona **seed** on `Roaster.roster` (name, tag,
register, spice, catchphrase) — we do **not** touch core. The brain layers a
**comedic-craft profile** over each seed in [src/persona.js](src/persona.js):
*form, rhythm, joke kinds, crowd work, signature moves, guardrails*. That craft
layer is what drives the SHAPE of each set, so the cast produces genuinely
different material on the same car.

## The contract delta (mock → brain)

The function signature is unchanged — `generateRoast(input) → Promise<RoastResult>`
— so the app's swap is a one-liner. The payload grows (full types in
[contract.d.ts](contract.d.ts)):

| | mock (`roast.contract.d.ts`) | brain (`contract.d.ts`) |
| --- | --- | --- |
| **Input** | `carPhoto`, `personal`, `roasterId`, `context` | **+ `car`** (identity to research), `carPhoto.identified`, optional `config` |
| **Output** | flat `segments` + `plainText` + `spice` + `reaction` | **+ `set`** (structured beats), **+ `performer`**, **+ `research`** (sources), **+ `grade`** (scores/verdict/AI-tells), **+ `reactionSequence`**, **+ `engine`** |
| **Legacy** | — | `segments`, `plainText`, `spice`, `reaction`, `roasterName`, `register`, `durationMs` all **preserved** so Reveal + ShareCard render unchanged |

## The rubric (the product bar, encoded)

Five axes scored 0–10, with hard pass-gates ([src/grading/rubric.js](src/grading/rubric.js)):

| Axis | Gate | What it asks |
| --- | --- | --- |
| `funny` | 7 | Would a real audience laugh, not groan? |
| `human` | 8 | Sounds human, not AI — **the reject axis**. Any caught AI-tell fails the set outright. |
| `specific` | 6 | Grounded in *this* car's real reputation, not generic filler. |
| `edge` | 5 | Pushes PG-13 hard without crossing; aimed at the car, never a group/culture. |
| `voice` | 7 | In *this* character's voice **and** comedic structure. |

A set passes only if it clears **every** score gate **and** the grader caught no
**major** AI-tell and at most one **minor** one. The grader tags each tell
`minor` (a small nit that mostly lands) or `major` (genuinely corny / sounds-like-
AI) — a single major tell, or two+ minor ones, sinks the set. Composite weights
`human` and `funny` highest.

## Model & efficiency

- **Claude drives writing and grading** (`claude-opus-4-8`, adaptive thinking)
  behind a thin, swappable model interface ([src/model/claude.js](src/model/claude.js)).
- **Research is cached per car** ([src/cache.js](src/cache.js)) so the whole cast
  roasts one car off a single research pass. Writing and grading are never cached
  — the funny is generated fresh. Candidate counts are modest (default 3, up to 2
  rounds); the grader always runs.

## Fallback (offline / no key)

When `ANTHROPIC_API_KEY` is absent — or a live call fails — the brain falls back
to a deterministic **offline brain** ([src/fallback/offlineBrain.js](src/fallback/offlineBrain.js))
that returns the full structured, graded set shape (hand-curated, character-
shaped sets). This keeps the app and `pnpm verify` running with no network. The
result carries `engine: "offline"` so callers can tell.

## Verify

```bash
# Offline path (no key) — the CI gate. Asserts the evolved contract, the
# preserved legacy surface, valid Callie states, and distinct sets per character.
pnpm --filter @callies-universe/brain smoke      # also runs as part of `pnpm verify`

# Cross-character proof. LIVE with a key (real research + grades), else offline.
pnpm --filter @callies-universe/brain demo "2006 Chrysler PT Cruiser" mama kenji abuomar
ANTHROPIC_API_KEY=... pnpm --filter @callies-universe/brain demo "2012 Nissan Juke" mama tony
```

The demo shows its work: the research used (+ sources), each character's graded
set, the grader's scores, and a side-by-side proving the sets are genuinely
different material — not reskinned.
