// Callie's Universe — flat ESLint config.
//
// Its one job this milestone: enforce the INWARD-ONLY dependency rule across the
// three layers, so the constraint exists from day one (even though only `core/`
// has content yet).
//
//     apps/  →  services/  →  core/        (never the reverse)
//
// Cross-layer code travels by package specifier (`@callies-universe/*`); relative
// climbs across layers are also blocked as defense-in-depth. `no-restricted-imports`
// is a core rule — no extra plugin, so the guard can't silently fall out of date.

const blockOutward = (layer, groups) => ({
  files: [`${layer}/**/*.{js,jsx,ts,tsx,mjs,cjs}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: groups,
            message:
              "Inward-only dependency rule: apps → services → core, never the reverse. This import points outward.",
          },
        ],
      },
    ],
  },
});

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.vite/**",
      "**/*.d.ts", // TypeScript declarations — typechecked by tsc, not this JS parser
      "project/**", // the design export (source of truth), not workspace code
      "apps/roastmyride-app/ios/DerivedData/**", // native build output
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    // The source carries a few `eslint-disable-next-line` hints for rules we don't
    // enable in this boundary-only config; don't flag them as unused.
    linterOptions: { reportUnusedDisableDirectives: "off" },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  // core/ depends on NOTHING internal — it may not reach services, apps, or the preview.
  blockOutward("core", [
    "@callies-universe/services",
    "@callies-universe/services/**",
    "@callies-universe/preview",
    "@callies-universe/preview/**",
    "**/services/**",
    "**/apps/**",
    "**/preview/**",
  ]),

  // services/ may consume core, but never apps.
  blockOutward("services", [
    "@callies-universe/preview",
    "@callies-universe/preview/**",
    "**/apps/**",
    "**/preview/**",
  ]),

  // apps/ and preview/ sit at the outside: they may consume services + core freely,
  // so no outward restriction is needed.
];
