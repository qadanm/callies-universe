import React from "react";

/**
 * Sheet — bouncy bottom sheet / modal. Clean content; the mascot may host
 * the header. Scrim never blocks the close affordance.
 */
export function Sheet({
  open = true,
  title,
  header = null,        // optional node (e.g. <Mascot/>) hosting the header
  onClose,
  children,
  primaryAction = null, // node, usually a <Button block>
  style,
  ...rest
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "absolute", inset: 0, zIndex: 50,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(34,20,3,0.45)", backdropFilter: "blur(2px)" }} />
      <div
        style={{
          position: "relative",
          background: "var(--surface)",
          borderTopLeftRadius: "var(--radius-sheet)",
          borderTopRightRadius: "var(--radius-sheet)",
          boxShadow: "var(--elev-4)",
          padding: "var(--space-6)",
          paddingTop: header ? "var(--space-8)" : "var(--space-6)",
          animation: "rmr-pop-in var(--dur-4) var(--ease-spring) both",
          maxHeight: "92%", overflowY: "auto",
          ...style,
        }}
        {...rest}
      >
        <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--hairline)", margin: "0 auto var(--space-4)" }} />
        {header && (
          <div style={{ position: "absolute", top: -52, left: "50%", transform: "translateX(-50%)" }}>{header}</div>
        )}
        {title && <h2 style={{ font: "var(--type-d3)", color: "var(--ink)", margin: "0 0 var(--space-3)", textAlign: "center" }}>{title}</h2>}
        <div style={{ font: "var(--type-body)", color: "var(--text-body)" }}>{children}</div>
        {primaryAction && <div style={{ marginTop: "var(--space-6)" }}>{primaryAction}</div>}
      </div>
    </div>
  );
}
