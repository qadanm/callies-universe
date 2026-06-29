// Screen 4: Tonight's lineup. Pick ONE comic (solo) or TWO (the Green Room panel).
// CORE-REUSED: CastPicker, Roaster avatars, CallieHost, Button.
// ROASTMYRIDE-NEW: Solo/Duo format toggle + the duo picker for the panel format.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CastPicker, CallieHost, Roaster } from "@callies-universe/core";
import { ScreenScroll, stickyBar } from "../components/ui.jsx";
import { Marquee } from "../components/Marquee.jsx";
import { comicStyle } from "../standup.js";
import { useFlow } from "../flow/FlowContext.jsx";
import { cfg } from "../subjects/index.js";

const firstName = (name) => String(name || "").replace(/[“"].*$/, "").split(" ")[0];

export function Cast() {
  const go = useNavigate();
  const { input, update } = useFlow();
  const [mode, setMode] = useState(input.format || "single");
  const [sel, setSel] = useState(null);
  // The duo, in pick order [a, b]. Seeded from any prior choice.
  const [duo, setDuo] = useState(Array.isArray(input.roasterIds) ? input.roasterIds.slice(0, 2) : []);

  const onChangeSolo = (roaster) => {
    setSel(roaster);
    update({ format: "single", roasterId: roaster.id });
  };

  const chooseMode = (m) => {
    setMode(m);
    // Keep flow state clean: roasterIds is only meaningful for the panel format.
    if (m === "single") update({ format: "single", roasterIds: [] });
    else update({ format: "panel", roasterIds: duo });
  };

  // Tap a comic in duo mode: toggle membership, capped at 2 (FIFO so it's forgiving).
  const toggleDuo = (id) => {
    const next = duo.includes(id)
      ? duo.filter((x) => x !== id)
      : duo.length < 2 ? [...duo, id] : [duo[1], id];
    setDuo(next);
    update({ format: "panel", roasterIds: next });
  };

  const roster = Roaster.roster;
  const activeCount = roster.filter((r) => !r.comingSoon).length;
  const [a, b] = duo;
  const aName = a && firstName(roster.find((r) => r.id === a)?.name);
  const bName = b && firstName(roster.find((r) => r.id === b)?.name);

  const style = sel ? comicStyle(sel.id) : `${activeCount} comics. Same ${cfg("brain.subjectNoun")}. ${activeCount} completely different shows.`;
  const duoReady = duo.length === 2;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(120% 50% at 50% 0%, var(--heat-300) 0%, var(--canvas) 42%)",
      }}
    >
      <ScreenScroll style={{ paddingBottom: 0 }}>
        <Marquee kicker="Tonight's lineup" title="Who's taking the stage?">
          {mode === "panel"
            ? "Two comics. One green room. They riff off each other about you."
            : sel ? `${sel.name} · ${style}` : style}
        </Marquee>

        {/* Solo / Duo format toggle */}
        <div role="tablist" aria-label="Format" style={{ display: "flex", gap: 6, background: "var(--bg-sunken)", padding: 4, borderRadius: "var(--radius-pill)", margin: "0 0 var(--space-3)" }}>
          {[
            { id: "single", label: "🎤 Solo" },
            { id: "panel", label: "🎙️ Green Room" },
          ].map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={mode === t.id}
              data-testid={`format-${t.id}`}
              onClick={() => chooseMode(t.id)}
              style={{
                flex: 1,
                minHeight: 40,
                border: "none",
                cursor: "pointer",
                borderRadius: "var(--radius-pill)",
                font: "var(--type-button)",
                fontSize: 15,
                background: mode === t.id ? "var(--ember-600)" : "transparent",
                color: mode === t.id ? "#fff" : "var(--text-muted)",
                boxShadow: mode === t.id ? "var(--gloss-card)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
          <div style={{ position: "relative", flexShrink: 0, lineHeight: 0 }}>
            <CallieHost context="cast" size={48} />
            <span aria-hidden="true" style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 9, letterSpacing: "0.04em", textTransform: "uppercase", background: "var(--ink)", color: "var(--canvas)", padding: "1px 6px", borderRadius: "var(--radius-pill)", cornerShape: "var(--corner-chip)" }}>★ host</span>
          </div>
          <span style={{ font: "var(--type-cap)", color: "var(--text-muted)" }}>
            {mode === "panel" ? "Pick two. They'll roast you back and forth." : "Callie hosts, she never roasts you. The 🎤 comics do."}
          </span>
        </div>

        {mode === "single" ? (
          <CastPicker initialId={input.roasterId} onChange={onChangeSolo} />
        ) : (
          <DuoPicker roster={roster} duo={duo} onToggle={toggleDuo} />
        )}
      </ScreenScroll>

      <div style={stickyBar}>
        {mode === "single" ? (
          <Button variant="primary" size="lg" block onClick={() => go("/cooking")}>
            Put {sel ? firstName(sel.name) : "them"} on stage
          </Button>
        ) : (
          <Button variant="primary" size="lg" block disabled={!duoReady} onClick={() => duoReady && go("/cooking")}>
            {duoReady ? `${aName} & ${bName} → the green room 🎙️` : `Pick two comics (${duo.length}/2)`}
          </Button>
        )}
      </div>
    </div>
  );
}

// The duo picker: a grid of the cast; tap to add/remove, capped at two. The two
// picks get an A/B badge so the order (who leads) is clear.
function DuoPicker({ roster, duo, onToggle }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-3)" }}>
        <h3 style={{ font: "var(--type-d4)", color: "var(--ink)", margin: 0 }}>Pick your duo</h3>
        <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>{duo.length}/2 chosen</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-2)" }}>
        {roster.map((c) => {
          const slot = duo.indexOf(c.id); // -1, 0 (A), 1 (B)
          const picked = slot >= 0;
          const soon = c.comingSoon;
          return (
            <button
              key={c.id}
              data-testid={`duo-${c.id}`}
              disabled={soon}
              aria-pressed={picked}
              aria-label={soon ? `${c.name} (coming soon)` : c.name}
              onClick={() => !soon && onToggle(c.id)}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "8px 2px",
                borderRadius: "var(--radius-lg)",
                border: `3px solid ${picked ? "var(--ember-600)" : "transparent"}`,
                background: picked ? "var(--surface)" : "transparent",
                boxShadow: picked ? "var(--gloss-card)" : "none",
                cursor: soon ? "default" : "pointer",
                opacity: soon ? 0.5 : 1,
                filter: soon ? "grayscale(1)" : "none",
              }}
            >
              <div style={{ position: "relative" }}>
                <Roaster id={c.id} size={62} ring />
                {picked && (
                  <span style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "var(--radius-pill)", background: "var(--ember-600)", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--canvas)" }}>
                    {slot === 0 ? "A" : "B"}
                  </span>
                )}
              </div>
              <span style={{ font: "var(--type-legal)", fontWeight: 700, color: picked ? "var(--ember-600)" : "var(--text-muted)" }}>{firstName(c.name)}</span>
              {soon && <span style={{ position: "absolute", top: 3, left: "50%", transform: "translateX(-50%)", fontSize: 8.5, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", background: "var(--ink)", color: "var(--canvas)", padding: "1px 5px", borderRadius: 6, whiteSpace: "nowrap" }}>Soon</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
