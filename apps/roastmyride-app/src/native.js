// Native (Capacitor) bridge. The WEB bundle never imports @capacitor/* (keeps it
// clean). Capacitor's native runtime injects every installed plugin on the global
// `window.Capacitor.Plugins` (the @capacitor/* npm packages are just thin proxies to
// these), so we read that global directly. NOTE: do NOT `import("@capacitor/...")`
// at runtime, because a bare specifier can't be resolved inside the WKWebView (it isn't
// bundled), so every plugin would silently no-op ON DEVICE (stuck splash, dead
// camera/share). Reading window.Capacitor.Plugins is the pattern that actually works.

import { cfg } from "./subjects/index.js";

export function isNative() {
  return typeof window !== "undefined" && !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

/** A registered native plugin from the runtime-injected registry (null on web). */
function plugin(name) {
  const P = (typeof window !== "undefined" && window.Capacitor && window.Capacitor.Plugins) || {};
  return P[name] || null;
}

/** A light haptic tap on a primary action (no-op on web). */
export async function haptic(style = "light") {
  const Haptics = plugin("Haptics");
  const Style = style === "heavy" ? "HEAVY" : style === "medium" ? "MEDIUM" : "LIGHT";
  try { await Haptics?.impact?.({ style: Style }); } catch { /* ignore */ }
}

/** Native photo pick (camera or library sheet) → { dataUrl } or null. Web → null
 *  (callers fall back to the <input type=file>). */
export async function pickPhoto() {
  const Camera = plugin("Camera");
  if (!Camera || !Camera.getPhoto) return null;
  try {
    const photo = await Camera.getPhoto({
      source: "PROMPT",        // CameraSource.Prompt
      resultType: "dataUrl",   // CameraResultType.DataUrl
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
  const Filesystem = plugin("Filesystem");
  const Share = plugin("Share");
  if (!Filesystem || !Share) return false;
  try {
    await Filesystem.writeFile({ path: filename, data: await blobToBase64(blob), directory: "CACHE" });
    const { uri } = await Filesystem.getUri({ path: filename, directory: "CACHE" });
    await Share.share({ title: cfg("appName"), files: [uri] });
    return true;
  } catch {
    return false;
  }
}

/** One-time native chrome setup: mark the document, set the status bar, hide splash. */
export async function initNativeChrome() {
  if (!isNative()) return;
  document.documentElement.classList.add("native");
  const StatusBar = plugin("StatusBar");
  try {
    // Capacitor's Style.LIGHT = DARK status-bar content (for a light app background)
    await StatusBar?.setStyle?.({ style: "LIGHT" }); // dark text/icons on the cream bg
    await StatusBar?.setOverlaysWebView?.({ overlay: true }); // full-bleed: app bg runs behind the status bar
  } catch { /* ignore */ }
  const SplashScreen = plugin("SplashScreen");
  try { await SplashScreen?.hide?.(); } catch { /* ignore */ }
}
