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
  await page.setInputFiles('[data-testid="photo-file"]', { name: "photo.png", mimeType: "image/png", buffer: onePxPng });
  try {
    await page.getByAltText("Your car").first().waitFor({ state: "visible", timeout: 6000 });
    check(true, "Car photo upload renders a real preview (compressed in-browser)");
  } catch {
    check(false, "Car photo upload renders a real preview (compressed in-browser)");
  }

  // --- Context chips (core Chip) ---
  await clickName(/Roast my car/); // the Card CTA advances to /chips
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
  await seeText("The full set", 20000); // the transcript heading under the reel
  const revealText = await page.locator(".screen").innerText();
  check(/cry for help|trying|axle|unmoved|vibes|rust|never leave|It is a car|tired of trying/i.test(revealText),
    "Reveal shows the brain's set copy (punch-word present)");
  check(/mic drop/i.test(revealText),
    "Reveal reads the richer set (transcript closer / mic-drop present)");
  check((await page.locator('[data-testid="stage-scene"]').count()) >= 1, "Roast reel (stage scene) renders");
  check((await callieCount()) >= 1, "Callie reacts in the reel (sticker)");

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
  check((await page.getByText("left", { exact: false }).count()) >= 1, "Settings shows live credit balance");

  // --- Legal (privacy) reachable ---
  await page.goto(`${BASE}/#/legal/privacy`, { waitUntil: "networkidle" });
  await seeText("Privacy & data");
  check((await page.getByText("We don't store it", { exact: false }).count()) >= 1, "Privacy page renders");

  // --- monetization: deduct · persist · buy · gate ---
  const creditsNow = async () => {
    const m = (await page.locator("body").innerText()).match(/(\d+)\s+roasts left/);
    return m ? Number(m[1]) : null;
  };
  await page.goto(`${BASE}/#/home`, { waitUntil: "networkidle" });
  await seeText("roasts left");
  check((await creditsNow()) === 2, "a credit was deducted by the roast (3 → 2)");

  await page.reload({ waitUntil: "networkidle" });
  await seeText("roasts left");
  check((await creditsNow()) === 2, "credits persist across reload");

  await page.goto(`${BASE}/#/credits`, { waitUntil: "networkidle" });
  await seeText("keep cooking");
  await clickName(/Get \d+ roasts/); // mock-buys the default bundle (5)
  await seeText("roasts left");
  check((await creditsNow()) === 7, "mock purchase grants credits (2 → 7)");

  // set 0 in storage + reload so the app re-reads persisted credits
  await page.evaluate(() => localStorage.setItem("rmr.credits", "0"));
  await page.reload({ waitUntil: "networkidle" });
  await page.goto(`${BASE}/#/home`, { waitUntil: "networkidle" });
  await seeText("roasts left");
  check((await creditsNow()) === 0, "credits reset to 0 (persisted across reload)");
  await clickName(/Roast my car/);
  await seeText("out of roasts");
  check(true, "0 credits gates 'Roast my car' to the paywall");

  // --- resilience: offline banner ---
  await page.context().setOffline(true);
  await page.waitForTimeout(300);
  check((await page.getByText("You're offline", { exact: false }).count()) >= 1, "offline banner shows when offline");
  await page.context().setOffline(false);

  // --- PANEL ("Green Room"): two comics riff → the two-shot reel ---
  await page.evaluate(() => localStorage.setItem("rmr.credits", "5"));
  await page.goto(`${BASE}/#/cast`, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" }); // remount so the provider re-reads credits=5
  await seeText(/taking the stage|Tonight's lineup/);
  await page.locator('[data-testid="format-panel"]').click();
  check((await page.getByText("Pick your duo", { exact: false }).count()) >= 1, "Green Room toggle reveals the duo picker");
  await page.locator('[data-testid="duo-mama"]').click();
  await page.locator('[data-testid="duo-tony"]').click();
  await clickName(/green room/i); // CTA enabled once two are picked → /cooking
  await seeText("Warming up");
  await seeText("The full set", 20000);
  await page.waitForTimeout(4000); // let the branded intro (Callie's Universe ident → title) play through to the hosts
  const panelText = await page.locator('[data-testid="stage-scene"]').first().innerText();
  check(/Mama/i.test(panelText) && /Tony/i.test(panelText), "Panel reveal shows BOTH comics (the two-shot)");
  check((await page.locator('[data-testid="stage-scene"]').count()) >= 1, "Panel roast reel (stage scene) renders");

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
