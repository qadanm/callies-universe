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
import { trace } from "../trace.js";

const PROVIDER = import.meta.env.VITE_PURCHASES_PROVIDER; // web: "stripe" | undefined
const RC_IOS_KEY = import.meta.env.VITE_RC_IOS_KEY; // RevenueCat public iOS key
const API = import.meta.env.VITE_ROAST_API;

export const isRealPurchases = () => !!PROVIDER || (isNative() && !!RC_IOS_KEY);

// _rc holds a WRAPPER { P: Purchases }, never the raw plugin object. Capacitor
// plugin objects are Proxies that forward every property access to a native
// call — including `.then`. Returning the raw proxy from an async function
// makes the promise machinery treat it as a thenable, call the fake .then
// ("Purchases.then() is not implemented on ios"), and the await NEVER settles.
// This was the root cause of the purchase flow hanging at "configuring".
let _rc = null;
async function rc(onStep) {
  if (!isNative() || !RC_IOS_KEY) return null;
  if (_rc) return _rc;
  onStep && onStep("loading SDK");
  trace("rc: importing plugin module");
  // Bundled dynamic import (NOT @vite-ignore): Vite code-splits it into a real
  // chunk so it resolves inside the WKWebView. A bare specifier left unbundled
  // fails on device with "does not resolve to a valid URL". Still lazy: this
  // module is only fetched the first time a native purchase/restore runs.
  const mod = await import("@revenuecat/purchases-capacitor");
  const Purchases = mod.Purchases;
  trace("rc: module loaded", Object.keys(mod).join(","));
  try {
    await withTimeout(Purchases.setLogLevel({ level: "DEBUG" }), 5000, "setLogLevel");
    trace("rc: setLogLevel resolved");
  } catch (e) { trace("rc: setLogLevel FAILED", e && e.message); }
  onStep && onStep("configuring");
  trace("rc: configure() calling");
  // The native configure completes (device logs show "configured with StoreKit
  // version 2") but its JS promise has been observed not resolving on this
  // build — so trace its settle independently and race it against a settle
  // window instead of blocking the flow on it.
  const confP = Purchases.configure({ apiKey: RC_IOS_KEY, appUserID: authHeaders()["x-roast-identity"] });
  confP.then(() => trace("rc: configure RESOLVED")).catch((e) => trace("rc: configure REJECTED", e && e.message));
  await Promise.race([confP.catch(() => {}), new Promise((r) => setTimeout(r, 2500))]);
  trace("rc: configure race done (proceeding)");
  try {
    const c = await withTimeout(Purchases.isConfigured(), 4000, "isConfigured");
    trace("rc: isConfigured", JSON.stringify(c));
  } catch (e) { trace("rc: isConfigured FAILED", e && e.message); }
  _rc = { P: Purchases }; // wrapped: see comment above rc()
  return _rc;
}

async function entitlement() {
  if (!API) return { ok: true, credits: null };
  const res = await fetch(`${API}/entitlement`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`entitlement ${res.status}`);
  return await res.json(); // { ok, credits }
}

// Reject with a labelled error if a step stalls, so the UI shows WHERE it hung
// instead of spinning "Processing…" forever.
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms)),
  ]);
}

/**
 * Buy a bundle.
 * @returns {Promise<{ ok, granted:number, mock?, redirected?, viaWebhook? }>}
 */
export async function buyBundle(bundle, onStep) {
  trace("buy: start", bundle.productId);
  const wrap = await withTimeout(rc(onStep), 25000, "init");
  const P = wrap && wrap.P;
  if (P) {
    // Native IAP: purchase the matching App Store product; credits are granted
    // server-side by the RevenueCat webhook → ledger.
    onStep && onStep("fetching offerings");
    trace("buy: getOfferings calling");
    let pkg = null;
    try {
      const offerings = await withTimeout(P.getOfferings(), 15000, "getOfferings");
      const cur = offerings && offerings.current;
      const pkgs = (cur && cur.availablePackages) || [];
      trace("buy: getOfferings ok", `cur=${cur ? cur.identifier : "none"} pkgs=${pkgs.length} all=${offerings && offerings.all ? Object.keys(offerings.all).join("/") : "-"}`);
      onStep && onStep(`offerings: ${pkgs.length} pkgs (cur=${cur ? cur.identifier : "none"})`);
      pkg = pkgs.find((p) => (p.product && p.product.identifier) === bundle.productId) || pkgs.find((p) => p.identifier === bundle.productId) || null;
    } catch (e) {
      trace("buy: getOfferings FAILED", e && e.message);
    }
    if (pkg) {
      onStep && onStep("opening Apple sheet");
      trace("buy: purchasePackage calling", pkg.identifier);
      const res = await withTimeout(P.purchasePackage({ aPackage: pkg }), 180000, "purchasePackage");
      trace("buy: purchasePackage ok", res && res.customerInfo ? "customerInfo received" : "done");
      return { ok: true, granted: 0, viaWebhook: true };
    }
    // FALLBACK: offerings unavailable/empty — buy the store product directly.
    onStep && onStep("fallback: fetching product");
    trace("buy: getProducts calling", bundle.productId);
    const prods = await withTimeout(
      P.getProducts({ productIdentifiers: [bundle.productId] }),
      15000,
      "getProducts"
    );
    const list = (prods && (prods.products || prods)) || [];
    trace("buy: getProducts ok", `count=${Array.isArray(list) ? list.length : "?"} ids=${Array.isArray(list) ? list.map((p) => p.identifier).join(",") : "?"}`);
    const product = Array.isArray(list) ? list.find((p) => p.identifier === bundle.productId) : null;
    if (!product) throw new Error(`product ${bundle.productId} not in store response (agreement/propagation?)`);
    onStep && onStep("opening Apple sheet (direct)");
    trace("buy: purchaseStoreProduct calling");
    const res2 = await withTimeout(P.purchaseStoreProduct({ product }), 180000, "purchaseStoreProduct");
    trace("buy: purchaseStoreProduct ok", res2 && res2.customerInfo ? "customerInfo received" : "done");
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
  const wrap = await rc();
  const P = wrap && wrap.P;
  if (P) {
    try { await P.restorePurchases(); } catch { /* nothing to restore is fine */ }
    return entitlement();
  }
  if (PROVIDER) return entitlement();
  return { ok: true, credits: null, mock: true };
}
