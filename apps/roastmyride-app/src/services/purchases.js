// Pluggable purchases. Three paths, picked at runtime:
//   • Native (Capacitor) + VITE_RC_IOS_KEY → RevenueCat / Apple IAP (App Store path).
//   • Web + VITE_PURCHASES_PROVIDER → Stripe Checkout (redirect).
//   • Otherwise → MOCK (grants locally; what the offline build + e2e use).
// Credits are CONSUMABLE: a real purchase is granted SERVER-SIDE (the provider
// webhook → the credit ledger, keyed by our identity), then the app reads the new
// balance from /entitlement. RevenueCat loads via dynamic import (variable
// specifier + @vite-ignore), so the web bundle never depends on the plugin.
import { isNative } from "../native.js";
import { authHeaders } from "./auth.js";

const PROVIDER = import.meta.env.VITE_PURCHASES_PROVIDER; // web: "stripe" | undefined
const RC_IOS_KEY = import.meta.env.VITE_RC_IOS_KEY; // RevenueCat public iOS key
const API = import.meta.env.VITE_ROAST_API;

export const isRealPurchases = () => !!PROVIDER || (isNative() && !!RC_IOS_KEY);

let _rc = null;
async function rc() {
  if (!isNative() || !RC_IOS_KEY) return null;
  if (_rc) return _rc;
  const spec = "@revenuecat/purchases-capacitor";
  const mod = await import(/* @vite-ignore */ spec);
  const Purchases = mod.Purchases;
  // app_user_id == our ledger identity, so the RevenueCat webhook grants to the
  // same key the app reads credits from.
  await Purchases.configure({ apiKey: RC_IOS_KEY, appUserID: authHeaders()["x-roast-identity"] });
  _rc = Purchases;
  return _rc;
}

async function entitlement() {
  if (!API) return { ok: true, credits: null };
  const res = await fetch(`${API}/entitlement`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`entitlement ${res.status}`);
  return await res.json(); // { ok, credits }
}

/**
 * Buy a bundle.
 * @returns {Promise<{ ok, granted:number, mock?, redirected?, viaWebhook? }>}
 */
export async function buyBundle(bundle) {
  const P = await rc();
  if (P) {
    // Native IAP: purchase the matching App Store product; credits are granted
    // server-side by the RevenueCat webhook → ledger.
    const offerings = await P.getOfferings();
    const pkgs = (offerings && offerings.current && offerings.current.availablePackages) || [];
    const pkg = pkgs.find((p) => (p.product && p.product.identifier) === bundle.productId) || pkgs.find((p) => p.identifier === bundle.productId);
    if (!pkg) throw new Error(`no RevenueCat package for ${bundle.productId}`);
    await P.purchasePackage({ aPackage: pkg });
    return { ok: true, granted: 0, viaWebhook: true };
  }
  if (PROVIDER) {
    // Web: backend creates a Stripe Checkout session keyed to our identity, redirect.
    const res = await fetch(`${API}/checkout`, {
      method: "POST",
      headers: { "content-type": "application/json", ...authHeaders() },
      body: JSON.stringify({ provider: PROVIDER, credits: bundle.credits, price: bundle.price, productId: bundle.productId }),
    });
    if (!res.ok) throw new Error(`checkout ${res.status}`);
    const { url } = await res.json();
    if (url) window.location.assign(url);
    return { ok: true, granted: 0, redirected: true };
  }
  return { ok: true, granted: bundle.credits, mock: true };
}

/**
 * Restore entitlement → the current credit balance (the ledger is source of truth
 * for consumables). mock → null (local credits already persist).
 */
export async function restore() {
  const P = await rc();
  if (P) {
    try { await P.restorePurchases(); } catch { /* nothing to restore is fine */ }
    return entitlement();
  }
  if (PROVIDER) return entitlement();
  return { ok: true, credits: null, mock: true };
}
