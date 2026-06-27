// services/brain — a tiny in-memory cache.
//
// Efficiency where it doesn't cost comedy: research grounding is the same for
// every character roasting the same car, so we research a car once and reuse it
// across performers (the demo roasts one car with the whole cast → one research
// pass, eight sets). Writing and grading are NEVER cached — the funny must be
// generated fresh every time.

const store = new Map();

export function cacheKey(car) {
  const c = car || {};
  return [c.year, c.make, c.model, c.trim, c.label]
    .map((v) => (v == null ? "" : String(v).trim().toLowerCase()))
    .join("|");
}

export async function memo(key, produce) {
  if (store.has(key)) return store.get(key);
  const value = await produce();
  store.set(key, value);
  return value;
}

export function clearCache() {
  store.clear();
}
