import React, { useState } from "react";

/**
 * Input: clean, high-contrast, obvious focus. The functional layer:
 * minimal decoration, AA legible, clear error state.
 */
export function Input({
  label,
  hint,
  error,
  iconLeft = null,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const inputId = id || `in-${Math.random().toString(36).slice(2, 8)}`;
  const borderColor = error ? "var(--danger)" : focus ? "var(--ember-600)" : "var(--hairline)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", ...style }}>
      {label && (
        <label htmlFor={inputId} style={{ font: "var(--type-cap)", color: "var(--text-muted)", paddingLeft: "4px" }}>
          {label}
        </label>
      )}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        minHeight: "var(--tap-cozy)", padding: "0 16px",
        background: "var(--surface)",
        border: `2px solid ${borderColor}`,
        borderRadius: "var(--radius-input)",
        cornerShape: "var(--corner-input)",
        boxShadow: focus ? "0 0 0 4px rgba(7,182,206,0.25)" : "var(--elev-1)",
        transition: "border-color var(--dur-2), box-shadow var(--dur-2)",
      }}>
        {iconLeft && <span style={{ display: "inline-flex", color: "var(--text-muted)" }}>{iconLeft}</span>}
        <input
          id={inputId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            font: "var(--type-body)", color: "var(--ink)",
          }}
          aria-invalid={!!error}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{ font: "var(--type-cap)", color: error ? "var(--danger)" : "var(--text-hint)", paddingLeft: "4px" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
