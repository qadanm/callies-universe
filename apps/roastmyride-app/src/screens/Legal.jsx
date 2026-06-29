// Privacy & Terms. Plain, honest, and accurate to how the app actually handles
// data (see the architecture: photos, identity, payments).
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@callies-universe/core";
import { cfg } from "../subjects/index.js";

export function Legal() {
  const go = useNavigate();
  const { doc } = useParams();
  const docs = cfg("legal", {});
  const d = docs[doc] || docs.privacy || { title: "Privacy & data", body: [] };
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-5)" }}>
      <h1 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: "0 0 var(--space-3)" }}>{d.title}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {d.body.map((p, i) => (
          <p key={i} style={{ font: "var(--type-body)", color: "var(--text-muted)", margin: 0 }}>{p}</p>
        ))}
      </div>
      <p style={{ font: "var(--type-legal)", color: "var(--text-hint)", marginTop: "var(--space-4)" }}>
        Questions? @{cfg("handle")}. {cfg("appName")} v0.3.0.
      </p>
      <div style={{ marginTop: "var(--space-4)" }}>
        <Button variant="secondary" onClick={() => go("/settings")}>Back to settings</Button>
      </div>
    </div>
  );
}
