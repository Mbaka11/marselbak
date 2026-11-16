import { projects } from "../content";
import type { CSSProperties } from "react";
import "./projectCards.css";

type Props = { lang: "en" | "fr"; onClose: () => void };

// Fixed "random" landing pose per card: rotation (deg), nudge (px), fall-in drift (px).
const POSES = [
  { r: -4.5, dx: 6, dy: 4, fx: -40, fr: -18 },
  { r: 3.2, dx: -8, dy: 14, fx: 50, fr: 14 },
  { r: 2.1, dx: 10, dy: -6, fx: -30, fr: 10 },
  { r: -3.6, dx: -4, dy: 6, fx: 36, fr: -16 },
  { r: -1.8, dx: 4, dy: -10, fx: -46, fr: -12 },
  { r: 4.1, dx: -10, dy: 0, fx: 28, fr: 20 },
];

const VARIANTS = ["bone", "eggshell", "nimbus", "offwhite"] as const;

export default function ProjectCards({ lang, onClose }: Props) {
  return (
    <section className="pc-root" aria-labelledby="pc-title">
      <button type="button" className="pc-close" onClick={onClose} aria-label={lang === "fr" ? "Fermer" : "Close"}>
        ×
      </button>
      <h2 id="pc-title" className="pc-title">
        {lang === "fr" ? "Projets" : "Projects"}
      </h2>
      <ul className="pc-spread">
        {projects.map((p, i) => {
          const pose = POSES[i % POSES.length];
          const variant = VARIANTS[i % VARIANTS.length];
          const style = {
            "--i": i,
            "--r": `${pose.r}deg`,
            "--dx": `${pose.dx}px`,
            "--dy": `${pose.dy}px`,
            "--fx": `${pose.fx}px`,
            "--fr": `${pose.fr}deg`,
          } as CSSProperties;
          return (
            <li key={p.name} className="pc-slot" style={style}>
              <a className={`pc-card pc-${variant}`} href={p.url} target="_blank" rel="noopener noreferrer">
                <span className="pc-top" aria-hidden="true">
                  <span>No. {String(i + 1).padStart(2, "0")}</span>
                  <span>GitHub ↗</span>
                </span>
                <span className="pc-name">{p.name}</span>
                <span className="pc-rule" aria-hidden="true" />
                <span className="pc-desc">{p.desc[lang]}</span>
                <span className="pc-tags">{p.tags.join(" · ")}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
