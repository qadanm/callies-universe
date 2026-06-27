import React, { useState } from "react";

/**
 * Button — glossy inflatable, chunky, display-font label.
 * Squish-and-spring on press. Functional layer: AA contrast, obvious states.
 */
export function Button({
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style,
  onClick,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);

  const sizes = {
    sm: { h: "var(--tap-min)", px: "18px", fs: "16px" },
    md: { h: "var(--tap-cozy)", px: "24px", fs: "18px" },
    lg: { h: "var(--tap-hero)", px: "32px", fs: "22px" },
  }[size];

  const variants = {
    primary: {
      background: "linear-gradient(180deg, var(--ember-500), var(--ember-600))",
      color: "var(--on-ember)",
      boxShadow: "var(--gloss-primary)",
      border: "none",
    },
    accent: {
      background: "linear-gradient(180deg, var(--flame-400), var(--flame-500))",
      color: "var(--ink)",
      boxShadow: "var(--gloss-primary)",
      border: "none",
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--ember-600)",
      boxShadow: "var(--gloss-card)",
      border: "2px solid var(--ember-600)",
    },
    ghost: {
      background: "transparent",
      color: "var(--ember-600)",
      boxShadow: "none",
      border: "2px solid transparent",
    },
  }[variant];

  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px",
    width: block ? "100%" : "auto",
    minHeight: sizes.h, padding: `0 ${sizes.px}`,
    font: "var(--type-button)", fontSize: sizes.fs, letterSpacing: "0.01em",
    borderRadius: "var(--radius-button)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transform: pressed && !disabled ? `scale(var(--press-scale))` : "scale(1)",
    transition: "transform var(--dur-1) var(--ease-spring), filter var(--dur-2) var(--ease-out)",
    boxShadow: pressed && !disabled && variant !== "ghost" ? "var(--gloss-primary-pressed)" : variants.boxShadow,
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    ...variants,
    ...style,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={base}
      {...rest}
    >
      {iconLeft && <span style={{ display: "inline-flex" }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: "inline-flex" }}>{iconRight}</span>}
    </button>
  );
}
