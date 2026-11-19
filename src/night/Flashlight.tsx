import { useEffect, useRef } from "react";

const EASE = 0.14; // 0..1, how fast the light catches up with the pointer

// A soft torch-light around the mouse: one fixed div with a single radial-gradient, moved via CSS vars.
// Mouse only (not touch), off under prefers-reduced-motion.
export default function Flashlight() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || typeof window.matchMedia !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf = 0;
    let shown = false;

    const tick = () => {
      x += (tx - x) * EASE;
      y += (ty - y) * EASE;
      node.style.setProperty("--fx", `${x.toFixed(1)}px`);
      node.style.setProperty("--fy", `${y.toFixed(1)}px`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        node.classList.add("fl-on");
      }
      kick();
    };
    const hide = () => {
      shown = false;
      node.classList.remove("fl-on");
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) hide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("blur", hide);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="fl-light" ref={el} aria-hidden="true" />;
}
