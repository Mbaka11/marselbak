// Discreet synthesized sound effects (Web Audio, no asset files).
// The AudioContext is created lazily on first use, which always happens inside a user gesture (click).

const MASTER_GAIN = 0.07;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;

function audio(): { ctx: AudioContext; master: GainNode; noise: AudioBuffer } | null {
  try {
    if (!ctx) {
      const AC: typeof AudioContext | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = MASTER_GAIN;
      master.connect(ctx.destination);
      // one second of white noise, reused by every effect
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") void ctx.resume();
    return { ctx, master: master!, noise: noise! };
  } catch {
    return null;
  }
}

/** Short band-passed noise burst with an attack/decay envelope. */
function burst(a: NonNullable<ReturnType<typeof audio>>, at: number, dur: number, freq: number, q: number, peak: number, sweepTo?: number) {
  const src = a.ctx.createBufferSource();
  src.buffer = a.noise;
  const bp = a.ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = q;
  bp.frequency.setValueAtTime(freq, at);
  if (sweepTo) bp.frequency.exponentialRampToValueAtTime(sweepTo, at + dur);
  const g = a.ctx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + dur * 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(bp).connect(g).connect(a.master);
  src.start(at, Math.random() * 0.5, dur + 0.05);
}

/** Paper swish with a tiny soft tap at the end (the card flips). */
export function playFlip(muted: boolean) {
  if (muted) return;
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime + 0.01;
  burst(a, t, 0.15, 2400, 0.9, 0.55, 4200);
  // soft tap when it lands
  burst(a, t + 0.15, 0.05, 700, 1.2, 0.35);
}

/** Axe thunk: heavy low thump plus a short noise burst, landing `delay` seconds after the click. */
export function playThunk(muted: boolean, delay = 0.4) {
  if (muted) return;
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime + delay;
  const osc = a.ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(95, t);
  osc.frequency.exponentialRampToValueAtTime(52, t + 0.2);
  const g = a.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(1, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  osc.connect(g).connect(a.master);
  osc.start(t);
  osc.stop(t + 0.3);
  burst(a, t, 0.09, 1100, 0.7, 0.5, 400);
}
