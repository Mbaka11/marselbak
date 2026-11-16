import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Generated animated background: drifting radial gradients + particles + grain.
 * To swap for a video/image: replace the <canvas> below by
 * <video className="nt-bg-media" autoPlay muted loop playsInline src="/night/bg.mp4" />.
 */
export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const blobs = [
      { x: 0.2, y: 0.3, r: 0.55, c: "61,220,151", s: 0.00011, p: 0 },
      { x: 0.8, y: 0.2, r: 0.5, c: "90,100,255", s: 0.00009, p: 2 },
      { x: 0.6, y: 0.85, r: 0.6, c: "180,70,200", s: 0.00013, p: 4 },
    ];
    const parts = Array.from({ length: 60 }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random() * 0.8 + 0.2, v: Math.random() * 0.00004 + 0.00001,
    }));
    const draw = (t: number) => {
      ctx.fillStyle = "#0b0d12";
      ctx.fillRect(0, 0, w, h);
      for (const b of blobs) {
        const cx = (b.x + Math.sin(t * b.s + b.p) * 0.12) * w;
        const cy = (b.y + Math.cos(t * b.s * 1.3 + b.p) * 0.12) * h;
        const r = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${b.c},0.16)`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      for (const p of parts) {
        if (!reduced) { p.y -= p.v * 16; if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); } }
        ctx.fillStyle = `rgba(255,255,255,${0.12 + p.z * 0.35})`;
        ctx.fillRect(p.x * w, p.y * h, p.z * 1.6, p.z * 1.6);
      }
    };
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };
    if (reduced) draw(0); else raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [reduced]);

  return (
    <div className="nt-bg" aria-hidden="true">
      <canvas ref={ref} className="nt-bg-media" />
      <div className="nt-grain" />
      <div className="nt-vignette" />
    </div>
  );
}
