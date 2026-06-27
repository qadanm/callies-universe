# RoastMyRide — App UI kit (iOS)

Interactive recreation of the RoastMyRide mobile app: a 9-screen click-through inside an iPhone frame. The flow demonstrates the core loop and every screen in the brief.

## Run it
Open `index.html`. Use the **screen picker** chips above the phone to jump to any screen, or follow the natural flow. There is a **single CTA — roast my car** — and the whole flow is just three steps: two photos, then the cast.

`Onboarding → Home/Upload (Photo 1: your car) → Photo 2: selfie or profile screenshot → The Cast: pick your roaster → Cooking → Reveal + share → Celebrate`

Plus the standalone surfaces: **Credits/paywall** and **Settings**.

## Files
- `index.html` — phone frame, status bar, tab bar, screen router + picker.
- `screensA.jsx` — Onboarding, Home/Upload (Photo 1), the **Cast** character-picker, Cooking. Exports screens + shared helpers (`RMR_Eyebrow`, `RMR_H`, `RMR_ScreenScroll`, `RMR_stickyBar`) to `window`.
- `screensB.jsx` — Reveal+share, Celebrate, Photo 2 (selfie/profile), Paywall, Settings.

## Composition
Screens compose design-system primitives from `window.RoastMyRideDesignSystem_896616` (Button, Card, Badge, Mascot, MascotHost, Roaster, Confetti, ShareCard, CreditTile, Sheet). No primitive is re-implemented here.

## System notes
- **Maximalist skin, clean bones:** decoration (confetti, mascot, stickers, warm radial washes) sits behind/around a clean functional core. All text uses ink/ink-soft on canvas (AA).
- Sticky action bars keep the primary CTA one thumb-reach away.
- Cooking auto-advances to Reveal (~3.8s) to simulate the render.
- Settings is intentionally quiet — companion font, plain rows, no decoration.
