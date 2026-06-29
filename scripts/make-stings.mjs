// Procedurally synthesize Callie's Universe brand audio → 16-bit mono WAVs.
// Tuned CUTE & SOFT (music-box mallets + warm pads, low + gentle) to match the
// brand vibe — not sparkly/excited. No samples, no libraries. Deterministic.
//   node scripts/make-stings.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100;
const OUT = "apps/roastmyride-app/remotion/assets";
mkdirSync(OUT, { recursive: true });

const N = (n) => {
  const m = { C3: 130.81, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, C6: 1046.5 };
  return m[n] || 440;
};
const buf = (s) => new Float32Array(Math.ceil(SR * s));

// sustained voice (ADSR) — for warm pads
function add(b, freq, t0, dur, o = {}) {
  const { type = "sine", gain = 0.3, a = 0.01, d = 0.05, s = 0.7, r = 0.1 } = o;
  const i0 = Math.floor(t0 * SR), len = Math.floor(dur * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    let env;
    if (t < a) env = t / a;
    else if (t < a + d) env = 1 - (1 - s) * ((t - a) / d);
    else if (t < dur - r) env = s;
    else env = s * Math.max(0, (dur - t) / r);
    const p = (freq * t) % 1;
    let w;
    if (type === "tri") w = 4 * Math.abs(p - 0.5) - 1;
    else if (type === "sine") w = Math.sin(2 * Math.PI * p);
    else w = Math.sin(2 * Math.PI * p);
    const idx = i0 + i;
    if (idx < b.length) b[idx] += w * gain * env;
  }
}
const chord = (b, notes, t0, dur, o) => notes.forEach((n) => add(b, N(n), t0, dur, o));

// soft music-box mallet — warm, rounded, gentle decay (cute, not sparkly)
function mallet(b, freq, t0, dur, gain = 0.28) {
  const i0 = Math.floor(t0 * SR), len = Math.floor(dur * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.008) * Math.exp(-t * (4.2 / dur));
    const p1 = (freq * t) % 1, p2 = (2 * freq * t) % 1;
    const w = Math.sin(2 * Math.PI * p1) + 0.22 * Math.sin(2 * Math.PI * p2); // soft 2nd harmonic only
    const idx = i0 + i;
    if (idx < b.length) b[idx] += w * gain * env;
  }
}

// deterministic soft noise (for a gentle whoosh)
let _seed = 99173;
const rnd = () => { _seed = (_seed * 1103515245 + 12345) & 0x7fffffff; return (_seed / 0x7fffffff) * 2 - 1; };
function noise(b, t0, dur, gain, a = 0.06, r = 0.22) {
  const i0 = Math.floor(t0 * SR), len = Math.floor(dur * SR);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = t < a ? t / a : t < dur - r ? 1 : Math.max(0, (dur - t) / r);
    lp = lp * 0.75 + rnd() * 0.25; // heavier lowpass → soft "air", not a hiss
    const idx = i0 + i;
    if (idx < b.length) b[idx] += lp * gain * env;
  }
}
function sweep(b, f0, f1, t0, dur, gain) {
  const i0 = Math.floor(t0 * SR), len = Math.floor(dur * SR);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, f = f0 + (f1 - f0) * (t / dur);
    ph += f / SR;
    const env = Math.sin(Math.PI * (t / dur));
    const idx = i0 + i;
    if (idx < b.length) b[idx] += Math.sin(2 * Math.PI * ph) * gain * env;
  }
}

function toWav(b) {
  const peak = b.reduce((m, x) => Math.max(m, Math.abs(x)), 0) || 1;
  const norm = 0.85 / Math.max(peak, 0.85);
  const data = Buffer.alloc(b.length * 2);
  for (let i = 0; i < b.length; i++) {
    const s = Math.tanh(b[i] * norm);
    data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(s * 32767))), i * 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

/* ===== IDENT: soft, warm music-box motif (cute, calm) ===== */
{
  const b = buf(1.7);
  mallet(b, N("G4"), 0.00, 0.55, 0.30);
  mallet(b, N("C5"), 0.18, 0.55, 0.30);
  mallet(b, N("E5"), 0.36, 0.75, 0.27);
  chord(b, ["C3", "G3", "C4"], 0.06, 1.45, { type: "tri", gain: 0.10, a: 0.3, d: 0.3, s: 0.8, r: 0.5 });
  writeFileSync(`${OUT}/sting-intro.wav`, toWav(b));
  console.log("wrote sting-intro.wav (cute, ~1.7s)");
}

/* ===== VERDICT: a soft, friendly two-note "ta-da" (calm) ===== */
{
  const b = buf(1.2);
  mallet(b, N("C5"), 0.0, 0.55, 0.30);
  mallet(b, N("G5"), 0.15, 0.8, 0.30);
  chord(b, ["C3", "G3"], 0.0, 0.95, { type: "sine", gain: 0.11, a: 0.01, d: 0.25, s: 0.5, r: 0.4 });
  writeFileSync(`${OUT}/sting-verdict.wav`, toWav(b));
  console.log("wrote sting-verdict.wav (cute, ~1.2s)");
}

/* ===== WHOOSH: very soft, low transition (gentle) ===== */
{
  const b = buf(0.4);
  noise(b, 0.0, 0.34, 0.20, 0.08, 0.2);
  sweep(b, 160, 620, 0.0, 0.3, 0.05);
  writeFileSync(`${OUT}/whoosh.wav`, toWav(b));
  console.log("wrote whoosh.wav (soft, ~0.4s)");
}

/* ===== OUTRO: a gentle music-box resolve onto a warm chord (cute) ===== */
{
  const b = buf(2.2);
  mallet(b, N("E5"), 0.0, 0.5, 0.26);
  mallet(b, N("D5"), 0.16, 0.5, 0.26);
  mallet(b, N("C5"), 0.32, 0.85, 0.30);
  chord(b, ["C3", "G3", "E4", "C5"], 0.34, 1.7, { type: "tri", gain: 0.10, a: 0.08, d: 0.3, s: 0.72, r: 0.6 });
  writeFileSync(`${OUT}/sting-outro.wav`, toWav(b));
  console.log("wrote sting-outro.wav (cute, ~2.2s)");
}

/* ===== BED: soft warm loopable pad (kept — user likes it) ===== */
{
  const b = buf(4.0);
  const prog = [["C3", "E4", "G4"], ["A3", "C4", "E4"], ["F3", "A4", "C5"], ["G3", "B4", "D5"]];
  prog.forEach((ch, i) => chord(b, ch, i * 1.0, 1.25, { type: "tri", gain: 0.12, a: 0.25, d: 0.2, s: 0.85, r: 0.35 }));
  for (let i = 0; i < 8; i++) add(b, N("C3"), i * 0.5, 0.18, { type: "sine", gain: 0.05, a: 0.01, d: 0.06, s: 0.2, r: 0.08 });
  writeFileSync(`${OUT}/bed-loop.wav`, toWav(b));
  console.log("wrote bed-loop.wav (~4s loop)");
}
