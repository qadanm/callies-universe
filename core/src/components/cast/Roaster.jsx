import React from "react";

/**
 * Roaster: the VOICE CAST avatars. Eight named, backstoried comedic personas
 * who deliver the roast (the CAST performs; Callie the mascot only reacts).
 *
 * Each avatar is a unique kawaii bust in Callie's world (round, soft, thick
 * outline, flat fill), distinguished by skin tone, hair, wardrobe, expression,
 * and a signature prop. PLACEHOLDER art, built to be swapped for final
 * illustration keyed to the same `id`.
 *
 * Roster metadata (name/tagline/catchphrase/register/ring) travels on
 * `Roaster.roster` so the cast-picker can render tiles without a 2nd export.
 */

const OUT = "#3A2208";

export function Roaster({ id = "reginald", size = 140, ring = false, ink = false, className = "", style, ...rest }) {
  const r = ROSTER[id] || ROSTER.reginald;
  return (
    <div className={[ink ? "ink" : "", className].filter(Boolean).join(" ") || undefined}
      style={{ position: "relative", width: size, height: size, display: "inline-flex",
      alignItems: "center", justifyContent: "center", ...style }}
      data-roaster={id} role="img" aria-label={r.name} {...rest}>
      <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
        {ring && <circle cx="100" cy="100" r="96" fill={r.ring} />}
        <Bust skin={r.skin} cloth={r.cloth} />
        {ART[id] && ART[id]()}
      </svg>
    </div>
  );
}

/* shared bust: shoulders + neck + round head + ears */
function Bust({ skin, cloth }) {
  return (
    <g>
      <path d="M26 200 C26 160 58 150 100 150 C142 150 174 160 174 200 Z" fill={cloth} stroke={OUT} strokeWidth="5" strokeLinejoin="round" />
      <rect x="86" y="128" width="28" height="26" rx="10" fill={skin} stroke={OUT} strokeWidth="5" />
      <ellipse cx="50" cy="96" rx="11" ry="13" fill={skin} stroke={OUT} strokeWidth="4.5" />
      <ellipse cx="150" cy="96" rx="11" ry="13" fill={skin} stroke={OUT} strokeWidth="4.5" />
      <ellipse cx="100" cy="92" rx="52" ry="54" fill={skin} stroke={OUT} strokeWidth="5" />
    </g>
  );
}

/* ---- face primitives ---- */
const eyes = {
  dot: <g fill={OUT}><ellipse cx="80" cy="94" rx="5.5" ry="8" /><ellipse cx="120" cy="94" rx="5.5" ry="8" /><circle cx="82" cy="91" r="2" fill="#fff" /><circle cx="122" cy="91" r="2" fill="#fff" /></g>,
  glance: <g fill={OUT}><ellipse cx="84" cy="94" rx="5.5" ry="8" /><ellipse cx="124" cy="94" rx="5.5" ry="8" /><circle cx="86" cy="91" r="2" fill="#fff" /><circle cx="126" cy="91" r="2" fill="#fff" /></g>,
  half: <g stroke={OUT} strokeWidth="5" strokeLinecap="round" fill="none"><path d="M70 95 Q80 99 90 95" /><path d="M110 95 Q120 99 130 95" /></g>,
  closed: <g stroke={OUT} strokeWidth="4.5" strokeLinecap="round" fill="none"><path d="M70 94 Q80 90 90 94" /><path d="M110 94 Q120 90 130 94" /></g>,
  happy: <g stroke={OUT} strokeWidth="5" strokeLinecap="round" fill="none"><path d="M70 96 Q80 88 90 96" /><path d="M110 96 Q120 88 130 96" /></g>,
  droopy: <g fill={OUT}><ellipse cx="80" cy="97" rx="5" ry="6" /><ellipse cx="120" cy="97" rx="5" ry="6" /><path d="M71 90 Q80 86 89 90" stroke={OUT} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M111 90 Q120 86 129 90" stroke={OUT} strokeWidth="3" fill="none" strokeLinecap="round" /></g>,
};
const mouths = {
  smile: <path d="M88 116 Q100 126 112 116" fill="none" stroke={OUT} strokeWidth="4" strokeLinecap="round" />,
  grin: <path d="M84 114 Q100 128 116 114" fill="none" stroke={OUT} strokeWidth="4.5" strokeLinecap="round" />,
  warm: <path d="M82 114 Q100 130 118 114 Q100 120 82 114 Z" fill="#7A1A05" stroke={OUT} strokeWidth="2.5" />,
  flat: <line x1="90" y1="118" x2="110" y2="118" stroke={OUT} strokeWidth="4" strokeLinecap="round" />,
  smug: <path d="M92 117 Q104 122 114 113" fill="none" stroke={OUT} strokeWidth="4" strokeLinecap="round" />,
  gasp: <ellipse cx="100" cy="119" rx="7" ry="9" fill="#7A1A05" stroke={OUT} strokeWidth="2.5" />,
  talk: <ellipse cx="100" cy="118" rx="8" ry="6" fill="#7A1A05" stroke={OUT} strokeWidth="2.5" />,
  tiny: <path d="M94 117 Q100 121 106 117" fill="none" stroke={OUT} strokeWidth="3.5" strokeLinecap="round" />,
};
const nose = <path d="M97 104 L103 104 L100 109 Z" fill="rgba(58,34,8,0.4)" />;

/* ---- roster metadata (travels on Roaster.roster) ---- */
// Active cast first, then the strong-accent cast tabled as `comingSoon` (greyed in
// the picker). See docs/voice-accents-troubleshooting.md for why they're tabled.
const ROSTER = {
  reginald: { name: "Sir Reginald Pemberton-Hare", tag: "Dry British narrator", register: "Deadpan", spice: "Mild", phrase: "Here we observe a car admired chiefly by the person selling it.", skin: "#F3CBA4", cloth: "#8A6E45", ring: "#C9D98F" },
  tony:     { name: "Tony “Two-Times” Calabrese", tag: "Fed-up New Yorker", register: "Fast, loud", spice: "Medium", phrase: "You paid for this. With money. That you earned.", skin: "#E3AC80", cloth: "#26407A", ring: "#FFCB2B" },
  mama:     { name: "Mama Denièce", tag: "Blunt mom", register: "Warm, brutal", spice: "Spicy", phrase: "It's a beautiful car, baby. For somebody who gave up.", skin: "#6E4226", cloth: "#6B3FA0", ring: "#C9A2F0" },
  buford:   { name: "Buford “Sweet Tea” Coalsworth", tag: "Slow-talking uncle", register: "Easy, drawling", spice: "Mild", phrase: "That is a whole lot of car for a fella with nowhere to be.", skin: "#D8A772", cloth: "#8A4B2F", ring: "#E0A33A" },
  gord:     { name: "Gord “Sorry-Aboot-It” Beaudry", tag: "Hoser rink dad", register: "Warm · sorry-eh", spice: "Medium", phrase: "Aw geez, sorry, bud… no offence, eh?", skin: "#EAC4A0", cloth: "#2C6E49", ring: "#E84855", comingSoon: true },
  abuomar:  { name: "Abu Omar", tag: "Warm Egyptian uncle", register: "Theatrical · warm", spice: "Mild", phrase: "My son… the car, I do not love.", skin: "#C98E58", cloth: "#7A2E3A", ring: "#FFB877", comingSoon: true },
  mateo:    { name: "Mateo “El Tigre” Rivas", tag: "Telenovela hype-man", register: "Operatic drama", spice: "Spicy", phrase: "The car… the car has broken my heart.", skin: "#D89C68", cloth: "#1A1A1F", ring: "#FF4FA3", comingSoon: true },
  jeanluc:  { name: "Jean-Luc Moreau", tag: "Unbothered Frenchman", register: "Deadpan disdain", spice: "Medium", phrase: "It is a car. It is here. I am… unmoved.", skin: "#F1C7A0", cloth: "#2C5AA8", ring: "#8FC2FF", comingSoon: true },
  priya:    { name: "Priya Nair", tag: "Comparison auntie", register: "Lovingly brutal", spice: "Spicy", phrase: "Sharma-ji’s son has better. But it’s nice, beta.", skin: "#B87B4A", cloth: "#1F8A7A", ring: "#5FD6C4", comingSoon: true },
  kenji:    { name: "Kenji “Ken” Tanaka", tag: "Zen minimalist", register: "Three-word KO", spice: "Mild", phrase: "…Hm. It is a car.", skin: "#ECBC8E", cloth: "#3A3A44", ring: "#AEB6C2", comingSoon: true },
};
Roaster.roster = Object.keys(ROSTER).map((id) => ({ id, ...ROSTER[id] }));

/* ---- per-character art (hair / brows / face / props, drawn over the bust) ---- */
const ART = {
  reginald: () => (<g>
    {/* grey side hair */}
    <path d="M52 86 C50 54 70 40 100 40 C130 40 150 54 148 86 C148 70 132 62 100 62 C68 62 52 70 52 86 Z" fill="#BFB9AE" stroke={OUT} strokeWidth="4" />
    {/* safari hat */}
    <ellipse cx="100" cy="52" rx="62" ry="13" fill="#B79A5E" stroke={OUT} strokeWidth="4.5" />
    <path d="M62 52 C62 26 80 18 100 18 C120 18 138 26 138 52 Z" fill="#C7AB6E" stroke={OUT} strokeWidth="4.5" />
    <rect x="62" y="44" width="76" height="9" rx="4" fill="#7A6238" />
    {eyes.half}
    {/* monocle */}
    <circle cx="120" cy="94" r="13" fill="none" stroke="#7A6238" strokeWidth="3" />
    <line x1="131" y1="100" x2="136" y2="120" stroke="#7A6238" strokeWidth="2.5" />
    {nose}{mouths.flat}
    {/* tweed lapels */}
    <path d="M84 154 L100 172 L116 154" fill="none" stroke="#6E552F" strokeWidth="4" />
  </g>),

  tony: () => (<g>
    {/* slicked dark hair */}
    <path d="M50 80 C48 48 70 36 100 36 C130 36 152 48 150 80 C150 60 138 52 120 56 C112 46 88 46 80 56 C62 52 50 60 50 80 Z" fill="#2B2A33" stroke={OUT} strokeWidth="4" />
    {/* raised expressive brows */}
    <path d="M70 78 Q80 70 92 76" stroke={OUT} strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M108 76 Q120 70 130 78" stroke={OUT} strokeWidth="4.5" fill="none" strokeLinecap="round" />
    {eyes.dot}
    {/* stubble */}
    <path d="M70 120 Q100 140 130 120 Q100 134 70 120 Z" fill="rgba(43,42,51,0.18)" />
    {nose}{mouths.talk}
    {/* gold chain */}
    <path d="M80 156 Q100 170 120 156" fill="none" stroke="#FFC93B" strokeWidth="4" />
    {/* track-jacket stripe */}
    <rect x="60" y="158" width="6" height="42" fill="#fff" opacity="0.85" />
    <rect x="134" y="158" width="6" height="42" fill="#fff" opacity="0.85" />
    {/* espresso cup */}
    <g transform="translate(150 150)"><rect x="-12" y="-8" width="22" height="16" rx="3" fill="#fff" stroke={OUT} strokeWidth="3" /><path d="M10 -4 q8 0 8 6 q0 6 -8 6" fill="none" stroke={OUT} strokeWidth="3" /></g>
  </g>),

  buford: () => (<g>
    {/* trucker cap (crown + brim) */}
    <path d="M44 70 C46 44 70 34 100 34 C130 34 154 44 156 70 C156 58 130 52 100 52 C70 52 44 58 44 70 Z" fill="#3F7D4F" stroke={OUT} strokeWidth="4" />
    <path d="M40 70 Q100 64 160 70 L170 81 Q100 75 30 81 Z" fill="#356B43" stroke={OUT} strokeWidth="3.5" />
    {eyes.half}
    {/* big grey mustache */}
    <path d="M74 116 Q100 106 126 116 Q112 128 100 122 Q88 128 74 116 Z" fill="#CFC9BE" stroke={OUT} strokeWidth="2.5" />
    {nose}{mouths.smile}
    {/* flannel collar + plaid hint */}
    <path d="M82 152 L100 168 L118 152" fill="none" stroke="#5C3320" strokeWidth="5" />
    <path d="M70 160 L82 200 M130 160 L118 200" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
    {/* sweet-tea mason jar */}
    <g transform="translate(151 154)"><rect x="-11" y="-12" width="22" height="24" rx="4" fill="#C98A3A" stroke={OUT} strokeWidth="3" opacity="0.92" /><rect x="-11" y="-12" width="22" height="6" rx="3" fill="#E0B45A" /><rect x="-2" y="-20" width="5" height="9" fill="#9ACBE0" opacity="0.7" /></g>
  </g>),

  gord: () => (<g>
    {/* toque (beanie) + fold band + pom */}
    <path d="M48 72 C48 44 72 30 100 30 C128 30 152 44 152 72 C140 60 116 56 100 56 C84 56 60 60 48 72 Z" fill="#B23A48" stroke={OUT} strokeWidth="4" />
    <rect x="46" y="66" width="108" height="14" rx="7" fill="#9A2F3C" stroke={OUT} strokeWidth="3.5" />
    <circle cx="100" cy="26" r="8" fill="#F4F1EA" stroke={OUT} strokeWidth="3" />
    {eyes.happy}
    {/* light stubble */}
    <path d="M70 120 Q100 138 130 120 Q100 132 70 120 Z" fill="rgba(40,30,20,0.16)" />
    {nose}{mouths.grin}
    {/* jersey collar */}
    <path d="M84 152 L100 166 L116 152" fill="none" stroke="#214A8A" strokeWidth="5" />
    {/* double-double coffee cup */}
    <g transform="translate(150 156)"><path d="M-10 -10 h20 l-2 21 h-16 z" fill="#fff" stroke={OUT} strokeWidth="3" /><rect x="-11" y="-13" width="22" height="5" rx="2" fill="#7A4A2E" /></g>
  </g>),

  abuomar: () => (<g>
    {/* balding grey sides */}
    <path d="M52 92 C50 66 64 56 78 54 C70 64 70 78 70 88 Z" fill="#C9C3B8" stroke={OUT} strokeWidth="3.5" />
    <path d="M148 92 C150 66 136 56 122 54 C130 64 130 78 130 88 Z" fill="#C9C3B8" stroke={OUT} strokeWidth="3.5" />
    {eyes.happy}
    {/* big grey mustache */}
    <path d="M80 112 Q100 104 120 112 Q110 122 100 118 Q90 122 80 112 Z" fill="#CFC9BE" stroke={OUT} strokeWidth="2.5" />
    {mouths.warm}
    {/* cozy vest collar */}
    <path d="M82 152 L100 168 L118 152" fill="none" stroke="#5C222C" strokeWidth="5" />
    {/* tea glass */}
    <g transform="translate(150 152)"><rect x="-11" y="-10" width="20" height="20" rx="3" fill="#C97A2E" stroke={OUT} strokeWidth="3" opacity="0.85" /><rect x="-11" y="-10" width="20" height="6" rx="3" fill="#E8A95A" /></g>
  </g>),

  mama: () => (<g>
    {/* styled hair (rounded updo) */}
    <path d="M48 84 C44 50 68 34 100 34 C132 34 156 50 152 84 C152 62 150 50 132 44 C150 56 142 74 138 82 C132 60 116 56 100 56 C84 56 68 60 62 82 C58 74 50 56 68 44 C50 50 48 62 48 84 Z" fill="#241712" stroke={OUT} strokeWidth="4" />
    {/* one raised brow */}
    <path d="M70 80 Q80 74 92 78" stroke={OUT} strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M108 74 Q120 68 130 74" stroke={OUT} strokeWidth="4.5" fill="none" strokeLinecap="round" />
    {eyes.glance}
    {nose}{mouths.smug}
    {/* hoop earrings */}
    <circle cx="50" cy="110" r="7" fill="none" stroke="#FFC93B" strokeWidth="3" />
    <circle cx="150" cy="110" r="7" fill="none" stroke="#FFC93B" strokeWidth="3" />
    {/* church fan */}
    <g transform="translate(158 150) rotate(18)"><path d="M0 0 L-26 -16 A30 30 0 0 1 4 -22 Z" fill="#F6E7C8" stroke={OUT} strokeWidth="3" /><line x1="0" y1="0" x2="-14" y2="-9" stroke={OUT} strokeWidth="1.5" /><line x1="0" y1="0" x2="-10" y2="-16" stroke={OUT} strokeWidth="1.5" /></g>
  </g>),

  mateo: () => (<g>
    {/* stylish dark hair w/ quiff */}
    <path d="M50 80 C48 46 70 34 100 34 C130 34 152 46 150 80 C150 56 140 50 122 52 C118 40 92 40 86 54 C66 50 50 58 50 80 Z" fill="#1E1A22" stroke={OUT} strokeWidth="4" />
    {/* dramatic brows */}
    <path d="M70 76 Q80 68 92 74" stroke={OUT} strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M108 74 Q120 68 130 76" stroke={OUT} strokeWidth="4.5" fill="none" strokeLinecap="round" />
    {/* sunglasses (worn at night) */}
    <g><rect x="64" y="84" width="30" height="22" rx="10" fill="#15151A" stroke={OUT} strokeWidth="3.5" /><rect x="106" y="84" width="30" height="22" rx="10" fill="#15151A" stroke={OUT} strokeWidth="3.5" /><line x1="94" y1="92" x2="106" y2="92" stroke={OUT} strokeWidth="3.5" /><rect x="70" y="89" width="9" height="5" rx="2" fill="#fff" opacity="0.4" /></g>
    {nose}{mouths.gasp}
    {/* gold chain */}
    <path d="M78 156 Q100 172 122 156" fill="none" stroke="#FFC93B" strokeWidth="4.5" />
    <circle cx="100" cy="168" r="4" fill="#FFC93B" stroke={OUT} strokeWidth="1.5" />
  </g>),

  jeanluc: () => (<g>
    {/* tousled dark hair */}
    <path d="M50 82 C48 50 70 38 100 38 C130 38 152 50 150 82 C148 64 140 56 126 58 C120 50 112 54 108 58 C100 50 90 54 86 60 C74 54 56 60 50 82 Z" fill="#3A2A1E" stroke={OUT} strokeWidth="4" />
    {eyes.droopy}
    {nose}{mouths.flat}
    {/* breton striped shirt */}
    <g>
      <path d="M26 200 C26 160 58 150 100 150 C142 150 174 160 174 200 Z" fill="#F4F1EA" stroke={OUT} strokeWidth="5" strokeLinejoin="round" />
      <rect x="40" y="160" width="120" height="6" fill="#2C5AA8" />
      <rect x="34" y="174" width="132" height="6" fill="#2C5AA8" />
      <rect x="30" y="188" width="140" height="6" fill="#2C5AA8" />
    </g>
    {/* tiny espresso */}
    <g transform="translate(150 156)"><rect x="-9" y="-7" width="18" height="13" rx="2" fill="#fff" stroke={OUT} strokeWidth="2.5" /><rect x="-9" y="-7" width="18" height="4" fill="#6E4A2E" /></g>
  </g>),

  priya: () => (<g>
    {/* center-part black hair + bun */}
    <path d="M50 86 C48 52 70 38 100 38 C130 38 152 52 150 86 C150 64 140 56 100 56 C60 56 50 64 50 86 Z" fill="#241A1F" stroke={OUT} strokeWidth="4" />
    <line x1="100" y1="40" x2="100" y2="56" stroke="#3A2A30" strokeWidth="2" />
    <circle cx="100" cy="36" r="12" fill="#241A1F" stroke={OUT} strokeWidth="3.5" />
    {/* bindi */}
    <circle cx="100" cy="66" r="3.5" fill="#C7340F" />
    {/* one raised brow */}
    <path d="M70 80 Q80 76 92 79" stroke={OUT} strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M108 73 Q120 67 130 74" stroke={OUT} strokeWidth="4.5" fill="none" strokeLinecap="round" />
    {eyes.glance}
    {nose}{mouths.smug}
    {/* jhumka earrings */}
    <g fill="#FFC93B" stroke={OUT} strokeWidth="1.5"><circle cx="50" cy="112" r="4" /><path d="M46 116 h8 l-4 6 z" /><circle cx="150" cy="112" r="4" /><path d="M146 116 h8 l-4 6 z" /></g>
    {/* phone in hand */}
    <g transform="translate(150 156) rotate(-12)"><rect x="-8" y="-14" width="16" height="28" rx="3" fill="#15151A" stroke={OUT} strokeWidth="2.5" /><rect x="-5" y="-10" width="10" height="18" rx="1" fill="#5FD6C4" /></g>
  </g>),

  kenji: () => (<g>
    {/* neat black hair, straight fringe */}
    <path d="M50 82 C48 50 70 38 100 38 C130 38 152 50 150 82 C150 60 142 54 100 54 C58 54 50 60 50 82 Z" fill="#20202A" stroke={OUT} strokeWidth="4" />
    <path d="M64 60 Q100 50 136 60 L136 70 Q100 60 64 70 Z" fill="#20202A" />
    {/* serene closed eyes */}
    <g stroke={OUT} strokeWidth="4.5" strokeLinecap="round"><line x1="72" y1="95" x2="90" y2="95" /><line x1="110" y1="95" x2="128" y2="95" /></g>
    {nose}{mouths.tiny}
    {/* minimalist collar */}
    <path d="M86 152 L100 162 L114 152" fill="none" stroke="#2A2A32" strokeWidth="5" />
  </g>),
};
