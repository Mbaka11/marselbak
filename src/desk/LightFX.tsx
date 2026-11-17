import { useEffect, useRef } from "react";
import "./lightFx.css";

// Soft window light from the left: a slow breathing beam, a few dust motes
// drifting inside it, and a very light parallax with the pointer.
// Pure decoration: pointer-events none, off with prefers-reduced-motion.
export default function LightFX() {
  const root = useRef<HTMLDivElement | null>(null);
  const cv = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = root.current;
    const c = cv.current;
    if (!el || !c) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    // dust motes, kept in the beam area (left half, diagonal)
    const motes = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      vx: 0.004 + Math.random() * 0.008,
      vy: -0.002 + Math.random() * 0.004,
      p: Math.random() * 6.28,
    }));

    let mx = 0.5;
    let my = 0.5;
    let sx = 0.5;
    let sy = 0.5;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    let visible = !document.hidden;
    const onVis = () => {
      visible = !document.hidden;
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    function tick(t: number) {
      if (!visible) return;
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      // slow breathing (a cloud passing) and light parallax
      const breath = 0.5 + 0.5 * Math.sin(t / 5200) * Math.sin(t / 8300 + 1);
      sx += (mx - sx) * 0.03;
      sy += (my - sy) * 0.03;
      el!.style.setProperty("--lf-breath", breath.toFixed(3));
      el!.style.setProperty("--lf-sx", ((sx - 0.5) * 24).toFixed(2) + "px");
      el!.style.setProperty("--lf-sy", ((sy - 0.5) * 14).toFixed(2) + "px");

      ctx!.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx * dt;
        m.y += m.vy * dt + Math.sin(t / 2600 + m.p) * 0.00006;
        if (m.x > 1) m.x = 0;
        if (m.y < 0) m.y = 1;
        if (m.y > 1) m.y = 0;
        // only visible inside the diagonal beam, fading with distance from the left
        const px = m.x * w;
        const py = m.y * h;
        const inBeam = 1 - Math.min(1, Math.abs(py - (0.18 * h + px * 0.45)) / (h * 0.32));
        const fade = Math.max(0, 1 - m.x * 1.25);
        const a = inBeam * fade * (0.18 + 0.32 * breath) * (0.6 + 0.4 * Math.sin(t / 900 + m.p));
        if (a <= 0.01) continue;
        ctx!.fillStyle = `rgba(255,246,224,${a.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(px, py, m.r, 0, 6.2832);
        ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="lf-root" ref={root} aria-hidden>
      <div className="lf-beam" />
      <div className="lf-beam lf-beam-2" />
      <canvas className="lf-dust" ref={cv} />
      <div className="lf-vignette" />
    </div>
  );
}
