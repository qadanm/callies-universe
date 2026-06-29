import React, { useState, useEffect } from "react";
import { Roaster } from "./Roaster.jsx";

/**
 * CastPicker — the reusable character-tile / cast-picker for the whole universe.
 * Featured roaster (avatar + catchphrase + spice meter + favorite) over a
 * tap-to-switch grid of all cast members. Reads the cast from `Roaster.roster`,
 * so it auto-extends as new characters are added. App-agnostic: the host adds
 * its own header (Callie) and confirm CTA around it.
 */
export function CastPicker({ initialId, onChange, style, ...rest }) {
  const roster = Roaster.roster;
  // Never feature a coming-soon (tabled) character — start on the requested one if
  // it's available, else the first active comic.
  const firstActive = Math.max(0, roster.findIndex((r) => !r.comingSoon));
  const wanted = roster.findIndex((r) => r.id === initialId);
  const [pick, setPick] = useState(wanted >= 0 && !roster[wanted].comingSoon ? wanted : firstActive);
  const [fav, setFav] = useState({});
  const [previewing, setPreviewing] = useState(false);
  const r = roster[pick];
  const pips = r.spice === "Spicy" ? 3 : r.spice === "Medium" ? 2 : 1;

  useEffect(() => { onChange && onChange(r); /* eslint-disable-next-line */ }, [pick]);
  useEffect(() => { setPreviewing(true); const t = setTimeout(() => setPreviewing(false), 1400); return () => clearTimeout(t); }, [pick]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", ...style }} {...rest}>
      {/* featured */}
      <div style={{ position: "relative", textAlign: "center", background: "linear-gradient(180deg,var(--accent-soft),var(--surface))", borderRadius: "var(--radius-card)", boxShadow: "var(--gloss-card)", padding: "var(--space-5)" }}>
        <button onClick={() => setFav((f) => ({ ...f, [r.id]: !f[r.id] }))} aria-label="Favorite"
          style={{ position: "absolute", top: -12, right: 14, width: 34, height: 34, borderRadius: "var(--radius-pill)", border: "none", cursor: "pointer", background: "var(--sticker-yellow)", color: "var(--ink)", fontSize: 18, boxShadow: "var(--shadow-sticker)" }}>{fav[r.id] ? "★" : "☆"}</button>
        <div style={{ display: "inline-block", maxWidth: 280, background: "var(--ink)", color: "var(--canvas)", borderRadius: "var(--radius-lg)", padding: "8px 14px", font: "var(--type-sm)", fontWeight: 600, fontStyle: "italic", boxShadow: "var(--shadow-sticker)" }}>“{r.phrase}”</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 4, transform: previewing ? "scale(1.04)" : "scale(1)", transition: "transform var(--dur-3) var(--ease-spring)" }}>
          <Roaster id={r.id} size={132} ring />
        </div>
        <h2 style={{ font: "var(--type-d3)", color: "var(--ink)", margin: "8px 0 2px" }}>{r.name}</h2>
        <div style={{ font: "var(--type-cap)", color: "var(--ember-600)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.tag}</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 10 }}>
          <span style={{ padding: "4px 11px", borderRadius: "var(--radius-pill)", font: "var(--type-cap)", fontWeight: 700, background: "var(--flame-500)", color: "var(--ink)", boxShadow: "var(--shadow-sticker)" }}>{r.register}</span>
          <span style={{ fontSize: 15, letterSpacing: 2 }} aria-label={`spice ${pips} of 3`}>{"🌶".repeat(pips)}<span style={{ opacity: 0.25 }}>{"🌶".repeat(3 - pips)}</span></span>
        </div>
        <button onClick={() => setPreviewing(true)} style={{ marginTop: "var(--space-4)", width: "100%", minHeight: "var(--tap-cozy)", borderRadius: "var(--radius-pill)", border: "2px solid var(--ember-600)", background: "var(--surface)", color: "var(--ember-600)", font: "var(--type-button)", fontSize: 16, cursor: "pointer", boxShadow: "var(--gloss-card)" }}>
          {previewing ? "🔊 Previewing…" : "▶  Preview voice"}
        </button>
      </div>

      {/* grid */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-3)" }}>
          <h3 style={{ font: "var(--type-d4)", color: "var(--ink)", margin: 0 }}>Meet the cast</h3>
          <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>{roster.length} roasters · tap to switch</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-2)" }}>
          {roster.map((c, i) => {
            const soon = c.comingSoon;
            const active = i === pick && !soon;
            return (
            <button key={c.id} disabled={soon} onClick={() => !soon && setPick(i)} aria-label={soon ? `${c.name} (coming soon)` : c.name} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 2px", borderRadius: "var(--radius-lg)", border: `3px solid ${active ? "var(--ember-600)" : "transparent"}`, background: active ? "var(--surface)" : "transparent", boxShadow: active ? "var(--gloss-card)" : "none", cursor: soon ? "default" : "pointer", opacity: soon ? 0.5 : 1, filter: soon ? "grayscale(1)" : "none" }}>
              <div style={{ position: "relative" }}>
                <Roaster id={c.id} size={62} ring />
                {fav[c.id] && !soon && <span style={{ position: "absolute", top: -2, right: -2, fontSize: 14, color: "var(--sticker-yellow)", textShadow: "0 1px 0 var(--ink)" }}>★</span>}
                {active && <span style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "var(--radius-pill)", background: "var(--ember-600)", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--canvas)" }}>✓</span>}
              </div>
              <span style={{ font: "var(--type-legal)", fontWeight: 700, color: active ? "var(--ember-600)" : "var(--text-muted)" }}>{c.name.replace(/[“"].*$/, "").split(" ")[0]}</span>
              {soon && <span style={{ position: "absolute", top: 3, left: "50%", transform: "translateX(-50%)", fontSize: 8.5, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", background: "var(--ink)", color: "var(--canvas)", padding: "1px 5px", borderRadius: 6, whiteSpace: "nowrap" }}>Soon</span>}
            </button>
          );})}
        </div>
      </div>
    </div>
  );
}
