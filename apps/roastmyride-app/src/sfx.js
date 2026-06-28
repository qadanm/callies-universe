// Synthesized stingers (no copyrighted audio): short tonal hits for the punch and
// closer beats, baked as WAV data URLs at module load. Deterministic, so the
// export is reproducible. Browser- and Node-safe (btoa with a Buffer fallback).

function encodeWav(samples, rate) {
  const n = samples.length;
  const buf = new ArrayBuffer(44 + n * 2);
  const dv = new DataView(buf);
  const wr = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  wr(0, "RIFF"); dv.setUint32(4, 36 + n * 2, true); wr(8, "WAVE");
  wr(12, "fmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
  dv.setUint32(24, rate, true); dv.setUint32(28, rate * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
  wr(36, "data"); dv.setUint32(40, n * 2, true);
  let o = 44;
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    dv.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true);
    o += 2;
  }
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = typeof btoa !== "undefined" ? btoa(bin) : Buffer.from(bin, "binary").toString("base64");
  return `data:audio/wav;base64,${b64}`;
}

// A swept tone with an exponential decay envelope → a clean "ding/whoosh" stinger.
function sweep({ freqStart, freqEnd, ms, decay = 4, gain = 0.6, rate = 24000 }) {
  const n = Math.round((rate * ms) / 1000);
  const s = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const k = i / n;
    const f = freqStart + (freqEnd - freqStart) * k;
    s[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-decay * k) * gain;
  }
  return s;
}

const PUNCH = encodeWav(sweep({ freqStart: 520, freqEnd: 880, ms: 220, decay: 5 }), 24000);
const CLOSER = encodeWav(sweep({ freqStart: 300, freqEnd: 1200, ms: 440, decay: 3 }), 24000);

/** WAV data URL for a beat's stinger, or null for non-emphasis beats. */
export function sfxFor(type) {
  if (type === "closer") return CLOSER;
  if (type === "punch") return PUNCH;
  return null;
}
