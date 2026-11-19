import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "./inkTrail.css";

// Red ink left on the desk by the fountain pen. A canvas the size of the world box, drawn from
// stroke segments that fade out on their own (so the desk never gets cluttered). The loop only
// runs while there are live segments.
export type InkHandle = {
  /** add a point of the current stroke, in the world's own CSS px */
  add: (x: number, y: number) => void;
  /** pen lifted: the next point starts a new stroke */
  lift: () => void;
};

type Seg = { x0: number; y0: number; x1: number; y1: number; t: number; w: number; c: number };

const HOLD = 2500; // ms fully visible
const LIFE = 11000; // ms until fully gone
const MAX_SEGS = 900;
const COLORS = ["107,15,20", "92,10,16", "122,20,24", "78,8,14"];
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const InkTrail = forwardRef<InkHandle>(function InkTrail(_, ref) {
  const cv = useRef<HTMLCanvasElement | null>(null);
  const segs = useRef<Seg[]>([]);
  const last = useRef<{ x: number; y: number; w: number } | null>(null);
  const raf = useRef(0);
  const clearTimer = useRef(0);
  const n = useRef(0);

  const render = () => {
    const c = cv.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = c.width / Math.max(1, c.clientWidth);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const now = performance.now();
    const live: Seg[] = [];
    for (const s of segs.current) {
      const age = now - s.t;
      if (age >= LIFE) continue;
      live.push(s);
      const a = (age < HOLD ? 1 : 1 - (age - HOLD) / (LIFE - HOLD)) * 0.88;
      ctx.beginPath();
      ctx.moveTo(s.x0, s.y0);
      ctx.lineTo(s.x1, s.y1);
      // soft bleed under the line
      ctx.strokeStyle = `rgba(${COLORS[s.c]},${(a * 0.22).toFixed(3)})`;
      ctx.lineWidth = s.w + 2.2;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${COLORS[s.c]},${a.toFixed(3)})`;
      ctx.lineWidth = s.w;
      ctx.stroke();
    }
    segs.current = live;
    if (live.length && !reduced()) raf.current = requestAnimationFrame(render);
    else raf.current = 0;
  };

  const kick = () => {
    if (reduced()) {
      render();
      // no fade animation: wipe the trail a few seconds after the last stroke
      window.clearTimeout(clearTimer.current);
      clearTimer.current = window.setTimeout(() => {
        segs.current = [];
        render();
      }, 6000);
    } else if (!raf.current) {
      raf.current = requestAnimationFrame(render);
    }
  };

  useImperativeHandle(ref, () => ({
    add(x, y) {
      const p = last.current;
      if (!p) {
        last.current = { x, y, w: 2.6 };
        return;
      }
      const dx = x - p.x;
      const dy = y - p.y;
      const d = Math.hypot(dx, dy);
      if (d < 1.5) return;
      // faster stroke = thinner line, smoothed so the width does not jump
      const target = Math.max(1.2, Math.min(3.2, 3.4 - d * 0.12));
      const w = p.w + (target - p.w) * 0.35;
      n.current += 1;
      segs.current.push({ x0: p.x, y0: p.y, x1: x, y1: y, t: performance.now(), w, c: (n.current >> 3) % COLORS.length });
      if (segs.current.length > MAX_SEGS) segs.current.splice(0, segs.current.length - MAX_SEGS);
      last.current = { x, y, w };
      kick();
    },
    lift() {
      last.current = null;
    },
  }));

  // keep the canvas bitmap in step with its CSS size (and the screen's pixel ratio)
  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(c.clientWidth * dpr));
      const h = Math.max(1, Math.round(c.clientHeight * dpr));
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
        render();
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      window.clearTimeout(clearTimer.current);
      raf.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={cv} className="ink-trail" aria-hidden="true" />;
});

export default InkTrail;
