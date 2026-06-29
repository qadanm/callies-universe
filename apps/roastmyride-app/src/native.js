// Native (Capacitor) bridge — ZERO static imports of @capacitor/* so the web build
// never depends on those packages. Detection is a runtime check of the global
// `window.Capacitor` the native runtime injects; plugins load via variable-specifier
// dynamic import + @vite-ignore (the same trick the brain uses for the Anthropic SDK),
// so Vite leaves them alone and the web bundle stays clean. Everything no-ops on web.

export function isNative() {
  return typeof window !== "undefined" && !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

async function plugin(spec) {
  if (!isNative()) return null;
  try {
    return await import(/* @vite-ignore */ spec);
  } catch {
    return null; // plugin not installed / unavailable
  }
}

/** A light haptic tap on a primary action (no-op on web). */
export async function haptic(style = "light") {
  const m = await plugin("@capacitor/haptics");
  const Style = style === "heavy" ? "HEAVY" : style === "medium" ? "MEDIUM" : "LIGHT";
  try { await m?.Haptics?.impact?.({ style: Style }); } catch { /* ignore */ }
}

/** One-time native chrome setup: mark the document, set the status bar, hide splash. */
export async function initNativeChrome() {
  if (!isNative()) return;
  document.documentElement.classList.add("native");
  const sb = await plugin("@capacitor/status-bar");
  try {
    await sb?.StatusBar?.setStyle?.({ style: "DARK" }); // dark text on the light app bg
    await sb?.StatusBar?.setOverlaysWebView?.({ overlay: false });
  } catch { /* ignore */ }
  const ss = await plugin("@capacitor/splash-screen");
  try { await ss?.SplashScreen?.hide?.(); } catch { /* ignore */ }
}
