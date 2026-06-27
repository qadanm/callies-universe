/* RoastMyRide — marketing landing page. One loud viral page, single CTA: install.
   Composes design-system primitives from window.RoastMyRideDesignSystem_896616. */
const LP = window.RoastMyRideDesignSystem_896616;
const { Button, Badge, Card, Mascot, ShareCard, Confetti } = LP;

function Sticker({ children, bg = "var(--sticker-yellow)", rot = -8, top, left, right, bottom, size = 54, fg = "var(--ink)" }) {
  return (
    <span aria-hidden="true" style={{
      position: "absolute", top, left, right, bottom, width: size, height: size,
      background: bg, color: fg, borderRadius: 14, transform: `rotate(${rot}deg)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      font: "var(--type-d4)", fontSize: size * 0.5, boxShadow: "var(--shadow-sticker)", zIndex: 1,
    }}>{children}</span>
  );
}

function StoreBadge({ store }) {
  const label = store === "ios" ? ["Download on the", "App Store"] : ["Get it on", "Google Play"];
  return (
    <a href="#install" style={{
      display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none",
      background: "var(--ink)", color: "var(--canvas)", padding: "10px 18px",
      borderRadius: "var(--radius-md)", boxShadow: "var(--elev-2)",
    }}>
      <span aria-hidden="true" style={{ fontSize: 26 }}>{store === "ios" ? "" : "▶"}</span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span style={{ font: "var(--type-legal)", opacity: 0.85 }}>{label[0]}</span>
        <span style={{ font: "var(--type-d4)", fontSize: 18 }}>{label[1]}</span>
      </span>
    </a>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "radial-gradient(120% 90% at 80% 0%, var(--heat-300) 0%, var(--canvas) 55%)" }}>
      <Confetti count={20} />
      <Nav />
      <div style={{ ...wrap, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center", padding: "20px 32px 80px", position: "relative" }}>
        <Sticker top={120} left={-10} bg="var(--pop-cyan)" rot={-14}>★</Sticker>
        <Sticker bottom={40} left="46%" bg="var(--sticker-pink)" fg="#fff" rot={10}>♥</Sticker>
        <div style={{ position: "relative", zIndex: 2 }}>
          <Badge tone="flame">🔥 #1 roast-video factory</Badge>
          <h1 style={{ font: "var(--type-d1)", fontSize: 72, lineHeight: 0.95, color: "var(--ink)", margin: "16px 0 0", textWrap: "balance" }}>
            Your car. <mark style={mark}>Cooked.</mark>
          </h1>
          <p style={{ font: "var(--type-lead)", fontSize: 20, color: "var(--text-muted)", maxWidth: 460, margin: "18px 0 28px" }}>
            Upload a pic, pick your vibe, and we cook you a roast video that's actually funny — while Callie the cat loses it in the corner. Clever, never cruel. Built to post.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <Button variant="primary" size="lg">Get the app — it's free 🔥</Button>
            <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>★★★★★ 4.9 · 120k roasts cooked</span>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
            <StoreBadge store="ios" /><StoreBadge store="android" />
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: -10, left: 10, zIndex: 3 }}><Mascot state="savage" size={130} /></div>
          <div style={{ position: "relative" }}>
            <PlayFrame>
              <ShareCard width={300} roasterName="Ms. Burnt" spice="savage"
                mascot={<Mascot state="savage" size={92} />}
                roast={[{ text: "Lowered, loud, and " }, { text: "still slower", punch: true }, { text: " than the bus you cut off." }]} />
            </PlayFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
function PlayFrame({ children }) {
  return (
    <div style={{ position: "relative", borderRadius: "var(--radius-xl)", boxShadow: "var(--elev-4)", transform: "rotate(2deg)" }}>
      {children}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <span style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "var(--elev-3)", color: "var(--ember-600)" }}>▶</span>
      </div>
      <span style={{ position: "absolute", bottom: 14, left: 14, font: "var(--type-cap)", fontWeight: 700, color: "#fff", background: "rgba(34,20,3,0.5)", padding: "4px 10px", borderRadius: 999 }}>0:07 · looping</span>
    </div>
  );
}
function Nav() {
  return (
    <nav style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 32px" }}>
      <span style={{ font: "var(--type-d3)", fontSize: 26, letterSpacing: "-0.02em", color: "var(--ink)" }}>Roast<span style={{ color: "var(--ember-600)" }}>My</span>Ride</span>
      <Button variant="primary">Get the app</Button>
    </nav>
  );
}

/* ---------------- PROOF WALL ---------------- */
const PROOF = [
  { r: [{ text: "A spoiler on a " }, { text: "minivan", punch: true }, { text: "? Bold choice." }], name: "Coach", spice: "mild", state: "watching", views: "2.4M", tag: "#CarTok" },
  { r: [{ text: "This Civic has " }, { text: "more stickers", punch: true }, { text: " than horsepower." }], name: "Lil Lemon", spice: "savage", state: "savage", views: "881k", tag: "#roastmyride" },
  { r: [{ text: "Pristine. Garaged. " }, { text: "Never driven.", punch: true }, { text: " Coward." }], name: "The Valet", spice: "mild", state: "shook", views: "1.1M", tag: "#sleeperbuild" },
  { r: [{ text: "Eco mode in a " }, { text: "V8", punch: true }, { text: ". Make it make sense." }], name: "Ms. Burnt", spice: "savage", state: "love", views: "3.0M", tag: "#fyp" },
];
function Proof() {
  return (
    <section style={{ background: "var(--canvas-sink)" }}>
      <div style={{ ...wrap, padding: "70px 32px", textAlign: "center" }}>
        <Badge tone="cool">The whole feed is doing it</Badge>
        <h2 style={{ font: "var(--type-d2)", fontSize: 46, color: "var(--ink)", margin: "14px 0 6px" }}>120,000+ roasts and counting</h2>
        <p style={{ font: "var(--type-lead)", color: "var(--text-muted)", margin: "0 0 40px" }}>Real videos people couldn't help but post.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {PROOF.map((p, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
              <ShareCard width={240} roasterName={p.name} spice={p.spice} roast={p.r}
                mascot={<Mascot state={p.state} size={72} />} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px" }}>
                <span style={{ font: "var(--type-cap)", fontWeight: 700, color: "var(--ink)" }}>▶ {p.views}</span>
                <span style={{ font: "var(--type-cap)", color: "var(--ember-600)" }}>{p.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
const STEPS = [
  { n: "1", t: "Upload your ride", d: "Snap a photo or pull one from your camera roll.", ico: "📸", bg: "var(--sticker-yellow)" },
  { n: "2", t: "Add a selfie", d: "A selfie or profile screenshot makes the roast personal — optional.", ico: "🤳", bg: "var(--sticker-cyan)" },
  { n: "3", t: "Pick your roaster", d: "Choose from a cast of 8 named characters, then get your video.", ico: "🎭", bg: "var(--sticker-pink)" },
];
function How() {
  return (
    <section style={{ background: "var(--canvas)" }}>
      <div style={{ ...wrap, padding: "80px 32px", textAlign: "center" }}>
        <h2 style={{ font: "var(--type-d2)", fontSize: 46, color: "var(--ink)", margin: "0 0 44px" }}>Three taps to a roast</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {STEPS.map((s) => (
            <Card key={s.n} pad="var(--space-7)" style={{ textAlign: "left" }}
              sticker={<span style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", font: "var(--type-d3)", color: "var(--ink)", boxShadow: "var(--shadow-sticker)" }}>{s.n}</span>}
              stickerCorner="tl">
              <div style={{ fontSize: 46, marginBottom: 10 }}>{s.ico}</div>
              <h3 style={{ font: "var(--type-d3)", color: "var(--ink)", margin: "0 0 8px" }}>{s.t}</h3>
              <p style={{ font: "var(--type-body)", color: "var(--text-muted)", margin: 0 }}>{s.d}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- MASCOT BIT ---------------- */
const SIZZLE_EMOTES = [
  ["watching", "watching"], ["savage", "crying-laughing"], ["shook", "shook"], ["love", "smitten"], ["celebrating", "hyped"],
];
function MascotBit() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--ink)", color: "var(--canvas)" }}>
      <div style={{ ...wrap, display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 40, alignItems: "center", padding: "80px 32px", position: "relative" }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <Sticker top={10} left={20} bg="var(--sticker-yellow)" rot={-12}>★</Sticker>
          <Sticker bottom={20} right={30} bg="var(--pop-cyan)" rot={14}>✦</Sticker>
          <Sticker top={120} right={0} bg="var(--sticker-pink)" fg="#fff" rot={8} size={46}>♥</Sticker>
          <Mascot state="love" size={280} placeholderTag />
        </div>
        <div>
          <Badge tone="flame">Meet the cat</Badge>
          <h2 style={{ font: "var(--type-d2)", fontSize: 50, margin: "14px 0 12px", color: "var(--canvas)" }}>Say hi to Callie</h2>
          <p style={{ font: "var(--type-lead)", fontSize: 19, color: "var(--heat-300)", margin: "0 0 24px", maxWidth: 460 }}>
            Callie doesn't write the roast — Callie <i>reacts</i> to it. A chubby little cat who shows up everywhere you go in the app, losing it at your car so you don't have to. Stickers, merch, and chaos included.
          </p>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {SIZZLE_EMOTES.map(([st, label]) => (
              <div key={st} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Mascot state={st} size={76} />
                <span style={{ font: "var(--type-cap)", fontWeight: 700, color: "var(--canvas)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section id="install" style={{ position: "relative", overflow: "hidden", background: "radial-gradient(120% 90% at 50% 120%, var(--ember-600) 0%, var(--heat-400) 60%, var(--canvas) 100%)" }}>
      <Confetti count={24} />
      <div style={{ ...wrap, padding: "90px 32px 70px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Mascot state="celebrating" size={150} /></div>
        <h2 style={{ font: "var(--type-d1)", fontSize: 64, color: "var(--ink)", margin: "0 0 10px", textWrap: "balance" }}>Go get roasted.</h2>
        <p style={{ font: "var(--type-lead)", fontSize: 20, color: "var(--ink)", opacity: 0.85, margin: "0 0 28px" }}>Free to start. Your first roast is on the house.</p>
        <Button variant="primary" size="lg" style={{ fontSize: 24, height: 72, padding: "0 40px" }}>Download RoastMyRide 🔥</Button>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <StoreBadge store="ios" /><StoreBadge store="android" />
        </div>
      </div>
      <footer style={{ background: "var(--ink)", color: "var(--heat-300)" }}>
        <div style={{ ...wrap, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 32px", flexWrap: "wrap", gap: 12 }}>
          <span style={{ font: "var(--type-d4)", color: "var(--canvas)" }}>Roast<span style={{ color: "var(--flame-500)" }}>My</span>Ride</span>
          <span style={{ font: "var(--type-cap)" }}>Clever, never cruel · PG-13 · © 2026</span>
        </div>
      </footer>
    </section>
  );
}

const wrap = { maxWidth: 1120, margin: "0 auto", width: "100%", boxSizing: "border-box" };
const mark = { background: "var(--sticker-yellow)", color: "var(--ink)", padding: "0 14px", borderRadius: 14, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" };

function Landing() {
  return <div style={{ fontFamily: "var(--font-body)" }}>
    <Hero /><Proof /><How /><MascotBit /><FinalCTA />
  </div>;
}
window.RMR_Landing = Landing;
