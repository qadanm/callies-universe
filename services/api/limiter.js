// Fixed-window rate limiter (in-memory). Keyed by identity (or IP). A Redis-backed
// limiter is the documented swap for multi-instance deploys (same hit() API).
export function createLimiter({ windowMs = 60000, max = 60 } = {}) {
  const hits = new Map(); // key → { count, resetAt }
  return {
    max,
    windowMs,
    /** @returns {{ ok:boolean, remaining:number, resetMs:number }} */
    hit(key) {
      const now = Date.now();
      let e = hits.get(key);
      if (!e || now >= e.resetAt) {
        e = { count: 0, resetAt: now + windowMs };
        hits.set(key, e);
      }
      e.count += 1;
      return { ok: e.count <= max, remaining: Math.max(0, max - e.count), resetMs: e.resetAt - now };
    },
  };
}
