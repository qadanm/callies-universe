// Home = the WHOLE setup, two panels + one button.
//   Panel 1 "Your car"    : photo + the required "what is it?" field
//   Panel 2 "Pick 2 voices": four voice cards, each with a real audio preview;
//                            tap two to choose the pair that roasts the car.
// One button goes straight to the roast. Callie hosts from the header (small,
// reactive), never the hero. No "show", no "comic", no "green room".
// CORE-REUSED: CallieHost, Card, Badge.
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Badge, CallieHost } from "@callies-universe/core";
import { ScreenScroll, Wordmark, stickyBar } from "../components/ui.jsx";
import { VoicePicker, activeVoices } from "../components/VoicePicker.jsx";
import { stopPreview } from "../services/voicePreview.js";
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
  padding: "var(--space-6) var(--space-4)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  overflow: "hidden",
};

const firstName = (name) => String(name || "").replace(/[“"].*$/, "").split(" ")[0];
const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function Home() {
  const go = useNavigate();
  const { input, update, credits } = useFlow();
  const fileRef = useRef(null);
  const [err, setErr] = useState(null);
  const photo = input.carPhoto || {};

  const requireIdentity = !!cfg("upload.requireIdentity");
  const [carLabel, setCarLabel] = useState(input.car?.label || "");
  const [idState, setIdState] = useState("idle"); // idle | guessing | guessed
  const [callieEvt, setCallieEvt] = useState(null); // "upload" pops her when a photo lands

  // Stop any preview clip when leaving Home (so it never bleeds into cooking).
  useEffect(() => () => stopPreview(), []);

  // The identity field is the source of truth for the car the brain roasts.
  useEffect(() => {
    update({ car: carLabel.trim() ? { label: carLabel.trim() } : null });
  }, [carLabel, update]);

  const celebrate = () => {
    setCallieEvt(null);
    requestAnimationFrame(() => setCallieEvt("upload"));
  };

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
      celebrate();
      runIdentityGuess(img.dataUrl);
    } catch (ex) {
      setErr("Couldn't use that photo. Try another one.");
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
        celebrate();
        runIdentityGuess(p.dataUrl);
        return;
      }
    }
    if (fileRef.current) fileRef.current.click();
  };

  // ---- the two voices ----
  const voiceIds = Array.isArray(input.roasterIds) ? input.roasterIds : [];
  const onVoices = (next) => update({ roasterIds: next, roasterId: next[0] || input.roasterId });
  const names = voiceIds.map((id) => firstName(activeVoices().find((v) => v.id === id)?.name)).filter(Boolean);

  // ---- CTA state: the label tells the user the one thing left to do ----
  // The car name is NOT required: auto-ID pre-fills it and the user can fix it,
  // but a blank name never blocks the roast (the brain falls back).
  const hasPhoto = !!photo.dataUrl;
  const twoVoices = voiceIds.length === 2;
  const ready = hasPhoto && twoVoices;
  const ctaLabel = !hasPhoto
    ? "Add a photo first"
    : !twoVoices
    ? "Pick 2 voices"
    : cfg("upload.cta") + " 🔥";
  const proceed = () => {
    if (!ready) return;
    haptic();
    stopPreview();
    update({ car: carLabel.trim() ? { label: carLabel.trim() } : null, roasterId: voiceIds[0] });
    go(credits < 1 ? "/credits" : "/cooking");
  };

  // How mean: one simple choice, three levels (default medium).
  const level = (input.context && input.context[0]) || "medium";
  const setLevel = (key) => { haptic(); update({ context: [key] }); };
  const noun = capFirst(cfg("brain.subjectNoun")); // "Your ride"

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <ScreenScroll style={{ paddingBottom: 0, gap: "var(--space-4)" }}>
        {/* Header: wordmark + small hosting Callie + credits (tappable) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ lineHeight: 0, flexShrink: 0 }}>
              <CallieHost context="home" event={callieEvt} size={40} />
            </div>
            <Wordmark />
          </div>
          <button onClick={() => go("/credits")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }} aria-label="Your credits">
            <Badge tone="ember">{credits} {credits === 1 ? "roast" : "roasts"} left</Badge>
          </button>
        </div>

        {/* Panel 1: the car */}
        <Card pad="var(--space-4)">
          <PanelTitle emoji={cfg("theme.emoji")} text={noun} />
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
                  style={{ width: "100%", maxHeight: 190, objectFit: "cover", borderRadius: "var(--radius-md)" }}
                />
                <span style={{ font: "var(--type-cap)", color: "var(--text-hint)", marginTop: 6 }}>{cfg("upload.replace")}</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 38, lineHeight: 1 }}>{cfg("upload.emoji")}</span>
                <span style={{ font: "var(--type-d4)", color: "var(--ember-600)" }}>{cfg("upload.add")}</span>
                <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>{cfg("upload.addSub")}</span>
              </>
            )}
          </button>
          {err && (
            <p style={{ font: "var(--type-cap)", color: "var(--ember-600)", margin: "var(--space-2) 0 0" }}>{err}</p>
          )}

          {/* The required identity field appears once there is a photo: the screen
              opens as ONE action, and the next step reveals itself. */}
          {requireIdentity && photo.dataUrl && (
            <div style={{ marginTop: "var(--space-3)", textAlign: "left" }}>
              <label htmlFor="car-identity" style={{ font: "var(--type-cap)", fontWeight: 800, color: "var(--ink)", display: "block", marginBottom: 5 }}>
                {cfg("upload.identityLabel")}
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
                {cfg("upload.identityHint")}
              </p>
            </div>
          )}
        </Card>

        {/* Panel 2: pick the two voices (with real audio previews) */}
        <Card pad="var(--space-4)">
          <PanelTitle emoji="🔊" text="Pick 2 voices" />
          <p style={{ font: "var(--type-cap)", color: "var(--text-muted)", margin: "-6px 0 var(--space-3)" }}>
            Tap two. Hit ▶ to hear any voice first.
          </p>
          <VoicePicker selected={voiceIds} onChange={onVoices} />
          <p style={{ font: "var(--type-cap)", color: twoVoices ? "var(--ink)" : "var(--text-hint)", margin: "var(--space-3) 2px 0", fontWeight: 700, textAlign: "center" }}>
            {twoVoices ? `${names[0]} and ${names[1]} will roast it, back and forth.` : "Choose two to continue."}
          </p>
        </Card>

        {/* How mean: three levels, one tap. That's the whole thing. */}
        <div>
          <div style={{ font: "var(--type-cap)", fontWeight: 800, color: "var(--ink)", margin: "0 2px 8px" }}>How mean?</div>
          <div style={meanWrap} role="radiogroup" aria-label="How mean should they be">
            {MEAN.map((m) => {
              const on = level === m.key;
              return (
                <button
                  key={m.key}
                  role="radio"
                  aria-checked={on}
                  data-testid={`mean-${m.key}`}
                  onClick={() => setLevel(m.key)}
                  style={{ ...meanSeg, ...(on ? meanOn : meanOff) }}
                >
                  <span aria-hidden="true" style={{ fontSize: 17 }}>{m.emoji}</span> {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </ScreenScroll>

      {/* One primary action. The label IS the instruction. */}
      <div style={{ ...stickyBar, flexDirection: "column", gap: 8 }}>
        <Button variant="primary" size="lg" block disabled={!ready} onClick={proceed}>
          {ctaLabel}
        </Button>
        <p style={{ font: "var(--type-legal)", color: "var(--text-hint)", margin: 0, textAlign: "center" }}>
          1 credit per roast · Callie never roasts you
        </p>
      </div>
    </div>
  );
}

// The only "style" control: how mean the two voices are. Maps to the brain's
// heat keys (gentle / medium / brutal), so the roast pipeline is unchanged.
const MEAN = [
  { key: "gentle", label: "Gentle", emoji: "😌" },
  { key: "medium", label: "Medium", emoji: "🌶️" },
  { key: "brutal", label: "Brutal", emoji: "🔥" },
];

function PanelTitle({ emoji, text }) {
  return (
    <h3 style={{ display: "flex", alignItems: "center", gap: 8, font: "var(--type-d4)", color: "var(--ink)", margin: "0 0 var(--space-3)" }}>
      <span aria-hidden="true">{emoji}</span> {text}
    </h3>
  );
}

const meanWrap = {
  display: "flex", gap: 6, background: "var(--canvas-sink)",
  padding: 5, borderRadius: "var(--radius-pill)", cornerShape: "var(--corner-chip)",
};
const meanSeg = {
  flex: 1, minHeight: 46, border: "none", cursor: "pointer",
  borderRadius: "var(--radius-pill)", cornerShape: "var(--corner-chip)",
  font: "var(--type-button)", fontSize: 15,
  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
};
const meanOn = { background: "var(--ember-600)", color: "#fff", boxShadow: "var(--gloss-card)" };
const meanOff = { background: "transparent", color: "var(--text-muted)" };
