// Screen 4 — Roaster picker ("who's roasting you?").
// CORE-REUSED: CastPicker (+ Roaster avatars inside it), CallieHost, Button.
// ROASTMYRIDE-NEW: screen frame + sticky CTA only.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CastPicker, CallieHost } from "@callies-universe/core";
import { ScreenScroll, Eyebrow, H, stickyBar } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";

export function Cast() {
  const go = useNavigate();
  const { input, update } = useFlow();
  const [sel, setSel] = useState(null);

  const onChange = (roaster) => {
    setSel(roaster);
    update({ roasterId: roaster.id });
  };

  const firstName = sel ? sel.name.replace(/[“"].*$/, "").split(" ")[0] : "them";

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
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <CallieHost context="cast" size={60} />
          <div>
            <Eyebrow>The cast · Callie hosts the show</Eyebrow>
            <H style={{ fontSize: 30 }}>Who's roasting you?</H>
          </div>
        </div>
        <CastPicker initialId={input.roasterId} onChange={onChange} />
      </ScreenScroll>
      <div style={stickyBar}>
        <Button variant="primary" size="lg" block onClick={() => go("/cooking")}>
          Cook it with {firstName}
        </Button>
      </div>
    </div>
  );
}
