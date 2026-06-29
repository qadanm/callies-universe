// services/brain: research CACHE check (no network).
//
// Verifies the persistent research cache: filesystem persistence across
// instances, TTL expiry, stampede dedup, success-only writes (a thrown produce
// never poisons the cache), and filesystem-key safety. Runs as part of the brain
// smoke so CI covers the production cost lever.
//
// Run: node scripts/cache-check.mjs

import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createResearchCache, cacheKey, clearCache } from "../src/cache.js";

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const dir = await mkdtemp(join(tmpdir(), "brain-cache-test-"));
// Point the DEFAULT singleton at a temp dir too, so this test never wipes a
// real user's cached research when it exercises clearCache().
process.env.BRAIN_CACHE_DIR = join(dir, "singleton");

try {
  // --- 1. filesystem round-trip + persistence across instances ---
  {
    const a = createResearchCache({ cacheDir: dir });
    await a.set("k1", { hello: "world", n: 42 });
    const b = createResearchCache({ cacheDir: dir }); // fresh instance, same dir
    const got = await b.get("k1");
    assert(got && got.hello === "world" && got.n === 42, "persistence: a second cache instance reads the value from disk");
  }

  // --- 2. memo dedups concurrent misses (stampede) and caches the result ---
  {
    const c = createResearchCache({ cacheDir: dir });
    let calls = 0;
    const produce = async () => { calls += 1; await sleep(20); return { v: "researched" }; };
    const results = await Promise.all([
      c.memo("stampede", produce),
      c.memo("stampede", produce),
      c.memo("stampede", produce),
      c.memo("stampede", produce),
    ]);
    assert(calls === 1, `stampede: produce should run once for concurrent misses, ran ${calls}`);
    assert(results.every((r) => r.v === "researched"), "stampede: all callers get the value");
    const after = await c.memo("stampede", produce);
    assert(calls === 1 && after.v === "researched", "stampede: a later call hits the cache (no re-produce)");
  }

  // --- 3. success-only writes: a thrown produce never poisons the cache ---
  {
    const c = createResearchCache({ cacheDir: dir });
    let threw = false;
    try {
      await c.memo("boom", async () => { throw new Error("research failed"); });
    } catch {
      threw = true;
    }
    assert(threw, "failure: memo rejects when produce throws");
    assert((await c.get("boom")) === null, "failure: a thrown produce leaves nothing cached");
    const ok = await c.memo("boom", async () => ({ v: "recovered" }));
    assert(ok.v === "recovered", "failure: a later good produce caches normally");
  }

  // --- 4. TTL expiry ---
  {
    const fast = createResearchCache({ cacheDir: dir, cacheTtlMs: 20 });
    await fast.set("ttl", { v: 1 });
    assert((await fast.get("ttl")) != null, "ttl: fresh entry is readable");
    await sleep(40);
    assert((await fast.get("ttl")) === null, "ttl: stale entry reads as a miss");
  }

  // --- 4b. TTL edge cases: 0 = always-stale; malformed env TTL → default (not disabled) ---
  {
    const zero = createResearchCache({ cacheDir: dir, cacheTtlMs: 0 });
    await zero.set("ttl0", { v: 1 });
    await sleep(2);
    assert((await zero.get("ttl0")) === null, "ttl: cacheTtlMs=0 means always stale (not 'no TTL')");

    const savedTtl = process.env.BRAIN_CACHE_TTL_MS;
    process.env.BRAIN_CACHE_TTL_MS = "not-a-number";
    const bad = createResearchCache({ cacheDir: dir }); // env TTL malformed → default
    await bad.set("ttlnan", { v: 1 });
    assert((await bad.get("ttlnan")) != null, "ttl: malformed env TTL falls back to default, doesn't disable expiry");
    if (savedTtl === undefined) delete process.env.BRAIN_CACHE_TTL_MS;
    else process.env.BRAIN_CACHE_TTL_MS = savedTtl;
  }

  // --- 5. filesystem-key safety: a hostile car identity can't escape the dir ---
  {
    const c = createResearchCache({ cacheDir: dir });
    const key = cacheKey({ make: "../../etc/passwd", model: "x/y", year: 2012 });
    await c.set(key, { v: "safe" });
    assert((await c.get(key)) ?.v === "safe", "safety: hostile key still round-trips");
    const files = await readdir(dir);
    assert(files.every((f) => !f.includes("/") && !f.includes("..")), "safety: no traversal in written filenames");
  }

  // --- 6. memory mode never touches disk ---
  {
    const m = createResearchCache({ cacheMode: "memory" });
    await m.set("mem", { v: 1 });
    const fresh = createResearchCache({ cacheMode: "memory" }); // separate instance
    assert((await m.get("mem")) != null, "memory: value present in the instance that set it");
    assert((await fresh.get("mem")) === null, "memory: a separate memory cache does not share state");
  }

  // --- 7. clearCache resets the default singleton ---
  {
    const { defaultResearchCache } = await import("../src/cache.js");
    const d = defaultResearchCache({});
    await d.set(cacheKey({ make: "Test", model: "Clearme" }), { v: 1 });
    await clearCache();
    const d2 = defaultResearchCache({});
    assert((await d2.get(cacheKey({ make: "Test", model: "Clearme" }))) === null, "clearCache: default singleton is reset");
  }

  // --- 8. clear() on the LAZILY-RESOLVED dir (no cacheDir / no BRAIN_CACHE_DIR) ---
  // Regression guard: clear() must use the resolved dir, not the undefined `dir`
  // param. We redirect os.tmpdir() via TMPDIR into our test temp so the default
  // resolution path is exercised without touching a real user cache.
  {
    const savedTmp = process.env.TMPDIR;
    const savedDir = process.env.BRAIN_CACHE_DIR;
    process.env.TMPDIR = join(dir, "ostmp");
    delete process.env.BRAIN_CACHE_DIR; // force fileStore(dir=undefined)
    try {
      const c = createResearchCache({}); // dir undefined → resolves TMPDIR/callies-...
      await c.set("lazy", { v: 1 });
      assert((await c.get("lazy")) != null, "clear/lazy: value set on lazily-resolved dir");
      await c.clear(); // would silently no-op if clear() used the undefined `dir`
      assert((await c.get("lazy")) === null, "clear/lazy: clear() actually clears the lazily-resolved dir");
    } finally {
      if (savedTmp === undefined) delete process.env.TMPDIR;
      else process.env.TMPDIR = savedTmp;
      process.env.BRAIN_CACHE_DIR = savedDir;
    }
  }
} finally {
  await rm(dir, { recursive: true, force: true });
}

if (failures.length) {
  console.error("✗ brain cache check FAILED:");
  for (const f of failures) console.error("   - " + f);
  process.exit(1);
}

console.log("✓ brain cache check passed: persistence, stampede dedup, TTL, success-only, key-safety, memory mode.");
