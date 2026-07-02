// Screen 2: Home = the WHOLE roast setup, two panels + one CTA.
//   Panel 1 "Your ride"  : photo + the required "what is it?" field
//   Panel 2 "Your comic" : horizontal strip of the active cast (Mama pre-picked)
//   + one slim optional Seasoning row (chips live in a bottom sheet)
// Chips/Cast are no longer between the user and the roast: the CTA goes straight
// to /cooking. Callie hosts from the header (small, reactive), never the hero.
// CORE-REUSED: CallieHost, Card, Badge, Button, Chip, Sheet, Roaster.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Badge, Chip, Sheet, CallieHost, Roaster } from "@callies-universe/core";
import { ScreenScroll, Wordmark, stickyBar } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";
import { hasRoastApi, identifyCarViaApi } from "../services/roastApi.js";
import { loadCompressedImage } from "../photo.js";
import { isNative, pickPhoto, haptic } from "../native.js";
import { comicStyle } from "../standup.js";
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
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [callieEvt, setCallieEvt] = useState(null); // "upload" pops her when a photo lands

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

  // ---- comic panel state ----
  const roster = Roaster.roster;
  const active = useMemo(() => roster.filter((r) => !r.comingSoon), [roster]);
  const isDuo = input.format === "panel" && Array.isArray(input.roasterIds) && input.roasterIds.length === 2;
  const selected = active.find((r) => r.id === input.roasterId) || active[0];
  const pickComic = (id) => {
    haptic();
    update({ format: "single", roasterId: id, roasterIds: [] });
  };
  const duoNames = isDuo
    ? input.roasterIds.map((id) => firstName(roster.find((r) => r.id === id)?.name)).join(" & ")
    : null;

  // ---- CTA state: the label tells the user the one thing left to do ----
  const hasPhoto = !!photo.dataUrl;
  const hasCar = !requireIdentity || carLabel.trim().length > 0;
  const ready = hasPhoto && hasCar;
  const ctaLabel = !hasPhoto ? "Add a photo first" : !hasCar ? "Name the car first" : cfg("upload.cta") + " 🔥";
  const proceed = () => {
    if (!ready) return;
    haptic();
    update({ car: carLabel.trim() ? { label: carLabel.trim() } : null });
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

        {/* Panel 1: the ride */}
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

        {/* Panel 2: the comic */}
        <Card pad="var(--space-4)">
          <PanelTitle emoji="🎤" text="Your comic" />
          {isDuo ? (
            <button onClick={() => go("/cast")} style={duoRow} aria-label="Change your duo">
              <span style={{ display: "flex" }}>
                {input.roasterIds.map((id, i) => (
                  <span key={id} style={{ marginLeft: i ? -10 : 0, position: "relative" }}>
                    <Roaster id={id} size={44} ring />
                    <span style={abBadge}>{i === 0 ? "A" : "B"}</span>
                  </span>
                ))}
              </span>
              <span style={{ font: "var(--type-sm)", fontWeight: 700, color: "var(--ink)", textAlign: "left", flex: 1 }}>
                {duoNames} in the green room 🎙️
              </span>
              <span style={{ font: "var(--type-cap)", color: "var(--ember-600)", fontWeight: 800 }}>Change</span>
            </button>
          ) : (
            <>
              <div style={strip} role="radiogroup" aria-label="Pick your comic">
                {active.map((c) => {
                  const on = selected && c.id === selected.id;
                  return (
                    <button
                      key={c.id}
                      role="radio"
                      aria-checked={on}
                      data-testid={`comic-${c.id}`}
                      onClick={() => pickComic(c.id)}
                      style={{
                        flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                        background: "none", border: "none", cursor: "pointer", padding: 4,
                      }}
                    >
                      <span style={{ borderRadius: 999, boxShadow: on ? "0 0 0 3px var(--ember-600)" : "0 0 0 2px var(--hairline)", lineHeight: 0 }}>
                        <Roaster id={c.id} size={58} />
                      </span>
                      <span style={{ font: "var(--type-legal)", fontWeight: 700, color: on ? "var(--ember-600)" : "var(--text-muted)" }}>
                        {firstName(c.name)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {selected && (
                <p style={{ font: "var(--type-cap)", color: "var(--text-muted)", margin: "6px 2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {firstName(selected.name)} · {comicStyle(selected.id)}
                </p>
              )}
            </>
          )}
          <button onClick={() => { haptic(); go("/cast"); }} style={ghostRow}>
            Full cast, voices and duos <span aria-hidden="true">→</span>
          </button>
        </Card>

        {/* Optional seasoning: one slim row, never a step */}
        <button onClick={() => { haptic(); setSeasonOpen(true); }} style={seasonRow} data-testid="seasoning-row">
          <span style={{ font: "var(--type-sm)", fontWeight: 800, color: "var(--ink)" }}>🌶️ Seasoning</span>
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

      {seasonOpen && <SeasoningSheet onClose={() => setSeasonOpen(false)} />}
    </div>
  );
}

/* Chips, demoted from a screen to a sheet. Same FlowContext field. */
function SeasoningSheet({ onClose }) {
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
      title="How should we cook it?"
      onClose={done}
      style={{ paddingBottom: "calc(var(--space-6) + env(safe-area-inset-bottom))" }}
      primaryAction={
        <Button variant="primary" size="lg" block onClick={done}>
          {picked.size ? `Done · ${picked.size} picked` : "Done"}
        </Button>
      }
    >
      <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-3)", textAlign: "center" }}>
        Tap a few, or none. Chips are always free.
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

const strip = {
  display: "flex", gap: 6, overflowX: "auto", overflowY: "hidden",
  padding: "2px 2px 4px", margin: "0 -2px", WebkitOverflowScrolling: "touch",
  scrollbarWidth: "none",
};

const ghostRow = {
  width: "100%", marginTop: "var(--space-3)", minHeight: 40,
  background: "none", border: "none", cursor: "pointer",
  font: "var(--type-cap)", fontWeight: 800, color: "var(--ember-600)",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
};

const duoRow = {
  width: "100%", display: "flex", alignItems: "center", gap: 12,
  background: "var(--canvas-sink)", border: "2px solid var(--heat-400)",
  borderRadius: "var(--radius-md)", padding: "10px 12px", cursor: "pointer",
};

const abBadge = {
  position: "absolute", bottom: -2, right: -2, width: 16, height: 16,
  borderRadius: 999, background: "var(--ember-600)", color: "#fff",
  fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
  border: "2px solid var(--canvas)",
};

const seasonRow = {
  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
  minHeight: 46, padding: "0 var(--space-4)", cursor: "pointer",
  background: "var(--surface)", border: "1px solid var(--hairline)",
  borderRadius: "var(--radius-md)", cornerShape: "var(--corner-chip)",
};
