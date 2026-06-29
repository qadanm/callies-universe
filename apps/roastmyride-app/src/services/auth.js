// Identity. Anonymous by default: a persisted device id (UUID in localStorage)
// is the identity the server ledger keys on. A real auth provider (Supabase /
// Clerk magic-link) is the documented swap behind VITE_AUTH_PROVIDER; its adapter
// would return a verified token here and the server would verify it → subject.
const PROVIDER = import.meta.env.VITE_AUTH_PROVIDER;
const DEVICE_KEY = "rmr.deviceId";

function deviceId() {
  try {
    let v = localStorage.getItem(DEVICE_KEY);
    if (!v) {
      v = (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(DEVICE_KEY, v);
    }
    return v;
  } catch {
    return "anon";
  }
}

export const isRealAuth = () => !!PROVIDER;

/** The identity token sent to the server (anonymous device id, or a real JWT later). */
export function identityToken() {
  return deviceId();
}

export function authHeaders() {
  return { "x-roast-identity": identityToken() };
}
