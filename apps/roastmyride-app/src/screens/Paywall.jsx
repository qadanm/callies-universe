// Screen 8 — Credits / paywall.
// CORE-REUSED: CallieHost (context "paywall", with tip), Button.
// ROASTMYRIDE-NEW (app-layer): CreditTile; bundle layout.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CallieHost } from "@callies-universe/core";
import { CreditTile } from "../components/CreditTile.jsx";
import { ScreenScroll, Eyebrow, H } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";
import { buyBundle, restore } from "../services/purchases.js";

const BUNDLES = [
  { credits: 1, price: "$0.99", perRoast: "$0.99" },
  { credits: 5, price: "$3.99", perRoast: "$0.80", best: true },
  { credits: 15, price: "$8.99", perRoast: "$0.60" },
  { credits: 40, price: "$19.99", perRoast: "$0.50" },
];

export function Paywall() {
  const go = useNavigate();
  const { credits, setCredits } = useFlow();
  const [sel, setSel] = useState(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const buy = async () => {
    setBusy(true);
    try {
      const r = await buyBundle(BUNDLES[sel]);
      if (r.granted) setCredits((c) => c + r.granted);
      if (!r.redirected) go("/home"); // real provider redirects to checkout
    } catch (e) {
      console.warn(`[paywall] purchase failed (${e && e.message})`);
    } finally {
      setBusy(false);
    }
  };

  const restorePurchases = async () => {
    try {
      const r = await restore();
      if (r && typeof r.credits === "number") {
        setCredits(r.credits);
        setMsg(`Restored — ${r.credits} roasts`);
      } else {
        setMsg("Nothing to restore");
      }
    } catch (e) {
      console.warn(`[paywall] restore failed (${e && e.message})`);
      setMsg("Restore failed — try again");
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(120% 50% at 50% 0%, var(--heat-300) 0%, var(--canvas) 45%)",
      }}
    >
      <ScreenScroll style={{ paddingBottom: 0 }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <CallieHost context="paywall" size={120} bubble />
          <Eyebrow>{credits < 1 ? "You're out of roasts" : `${credits} roasts left`}</Eyebrow>
          <H style={{ fontSize: 34 }}>Stock up &amp; keep cooking</H>
          <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: 0, maxWidth: 280 }}>
            Chips &amp; context are always free. Credits pay for the video render.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
          {BUNDLES.map((b, i) => (
            <CreditTile
              key={b.credits}
              credits={b.credits}
              price={b.price}
              perRoast={b.perRoast}
              best={b.best}
              selected={sel === i}
              onSelect={() => setSel(i)}
            />
          ))}
        </div>
      </ScreenScroll>
      <div style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 8 }}>
        <Button variant="primary" size="lg" block onClick={buy} disabled={busy}>
          {busy ? "Processing…" : `Get ${BUNDLES[sel].credits} roasts`}
        </Button>
        <button
          onClick={restorePurchases}
          style={{ background: "none", border: "none", cursor: "pointer", font: "var(--type-legal)", color: "var(--text-hint)", textAlign: "center", padding: 4 }}
        >
          One-time purchase · no subscription · <u>restore</u>
        </button>
        {msg && (
          <span style={{ font: "var(--type-legal)", color: "var(--text-muted)", textAlign: "center" }}>{msg}</span>
        )}
      </div>
    </div>
  );
}
