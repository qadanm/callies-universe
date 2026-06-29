// RoastMyRide: client-side photo capture + compression [ROASTMYRIDE-NEW].
//
// Turns a picked File into a small, display-ready data URL we carry through the
// flow and (next milestone) render on the stage + into the exported video.
// Downscales to a max edge and re-encodes as JPEG so the blob stays small
// (~100 to 300KB): cheap to hold in state, cheap to upload later, and never sent
// to the brain (FlowContext strips it from the model payload).

const DEFAULTS = { maxDim: 1280, quality: 0.82, mime: "image/jpeg" };

/**
 * @param {File} file
 * @returns {Promise<{ dataUrl: string, width: number, height: number, bytes: number }>}
 */
export async function loadCompressedImage(file, opts = {}) {
  const { maxDim, quality, mime } = { ...DEFAULTS, ...opts };
  if (!file || !file.type || !file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  const source = await decode(file);
  const sw = source.width || source.naturalWidth;
  const sh = source.height || source.naturalHeight;
  const scale = Math.min(1, maxDim / Math.max(sw, sh));
  const width = Math.max(1, Math.round(sw * scale));
  const height = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0, width, height);
  if (typeof source.close === "function") source.close(); // release ImageBitmap

  const dataUrl = canvas.toDataURL(mime, quality);
  const b64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return { dataUrl, width, height, bytes: Math.round(b64.length * 0.75) };
}

async function decode(file) {
  // Prefer createImageBitmap (fast, off-main-thread); fall back to <img>.
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* some formats (e.g. HEIC) fail here, so fall through to <img> */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () =>
        reject(new Error("Couldn't read that image. If it's a HEIC, try a JPG or PNG."));
      el.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
