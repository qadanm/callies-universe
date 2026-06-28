// Pluggable purchases. MOCK by default (grants the bundle's credits locally, the
// behavior shipped today). A real provider — Stripe Checkout or RevenueCat Web —
// is wired behind VITE_PURCHASES_PROVIDER, with the backend (VITE_ROAST_API)
// creating the checkout session and handling the webhook; granted credits then
// arrive via restore()/entitlement on return. Keeping this a seam means the app
// (and e2e) run fully on the mock with no payment provider.
const PROVIDER = import.meta.env.VITE_PURCHASES_PROVIDER; // undefined → mock
const API = import.meta.env.VITE_ROAST_API;

export const isRealPurchases = () => !!PROVIDER;

/**
 * Buy a bundle.
 * @returns {Promise<{ ok: boolean, granted: number, mock?: boolean, redirected?: boolean }>}
 *   `granted` credits are applied immediately (mock); a real provider redirects to
 *   checkout and grants via webhook (granted 0, redirected true).
 */
export async function buyBundle(bundle) {
  if (!PROVIDER) return { ok: true, granted: bundle.credits, mock: true };
  // Real provider: backend creates a checkout session; we redirect to it.
  const res = await fetch(`${API}/checkout`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ provider: PROVIDER, credits: bundle.credits, price: bundle.price }),
  });
  if (!res.ok) throw new Error(`checkout ${res.status}`);
  const { url } = await res.json();
  if (url) window.location.assign(url);
  return { ok: true, granted: 0, redirected: true };
}

/**
 * Restore entitlement.
 * @returns {Promise<{ ok: boolean, credits: number|null }>} mock → null (local
 *   credits already persist); real → the provider's current credit balance.
 */
export async function restore() {
  if (!PROVIDER) return { ok: true, credits: null, mock: true };
  const res = await fetch(`${API}/entitlement`);
  if (!res.ok) throw new Error(`restore ${res.status}`);
  return await res.json();
}
