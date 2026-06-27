// @callies-universe/render — generic video render capability.
//
// Executes a Remotion composition to an MP4. It is APP-AGNOSTIC: given an entry
// (a file that registerRoot()s a composition) + the input props, it bundles and
// renders. The app owns its composition (the StageScene); this service just runs
// it — so the same scene the app plays becomes the video, exactly.
//
// Host-agnostic: this runs anywhere Node + a Chromium are available (local, CI,
// a small server, or Lambda via @remotion/lambda later). Pass `browserExecutable`
// to reuse an installed Chrome instead of downloading one.

import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";

/**
 * @param {object} opts
 * @param {string} opts.entryPoint        path to the Remotion entry (registerRoot)
 * @param {string} [opts.compositionId]   default "stage"
 * @param {object} [opts.inputProps]      the scene spec
 * @param {string} opts.outFile           output .mp4 path
 * @param {string} [opts.browserExecutable] path to a Chrome/Chromium binary
 * @param {number} [opts.scale]           render scale (1 = full; 0.5 = half-res, faster)
 * @param {[number,number]} [opts.frameRange] optional inclusive [start,end] for a preview clip
 * @param {(p:number)=>void} [opts.onProgress] 0..1 progress
 * @returns {Promise<string>} the outFile path
 */
export async function renderStageVideo({
  entryPoint,
  compositionId = "stage",
  inputProps = {},
  outFile,
  browserExecutable,
  scale = 1,
  frameRange,
  onProgress,
}) {
  if (!entryPoint) throw new Error("renderStageVideo: entryPoint is required");
  if (!outFile) throw new Error("renderStageVideo: outFile is required");

  const serveUrl = await bundle({ entryPoint });
  const composition = await selectComposition({ serveUrl, id: compositionId, inputProps, browserExecutable });

  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    outputLocation: outFile,
    inputProps,
    browserExecutable,
    scale,
    frameRange,
    onProgress: onProgress ? ({ progress }) => onProgress(progress) : undefined,
  });

  return outFile;
}
