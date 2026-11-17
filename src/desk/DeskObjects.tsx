import { useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import "./deskObjects.css";

type Props = { lang: "en" | "fr" };

// A loose object on the desk: springs a little on hover, can be dragged around, tap to nudge its angle.
function Loose({ cls, rot, children, label }: { cls: string; rot: number; children: ReactNode; label?: string }) {
  const [p, setP] = useState({ x: 0, y: 0, r: 0, drag: false });
  const d = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  const down = (e: RPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    d.current = { sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y, moved: false };
    setP((s) => ({ ...s, drag: true }));
  };
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const g = d.current;
    if (!g) return;
    const dx = e.clientX - g.sx;
    const dy = e.clientY - g.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) g.moved = true;
    setP((s) => ({ ...s, x: g.ox + dx, y: g.oy + dy }));
  };
  const up = () => {
    const g = d.current;
    d.current = null;
    setP((s) => ({ ...s, drag: false, r: g && !g.moved ? s.r + (Math.random() * 10 - 5) : s.r }));
  };

  const style = {
    "--rot": `${rot + p.r}deg`,
    "--dx": `${p.x}px`,
    "--dy": `${p.y}px`,
  } as CSSProperties;

  return (
    <div
      className={`do-item ${cls}${p.drag ? " is-drag" : ""}`}
      style={style}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      role="presentation"
      aria-label={label}
    >
      {children}
    </div>
  );
}

export default function DeskObjects({ lang }: Props) {
  const fr = lang === "fr";
  return (
    <div className="do-layer">
      <Loose cls="do-knife" rot={0}>
        <img src="/desk/knife.png" alt="" draggable={false} />
      </Loose>

      <Loose cls="do-postit do-nn do-gif" rot={-5}>
        <img src="/desk/gifs/network.gif" alt="" draggable={false} />
        <span>{fr ? "la politique apprend… ou pas" : "the policy learns… or not"}</span>
      </Loose>

      <Loose cls="do-postit do-reward do-gif" rot={3}>
        <img src="/desk/gifs/reward.gif" alt="" draggable={false} />
        <span>{fr ? "reward" : "reward"}</span>
      </Loose>

      <Loose cls="do-postit do-tree do-gif" rot={-4}>
        <img src="/desk/gifs/tree.gif" alt="" draggable={false} />
        <span>{fr ? "arbre de décision" : "decision tree"}</span>
      </Loose>

      <Loose cls="do-postit do-todo" rot={4}>
        <b>{fr ? "à faire" : "to do"}</b>
        <span>{fr ? "☐ lire le papier" : "☐ read the paper"}</span>
        <span>{fr ? "☒ lancer l'entraînement" : "☒ launch the run"}</span>
        <span>{fr ? "☐ dormir (peut-être)" : "☐ sleep (maybe)"}</span>
      </Loose>

      <Loose cls="do-clip" rot={24}>
        <svg viewBox="0 0 30 70" width="100%" aria-hidden>
          <path
            d="M9 52 V16 a6 6 0 0 1 12 0 V54 a9 9 0 0 1 -18 0 V22"
            fill="none"
            stroke="#9aa0a8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9 52 V16 a6 6 0 0 1 12 0" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.9" strokeLinecap="round" />
        </svg>
      </Loose>
    </div>
  );
}
