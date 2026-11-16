import { useEffect, useRef } from "react";

// A faint neural network behind the hero. Small light pulses travel along the
// edges and light up the nodes they reach. The name sits on top of it.
type Node = { x: number; y: number; layer: number; glow: number };

export default function HeroNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let layers: Node[][] = [];
    let edges: [Node, Node][] = [];
    const pulses: { path: Node[]; seg: number; t: number }[] = [];
    let raf = 0;
    let last = performance.now();
    let spawn = 0;
    let accent = "61,220,151";

    const build = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const counts = w < 600 ? [3, 5, 5, 2] : [4, 7, 8, 7, 3];
      nodes = [];
      layers = counts.map((c, li) => {
        const arr: Node[] = [];
        for (let i = 0; i < c; i++) {
          const n: Node = {
            x: (li / (counts.length - 1)) * (w * 0.9) + w * 0.05,
            y: h * 0.12 + ((i + 0.5) / c) * h * 0.76,
            layer: li,
            glow: 0,
          };
          arr.push(n);
          nodes.push(n);
        }
        return arr;
      });
      edges = [];
      for (let li = 0; li < layers.length - 1; li++)
        for (const a of layers[li])
          for (const b of layers[li + 1]) edges.push([a, b]);
    };

    const readAccent = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim();
      if (v) accent = v;
    };

    const spawnPulse = () => {
      const path: Node[] = [layers[0][Math.floor(Math.random() * layers[0].length)]];
      for (let li = 1; li < layers.length; li++) {
        const options = edges.filter(([a, b]) => a === path[li - 1] && b.layer === li).map(([, b]) => b);
        if (!options.length) break;
        path.push(options[Math.floor(Math.random() * options.length)]);
      }
      pulses.push({ path, seg: 0, t: 0 });
    };

    const draw = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        ctx.strokeStyle = `rgba(${accent},${0.16 + Math.max(a.glow, b.glow) * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      if (!reduce) {
        spawn -= dt;
        if (spawn <= 0) {
          spawnPulse();
          spawn = 450 + Math.random() * 500;
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.t += dt / 420;
          if (p.t >= 1) {
            p.path[p.seg + 1].glow = 1;
            p.seg++;
            p.t = 0;
            if (p.seg >= p.path.length - 1) {
              pulses.splice(i, 1);
              continue;
            }
          }
          const a = p.path[p.seg];
          const b = p.path[p.seg + 1];
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
          g.addColorStop(0, `rgba(${accent},0.85)`);
          g.addColorStop(1, `rgba(${accent},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 14, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      for (const n of nodes) {
        n.glow = Math.max(0, n.glow - dt / 700);
        ctx.fillStyle = `rgba(${accent},${0.5 + n.glow * 0.5})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3.5 + n.glow * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    build();
    readAccent();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(() => {
      build();
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);
    const mo = new MutationObserver(readAccent);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="hero-net" aria-hidden />;
}
