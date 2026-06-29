// Screen 7 — Profile-roast mode (self / opt-in only · consent UI).
// In the flow this doubles as the optional "Photo 2" personalization step:
// add a selfie OR a screenshot of your own profile, with a clear privacy line.
// CORE-REUSED: CallieHost (context "seasoning", reacts to "added"), Button.
// ROASTMYRIDE-NEW: selfie/profile segmented upload, consent copy.
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CallieHost } from "@callies-universe/core";
import { ScreenScroll, Eyebrow, H, stickyBar } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";
import { loadCompressedImage } from "../photo.js";
import { isNative, pickPhoto, haptic } from "../native.js";

export function ProfileRoast() {
  const go = useNavigate();
  const { input, update } = useFlow();
  const [mode, setMode] = useState("selfie"); // "selfie" | "profile"
  const [blur, setBlur] = useState(true); // privacy-first: blur by default on the stage
  const [err, setErr] = useState(null);
  const fileRef = useRef(null);
  const personal = input.personal || {};
  const added = !!personal.present && !!personal.dataUrl;

  const copy =
    mode === "selfie"
      ? { ico: "🤳", title: "Add a selfie", sub: "Snap or pick a photo of you" }
      : { ico: "📱", title: "Add a profile screenshot", sub: "A screenshot of your social profile" };

  const onPick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const img = await loadCompressedImage(file);
      update({ personal: { present: true, kind: mode, blur, ...img } });
      setErr(null);
    } catch (ex) {
      setErr(ex.message || "Couldn't read that photo.");
    }
  };

  // Native: camera/library sheet; web: file input.
  const addPhoto = async () => {
    haptic();
    if (isNative()) {
      const p = await pickPhoto();
      if (p && p.dataUrl) {
        update({ personal: { present: true, kind: mode, blur, dataUrl: p.dataUrl } });
        setErr(null);
        return;
      }
    }
    if (fileRef.current) fileRef.current.click();
  };

  const toggleBlur = () => {
    const next = !blur;
    setBlur(next);
    if (added) update({ personal: { ...personal, blur: next } });
  };

  const next = () => {
    if (!added) update({ personal: { present: false, kind: null } });
    go("/chips");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <ScreenScroll style={{ paddingBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {/* Callie reacts with "delighted" when a photo is added (core script). */}
          <CallieHost context="seasoning" size={72} event={added ? "added" : null} />
          <div>
            <Eyebrow>Photo 2 of 2 · consent</Eyebrow>
            <H style={{ fontSize: 30 }}>Make it personal</H>
          </div>
        </div>
        <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: 0 }}>
          Add a selfie or a screenshot of your profile and the roast gets sharper. Totally optional — your car
          alone is plenty.
        </p>

        {/* segmented choice */}
        <div style={{ display: "flex", gap: 6, padding: 5, background: "var(--canvas-sink)", borderRadius: "var(--radius-pill)" }}>
          {[["selfie", "Selfie"], ["profile", "Profile screenshot"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => {
                setMode(k);
                if (added) update({ personal: { present: false, kind: null } }); // switching kind drops the old photo
              }}
              style={{
                flex: 1,
                minHeight: 44,
                border: "none",
                cursor: "pointer",
                borderRadius: "var(--radius-pill)",
                font: "var(--type-sm)",
                fontWeight: 700,
                background: mode === k ? "var(--surface)" : "transparent",
                color: mode === k ? "var(--ember-600)" : "var(--text-muted)",
                boxShadow: mode === k ? "var(--gloss-chip)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          ref={fileRef}
          data-testid="profile-file"
          type="file"
          accept="image/*"
          onChange={onPick}
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileRef.current && fileRef.current.click()}
          aria-label={copy.title}
          style={{
            width: "100%",
            border: `3px dashed ${added ? "var(--ember-600)" : "var(--heat-400)"}`,
            background: added ? "#FFF3E2" : "var(--canvas-sink)",
            borderRadius: "var(--radius-lg)",
            padding: added ? "var(--space-4)" : "var(--space-7) var(--space-4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {added ? (
            <>
              <img
                src={personal.dataUrl}
                alt="You"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  filter: blur ? "blur(7px)" : "none",
                }}
              />
              <span style={{ font: "var(--type-d4)", color: "var(--ember-600)" }}>Added — looking good</span>
              <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>Tap to replace</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 40 }}>{copy.ico}</span>
              <span style={{ font: "var(--type-d4)", color: "var(--ember-600)" }}>{copy.title}</span>
              <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>{copy.sub}</span>
            </>
          )}
        </button>
        {err && (
          <p style={{ font: "var(--type-cap)", color: "var(--ember-600)", margin: 0 }}>{err}</p>
        )}

        {added && (
          <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", padding: "0 var(--space-1)" }}>
            <input type="checkbox" checked={blur} onChange={toggleBlur} style={{ width: 18, height: 18 }} />
            <span style={{ font: "var(--type-cap)", color: "var(--text-muted)" }}>
              Blur me on the stage / in the video (recommended)
            </span>
          </label>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "var(--space-3)", background: "var(--canvas-sink)", borderRadius: "var(--radius-md)" }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <span style={{ font: "var(--type-cap)", color: "var(--text-muted)" }}>
            Private — your photo stays on your device for now. We only ever roast you.
          </span>
        </div>
      </ScreenScroll>
      <div style={stickyBar}>
        <Button variant="ghost" onClick={next}>
          Skip
        </Button>
        <Button variant="primary" size="lg" style={{ flex: 1 }} onClick={next}>
          {added ? "Next" : "Next · car only"}
        </Button>
      </div>
    </div>
  );
}
