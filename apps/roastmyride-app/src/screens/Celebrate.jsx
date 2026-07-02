// Screen 6b: Share success (the celebrate sheet over the reveal).
// CORE-REUSED: Sheet, CallieHost (context "celebrate"), Confetti, Badge, Button, Callie.
// ROASTMYRIDE-NEW: stand-up share copy + the posted clip (standup ShareCard).
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Badge, Sheet, Confetti, CallieHost, Callie } from "@callies-universe/core";
import { ShareCard } from "../components/ShareCard.jsx";
import { toStandupSet, comicStyle } from "../standup.js";
import { useFlow } from "../flow/FlowContext.jsx";
import { cfg } from "../subjects/index.js";

export function Celebrate() {
  const go = useNavigate();
  const { result, previewResult } = useFlow();
  const roast = result || previewResult;
  const set = toStandupSet(roast);
  const act = roast.performer?.comedicIdentity || comicStyle(roast.roasterId);
  const closer = set.beats.find((b) => b.type === "closer");
  const clip = closer
    ? [{ text: closer.text }, ...(closer.punch ? [{ text: closer.punch, punch: true }] : []), ...(closer.tail ? [{ text: closer.tail }] : [])]
    : roast.segments;

  return (
    <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", background: "var(--canvas)" }}>
      <Confetti count={40} />
      <Sheet
        open
        title="It's live. You menace."
        header={<CallieHost context="celebrate" size={96} />}
        onClose={() => go("/home")}
        primaryAction={
          <Button variant="primary" size="lg" block onClick={() => go("/home")}>
            {cfg("celebrate.cta")}
          </Button>
        }
      >
        <p style={{ textAlign: "center", margin: "0 0 var(--space-4)" }}>
          Your roast is live. Tag us <b style={{ color: "var(--ember-600)" }}>@{cfg("handle")}</b> and we'll re-share
          the best ones.
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-4)" }}>
          <ShareCard
            width={180}
            format="standup"
            roasterName={roast.roasterName}
            act={act}
            spice={roast.spice}
            mascot={<Callie state={roast.reaction} size={56} />}
            roast={clip}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Badge tone="flame">🔊 {roast.roasterName}</Badge>
          <Badge tone="cool">🎬 Roast clip</Badge>
          <Badge tone="pink">✨ Hot off the press</Badge>
        </div>
      </Sheet>
    </div>
  );
}
