// Screen 2 — Home / upload (the single "roast my car" CTA; real car photo pick).
// CORE-REUSED: CallieHost (context "home", with tip), Card, Badge, Button, Callie.
// ROASTMYRIDE-NEW: real photo capture (compressed in-browser) + "roast my car" CTA.
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Badge, Callie, CallieHost } from "@callies-universe/core";
import { ScreenScroll, Wordmark } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";
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
  const car = input.carPhoto || {};

  const onPick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    try {
      const img = await loadCompressedImage(file);
      update({ carPhoto: { present: true, ...img } });
      setErr(null);
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
        return;
      }
    }
    if (fileRef.current) fileRef.current.click();
  };

  return (
    <ScreenScroll>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark />
        <Badge tone="ember">{credits} {cfg("monetization.creditLabel")} left</Badge>
      </div>

      <Card pad="var(--space-5)" style={{ textAlign: "center" }} sticker={<Badge tone="flame">HOT</Badge>} stickerCorner="tr">
        <div style={{ display: "flex", justifyContent: "center", marginTop: -8 }}>
          <CallieHost context="home" size={120} bubble />
        </div>
        <h2 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: "4px 0 4px" }}>{cfg("upload.label")}</h2>
        <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-4)" }}>
          {cfg("upload.subcopy")}
        </p>
        <input
          ref={fileRef}
          data-testid="car-file"
          type="file"
          accept="image/*"
          onChange={onPick}
          style={{ display: "none" }}
        />
        <button onClick={addPhoto} style={uploadTarget} aria-label={cfg("upload.alt")}>
          {car.dataUrl ? (
            <>
              <img
                src={car.dataUrl}
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
        <Button variant="primary" size="lg" block style={{ marginTop: "var(--space-4)" }} onClick={() => { haptic(); go(credits < 1 ? "/credits" : "/chips"); }}>
          {cfg("upload.cta")}
        </Button>
      </Card>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "0 var(--space-2)" }}>
        {/* design used a now-retired "watching" emote — core's nearest 9-state is "curious". */}
        <Callie state="curious" size={48} />
        <span style={{ font: "var(--type-sm)", color: "var(--text-muted)" }}>
          {cfg("mascot.home")}
        </span>
      </div>
    </ScreenScroll>
  );
}
