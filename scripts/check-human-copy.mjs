#!/usr/bin/env node
/*
 * Human-copy guard. Fails if any USER-FACING source file contains an em dash
 * (U+2014) or an en dash (U+2013). Those two characters are the loudest "written
 * by AI" tell, and anything a user actually reads (the websites, the app UI, the
 * shared components, the on-screen show captions) must read like a person wrote it.
 * See docs/WRITING-STYLE.md.
 *
 * Scope is the user-facing surfaces only (see ROOTS below). The show's roasts stay
 * clean two other ways: the curated offline sets ship clean, and the roast-writing
 * prompts in services/brain tell the model never to use these dashes. Internal-only
 * code (the engine, scripts, docs) is intentionally NOT policed here.
 *
 * Allowed and ignored on purpose: the hyphen "-", the ellipsis character, and
 * curly quotes. Those are normal human typography.
 *
 * Wired into `pnpm run lint:human` and `pnpm run verify`.
 */
import { readFileSync, statSync } from "node:fs";
import { execSync } from "node:child_process";

const EM = String.fromCharCode(0x2014); // em dash, built from its code point so this file has no literal dash
const EN = String.fromCharCode(0x2013); // en dash

// Build artifacts and generated output never count (they regenerate).
const SKIP_DIR = /(^|\/)(node_modules|dist|build|out|ios|android|\.git|\.astro|coverage|live-panel-out)\//;
const SKIP_FILE = /(\.map$|-lock\.(json|yaml)$|package-lock\.json$|brain-demo-.*\.md$)/;
const TEXT_EXT = /\.(js|jsx|ts|tsx|mjs|cjs|astro|css|md|json|html|txt)$/;

// User-facing surfaces only. These are what a person actually reads.
const ROOTS = [
  "web/src", // the six marketing websites
  "apps/roastmyride-app/src", // the app UI, the on-screen scene captions, per-app copy
  "core/src", // shared components, the cast catchphrases, Callie
  "preview/src", // the component gallery
];

let files = [];
try {
  // tracked + untracked within the user-facing roots, honoring .gitignore
  files = execSync(`git ls-files --cached --others --exclude-standard -- ${ROOTS.join(" ")}`, {
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
  })
    .split("\n")
    .filter(Boolean);
} catch {
  console.error("check-human-copy: not a git repo, nothing to scan.");
  process.exit(0);
}

const offenders = [];
for (const f of files) {
  if (SKIP_DIR.test("/" + f) || SKIP_FILE.test(f) || !TEXT_EXT.test(f)) continue;
  let text;
  try {
    if (statSync(f).size > 3 * 1024 * 1024) continue;
    text = readFileSync(f, "utf8");
  } catch {
    continue;
  }
  if (!text.includes(EM) && !text.includes(EN)) continue;
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(EM) || lines[i].includes(EN)) {
      offenders.push(`  ${f}:${i + 1}  ${lines[i].trim().slice(0, 90)}`);
    }
  }
}

if (offenders.length) {
  console.error(`\nHuman-copy check FAILED: ${offenders.length} line(s) still use an em or en dash.`);
  console.error("Rewrite them the way a person would: a comma, a period, a colon, parentheses, or ... for a pause.");
  console.error("Rule: docs/WRITING-STYLE.md\n");
  console.error(offenders.slice(0, 250).join("\n"));
  if (offenders.length > 250) console.error(`  ... and ${offenders.length - 250} more.`);
  console.error("");
  process.exit(1);
}

console.log("Human-copy check passed: no em or en dashes in source.");
