/* RoastMyRide app — screens part A: Onboarding, Home/Upload, the Cast picker, Cooking.
   Composes design-system primitives from window.RoastMyRideDesignSystem_896616. */
const RMR = window.RoastMyRideDesignSystem_896616;
const { Button, Card, Badge, Mascot, MascotHost, CallieHost, Confetti, Roaster, CastPicker } = RMR;

/* ---------- shared bits ---------- */
function ScreenScroll({ children, style }) {
  return <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-5)", ...style }}>{children}</div>;
}
function Eyebrow({ children }) {
  return <span style={{ font: "var(--type-cap)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ember-600)", fontWeight: 800 }}>{children}</span>;
}
function H({ children, style }) {
  return <h1 style={{ font: "var(--type-d1)", color: "var(--ink)", margin: 0, lineHeight: 1, ...style }}>{children}</h1>;
}

/* ===================================================== ONBOARDING */
function OnboardingScreen({ go }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "radial-gradient(120% 70% at 50% 0%, var(--heat-300) 0%, var(--canvas) 55%)" }}>
      <Confetti count={16} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-5)", padding: "var(--space-6)", textAlign: "center" }}>
        <MascotHost context="onboarding" size={180} bubble />
        <Eyebrow>Meet your hype-cat</Eyebrow>
        <H style={{ fontSize: 44 }}>Hi, I'm Callie.<br/>I just react.</H>
        <p style={{ font: "var(--type-lead)", color: "var(--text-muted)", margin: 0, maxWidth: 300 }}>
          You bring the car, the app brings the roast — and I'll be right here losing it in the corner. Clever, never cruel.
        </p>
      </div>
      <div style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Button variant="primary" size="lg" block onClick={() => go("home")}>Roast my car 🔥</Button>
        <Button variant="ghost" block onClick={() => go("home")}>I'll look around first</Button>
      </div>
    </div>
  );
}

/* ===================================================== HOME / UPLOAD */
function HomeScreen({ go }) {
  return (
    <ScreenScroll>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark />
        <Badge tone="ember">3 roasts left</Badge>
      </div>

      <Card pad="var(--space-5)" style={{ textAlign: "center" }}
        sticker={<Badge tone="flame">HOT</Badge>} stickerCorner="tr">
        <div style={{ display: "flex", justifyContent: "center", marginTop: -8 }}>
          <MascotHost context="home" size={120} bubble />
        </div>
        <h2 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: "4px 0 4px" }}>Drop a pic of your ride</h2>
        <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-4)" }}>Photo 1 of 2 — the more I can see, the harder I cook.</p>
        <button onClick={() => go("seasoning")} style={uploadTarget}>
          <span style={{ fontSize: 40, lineHeight: 1 }}>📸</span>
          <span style={{ font: "var(--type-d4)", color: "var(--ember-600)" }}>Tap to add photo</span>
          <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>Camera or library</span>
        </button>
        <Button variant="primary" size="lg" block style={{ marginTop: "var(--space-4)" }} onClick={() => go("seasoning")}>Roast my car</Button>
      </Card>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "0 var(--space-2)" }}>
        <Mascot state="watching" size={48} />
        <span style={{ font: "var(--type-sm)", color: "var(--text-muted)" }}>Callie's standing by. Drop a car and watch it cook.</span>
      </div>
    </ScreenScroll>
  );
}

/* ===================================================== THE CAST — character picker */
function CastScreen({ go }) {
  const [sel, setSel] = React.useState(null);
  const firstName = sel ? sel.name.replace(/[“"].*$/, "").split(" ")[0] : "them";
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "radial-gradient(120% 50% at 50% 0%, var(--heat-300) 0%, var(--canvas) 42%)" }}>
      <ScreenScroll style={{ paddingBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <CallieHost context="cast" size={60} />
          <div>
            <Eyebrow>The cast · Callie hosts the show</Eyebrow>
            <H style={{ fontSize: 30 }}>Who's roasting you?</H>
          </div>
        </div>
        <CastPicker initialId="mama" onChange={setSel} />
      </ScreenScroll>
      <div style={stickyBar}>
        <Button variant="primary" size="lg" block onClick={() => go("cooking")}>Cook it with {firstName}</Button>
      </div>
    </div>
  );
}

/* ===================================================== COOKING / LOADING */
function CookingScreen({ go }) {
  const steps = ["Sizing up your ride…", "Checking the body kit…", "Loading the disrespect…", "Plating the roast…"];
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setStep((s) => s + 1), 900);
    const done = setTimeout(() => go("reveal"), 3800);
    return () => { clearInterval(t); clearTimeout(done); };
  }, []);
  const pct = Math.min(100, (step + 1) * 25);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-6)", padding: "var(--space-6)", background: "radial-gradient(120% 70% at 50% 30%, var(--heat-300) 0%, var(--canvas) 60%)" }}>
      <MascotHost context="cooking" size={200} />
      <div style={{ textAlign: "center" }}>
        <H style={{ fontSize: 34 }}>Cooking your roast…</H>
        <p style={{ font: "var(--type-lead)", color: "var(--text-muted)", margin: "8px 0 0", minHeight: 26 }}>{steps[Math.min(step, steps.length - 1)]}</p>
      </div>
      <div style={{ width: "100%", maxWidth: 280 }}>
        <div style={{ height: 16, borderRadius: 999, background: "var(--surface)", boxShadow: "var(--elev-1)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", borderRadius: 999, background: "linear-gradient(90deg,var(--flame-500),var(--ember-600))", transition: "width var(--dur-3) var(--ease-out)" }} />
        </div>
        <div style={{ textAlign: "center", font: "var(--type-cap)", color: "var(--text-hint)", marginTop: 8 }}>This usually takes ~10 seconds</div>
      </div>
    </div>
  );
}

/* ---------- local styles ---------- */
const uploadTarget = { width: "100%", border: "3px dashed var(--heat-400)", background: "var(--canvas-sink)", borderRadius: "var(--radius-lg)", padding: "var(--space-7) var(--space-4)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" };
const stickyBar = { display: "flex", gap: "var(--space-3)", padding: "var(--space-4) var(--space-5)", borderTop: "1px solid var(--hairline)", background: "var(--canvas)" };
const catchBubble = { display: "inline-block", maxWidth: 280, background: "var(--ink)", color: "var(--canvas)", borderRadius: "var(--radius-lg)", padding: "8px 14px", font: "var(--type-sm)", fontWeight: 600, fontStyle: "italic", boxShadow: "var(--shadow-sticker)" };
const favStar = { width: 34, height: 34, borderRadius: "var(--radius-pill)", border: "none", cursor: "pointer", background: "var(--sticker-yellow)", color: "var(--ink)", fontSize: 18, boxShadow: "var(--shadow-sticker)" };
const favDot = { position: "absolute", top: -2, right: -2, fontSize: 14, color: "var(--sticker-yellow)", textShadow: "0 1px 0 var(--ink)" };
const pickCheck = { position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "var(--radius-pill)", background: "var(--ember-600)", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--canvas)" };
const castTile = (active) => ({ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 2px", borderRadius: "var(--radius-lg)", border: `3px solid ${active ? "var(--ember-600)" : "transparent"}`, background: active ? "var(--surface)" : "transparent", boxShadow: active ? "var(--gloss-card)" : "none", cursor: "pointer", transition: "border-color var(--dur-2)" });

function Wordmark() {
  return <span style={{ font: "var(--type-d3)", fontSize: 24, letterSpacing: "-0.02em", color: "var(--ink)" }}>Roast<span style={{ color: "var(--ember-600)" }}>My</span>Ride</span>;
}

Object.assign(window, { OnboardingScreen, HomeScreen, CastScreen, CookingScreen, RMR_Wordmark: Wordmark, RMR_Eyebrow: Eyebrow, RMR_H: H, RMR_ScreenScroll: ScreenScroll, RMR_stickyBar: stickyBar });
