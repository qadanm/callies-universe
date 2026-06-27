// services/brain — research cache (pluggable, persistent by default).
//
// Research grounding is identical for every character roasting the same car, and
// a car's reputation changes slowly — so research is the one thing worth caching
// HARD. We cache it once and reuse it: across the cast (in-process), across runs
// and processes (filesystem), and — in production — across all users (inject a
// shared store).
//
// Design:
//   • A tiny store interface: { get(key), set(key, value), clear() }.
//   • Default store: filesystem (Node), persistent via os.tmpdir, 30-day TTL.
//     In the browser (no fs) or tests → in-memory.
//   • Inject your own store (Redis / Upstash / Supabase / KV) via
//     config.researchCache so the same popular car is researched once, ever.
//   • memo() adds stampede dedup (concurrent misses for the same car research
//     once) and only writes on SUCCESS (a thrown research never poisons the cache).
//
// Node's fs is imported DYNAMICALLY (variable specifier + @vite-ignore) so this
// module — which rides into the browser app bundle via the brain barrel — never
// pulls node:fs into the browser build.

const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/** Stable cache key for a car identity. */
export function cacheKey(car) {
  const c = car || {};
  return [c.year, c.make, c.model, c.trim, c.label]
    .map((v) => (v == null ? "" : String(v).trim().toLowerCase()))
    .join("|");
}

/* ----------------------------- stores ----------------------------- */

function memoryStore() {
  const m = new Map();
  return {
    async get(k) {
      return m.has(k) ? m.get(k) : null;
    },
    async set(k, v) {
      m.set(k, v);
    },
    async clear() {
      m.clear();
    },
  };
}

/** Filesystem store (Node only). One JSON file per key, atomic writes, TTL.
 *  `dir` may be undefined → resolved to an os.tmpdir() subfolder lazily. */
function fileStore(dir, ttlMs) {
  let fsp = null;
  let path = null;
  let resolvedDir = dir;
  async function ready() {
    if (fsp) return;
    const fsName = "node:fs/promises";
    const pName = "node:path";
    const osName = "node:os";
    fsp = await import(/* @vite-ignore */ fsName);
    path = await import(/* @vite-ignore */ pName);
    if (!resolvedDir) {
      const os = await import(/* @vite-ignore */ osName);
      resolvedDir = path.join(os.tmpdir(), "callies-universe-brain-research-cache");
    }
    await fsp.mkdir(resolvedDir, { recursive: true });
  }
  const fileFor = (k) => path.join(resolvedDir, safeName(k) + ".json");

  return {
    async get(k) {
      try {
        await ready();
        const raw = await fsp.readFile(fileFor(k), "utf8");
        const entry = JSON.parse(raw);
        // TTL: a finite ttlMs caps freshness (0 → always stale). undefined/NaN
        // means "no TTL" — never expire on age.
        if (Number.isFinite(ttlMs) && Date.now() - entry.cachedAt > ttlMs) return null; // stale
        return entry.value ?? null;
      } catch {
        return null; // miss / unreadable / parse error → treat as miss
      }
    },
    async set(k, v) {
      await ready();
      const target = fileFor(k);
      const tmp = `${target}.${process.pid}.tmp`;
      // Write to a temp file then rename — readers never see a half-written file.
      await fsp.writeFile(tmp, JSON.stringify({ cachedAt: Date.now(), ttlMs, value: v }));
      await fsp.rename(tmp, target);
    },
    async clear() {
      try {
        await ready(); // resolves `resolvedDir` (and creates the dir)
        // Use resolvedDir, NOT the `dir` param — when no cacheDir/env is set the
        // param is undefined and readdir(undefined) would throw (and be silently
        // swallowed), leaving the cache uncleared.
        const files = await fsp.readdir(resolvedDir);
        await Promise.all(files.map((f) => fsp.rm(path.join(resolvedDir, f), { force: true })));
      } catch {
        /* nothing to clear */
      }
    },
  };
}

/* --------------------------- the cache ---------------------------- */

/**
 * Build a research cache. Resolution order:
 *   1. config.researchCache — an injected { get, set } store (Redis/Supabase/…).
 *   2. config.cacheMode === "memory" — in-process only (tests).
 *   3. Node → filesystem store (persistent across runs); browser → memory.
 *
 * Returns { get, set, clear, memo }.
 */
export function createResearchCache(config = {}) {
  const store = resolveStore(config);
  const inflight = new Map();

  return {
    get: (k) => store.get(k),
    set: (k, v) => store.set(k, v),
    // Always a Promise so callers can reliably `await cache.clear()`.
    clear: () => (store.clear ? store.clear() : Promise.resolve()),

    /** get → (dedup) produce → set-on-success. */
    async memo(key, produce) {
      const hit = await store.get(key);
      if (hit != null) return hit;
      if (inflight.has(key)) return inflight.get(key); // stampede: join the in-flight research

      const p = (async () => {
        const value = await produce();
        await store.set(key, value); // only reached if produce() resolved
        return value;
      })();
      inflight.set(key, p);
      try {
        return await p;
      } finally {
        inflight.delete(key);
      }
    },
  };
}

function resolveStore(config) {
  if (config.researchCache && typeof config.researchCache.get === "function") {
    return config.researchCache;
  }
  if (config.cacheMode === "memory") return memoryStore();

  const isNode =
    typeof process !== "undefined" && process.versions && process.versions.node;
  if (!isNode) return memoryStore();

  const env = process.env || {};
  // dir undefined → fileStore resolves an os.tmpdir() subfolder lazily.
  const dir = config.cacheDir || env.BRAIN_CACHE_DIR || undefined;
  const ttlMs = resolveTtl(config, env);
  return fileStore(dir, ttlMs);
}

/** Resolve the TTL: explicit config wins, then a *valid* env number, else default.
 *  A malformed env value (NaN) falls back to the default rather than disabling TTL. */
function resolveTtl(config, env) {
  if (config.cacheTtlMs !== undefined) return config.cacheTtlMs;
  if (env.BRAIN_CACHE_TTL_MS !== undefined && env.BRAIN_CACHE_TTL_MS !== "") {
    const n = Number(env.BRAIN_CACHE_TTL_MS);
    return Number.isFinite(n) ? n : DEFAULT_TTL_MS;
  }
  return DEFAULT_TTL_MS;
}

/* --------------------- default singleton + helpers --------------------- */

let _default = null;

/** The reused, process-wide default cache (created lazily). */
export function defaultResearchCache(config = {}) {
  // Bespoke caches (injected store / explicit mode / dir / TTL) are NOT the
  // singleton — otherwise a later call with a different cacheTtlMs/dir would be
  // silently ignored in favour of the first-created singleton's config.
  if (
    config.researchCache ||
    config.cacheMode ||
    config.cacheDir ||
    config.cacheTtlMs !== undefined
  ) {
    return createResearchCache(config);
  }
  if (!_default) _default = createResearchCache(config);
  return _default;
}

/** Clear the default singleton (used by tests and manual cache busting). */
export async function clearCache() {
  if (_default) await _default.clear();
  _default = null;
}

/** Filesystem-safe, collision-resistant filename for a cache key. */
function safeName(key) {
  const slug = String(key)
    .replace(/[^a-z0-9]+/gi, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "");
  return `${slug || "k"}_${hash(String(key))}`;
}

function hash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
