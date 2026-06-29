# RoastMyRide → iOS (Capacitor)

The app ships to the App Store as a native shell around the existing web build.
The web build and `pnpm verify` do NOT depend on Capacitor — the native layer
(`src/native.js`) detects `window.Capacitor` at runtime and loads plugins via
dynamic import, so nothing here changes the web build.

## One-time setup (on a Mac with Xcode + CocoaPods)

```bash
# from apps/roastmyride-app
pnpm add @capacitor/core @capacitor/ios @capacitor/status-bar \
         @capacitor/splash-screen @capacitor/haptics @capacitor/app \
         @capacitor/keyboard @capacitor/camera @capacitor/share \
         @capacitor/filesystem @revenuecat/purchases-capacitor
pnpm add -D @capacitor/cli

# build the web app pointed at your hosted backend, then add iOS
VITE_ROAST_API=https://<your-api-host> pnpm build
npx cap add ios
npx cap sync ios
npx cap open ios     # opens Xcode → set the team/bundle id, run on a device
```

Set the bundle id to your real one in `capacitor.config.json` (`appId`, currently
`com.callies.roastmyride`) and in Xcode signing.

## Every build after a code change

```bash
VITE_ROAST_API=https://<your-api-host> pnpm build && npx cap sync ios
```

## Native behavior already wired (no-op on web)

- Full-bleed layout with real safe-area insets; the simulated phone frame + dev
  picker + fake status bar are dropped on device (`Layout` in `App.jsx`).
- Status bar styled, splash hidden, web-isms (overscroll bounce, tap highlight,
  text selection, pinch-zoom) disabled (`src/native.js` + `app.css` `html.native`).

## Still to wire (next steps)

- **RevenueCat IAP** for credits (replaces Stripe in the native build) — drops into
  the existing `src/services/purchases.js` seam.
- **Native photo pick** (`@capacitor/camera`) and **native share sheet**
  (`@capacitor/share` + `@capacitor/filesystem` for the MP4/PNG) — behind the
  existing photo + save seams.
- **Haptics** on primary actions (`haptic()` in `src/native.js` is ready to call).
- App icon + splash art (from Callie), App Store screenshots.
