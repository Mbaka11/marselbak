import { useEffect, useRef, useState } from "react";

// A short glowing white line that runs around its parent's rounded border.
// The parent must be position: relative.
export default function Orbit({ radius, duration = 3 }: { radius: number | "circle"; duration?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => setSize({ w: parent.offsetWidth, h: parent.offsetHeight }));
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  const pad = 2;
  const w = size.w + pad * 2;
  const h = size.h + pad * 2;
  const r = radius === "circle" ? Math.min(w, h) / 2 : radius + pad;

  return (
    <svg ref={ref} className="nt-orbit" width={w} height={h} style={{ left: -pad, top: -pad }} aria-hidden>
      {size.w > 0 && (
        <rect
          x="1"
          y="1"
          width={w - 2}
          height={h - 2}
          rx={r}
          ry={r}
          pathLength={100}
          style={{ animationDuration: `${duration}s` }}
        />
      )}
    </svg>
  );
}
