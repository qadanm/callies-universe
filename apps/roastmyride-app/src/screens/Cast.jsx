// Screen 4 — Tonight's lineup (was "The Cast"). Pick which comedian performs.
// CORE-REUSED: CastPicker (+ Roaster avatars inside it), CallieHost, Button.
// ROASTMYRIDE-NEW: playbill Marquee reframe + per-comedian comedic-style line +
// "put {name} on stage" CTA. No new picker component — CastPicker is unchanged.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CastPicker, CallieHost } from "@callies-universe/core";
import { ScreenScroll, stickyBar } from "../components/ui.jsx";
import { Marquee } from "../components/Marquee.jsx";
import { comicStyle } from "../standup.js";
import { useFlow } from "../flow/FlowContext.jsx";
import { cfg } from "../subjects/index.js";

export function Cast() {
  const go = useNavigate();
  const { input, update } = useFlow();
  const [sel, setSel] = useState(null);

  const onChange = (roaster) => {
    setSel(roaster);
    update({ roasterId: roaster.id });
  };

  const firstName = sel ? sel.name.replace(/[“"].*$/, "").split(" ")[0] : "them";
  const style = sel ? comicStyle(sel.id) : `Eight comics. Same ${cfg("brain.subjectNoun")}. Eight completely different shows.`;

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
          {sel ? `${sel.name} — ${style}` : style}
        </Marquee>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <CallieHost context="cast" size={48} />
          <span style={{ font: "var(--type-cap)", color: "var(--text-muted)" }}>
            Callie hosts the show — the comic does the roasting.
          </span>
        </div>
        <CastPicker initialId={input.roasterId} onChange={onChange} />
      </ScreenScroll>
      <div style={stickyBar}>
        <Button variant="primary" size="lg" block onClick={() => go("/cooking")}>
          Put {firstName} on stage
        </Button>
      </div>
    </div>
  );
}
