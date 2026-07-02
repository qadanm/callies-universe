// DIAGNOSTIC trace beacon (debug builds only). When VITE_TRACE_URL is set at
// build time, every step of the purchase flow (and any global JS error) is
// POSTed to that URL so the flow can be observed off-device. With the env var
// unset (all production builds) this whole module is inert.
const URL = import.meta.env.VITE_TRACE_URL;
export const BUILD_TAG = "beacon-1";

export function trace(step, extra) {
  try {
    // eslint-disable-next-line no-console
    console.log("[RCX]", step, extra || "");
    if (!URL) return;
    fetch(URL, {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: `${BUILD_TAG} | ${step}${extra ? ` | ${typeof extra === "string" ? extra : JSON.stringify(extra)}` : ""}`,
      keepalive: true,
    }).catch(() => {});
  } catch { /* never break the app for telemetry */ }
}

export function initTrace() {
  if (!URL) return;
  try {
    window.addEventListener("error", (e) =>
      trace("window.error", `${e.message} @ ${e.filename}:${e.lineno}`));
    window.addEventListener("unhandledrejection", (e) =>
      trace("unhandledrejection", (e.reason && (e.reason.message || String(e.reason))) || "?"));
    trace("boot", navigator.userAgent);
  } catch { /* ignore */ }
}
