// Credits via the server ledger (keyed by identity). When no backend is configured,
// the app uses its localStorage credits instead (FlowContext). These are only
// called behind hasCreditsApi().
import { authHeaders } from "./auth.js";

const BASE = import.meta.env.VITE_ROAST_API;

export const hasCreditsApi = () => !!BASE;

/** Current server balance for this identity (seeds free credits on first call). */
export async function fetchCredits() {
  const res = await fetch(`${BASE}/credits`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`credits ${res.status}`);
  return (await res.json()).credits;
}

/** Consume one credit. @returns {Promise<{ok:boolean, credits:number}>} (ok=false at 0). */
export async function consumeCredit() {
  const res = await fetch(`${BASE}/credits/consume`, { method: "POST", headers: authHeaders() });
  if (res.status === 402) return { ok: false, credits: (await res.json()).credits };
  if (!res.ok) throw new Error(`consume ${res.status}`);
  return { ok: true, credits: (await res.json()).credits };
}
