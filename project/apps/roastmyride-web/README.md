# RoastMyRide — Website UI kit

The marketing landing page: one loud, single-CTA viral page. Every section pushes toward one action — **install the app**. No playable web demo (it would cannibalize installs); the page IS the ad.

## Run it
Open `index.html`.

## Sections (`landing.jsx`)
1. **Hero** — mascot + chunky headline + a looping example roast (a `ShareCard` with a play affordance) + the big install CTA and store badges.
2. **Proof wall** — a grid of UGC-style roast videos with view counts and hashtags.
3. **How it works** — three squishy steps: upload → tap chips → get your video.
4. **The mascot bit** — the cast of roasters on an ink background; sticker-collage moment, merch tease.
5. **Final CTA + footer** — repeated big install button and store badges.

## Notes
- Composes design-system primitives from `window.RoastMyRideDesignSystem_896616`.
- The install CTA is repeated and always within reach; it always sits on an AA-safe background even over sticker chaos.
- Store badges are **stylized placeholders**, not the official Apple/Google trademark badges — swap for the licensed assets at ship time.
- Decoration (confetti, stickers, washes) is purely the skin layer; headlines and body stay AA-legible.
