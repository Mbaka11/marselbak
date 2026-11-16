import { useEffect, useRef } from "react";

// Night background: a rainy city at night seen through wet glass.
// Blurred bokeh lights drift slowly, rain streaks fall, fog breathes.
// To use a video instead, drop public/night/bg.mp4 and set VIDEO to its path.
const VIDEO = "";

export default function RainBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (VIDEO) return;
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const colors = ["255,90,70", "255,170,80", "90,150,255", "255,255,255", "200,60,60", "120,200,255"];
    type B = { x: number; y: number; r: number; c: string; a: number; vx: number; ph: number };
    type R = { x: number; y: number; l: number; v: number };
    let bokeh: B[] = [];
    let rain: R[] = [];

    const init = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
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
    };

    const draw = (t: number) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#07090d");
      g.addColorStop(0.55, "#0d1118");
      g.addColorStop(1, "#050608");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const b of bokeh) {
        const flick = 0.75 + 0.25 * Math.sin(t / 900 + b.ph);
        const rg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        rg.addColorStop(0, `rgba(${b.c},${b.a * flick})`);
        rg.addColorStop(0.7, `rgba(${b.c},${b.a * 0.5 * flick})`);
        rg.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        if (!reduce) {
          b.x += b.vx;
          if (b.x < -50) b.x = w + 50;
          if (b.x > w + 50) b.x = -50;
        }
      }
      ctx.globalCompositeOperation = "source-over";
      // fog
      const fog = ctx.createRadialGradient(w * 0.5, h * 0.75, 0, w * 0.5, h * 0.75, w * 0.7);
      fog.addColorStop(0, `rgba(160,170,185,${0.07 + 0.03 * Math.sin(t / 3000)})`);
      fog.addColorStop(1, "rgba(160,170,185,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, w, h);
      // rain
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
