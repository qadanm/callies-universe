/* @ds-bundle: {"format":3,"namespace":"RoastMyRideDesignSystem_896616","components":[{"name":"CastPicker","sourcePath":"components/cast/CastPicker.jsx"},{"name":"Roaster","sourcePath":"components/cast/Roaster.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Confetti","sourcePath":"components/feedback/Confetti.jsx"},{"name":"Sheet","sourcePath":"components/feedback/Sheet.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Mascot","sourcePath":"components/mascot/Mascot.jsx"},{"name":"Callie","sourcePath":"components/mascot/Mascot.jsx"},{"name":"MascotHost","sourcePath":"components/mascot/Mascot.jsx"},{"name":"CallieHost","sourcePath":"components/mascot/Mascot.jsx"},{"name":"CreditTile","sourcePath":"components/share/CreditTile.jsx"},{"name":"ShareCard","sourcePath":"components/share/ShareCard.jsx"}],"sourceHashes":{"apps/roastmyride-app/screensA.jsx":"19732fb364de","apps/roastmyride-app/screensB.jsx":"e8770c1205a3","apps/roastmyride-web/landing.jsx":"df8df6a9093a","components/cast/CastPicker.jsx":"e2447905ab24","components/cast/Roaster.jsx":"fa859f107ff4","components/core/Badge.jsx":"282899a07c93","components/core/Button.jsx":"b106f780ddb4","components/core/Card.jsx":"9558d922ba8c","components/core/Chip.jsx":"de2a71281e10","components/core/Input.jsx":"cd4a76fc6f71","components/feedback/Confetti.jsx":"b59a4fafdc95","components/feedback/Sheet.jsx":"f8fe9f2ff479","components/feedback/Toast.jsx":"1c2209334bc7","components/mascot/Mascot.jsx":"ddb274df0f8d","components/share/CreditTile.jsx":"34e492f358f9","components/share/ShareCard.jsx":"695c65ebe026"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RoastMyRideDesignSystem_896616 = window.RoastMyRideDesignSystem_896616 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// apps/roastmyride-app/screensA.jsx
try { (() => {
/* RoastMyRide app — screens part A: Onboarding, Home/Upload, the Cast picker, Cooking.
   Composes design-system primitives from window.RoastMyRideDesignSystem_896616. */
const RMR = window.RoastMyRideDesignSystem_896616;
const {
  Button,
  Card,
  Badge,
  Mascot,
  MascotHost,
  CallieHost,
  Confetti,
  Roaster,
  CastPicker
} = RMR;

/* ---------- shared bits ---------- */
function ScreenScroll({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "var(--space-5)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)",
      ...style
    }
  }, children);
}
function Eyebrow({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--ember-600)",
      fontWeight: 800
    }
  }, children);
}
function H({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-d1)",
      color: "var(--ink)",
      margin: 0,
      lineHeight: 1,
      ...style
    }
  }, children);
}

/* ===================================================== ONBOARDING */
function OnboardingScreen({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "radial-gradient(120% 70% at 50% 0%, var(--heat-300) 0%, var(--canvas) 55%)"
    }
  }, /*#__PURE__*/React.createElement(Confetti, {
    count: 16
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-5)",
      padding: "var(--space-6)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(MascotHost, {
    context: "onboarding",
    size: 180,
    bubble: true
  }), /*#__PURE__*/React.createElement(Eyebrow, null, "Meet your hype-cat"), /*#__PURE__*/React.createElement(H, {
    style: {
      fontSize: 44
    }
  }, "Hi, I'm Callie.", /*#__PURE__*/React.createElement("br", null), "I just react."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-lead)",
      color: "var(--text-muted)",
      margin: 0,
      maxWidth: 300
    }
  }, "You bring the car, the app brings the roast \u2014 and I'll be right here losing it in the corner. Clever, never cruel.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-5)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => go("home")
  }, "Roast my car \uD83D\uDD25"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    block: true,
    onClick: () => go("home")
  }, "I'll look around first")));
}

/* ===================================================== HOME / UPLOAD */
function HomeScreen({
  go
}) {
  return /*#__PURE__*/React.createElement(ScreenScroll, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Wordmark, null), /*#__PURE__*/React.createElement(Badge, {
    tone: "ember"
  }, "3 roasts left")), /*#__PURE__*/React.createElement(Card, {
    pad: "var(--space-5)",
    style: {
      textAlign: "center"
    },
    sticker: /*#__PURE__*/React.createElement(Badge, {
      tone: "flame"
    }, "HOT"),
    stickerCorner: "tr"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: -8
    }
  }, /*#__PURE__*/React.createElement(MascotHost, {
    context: "home",
    size: 120,
    bubble: true
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-d2)",
      color: "var(--ink)",
      margin: "4px 0 4px"
    }
  }, "Drop a pic of your ride"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-sm)",
      color: "var(--text-muted)",
      margin: "0 0 var(--space-4)"
    }
  }, "Photo 1 of 2 \u2014 the more I can see, the harder I cook."), /*#__PURE__*/React.createElement("button", {
    onClick: () => go("seasoning"),
    style: uploadTarget
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 40,
      lineHeight: 1
    }
  }, "\uD83D\uDCF8"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-d4)",
      color: "var(--ember-600)"
    }
  }, "Tap to add photo"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      color: "var(--text-hint)"
    }
  }, "Camera or library")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    style: {
      marginTop: "var(--space-4)"
    },
    onClick: () => go("seasoning")
  }, "Roast my car")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "0 var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(Mascot, {
    state: "watching",
    size: 48
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-sm)",
      color: "var(--text-muted)"
    }
  }, "Callie's standing by. Drop a car and watch it cook.")));
}

/* ===================================================== THE CAST — character picker */
function CastScreen({
  go
}) {
  const [sel, setSel] = React.useState(null);
  const firstName = sel ? sel.name.replace(/[“"].*$/, "").split(" ")[0] : "them";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "radial-gradient(120% 50% at 50% 0%, var(--heat-300) 0%, var(--canvas) 42%)"
    }
  }, /*#__PURE__*/React.createElement(ScreenScroll, {
    style: {
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(CallieHost, {
    context: "cast",
    size: 60
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "The cast \xB7 Callie hosts the show"), /*#__PURE__*/React.createElement(H, {
    style: {
      fontSize: 30
    }
  }, "Who's roasting you?"))), /*#__PURE__*/React.createElement(CastPicker, {
    initialId: "mama",
    onChange: setSel
  })), /*#__PURE__*/React.createElement("div", {
    style: stickyBar
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => go("cooking")
  }, "Cook it with ", firstName)));
}

/* ===================================================== COOKING / LOADING */
function CookingScreen({
  go
}) {
  const steps = ["Sizing up your ride…", "Checking the body kit…", "Loading the disrespect…", "Plating the roast…"];
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setStep(s => s + 1), 900);
    const done = setTimeout(() => go("reveal"), 3800);
    return () => {
      clearInterval(t);
      clearTimeout(done);
    };
  }, []);
  const pct = Math.min(100, (step + 1) * 25);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-6)",
      padding: "var(--space-6)",
      background: "radial-gradient(120% 70% at 50% 30%, var(--heat-300) 0%, var(--canvas) 60%)"
    }
  }, /*#__PURE__*/React.createElement(MascotHost, {
    context: "cooking",
    size: 200
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(H, {
    style: {
      fontSize: 34
    }
  }, "Cooking your roast\u2026"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-lead)",
      color: "var(--text-muted)",
      margin: "8px 0 0",
      minHeight: 26
    }
  }, steps[Math.min(step, steps.length - 1)])), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16,
      borderRadius: 999,
      background: "var(--surface)",
      boxShadow: "var(--elev-1)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: pct + "%",
      borderRadius: 999,
      background: "linear-gradient(90deg,var(--flame-500),var(--ember-600))",
      transition: "width var(--dur-3) var(--ease-out)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      font: "var(--type-cap)",
      color: "var(--text-hint)",
      marginTop: 8
    }
  }, "This usually takes ~10 seconds")));
}

/* ---------- local styles ---------- */
const uploadTarget = {
  width: "100%",
  border: "3px dashed var(--heat-400)",
  background: "var(--canvas-sink)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-7) var(--space-4)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  cursor: "pointer"
};
const stickyBar = {
  display: "flex",
  gap: "var(--space-3)",
  padding: "var(--space-4) var(--space-5)",
  borderTop: "1px solid var(--hairline)",
  background: "var(--canvas)"
};
const catchBubble = {
  display: "inline-block",
  maxWidth: 280,
  background: "var(--ink)",
  color: "var(--canvas)",
  borderRadius: "var(--radius-lg)",
  padding: "8px 14px",
  font: "var(--type-sm)",
  fontWeight: 600,
  fontStyle: "italic",
  boxShadow: "var(--shadow-sticker)"
};
const favStar = {
  width: 34,
  height: 34,
  borderRadius: "var(--radius-pill)",
  border: "none",
  cursor: "pointer",
  background: "var(--sticker-yellow)",
  color: "var(--ink)",
  fontSize: 18,
  boxShadow: "var(--shadow-sticker)"
};
const favDot = {
  position: "absolute",
  top: -2,
  right: -2,
  fontSize: 14,
  color: "var(--sticker-yellow)",
  textShadow: "0 1px 0 var(--ink)"
};
const pickCheck = {
  position: "absolute",
  bottom: -2,
  right: -2,
  width: 20,
  height: 20,
  borderRadius: "var(--radius-pill)",
  background: "var(--ember-600)",
  color: "#fff",
  fontSize: 12,
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid var(--canvas)"
};
const castTile = active => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  padding: "8px 2px",
  borderRadius: "var(--radius-lg)",
  border: `3px solid ${active ? "var(--ember-600)" : "transparent"}`,
  background: active ? "var(--surface)" : "transparent",
  boxShadow: active ? "var(--gloss-card)" : "none",
  cursor: "pointer",
  transition: "border-color var(--dur-2)"
});
function Wordmark() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-d3)",
      fontSize: 24,
      letterSpacing: "-0.02em",
      color: "var(--ink)"
    }
  }, "Roast", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ember-600)"
    }
  }, "My"), "Ride");
}
Object.assign(window, {
  OnboardingScreen,
  HomeScreen,
  CastScreen,
  CookingScreen,
  RMR_Wordmark: Wordmark,
  RMR_Eyebrow: Eyebrow,
  RMR_H: H,
  RMR_ScreenScroll: ScreenScroll,
  RMR_stickyBar: stickyBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "apps/roastmyride-app/screensA.jsx", error: String((e && e.message) || e) }); }

// apps/roastmyride-app/screensB.jsx
try { (() => {
/* RoastMyRide app — screens part B: Roast reveal + share, Profile-roast mode, Credits/paywall, Settings.
   Depends on screensA.jsx (shared helpers on window) + design-system bundle. */
const RMRb = window.RoastMyRideDesignSystem_896616;
const {
  Button: BtnB,
  Chip: ChipB,
  Card: CardB,
  Input: InputB,
  Badge: BadgeB,
  Mascot: MascotB,
  MascotHost: MascotHostB,
  Confetti: ConfettiB,
  Sheet: SheetB,
  ShareCard,
  CreditTile
} = RMRb;
const Eyebrow2 = window.RMR_Eyebrow,
  H2 = window.RMR_H,
  Scroll2 = window.RMR_ScreenScroll;

/* ===================================================== ROAST REVEAL + SHARE */
function RevealScreen({
  go
}) {
  const [revealed, setRevealed] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 250);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      background: "radial-gradient(120% 60% at 50% 0%, var(--heat-300) 0%, var(--canvas) 50%)"
    }
  }, revealed && /*#__PURE__*/React.createElement(ConfettiB, {
    count: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-5)",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow2, null, "Voiced by Mama Deni\xE8ce \xB7 Callie lost it \uD83D\uDE39"), /*#__PURE__*/React.createElement("div", {
    style: {
      animation: revealed ? "rmr-pop-in var(--dur-4) var(--ease-spring) both" : "none"
    }
  }, /*#__PURE__*/React.createElement(ShareCard, {
    width: 260,
    roasterName: "Mama Deni\xE8ce",
    spice: "savage",
    mascot: /*#__PURE__*/React.createElement(MascotB, {
      state: "savage",
      size: 84
    }),
    roast: [{
      text: "Mm-mm-MM. Baby, this paint job is "
    }, {
      text: "a cry for help",
      punch: true
    }, {
      text: ", and I'm answering."
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-5)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      background: "var(--canvas)",
      borderTopLeftRadius: "var(--radius-xl)",
      borderTopRightRadius: "var(--radius-xl)",
      boxShadow: "0 -8px 24px rgba(120,52,12,0.12)"
    }
  }, /*#__PURE__*/React.createElement(BtnB, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => go("celebrate")
  }, "Share video"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(BtnB, {
    variant: "secondary",
    style: {
      flex: 1
    },
    onClick: () => go("reveal")
  }, "Save"), /*#__PURE__*/React.createElement(BtnB, {
    variant: "secondary",
    style: {
      flex: 1
    },
    onClick: () => go("cooking")
  }, "Re-roast"))));
}
/* ===================================================== SHARE SUCCESS (celebrate sheet over reveal) */
function CelebrateScreen({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      background: "var(--canvas)"
    }
  }, /*#__PURE__*/React.createElement(ConfettiB, {
    count: 40
  }), /*#__PURE__*/React.createElement(SheetB, {
    open: true,
    title: "Posted! You menace \uD83D\uDE08",
    header: /*#__PURE__*/React.createElement(MascotHostB, {
      context: "celebrate",
      size: 96
    }),
    onClose: () => go("home"),
    primaryAction: /*#__PURE__*/React.createElement(BtnB, {
      variant: "primary",
      size: "lg",
      block: true,
      onClick: () => go("home")
    }, "Roast another")
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      margin: "0 0 var(--space-4)"
    }
  }, "Your roast is live. Tag us ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ember-600)"
    }
  }, "@roastmyride"), " and we'll re-share the best ones."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(BadgeB, {
    tone: "flame"
  }, "\uD83D\uDD25 2.4k views"), /*#__PURE__*/React.createElement(BadgeB, {
    tone: "cool"
  }, "\uD83D\uDCAC 88"), /*#__PURE__*/React.createElement(BadgeB, {
    tone: "pink"
  }, "\u2197 311 shares"))));
}

/* ===================================================== OPTIONAL SEASONING — selfie or profile */
function ProfileScreen({
  go
}) {
  const [mode, setMode] = React.useState("selfie"); // "selfie" | "profile"
  const [added, setAdded] = React.useState(false);
  const copy = mode === "selfie" ? {
    ico: "🤳",
    title: "Add a selfie",
    sub: "Snap or pick a photo of you"
  } : {
    ico: "📱",
    title: "Add a profile screenshot",
    sub: "A screenshot of your social profile"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(Scroll2, {
    style: {
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(MascotHostB, {
    context: "seasoning",
    size: 72,
    event: added ? "added" : null
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow2, null, "Photo 2 of 2 \xB7 make it personal"), /*#__PURE__*/React.createElement(H2, {
    style: {
      fontSize: 30
    }
  }, "Make it personal"))), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-sm)",
      color: "var(--text-muted)",
      margin: 0
    }
  }, "Add a selfie or a screenshot of your profile and the roast gets sharper. Totally optional \u2014 your car alone is plenty."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      padding: 5,
      background: "var(--canvas-sink)",
      borderRadius: "var(--radius-pill)"
    }
  }, [["selfie", "Selfie"], ["profile", "Profile screenshot"]].map(([k, label]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => {
      setMode(k);
      setAdded(false);
    },
    style: {
      flex: 1,
      minHeight: 44,
      border: "none",
      cursor: "pointer",
      borderRadius: "var(--radius-pill)",
      font: "var(--type-sm)",
      fontWeight: 700,
      background: mode === k ? "var(--surface)" : "transparent",
      color: mode === k ? "var(--ember-600)" : "var(--text-muted)",
      boxShadow: mode === k ? "var(--gloss-chip)" : "none"
    }
  }, label))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdded(true),
    style: {
      width: "100%",
      border: `3px dashed ${added ? "var(--ember-600)" : "var(--heat-400)"}`,
      background: added ? "#FFF3E2" : "var(--canvas-sink)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-7) var(--space-4)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 40
    }
  }, added ? "✅" : copy.ico), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-d4)",
      color: "var(--ember-600)"
    }
  }, added ? "Added — looking good" : copy.title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      color: "var(--text-hint)"
    }
  }, added ? "Tap to replace" : copy.sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      padding: "var(--space-3)",
      background: "var(--canvas-sink)",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      color: "var(--text-muted)"
    }
  }, "Private \u2014 we only ever roast you. Never your friends, never strangers."))), /*#__PURE__*/React.createElement("div", {
    style: window.RMR_stickyBar
  }, /*#__PURE__*/React.createElement(BtnB, {
    variant: "ghost",
    onClick: () => go("cast")
  }, "Skip"), /*#__PURE__*/React.createElement(BtnB, {
    variant: "primary",
    size: "lg",
    style: {
      flex: 1
    },
    onClick: () => go("cast")
  }, added ? "Next" : "Next · car only")));
}

/* ===================================================== CREDITS / PAYWALL */
function PaywallScreen({
  go
}) {
  const [sel, setSel] = React.useState(1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "radial-gradient(120% 50% at 50% 0%, var(--heat-300) 0%, var(--canvas) 45%)"
    }
  }, /*#__PURE__*/React.createElement(Scroll2, {
    style: {
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(MascotHostB, {
    context: "paywall",
    size: 120,
    bubble: true
  }), /*#__PURE__*/React.createElement(Eyebrow2, null, "You're out of roasts"), /*#__PURE__*/React.createElement(H2, {
    style: {
      fontSize: 34
    }
  }, "Stock up & keep cooking"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-sm)",
      color: "var(--text-muted)",
      margin: 0,
      maxWidth: 280
    }
  }, "Chips & context are always free. Credits pay for the video render.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(CreditTile, {
    credits: 1,
    price: "$0.99",
    perRoast: "$0.99",
    selected: sel === 0,
    onSelect: () => setSel(0)
  }), /*#__PURE__*/React.createElement(CreditTile, {
    credits: 5,
    price: "$3.99",
    perRoast: "$0.80",
    best: true,
    selected: sel === 1,
    onSelect: () => setSel(1)
  }), /*#__PURE__*/React.createElement(CreditTile, {
    credits: 15,
    price: "$8.99",
    perRoast: "$0.60",
    selected: sel === 2,
    onSelect: () => setSel(2)
  }), /*#__PURE__*/React.createElement(CreditTile, {
    credits: 40,
    price: "$19.99",
    perRoast: "$0.50",
    selected: sel === 3,
    onSelect: () => setSel(3)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-5)",
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(BtnB, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => go("reveal")
  }, "Get ", [1, 5, 15, 40][sel], " roasts"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-legal)",
      color: "var(--text-hint)",
      textAlign: "center"
    }
  }, "One-time purchase \xB7 no subscription \xB7 restore anytime")));
}

/* ===================================================== SETTINGS / ACCOUNT (bones, not skin) */
function SettingsScreen() {
  const rows = [{
    g: "Account",
    items: [["Profile & handle", "@dailydrifter"], ["Credits", "3 left"], ["Restore purchases", ""]]
  }, {
    g: "Roasting",
    items: [["Default roaster", "Callie"], ["Spice ceiling", "Medium"], ["Profile roast consent", "On"]]
  }, {
    g: "Accessibility",
    items: [["Reduce motion", "Follow system"], ["Captions on videos", "On"], ["Haptics", "On"]]
  }, {
    g: "About",
    items: [["Privacy & data", ""], ["Terms", ""], ["Version", "2.4.0"]]
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      background: "var(--canvas-sink)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-5) var(--space-5) var(--space-3)",
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(MascotHostB, {
    context: "settings",
    size: 52
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-d2)",
      color: "var(--ink)",
      margin: 0
    }
  }, "Settings")), rows.map(sec => /*#__PURE__*/React.createElement("div", {
    key: sec.g,
    style: {
      padding: "var(--space-3) var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-cap)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: "var(--text-hint)",
      margin: "0 0 8px 4px"
    }
  }, sec.g), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      boxShadow: "var(--elev-1)"
    }
  }, sec.items.map(([label, val], i) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: "flex",
      alignItems: "center",
      padding: "14px 16px",
      borderTop: i ? "1px solid var(--hairline)" : "none",
      minHeight: 48
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body)",
      color: "var(--ink)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      font: "var(--type-sm)",
      color: "var(--text-muted)"
    }
  }, val), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 10,
      color: "var(--text-hint)"
    }
  }, "\u203A")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-5)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-legal)",
      color: "var(--text-hint)"
    }
  }, "RoastMyRide \xB7 clever, never cruel \xB7 PG-13")));
}
Object.assign(window, {
  RevealScreen,
  CelebrateScreen,
  ProfileScreen,
  PaywallScreen,
  SettingsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "apps/roastmyride-app/screensB.jsx", error: String((e && e.message) || e) }); }

// apps/roastmyride-web/landing.jsx
try { (() => {
/* RoastMyRide — marketing landing page. One loud viral page, single CTA: install.
   Composes design-system primitives from window.RoastMyRideDesignSystem_896616. */
const LP = window.RoastMyRideDesignSystem_896616;
const {
  Button,
  Badge,
  Card,
  Mascot,
  ShareCard,
  Confetti
} = LP;
function Sticker({
  children,
  bg = "var(--sticker-yellow)",
  rot = -8,
  top,
  left,
  right,
  bottom,
  size = 54,
  fg = "var(--ink)"
}) {
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      top,
      left,
      right,
      bottom,
      width: size,
      height: size,
      background: bg,
      color: fg,
      borderRadius: 14,
      transform: `rotate(${rot}deg)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      font: "var(--type-d4)",
      fontSize: size * 0.5,
      boxShadow: "var(--shadow-sticker)",
      zIndex: 1
    }
  }, children);
}
function StoreBadge({
  store
}) {
  const label = store === "ios" ? ["Download on the", "App Store"] : ["Get it on", "Google Play"];
  return /*#__PURE__*/React.createElement("a", {
    href: "#install",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      textDecoration: "none",
      background: "var(--ink)",
      color: "var(--canvas)",
      padding: "10px 18px",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--elev-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: 26
    }
  }, store === "ios" ? "" : "▶"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-legal)",
      opacity: 0.85
    }
  }, label[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-d4)",
      fontSize: 18
    }
  }, label[1])));
}

/* ---------------- HERO ---------------- */
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "radial-gradient(120% 90% at 80% 0%, var(--heat-300) 0%, var(--canvas) 55%)"
    }
  }, /*#__PURE__*/React.createElement(Confetti, {
    count: 20
  }), /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
      gap: 40,
      alignItems: "center",
      padding: "20px 32px 80px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Sticker, {
    top: 120,
    left: -10,
    bg: "var(--pop-cyan)",
    rot: -14
  }, "\u2605"), /*#__PURE__*/React.createElement(Sticker, {
    bottom: 40,
    left: "46%",
    bg: "var(--sticker-pink)",
    fg: "#fff",
    rot: 10
  }, "\u2665"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "flame"
  }, "\uD83D\uDD25 #1 roast-video factory"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-d1)",
      fontSize: 72,
      lineHeight: 0.95,
      color: "var(--ink)",
      margin: "16px 0 0",
      textWrap: "balance"
    }
  }, "Your car. ", /*#__PURE__*/React.createElement("mark", {
    style: mark
  }, "Cooked.")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-lead)",
      fontSize: 20,
      color: "var(--text-muted)",
      maxWidth: 460,
      margin: "18px 0 28px"
    }
  }, "Upload a pic, pick your vibe, and we cook you a roast video that's actually funny \u2014 while Callie the cat loses it in the corner. Clever, never cruel. Built to post."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Get the app \u2014 it's free \uD83D\uDD25"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      color: "var(--text-hint)"
    }
  }, "\u2605\u2605\u2605\u2605\u2605 4.9 \xB7 120k roasts cooked")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(StoreBadge, {
    store: "ios"
  }), /*#__PURE__*/React.createElement(StoreBadge, {
    store: "android"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -10,
      left: 10,
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement(Mascot, {
    state: "savage",
    size: 130
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(PlayFrame, null, /*#__PURE__*/React.createElement(ShareCard, {
    width: 300,
    roasterName: "Ms. Burnt",
    spice: "savage",
    mascot: /*#__PURE__*/React.createElement(Mascot, {
      state: "savage",
      size: 92
    }),
    roast: [{
      text: "Lowered, loud, and "
    }, {
      text: "still slower",
      punch: true
    }, {
      text: " than the bus you cut off."
    }]
  }))))));
}
function PlayFrame({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--elev-4)",
      transform: "rotate(2deg)"
    }
  }, children, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 70,
      height: 70,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 28,
      boxShadow: "var(--elev-3)",
      color: "var(--ember-600)"
    }
  }, "\u25B6")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 14,
      left: 14,
      font: "var(--type-cap)",
      fontWeight: 700,
      color: "#fff",
      background: "rgba(34,20,3,0.5)",
      padding: "4px 10px",
      borderRadius: 999
    }
  }, "0:07 \xB7 looping"));
}
function Nav() {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      ...wrap,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "22px 32px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-d3)",
      fontSize: 26,
      letterSpacing: "-0.02em",
      color: "var(--ink)"
    }
  }, "Roast", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ember-600)"
    }
  }, "My"), "Ride"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Get the app"));
}

/* ---------------- PROOF WALL ---------------- */
const PROOF = [{
  r: [{
    text: "A spoiler on a "
  }, {
    text: "minivan",
    punch: true
  }, {
    text: "? Bold choice."
  }],
  name: "Coach",
  spice: "mild",
  state: "watching",
  views: "2.4M",
  tag: "#CarTok"
}, {
  r: [{
    text: "This Civic has "
  }, {
    text: "more stickers",
    punch: true
  }, {
    text: " than horsepower."
  }],
  name: "Lil Lemon",
  spice: "savage",
  state: "savage",
  views: "881k",
  tag: "#roastmyride"
}, {
  r: [{
    text: "Pristine. Garaged. "
  }, {
    text: "Never driven.",
    punch: true
  }, {
    text: " Coward."
  }],
  name: "The Valet",
  spice: "mild",
  state: "shook",
  views: "1.1M",
  tag: "#sleeperbuild"
}, {
  r: [{
    text: "Eco mode in a "
  }, {
    text: "V8",
    punch: true
  }, {
    text: ". Make it make sense."
  }],
  name: "Ms. Burnt",
  spice: "savage",
  state: "love",
  views: "3.0M",
  tag: "#fyp"
}];
function Proof() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--canvas-sink)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: "70px 32px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "cool"
  }, "The whole feed is doing it"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-d2)",
      fontSize: 46,
      color: "var(--ink)",
      margin: "14px 0 6px"
    }
  }, "120,000+ roasts and counting"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-lead)",
      color: "var(--text-muted)",
      margin: "0 0 40px"
    }
  }, "Real videos people couldn't help but post."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 18
    }
  }, PROOF.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`
    }
  }, /*#__PURE__*/React.createElement(ShareCard, {
    width: 240,
    roasterName: p.name,
    spice: p.spice,
    roast: p.r,
    mascot: /*#__PURE__*/React.createElement(Mascot, {
      state: p.state,
      size: 72
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 6px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      fontWeight: 700,
      color: "var(--ink)"
    }
  }, "\u25B6 ", p.views), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      color: "var(--ember-600)"
    }
  }, p.tag)))))));
}

/* ---------------- HOW IT WORKS ---------------- */
const STEPS = [{
  n: "1",
  t: "Upload your ride",
  d: "Snap a photo or pull one from your camera roll.",
  ico: "📸",
  bg: "var(--sticker-yellow)"
}, {
  n: "2",
  t: "Add a selfie",
  d: "A selfie or profile screenshot makes the roast personal — optional.",
  ico: "🤳",
  bg: "var(--sticker-cyan)"
}, {
  n: "3",
  t: "Pick your roaster",
  d: "Choose from a cast of 8 named characters, then get your video.",
  ico: "🎭",
  bg: "var(--sticker-pink)"
}];
function How() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--canvas)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: "80px 32px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-d2)",
      fontSize: 46,
      color: "var(--ink)",
      margin: "0 0 44px"
    }
  }, "Three taps to a roast"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 22
    }
  }, STEPS.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.n,
    pad: "var(--space-7)",
    style: {
      textAlign: "left"
    },
    sticker: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 44,
        height: 44,
        background: s.bg,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        font: "var(--type-d3)",
        color: "var(--ink)",
        boxShadow: "var(--shadow-sticker)"
      }
    }, s.n),
    stickerCorner: "tl"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 46,
      marginBottom: 10
    }
  }, s.ico), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-d3)",
      color: "var(--ink)",
      margin: "0 0 8px"
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)",
      margin: 0
    }
  }, s.d))))));
}

/* ---------------- MASCOT BIT ---------------- */
const SIZZLE_EMOTES = [["watching", "watching"], ["savage", "crying-laughing"], ["shook", "shook"], ["love", "smitten"], ["celebrating", "hyped"]];
function MascotBit() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "var(--ink)",
      color: "var(--canvas)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: "grid",
      gridTemplateColumns: "0.9fr 1.1fr",
      gap: 40,
      alignItems: "center",
      padding: "80px 32px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Sticker, {
    top: 10,
    left: 20,
    bg: "var(--sticker-yellow)",
    rot: -12
  }, "\u2605"), /*#__PURE__*/React.createElement(Sticker, {
    bottom: 20,
    right: 30,
    bg: "var(--pop-cyan)",
    rot: 14
  }, "\u2726"), /*#__PURE__*/React.createElement(Sticker, {
    top: 120,
    right: 0,
    bg: "var(--sticker-pink)",
    fg: "#fff",
    rot: 8,
    size: 46
  }, "\u2665"), /*#__PURE__*/React.createElement(Mascot, {
    state: "love",
    size: 280,
    placeholderTag: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "flame"
  }, "Meet the cat"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-d2)",
      fontSize: 50,
      margin: "14px 0 12px",
      color: "var(--canvas)"
    }
  }, "Say hi to Callie"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-lead)",
      fontSize: 19,
      color: "var(--heat-300)",
      margin: "0 0 24px",
      maxWidth: 460
    }
  }, "Callie doesn't write the roast \u2014 Callie ", /*#__PURE__*/React.createElement("i", null, "reacts"), " to it. A chubby little cat who shows up everywhere you go in the app, losing it at your car so you don't have to. Stickers, merch, and chaos included."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 22,
      flexWrap: "wrap"
    }
  }, SIZZLE_EMOTES.map(([st, label]) => /*#__PURE__*/React.createElement("div", {
    key: st,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Mascot, {
    state: st,
    size: 76
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      fontWeight: 700,
      color: "var(--canvas)"
    }
  }, label)))))));
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return /*#__PURE__*/React.createElement("section", {
    id: "install",
    style: {
      position: "relative",
      overflow: "hidden",
      background: "radial-gradient(120% 90% at 50% 120%, var(--ember-600) 0%, var(--heat-400) 60%, var(--canvas) 100%)"
    }
  }, /*#__PURE__*/React.createElement(Confetti, {
    count: 24
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: "90px 32px 70px",
      textAlign: "center",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Mascot, {
    state: "celebrating",
    size: 150
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-d1)",
      fontSize: 64,
      color: "var(--ink)",
      margin: "0 0 10px",
      textWrap: "balance"
    }
  }, "Go get roasted."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-lead)",
      fontSize: 20,
      color: "var(--ink)",
      opacity: 0.85,
      margin: "0 0 28px"
    }
  }, "Free to start. Your first roast is on the house."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    style: {
      fontSize: 24,
      height: 72,
      padding: "0 40px"
    }
  }, "Download RoastMyRide \uD83D\uDD25"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "center",
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(StoreBadge, {
    store: "ios"
  }), /*#__PURE__*/React.createElement(StoreBadge, {
    store: "android"
  }))), /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--ink)",
      color: "var(--heat-300)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "22px 32px",
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-d4)",
      color: "var(--canvas)"
    }
  }, "Roast", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--flame-500)"
    }
  }, "My"), "Ride"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)"
    }
  }, "Clever, never cruel \xB7 PG-13 \xB7 \xA9 2026"))));
}
const wrap = {
  maxWidth: 1120,
  margin: "0 auto",
  width: "100%",
  boxSizing: "border-box"
};
const mark = {
  background: "var(--sticker-yellow)",
  color: "var(--ink)",
  padding: "0 14px",
  borderRadius: 14,
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone"
};
function Landing() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Proof, null), /*#__PURE__*/React.createElement(How, null), /*#__PURE__*/React.createElement(MascotBit, null), /*#__PURE__*/React.createElement(FinalCTA, null));
}
window.RMR_Landing = Landing;
})(); } catch (e) { __ds_ns.__errors.push({ path: "apps/roastmyride-web/landing.jsx", error: String((e && e.message) || e) }); }

// components/cast/Roaster.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Roaster — the VOICE CAST avatars. Eight named, backstoried comedic personas
 * who deliver the roast (the CAST performs; Callie the mascot only reacts).
 *
 * Each avatar is a unique kawaii bust in Callie's world (round, soft, thick
 * outline, flat fill) — distinguished by skin tone, hair, wardrobe, expression,
 * and a signature prop. PLACEHOLDER art, built to be swapped for final
 * illustration keyed to the same `id`.
 *
 * Roster metadata (name/tagline/catchphrase/register/ring) travels on
 * `Roaster.roster` so the cast-picker can render tiles without a 2nd export.
 */

const OUT = "#3A2208";
function Roaster({
  id = "reginald",
  size = 140,
  ring = false,
  style,
  ...rest
}) {
  const r = ROSTER[id] || ROSTER.reginald;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      ...style
    },
    "data-roaster": id,
    role: "img",
    "aria-label": r.name
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "100%",
    height: "100%",
    style: {
      overflow: "visible"
    }
  }, ring && /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "96",
    fill: r.ring
  }), /*#__PURE__*/React.createElement(Bust, {
    skin: r.skin,
    cloth: r.cloth
  }), ART[id] && ART[id]()));
}

/* shared bust: shoulders + neck + round head + ears */
function Bust({
  skin,
  cloth
}) {
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M26 200 C26 160 58 150 100 150 C142 150 174 160 174 200 Z",
    fill: cloth,
    stroke: OUT,
    strokeWidth: "5",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "86",
    y: "128",
    width: "28",
    height: "26",
    rx: "10",
    fill: skin,
    stroke: OUT,
    strokeWidth: "5"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "50",
    cy: "96",
    rx: "11",
    ry: "13",
    fill: skin,
    stroke: OUT,
    strokeWidth: "4.5"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "150",
    cy: "96",
    rx: "11",
    ry: "13",
    fill: skin,
    stroke: OUT,
    strokeWidth: "4.5"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "100",
    cy: "92",
    rx: "52",
    ry: "54",
    fill: skin,
    stroke: OUT,
    strokeWidth: "5"
  }));
}

/* ---- face primitives ---- */
const eyes = {
  dot: /*#__PURE__*/React.createElement("g", {
    fill: OUT
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "80",
    cy: "94",
    rx: "5.5",
    ry: "8"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "120",
    cy: "94",
    rx: "5.5",
    ry: "8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "82",
    cy: "91",
    r: "2",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "122",
    cy: "91",
    r: "2",
    fill: "#fff"
  })),
  glance: /*#__PURE__*/React.createElement("g", {
    fill: OUT
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "84",
    cy: "94",
    rx: "5.5",
    ry: "8"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "124",
    cy: "94",
    rx: "5.5",
    ry: "8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "86",
    cy: "91",
    r: "2",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "126",
    cy: "91",
    r: "2",
    fill: "#fff"
  })),
  half: /*#__PURE__*/React.createElement("g", {
    stroke: OUT,
    strokeWidth: "5",
    strokeLinecap: "round",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M70 95 Q80 99 90 95"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M110 95 Q120 99 130 95"
  })),
  closed: /*#__PURE__*/React.createElement("g", {
    stroke: OUT,
    strokeWidth: "4.5",
    strokeLinecap: "round",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M70 94 Q80 90 90 94"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M110 94 Q120 90 130 94"
  })),
  happy: /*#__PURE__*/React.createElement("g", {
    stroke: OUT,
    strokeWidth: "5",
    strokeLinecap: "round",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M70 96 Q80 88 90 96"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M110 96 Q120 88 130 96"
  })),
  droopy: /*#__PURE__*/React.createElement("g", {
    fill: OUT
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "80",
    cy: "97",
    rx: "5",
    ry: "6"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "120",
    cy: "97",
    rx: "5",
    ry: "6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M71 90 Q80 86 89 90",
    stroke: OUT,
    strokeWidth: "3",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M111 90 Q120 86 129 90",
    stroke: OUT,
    strokeWidth: "3",
    fill: "none",
    strokeLinecap: "round"
  }))
};
const mouths = {
  smile: /*#__PURE__*/React.createElement("path", {
    d: "M88 116 Q100 126 112 116",
    fill: "none",
    stroke: OUT,
    strokeWidth: "4",
    strokeLinecap: "round"
  }),
  grin: /*#__PURE__*/React.createElement("path", {
    d: "M84 114 Q100 128 116 114",
    fill: "none",
    stroke: OUT,
    strokeWidth: "4.5",
    strokeLinecap: "round"
  }),
  warm: /*#__PURE__*/React.createElement("path", {
    d: "M82 114 Q100 130 118 114 Q100 120 82 114 Z",
    fill: "#7A1A05",
    stroke: OUT,
    strokeWidth: "2.5"
  }),
  flat: /*#__PURE__*/React.createElement("line", {
    x1: "90",
    y1: "118",
    x2: "110",
    y2: "118",
    stroke: OUT,
    strokeWidth: "4",
    strokeLinecap: "round"
  }),
  smug: /*#__PURE__*/React.createElement("path", {
    d: "M92 117 Q104 122 114 113",
    fill: "none",
    stroke: OUT,
    strokeWidth: "4",
    strokeLinecap: "round"
  }),
  gasp: /*#__PURE__*/React.createElement("ellipse", {
    cx: "100",
    cy: "119",
    rx: "7",
    ry: "9",
    fill: "#7A1A05",
    stroke: OUT,
    strokeWidth: "2.5"
  }),
  talk: /*#__PURE__*/React.createElement("ellipse", {
    cx: "100",
    cy: "118",
    rx: "8",
    ry: "6",
    fill: "#7A1A05",
    stroke: OUT,
    strokeWidth: "2.5"
  }),
  tiny: /*#__PURE__*/React.createElement("path", {
    d: "M94 117 Q100 121 106 117",
    fill: "none",
    stroke: OUT,
    strokeWidth: "3.5",
    strokeLinecap: "round"
  })
};
const nose = /*#__PURE__*/React.createElement("path", {
  d: "M97 104 L103 104 L100 109 Z",
  fill: "rgba(58,34,8,0.4)"
});

/* ---- roster metadata (travels on Roaster.roster) ---- */
const ROSTER = {
  reginald: {
    name: "Sir Reginald Pemberton-Hare",
    tag: "Posh nat-geo narrator",
    register: "Dry · deadpan",
    spice: "Mild",
    phrase: "It should not still be running. And yet… it persists.",
    skin: "#F3CBA4",
    cloth: "#8A6E45",
    ring: "#C9D98F"
  },
  tony: {
    name: "Tony “Two-Times” Calabrese",
    tag: "Exasperated New Yorker",
    register: "Fast · big-hearted",
    spice: "Medium",
    phrase: "What is this? What am I lookin’ at here?",
    skin: "#E3AC80",
    cloth: "#26407A",
    ring: "#FFCB2B"
  },
  abuomar: {
    name: "Abu Omar",
    tag: "Warm Egyptian uncle",
    register: "Theatrical · warm",
    spice: "Mild",
    phrase: "My son… the car, I do not love.",
    skin: "#C98E58",
    cloth: "#7A2E3A",
    ring: "#FFB877"
  },
  mama: {
    name: "Mama Denièce",
    tag: "Loving-savage mom",
    register: "Church-fan snap",
    spice: "Spicy",
    phrase: "Mm-mm-MM. Baby, I say this with love… no.",
    skin: "#6E4226",
    cloth: "#6B3FA0",
    ring: "#C9A2F0"
  },
  mateo: {
    name: "Mateo “El Tigre” Rivas",
    tag: "Telenovela hype-man",
    register: "Operatic drama",
    spice: "Spicy",
    phrase: "The car — the car has broken my heart.",
    skin: "#D89C68",
    cloth: "#1A1A1F",
    ring: "#FF4FA3"
  },
  jeanluc: {
    name: "Jean-Luc Moreau",
    tag: "Unbothered Frenchman",
    register: "Deadpan disdain",
    spice: "Medium",
    phrase: "It is a car. It is here. I am… unmoved.",
    skin: "#F1C7A0",
    cloth: "#2C5AA8",
    ring: "#8FC2FF"
  },
  priya: {
    name: "Priya Nair",
    tag: "Comparison auntie",
    register: "Lovingly brutal",
    spice: "Spicy",
    phrase: "Sharma-ji’s son has better. But it’s nice, beta.",
    skin: "#B87B4A",
    cloth: "#1F8A7A",
    ring: "#5FD6C4"
  },
  kenji: {
    name: "Kenji “Ken” Tanaka",
    tag: "Zen minimalist",
    register: "Three-word KO",
    spice: "Mild",
    phrase: "…Hm. It is a car.",
    skin: "#ECBC8E",
    cloth: "#3A3A44",
    ring: "#AEB6C2"
  }
};
Roaster.roster = Object.keys(ROSTER).map(id => ({
  id,
  ...ROSTER[id]
}));

/* ---- per-character art (hair / brows / face / props, drawn over the bust) ---- */
const ART = {
  reginald: () => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M52 86 C50 54 70 40 100 40 C130 40 150 54 148 86 C148 70 132 62 100 62 C68 62 52 70 52 86 Z",
    fill: "#BFB9AE",
    stroke: OUT,
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "100",
    cy: "52",
    rx: "62",
    ry: "13",
    fill: "#B79A5E",
    stroke: OUT,
    strokeWidth: "4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M62 52 C62 26 80 18 100 18 C120 18 138 26 138 52 Z",
    fill: "#C7AB6E",
    stroke: OUT,
    strokeWidth: "4.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "62",
    y: "44",
    width: "76",
    height: "9",
    rx: "4",
    fill: "#7A6238"
  }), eyes.half, /*#__PURE__*/React.createElement("circle", {
    cx: "120",
    cy: "94",
    r: "13",
    fill: "none",
    stroke: "#7A6238",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "131",
    y1: "100",
    x2: "136",
    y2: "120",
    stroke: "#7A6238",
    strokeWidth: "2.5"
  }), nose, mouths.flat, /*#__PURE__*/React.createElement("path", {
    d: "M84 154 L100 172 L116 154",
    fill: "none",
    stroke: "#6E552F",
    strokeWidth: "4"
  })),
  tony: () => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M50 80 C48 48 70 36 100 36 C130 36 152 48 150 80 C150 60 138 52 120 56 C112 46 88 46 80 56 C62 52 50 60 50 80 Z",
    fill: "#2B2A33",
    stroke: OUT,
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M70 78 Q80 70 92 76",
    stroke: OUT,
    strokeWidth: "4.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M108 76 Q120 70 130 78",
    stroke: OUT,
    strokeWidth: "4.5",
    fill: "none",
    strokeLinecap: "round"
  }), eyes.dot, /*#__PURE__*/React.createElement("path", {
    d: "M70 120 Q100 140 130 120 Q100 134 70 120 Z",
    fill: "rgba(43,42,51,0.18)"
  }), nose, mouths.talk, /*#__PURE__*/React.createElement("path", {
    d: "M80 156 Q100 170 120 156",
    fill: "none",
    stroke: "#FFC93B",
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "60",
    y: "158",
    width: "6",
    height: "42",
    fill: "#fff",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "134",
    y: "158",
    width: "6",
    height: "42",
    fill: "#fff",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(150 150)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "-12",
    y: "-8",
    width: "22",
    height: "16",
    rx: "3",
    fill: "#fff",
    stroke: OUT,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 -4 q8 0 8 6 q0 6 -8 6",
    fill: "none",
    stroke: OUT,
    strokeWidth: "3"
  }))),
  abuomar: () => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M52 92 C50 66 64 56 78 54 C70 64 70 78 70 88 Z",
    fill: "#C9C3B8",
    stroke: OUT,
    strokeWidth: "3.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M148 92 C150 66 136 56 122 54 C130 64 130 78 130 88 Z",
    fill: "#C9C3B8",
    stroke: OUT,
    strokeWidth: "3.5"
  }), eyes.happy, /*#__PURE__*/React.createElement("path", {
    d: "M80 112 Q100 104 120 112 Q110 122 100 118 Q90 122 80 112 Z",
    fill: "#CFC9BE",
    stroke: OUT,
    strokeWidth: "2.5"
  }), mouths.warm, /*#__PURE__*/React.createElement("path", {
    d: "M82 152 L100 168 L118 152",
    fill: "none",
    stroke: "#5C222C",
    strokeWidth: "5"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(150 152)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "-11",
    y: "-10",
    width: "20",
    height: "20",
    rx: "3",
    fill: "#C97A2E",
    stroke: OUT,
    strokeWidth: "3",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "-11",
    y: "-10",
    width: "20",
    height: "6",
    rx: "3",
    fill: "#E8A95A"
  }))),
  mama: () => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M48 84 C44 50 68 34 100 34 C132 34 156 50 152 84 C152 62 150 50 132 44 C150 56 142 74 138 82 C132 60 116 56 100 56 C84 56 68 60 62 82 C58 74 50 56 68 44 C50 50 48 62 48 84 Z",
    fill: "#241712",
    stroke: OUT,
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M70 80 Q80 74 92 78",
    stroke: OUT,
    strokeWidth: "4.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M108 74 Q120 68 130 74",
    stroke: OUT,
    strokeWidth: "4.5",
    fill: "none",
    strokeLinecap: "round"
  }), eyes.glance, nose, mouths.smug, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "110",
    r: "7",
    fill: "none",
    stroke: "#FFC93B",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "150",
    cy: "110",
    r: "7",
    fill: "none",
    stroke: "#FFC93B",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(158 150) rotate(18)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 0 L-26 -16 A30 30 0 0 1 4 -22 Z",
    fill: "#F6E7C8",
    stroke: OUT,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "0",
    x2: "-14",
    y2: "-9",
    stroke: OUT,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "0",
    x2: "-10",
    y2: "-16",
    stroke: OUT,
    strokeWidth: "1.5"
  }))),
  mateo: () => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M50 80 C48 46 70 34 100 34 C130 34 152 46 150 80 C150 56 140 50 122 52 C118 40 92 40 86 54 C66 50 50 58 50 80 Z",
    fill: "#1E1A22",
    stroke: OUT,
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M70 76 Q80 68 92 74",
    stroke: OUT,
    strokeWidth: "4.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M108 74 Q120 68 130 76",
    stroke: OUT,
    strokeWidth: "4.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "64",
    y: "84",
    width: "30",
    height: "22",
    rx: "10",
    fill: "#15151A",
    stroke: OUT,
    strokeWidth: "3.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "106",
    y: "84",
    width: "30",
    height: "22",
    rx: "10",
    fill: "#15151A",
    stroke: OUT,
    strokeWidth: "3.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "94",
    y1: "92",
    x2: "106",
    y2: "92",
    stroke: OUT,
    strokeWidth: "3.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "70",
    y: "89",
    width: "9",
    height: "5",
    rx: "2",
    fill: "#fff",
    opacity: "0.4"
  })), nose, mouths.gasp, /*#__PURE__*/React.createElement("path", {
    d: "M78 156 Q100 172 122 156",
    fill: "none",
    stroke: "#FFC93B",
    strokeWidth: "4.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "168",
    r: "4",
    fill: "#FFC93B",
    stroke: OUT,
    strokeWidth: "1.5"
  })),
  jeanluc: () => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M50 82 C48 50 70 38 100 38 C130 38 152 50 150 82 C148 64 140 56 126 58 C120 50 112 54 108 58 C100 50 90 54 86 60 C74 54 56 60 50 82 Z",
    fill: "#3A2A1E",
    stroke: OUT,
    strokeWidth: "4"
  }), eyes.droopy, nose, mouths.flat, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M26 200 C26 160 58 150 100 150 C142 150 174 160 174 200 Z",
    fill: "#F4F1EA",
    stroke: OUT,
    strokeWidth: "5",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "40",
    y: "160",
    width: "120",
    height: "6",
    fill: "#2C5AA8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "34",
    y: "174",
    width: "132",
    height: "6",
    fill: "#2C5AA8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "30",
    y: "188",
    width: "140",
    height: "6",
    fill: "#2C5AA8"
  })), /*#__PURE__*/React.createElement("g", {
    transform: "translate(150 156)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "-9",
    y: "-7",
    width: "18",
    height: "13",
    rx: "2",
    fill: "#fff",
    stroke: OUT,
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "-9",
    y: "-7",
    width: "18",
    height: "4",
    fill: "#6E4A2E"
  }))),
  priya: () => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M50 86 C48 52 70 38 100 38 C130 38 152 52 150 86 C150 64 140 56 100 56 C60 56 50 64 50 86 Z",
    fill: "#241A1F",
    stroke: OUT,
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "100",
    y1: "40",
    x2: "100",
    y2: "56",
    stroke: "#3A2A30",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "36",
    r: "12",
    fill: "#241A1F",
    stroke: OUT,
    strokeWidth: "3.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "66",
    r: "3.5",
    fill: "#C7340F"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M70 80 Q80 76 92 79",
    stroke: OUT,
    strokeWidth: "4",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M108 73 Q120 67 130 74",
    stroke: OUT,
    strokeWidth: "4.5",
    fill: "none",
    strokeLinecap: "round"
  }), eyes.glance, nose, mouths.smug, /*#__PURE__*/React.createElement("g", {
    fill: "#FFC93B",
    stroke: OUT,
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "112",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M46 116 h8 l-4 6 z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "150",
    cy: "112",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M146 116 h8 l-4 6 z"
  })), /*#__PURE__*/React.createElement("g", {
    transform: "translate(150 156) rotate(-12)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "-8",
    y: "-14",
    width: "16",
    height: "28",
    rx: "3",
    fill: "#15151A",
    stroke: OUT,
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "-5",
    y: "-10",
    width: "10",
    height: "18",
    rx: "1",
    fill: "#5FD6C4"
  }))),
  kenji: () => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M50 82 C48 50 70 38 100 38 C130 38 152 50 150 82 C150 60 142 54 100 54 C58 54 50 60 50 82 Z",
    fill: "#20202A",
    stroke: OUT,
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M64 60 Q100 50 136 60 L136 70 Q100 60 64 70 Z",
    fill: "#20202A"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: OUT,
    strokeWidth: "4.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "72",
    y1: "95",
    x2: "90",
    y2: "95"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "110",
    y1: "95",
    x2: "128",
    y2: "95"
  })), nose, mouths.tiny, /*#__PURE__*/React.createElement("path", {
    d: "M86 152 L100 162 L114 152",
    fill: "none",
    stroke: "#2A2A32",
    strokeWidth: "5"
  }))
};
Object.assign(__ds_scope, { Roaster });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cast/Roaster.jsx", error: String((e && e.message) || e) }); }

// components/cast/CastPicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect
} = React;
/**
 * CastPicker — the reusable character-tile / cast-picker for the whole universe.
 * Featured roaster (avatar + catchphrase + spice meter + favorite) over a
 * tap-to-switch grid of all cast members. Reads the cast from `Roaster.roster`,
 * so it auto-extends as new characters are added. App-agnostic: the host adds
 * its own header (Callie) and confirm CTA around it.
 */
function CastPicker({
  initialId,
  onChange,
  style,
  ...rest
}) {
  const roster = __ds_scope.Roaster.roster;
  const startIdx = Math.max(0, roster.findIndex(r => r.id === initialId));
  const [pick, setPick] = useState(startIdx === -1 ? 0 : startIdx);
  const [fav, setFav] = useState({});
  const [previewing, setPreviewing] = useState(false);
  const r = roster[pick];
  const pips = r.spice === "Spicy" ? 3 : r.spice === "Medium" ? 2 : 1;
  useEffect(() => {
    onChange && onChange(r); /* eslint-disable-next-line */
  }, [pick]);
  useEffect(() => {
    setPreviewing(true);
    const t = setTimeout(() => setPreviewing(false), 1400);
    return () => clearTimeout(t);
  }, [pick]);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      textAlign: "center",
      background: "linear-gradient(180deg,var(--accent-soft),var(--surface))",
      borderRadius: "var(--radius-card)",
      boxShadow: "var(--gloss-card)",
      padding: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setFav(f => ({
      ...f,
      [r.id]: !f[r.id]
    })),
    "aria-label": "Favorite",
    style: {
      position: "absolute",
      top: -12,
      right: 14,
      width: 34,
      height: 34,
      borderRadius: "var(--radius-pill)",
      border: "none",
      cursor: "pointer",
      background: "var(--sticker-yellow)",
      color: "var(--ink)",
      fontSize: 18,
      boxShadow: "var(--shadow-sticker)"
    }
  }, fav[r.id] ? "★" : "☆"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      maxWidth: 280,
      background: "var(--ink)",
      color: "var(--canvas)",
      borderRadius: "var(--radius-lg)",
      padding: "8px 14px",
      font: "var(--type-sm)",
      fontWeight: 600,
      fontStyle: "italic",
      boxShadow: "var(--shadow-sticker)"
    }
  }, "\u201C", r.phrase, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: 4,
      transform: previewing ? "scale(1.04)" : "scale(1)",
      transition: "transform var(--dur-3) var(--ease-spring)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Roaster, {
    id: r.id,
    size: 132,
    ring: true
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-d3)",
      color: "var(--ink)",
      margin: "8px 0 2px"
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-cap)",
      color: "var(--ember-600)",
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    }
  }, r.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "4px 11px",
      borderRadius: "var(--radius-pill)",
      font: "var(--type-cap)",
      fontWeight: 700,
      background: "var(--flame-500)",
      color: "var(--ink)",
      boxShadow: "var(--shadow-sticker)"
    }
  }, r.register), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      letterSpacing: 2
    },
    "aria-label": `spice ${pips} of 3`
  }, "🌶".repeat(pips), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.25
    }
  }, "🌶".repeat(3 - pips)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPreviewing(true),
    style: {
      marginTop: "var(--space-4)",
      width: "100%",
      minHeight: "var(--tap-cozy)",
      borderRadius: "var(--radius-pill)",
      border: "2px solid var(--ember-600)",
      background: "var(--surface)",
      color: "var(--ember-600)",
      font: "var(--type-button)",
      fontSize: 16,
      cursor: "pointer",
      boxShadow: "var(--gloss-card)"
    }
  }, previewing ? "🔊 Previewing…" : "▶  Preview voice")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-d4)",
      color: "var(--ink)",
      margin: 0
    }
  }, "Meet the cast"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      color: "var(--text-hint)"
    }
  }, roster.length, " roasters \xB7 tap to switch")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--space-2)"
    }
  }, roster.map((c, i) => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setPick(i),
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      padding: "8px 2px",
      borderRadius: "var(--radius-lg)",
      border: `3px solid ${i === pick ? "var(--ember-600)" : "transparent"}`,
      background: i === pick ? "var(--surface)" : "transparent",
      boxShadow: i === pick ? "var(--gloss-card)" : "none",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Roaster, {
    id: c.id,
    size: 62,
    ring: true
  }), fav[c.id] && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -2,
      right: -2,
      fontSize: 14,
      color: "var(--sticker-yellow)",
      textShadow: "0 1px 0 var(--ink)"
    }
  }, "\u2605"), i === pick && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: -2,
      right: -2,
      width: 20,
      height: 20,
      borderRadius: "var(--radius-pill)",
      background: "var(--ember-600)",
      color: "#fff",
      fontSize: 12,
      fontWeight: 800,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "2px solid var(--canvas)"
    }
  }, "\u2713")), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-legal)",
      fontWeight: 700,
      color: i === pick ? "var(--ember-600)" : "var(--text-muted)"
    }
  }, c.name.replace(/[“"].*$/, "").split(" ")[0]))))));
}
Object.assign(__ds_scope, { CastPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cast/CastPicker.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — small status / count pill. Tone maps to semantic or sticker colors.
 */
function Badge({
  tone = "ember",
  children,
  style,
  ...rest
}) {
  const tones = {
    ember: {
      bg: "var(--ember-600)",
      fg: "var(--on-ember)"
    },
    flame: {
      bg: "var(--flame-500)",
      fg: "var(--ink)"
    },
    success: {
      bg: "var(--success)",
      fg: "#FFFFFF"
    },
    info: {
      bg: "var(--info)",
      fg: "#FFFFFF"
    },
    cool: {
      bg: "var(--pop-cyan)",
      fg: "var(--ink)"
    },
    pink: {
      bg: "var(--pop-pink)",
      fg: "#FFFFFF"
    },
    ink: {
      bg: "var(--ink)",
      fg: "var(--canvas)"
    }
  }[tone] || {};
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "4px 11px",
      borderRadius: "var(--radius-pill)",
      font: "var(--type-cap)",
      fontWeight: 700,
      lineHeight: 1,
      background: tones.bg,
      color: tones.fg,
      boxShadow: "var(--shadow-sticker)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Button — glossy inflatable, chunky, display-font label.
 * Squish-and-spring on press. Functional layer: AA contrast, obvious states.
 */
function Button({
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
    sm: {
      h: "var(--tap-min)",
      px: "18px",
      fs: "16px"
    },
    md: {
      h: "var(--tap-cozy)",
      px: "24px",
      fs: "18px"
    },
    lg: {
      h: "var(--tap-hero)",
      px: "32px",
      fs: "22px"
    }
  }[size];
  const variants = {
    primary: {
      background: "linear-gradient(180deg, var(--ember-500), var(--ember-600))",
      color: "var(--on-ember)",
      boxShadow: "var(--gloss-primary)",
      border: "none"
    },
    accent: {
      background: "linear-gradient(180deg, var(--flame-400), var(--flame-500))",
      color: "var(--ink)",
      boxShadow: "var(--gloss-primary)",
      border: "none"
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--ember-600)",
      boxShadow: "var(--gloss-card)",
      border: "2px solid var(--ember-600)"
    },
    ghost: {
      background: "transparent",
      color: "var(--ember-600)",
      boxShadow: "none",
      border: "2px solid transparent"
    }
  }[variant];
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: block ? "100%" : "auto",
    minHeight: sizes.h,
    padding: `0 ${sizes.px}`,
    font: "var(--type-button)",
    fontSize: sizes.fs,
    letterSpacing: "0.01em",
    borderRadius: "var(--radius-button)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transform: pressed && !disabled ? `scale(var(--press-scale))` : "scale(1)",
    transition: "transform var(--dur-1) var(--ease-spring), filter var(--dur-2) var(--ease-out)",
    boxShadow: pressed && !disabled && variant !== "ghost" ? "var(--gloss-primary-pressed)" : variants.boxShadow,
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    ...variants,
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onPointerDown: () => !disabled && setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: base
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — rounded, soft glossy elevation. Clean interior (the bones);
 * optional sticker accents on the corners (the skin).
 */
function Card({
  sticker = null,
  // optional decoration node, pinned to a corner
  stickerCorner = "tr",
  // tl | tr | bl | br
  pad = "var(--space-6)",
  style,
  children,
  ...rest
}) {
  const cornerPos = {
    tl: {
      top: -14,
      left: -14
    },
    tr: {
      top: -14,
      right: -14
    },
    bl: {
      bottom: -14,
      left: -14
    },
    br: {
      bottom: -14,
      right: -14
    }
  }[stickerCorner];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      background: "var(--surface-card)",
      borderRadius: "var(--radius-card)",
      boxShadow: "var(--gloss-card)",
      padding: pad,
      ...style
    }
  }, rest), children, sticker && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      ...cornerPos,
      zIndex: 2,
      filter: "drop-shadow(0 2px 0 rgba(34,20,3,0.18))",
      transform: "rotate(-8deg)",
      pointerEvents: "none"
    }
  }, sticker));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Chip — sticker-like tap pill for fast multi-select context.
 * Selected = filled ember with a tiny pop. Easy to deselect.
 */
function Chip({
  selected = false,
  emoji = null,
  children,
  onToggle,
  style,
  ...rest
}) {
  const [pop, setPop] = useState(false);
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    minHeight: "var(--tap-min)",
    padding: "0 18px",
    font: "var(--type-d4)",
    fontSize: "16px",
    borderRadius: "var(--radius-chip)",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "transform var(--dur-2) var(--ease-spring), background var(--dur-2) var(--ease-out), color var(--dur-2)",
    transform: pop ? "scale(1.08)" : "scale(1)",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    ...(selected ? {
      background: "var(--ember-600)",
      color: "var(--on-ember)",
      border: "2px solid var(--ember-700)",
      boxShadow: "var(--gloss-chip)"
    } : {
      background: "var(--surface)",
      color: "var(--ink)",
      border: "2px solid var(--hairline)",
      boxShadow: "var(--gloss-chip)"
    }),
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-pressed": selected,
    onClick: () => {
      setPop(true);
      setTimeout(() => setPop(false), 180);
      onToggle && onToggle(!selected);
    },
    style: base
  }, rest), emoji && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: "18px"
    }
  }, emoji), children, selected && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: "14px",
      opacity: 0.9
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Input — clean, high-contrast, obvious focus. The functional layer:
 * minimal decoration, AA legible, clear error state.
 */
function Input({
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      width: "100%",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      font: "var(--type-cap)",
      color: "var(--text-muted)",
      paddingLeft: "4px"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minHeight: "var(--tap-cozy)",
      padding: "0 16px",
      background: "var(--surface)",
      border: `2px solid ${borderColor}`,
      borderRadius: "var(--radius-input)",
      boxShadow: focus ? "0 0 0 4px rgba(7,182,206,0.25)" : "var(--elev-1)",
      transition: "border-color var(--dur-2), box-shadow var(--dur-2)"
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      color: "var(--text-muted)"
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      font: "var(--type-body)",
      color: "var(--ink)"
    },
    "aria-invalid": !!error
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      color: error ? "var(--danger)" : "var(--text-hint)",
      paddingLeft: "4px"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Confetti.jsx
try { (() => {
const {
  useMemo
} = React;
/**
 * Confetti — DECORATION-ONLY celebratory burst. pointer-events:none, so it
 * never blocks tap targets or text. Honors reduce-motion (renders nothing).
 */
function Confetti({
  count = 28,
  active = true,
  style
}) {
  const prefersReduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = ["var(--sticker-yellow)", "var(--sticker-cyan)", "var(--sticker-pink)", "var(--sticker-lime)", "var(--flame-500)", "var(--sticker-purple)"];
  const bits = useMemo(() => Array.from({
    length: count
  }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    dur: 1.6 + Math.random() * 1.4,
    size: 8 + Math.random() * 10,
    color: colors[i % colors.length],
    round: Math.random() > 0.5,
    rot: Math.random() * 360
  })), [count]);
  if (!active || prefersReduce) return null;
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 60,
      ...style
    }
  }, bits.map((b, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      top: 0,
      left: `${b.left}%`,
      width: b.size,
      height: b.size * (b.round ? 1 : 0.5),
      background: b.color,
      borderRadius: b.round ? "50%" : "2px",
      transform: `rotate(${b.rot}deg)`,
      animation: `rmr-confetti-fall ${b.dur}s var(--ease-in) ${b.delay}s forwards`
    }
  })));
}
Object.assign(__ds_scope, { Confetti });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Confetti.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Sheet.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Sheet — bouncy bottom sheet / modal. Clean content; the mascot may host
 * the header. Scrim never blocks the close affordance.
 */
function Sheet({
  open = true,
  title,
  header = null,
  // optional node (e.g. <Mascot/>) hosting the header
  onClose,
  children,
  primaryAction = null,
  // node, usually a <Button block>
  style,
  ...rest
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(34,20,3,0.45)",
      backdropFilter: "blur(2px)"
    }
  }), /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      background: "var(--surface)",
      borderTopLeftRadius: "var(--radius-sheet)",
      borderTopRightRadius: "var(--radius-sheet)",
      boxShadow: "var(--elev-4)",
      padding: "var(--space-6)",
      paddingTop: header ? "var(--space-8)" : "var(--space-6)",
      animation: "rmr-pop-in var(--dur-4) var(--ease-spring) both",
      maxHeight: "92%",
      overflowY: "auto",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 5,
      borderRadius: 999,
      background: "var(--hairline)",
      margin: "0 auto var(--space-4)"
    }
  }), header && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -52,
      left: "50%",
      transform: "translateX(-50%)"
    }
  }, header), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-d3)",
      color: "var(--ink)",
      margin: "0 0 var(--space-3)",
      textAlign: "center"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-body)"
    }
  }, children), primaryAction && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-6)"
    }
  }, primaryAction)));
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Toast — compact, bouncy status message. Functional layer: AA contrast,
 * readable companion font, sticker shadow for personality.
 */
function Toast({
  tone = "ink",
  icon = null,
  children,
  style,
  ...rest
}) {
  const tones = {
    ink: {
      bg: "var(--ink)",
      fg: "var(--canvas)"
    },
    success: {
      bg: "var(--success)",
      fg: "#FFFFFF"
    },
    danger: {
      bg: "var(--danger)",
      fg: "#FFFFFF"
    },
    flame: {
      bg: "var(--flame-500)",
      fg: "var(--ink)"
    }
  }[tone] || {};
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 18px",
      borderRadius: "var(--radius-pill)",
      background: tones.bg,
      color: tones.fg,
      font: "var(--type-sm)",
      fontWeight: 600,
      boxShadow: "var(--elev-3)",
      animation: "rmr-pop-in var(--dur-4) var(--ease-spring) both",
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/mascot/Mascot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Callie — the mascot of CALLIE'S UNIVERSE and the face of every app in it.
 * A kawaii, squishy CALICO cat (cream + ginger + charcoal coat — the same coat
 * the brand palette is derived from). One character, reused everywhere via a
 * named STATE SYSTEM. PURELY PRESENTATIONAL.
 *
 * Callie REACTS, she never narrates — she's the wordless emotional surrogate
 * (no localization, ever). The character CAST does the talking.
 *
 * Nine canonical states: idle, curious, cooking, delighted, savage, comfort,
 * celebrating, empty, error. Swappable PLACEHOLDER art keyed to those names.
 *
 * Exported as `Callie`/`CallieHost` (preferred) and `Mascot`/`MascotHost`
 * (legacy aliases — same art).
 */

const EMOTES = {
  idle: {
    ears: "up",
    eye: "dot",
    mouth: "smile",
    paws: "down",
    extra: null,
    anim: "idle"
  },
  curious: {
    ears: "alert",
    eye: "look",
    mouth: "tiny",
    paws: "down",
    extra: null,
    anim: "idle",
    tilt: -4
  },
  cooking: {
    ears: "up",
    eye: "look",
    mouth: "ooh",
    paws: "rub",
    extra: "steam",
    anim: "cook"
  },
  delighted: {
    ears: "up",
    eye: "happy",
    mouth: "grin",
    paws: "down",
    extra: "sparkle",
    anim: "bob"
  },
  savage: {
    ears: "up",
    eye: "laugh",
    mouth: "laugh",
    paws: "up",
    extra: "tear",
    anim: "jiggle"
  },
  comfort: {
    ears: "side",
    eye: "closed",
    mouth: "smile",
    paws: "cheek",
    extra: null,
    anim: "idle",
    blush: true
  },
  celebrating: {
    ears: "alert",
    eye: "happy",
    mouth: "wide",
    paws: "cheer",
    extra: "sparkle",
    anim: "bob"
  },
  empty: {
    ears: "side",
    eye: "side",
    mouth: "line",
    paws: "down",
    extra: null,
    anim: "none",
    tilt: -6
  },
  error: {
    ears: "side",
    eye: "wide",
    mouth: "o",
    paws: "cheek",
    extra: "sweat",
    anim: "none"
  }
};
function Mascot({
  state = "idle",
  size = 160,
  accessory = true,
  placeholderTag = false,
  reduceMotion = false,
  style,
  ...rest
}) {
  const cfg = EMOTES[state] || EMOTES.idle;
  const anim = reduceMotion ? "none" : {
    idle: "rmr-squish-idle 3.4s var(--ease-out) infinite",
    cook: "rmr-cook-pulse 1.4s var(--ease-out) infinite",
    bob: "rmr-bob 2.6s var(--ease-out) infinite",
    jiggle: "rmr-jiggle 0.9s var(--ease-out) infinite",
    none: "none"
  }[cfg.anim || "idle"];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      animation: anim,
      ...style
    },
    "data-callie-state": state,
    "aria-label": `Callie (${state})`,
    role: "img"
  }, rest), /*#__PURE__*/React.createElement(Cat, {
    cfg: cfg,
    accessory: accessory,
    reduceMotion: reduceMotion
  }), placeholderTag && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: -4,
      left: "50%",
      transform: "translateX(-50%)",
      font: "var(--type-legal)",
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--on-ember)",
      background: "var(--ink)",
      padding: "2px 8px",
      borderRadius: "var(--radius-pill)",
      whiteSpace: "nowrap",
      boxShadow: "var(--shadow-sticker)"
    }
  }, "Placeholder"));
}
/** Preferred name. Renders Callie (identical to <Mascot>). */
function Callie(props) {
  return /*#__PURE__*/React.createElement(Mascot, props);
}

/* ---- calico coat colors (FIXED — Callie is the same in every app) ---- */
const CREAM = "#FFF3E6",
  GINGER = "#E8843C",
  CHAR = "#3A332E",
  OUT = "#3A2208",
  PINK = "#FF8FA8",
  FACE = "#3A2420";
const BODY = "M100 46 C150 46 166 86 164 122 C162 168 134 192 100 192 C66 192 38 168 36 122 C34 86 50 46 100 46 Z";
const BLINK_EYES = ["dot", "look", "wide", "side"];
function Cat({
  cfg,
  accessory,
  reduceMotion
}) {
  const canBlink = !reduceMotion && BLINK_EYES.includes(cfg.eye);
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "100%",
    height: "100%",
    style: {
      overflow: "visible"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "callie-clip"
  }, /*#__PURE__*/React.createElement("path", {
    d: BODY
  }))), /*#__PURE__*/React.createElement("ellipse", {
    cx: "100",
    cy: "194",
    rx: "54",
    ry: "9",
    fill: "rgba(34,20,3,0.13)"
  }), /*#__PURE__*/React.createElement("g", {
    transform: `rotate(${cfg.tilt || 0} 100 120)`,
    style: {
      transformOrigin: "100px 120px"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M158 162 C190 160 198 118 178 108 C170 104 161 112 169 122 C178 132 170 148 152 148 Z",
    fill: GINGER,
    stroke: OUT,
    strokeWidth: "4.5",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M178 108 C190 112 192 126 184 132 C176 126 172 114 178 108 Z",
    fill: CHAR
  }), /*#__PURE__*/React.createElement(Ears, {
    kind: cfg.ears
  }), /*#__PURE__*/React.createElement("path", {
    d: BODY,
    fill: CREAM,
    stroke: OUT,
    strokeWidth: "5",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#callie-clip)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M30 40 C70 30 92 44 86 78 C82 100 40 104 30 92 Z",
    fill: GINGER
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "142",
    cy: "58",
    rx: "34",
    ry: "30",
    transform: "rotate(10 142 58)",
    fill: CHAR
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "150",
    cy: "156",
    rx: "30",
    ry: "26",
    fill: GINGER
  })), /*#__PURE__*/React.createElement(Paws, {
    kind: cfg.paws
  }), cfg.blush && /*#__PURE__*/React.createElement("g", {
    fill: PINK,
    opacity: "0.55"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "62",
    cy: "128",
    rx: "11",
    ry: "6.5"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "138",
    cy: "128",
    rx: "11",
    ry: "6.5"
  })), /*#__PURE__*/React.createElement("g", {
    style: canBlink ? {
      transformBox: "fill-box",
      transformOrigin: "center",
      animation: "rmr-blink 4.4s var(--ease-out) infinite"
    } : undefined
  }, /*#__PURE__*/React.createElement(Eyes, {
    kind: cfg.eye
  })), /*#__PURE__*/React.createElement(Nose, null), /*#__PURE__*/React.createElement(Mouth, {
    kind: cfg.mouth
  })), accessory && /*#__PURE__*/React.createElement(Extra, {
    kind: cfg.extra,
    reduceMotion: reduceMotion
  }));
}
function Ears({
  kind
}) {
  // calico asymmetry: left ear ginger, right ear charcoal
  if (kind === "side") return /*#__PURE__*/React.createElement("g", {
    stroke: OUT,
    strokeWidth: "4.5",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M50 60 C24 60 16 70 32 74 C50 78 76 60 84 54 Z",
    fill: GINGER
  }), /*#__PURE__*/React.createElement("path", {
    d: "M150 60 C176 60 184 70 168 74 C150 78 124 60 116 54 Z",
    fill: CHAR
  }));
  const tall = kind === "alert";
  const L = tall ? "M44 56 C36 14 48 6 60 24 C70 38 82 50 88 58 Z" : "M46 58 C40 22 50 12 62 26 C72 36 82 50 88 58 Z";
  const R = tall ? "M156 56 C164 14 152 6 140 24 C130 38 118 50 112 58 Z" : "M154 58 C160 22 150 12 138 26 C128 36 118 50 112 58 Z";
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: L,
    fill: GINGER,
    stroke: OUT,
    strokeWidth: "4.5",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: R,
    fill: CHAR,
    stroke: OUT,
    strokeWidth: "4.5",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M56 50 C53 32 59 26 67 38 C73 45 77 50 80 54 Z",
    fill: PINK
  }));
}
function Paws({
  kind
}) {
  const p = (cx, cy, k) => /*#__PURE__*/React.createElement("ellipse", {
    key: k,
    cx: cx,
    cy: cy,
    rx: "14",
    ry: "10",
    fill: CREAM,
    stroke: OUT,
    strokeWidth: "4.5"
  });
  const map = {
    down: [[80, 184], [120, 184]],
    up: [[48, 138], [152, 138]],
    cheer: [[44, 92], [156, 92]],
    cheek: [[58, 118], [142, 118]],
    rub: [[86, 150], [114, 150]]
  };
  return /*#__PURE__*/React.createElement("g", null, (map[kind] || map.down).map((c, i) => p(c[0], c[1], i)));
}
function hi(cx, cy) {
  return /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "2.6",
    fill: "#fff"
  });
}
function Eyes({
  kind
}) {
  const L = 82,
    R = 118,
    y = 115;
  if (kind === "happy" || kind === "laugh") return /*#__PURE__*/React.createElement("g", {
    stroke: FACE,
    strokeWidth: "5.5",
    strokeLinecap: "round",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M70 116 Q82 106 94 116"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M106 116 Q118 106 130 116"
  }));
  if (kind === "closed") return /*#__PURE__*/React.createElement("g", {
    stroke: FACE,
    strokeWidth: "5",
    strokeLinecap: "round",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M70 114 Q82 122 94 114"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M106 114 Q118 122 130 114"
  }));
  if (kind === "wide") return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
    cx: L,
    cy: y,
    rx: "8.5",
    ry: "11",
    fill: FACE
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: R,
    cy: y,
    rx: "8.5",
    ry: "11",
    fill: FACE
  }), hi(84.5, 111), hi(120.5, 111));
  if (kind === "side") return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
    cx: "86",
    cy: y,
    rx: "6.5",
    ry: "9",
    fill: FACE
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "122",
    cy: y,
    rx: "6.5",
    ry: "9",
    fill: FACE
  }), hi(88.5, 112), hi(124.5, 112));
  if (kind === "look") return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
    cx: L,
    cy: "112",
    rx: "6.5",
    ry: "9.5",
    fill: FACE
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: R,
    cy: "112",
    rx: "6.5",
    ry: "9.5",
    fill: FACE
  }), hi(84, 108), hi(120, 108));
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
    cx: L,
    cy: y,
    rx: "6.5",
    ry: "9.5",
    fill: FACE
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: R,
    cy: y,
    rx: "6.5",
    ry: "9.5",
    fill: FACE
  }), hi(84.5, 111), hi(120.5, 111));
}
function Nose() {
  return /*#__PURE__*/React.createElement("path", {
    d: "M96 124 L104 124 L100 130 Z",
    fill: OUT
  });
}
function Mouth({
  kind
}) {
  const s = FACE;
  if (kind === "laugh") return /*#__PURE__*/React.createElement("path", {
    d: "M84 132 Q100 152 116 132 Q100 140 84 132 Z",
    fill: "#C7340F",
    stroke: s,
    strokeWidth: "3"
  });
  if (kind === "grin") return /*#__PURE__*/React.createElement("path", {
    d: "M86 132 Q100 146 114 132",
    fill: "none",
    stroke: s,
    strokeWidth: "4.5",
    strokeLinecap: "round"
  });
  if (kind === "wide") return /*#__PURE__*/React.createElement("path", {
    d: "M82 131 Q100 150 118 131",
    fill: "none",
    stroke: s,
    strokeWidth: "4.5",
    strokeLinecap: "round"
  });
  if (kind === "smile") return /*#__PURE__*/React.createElement("path", {
    d: "M92 131 Q100 139 108 131",
    fill: "none",
    stroke: s,
    strokeWidth: "4",
    strokeLinecap: "round"
  });
  if (kind === "ooh") return /*#__PURE__*/React.createElement("ellipse", {
    cx: "100",
    cy: "134",
    rx: "5.5",
    ry: "7",
    fill: "#C7340F",
    stroke: s,
    strokeWidth: "2.5"
  });
  if (kind === "o") return /*#__PURE__*/React.createElement("ellipse", {
    cx: "100",
    cy: "134",
    rx: "6",
    ry: "7.5",
    fill: "#C7340F",
    stroke: s,
    strokeWidth: "2.5"
  });
  if (kind === "tiny") return /*#__PURE__*/React.createElement("path", {
    d: "M94 132 Q100 137 106 132",
    fill: "none",
    stroke: s,
    strokeWidth: "3.5",
    strokeLinecap: "round"
  });
  return /*#__PURE__*/React.createElement("line", {
    x1: "93",
    y1: "132",
    x2: "107",
    y2: "132",
    stroke: s,
    strokeWidth: "3.5",
    strokeLinecap: "round"
  });
}
function Extra({
  kind,
  reduceMotion
}) {
  const f = d => reduceMotion ? {} : {
    animation: `rmr-float 2.2s var(--ease-out) ${d}s infinite`
  };
  if (kind === "sparkle") return /*#__PURE__*/React.createElement("g", {
    fill: "var(--sticker-yellow)",
    stroke: OUT,
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M40 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z",
    style: f(0)
  }), /*#__PURE__*/React.createElement("path", {
    d: "M164 74 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 z",
    style: f(0.6)
  }));
  if (kind === "steam") return /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "#fff",
    strokeWidth: "4",
    strokeLinecap: "round",
    opacity: "0.9"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M148 56 q-6 -8 0 -16",
    style: f(0)
  }), /*#__PURE__*/React.createElement("path", {
    d: "M162 62 q-6 -8 0 -16",
    style: f(0.5)
  }));
  if (kind === "tear") return /*#__PURE__*/React.createElement("ellipse", {
    cx: "68",
    cy: "120",
    rx: "4.5",
    ry: "6",
    fill: "var(--pop-cyan)",
    stroke: "#0A6E9E",
    strokeWidth: "1.5"
  });
  if (kind === "sweat") return /*#__PURE__*/React.createElement("path", {
    d: "M150 72 C150 82 142 86 142 78 C142 72 150 62 150 72 Z",
    fill: "var(--pop-cyan)",
    stroke: "#0A6E9E",
    strokeWidth: "2"
  });
  return null;
}

/* ============================================================
   Callie's BRAIN — script DATA + <CallieHost>/<MascotHost> behavior layer.
   Edit CALLIE_SCRIPT to tune her personality per app/screen.
   ============================================================ */
const RARE_IDLE = ["curious", "comfort"];
const GLOBAL_IDLE = ["idle", "curious", "comfort"];
const CALLIE_SCRIPT = {
  onboarding: {
    enter: "delighted",
    idle: ["idle", "curious", "delighted"],
    tips: ["Hi! I'm Callie. I don't roast you — I just watch and react 😺", "Tap the button and let's go."]
  },
  home: {
    enter: "delighted",
    idle: ["idle", "curious", "comfort"],
    react: {
      upload: "celebrating"
    },
    tips: ["Drop a pic of your ride and I'll do the rest 🐾", "Front three-quarter angle hits hardest, just sayin'."]
  },
  seasoning: {
    enter: "curious",
    idle: ["curious", "comfort", "idle"],
    react: {
      added: "delighted"
    },
    tips: ["A selfie makes it personal — totally optional.", "Pinky promise it's just you."]
  },
  cast: {
    enter: "delighted",
    idle: ["delighted", "curious", "idle"],
    tips: ["Tap a roaster to hear them warm up.", "They all aim at the car, never at you."]
  },
  roaster: {
    enter: "delighted",
    idle: ["delighted", "curious", "idle"],
    tips: ["Tap a roaster to hear them warm up."]
  },
  cooking: {
    enter: "cooking",
    idle: ["cooking", "curious", "delighted"],
    tips: ["Ooh, this one's gonna be good…", "Almost plated 👨‍🍳"]
  },
  reveal: {
    enter: "savage",
    idle: ["savage", "delighted", "celebrating"],
    tips: ["Screenshot this. Trust me.", "Hit share before you chicken out 😼"]
  },
  celebrate: {
    enter: "celebrating",
    idle: ["celebrating", "delighted"],
    tips: ["Tag us and we'll re-share the best ones!", "One down. Roast another?"]
  },
  paywall: {
    enter: "comfort",
    idle: ["comfort", "curious", "idle"],
    react: {
      buy: "celebrating"
    },
    tips: ["The 5-pack is the move, honestly.", "No subscription. One-time. Promise. 🙏"]
  },
  settings: {
    enter: "comfort",
    idle: ["idle", "comfort"],
    tips: ["Turn on reduce-motion if I'm too hyper."]
  },
  call: {
    enter: "curious",
    idle: ["curious", "comfort", "idle"],
    react: {
      answer: "delighted",
      decline: "comfort"
    },
    tips: ["Someone's calling… wanna pick up?", "It's always a friendly voice."]
  },
  empty: {
    enter: "empty",
    idle: ["empty", "comfort"],
    tips: ["Nothing here yet — let's fix that."]
  },
  error: {
    enter: "error",
    idle: ["error", "comfort"],
    tips: ["My bad. Give it another go?"]
  }
};
function hostPick(pool, prevRef) {
  if (!pool || !pool.length) return "idle";
  let next = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1 && next === prevRef.current) next = pool[(pool.indexOf(next) + 1) % pool.length];
  prevRef.current = next;
  return next;
}
function MascotHost({
  context = "home",
  event = null,
  size = 120,
  bubble = false,
  bubblePlacement = "top",
  reduceMotion = false,
  style,
  ...rest
}) {
  const cfg = CALLIE_SCRIPT[context] || {};
  const [emote, setEmote] = React.useState(cfg.enter || "idle");
  const [tip, setTip] = React.useState(null);
  const [tipDismissed, setTipDismissed] = React.useState(false);
  const prev = React.useRef("");
  const prefersReduce = reduceMotion || typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  React.useEffect(() => {
    setEmote(cfg.enter || "idle");
    setTipDismissed(false);
    setTip(null);
    const pool = cfg.idle && cfg.idle.length ? cfg.idle : GLOBAL_IDLE;
    const settle = setTimeout(() => setEmote(hostPick(pool, prev)), 1300);
    const tick = () => setEmote(hostPick(Math.random() < 0.16 ? RARE_IDLE : pool, prev));
    const interval = setInterval(tick, prefersReduce ? 6000 : 3200 + Math.random() * 1600);
    return () => {
      clearTimeout(settle);
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [context]);
  React.useEffect(() => {
    if (!event) return;
    const react = (cfg.react || {})[event];
    if (!react) return;
    setEmote(react);
    const pool = cfg.idle && cfg.idle.length ? cfg.idle : GLOBAL_IDLE;
    const t = setTimeout(() => setEmote(hostPick(pool, prev)), 2600);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [event]);
  React.useEffect(() => {
    if (!bubble || tipDismissed || !(cfg.tips && cfg.tips.length)) {
      setTip(null);
      return;
    }
    let i = 0;
    const show = setTimeout(() => setTip(cfg.tips[0]), 2600);
    const rotate = setInterval(() => {
      i = (i + 1) % cfg.tips.length;
      setTip(cfg.tips[i]);
    }, 7000);
    return () => {
      clearTimeout(show);
      clearInterval(rotate);
    };
    // eslint-disable-next-line
  }, [context, bubble, tipDismissed]);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      display: "inline-flex",
      ...style
    }
  }, rest), bubble && tip && /*#__PURE__*/React.createElement(TipBubble, {
    placement: bubblePlacement,
    onClose: () => setTipDismissed(true)
  }, tip), /*#__PURE__*/React.createElement(Mascot, {
    state: emote,
    size: size,
    reduceMotion: prefersReduce
  }));
}
/** Preferred name. Same behavior as <MascotHost>. */
function CallieHost(props) {
  return /*#__PURE__*/React.createElement(MascotHost, props);
}
function TipBubble({
  children,
  placement,
  onClose
}) {
  const pos = {
    top: {
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginBottom: 10
    },
    right: {
      left: "100%",
      top: "10%",
      marginLeft: 10
    },
    left: {
      right: "100%",
      top: "10%",
      marginRight: 10
    }
  }[placement] || {};
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      position: "absolute",
      zIndex: 5,
      ...pos,
      width: "max-content",
      maxWidth: 230,
      background: "var(--surface)",
      color: "var(--ink)",
      border: "2px solid var(--ink)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sticker)",
      padding: "10px 30px 10px 14px",
      font: "var(--type-sm)",
      fontWeight: 600,
      lineHeight: 1.35,
      animation: "rmr-pop-in var(--dur-3) var(--ease-spring) both"
    }
  }, children, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss tip",
    style: {
      position: "absolute",
      top: 6,
      right: 6,
      width: 20,
      height: 20,
      lineHeight: "16px",
      borderRadius: "var(--radius-pill)",
      border: "none",
      cursor: "pointer",
      background: "var(--canvas-sink)",
      color: "var(--ink-soft)",
      font: "var(--type-cap)",
      fontWeight: 800
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Mascot, Callie, MascotHost, CallieHost });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/mascot/Mascot.jsx", error: String((e && e.message) || e) }); }

// components/share/CreditTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * CreditTile — a collectible, sticker-ish credit bundle for the paywall.
 * Playful but clear: obvious value and price, "best value" flag.
 */
function CreditTile({
  credits,
  price,
  perRoast,
  best = false,
  selected = false,
  onSelect,
  style,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-pressed": selected,
    onClick: onSelect,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      position: "relative",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      minWidth: 140,
      padding: "18px 18px 16px",
      borderRadius: "var(--radius-lg)",
      border: `3px solid ${selected ? "var(--ember-600)" : "var(--hairline)"}`,
      background: best ? "linear-gradient(180deg,#FFF3E2,#FFE6CC)" : "var(--surface)",
      boxShadow: selected ? "var(--gloss-primary)" : "var(--gloss-card)",
      transform: pressed ? "scale(var(--press-scale))" : selected ? "scale(1.02)" : "scale(1)",
      transition: "transform var(--dur-1) var(--ease-spring), border-color var(--dur-2)",
      cursor: "pointer",
      WebkitTapHighlightColor: "transparent",
      ...style
    }
  }, rest), best && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -12,
      right: 12,
      background: "var(--pop-pink)",
      color: "#fff",
      font: "var(--type-legal)",
      fontWeight: 800,
      letterSpacing: "0.04em",
      padding: "4px 10px",
      borderRadius: "var(--radius-pill)",
      transform: "rotate(6deg)",
      boxShadow: "var(--shadow-sticker)"
    }
  }, "BEST VALUE"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: 28
    }
  }, "\uD83C\uDF9F\uFE0F"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-d3)",
      color: "var(--ink)",
      lineHeight: 1
    }
  }, credits, " roasts"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body)",
      fontWeight: 700,
      color: "var(--ember-600)"
    }
  }, price), perRoast && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      color: "var(--text-muted)"
    }
  }, perRoast, " each"));
}
Object.assign(__ds_scope, { CreditTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/share/CreditTile.jsx", error: String((e && e.message) || e) }); }

// components/share/ShareCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ShareCard — the signature output frame: the still/video card that IS the
 * social content. Brand caption style, mascot tag, watermark, punch-word
 * highlight. Built 9:16-friendly; clean legible roast over an authored frame.
 */
function ShareCard({
  roast,
  // string OR array of {text, punch?:true} segments
  mascot = null,
  // a <Mascot/> node — Callie REACTING in the corner (never the author)
  roasterName = "Ms. Burnt",
  // the VOICE persona that delivered the roast (not the cat)
  spice = "savage",
  // "mild" | "savage"
  width = 300,
  watermark = "RoastMyRide",
  style,
  ...rest
}) {
  const segments = Array.isArray(roast) ? roast : [{
    text: roast
  }];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      width,
      aspectRatio: "9 / 16",
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      background: "radial-gradient(120% 90% at 30% 0%, #FFB877 0%, #FF6A1A 45%, #C7340F 100%)",
      boxShadow: "var(--elev-4)",
      color: "var(--on-ember)",
      display: "flex",
      flexDirection: "column",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      opacity: 0.18,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, #fff 2px, transparent 2.5px)",
      backgroundSize: "26px 26px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "16px 18px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-cap)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      background: "rgba(34,20,3,0.35)",
      padding: "5px 12px",
      borderRadius: "var(--radius-pill)"
    }
  }, "\uD83D\uDD25 ", roasterName, " \xB7 ", spice)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      padding: "8px 22px 0"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-d2)",
      fontSize: "30px",
      lineHeight: 1.12,
      margin: 0,
      textWrap: "balance",
      textShadow: "0 2px 0 rgba(120,30,0,0.45)"
    }
  }, segments.map((s, i) => s.punch ? /*#__PURE__*/React.createElement("mark", {
    key: i,
    style: {
      background: "var(--sticker-yellow)",
      color: "var(--ink)",
      padding: "0 6px",
      borderRadius: "8px",
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone"
    }
  }, s.text) : /*#__PURE__*/React.createElement("span", {
    key: i
  }, s.text)))), mascot && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 6,
      bottom: 40
    }
  }, mascot), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px 16px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      font: "var(--type-cap)",
      fontWeight: 700,
      opacity: 0.95
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      width: 18,
      height: 18,
      borderRadius: 6,
      background: "var(--ink)",
      color: "var(--flame-500)",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12
    }
  }, "R"), watermark));
}
Object.assign(__ds_scope, { ShareCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/share/ShareCard.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CastPicker = __ds_scope.CastPicker;

__ds_ns.Roaster = __ds_scope.Roaster;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Confetti = __ds_scope.Confetti;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Mascot = __ds_scope.Mascot;

__ds_ns.Callie = __ds_scope.Callie;

__ds_ns.MascotHost = __ds_scope.MascotHost;

__ds_ns.CallieHost = __ds_scope.CallieHost;

__ds_ns.CreditTile = __ds_scope.CreditTile;

__ds_ns.ShareCard = __ds_scope.ShareCard;

})();
