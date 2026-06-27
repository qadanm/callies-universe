// RoastMyRide — headless click-through (the milestone acceptance test).
// Boots against an already-running dev server, walks the whole flow, and asserts
// each screen renders, Callie is present, the ember theme applied, and the mock
// roast reaches the reveal. No screenshots — pure navigation + content assertions.
//
// Usage: start the app dev server, then `node apps/roastmyride-app/scripts/e2e.mjs`.

import { chromium } from "playwright-core";

const BASE = process.env.BASE || "http://localhost:5180";
const fails = [];
const ok = (m) => console.log("  ✓ " + m);
const check = (cond, m) => (cond ? ok(m) : (fails.push(m), console.log("  ✗ " + m)));

// Use the environment's preinstalled Chromium (its build may differ from
// playwright-core's pinned one, so resolve the binary rather than the default).
import { existsSync, readdirSync } from "node:fs";
function findChromium() {
  if (process.env.CHROMIUM_BIN && existsSync(process.env.CHROMIUM_BIN)) return process.env.CHROMIUM_BIN;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const dir of readdirSync(root).filter((d) => d.startsWith("chromium-")).sort().reverse()) {
    const p = `${root}/${dir}/chrome-linux/chrome`;
    if (existsSync(p)) return p;
  }
  return undefined;
}
const browser = await chromium.launch({ headless: true, executablePath: findChromium() });
const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });
// Real app errors = uncaught JS exceptions. Benign in this sandbox: the Google
// Fonts CDN (no external net → cert error) and a favicon 404; we don't fail on those.
const jsErrors = [];
const resourceWarnings = [];
page.on("pageerror", (e) => jsErrors.push(String(e)));
page.on("console", (m) => {
  if (m.type() !== "error") return;
  const t = m.text();
  if (/Failed to load resource|net::ERR_|favicon|fonts\.googleapis/i.test(t)) resourceWarnings.push(t);
  else jsErrors.push(t);
});

const seeText = (t, timeout = 8000) =>
  page.getByText(t, { exact: false }).first().waitFor({ state: "visible", timeout });
const clickName = (re) => page.getByRole("button", { name: re }).first().click();
const callieCount = () => page.locator('[aria-label^="Callie ("]').count();

try {
  // --- Onboarding ---
  await page.goto(`${BASE}/#/`, { waitUntil: "networkidle" });
  await seeText("I just react");
  check((await callieCount()) >= 1, "Onboarding renders with Callie present");

  // ember theme actually filled the accent slot
  const accent = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--accent-600").trim()
  );
  check(accent.toUpperCase() === "#C7340F", `ember accent applied (--accent-600 = ${accent})`);

  // --- Home ---
  await clickName(/Roast my car/);
  await seeText("Drop a pic of your ride");
  check(true, "Home / upload reachable");

  // Real car-photo capture: set a file on the hidden input → confirm a preview renders.
  const onePxPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  await page.setInputFiles('[data-testid="car-file"]', { name: "car.png", mimeType: "image/png", buffer: onePxPng });
  try {
    await page.getByAltText("Your car").first().waitFor({ state: "visible", timeout: 6000 });
    check(true, "Car photo upload renders a real preview (compressed in-browser)");
  } catch {
    check(false, "Car photo upload renders a real preview (compressed in-browser)");
  }

  // --- Profile-roast (consent) ---
  await clickName(/Roast my car/); // the Card CTA advances to /profile
  await seeText("Make it personal");
  check(true, "Profile-roast / consent screen reachable");

  // --- Context chips (core Chip) ---
  await clickName(/Next/);
  await seeText("How should we cook it");
  await page.getByRole("button", { name: /Brutal/ }).first().click(); // toggle a core Chip
  check(true, "Context chips screen reachable; a Chip toggled");

  // --- The Cast (core CastPicker) ---
  await clickName(/Continue|Skip seasoning/);
  await seeText(/taking the stage|Tonight's lineup/);
  check((await page.getByText("Meet the cast").count()) >= 1, "CastPicker (core) rendered");

  // --- Warming up → (brain generates the set) → Reveal ---
  await clickName(/on stage/);
  await seeText("Warming up");
  check(true, "Warming-up screen runs the brain pipeline (offline fallback with no key)");

  // Reveal arrives automatically when the brain resolves.
  await seeText("Now performing", 12000);
  const revealText = await page.locator(".screen").innerText();
  check(/cry for help|trying|axle|unmoved|vibes|rust|never leave|It is a car|tired of trying/i.test(revealText),
    "Reveal shows the brain's set copy (punch-word present)");
  check(/mic drop/i.test(revealText),
    "Reveal reads the richer set (transcript closer / mic-drop present)");
  check((await callieCount()) >= 1, "Callie reacts on the reveal (in the crowd / clip corner)");

  // --- Share success ---
  await clickName(/Share the clip/);
  await seeText(/Set's live|live/);
  check(true, "Share-success (Sheet) reachable");

  // --- Credits (core-driven CreditTile) via dev picker ---
  await page.getByRole("button", { name: "Credits", exact: true }).first().click();
  await seeText("keep cooking");
  check((await page.getByText("$3.99").count()) >= 1, "Paywall renders CreditTiles");

  // --- Settings via dev picker ---
  await page.getByRole("button", { name: "Settings", exact: true }).first().click();
  await seeText("Accessibility");
  check(true, "Settings reachable");

  check(jsErrors.length === 0, `no uncaught JS errors (${jsErrors.length})`);
  if (jsErrors.length) jsErrors.slice(0, 5).forEach((e) => console.log("     ! " + e));
  if (resourceWarnings.length)
    console.log(`  · ${resourceWarnings.length} benign resource warning(s) ignored (font CDN / favicon, no external net)`);
} catch (err) {
  fails.push("navigation threw: " + err.message);
  console.log("  ✗ " + err.message);
} finally {
  await browser.close();
}

if (fails.length) {
  console.error(`\n✗ e2e FAILED — ${fails.length} issue(s).`);
  process.exit(1);
}
console.log("\n✓ e2e passed — full RoastMyRide flow navigable, Callie reacting, roast mocked.");
