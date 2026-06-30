// Screen 2: Home / upload (the single "roast my car" CTA; real car photo pick).
// CORE-REUSED: CallieHost (context "home", with tip), Card, Badge, Button, Callie.
// ROASTMYRIDE-NEW: real photo capture (compressed in-browser) + a REQUIRED "what
// car is this?" field (auto-ID pre-fills it as a guess; a wrong trim/year would
// derail the whole roast, so the owner confirms it) + the "roast my car" CTA.
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Badge, Callie, CallieHost } from "@callies-universe/core";
import { ScreenScroll, Wordmark } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";
import { hasRoastApi, identifyCarViaApi } from "../services/roastApi.js";
import { loadCompressedImage } from "../photo.js";
import { isNative, pickPhoto, haptic } from "../native.js";
import { cfg } from "../subjects/index.js";

const uploadTarget = {
  width: "100%",
  border: "3px dashed var(--heat-400)",
  background: "var(--canvas-sink)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-7) var(--space-4)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  overflow: "hidden",
};

export function Home() {
  const go = useNavigate();
  const { input, update, credits } = useFlow();
  const fileRef = useRef(null);
  const [err, setErr] = useState(null);
  const photo = input.carPhoto || {};

  const requireIdentity = !!cfg("upload.requireIdentity");
  const [carLabel, setCarLabel] = useState(input.car?.label || "");
  const [idState, setIdState] = useState("idle"); // idle | guessing | guessed

  // The identity field is the source of truth for the car the brain roasts.
  useEffect(() => {
    update({ car: carLabel.trim() ? { label: carLabel.trim() } : null });
  }, [carLabel, update]);

  // Auto-ID is a HELPER, not the answer: pre-fill the field as a guess the owner
  // can correct. Only fills when empty (never clobbers what they typed).
  const runIdentityGuess = async (dataUrl) => {
    if (!requireIdentity || !hasRoastApi() || !dataUrl) return;
    setIdState("guessing");
    try {
      const guess = await identifyCarViaApi(dataUrl);
      setCarLabel((cur) => (cur.trim() ? cur : guess?.label || ""));
      setIdState(guess?.label ? "guessed" : "idle");
    } catch {
      setIdState("idle");
    }
  };

  const onPick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    try {
      const img = await loadCompressedImage(file);
      update({ carPhoto: { present: true, ...img } });
      setErr(null);
      runIdentityGuess(img.dataUrl);
    } catch (ex) {
      setErr(ex.message || "Couldn't read that photo.");
    }
  };

  // Native: the camera/library sheet; web: the file input.
  const addPhoto = async () => {
    haptic();
    if (isNative()) {
      const p = await pickPhoto();
      if (p && p.dataUrl) {
        update({ carPhoto: { present: true, dataUrl: p.dataUrl } });
        setErr(null);
        runIdentityGuess(p.dataUrl);
        return;
      }
    }
    if (fileRef.current) fileRef.current.click();
  };

  const ready = !!photo.dataUrl && (!requireIdentity || carLabel.trim().length > 0);
  const proceed = () => {
    if (!ready) return;
    haptic();
    update({ car: carLabel.trim() ? { label: carLabel.trim() } : null });
    go(credits < 1 ? "/credits" : "/chips");
  };

  return (
    <ScreenScroll>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark />
        <Badge tone="ember">{credits} {cfg("monetization.creditLabel")} left</Badge>
      </div>

      <Card pad="var(--space-5)" style={{ textAlign: "center" }} sticker={<Badge tone="flame">HOT</Badge>} stickerCorner="tr">
        <div style={{ display: "flex", justifyContent: "center", marginTop: -8 }}>
          <CallieHost context="home" size={120} />
        </div>
        <h2 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: "4px 0 4px" }}>{cfg("upload.label")}</h2>
        <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-4)" }}>
          {cfg("upload.subcopy")}
        </p>
        <input
          ref={fileRef}
          data-testid="photo-file"
          type="file"
          accept="image/*"
          onChange={onPick}
          style={{ display: "none" }}
        />
        <button onClick={addPhoto} style={uploadTarget} aria-label={cfg("upload.alt")}>
          {photo.dataUrl ? (
            <>
              <img
                src={photo.dataUrl}
                alt={cfg("upload.alt")}
                style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: "var(--radius-md)" }}
              />
              <span style={{ font: "var(--type-cap)", color: "var(--text-hint)", marginTop: 6 }}>{cfg("upload.replace")}</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 40, lineHeight: 1 }}>{cfg("upload.emoji")}</span>
              <span style={{ font: "var(--type-d4)", color: "var(--ember-600)" }}>{cfg("upload.add")}</span>
              <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>{cfg("upload.addSub")}</span>
            </>
          )}
        </button>
        {err && (
          <p style={{ font: "var(--type-cap)", color: "var(--ember-600)", margin: "var(--space-2) 0 0" }}>{err}</p>
        )}

        {/* Required identity field: the owner confirms the exact car. */}
        {requireIdentity && (
          <div style={{ marginTop: "var(--space-4)", textAlign: "left" }}>
            <label htmlFor="car-identity" style={{ font: "var(--type-cap)", fontWeight: 800, color: "var(--ink)", display: "block", marginBottom: 5 }}>
              {cfg("upload.identityLabel")} <span style={{ color: "var(--ember-600)" }}>*</span>
            </label>
            {idState === "guessing" && (
              <p style={{ font: "var(--type-legal)", color: "var(--text-hint)", margin: "0 2px 5px", fontStyle: "italic" }}>{cfg("upload.identityGuessing")}</p>
            )}
            <input
              id="car-identity"
              data-testid="car-identity"
              value={carLabel}
              onChange={(e) => setCarLabel(e.target.value)}
              placeholder={cfg("upload.identityPlaceholder")}
              autoCapitalize="words"
              enterKeyHint="done"
              style={{ width: "100%", boxSizing: "border-box", minHeight: "var(--tap-cozy)", padding: "10px 13px", borderRadius: "var(--radius-md)", border: "2px solid var(--heat-400)", font: "var(--type-sm)", color: "var(--ink)", background: "var(--surface)" }}
            />
            <p style={{ font: "var(--type-legal)", color: "var(--text-muted)", margin: "6px 2px 0", lineHeight: 1.4 }}>
              {idState === "guessed" ? cfg("upload.identityGuessed") + " " : ""}{cfg("upload.identityHint")}
            </p>
          </div>
        )}

        <Button variant="primary" size="lg" block style={{ marginTop: "var(--space-4)" }} disabled={!ready} onClick={proceed}>
          {cfg("upload.cta")}
        </Button>
      </Card>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "0 var(--space-2)" }}>
        {/* design used a now-retired "watching" emote; core's nearest 9-state is "curious". */}
        <Callie state="curious" size={48} />
        <span style={{ font: "var(--type-sm)", color: "var(--text-muted)" }}>
          {cfg("mascot.home")}
        </span>
      </div>
    </ScreenScroll>
  );
}
