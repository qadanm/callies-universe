// Screen 2 — Home / upload (the single "roast my car" CTA; photo picker stubbed).
// CORE-REUSED: CallieHost (context "home", with tip), Card, Badge, Button, Callie.
// ROASTMYRIDE-NEW: upload target, "roast my car" CTA.
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Badge, Callie, CallieHost } from "@callies-universe/core";
import { ScreenScroll, Wordmark } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";

const uploadTarget = {
  width: "100%",
  border: "3px dashed var(--heat-400)",
  background: "var(--canvas-sink)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-7) var(--space-4)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
};

export function Home() {
  const go = useNavigate();
  const { update, credits } = useFlow();

  // Stubbed photo pick — we only record that a car photo is "present".
  const addCar = () => {
    update({ carPhoto: { present: true } });
    go("/profile");
  };

  return (
    <ScreenScroll>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark />
        <Badge tone="ember">{credits} roasts left</Badge>
      </div>

      <Card pad="var(--space-5)" style={{ textAlign: "center" }} sticker={<Badge tone="flame">HOT</Badge>} stickerCorner="tr">
        <div style={{ display: "flex", justifyContent: "center", marginTop: -8 }}>
          <CallieHost context="home" size={120} bubble />
        </div>
        <h2 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: "4px 0 4px" }}>Drop a pic of your ride</h2>
        <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-4)" }}>
          Photo 1 of 2 — the more I can see, the harder I cook.
        </p>
        <button onClick={addCar} style={uploadTarget}>
          <span style={{ fontSize: 40, lineHeight: 1 }}>📸</span>
          <span style={{ font: "var(--type-d4)", color: "var(--ember-600)" }}>Tap to add photo</span>
          <span style={{ font: "var(--type-cap)", color: "var(--text-hint)" }}>Camera or library</span>
        </button>
        <Button variant="primary" size="lg" block style={{ marginTop: "var(--space-4)" }} onClick={addCar}>
          Roast my car
        </Button>
      </Card>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "0 var(--space-2)" }}>
        {/* design used a now-retired "watching" emote — core's nearest 9-state is "curious". */}
        <Callie state="curious" size={48} />
        <span style={{ font: "var(--type-sm)", color: "var(--text-muted)" }}>
          Callie's standing by. Drop a car and watch it cook.
        </span>
      </div>
    </ScreenScroll>
  );
}
