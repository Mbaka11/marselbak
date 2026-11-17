import { useEffect, useRef } from "react";

// Night background: rainy bokeh + fog, with one blurred ML animation at a time:
// neural network -> brain firing -> loss curves -> decision tree -> (loop).
// To use a video instead, drop public/night/bg.mp4 and set VIDEO to its path.
const VIDEO = "";
const SCENE_MS = 13000;
const FADE_MS = 1800;
const SCENES = ["network", "brain", "loss", "tree"] as const;

type P = { x: number; y: number };

export default function RainBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (VIDEO) return;
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    // the ML scene is drawn at reduced resolution on this canvas, then stretched: a cheap blur (ctx.filter is very slow)
    const off = document.createElement("canvas");
    const sc = off.getContext("2d")!;
    const SCALE = 0.3;
    // pre-rendered bokeh sprites (one per colour) instead of a new gradient per dot per frame
    const sprites = new Map<string, HTMLCanvasElement>();
    const spriteFor = (rgb: string) => {
      let sp = sprites.get(rgb);
      if (!sp) {
        sp = document.createElement("canvas");
        sp.width = sp.height = 128;
        const g = sp.getContext("2d")!;
        const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        rg.addColorStop(0, `rgba(${rgb},1)`);
        rg.addColorStop(0.7, `rgba(${rgb},0.5)`);
        rg.addColorStop(1, `rgba(${rgb},0)`);
        g.fillStyle = rg;
        g.fillRect(0, 0, 128, 128);
        sprites.set(rgb, sp);
      }
      return sp;
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const colors = ["255,90,70", "255,170,80", "90,150,255", "255,255,255", "200,60,60", "120,200,255"];
    type B = { x: number; y: number; r: number; c: string; a: number; vx: number; ph: number };
    type R = { x: number; y: number; l: number; v: number };
    let bokeh: B[] = [];
    let rain: R[] = [];

    // --- scene data -------------------------------------------------------
    let layers: P[][] = [];
    let brain: { p: P; act: number; nb: number[] }[] = [];
    let tree: { p: P; parent: number; lit: number }[] = [];
    let loss: { train: number[]; val: number[] } = { train: [], val: [] };
    const pulses: { a: P; b: P; t: number; v: number }[] = [];
    const queue: { i: number; at: number }[] = [];
    let path: number[] = [0];
    let pathNext = 0;

    const makeLoss = () => {
      const N = 90;
      const train: number[] = [], val: number[] = [];
      let spike = 0;
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        if (Math.random() < 0.06) spike = 0.18 + Math.random() * 0.2;
        spike *= 0.82;
        train.push(0.08 + 0.85 * Math.exp(-4.2 * t) + spike * (1 - t * 0.6) + (Math.random() - 0.5) * 0.04);
        val.push(0.16 + 0.7 * Math.exp(-3.4 * t) + 0.12 * t * t + spike * 0.6 + (Math.random() - 0.5) * 0.035);
      }
      loss = { train, val };
    };

    const init = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
      off.width = Math.max(2, Math.round(w * SCALE));
      off.height = Math.max(2, Math.round(h * SCALE));
      const small = w < 700;

      bokeh = Array.from({ length: Math.round((w * h) / 26000) }, () => ({
        x: Math.random() * w,
        y: h * 0.25 + Math.random() * h * 0.7,
        r: 8 + Math.random() * 38,
        c: colors[Math.floor(Math.random() * colors.length)],
        a: 0.05 + Math.random() * 0.22,
        vx: (Math.random() - 0.5) * 0.15,
        ph: Math.random() * Math.PI * 2,
      }));
      rain = Array.from({ length: Math.round(w / 6) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        l: 10 + Math.random() * 22,
        v: 7 + Math.random() * 9,
      }));

      // network
      const sizes = small ? [3, 5, 5, 3] : [4, 7, 8, 7, 3];
      const x0 = w * 0.08, x1 = w * 0.92, y0 = h * 0.14, y1 = h * 0.86;
      layers = sizes.map((n, li) =>
        Array.from({ length: n }, (_, i) => ({
          x: x0 + ((x1 - x0) * li) / (sizes.length - 1),
          y: y0 + ((y1 - y0) * (i + 0.5)) / n,
        }))
      );

      // brain: two lobes + cerebellum, nodes linked to their nearest neighbours
      const cx = w / 2, cy = h * 0.47;
      const S = Math.min(w * 0.42, h * 0.5);
      const pts: P[] = [];
      const inside = (x: number, y: number) => {
        const l = ((x - (cx - S * 0.5)) / (S * 0.52)) ** 2 + ((y - cy) / (S * 0.62)) ** 2 < 1;
        const r = ((x - (cx + S * 0.5)) / (S * 0.52)) ** 2 + ((y - cy) / (S * 0.62)) ** 2 < 1;
        const cb = ((x - (cx + S * 0.45)) / (S * 0.32)) ** 2 + ((y - (cy + S * 0.55)) / (S * 0.2)) ** 2 < 1;
        return l || r || cb;
      };
      let guard = 0;
      while (pts.length < (small ? 70 : 120) && guard++ < 6000) {
        const x = cx + (Math.random() - 0.5) * S * 2.1, y = cy + (Math.random() - 0.45) * S * 1.6;
        if (inside(x, y) && pts.every((q) => Math.hypot(q.x - x, q.y - y) > S * 0.1)) pts.push({ x, y });
      }
      brain = pts.map((p) => ({ p, act: 0, nb: [] }));
      brain.forEach((n, i) => {
        n.nb = brain
          .map((m, j) => ({ j, d: Math.hypot(m.p.x - n.p.x, m.p.y - n.p.y) }))
          .filter((o) => o.j !== i)
          .sort((a, b) => a.d - b.d)
          .slice(0, 3)
          .map((o) => o.j);
      });

      makeLoss();

      // decision tree (depth 4 -> 31 nodes)
      const depth = 4;
      tree = [];
      const ty0 = h * 0.12, ty1 = h * 0.84;
      for (let d = 0; d <= depth; d++) {
        const n = 2 ** d;
        for (let k = 0; k < n; k++) {
          tree.push({
            p: { x: w * 0.12 + (w * 0.76 * (k + 0.5)) / n, y: ty0 + ((ty1 - ty0) * d) / depth },
            parent: d === 0 ? -1 : 2 ** (d - 1) - 1 + Math.floor(k / 2),
            lit: 0,
          });
        }
      }
      path = [0];
    };

    // --- scene drawers (drawn on the small offscreen canvas, upscaled = soft) ------------------------------
    const dot = (p: P, r: number, a: number, rgb = "150,210,255") => {
      sc.fillStyle = `rgba(${rgb},${a})`;
      sc.beginPath();
      sc.arc(p.x, p.y, r, 0, Math.PI * 2);
      sc.fill();
    };

    const drawNetwork = () => {
      sc.strokeStyle = "rgba(120,200,255,0.14)";
      sc.lineWidth = 1.5;
      sc.beginPath();
      for (let li = 0; li < layers.length - 1; li++)
        for (const a of layers[li]) for (const b of layers[li + 1]) { sc.moveTo(a.x, a.y); sc.lineTo(b.x, b.y); }
      sc.stroke();
      if (!reduce && Math.random() < 0.1 && pulses.length < 16) {
        const li = Math.floor(Math.random() * (layers.length - 1));
        pulses.push({
          a: layers[li][Math.floor(Math.random() * layers[li].length)],
          b: layers[li + 1][Math.floor(Math.random() * layers[li + 1].length)],
          t: 0,
          v: 0.008 + Math.random() * 0.01,
        });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.v;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        dot({ x: p.a.x + (p.b.x - p.a.x) * p.t, y: p.a.y + (p.b.y - p.a.y) * p.t }, 6, 0.6);
      }
      for (const l of layers) for (const n of l) dot(n, 9, 0.3);
    };

    const drawBrain = (st: number) => {
      sc.strokeStyle = "rgba(120,200,255,0.12)";
      sc.lineWidth = 1.2;
      sc.beginPath();
      brain.forEach((n) => n.nb.forEach((j) => { sc.moveTo(n.p.x, n.p.y); sc.lineTo(brain[j].p.x, brain[j].p.y); }));
      sc.stroke();
      // a wave starts at a random neuron and spreads to neighbours with a delay
      if (!reduce && Math.random() < 0.05) queue.push({ i: Math.floor(Math.random() * brain.length), at: st });
      for (let q = queue.length - 1; q >= 0; q--) {
        if (queue[q].at > st) continue;
        const { i } = queue.splice(q, 1)[0];
        if (brain[i].act > 0.4) continue;
        brain[i].act = 1;
        brain[i].nb.forEach((j) => { if (Math.random() < 0.7) queue.push({ i: j, at: st + 160 + Math.random() * 160 }); });
      }
      for (const n of brain) {
        n.act *= 0.965;
        if (n.act > 0.04) {
          sc.strokeStyle = `rgba(160,225,255,${n.act * 0.5})`;
          sc.lineWidth = 2;
          sc.beginPath();
          n.nb.forEach((j) => { sc.moveTo(n.p.x, n.p.y); sc.lineTo(brain[j].p.x, brain[j].p.y); });
          sc.stroke();
        }
        dot(n.p, 5 + n.act * 9, 0.22 + n.act * 0.7, n.act > 0.2 ? "170,235,255" : "130,190,235");
      }
    };

    const drawLoss = (st: number) => {
      const L = w * 0.1, Rr = w * 0.9, T = h * 0.16, B = h * 0.82;
      sc.strokeStyle = "rgba(160,200,230,0.18)";
      sc.lineWidth = 1.5;
      sc.beginPath();
      sc.moveTo(L, T); sc.lineTo(L, B); sc.lineTo(Rr, B);
      for (let i = 1; i < 5; i++) { const y = B - ((B - T) * i) / 5; sc.moveTo(L, y); sc.lineTo(Rr, y); }
      sc.stroke();
      const prog = Math.min(1, st / (SCENE_MS * 0.7));
      const line = (arr: number[], rgb: string) => {
        const n = Math.max(2, Math.floor(arr.length * prog));
        sc.strokeStyle = `rgba(${rgb},0.6)`;
        sc.lineWidth = 3;
        sc.beginPath();
        for (let i = 0; i < n; i++) {
          const x = L + ((Rr - L) * i) / (arr.length - 1);
          const y = B - (B - T) * Math.min(1.05, arr[i]);
          if (i === 0) sc.moveTo(x, y); else sc.lineTo(x, y);
        }
        sc.stroke();
        const i = n - 1;
        dot({ x: L + ((Rr - L) * i) / (arr.length - 1), y: B - (B - T) * Math.min(1.05, arr[i]) }, 9, 0.8, rgb);
      };
      line(loss.train, "120,200,255");
      line(loss.val, "255,170,110");
    };

    const drawTree = (st: number) => {
      // light a root -> leaf path step by step, then restart on a new path
      if (st >= pathNext && !reduce) {
        const cur = path[path.length - 1];
        if (Math.floor(Math.log2(cur + 1)) >= 4) {
          path = [0];
          tree.forEach((n) => (n.lit = 0));
          tree[0].lit = 1;
          pathNext = st + 900;
        } else {
          path.push(2 * cur + 1 + (Math.random() < 0.5 ? 0 : 1));
          tree[path[path.length - 1]].lit = 1;
          tree[0].lit = 1;
          pathNext = st + 650;
        }
      }
      sc.lineWidth = 1.6;
      tree.forEach((n) => {
        if (n.parent < 0) return;
        const p = tree[n.parent];
        sc.strokeStyle = `rgba(120,200,255,${0.12 + 0.5 * Math.min(p.lit, n.lit)})`;
        sc.beginPath(); sc.moveTo(p.p.x, p.p.y); sc.lineTo(n.p.x, n.p.y); sc.stroke();
      });
      tree.forEach((n, i) => {
        const leaf = Math.floor(Math.log2(i + 1)) === 4;
        dot(n.p, leaf ? 11 : 9, 0.25 + n.lit * 0.65, leaf ? "255,170,110" : "150,210,255");
      });
    };

    // --- main loop -----------------------------------------------------------
    const start = performance.now();
    let lastIdx = -1;
    // random scene each visit, then a random different one each time
    let sceneIdx = Math.floor(Math.random() * SCENES.length);
    let sceneStart = 0;
    const draw = (t: number) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#07090d");
      g.addColorStop(0.55, "#0d1118");
      g.addColorStop(1, "#050608");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // one ML scene at a time, with a fade between them
      const el = t - start;
      if (el - sceneStart >= SCENE_MS) {
        let n = sceneIdx;
        while (n === sceneIdx) n = Math.floor(Math.random() * SCENES.length);
        sceneIdx = n;
        sceneStart = el;
      }
      const idx = sceneIdx;
      const local = el - sceneStart;
      if (idx !== lastIdx) {
        lastIdx = idx;
        pulses.length = 0;
        queue.length = 0;
        brain.forEach((n) => (n.act = 0));
        tree.forEach((n) => (n.lit = 0));
        path = [0];
        pathNext = 0;
        if (SCENES[idx] === "loss") makeLoss(); // fresh noisy curves each time
      }
      const alpha = Math.max(0, Math.min(1, local / FADE_MS, (SCENE_MS - local) / FADE_MS));
      sc.setTransform(1, 0, 0, 1, 0, 0);
      sc.clearRect(0, 0, off.width, off.height);
      sc.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      const scene = SCENES[idx];
      if (scene === "network") drawNetwork();
      else if (scene === "brain") drawBrain(local);
      else if (scene === "loss") drawLoss(local);
      else drawTree(local);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, w, h);
      ctx.restore();

      ctx.globalCompositeOperation = "lighter";
      for (const b of bokeh) {
        const flick = 0.75 + 0.25 * Math.sin(t / 900 + b.ph);
        ctx.globalAlpha = Math.min(1, b.a * flick);
        ctx.drawImage(spriteFor(b.c), b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
        if (!reduce) {
          b.x += b.vx;
          if (b.x < -50) b.x = w + 50;
          if (b.x > w + 50) b.x = -50;
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      const fog = ctx.createRadialGradient(w * 0.5, h * 0.75, 0, w * 0.5, h * 0.75, w * 0.7);
      fog.addColorStop(0, `rgba(160,170,185,${0.07 + 0.03 * Math.sin(t / 3000)})`);
      fog.addColorStop(1, "rgba(160,170,185,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(200,210,225,0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const r of rain) {
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - r.l * 0.18, r.y + r.l);
        if (!reduce) {
          r.y += r.v;
          r.x -= r.v * 0.18;
          if (r.y > h) {
            r.y = -r.l;
            r.x = Math.random() * w * 1.1;
          }
        }
      }
      ctx.stroke();
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, []);

  if (VIDEO) return <video className="nt-bg" src={VIDEO} autoPlay loop muted playsInline />;
  return <canvas ref={ref} className="nt-bg" aria-hidden />;
}
