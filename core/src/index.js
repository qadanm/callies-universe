// @callies-universe/core — public API barrel.
// Everything here is app-agnostic (the "would every app use this?" test).
// App-layer pieces (ShareCard, CreditTile) deliberately live OUTSIDE core.

// Core primitives
export { Button } from "./components/core/Button.jsx";
export { Chip } from "./components/core/Chip.jsx";
export { Card } from "./components/core/Card.jsx";
export { Input } from "./components/core/Input.jsx";
export { Badge } from "./components/core/Badge.jsx";

// Feedback
export { Sheet } from "./components/feedback/Sheet.jsx";
export { Toast } from "./components/feedback/Toast.jsx";
export { Confetti } from "./components/feedback/Confetti.jsx";

// Callie — the 9-state mascot system (presentational + behavioral + imperative)
export { Mascot, Callie, CallieStage, MascotHost, CallieHost } from "./components/mascot/Mascot.jsx";

// The character cast
export { Roaster } from "./components/cast/Roaster.jsx";
export { CastPicker } from "./components/cast/CastPicker.jsx";

// Decoration — the facelift's shared ink filter + comic accents
export { FilterHost } from "./components/decoration/FilterHost.jsx";
export { Burst } from "./components/decoration/Burst.jsx";
export { Squiggle } from "./components/decoration/Squiggle.jsx";
export { Tape } from "./components/decoration/Tape.jsx";
export { HalftoneBand } from "./components/decoration/HalftoneBand.jsx";
