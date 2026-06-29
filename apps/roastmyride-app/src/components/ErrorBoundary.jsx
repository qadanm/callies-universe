// Catches a screen render crash so the whole app never white-screens. Shows a
// friendly Callie "error" recovery instead of a blank page.
import React from "react";
import { Button, Callie } from "@callies-universe/core";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[app] screen crashed:", error, info && info.componentStack);
  }
  reset = () => {
    this.setState({ error: null });
    if (typeof window !== "undefined") window.location.hash = "#/";
  };
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-5)", padding: "var(--space-6)", textAlign: "center" }}>
        <Callie state="error" size={150} />
        <div>
          <h2 style={{ font: "var(--type-d2)", color: "var(--ink)", margin: 0 }}>That one landed too hard.</h2>
          <p style={{ font: "var(--type-sm)", color: "var(--text-muted)", margin: "8px 0 0", maxWidth: 280 }}>
            Something broke on this screen. Let's start fresh. Your credits are safe.
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={this.reset}>Start over</Button>
      </div>
    );
  }
}
