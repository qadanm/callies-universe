// Credit ledger: the server's source of truth for credits, keyed by identity.
// In-memory by default; a JSON file (ROAST_LEDGER_FILE) for simple persistence; a
// real DB (Postgres/Supabase) is the documented swap (same balance/consume/grant API).
// A new identity is seeded with `free` credits on first touch.

import { readFileSync, writeFileSync } from "node:fs";

export function createLedger({ file, free = 3 } = {}) {
  let data = {};
  if (file) {
    try { data = JSON.parse(readFileSync(file, "utf8")) || {}; } catch { data = {}; }
  }
  const persist = () => {
    if (!file) return;
    try { writeFileSync(file, JSON.stringify(data)); } catch { /* best effort */ }
  };
  const get = (id) => {
    if (!(id in data)) { data[id] = free; persist(); }
    return data[id];
  };
  return {
    balance: (id) => get(id),
    consume: (id, n = 1) => {
      const c = get(id);
      if (c < n) return { ok: false, credits: c };
      data[id] = c - n;
      persist();
      return { ok: true, credits: data[id] };
    },
    grant: (id, n) => {
      const c = get(id);
      data[id] = c + Math.max(0, n | 0);
      persist();
      return data[id];
    },
  };
}
