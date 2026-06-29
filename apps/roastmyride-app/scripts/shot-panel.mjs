// Capture frames of the PANEL podcast scene (offline), with a real image on the
// studio monitor (we render a stand-in "car photo" first), across several shots.
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:5189";
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_BIN });

// 1) Render a stand-in car photo → PNG (so the monitor isn't a placeholder).
const carSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#aebfce"/><stop offset="0.6" stop-color="#6b7a8f"/><stop offset="1" stop-color="#39424f"/></linearGradient></defs>
  <rect width="640" height="400" fill="url(#bg)"/>
  <rect y="300" width="640" height="100" fill="#2b3038"/>
  <g transform="translate(70,150)">
    <rect x="0" y="70" width="500" height="92" rx="22" fill="#bcb4a6"/>
    <path d="M70 70 q44 -70 160 -70 h120 q92 0 120 70 z" fill="#cfc7b8"/>
    <rect x="118" y="16" width="92" height="50" rx="8" fill="#566776"/>
    <rect x="230" y="16" width="124" height="50" rx="8" fill="#566776"/>
    <circle cx="120" cy="168" r="42" fill="#191a1e"/><circle cx="120" cy="168" r="18" fill="#8a8a8a"/>
    <circle cx="402" cy="168" r="42" fill="#191a1e"/><circle cx="402" cy="168" r="18" fill="#8a8a8a"/>
    <rect x="0" y="120" width="500" height="9" fill="#8a8276"/>
  </g></svg>`;
{
  const p = await browser.newPage({ viewport: { width: 640, height: 400 } });
  await p.setContent(`<body style="margin:0">${carSvg}</body>`);
  const buf = await p.locator("svg").screenshot();
  writeFileSync("live-panel-out/sample-car.png", buf);
  await p.close();
}

// 2) Drive the full flow with the photo, capture frames across the timeline.
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
if (process.env.SAFE_DEBUG) await page.addInitScript(() => { window.__SAFE_DEBUG = true; });
try {
  await page.goto(`${BASE}/#/home`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("rmr.credits", "9"));
  await page.reload({ waitUntil: "networkidle" });
  await page.setInputFiles('[data-testid="photo-file"]', "live-panel-out/sample-car.png");
  await page.getByAltText(/your car/i).first().waitFor({ state: "visible", timeout: 6000 }).catch(() => {});
  await page.getByRole("button", { name: /Roast my car/i }).first().click(); // → chips
  await page.getByRole("button", { name: /Continue|Skip seasoning/i }).first().click(); // → cast
  await page.getByText(/Tonight's lineup|taking the stage/i).first().waitFor({ state: "visible", timeout: 8000 });
  await page.locator('[data-testid="format-panel"]').click();
  await page.locator('[data-testid="duo-mama"]').click();
  await page.locator('[data-testid="duo-tony"]').click();
  await page.getByRole("button", { name: /green room/i }).first().click();
  await page.getByText("The full set", { exact: false }).first().waitFor({ state: "visible", timeout: 20000 });
  const scene = page.locator('[data-testid="stage-scene"]').first();
  await scene.waitFor({ state: "visible", timeout: 8000 });

  const shots = [
    [400, "ident"],
    [1100, "title"],
    [900, "showcase"],
    [3600, "content1"],
    [6000, "content2"],
    [8300, "verdict"],
    [1700, "endcard"],
  ];
  let t = 0;
  for (const [wait, name] of shots) {
    await page.waitForTimeout(wait);
    t += wait;
    await scene.screenshot({ path: `live-panel-out/shot-${name}.png` });
    console.log(`shot ${name} @ ~${t}ms`);
  }
  console.log("OK");
} catch (e) {
  console.error("shot failed:", e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
