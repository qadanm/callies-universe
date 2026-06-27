// Screen 3 — Context chips (the optional "how should we cook it?" picker).
// CORE-REUSED: Chip (multi-select), CallieHost, Button.
// ROASTMYRIDE-NEW: the three chip buckets (heat / fair game / vibe), layout.
// The toggled chips feed RoastInput.context, which the seam receives.
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip, CallieHost } from "@callies-universe/core";
import { ScreenScroll, Eyebrow, H, stickyBar } from "../components/ui.jsx";
import { useFlow } from "../flow/FlowContext.jsx";

const BUCKETS = [
  {
    group: "Heat",
    items: [
      ["gentle", "😌 Gentle"],
      ["medium", "🌶 Medium"],
      ["brutal", "🔥 Brutal"],
    ],
  },
  {
    group: "Fair game",
    items: [
      ["thecar", "🚗 The car"],
      ["mytaste", "🎨 My taste"],
      ["themods", "🔧 The mods"],
      ["howidrive", "🏁 How I drive"],
      ["pricetag", "💸 Price tag"],
    ],
  },
  {
    group: "Vibe",
    items: [
      ["deadpan", "😐 Deadpan"],
      ["hype", "📣 Hype"],
      ["brainrot", "🧠 Brainrot"],
      ["battle", "🥊 Roast battle"],
    ],
  },
];

export function Chips() {
  const go = useNavigate();
  const { input, update } = useFlow();
  const [picked, setPicked] = useState(() => new Set(input.context));

  const toggle = (key, on) =>
    setPicked((prev) => {
      const next = new Set(prev);
      on ? next.add(key) : next.delete(key);
      return next;
    });

  const count = picked.size;
  const next = () => {
    update({ context: [...picked] });
    go("/cast");
  };

  const buckets = useMemo(() => BUCKETS, []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <ScreenScroll style={{ paddingBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <CallieHost context="cast" size={60} />
          <div>
            <Eyebrow>Optional seasoning</Eyebrow>
            <H style={{ fontSize: 30 }}>How should we cook it?</H>
          </div>
        </div>
        <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: 0 }}>
          Tap a few — or none. Chips and context are always free.
        </p>

        {buckets.map((b) => (
          <div key={b.group}>
            <div
              style={{
                font: "var(--type-cap)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-hint)",
                margin: "0 0 8px 4px",
              }}
            >
              {b.group}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {b.items.map(([key, label]) => (
                <Chip key={key} selected={picked.has(key)} onToggle={(on) => toggle(key, on)}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </ScreenScroll>
      <div style={stickyBar}>
        <Button variant="primary" size="lg" block onClick={next}>
          {count ? `Continue · ${count} picked` : "Skip seasoning"}
        </Button>
      </div>
    </div>
  );
}
