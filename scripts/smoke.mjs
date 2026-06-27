// Headless render check for @callies-universe/core.
// Renders the built package to static HTML and asserts the whole surface is
// present: all 9 Callie states, every component, and all 8 cast avatars.
// This is the no-browser half of the acceptance test (the preview is the visual half).
//
// Run:  pnpm run smoke   (builds core first, then this)

import { createElement as h, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as core from "../core/dist/index.js";

const CALLIE_STATES = [
  "idle", "curious", "cooking", "delighted", "savage",
  "comfort", "celebrating", "empty", "error",
];

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };

// --- Build a tree exercising the full public API ---
const tree = h(Fragment, null,
  // Callie: every state, by name
  ...CALLIE_STATES.map((s) => h(core.Callie, { key: s, state: s, size: 80 })),
  // Imperative + behavioral wrappers
  h(core.CallieStage, { initialState: "idle" }),
  h(core.CallieHost, { context: "cooking", bubble: true }),
  // Primitives
  h(core.Button, { variant: "primary" }, "Go"),
  h(core.Button, { variant: "accent" }, "Accent"),
  h(core.Button, { variant: "secondary" }, "Secondary"),
  h(core.Button, { variant: "ghost", disabled: true }, "Ghost"),
  h(core.Chip, { selected: true }, "Chip"),
  h(core.Card, { sticker: h(core.Badge, { tone: "flame" }, "NEW") }, "Card body"),
  h(core.Input, { label: "Name", error: "nope" }),
  ...["ember", "flame", "success", "info", "cool", "pink", "ink"].map((t) =>
    h(core.Badge, { key: t, tone: t }, t)),
  ...["ink", "success", "danger", "flame"].map((t) =>
    h(core.Toast, { key: t, tone: t }, t)),
  h(core.Confetti, { active: true, count: 8 }),
  h(core.Sheet, { open: true, title: "Sheet" }, "Sheet body"),
  // Cast
  ...core.Roaster.roster.map((r) => h(core.Roaster, { key: r.id, id: r.id, ring: true })),
  h(core.CastPicker, { initialId: "mama" }),
);

let html = "";
try {
  html = renderToStaticMarkup(tree);
} catch (err) {
  console.error("✗ render threw:", err);
  process.exit(1);
}

// --- Assertions ---
assert(html.length > 2000, `output suspiciously short (${html.length} chars)`);

for (const s of CALLIE_STATES) {
  assert(html.includes(`Callie (${s})`), `missing Callie state: ${s}`);
}

assert(core.Roaster.roster.length === 8, `expected 8 roasters, got ${core.Roaster.roster.length}`);
for (const r of core.Roaster.roster) {
  assert(html.includes(r.name), `missing roaster avatar: ${r.name}`);
}

// Every named export the barrel promises is actually a function/component.
for (const name of [
  "Button", "Chip", "Card", "Input", "Badge", "Sheet", "Toast", "Confetti",
  "Mascot", "Callie", "CallieStage", "MascotHost", "CallieHost", "Roaster", "CastPicker",
]) {
  assert(core[name] != null, `missing export: ${name}`);
}

if (failures.length) {
  console.error("✗ smoke test FAILED:");
  for (const f of failures) console.error("   - " + f);
  process.exit(1);
}

console.log(`✓ smoke test passed — ${html.length} chars rendered.`);
console.log(`  · 9 Callie states, ${core.Roaster.roster.length} cast avatars, all components.`);
