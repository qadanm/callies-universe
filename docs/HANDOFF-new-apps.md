# Handoff: build the rest of the Callie's Universe app portfolio

You are taking over to build **four more "Roast My ___" apps**. The reference app
(**Roast My Ride**) is nearly ship-ready and is being fine-tuned by someone else, so
**do not modify the car path or the shared engine's behavior** (byte-parity is
asserted in `scripts/subjects-check.mjs`). You add *new subjects*; you don't change
the engine.

Read this whole doc, then read the reference files in §12 before writing code.

---

## 1. What Callie's Universe is
A studio/network shipping a **portfolio of "Roast My ___" apps**. One shared engine
+ a thin **per-subject config**. The user submits a photo/screenshot; two AI
comedians roast it in a short, vertical, shareable **podcast-style video**. Brand
mascot **Callie** (a calico cat) reacts but never speaks. Each subject ships as a
**separate App Store app** so they're genuinely different products (avoids App Store
Guideline 4.3 "duplicate app" rejection).

## 2. Your apps (priority order)
1. **Roast My Texts** (`texts`): screenshot of a conversation → roast the *dynamics*
   (dry replies, double-texts, left-on-read). **Partially built; finish + ship.**
2. **Roast My Outfit / Fit Check** (`outfit`): photo of an outfit → roast the *fit*.
3. **Roast My Room** (`room`): photo of a room → roast the *decor/mess/layout*.
4. **Roast My Profile** (`profile`): screenshot of a dating/social profile → roast
   the *bio/prompts/photo choices*. Highest sensitivity (see §9).

Plus the **app wrapper / per-app theming** so each is its own shippable build (§6).

## 3. Architecture: the subject seam (two layers)
Everything subject-specific lives in two small files per subject; the engine, the
cast, the podcast scene, voices, and Callie are **shared and untouched**.

**A. Brain pack** (`services/brain/src/subjects/<id>.js`, exports `<id>Pack`):
- `ground(input, model, cache)`: produce the research (see §4).
- `offlineSets`: per-comic curated sets for the no-key / CI path (one per ACTIVE
  comic minimum; model on `car.js` / `texts.js`).
- `offlineResearch()`: the research stub the offline path attaches.
- `framing`: imported from `framing.js` (see §5).
Register it in `services/brain/src/subjects/index.js` (`PACKS`). `resolveSubjectPack(id)`
returns it; unknown → car.

**B. App config** (`apps/roastmyride-app/src/subjects/<id>.js`, default export object).
Keys (copy the shape from `car.js`): `id, appName, handle, upload, mascot, brain,
chips, theme, media, monetization, cooking, grade, onboarding, celebrate, reveal,
research, legal, aso`. Register it in `apps/roastmyride-app/src/subjects/index.js`
(`REGISTRY`). The active subject is resolved at **build time from `VITE_SUBJECT`**;
read values with `cfg("path.to.key")`.

## 4. Research per subject (the important part)
The writer/grader consume ONE shape no matter the subject:
`{ summary, runningJokes, knownProblems, whatPeopleSay }` (arrays of strings).
Your `ground()` must return that shape.

- **car** researches the web (a car has a public reputation).
- **texts / outfit / room / profile** have NO web reputation; the material is INSIDE
  the image. So grounding is a **vision pass**: a model reads the photo/screenshot
  UPSTREAM (in `services/api`, mirroring how the car flow runs `/identify` first) and
  produces a structured description; `ground()` then extracts it into the research
  shape. **`texts` is your closest template**, so copy its approach (vision → transcript
  in `input.conversation` → extract → same schema). For outfit/room/profile, the
  upstream vision output is a structured description of the image instead of a
  transcript; thread it on `input.<something>` and extract identically.

Keep the research shape EXACTLY. That's the contract that makes the shared writer,
grader, and panel "just work" for a new subject.

## 5. Framing: `services/brain/src/subjects/framing.js`
Add an `<ID>_FRAMING` object (copy `TEXTS_FRAMING`). It supplies the ~5% of the
writer/grader prompts that are subject-specific: `roastTarget, possessive,
genericFiller, aimTarget, ownerNoun, fillerNoun, gradeSubjectWord, submissionNoun,
angles[], subjectPhrase(research), gradeLabel(research)`. **`aimTarget` and `ownerNoun`
are how you keep the comedy on the SUBJECT, not the person** (see §9).

## 6. Per-app branding / theming: THE GAP YOU MUST CLOSE
Right now `apps/roastmyride-app/src/main.jsx` hard-imports `../theme.css` (the ember
accent) + `./app.css` (RoastMyRide decoration). So building `VITE_SUBJECT=texts`
today gives RoastMyTexts *copy* but RoastMyRide's *look*. For genuinely distinct App
Store apps each subject needs its own:
- **accent palette** (the `--accent-*` ramp, like `theme.css`),
- **app name / handle / ASO** (already in the subject config),
- **icon + splash + onboarding copy**, and Callie's on-theme accent.

Pick ONE clean approach and apply it consistently:
- (preferred) give each subject config a `theme.accent` ramp and inject those CSS
  variables at runtime in `main.jsx` based on the resolved `subject`; or
- per-subject `theme-<id>.css` imported by `VITE_SUBJECT`.
This per-app distinctiveness is what passes Guideline 4.3 — take it seriously.

## 7. Build / run an app
- Dev: `VITE_SUBJECT=texts pnpm --filter @callies-universe/roastmyride-app dev`
- Build: `VITE_SUBJECT=texts pnpm app:build`
- Add per-subject build scripts to `package.json` for convenience.
- The shell (`roastmyride-app`) **is** the wrapper; each "app" is that shell built
  with its `VITE_SUBJECT` + its theme/assets. For native/App-Store packaging, see
  `apps/roastmyride-app/src/native.js` and `DEPLOY.md`.

## 8. Cast + voices (shared — do NOT rebuild)
- 10 characters in `core/src/components/cast/Roaster.jsx` (`Roaster.roster`): 4
  **active** (Reginald, Tony, Mama, Buford), 6 `comingSoon` (greyed in the picker).
  Personas: `services/brain/src/persona.js`. Delivery DNA: `services/voice/src/voiceProfiles.js`.
- Voices: ElevenLabs, model **`eleven_multilingual_v2`** — **do NOT switch to v3**
  (it flattens accents through our pipeline; full write-up in
  `docs/voice-accents-troubleshooting.md`). Voice ids come from env `VOICE_<ID>_ID`.
- Each new subject's brain pack needs `offlineSets` for at least the active cast, in
  each comic's voice (so the no-key/CI path works). Copy the structure from
  `car.js` / `texts.js` `OFFLINE_SETS`.

## 9. Hard rules (do not break)
- **Don't touch** the car path or shared engine internals (`writeSet`, `writePanel`,
  `gradeSet`, `generateRoast`, grading rubric). `subjects-check.mjs` asserts car
  byte-parity.
- Roasts are **PG-13, clever-not-cruel, aimed at the SUBJECT** (the outfit/room/
  profile/texts), **never at the person, their body, or any group**. Set
  `framing.aimTarget` / `ownerNoun` and the `legal` copy to enforce this. **Profile
  is the most sensitive** — roast the *choices* (bio clichés, prompt answers, photo
  composition), never looks or worth.
- All comedians are **original characters** — never imitate real people/celebrities.
- Keep the research shape (§4) and the app-config key shape (§3) intact.

## 10. Per-app checklist (repeat for each subject)
- [ ] `services/brain/src/subjects/<id>.js` — `ground()` (vision→research), `offlineResearch()`, `offlineSets` (active cast), framing import; export `<id>Pack`.
- [ ] `services/brain/src/subjects/framing.js` — add `<ID>_FRAMING`.
- [ ] register pack in `services/brain/src/subjects/index.js` (`PACKS`).
- [ ] `services/api` — the upstream vision pass for the photo/screenshot (model on the car `/identify` + texts conversation extraction).
- [ ] `apps/roastmyride-app/src/subjects/<id>.js` — full config (all keys from `car.js`).
- [ ] register config in `apps/roastmyride-app/src/subjects/index.js` (`REGISTRY`).
- [ ] per-app theme (accent ramp) + ASO + icon/splash (§6).
- [ ] verify offline path (no key → curated sets, no crash).
- [ ] gates green: `pnpm verify` and the app e2e (boot dev with `VITE_SUBJECT=<id>`, run `apps/roastmyride-app/scripts/e2e.mjs`). Extend `subjects-check.mjs` if needed.

## 11. House comedy bar (so your offline sets + angles match)
The writer prompts already encode this; match it when you write offline sets/angles:
roast, don't *review* (a fact is not a joke — build a dig on it); natural, not stagey;
**no "it's not X, it's Y" antithesis quips** (the #1 AI tell); normal speaking volume
(no ALL-CAPS / "!" — TTS yells); real words, no vocalization tics ("mm-mm", "uh").

## 12. Reference files (read these first)
- Web-research subject: `services/brain/src/subjects/car.js`, `apps/roastmyride-app/src/subjects/car.js`.
- **Vision subject (your template):** `services/brain/src/subjects/texts.js`, `apps/roastmyride-app/src/subjects/texts.js`.
- Framing: `services/brain/src/subjects/framing.js`.
- Registries: `services/brain/src/subjects/index.js`, `apps/roastmyride-app/src/subjects/index.js`.
- Theming: `apps/roastmyride-app/src/main.jsx`, `apps/roastmyride-app/theme.css`.
- Cast/voices: `core/src/components/cast/Roaster.jsx`, `services/brain/src/persona.js`, `services/voice/src/voiceProfiles.js`, `docs/voice-accents-troubleshooting.md`.
- Gates: `package.json` (`verify`), `scripts/subjects-check.mjs`, `apps/roastmyride-app/scripts/e2e.mjs`.
- Strategy/spec (read for product intent): `ROASTMYFLEET-SPEC.md`, `ROASTMYFLEET-PLAN.md`, `ROASTMYFLEET-OUTPUT.md`.

**Definition of done:** for each of texts/outfit/room/profile — builds with its
`VITE_SUBJECT`, has distinct branding/ASO/icon, roasts its real subject (live + offline),
keeps comedy on the subject not the person, and passes `pnpm verify` + e2e.
