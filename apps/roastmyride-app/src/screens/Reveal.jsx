// Screen 6 — Reveal: the SET (the hero moment), the comedy special.
// CORE-REUSED: Callie, Button.
// ROASTMYRIDE-NEW (app-layer): StagePlayer (the animated stage scene — car on a
// screen, profile if present, comic performing, Callie in the crowd), the
// grader verdict, the standup ShareCard clip, and the full set transcript below.
//
// The set, performer, research and grade come from the brain's RoastResult
// (flow.result); the photos come from flow.input (carried, never sent to the
// model). The StagePlayer's scene is the single source of truth that the saved
// video will render identically (next milestone).
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Callie } from "@callies-universe/core";
import { ShareCard } from "../components/ShareCard.jsx";
import { StagePlayer } from "../components/StagePlayer.jsx";
import { SetBeat } from "../components/SetBeat.jsx";
import { CookingProgress } from "../components/CookingProgress.jsx";
import { ScreenScroll, Eyebrow, stickyBar } from "../components/ui.jsx";
import { toStandupSet, comicStyle, buildRenderSpec } from "../standup.js";
import { hasRoastApi, renderVideo, renderVideoAsync, renderPoster } from "../services/roastApi.js";
import { useFlow } from "../flow/FlowContext.jsx";

const slugOf = (spec) => String(spec.bit || "set").replace(/\W+/g, "-").toLowerCase();
const firstNameOf = (name) => String(name || "The comic").replace(/[“"].*$/, "").split(" ")[0];

export function Reveal() {
  const go = useNavigate();
  const { result, previewResult, input } = useFlow();
  const roast = result || previewResult; // fallback so a direct /reveal still renders

  const [saving, setSaving] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [renderStep, setRenderStep] = useState(0);
  const [renderPct, setRenderPct] = useState(null); // real % from the async job

  const shareOrDownload = (blob, filename, mime) => {
    const file = new File([blob], filename, { type: mime });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      return navigator.share({ files: [file], title: "RoastMyRide" }).catch(() => {});
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return Promise.resolve();
  };

  // Save-as-video. When a render backend is configured (VITE_ROAST_API), POST the
  // exact render spec and get back the frame-identical MP4 in one tap (share on
  // mobile, else download). With no backend — or on any failure — fall back to
  // downloading the render spec JSON (the CLI turns it into the same MP4).
  const downloadSpec = (spec) => {
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roastmyride-${slugOf(spec)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const saveVideo = async () => {
    const spec = buildRenderSpec(roast, input);
    if (!hasRoastApi()) return downloadSpec(spec);
    setSaving(true);
    setRenderPct(0);
    try {
      // Prefer the async job (real progress over SSE); fall back to the sync render.
      let blob;
      try {
        blob = await renderVideoAsync(spec, (p) => setRenderPct(Math.round(p * 100)));
      } catch {
        blob = await renderVideo(spec);
      }
      await shareOrDownload(blob, `roastmyride-${slugOf(spec)}.mp4`, "video/mp4");
    } catch (e) {
      console.warn(`[reveal] render failed (${e && e.message}); downloading spec instead`);
      downloadSpec(spec);
    } finally {
      setSaving(false);
      setRenderPct(null);
    }
  };

  // Save a shareable still (poster). Backend-only (renders a real PNG frame);
  // hidden when there's no backend.
  const saveImage = async () => {
    const spec = buildRenderSpec(roast, input);
    setSavingImage(true);
    try {
      const blob = await renderPoster(spec);
      await shareOrDownload(blob, `roastmyride-${slugOf(spec)}.png`, "image/png");
    } catch (e) {
      console.warn(`[reveal] poster failed (${e && e.message})`);
    } finally {
      setSavingImage(false);
    }
  };

  // Step the render overlay's status line while saving (time-based — the render is
  // a single request; this is honest indeterminate progress, like Warming-up).
  useEffect(() => {
    if (!saving) { setRenderStep(0); return undefined; }
    const t = setInterval(() => setRenderStep((s) => s + 1), 1200);
    return () => clearInterval(t);
  }, [saving]);

  const set = toStandupSet(roast);
  const act = roast.performer?.comedicIdentity || comicStyle(roast.roasterId);
  const renderSteps = ["Rolling the tape…", `${firstNameOf(roast.roasterName)} is performing…`, "Mixing the audio…", "Rendering your reel…"];
  const carPhoto = input?.carPhoto?.dataUrl || null;
  const profile = input?.personal?.present && input?.personal?.dataUrl ? input.personal : null;
  const closer = set.beats.find((b) => b.type === "closer");
  const clipSegments = closer
    ? [
        { text: closer.text },
        ...(closer.punch ? [{ text: closer.punch, punch: true }] : []),
        ...(closer.tail ? [{ text: closer.tail }] : []),
      ]
    : roast.segments;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", background: "radial-gradient(120% 60% at 50% 0%, var(--heat-300) 0%, var(--canvas) 50%)" }}>
      <ScreenScroll style={{ paddingBottom: "var(--space-4)" }}>
        {/* the stage scene — the show plays here (and is what the video will be) */}
        <div style={{ animation: "rmr-pop-in var(--dur-4) var(--ease-spring) both" }}>
          <StagePlayer result={roast} carPhoto={carPhoto} profile={profile} />
        </div>

        {/* grader verdict — the anti-cringe guarantee, made visible */}
        {roast.grade && (
          <div style={{ font: "var(--type-cap)", color: "var(--text-hint)", textAlign: "center" }}>
            Cleared the booker {roast.grade.pass ? "✅" : "⚠️"} · funny {roast.grade.scores.funny} ·
            {" "}not-AI {roast.grade.scores.human} · on-the-car {roast.grade.scores.edge}
            {roast.research?.sources?.length ? ` · grounded in ${roast.research.sources.length} sources` : ""}
          </div>
        )}

        {/* dev-only cost telemetry (hidden in production builds) */}
        {import.meta.env.DEV && roast.cost && roast.usage && (
          <div style={{ font: "var(--type-legal)", color: "var(--text-hint)", textAlign: "center", opacity: 0.75 }}>
            dev · {roast.engine} · ${roast.cost.usd.toFixed(4)} · {Math.round((roast.usage.tokensIn + roast.usage.tokensOut) / 1000)}k tok
            {roast.durationMs ? ` · ${(roast.durationMs / 1000).toFixed(1)}s` : ""}
          </div>
        )}

        {/* the shareable clip (the closer) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ShareCard
            width={240}
            format="standup"
            roasterName={roast.roasterName}
            act={act}
            spice={roast.spice}
            mascot={<Callie state={roast.reaction} size={76} />}
            roast={clipSegments}
          />
        </div>

        {/* the full set — text transcript (accessible, skimmable) */}
        <div>
          <Eyebrow>The full set</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
            {set.beats.map((b, i) => (
              <SetBeat key={i} beat={b} />
            ))}
          </div>
        </div>
      </ScreenScroll>

      <div style={stickyBar}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", width: "100%" }}>
          <Button variant="primary" size="lg" block onClick={() => go("/celebrate")}>
            Share the clip
          </Button>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <Button variant="secondary" style={{ flex: 1 }} onClick={saveVideo} disabled={saving}>
              {saving ? "Rendering…" : "⤓ Video"}
            </Button>
            {hasRoastApi() && (
              <Button variant="secondary" style={{ flex: 1 }} onClick={saveImage} disabled={savingImage || saving}>
                {savingImage ? "…" : "⤓ Image"}
              </Button>
            )}
            <Button variant="secondary" style={{ flex: 1 }} onClick={() => go("/cooking")} disabled={saving}>
              New set
            </Button>
          </div>
        </div>
      </div>

      {/* render overlay — shown while the backend produces the exact MP4 */}
      {saving && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(120% 70% at 50% 30%, var(--heat-300) 0%, var(--canvas) 60%)" }}>
          <CookingProgress title="Rendering your reel…" steps={renderSteps} step={renderStep} pct={renderPct ?? undefined} hint="Saving the exact video you see" size={180} />
        </div>
      )}
    </div>
  );
}
