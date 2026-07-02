// Home = the WHOLE setup, two panels + one button.
//   Panel 1 "Your car"    : photo + the required "what is it?" field
//   Panel 2 "Pick 2 voices": four voice cards, each with a real audio preview;
//                            tap two to choose the pair that roasts the car.
// One button goes straight to the roast. Callie hosts from the header (small,
// reactive), never the hero. No "show", no "comic", no "green room".
// CORE-REUSED: CallieHost, Card, Badge, Chip, Sheet.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Badge, Chip, Sheet, CallieHost } from "@callies-universe/core";
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
  const [styleOpen, setStyleOpen] = useState(false);
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
  const hasPhoto = !!photo.dataUrl;
  const hasCar = !requireIdentity || carLabel.trim().length > 0;
  const twoVoices = voiceIds.length === 2;
  const ready = hasPhoto && hasCar && twoVoices;
  const ctaLabel = !hasPhoto
    ? "Add a photo first"
    : !hasCar
    ? "Name the car first"
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

  const chipCount = (input.context || []).length;
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

        {/* Optional style: one slim row, never a step */}
        <button onClick={() => { haptic(); setStyleOpen(true); }} style={styleRow} data-testid="style-row">
          <span style={{ font: "var(--type-sm)", fontWeight: 800, color: "var(--ink)" }}>🌶️ Roast style</span>
          <span style={{ font: "var(--type-cap)", color: chipCount ? "var(--ember-600)" : "var(--text-hint)", fontWeight: 700 }}>
            {chipCount ? `${chipCount} picked` : "Optional"}
          </span>
        </button>
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

      {styleOpen && <StyleSheet onClose={() => setStyleOpen(false)} />}
    </div>
  );
}

/* The optional roast-style chips, as a bottom sheet. Same FlowContext field. */
function StyleSheet({ onClose }) {
  const { input, update } = useFlow();
  const [picked, setPicked] = useState(() => new Set(input.context));
  const buckets = useMemo(() => cfg("chips.buckets", []), []);
  const toggle = (key, on) =>
    setPicked((prev) => {
      const next = new Set(prev);
      on ? next.add(key) : next.delete(key);
      return next;
    });
  const done = () => {
    update({ context: [...picked] });
    onClose();
  };
  return (
    <Sheet
      open
      title="How hard should they go?"
      onClose={done}
      style={{ paddingBottom: "calc(var(--space-6) + env(safe-area-inset-bottom))" }}
      primaryAction={
        <Button variant="primary" size="lg" block onClick={done}>
          {picked.size ? `Done · ${picked.size} picked` : "Done"}
        </Button>
      }
    >
      <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-3)", textAlign: "center" }}>
        All free. Pick a few, or skip it.
      </p>
      {buckets.map((b) => (
        <div key={b.group} style={{ marginBottom: "var(--space-3)" }}>
          <div style={{ font: "var(--type-cap)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-hint)", margin: "0 0 8px 4px" }}>
            {b.group}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {b.items.map(([key, label]) => (
              <Chip key={key} selected={picked.has(key)} onToggle={(on) => toggle(key, on)}>
                {label}
              </Chip>
            ))}
          </div>
        </div>
      ))}
    </Sheet>
  );
}

function PanelTitle({ emoji, text }) {
  return (
    <h3 style={{ display: "flex", alignItems: "center", gap: 8, font: "var(--type-d4)", color: "var(--ink)", margin: "0 0 var(--space-3)" }}>
      <span aria-hidden="true">{emoji}</span> {text}
    </h3>
  );
}

const styleRow = {
  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
  minHeight: 46, padding: "0 var(--space-4)", cursor: "pointer",
  background: "var(--surface)", border: "1px solid var(--hairline)",
  borderRadius: "var(--radius-md)", cornerShape: "var(--corner-chip)",
};
