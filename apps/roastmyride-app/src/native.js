// Native (Capacitor) bridge — ZERO static imports of @capacitor/* so the web build
// never depends on those packages. Detection is a runtime check of the global
// `window.Capacitor` the native runtime injects; plugins load via variable-specifier
// dynamic import + @vite-ignore (the same trick the brain uses for the Anthropic SDK),
// so Vite leaves them alone and the web bundle stays clean. Everything no-ops on web.

import { cfg } from "./subjects/index.js";

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

/** Native photo pick (camera or library sheet) → { dataUrl } or null. Web → null
 *  (callers fall back to the <input type=file>). */
export async function pickPhoto() {
  const m = await plugin("@capacitor/camera");
  if (!m || !m.Camera) return null;
  try {
    const photo = await m.Camera.getPhoto({
      source: (m.CameraSource && m.CameraSource.Prompt) || "PROMPT",
      resultType: (m.CameraResultType && m.CameraResultType.DataUrl) || "dataUrl",
      quality: 82,
      width: 1280,
      correctOrientation: true,
    });
    return photo && photo.dataUrl ? { dataUrl: photo.dataUrl } : null;
  } catch {
    return null; // user cancelled / unavailable
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

/** Share a Blob via the native share sheet (writes to cache first). @returns true
 *  if shared natively; false on web / failure (callers fall back to download). */
export async function shareFile(blob, filename, _mime) {
  if (!isNative()) return false;
  const fs = await plugin("@capacitor/filesystem");
  const sh = await plugin("@capacitor/share");
  if (!fs || !fs.Filesystem || !sh || !sh.Share) return false;
  try {
    const directory = (fs.Directory && fs.Directory.Cache) || "CACHE";
    await fs.Filesystem.writeFile({ path: filename, data: await blobToBase64(blob), directory });
    const { uri } = await fs.Filesystem.getUri({ path: filename, directory });
    await sh.Share.share({ title: cfg("appName"), files: [uri] });
    return true;
  } catch {
    return false;
  }
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
