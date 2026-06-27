import React, { useState, useImperativeHandle, forwardRef } from "react";

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
  idle:        { ears: "up",    eye: "dot",    mouth: "smile", paws: "down",  extra: null,      anim: "idle" },
  curious:     { ears: "alert", eye: "look",   mouth: "tiny",  paws: "down",  extra: null,      anim: "idle",  tilt: -4 },
  cooking:     { ears: "up",    eye: "look",   mouth: "ooh",   paws: "rub",   extra: "steam",   anim: "cook" },
  delighted:   { ears: "up",    eye: "happy",  mouth: "grin",  paws: "down",  extra: "sparkle", anim: "bob" },
  savage:      { ears: "up",    eye: "laugh",  mouth: "laugh", paws: "up",    extra: "tear",    anim: "jiggle" },
  comfort:     { ears: "side",  eye: "closed", mouth: "smile", paws: "cheek", extra: null,      anim: "idle",  blush: true },
  celebrating: { ears: "alert", eye: "happy",  mouth: "wide",  paws: "cheer", extra: "sparkle", anim: "bob" },
  empty:       { ears: "side",  eye: "side",   mouth: "line",  paws: "down",  extra: null,      anim: "none",  tilt: -6 },
  error:       { ears: "side",  eye: "wide",   mouth: "o",     paws: "cheek", extra: "sweat",   anim: "none" },
};

export function Mascot({
  state = "idle", size = 160, accessory = true, placeholderTag = false,
  reduceMotion = false, style, ...rest
}) {
  const cfg = EMOTES[state] || EMOTES.idle;
  const anim = reduceMotion ? "none" : ({
    idle:   "rmr-squish-idle 3.4s var(--ease-out) infinite",
    cook:   "rmr-cook-pulse 1.4s var(--ease-out) infinite",
    bob:    "rmr-bob 2.6s var(--ease-out) infinite",
    jiggle: "rmr-jiggle 0.9s var(--ease-out) infinite",
    none:   "none",
  })[cfg.anim || "idle"];
  return (
    <div style={{ position:"relative", width:size, height:size, display:"inline-flex",
      alignItems:"center", justifyContent:"center", animation:anim, ...style }}
      data-callie-state={state} aria-label={`Callie (${state})`} role="img" {...rest}>
      <Cat cfg={cfg} accessory={accessory} reduceMotion={reduceMotion} />
      {placeholderTag && (
        <span style={{ position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)",
          font:"var(--type-legal)", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase",
          color:"var(--on-ember)", background:"var(--ink)", padding:"2px 8px",
          borderRadius:"var(--radius-pill)", whiteSpace:"nowrap", boxShadow:"var(--shadow-sticker)" }}>Placeholder</span>
      )}
    </div>
  );
}
/** Preferred name. Renders Callie (identical to <Mascot>). */
export function Callie(props) { return <Mascot {...props} />; }

/**
 * CallieStage — the trivial IMPERATIVE wrapper the handoff describes.
 * Keeps <Callie> purely presentational while exposing `callie.setState('savage')`
 * over the same nine state names. Drive it via a ref:
 *
 *   const callie = useRef(null);
 *   <CallieStage ref={callie} initialState="idle" size={140} />
 *   callie.current.setState("savage");   // by name, any of the 9 states
 */
export const CallieStage = forwardRef(function CallieStage(
  { initialState = "idle", ...props }, ref
) {
  const [state, setState] = useState(initialState);
  useImperativeHandle(ref, () => ({
    setState: (next) => setState(next),
    getState: () => state,
  }), [state]);
  return <Callie state={state} {...props} />;
});

/* ---- calico coat colors (FIXED — Callie is the same in every app) ---- */
const CREAM = "#FFF3E6", GINGER = "#E8843C", CHAR = "#3A332E", OUT = "#3A2208", PINK = "#FF8FA8", FACE = "#3A2420";
const BODY = "M100 46 C150 46 166 86 164 122 C162 168 134 192 100 192 C66 192 38 168 36 122 C34 86 50 46 100 46 Z";
const BLINK_EYES = ["dot", "look", "wide", "side"];

function Cat({ cfg, accessory, reduceMotion }) {
  const canBlink = !reduceMotion && BLINK_EYES.includes(cfg.eye);
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow:"visible" }}>
      <defs><clipPath id="callie-clip"><path d={BODY} /></clipPath></defs>
      <ellipse cx="100" cy="194" rx="54" ry="9" fill="rgba(34,20,3,0.13)" />
      <g transform={`rotate(${cfg.tilt||0} 100 120)`} style={{ transformOrigin:"100px 120px" }}>
        {/* tail — ginger w/ charcoal tip */}
        <path d="M158 162 C190 160 198 118 178 108 C170 104 161 112 169 122 C178 132 170 148 152 148 Z" fill={GINGER} stroke={OUT} strokeWidth="4.5" strokeLinejoin="round" />
        <path d="M178 108 C190 112 192 126 184 132 C176 126 172 114 178 108 Z" fill={CHAR} />
        <Ears kind={cfg.ears} />
        {/* cream body */}
        <path d={BODY} fill={CREAM} stroke={OUT} strokeWidth="5" strokeLinejoin="round" />
        {/* calico patches (clipped) */}
        <g clipPath="url(#callie-clip)">
          <path d="M30 40 C70 30 92 44 86 78 C82 100 40 104 30 92 Z" fill={GINGER} />
          <ellipse cx="142" cy="58" rx="34" ry="30" transform="rotate(10 142 58)" fill={CHAR} />
          <ellipse cx="150" cy="156" rx="30" ry="26" fill={GINGER} />
        </g>
        <Paws kind={cfg.paws} />
        {cfg.blush && (<g fill={PINK} opacity="0.55"><ellipse cx="62" cy="128" rx="11" ry="6.5" /><ellipse cx="138" cy="128" rx="11" ry="6.5" /></g>)}
        <g style={canBlink ? { transformBox:"fill-box", transformOrigin:"center", animation:"rmr-blink 4.4s var(--ease-out) infinite" } : undefined}>
          <Eyes kind={cfg.eye} />
        </g>
        <Nose /><Mouth kind={cfg.mouth} />
      </g>
      {accessory && <Extra kind={cfg.extra} reduceMotion={reduceMotion} />}
    </svg>
  );
}

function Ears({ kind }) {
  // calico asymmetry: left ear ginger, right ear charcoal
  if (kind === "side") return (
    <g stroke={OUT} strokeWidth="4.5" strokeLinejoin="round">
      <path d="M50 60 C24 60 16 70 32 74 C50 78 76 60 84 54 Z" fill={GINGER} />
      <path d="M150 60 C176 60 184 70 168 74 C150 78 124 60 116 54 Z" fill={CHAR} /></g>
  );
  const tall = kind === "alert";
  const L = tall ? "M44 56 C36 14 48 6 60 24 C70 38 82 50 88 58 Z" : "M46 58 C40 22 50 12 62 26 C72 36 82 50 88 58 Z";
  const R = tall ? "M156 56 C164 14 152 6 140 24 C130 38 118 50 112 58 Z" : "M154 58 C160 22 150 12 138 26 C128 36 118 50 112 58 Z";
  return (
    <g>
      <path d={L} fill={GINGER} stroke={OUT} strokeWidth="4.5" strokeLinejoin="round" />
      <path d={R} fill={CHAR} stroke={OUT} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M56 50 C53 32 59 26 67 38 C73 45 77 50 80 54 Z" fill={PINK} />
    </g>
  );
}

function Paws({ kind }) {
  const p = (cx,cy,k) => <ellipse key={k} cx={cx} cy={cy} rx="14" ry="10" fill={CREAM} stroke={OUT} strokeWidth="4.5" />;
  const map = { down:[[80,184],[120,184]], up:[[48,138],[152,138]], cheer:[[44,92],[156,92]], cheek:[[58,118],[142,118]], rub:[[86,150],[114,150]] };
  return <g>{(map[kind]||map.down).map((c,i)=>p(c[0],c[1],i))}</g>;
}

function hi(cx,cy){ return <circle cx={cx} cy={cy} r="2.6" fill="#fff" />; }
function Eyes({ kind }) {
  const L=82, R=118, y=115;
  if (kind === "happy" || kind === "laugh") return (<g stroke={FACE} strokeWidth="5.5" strokeLinecap="round" fill="none"><path d="M70 116 Q82 106 94 116" /><path d="M106 116 Q118 106 130 116" /></g>);
  if (kind === "closed") return (<g stroke={FACE} strokeWidth="5" strokeLinecap="round" fill="none"><path d="M70 114 Q82 122 94 114" /><path d="M106 114 Q118 122 130 114" /></g>);
  if (kind === "wide") return (<g><ellipse cx={L} cy={y} rx="8.5" ry="11" fill={FACE} /><ellipse cx={R} cy={y} rx="8.5" ry="11" fill={FACE} />{hi(84.5,111)}{hi(120.5,111)}</g>);
  if (kind === "side") return (<g><ellipse cx="86" cy={y} rx="6.5" ry="9" fill={FACE} /><ellipse cx="122" cy={y} rx="6.5" ry="9" fill={FACE} />{hi(88.5,112)}{hi(124.5,112)}</g>);
  if (kind === "look") return (<g><ellipse cx={L} cy="112" rx="6.5" ry="9.5" fill={FACE} /><ellipse cx={R} cy="112" rx="6.5" ry="9.5" fill={FACE} />{hi(84,108)}{hi(120,108)}</g>);
  return (<g><ellipse cx={L} cy={y} rx="6.5" ry="9.5" fill={FACE} /><ellipse cx={R} cy={y} rx="6.5" ry="9.5" fill={FACE} />{hi(84.5,111)}{hi(120.5,111)}</g>);
}
function Nose(){ return <path d="M96 124 L104 124 L100 130 Z" fill={OUT} />; }
function Mouth({ kind }) {
  const s=FACE;
  if (kind === "laugh") return <path d="M84 132 Q100 152 116 132 Q100 140 84 132 Z" fill="#C7340F" stroke={s} strokeWidth="3" />;
  if (kind === "grin") return <path d="M86 132 Q100 146 114 132" fill="none" stroke={s} strokeWidth="4.5" strokeLinecap="round" />;
  if (kind === "wide") return <path d="M82 131 Q100 150 118 131" fill="none" stroke={s} strokeWidth="4.5" strokeLinecap="round" />;
  if (kind === "smile") return <path d="M92 131 Q100 139 108 131" fill="none" stroke={s} strokeWidth="4" strokeLinecap="round" />;
  if (kind === "ooh") return <ellipse cx="100" cy="134" rx="5.5" ry="7" fill="#C7340F" stroke={s} strokeWidth="2.5" />;
  if (kind === "o") return <ellipse cx="100" cy="134" rx="6" ry="7.5" fill="#C7340F" stroke={s} strokeWidth="2.5" />;
  if (kind === "tiny") return <path d="M94 132 Q100 137 106 132" fill="none" stroke={s} strokeWidth="3.5" strokeLinecap="round" />;
  return <line x1="93" y1="132" x2="107" y2="132" stroke={s} strokeWidth="3.5" strokeLinecap="round" />;
}
function Extra({ kind, reduceMotion }) {
  const f = (d) => reduceMotion ? {} : { animation:`rmr-float 2.2s var(--ease-out) ${d}s infinite` };
  if (kind === "sparkle") return (<g fill="var(--sticker-yellow)" stroke={OUT} strokeWidth="1.5"><path d="M40 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" style={f(0)} /><path d="M164 74 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 z" style={f(0.6)} /></g>);
  if (kind === "steam") return (<g fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.9"><path d="M148 56 q-6 -8 0 -16" style={f(0)} /><path d="M162 62 q-6 -8 0 -16" style={f(0.5)} /></g>);
  if (kind === "tear") return <ellipse cx="68" cy="120" rx="4.5" ry="6" fill="var(--pop-cyan)" stroke="#0A6E9E" strokeWidth="1.5" />;
  if (kind === "sweat") return <path d="M150 72 C150 82 142 86 142 78 C142 72 150 62 150 72 Z" fill="var(--pop-cyan)" stroke="#0A6E9E" strokeWidth="2" />;
  return null;
}

/* ============================================================
   Callie's BRAIN — script DATA + <CallieHost>/<MascotHost> behavior layer.
   Edit CALLIE_SCRIPT to tune her personality per app/screen.
   ============================================================ */
const RARE_IDLE = ["curious", "comfort"];
const GLOBAL_IDLE = ["idle", "curious", "comfort"];
const CALLIE_SCRIPT = {
  onboarding: { enter: "delighted", idle: ["idle", "curious", "delighted"], tips: ["Hi! I'm Callie. I don't roast you — I just watch and react 😺", "Tap the button and let's go."] },
  home: { enter: "delighted", idle: ["idle", "curious", "comfort"], react: { upload: "celebrating" }, tips: ["Drop a pic of your ride and I'll do the rest 🐾", "Front three-quarter angle hits hardest, just sayin'."] },
  seasoning: { enter: "curious", idle: ["curious", "comfort", "idle"], react: { added: "delighted" }, tips: ["A selfie makes it personal — totally optional.", "Pinky promise it's just you."] },
  cast: { enter: "delighted", idle: ["delighted", "curious", "idle"], tips: ["Tap a roaster to hear them warm up.", "They all aim at the car, never at you."] },
  roaster: { enter: "delighted", idle: ["delighted", "curious", "idle"], tips: ["Tap a roaster to hear them warm up."] },
  cooking: { enter: "cooking", idle: ["cooking", "curious", "delighted"], tips: ["Ooh, this one's gonna be good…", "Almost plated 👨‍🍳"] },
  reveal: { enter: "savage", idle: ["savage", "delighted", "celebrating"], tips: ["Screenshot this. Trust me.", "Hit share before you chicken out 😼"] },
  celebrate: { enter: "celebrating", idle: ["celebrating", "delighted"], tips: ["Tag us and we'll re-share the best ones!", "One down. Roast another?"] },
  paywall: { enter: "comfort", idle: ["comfort", "curious", "idle"], react: { buy: "celebrating" }, tips: ["The 5-pack is the move, honestly.", "No subscription. One-time. Promise. 🙏"] },
  settings: { enter: "comfort", idle: ["idle", "comfort"], tips: ["Turn on reduce-motion if I'm too hyper."] },
  call: { enter: "curious", idle: ["curious", "comfort", "idle"], react: { answer: "delighted", decline: "comfort" }, tips: ["Someone's calling… wanna pick up?", "It's always a friendly voice."] },
  empty: { enter: "empty", idle: ["empty", "comfort"], tips: ["Nothing here yet — let's fix that."] },
  error: { enter: "error", idle: ["error", "comfort"], tips: ["My bad. Give it another go?"] },
};
function hostPick(pool, prevRef) {
  if (!pool || !pool.length) return "idle";
  let next = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1 && next === prevRef.current) next = pool[(pool.indexOf(next) + 1) % pool.length];
  prevRef.current = next;
  return next;
}

export function MascotHost({
  context = "home", event = null, size = 120, bubble = false,
  bubblePlacement = "top", reduceMotion = false, style, ...rest
}) {
  const cfg = CALLIE_SCRIPT[context] || {};
  const [emote, setEmote] = React.useState(cfg.enter || "idle");
  const [tip, setTip] = React.useState(null);
  const [tipDismissed, setTipDismissed] = React.useState(false);
  const prev = React.useRef("");
  const prefersReduce = reduceMotion ||
    (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  React.useEffect(() => {
    setEmote(cfg.enter || "idle"); setTipDismissed(false); setTip(null);
    const pool = (cfg.idle && cfg.idle.length) ? cfg.idle : GLOBAL_IDLE;
    const settle = setTimeout(() => setEmote(hostPick(pool, prev)), 1300);
    const tick = () => setEmote(hostPick(Math.random() < 0.16 ? RARE_IDLE : pool, prev));
    const interval = setInterval(tick, prefersReduce ? 6000 : 3200 + Math.random() * 1600);
    return () => { clearTimeout(settle); clearInterval(interval); };
    // eslint-disable-next-line
  }, [context]);

  React.useEffect(() => {
    if (!event) return;
    const react = (cfg.react || {})[event];
    if (!react) return;
    setEmote(react);
    const pool = (cfg.idle && cfg.idle.length) ? cfg.idle : GLOBAL_IDLE;
    const t = setTimeout(() => setEmote(hostPick(pool, prev)), 2600);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [event]);

  React.useEffect(() => {
    if (!bubble || tipDismissed || !(cfg.tips && cfg.tips.length)) { setTip(null); return; }
    let i = 0;
    const show = setTimeout(() => setTip(cfg.tips[0]), 2600);
    const rotate = setInterval(() => { i = (i + 1) % cfg.tips.length; setTip(cfg.tips[i]); }, 7000);
    return () => { clearTimeout(show); clearInterval(rotate); };
    // eslint-disable-next-line
  }, [context, bubble, tipDismissed]);

  return (
    <div style={{ position: "relative", display: "inline-flex", ...style }} {...rest}>
      {bubble && tip && <TipBubble placement={bubblePlacement} onClose={() => setTipDismissed(true)}>{tip}</TipBubble>}
      <Mascot state={emote} size={size} reduceMotion={prefersReduce} />
    </div>
  );
}
/** Preferred name. Same behavior as <MascotHost>. */
export function CallieHost(props) { return <MascotHost {...props} />; }

function TipBubble({ children, placement, onClose }) {
  const pos = {
    top:   { bottom:"100%", left:"50%", transform:"translateX(-50%)", marginBottom:10 },
    right: { left:"100%", top:"10%", marginLeft:10 },
    left:  { right:"100%", top:"10%", marginRight:10 },
  }[placement] || {};
  return (
    <div role="status" style={{
      position:"absolute", zIndex:5, ...pos, width:"max-content", maxWidth:230,
      background:"var(--surface)", color:"var(--ink)", border:"2px solid var(--ink)",
      borderRadius:"var(--radius-lg)", boxShadow:"var(--shadow-sticker)", padding:"10px 30px 10px 14px",
      font:"var(--type-sm)", fontWeight:600, lineHeight:1.35,
      animation:"rmr-pop-in var(--dur-3) var(--ease-spring) both",
    }}>
      {children}
      <button onClick={onClose} aria-label="Dismiss tip" style={{
        position:"absolute", top:6, right:6, width:20, height:20, lineHeight:"16px",
        borderRadius:"var(--radius-pill)", border:"none", cursor:"pointer",
        background:"var(--canvas-sink)", color:"var(--ink-soft)", font:"var(--type-cap)", fontWeight:800,
      }}>×</button>
    </div>
  );
}
