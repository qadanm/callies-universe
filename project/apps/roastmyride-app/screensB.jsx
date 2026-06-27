/* RoastMyRide app — screens part B: Roast reveal + share, Profile-roast mode, Credits/paywall, Settings.
   Depends on screensA.jsx (shared helpers on window) + design-system bundle. */
const RMRb = window.RoastMyRideDesignSystem_896616;
const { Button: BtnB, Chip: ChipB, Card: CardB, Input: InputB, Badge: BadgeB, Mascot: MascotB, MascotHost: MascotHostB, Confetti: ConfettiB, Sheet: SheetB, ShareCard, CreditTile } = RMRb;
const Eyebrow2 = window.RMR_Eyebrow, H2 = window.RMR_H, Scroll2 = window.RMR_ScreenScroll;

/* ===================================================== ROAST REVEAL + SHARE */
function RevealScreen({ go }) {
  const [revealed, setRevealed] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setRevealed(true), 250); return () => clearTimeout(t); }, []);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", background: "radial-gradient(120% 60% at 50% 0%, var(--heat-300) 0%, var(--canvas) 50%)" }}>
      {revealed && <ConfettiB count={34} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--space-5)", gap: "var(--space-4)" }}>
        <Eyebrow2>Voiced by Mama Denièce · Callie lost it 😹</Eyebrow2>
        <div style={{ animation: revealed ? "rmr-pop-in var(--dur-4) var(--ease-spring) both" : "none" }}>
          <ShareCard width={260} roasterName="Mama Denièce" spice="savage"
            mascot={<MascotB state="savage" size={84} />}
            roast={[
              { text: "Mm-mm-MM. Baby, this paint job is " },
              { text: "a cry for help", punch: true },
              { text: ", and I'm answering." },
            ]} />
        </div>
      </div>
      <div style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)", background: "var(--canvas)", borderTopLeftRadius: "var(--radius-xl)", borderTopRightRadius: "var(--radius-xl)", boxShadow: "0 -8px 24px rgba(120,52,12,0.12)" }}>
        <BtnB variant="primary" size="lg" block onClick={() => go("celebrate")}>Share video</BtnB>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <BtnB variant="secondary" style={{ flex: 1 }} onClick={() => go("reveal")}>Save</BtnB>
          <BtnB variant="secondary" style={{ flex: 1 }} onClick={() => go("cooking")}>Re-roast</BtnB>
        </div>
      </div>
    </div>
  );
}
/* ===================================================== SHARE SUCCESS (celebrate sheet over reveal) */
function CelebrateScreen({ go }) {
  return (
    <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", background: "var(--canvas)" }}>
      <ConfettiB count={40} />
      <SheetB open title="Posted! You menace 😈" header={<MascotHostB context="celebrate" size={96} />}
        onClose={() => go("home")}
        primaryAction={<BtnB variant="primary" size="lg" block onClick={() => go("home")}>Roast another</BtnB>}>
        <p style={{ textAlign: "center", margin: "0 0 var(--space-4)" }}>Your roast is live. Tag us <b style={{ color: "var(--ember-600)" }}>@roastmyride</b> and we'll re-share the best ones.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)" }}>
          <BadgeB tone="flame">🔥 2.4k views</BadgeB>
          <BadgeB tone="cool">💬 88</BadgeB>
          <BadgeB tone="pink">↗ 311 shares</BadgeB>
        </div>
      </SheetB>
    </div>
  );
}

/* ===================================================== OPTIONAL SEASONING — selfie or profile */
function ProfileScreen({ go }) {
  const [mode, setMode] = React.useState("selfie"); // "selfie" | "profile"
  const [added, setAdded] = React.useState(false);
  const copy = mode === "selfie"
    ? { ico: "🤳", title: "Add a selfie", sub: "Snap or pick a photo of you" }
    : { ico: "📱", title: "Add a profile screenshot", sub: "A screenshot of your social profile" };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Scroll2 style={{ paddingBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <MascotHostB context="seasoning" size={72} event={added ? "added" : null} />
          <div><Eyebrow2>Photo 2 of 2 · make it personal</Eyebrow2><H2 style={{ fontSize: 30 }}>Make it personal</H2></div>
        </div>
        <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: 0 }}>Add a selfie or a screenshot of your profile and the roast gets sharper. Totally optional — your car alone is plenty.</p>

        {/* segmented choice */}
        <div style={{ display: "flex", gap: 6, padding: 5, background: "var(--canvas-sink)", borderRadius: "var(--radius-pill)" }}>
          {[["selfie", "Selfie"], ["profile", "Profile screenshot"]].map(([k, label]) => (
            <button key={k} onClick={() => { setMode(k); setAdded(false); }} style={{
              flex: 1, minHeight: 44, border: "none", cursor: "pointer", borderRadius: "var(--radius-pill)",
              font: "var(--type-sm)", fontWeight: 700,
              background: mode === k ? "var(--surface)" : "transparent",
              color: mode === k ? "var(--ember-600)" : "var(--text-muted)",
              boxShadow: mode === k ? "var(--gloss-chip)" : "none",
            }}>{label}</button>
          ))}
        </div>

        <button onClick={() => setAdded(true)} style={{
          width: "100%", border: `3px dashed ${added ? "var(--ember-600)" : "var(--heat-400)"}`,
          background: added ? "#FFF3E2" : "var(--canvas-sink)", borderRadius: "var(--radius-lg)",
          padding: "var(--space-7) var(--space-4)", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 6, cursor: "pointer",
        }}>
          <span style={{ fontSize: 40 }}>{added ? "✅" : copy.ico}</span>
          <span style={{ font: "var(--type-d4)", color: "var(--ember-600)" }}>{added ? "Added — looking good" : copy.title}</span>
          <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>{added ? "Tap to replace" : copy.sub}</span>
        </button>

        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "var(--space-3)", background: "var(--canvas-sink)", borderRadius: "var(--radius-md)" }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <span style={{ font: "var(--type-cap)", color: "var(--text-muted)" }}>Private — we only ever roast you. Never your friends, never strangers.</span>
        </div>
      </Scroll2>
      <div style={window.RMR_stickyBar}>
        <BtnB variant="ghost" onClick={() => go("cast")}>Skip</BtnB>
        <BtnB variant="primary" size="lg" style={{ flex: 1 }} onClick={() => go("cast")}>
          {added ? "Next" : "Next · car only"}
        </BtnB>
      </div>
    </div>
  );
}

/* ===================================================== CREDITS / PAYWALL */
function PaywallScreen({ go }) {
  const [sel, setSel] = React.useState(1);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "radial-gradient(120% 50% at 50% 0%, var(--heat-300) 0%, var(--canvas) 45%)" }}>
      <Scroll2 style={{ paddingBottom: 0 }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <MascotHostB context="paywall" size={120} bubble />
          <Eyebrow2>You're out of roasts</Eyebrow2>
          <H2 style={{ fontSize: 34 }}>Stock up & keep cooking</H2>
          <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: 0, maxWidth: 280 }}>Chips & context are always free. Credits pay for the video render.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
          <CreditTile credits={1} price="$0.99" perRoast="$0.99" selected={sel === 0} onSelect={() => setSel(0)} />
          <CreditTile credits={5} price="$3.99" perRoast="$0.80" best selected={sel === 1} onSelect={() => setSel(1)} />
          <CreditTile credits={15} price="$8.99" perRoast="$0.60" selected={sel === 2} onSelect={() => setSel(2)} />
          <CreditTile credits={40} price="$19.99" perRoast="$0.50" selected={sel === 3} onSelect={() => setSel(3)} />
        </div>
      </Scroll2>
      <div style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 8 }}>
        <BtnB variant="primary" size="lg" block onClick={() => go("reveal")}>Get {[1, 5, 15, 40][sel]} roasts</BtnB>
        <span style={{ font: "var(--type-legal)", color: "var(--text-hint)", textAlign: "center" }}>One-time purchase · no subscription · restore anytime</span>
      </div>
    </div>
  );
}

/* ===================================================== SETTINGS / ACCOUNT (bones, not skin) */
function SettingsScreen() {
  const rows = [
    { g: "Account", items: [["Profile & handle", "@dailydrifter"], ["Credits", "3 left"], ["Restore purchases", ""]] },
    { g: "Roasting", items: [["Default roaster", "Callie"], ["Spice ceiling", "Medium"], ["Profile roast consent", "On"]] },
    { g: "Accessibility", items: [["Reduce motion", "Follow system"], ["Captions on videos", "On"], ["Haptics", "On"]] },
    { g: "About", items: [["Privacy & data", ""], ["Terms", ""], ["Version", "2.4.0"]] },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--canvas-sink)" }}>
      <div style={{ padding: "var(--space-5) var(--space-5) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <MascotHostB context="settings" size={52} />
        <h1 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: 0 }}>Settings</h1>
      </div>
      {rows.map((sec) => (
        <div key={sec.g} style={{ padding: "var(--space-3) var(--space-5)" }}>
          <div style={{ font: "var(--type-cap)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-hint)", margin: "0 0 8px 4px" }}>{sec.g}</div>
          <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--elev-1)" }}>
            {sec.items.map(([label, val], i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderTop: i ? "1px solid var(--hairline)" : "none", minHeight: 48 }}>
                <span style={{ font: "var(--type-body)", color: "var(--ink)" }}>{label}</span>
                <span style={{ marginLeft: "auto", font: "var(--type-sm)", color: "var(--text-muted)" }}>{val}</span>
                <span style={{ marginLeft: 10, color: "var(--text-hint)" }}>›</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ padding: "var(--space-5)", textAlign: "center" }}>
        <span style={{ font: "var(--type-legal)", color: "var(--text-hint)" }}>RoastMyRide · clever, never cruel · PG-13</span>
      </div>
    </div>
  );
}

Object.assign(window, { RevealScreen, CelebrateScreen, ProfileScreen, PaywallScreen, SettingsScreen });
