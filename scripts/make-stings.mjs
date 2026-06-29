// Procedurally synthesize the Callie's Universe brand stings → 16-bit mono WAVs.
// No samples, no libraries — additive synthesis (sines/bells/saw + ADSR) mixed and
// soft-limited. Deterministic, so the brand audio is reproducible.
//   node scripts/make-stings.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100;
const OUT = "apps/roastmyride-app/remotion/assets";
mkdirSync(OUT, { recursive: true });

// note → frequency
const N = (n) => {
  const m = { C3: 130.81, E3: 164.81, G3: 196.0, A3: 220.0, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0, C6: 1046.5, E6: 1318.5, G6: 1568.0 };
  return m[n] || 440;
};

function buf(seconds) { return new Float32Array(Math.ceil(SR * seconds)); }

// one voice: freq, start(s), dur(s), {type, gain, a, d, s, r} (ADSR in seconds, s=sustain level)
function add(b, freq, t0, dur, o = {}) {
  const { type = "sine", gain = 0.3, a = 0.01, d = 0.05, s = 0.7, r = 0.1, detune = 0 } = o;
  const i0 = Math.floor(t0 * SR), len = Math.floor(dur * SR);
  const f = freq * (1 + detune);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    // ADSR
    let env;
    if (t < a) env = t / a;
    else if (t < a + d) env = 1 - (1 - s) * ((t - a) / d);
    else if (t < dur - r) env = s;
    else env = s * Math.max(0, (dur - t) / r);
    const p = (f * t) % 1; // phase [0,1)
    let w;
    if (type === "sine") w = Math.sin(2 * Math.PI * p);
    else if (type === "saw") w = 2 * p - 1;
    else if (type === "square") w = p < 0.5 ? 1 : -1;
    else if (type === "tri") w = 4 * Math.abs(p - 0.5) - 1;
    else if (type === "bell") w = Math.sin(2 * Math.PI * p) + 0.5 * Math.sin(4 * Math.PI * p) + 0.28 * Math.sin(6 * Math.PI * p);
    else w = Math.sin(2 * Math.PI * p);
    const idx = i0 + i;
    if (idx < b.length) b[idx] += w * gain * env;
  }
}

// a plucked bell (fast attack, exponential decay, no sustain)
function bell(b, freq, t0, dur, gain = 0.3) {
  const i0 = Math.floor(t0 * SR), len = Math.floor(dur * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t * (3.2 / dur));
    const p1 = (freq * t) % 1, p2 = (2 * freq * t) % 1, p3 = (3.01 * freq * t) % 1;
    const w = Math.sin(2 * Math.PI * p1) + 0.5 * Math.sin(2 * Math.PI * p2) + 0.25 * Math.sin(2 * Math.PI * p3);
    const idx = i0 + i;
    if (idx < b.length) b[idx] += w * gain * env;
  }
}

function chord(b, notes, t0, dur, o) { notes.forEach((n) => add(b, N(n), t0, dur, o)); }

// soft-limit + 16-bit WAV
function toWav(b) {
  const peak = b.reduce((m, x) => Math.max(m, Math.abs(x)), 0) || 1;
  const norm = 0.92 / Math.max(peak, 0.92);
  const data = Buffer.alloc(b.length * 2);
  for (let i = 0; i < b.length; i++) {
    const s = Math.tanh(b[i] * norm * 1.1); // gentle saturation
    data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(s * 32767))), i * 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

/* ===== INTRO: Callie's Universe ident — magical sparkle → warm chord → title pop ===== */
{
  const b = buf(2.0);
  // shimmering ascending bell arpeggio (the "✦ universe" sparkle)
  const arp = ["C5", "E5", "G5", "C6", "E6"];
  arp.forEach((n, i) => bell(b, N(n), 0.04 + i * 0.10, 0.9, 0.34 - i * 0.03));
  // faint high "stars"
  [N("G6"), N("E6"), 1760, 2100].forEach((f, i) => bell(b, f, 0.18 + i * 0.13, 0.5, 0.07));
  // warm pad swelling under it (C major)
  chord(b, ["C4", "E4", "G4"], 0.45, 1.45, { type: "tri", gain: 0.12, a: 0.18, d: 0.2, s: 0.8, r: 0.5 });
  // soft sub for warmth
  add(b, N("C3"), 0.45, 1.4, { type: "sine", gain: 0.16, a: 0.12, d: 0.2, s: 0.7, r: 0.4 });
  // the show-title POP at ~1.05s — a bright confident stab (brass-ish)
  chord(b, ["C4", "E4", "G4", "C5"], 1.06, 0.5, { type: "saw", gain: 0.13, a: 0.006, d: 0.18, s: 0.35, r: 0.22 });
  bell(b, N("C6"), 1.07, 0.7, 0.3); // sparkle on the pop
  writeFileSync(`${OUT}/sting-intro.wav`, toWav(b));
  console.log("wrote sting-intro.wav (~2.0s)");
}

/* ===== OUTRO: endcard button — upbeat lift → big major landing → sparkle ===== */
{
  const b = buf(2.3);
  // bouncy ascending lead (G–C–E–G), playful
  [["G4", 0.0], ["C5", 0.12], ["E5", 0.24], ["G5", 0.36]].forEach(([n, t]) =>
    add(b, N(n), t, 0.22, { type: "tri", gain: 0.26, a: 0.005, d: 0.06, s: 0.5, r: 0.08 }));
  // the satisfying landing chord (C major, full)
  chord(b, ["C4", "E4", "G4", "C5", "E5"], 0.52, 1.5, { type: "saw", gain: 0.1, a: 0.008, d: 0.25, s: 0.5, r: 0.5 });
  chord(b, ["C3", "G3"], 0.52, 1.5, { type: "sine", gain: 0.16, a: 0.01, d: 0.25, s: 0.6, r: 0.5 });
  // cheerful sparkle on the landing
  [N("C6"), N("E6"), N("G6")].forEach((f, i) => bell(b, f, 0.54 + i * 0.05, 0.9, 0.22 - i * 0.04));
  // a little button tag at the end
  add(b, N("C5"), 1.7, 0.3, { type: "tri", gain: 0.2, a: 0.005, d: 0.1, s: 0.3, r: 0.15 });
  writeFileSync(`${OUT}/sting-outro.wav`, toWav(b));
  console.log("wrote sting-outro.wav (~2.3s)");
}
