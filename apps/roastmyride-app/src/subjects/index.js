import car from "./car.js";
import texts from "./texts.js";
import outfit from "./outfit.js";
import room from "./room.js";
import profile from "./profile.js";

const REGISTRY = { car, texts, outfit, room, profile };

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
