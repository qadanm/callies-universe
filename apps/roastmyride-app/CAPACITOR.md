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

## App icon + splash

Source art is in `assets/` — `icon-only.png` (1024×1024) + `splash.png` (a flame on
the ember/cream brand) + `icon.svg` (editable source). Generate every iOS size:

```bash
pnpm add -D @capacitor/assets
npx @capacitor/assets generate --ios   # reads assets/, writes the iOS icon set + splash
```

Swap `assets/icon-only.png` / `assets/splash.png` for your own art anytime and re-run.

## Done (wired, no-op on web)

- **RevenueCat IAP** in `src/services/purchases.js` (native path) + the server-side
  consumable grant (`/webhook` → ledger). Set `VITE_RC_IOS_KEY`, create the four
  `rmr_credits_*` products in App Store Connect, point them at a RevenueCat offering,
  and set `REVENUECAT_WEBHOOK_AUTH` + the RC webhook URL to `<api>/webhook`.
- **Native photo pick** (`@capacitor/camera`), **share sheet** (`@capacitor/share` +
  `@capacitor/filesystem`), and **haptics** on the primary taps.
- App icon + splash (above).

## Still to do (yours)

- App Store screenshots (capture from the running app/TestFlight).
- Set the real bundle id + signing team in Xcode.
