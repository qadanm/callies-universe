// Screen 6b — Share success (the celebrate sheet over the reveal).
// CORE-REUSED: Sheet, CallieHost (context "celebrate"), Confetti, Badge, Button.
// ROASTMYRIDE-NEW: success copy + share stats.
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Badge, Sheet, Confetti, CallieHost } from "@callies-universe/core";

export function Celebrate() {
  const go = useNavigate();
  return (
    <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", background: "var(--canvas)" }}>
      <Confetti count={40} />
      <Sheet
        open
        title="Posted! You menace 😈"
        header={<CallieHost context="celebrate" size={96} />}
        onClose={() => go("/home")}
        primaryAction={
          <Button variant="primary" size="lg" block onClick={() => go("/home")}>
            Roast another
          </Button>
        }
      >
        <p style={{ textAlign: "center", margin: "0 0 var(--space-4)" }}>
          Your roast is live. Tag us <b style={{ color: "var(--ember-600)" }}>@roastmyride</b> and we'll re-share
          the best ones.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)" }}>
          <Badge tone="flame">🔥 2.4k views</Badge>
          <Badge tone="cool">💬 88</Badge>
          <Badge tone="pink">↗ 311 shares</Badge>
        </div>
      </Sheet>
    </div>
  );
}
