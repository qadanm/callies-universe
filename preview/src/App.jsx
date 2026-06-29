import React, { useRef, useState } from "react";
import {
  Button,
  Chip,
  Card,
  Input,
  Badge,
  Sheet,
  Toast,
  Confetti,
  Callie,
  CallieStage,
  CallieHost,
  Roaster,
  CastPicker,
  Burst,
  Squiggle,
  Tape,
  HalftoneBand,
} from "@callies-universe/core";

/* The nine canonical Callie states, in spec order. */
const CALLIE_STATES = [
  "idle",
  "curious",
  "cooking",
  "delighted",
  "savage",
  "comfort",
  "celebrating",
  "empty",
  "error",
];

const COLOR_TOKENS = [
  ["--canvas", "Canvas"],
  ["--surface", "Surface"],
  ["--ink", "Ink"],
  ["--ink-soft", "Ink soft"],
  ["--cream", "Cream"],
  ["--ginger-500", "Ginger 500"],
  ["--ginger-700", "Ginger 700"],
  ["--charcoal-900", "Charcoal 900"],
  ["--accent-600", "Accent 600"],
  ["--accent-bright", "Accent bright"],
  ["--accent-soft", "Accent soft"],
  ["--pop-cyan", "Pop cyan"],
  ["--pop-pink", "Pop pink"],
  ["--success", "Success"],
  ["--warning", "Warning"],
  ["--danger", "Danger"],
  ["--info", "Info"],
];

const STICKER_TOKENS = [
  "--sticker-yellow",
  "--sticker-lime",
  "--sticker-cyan",
  "--sticker-pink",
  "--sticker-purple",
  "--sticker-sky",
];

const SPACE_TOKENS = ["--space-1", "--space-2", "--space-3", "--space-4", "--space-6", "--space-8", "--space-10"];
const RADIUS_TOKENS = ["--radius-sm", "--radius-md", "--radius-lg", "--radius-xl", "--radius-2xl"];
const ELEV_TOKENS = ["--elev-1", "--elev-2", "--elev-3", "--elev-4"];
const GLOSS_TOKENS = ["--gloss-card", "--gloss-primary", "--gloss-chip"];

function Section({ id, title, blurb, children }) {
  return (
    <section id={id} style={{ marginBottom: "var(--space-10)" }}>
      <h2 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: "0 0 6px" }}>{title}</h2>
      {blurb && (
        <p style={{ font: "var(--type-body)", color: "var(--text-muted)", margin: "0 0 var(--space-5)", maxWidth: 720 }}>
          {blurb}
        </p>
      )}
      {children}
    </section>
  );
}

function Specimen({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 64,
          padding: "var(--space-3)",
          background: "var(--surface)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--elev-1)",
        }}
      >
        {children}
      </div>
      <span style={{ font: "var(--type-legal)", color: "var(--text-hint)" }}>{label}</span>
    </div>
  );
}

const Row = ({ children, wrap = true, gap = "var(--space-3)" }) => (
  <div style={{ display: "flex", flexWrap: wrap ? "wrap" : "nowrap", gap, alignItems: "center" }}>{children}</div>
);

function Swatch({ token, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 110 }}>
      <div
        style={{
          height: 56,
          borderRadius: "var(--radius-md)",
          background: `var(${token})`,
          border: "1px solid var(--hairline)",
          boxShadow: "var(--elev-1)",
        }}
      />
      <div style={{ font: "var(--type-legal)", color: "var(--ink)", fontWeight: 700 }}>{label || token}</div>
      <code style={{ font: "var(--type-legal)", color: "var(--text-hint)" }}>{token}</code>
    </div>
  );
}

/* ---- Tokens ---- */
function Tokens() {
  return (
    <Section id="tokens" title="1 · Design tokens" blurb="The fixed calico base palette (cream / ginger / charcoal — Callie's coat) plus the documented --accent-* slot, which defaults to ginger so the core stands alone. Type, spacing, radius, elevation, and motion follow.">
      <h3 style={hd}>Color</h3>
      <Row gap="var(--space-4)">
        {COLOR_TOKENS.map(([t, l]) => (
          <Swatch key={t} token={t} label={l} />
        ))}
      </Row>

      <h3 style={hd}>Sticker set — decoration layer only</h3>
      <Row gap="var(--space-4)">
        {STICKER_TOKENS.map((t) => (
          <Swatch key={t} token={t} />
        ))}
      </Row>

      <h3 style={hd}>Type scale</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ font: "var(--type-reveal)", color: "var(--ink)" }}>Reveal 72</div>
        <div style={{ font: "var(--type-d1)", color: "var(--ink)" }}>Display 1 · 52</div>
        <div style={{ font: "var(--type-d3)", color: "var(--ink)" }}>Display 3 · 30</div>
        <div style={{ font: "var(--type-lead)", color: "var(--ink)" }}>Lead body · 18 (Hanken Grotesque)</div>
        <div style={{ font: "var(--type-body)", color: "var(--ink)" }}>Body · 16 — the quiet companion carries all small functional text.</div>
        <div style={{ font: "var(--type-cap)", color: "var(--text-muted)" }}>Caption · 13</div>
      </div>

      <h3 style={hd}>Spacing (4px base)</h3>
      <Row>
        {SPACE_TOKENS.map((t) => (
          <div key={t} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            <div style={{ width: `var(${t})`, height: 28, background: "var(--accent-600)", borderRadius: 4 }} />
            <code style={{ font: "var(--type-legal)", color: "var(--text-hint)" }}>{t}</code>
          </div>
        ))}
      </Row>

      <h3 style={hd}>Radius</h3>
      <Row gap="var(--space-4)">
        {RADIUS_TOKENS.map((t) => (
          <div key={t} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            <div style={{ width: 72, height: 56, background: "var(--accent-soft)", border: "2px solid var(--accent-600)", borderRadius: `var(${t})` }} />
            <code style={{ font: "var(--type-legal)", color: "var(--text-hint)" }}>{t}</code>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
          <div style={{ width: 64, height: 56, background: "var(--ginger-300)", borderRadius: "var(--radius-blob)" }} />
          <code style={{ font: "var(--type-legal)", color: "var(--text-hint)" }}>--radius-blob</code>
        </div>
      </Row>

      <h3 style={hd}>Elevation &amp; gloss</h3>
      <Row gap="var(--space-5)">
        {ELEV_TOKENS.map((t) => (
          <div key={t} style={{ width: 96, height: 60, background: "var(--surface)", borderRadius: "var(--radius-md)", boxShadow: `var(${t})`, display: "flex", alignItems: "center", justifyContent: "center", font: "var(--type-legal)", color: "var(--text-hint)" }}>
            {t.replace("--elev-", "elev ")}
          </div>
        ))}
        {GLOSS_TOKENS.map((t) => (
          <div key={t} style={{ width: 110, height: 60, background: t === "--gloss-primary" ? "var(--accent-600)" : "var(--surface)", color: t === "--gloss-primary" ? "var(--on-accent)" : "var(--text-hint)", borderRadius: "var(--radius-lg)", boxShadow: `var(${t})`, display: "flex", alignItems: "center", justifyContent: "center", font: "var(--type-legal)" }}>
            {t.replace("--gloss-", "gloss ")}
          </div>
        ))}
      </Row>

      <h3 style={hd}>Motion</h3>
      <Row gap="var(--space-5)">
        <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "var(--accent-600)", animation: "rmr-squish-idle 3s var(--ease-out) infinite" }} />
        <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "var(--flame-500)", animation: "rmr-bob 2.4s var(--ease-out) infinite" }} />
        <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "var(--pop-cyan)", animation: "rmr-jiggle 0.9s var(--ease-out) infinite" }} />
        <span style={{ font: "var(--type-cap)", color: "var(--text-muted)" }}>
          squish · bob · jiggle — all have a calm <code>prefers-reduced-motion</code> fallback.
        </span>
      </Row>
    </Section>
  );
}

/* ---- Callie ---- */
function CallieShowcase() {
  const callie = useRef(null);
  const [current, setCurrent] = useState("idle");
  const set = (s) => { setCurrent(s); callie.current?.setState(s); };

  return (
    <Section id="callie" title="3 · Callie — the 9-state mascot" blurb="One kawaii calico, reused everywhere via a named state system. She reacts, never narrates. Placeholder art, swappable later without changing the API.">
      <h3 style={hd}>All nine states</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "var(--space-4)" }}>
        {CALLIE_STATES.map((s) => (
          <Specimen key={s} label={s}>
            <Callie state={s} size={96} placeholderTag />
          </Specimen>
        ))}
      </div>

      <h3 style={hd}>Imperative API — <code>callie.setState('…')</code></h3>
      <Row gap="var(--space-5)">
        <CallieStage ref={callie} initialState="idle" size={120} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Row>
            {CALLIE_STATES.map((s) => (
              <Button key={s} size="sm" variant={s === current ? "primary" : "secondary"} onClick={() => set(s)}>{s}</Button>
            ))}
          </Row>
          <span style={{ font: "var(--type-cap)", color: "var(--text-muted)" }}>
            Driven by name over a ref — currently <strong>{current}</strong>.
          </span>
        </div>
      </Row>

      <h3 style={hd}>Behavioral host — entrance · idle-cycle · tip bubble</h3>
      <Row gap="var(--space-8)">
        {["home", "cooking", "reveal", "celebrate"].map((ctx) => (
          <div key={ctx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 40 }}>
            <CallieHost context={ctx} size={104} bubble />
            <code style={{ font: "var(--type-legal)", color: "var(--text-hint)" }}>context="{ctx}"</code>
          </div>
        ))}
      </Row>
    </Section>
  );
}

/* ---- Cast ---- */
function CastShowcase() {
  const [picked, setPicked] = useState(null);
  return (
    <Section id="cast" title="4 · The character cast" blurb="Eight named comedic performers who narrate inside apps (distinct from Callie, who only reacts). The CastPicker reads Roaster.roster, so adding a cast member extends it automatically.">
      <h3 style={hd}>The eight avatars</h3>
      <Row gap="var(--space-4)">
        {Roaster.roster.map((r) => (
          <Specimen key={r.id} label={r.name.split(" ")[0]}>
            <Roaster id={r.id} size={84} ring />
          </Specimen>
        ))}
      </Row>

      <h3 style={hd}>CastPicker</h3>
      <div style={{ maxWidth: 430 }}>
        <CastPicker initialId="mama" onChange={setPicked} />
      </div>
      {picked && (
        <p style={{ font: "var(--type-cap)", color: "var(--text-muted)", marginTop: "var(--space-3)" }}>
          Selected: <strong>{picked.name}</strong> — {picked.register} · {picked.spice}
        </p>
      )}
    </Section>
  );
}

const hd = {
  font: "var(--type-d4)",
  color: "var(--ink)",
  margin: "var(--space-6) 0 var(--space-3)",
};

/* ---- Facelift ---- */
const tintFor = (ring) => `color-mix(in srgb, ${ring} 40%, #fff)`;
const chipStyle = (corner, bg) => ({
  border: "var(--ink-outline)", padding: "14px 22px", fontWeight: 800, color: "var(--ink)",
  background: bg, borderRadius: "var(--radius-lg)", cornerShape: `var(${corner})`,
  boxShadow: "var(--shadow-sticker-md)",
});

function FaceliftShowcase() {
  const cast = Roaster.roster.filter((r) => !r.comingSoon);
  return (
    <Section id="facelift" title="0 · The facelift" blurb="Superellipse corners, a hand-inked wobble on borders, die-cut sticker depth, color tints, and comic accents — all pure CSS/SVG, defined in core so it cascades to web, app, and video. (Squircles render on Chromium; Safari/iOS fall back to rounded.)">
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-8)", alignItems: "center" }}>
        <div style={{ position: "relative", width: 150, height: 150, display: "grid", placeItems: "center" }}>
          <span className="ink" aria-hidden style={{ position: "absolute", inset: -22, background: "var(--sticker-yellow)", clipPath: "polygon(50% 0,59% 18%,78% 8%,75% 30%,97% 28%,82% 46%,100% 60%,78% 64%,86% 88%,63% 78%,55% 100%,44% 79%,22% 90%,28% 66%,4% 64%,22% 48%,2% 32%,24% 30%,20% 8%,40% 18%)" }} />
          <div style={{ position: "relative" }}><Callie state="celebrating" size={120} ink /></div>
        </div>
        <div>
          <h3 style={{ font: "var(--type-d1)", margin: 0, color: "var(--ink)", WebkitTextStroke: "2px var(--ink)", textShadow: "3px 3px 0 var(--sticker-purple)" }}>
            Cute, but{" "}
            <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
              <span className="ink" aria-hidden style={{ position: "absolute", left: -4, right: -4, top: "20%", bottom: "12%", background: "var(--marker-hl)", transform: "rotate(-1.6deg)", borderRadius: 7 }} />
              <span style={{ position: "relative" }}>stunning</span>
            </span>.
          </h3>
          <Squiggle width={220} />
          <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
            <Button variant="primary">Roast my ride 🔥</Button>
            <Button variant="accent">Watch a roast</Button>
            <Burst>NEW</Burst>
          </div>
        </div>
      </div>

      <h3 style={hd}>Inked sticker cards · per-character tint · tape</h3>
      <Row gap="var(--space-6)">
        {cast.slice(0, 4).map((r, i) => (
          <Card key={r.id} ink tint={tintFor(r.ring)} rotate={[-2.5, 2, -1.5, 2.8][i]} pad="var(--space-4)" style={{ width: 178, textAlign: "center", position: "relative" }}>
            {i === 1 && <Tape />}
            <Roaster id={r.id} size={104} ink />
            <div style={{ font: "var(--type-d4)", color: "var(--ink)", marginTop: 4 }}>{r.name.split(" ")[0]}</div>
            <div style={{ font: "var(--type-legal)", color: "var(--ember-700)", textTransform: "uppercase", fontWeight: 800, marginBottom: 10 }}>{r.tag}</div>
            <Button size="sm">BUY · $25</Button>
          </Card>
        ))}
      </Row>

      <h3 style={hd}>Halftone band — the contrast moment</h3>
      <HalftoneBand star bg="#46199A" style={{ borderRadius: "var(--radius-xl)", cornerShape: "var(--corner-card)", padding: "30px 26px" }}>
        <h4 style={{ color: "#fff", font: "var(--type-d3)", margin: "0 0 18px", textShadow: "3px 3px 0 var(--ember-600)" }}>Stick 'em anywhere.</h4>
        <Row gap="var(--space-5)">
          {cast.slice(0, 3).map((r, i) => (
            <Card key={r.id} ink tint={tintFor(r.ring)} rotate={[-2, 1.6, -1.4][i]} pad="var(--space-4)" style={{ width: 150, textAlign: "center" }}>
              <Roaster id={r.id} size={90} ink />
              <div style={{ font: "var(--type-d4)", color: "var(--ink)", marginTop: 4 }}>{r.name.split(" ")[0]}</div>
            </Card>
          ))}
        </Row>
      </HalftoneBand>

      <h3 style={hd}>Corner-shape language — one API, four roles</h3>
      <Row gap="var(--space-4)">
        <div style={chipStyle("--corner-card", "#FFE7B8")}>squircle · cards</div>
        <div style={chipStyle("--corner-tag", "#CFE9FF")}>notch · tags</div>
        <div style={chipStyle("--corner-ticket", "#FAD4E6")}>scoop · tickets</div>
        <div style={chipStyle("--corner-badge", "#D6F2DD")}>bevel · badges</div>
      </Row>
    </Section>
  );
}

export function App() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [boom, setBoom] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", color: "var(--ink)" }}>
      {/* header */}
      <header style={{ position: "relative", padding: "var(--space-8) var(--gutter) var(--space-7)", textAlign: "center", overflow: "hidden" }}>
        <Confetti active={boom} count={36} />
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Callie state="delighted" size={108} />
        </div>
        <h1 style={{ font: "var(--type-d1)", margin: "0 0 6px" }}>Callie's Universe — core</h1>
        <p style={{ font: "var(--type-lead)", color: "var(--text-muted)", margin: 0 }}>
          <code>@callies-universe/core@0.1.0</code> · the shared foundation, rendered.
        </p>
      </header>

      <main style={{ maxWidth: "var(--content-max)", margin: "0 auto", padding: "var(--space-4) var(--gutter) var(--space-12)" }}>
        <FaceliftShowcase />
        <Tokens />
        <ComponentsBridge onOpenSheet={() => setSheetOpen(true)} onBoom={() => { setBoom(true); setTimeout(() => setBoom(false), 2600); }} />
        <CallieShowcase />
        <CastShowcase />
      </main>

      <Sheet
        open={sheetOpen}
        title="Bouncy bottom sheet"
        header={<Callie state="celebrating" size={92} />}
        onClose={() => setSheetOpen(false)}
        primaryAction={<Button variant="primary" block onClick={() => setSheetOpen(false)}>Got it</Button>}
      >
        Clean content, mascot hosting the header, scrim that never blocks the close affordance.
      </Sheet>
    </div>
  );
}

/* Small bridge so the Sheet/Confetti controls in §2 drive state held at the App root. */
function ComponentsBridge({ onOpenSheet, onBoom }) {
  const [chips, setChips] = useState({ daily: true, mods: false, track: false });
  return (
    <Section id="components" title="2 · Component library" blurb="App-agnostic primitives: Button, Chip, Card, Input, Badge, Sheet, Toast, Confetti. Clean, AA-legible bones; decoration only on the optional skin layer.">
      <h3 style={hd}>Button — variants × sizes</h3>
      <Row>
        <Button variant="primary">Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </Row>
      <Row>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="lg" iconLeft={<span aria-hidden>🔥</span>}>With icon</Button>
      </Row>
      <div style={{ maxWidth: 320, marginTop: "var(--space-3)" }}>
        <Button variant="primary" size="lg" block>Block button</Button>
      </div>

      <h3 style={hd}>Chip — multi-select (toggle me)</h3>
      <Row>
        <Chip emoji="🚗" selected={chips.daily} onToggle={(v) => setChips((c) => ({ ...c, daily: v }))}>Daily driver</Chip>
        <Chip emoji="🔧" selected={chips.mods} onToggle={(v) => setChips((c) => ({ ...c, mods: v }))}>Modded</Chip>
        <Chip emoji="🏁" selected={chips.track} onToggle={(v) => setChips((c) => ({ ...c, track: v }))}>Track toy</Chip>
      </Row>

      <h3 style={hd}>Card — clean bones + optional corner sticker</h3>
      <Row gap="var(--space-5)">
        <Card style={{ maxWidth: 260 }}>
          <h4 style={{ font: "var(--type-d4)", margin: "0 0 6px", color: "var(--ink)" }}>Clean interior</h4>
          <p style={{ font: "var(--type-body)", color: "var(--text-body)", margin: 0 }}>The functional layer stays obvious and legible.</p>
        </Card>
        <Card sticker={<Badge tone="flame">NEW</Badge>} stickerCorner="tr" style={{ maxWidth: 260 }}>
          <h4 style={{ font: "var(--type-d4)", margin: "0 0 6px", color: "var(--ink)" }}>With a sticker</h4>
          <p style={{ font: "var(--type-body)", color: "var(--text-body)", margin: 0 }}>Decoration pins to a corner — never over text or a tap target.</p>
        </Card>
      </Row>

      <h3 style={hd}>Input — default · focus · error</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-4)", maxWidth: 760 }}>
        <Input label="Your name" placeholder="Tap to focus (cyan ring)" hint="Helper text lives here." />
        <Input label="Email" defaultValue="not-an-email" error="That doesn't look right." />
        <Input label="With icon" iconLeft={<span aria-hidden>🔎</span>} placeholder="Search the cast" />
      </div>

      <h3 style={hd}>Badge — tones</h3>
      <Row>
        {["ember", "flame", "success", "info", "cool", "pink", "ink"].map((t) => (
          <Badge key={t} tone={t}>{t}</Badge>
        ))}
      </Row>

      <h3 style={hd}>Toast — tones</h3>
      <Row>
        <Toast tone="ink" icon={<span aria-hidden>💾</span>}>Saved</Toast>
        <Toast tone="success" icon={<span aria-hidden>✅</span>}>Roast ready</Toast>
        <Toast tone="danger" icon={<span aria-hidden>⚠️</span>}>Upload failed</Toast>
        <Toast tone="flame" icon={<span aria-hidden>🔥</span>}>Spicy</Toast>
      </Row>

      <h3 style={hd}>Sheet &amp; Confetti</h3>
      <Row>
        <Button variant="primary" onClick={onOpenSheet}>Open sheet</Button>
        <Button variant="accent" onClick={onBoom}>Throw confetti 🎉</Button>
      </Row>
    </Section>
  );
}
