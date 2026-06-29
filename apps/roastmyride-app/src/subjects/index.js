// Subject registry — resolves VITE_SUBJECT to a config object.
// Add new subjects here; the shell mounts whichever one is built.

import car from "./car.js";

const REGISTRY = { car };

/** The active subject config, resolved at build time from VITE_SUBJECT. */
export const subject = REGISTRY[import.meta.env.VITE_SUBJECT] || REGISTRY.car;

/** Helper: safely read a nested path from the config with a fallback. */
export function cfg(path, fallback = "") {
  const keys = path.split(".");
  let v = subject;
  for (const k of keys) {
    if (v == null) return fallback;
    v = v[k];
  }
  return v == null ? fallback : v;
}
