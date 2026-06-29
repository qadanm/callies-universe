# RoastMyFleet — Plan

> Build 5 standalone App Store listings from one engine. One codebase, zero drift.

## The Core Insight

You aren't building 5 apps. You're building **1 engine + 1 shell + 5 subject configs.**

The engine (brain · voice · render · API · monetization) is already subject-agnostic. The shell is the UI (upload → pick → roast → save → share). The only thing that changes per app is the **subject config**: what the user uploads, what the AI researches, and the comedic safety frame. Every bug fix, paywall improvement, and feature ships to all 5 listings simultaneously. The marginal cost of app #5 is icon + screenshots + keyword list, not an engineering project.

---

## The Roster: 5 Evergreen + 1 Seasonal

| # | App | Subject ID | Why it earns its own listing |
|---|-----|------------|-----------------------------|
| 1 | **Roast My Ride** | `car` | Shipped. The proof. |
| 2 | **Roast My Texts** | `texts` | Highest virality ceiling. Screenshots of bad texts are a share format that already exists — people instinctively post them. The app makes them into a video. |
| 3 | **Roast My Fit** | `fit` | High repeat use (new outfit = new roast). Strong TikTok overlap — fashion content is a top vertical. Photos are easy, not hard, so the barrier is low. |
| 4 | **Roast My Room** | `room` | Broadest audience. Everyone has a room. No subject matter expertise needed from the user. The AI has infinite material (bad decor, clutter, mismatched furniture). |
| 5 | **Roast My Profile** | `profile` | Dating-app screenshots. The self portrait you just split out. It needs its own listing because "profile" is a distinct search intent (people search "roast my profile" not "roast my app") and carries its own privacy / consent frame. |
| + | **Roast My Wrapped** | `wrapped` | **Q4 seasonal only.** Build once, re-enable every October. It's a dead listing the rest of the year. |

### Why 5, not 1 generic "Roast" app?

Exact-match keyword ownership. "Roast My Texts" as the literal app name will rank #1 for that query. A generic "Roast" app will rank for nothing. Each listing is a SEO land grab. Kill losers, scale winners. Each app gets its own P&L so you can decide per subject whether to kill, keep, or pour fuel into it.

---

## Architecture: Shared Engine + Parameterized Shell

```
core/          → design tokens, Callie, CastPicker, primitives (unchanged)
services/      → brain, voice, render, api (unchanged)
subjects/      → NEW: per-subject config (prompts, safety, theme, ASO)
shell/         → NEW: one parameterized app (mounts a subject config)
apps/
  roastmyride/     → shell + subject=car
  roastmytexts/    → shell + subject=texts
  roastmyfit/      → shell + subject=fit
  roastmyroom/     → shell + subject=room
  roastmyprofile/  → shell + subject=profile
```

### The Engine (already exists, ~95% done)

| Layer | What it does | Subject-agnostic? |
|-------|-------------|-------------------|
| `core` | Design system, Callie, cast picker, primitives | Yes |
| `services/brain` | Research → write → grade, offline fallback | Yes (the subject is just a prompt variable) |
| `services/voice` | Per-character TTS with word-level timestamps | Yes |
| `services/render` | Remotion → MP4/PNG | Yes (the scene is prop-driven; the subject is just a photo prop) |
| `services/api` | Node host, credits, Stripe, rate limit | Yes |

### The Subject Config (NEW, ~5% of the work)

Each subject is a single JSON object that parameterizes the shell:

```js
const SUBJECT_CONFIG = {
  id: "texts",                 // the subject identifier
  // --- What the user uploads ---
  upload: {
    label: "Drop your screenshots",
    subcopy: "The messier the conversation, the harder we cook.",
    accepts: "image/*",         // image, or "image/*,text/*" for texts
    maxFiles: 3,                // car=1, texts=3 (conversation thread)
  },
  // --- AI behavior ---
  brain: {
    // The research prompt: what the brain looks up about this subject
    researchPrompt: "Identify the make, model, and year of the car in this photo.",
    // The safety frame: what the comedy is aimed at, and what is off-limits
    safety: "The jokes are about the CAR, never the driver, owner, or any person. PG-13. Clever, never cruel.",
    // The subject noun used in the set copy
    subjectNoun: "this car",
    // The comedic register modifiers per subject
    register: "sarcastic car critic",
  },
  // --- UI theming ---
  theme: {
    accent: "var(--accent-600)", // car=ember, texts=teal, fit=rose, room=amber, profile=purple
    mascotContext: "home",       // Callie's context per subject
    emoji: "🚗",                // car, 💬, 👗, 🏠, 💘
    backgroundStyle: "blocks",   // per-subject default faux-gameplay
  },
  // --- ASO ---
  aso: {
    appName: "Roast My Texts",
    subtitle: "Turn your worst texts into comedy gold",
    keywords: ["roast", "texts", "screenshots", "funny", "AI comedy", "message roast"],
  },
  // --- Monetization ---
  monetization: {
    creditLabel: "roasts",       // car="roasts", texts="reads", etc.
    defaultCredits: 3,
  },
};
```

### The Shell (NEW, thin)

The shell is a single Vite/React SPA that reads `window.__SUBJECT__` (or `import.meta.env.VITE_SUBJECT`) and mounts the correct subject config. The screens don't change — they just render different copy and behavior via the config:

```
shell/src/
  App.jsx          → mounts subject, sets theme CSS vars
  subjects/        → the 5 config objects
  screens/         → same 6 screens for every subject, reading from config
    Home.jsx       → upload prompt, accepts, etc. from config
    Chips.jsx      → subject-appropriate chip buckets (e.g., "Heat", "Tone")
    Cast.jsx       → same cast picker (the cast is universal)
    Cooking.jsx    → same cooking screen ("researching your ___" from config)
    Reveal.jsx     → same reveal (the scene is prop-driven)
    Celebrate.jsx  → same celebrate
    Credits.jsx    → same paywall (creditLabel from config)
    Settings.jsx   → same settings
  services/        → same roast/roastApi/purchases/credits
```

**The shell is literally the current RoastMyRide app, minus the hardcoded car strings, with a config object injected at build time.**

---

## Build System: One Build, N Apps

Each app is a separate build of the same shell with a different `VITE_SUBJECT` env:

```bash
# Build all 5 apps
for id in car texts fit room profile; do
  VITE_SUBJECT=$id pnpm --filter @callies-universe/shell build
  mv shell/dist apps/roastmy-$id/dist
  # iOS: cap add ios, sync, build, sign, submit
  # Web: deploy to Vercel/Fly under roastmy-$id.callies-universe.com
done
```

The backend (`services/api`) is shared — all 5 apps hit the same API. The API already keys everything by identity, so it just needs to read the `x-subject` header (or the subject is in the request body) to route to the right brain prompt pack. No separate backends needed.

---

## Sprint Plan

### Sprint A — Draw the Seam (1 session)

**Goal:** Extract the subject registry; make RoastMyRide a shell mounting `car`. The car flow must be byte-identical. `pnpm verify` green. No new app shipped.

**What to do:**
1. Create `shell/src/subjects/car.js` — move all car-specific strings, prompts, and behavior from the current app into a config object.
2. Create `shell/src/subjects/index.js` — registry that resolves `id → config`.
3. Update `App.jsx` to read `import.meta.env.VITE_SUBJECT` and load the config.
4. Replace every hardcoded car string in the screens with a `config.*` lookup.
5. Update `buildRenderSpec` to use `config.subjectNoun` instead of hardcoded car labels.
6. Update the brain's `RoastInput` to carry a `subject` field (or the brain reads the config's prompt pack directly).
7. Verify: `pnpm verify` green, e2e passes, the car flow is visually identical.

**What NOT to do:** Don't build a second app yet. Don't add the in-app picker. Don't change the UI. This is purely extraction and verification.

### Sprint B — Second App, End to End (1 session)

**Goal:** Build Roast My Texts as a separate shell instance. Prove the template works. This is where any lingering car-coupling surfaces and dies.

**What to do:**
1. Create `shell/src/subjects/texts.js` — the texts config (upload multi-image, research=none, safety="jokes about the texts, never the people involved").
2. Build the app: `VITE_SUBJECT=texts pnpm build`.
3. Run the flow: upload 3 screenshots, pick roaster, generate, save, share. The reel should show the text screenshots as the subject.
4. Fix any car-coupling that surfaces (e.g., "researching your ride" hardcoded somewhere, the hook saying "your ride" instead of "your texts").
5. Add the texts-specific chip buckets (e.g., "Tone: Sarcastic / Playful / Brutal", "Focus: Grammar / Drama / The read receipts").
6. Write the ASO keyword map for texts.

**What NOT to do:** Don't add the Capacitor iOS wrap yet. Don't add the store listing. This is a working build that proves the template.

### Sprint C — Fan Out (3 apps, ~1 session each, parallelizable)

**Goal:** Spin Outfit, Room, and Profile from the template. Each is a config + prompt pack + icon theme + ASO keywords.

**What to do per app:**
1. Write the subject config (`subjects/fit.js`, `subjects/room.js`, `subjects/profile.js`).
2. Write the brain prompt pack (research prompt, safety frame, comedic register, subject noun).
3. Design the subject-specific chip buckets (what the user can toggle to shape the roast).
4. Build and verify the flow works end to end.
5. Generate the app icon and splash (same Callie art, different background color).
6. Write the ASO keyword map.

**Order matters:** Build the hardest subject first (Profile, because it has the most privacy/complexity), then the easiest (Room), then Fit in between. This gives you the range early.

### Sprint D — Growth Layer (1 session)

**Goal:** Make the 5 apps cross-promote and A/B test as a fleet.

**What to do:**
1. **Cross-promo:** Add a "More from Callie's Universe" row in Settings. Tapping an app opens its App Store page (or web URL if not installed). This turns 5 separate funnels into one network.
2. **Paywall A/B:** Run a hard-paywall ($4.99–6.99/wk) vs credits A/B test. The engine already supports both; just add a `config.paywallMode` flag per subject and track which converts better per app.
3. **Shared analytics:** Key events by `app_id` (subject) so you can compare funnel metrics across the fleet. Events: `upload`, `roast_start`, `roast_complete`, `save_video`, `share`, `purchase`, `paywall_impression`.
4. **App Store Optimization:** Write the listing copy (name, subtitle, description, keywords) for each subject. Generate subject-specific screenshots (same UI, different subject content).

### Q4 — Roast My Wrapped (Seasonal Event, 1 day)

**Goal:** A seasonal drop that reuses the template with a `wrapped` config. Spotify Wrapped drops in late November — people are already posting their year-in-review. The app roasts their Wrapped summary.

**What to do:**
1. Subject config: `wrapped` — upload a screenshot of your Spotify Wrapped, the AI roasts your music taste.
2. Prompt pack: "Research this person's music taste from their Wrapped summary. Roast their top artist, most-played song, and genre distribution."
3. Launch in October, sunset in January. The listing can stay dormant the rest of the year.

---

## The iOS Decision (You Must Decide Now)

The fleet strategy only pays off on the App Store. ASO, exact-match keywords, and "roast my texts" ranking #1 — none of that works for 5 web URLs. This plan forces the iOS decision.

### Option A: Capacitor (Recommended)

Wrap each shell build as a Capacitor iOS app. The web build is 100% reused. The native layer is thin (camera, share, haptics, status bar, safe areas). You already have the Capacitor wrap started for RoastMyRide.

**Pros:** Reuses 100% of 3 sprints. Ships in days. One build pipeline produces the web + iOS artifact. The reel (your competitive moat) stays pixel-identical because it's the same web tech.
**Cons:** WKWebView can jank on older devices. The reel is a short animation so it's likely fine, but verify on a real iPhone.

**Decision:** Pick this now. Wrap the shell with Capacitor from Sprint A. Every app build produces both a web deploy and an iOS bundle.

### Option B: React Native (Don't)

The reel is a web/Remotion artifact, and that's load-bearing. RN can't run Remotion. You'd have to reimplement the reel in Reanimated/Skia and keep it pixel-identical to the Remotion export. That's a permanent two-implementation tax. Not worth it for this product.

### Option C: Web-First (Delay iOS)

Keep shipping web-first. Validate funnel metrics cheaply. Wrap to iOS only after a subject proves its conversion. This is lower risk but slower — you lose the ASO land grab window.

**My recommendation:** Capacitor now for all 5. The web build stays the primary artifact; Capacitor is just the distribution layer. You can still validate on web before submitting each to the store, but the wrap is ready.

---

## Monetization Across the Fleet

| App | Credit Model | Paywall A/B | Expected LTV |
|-----|-------------|-------------|--------------|
| Roast My Ride | 3 free → $3.99/5 roasts | Hard wall ($5.99/wk) vs credits | Medium (one-and-done) |
| Roast My Texts | 3 free → $3.99/5 roasts | Credits preferred (high repeat) | High (screenshot = new roast) |
| Roast My Fit | 3 free → $3.99/5 roasts | Hard wall ($6.99/wk) | Medium-High (fashion repeat) |
| Roast My Room | 3 free → $3.99/5 roasts | Hard wall ($4.99/wk) | Medium |
| Roast My Profile | 3 free → $3.99/5 roasts | Credits preferred (profile updates) | High |

**Fleet economics:** The cross-promo row in Settings means each app's install cost can be amortized across the fleet. A user who discovers Roast My Ride and pays there is 5× more likely to install Roast My Texts because they already trust the brand. The marginal acquisition cost of app #2–5 is near zero for existing users.

**RevenueCat:** Use the same RevenueCat project, different offerings per app. The shared `purchases.js` seam already supports this — just add `config.revenueCatOffering` to the subject config.

---

## ASO Keyword Map (Per App)

Each app owns its exact-match keyword. The generic "roast" keywords are secondary.

| App | Primary Keywords | Secondary Keywords |
|-----|-----------------|-------------------|
| Roast My Ride | roast my car, car roast, roast my ride | funny car, AI comedy, car video |
| Roast My Texts | roast my texts, text roast, screenshot roast | funny texts, AI comedy, message roast |
| Roast My Fit | roast my fit, fit check, outfit roast | fashion roast, style roast, AI comedy |
| Roast My Room | roast my room, room roast, decor roast | interior roast, home roast, AI comedy |
| Roast My Profile | roast my profile, dating roast, profile roast | hinge roast, bumble roast, AI comedy |

**Screenshot strategy:** Same UI shell, different subject content. Generate 5 screenshots per app: onboarding → upload → pick roaster → reveal reel → save/share. The subject content in the screenshots is the only thing that changes.

---

## What the Code Actually Looks Like

### Subject Config (the whole per-app delta)

```js
// subjects/texts.js
export default {
  id: "texts",
  appName: "Roast My Texts",
  upload: {
    label: "Drop your screenshots",
    subcopy: "The messier the conversation, the harder we cook.",
    accepts: "image/*",
    maxFiles: 3,
  },
  brain: {
    researchPrompt: null, // texts don't need research; the AI reads the image
    safety: "The jokes are about the TEXTS and the conversation, never the people involved. No real names, no doxxing, no targeting individuals. PG-13. Clever, never cruel.",
    subjectNoun: "this conversation",
    register: "sarcastic relationship expert",
  },
  theme: {
    accent: "#14B8A6", // teal
    emoji: "💬",
    mascotContext: "texts",
    backgroundStyle: "blocks",
  },
  aso: {
    subtitle: "Turn your worst texts into comedy gold",
    keywords: ["roast", "texts", "screenshots", "funny", "AI comedy", "message roast"],
  },
  monetization: {
    creditLabel: "reads",
    defaultCredits: 3,
  },
};
```

### Shell App Mounting

```jsx
// shell/src/App.jsx
import { subject } from "./subjects";
// subject is resolved from import.meta.env.VITE_SUBJECT
// → loads the correct config, sets CSS vars, wires the flow
```

### The Reel Scene (unchanged, just prop-driven)

The `StageScene` component already receives `carPhoto` as a prop. For texts, it receives `subjectPhotos` (array of 3 screenshots). The scene just shows them as stickers. The captions, the comic, Callie — all unchanged. The subject is just the visual content, not the scene structure.

```jsx
// StageScene already supports this:
<StageScene
  comedianId={standup.comedianId}
  performerName={result.roasterName}
  subjectPhotos={input.subjectPhotos} // array of dataUrls
  segments={segments}
  timeMs={timeMs}
  // ... everything else unchanged
/>
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| **iOS rejection** (Guideline 1.1.6: anonymous calls / pranks) | This isn't that. Every app roasts user-submitted content. No auto-dialing. No third-party targeting. PG-13. The profile app is the highest risk — include a consent screen: "These are MY texts/profile. I have permission to share them." |
| **App Store review flags AI-generated content** | Disclose in the app (Settings → "Roast text is generated by AI"). Already in the Privacy doc. Add a per-app consent screen if the subject is people-facing. |
| **One app tanks the whole brand** | Each app is a separate listing with its own ASO and reviews. A ban on one doesn't cascade. The shared engine is backend-only — the App Store never sees it. |
| **Reel jank on iOS** | The Capacitor wrap uses a WKWebView. The reel is a short animation (captions + stickers). If it janks on target devices, the escape hatch is to move just the live reel to native (Skia/Reanimated) while keeping the rest web. Don't decide this now — verify on a real device first. |
| **Brain prompt drift** | Each subject has its own prompt pack. The shared brain just swaps the system prompt. The safety frame is per-subject. Test each subject's prompt pack with adversarial inputs before shipping. |

---

## Next Step

Pick **Sprint A** (draw the seam) and I'll start extracting the subject registry from the current RoastMyRide app, making it a shell mounting `car`. The output will be a working car flow that is byte-identical to today, but with all car-specific logic living in a config object. `pnpm verify` stays green. Then we pick Sprint B (Roast My Texts) and prove the template.

The only thing I need from you to start: **confirm Capacitor is the iOS wrapper** (so I build the shell Capacitor-ready from day one) and **confirm the 5 subjects** (or swap any of them). Everything else is code I can write without input.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
