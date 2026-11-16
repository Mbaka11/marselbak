import { projects } from "../content";
import type { CSSProperties } from "react";
import "./projectCards.css";

type Props = { lang: "en" | "fr" };

// Each project is a different professional's card: own stock, colour and typeface.
const STYLES = ["bone", "slate", "eggshell", "sand", "nimbus", "powder"] as const;
const POSES = [
  { r: -2.6, y: 6 },
  { r: 1.9, y: -4 },
  { r: 1.4, y: 10 },
  { r: -2.1, y: 0 },
  { r: -1.2, y: -8 },
  { r: 2.6, y: 4 },
];

export default function ProjectCards({ lang }: Props) {
  return (
    <section className="pc-root" aria-label={lang === "fr" ? "Projets" : "Projects"}>
      <ul className="pc-grid">
        {projects.map((p, i) => {
          const pose = POSES[i % POSES.length];
          const style = { "--r": `${pose.r}deg`, "--y": `${pose.y}px` } as CSSProperties;
          return (
            <li key={p.name} className="pc-slot" style={style}>
              <a className={`pc-card pc-${STYLES[i % STYLES.length]}`} href={p.url} target="_blank" rel="noopener noreferrer">
                <span className="pc-name">{p.name}</span>
                <span className="pc-rule" aria-hidden="true" />
                <span className="pc-desc">{p.desc[lang]}</span>
                <span className="pc-foot">
                  <span className="pc-tags">{p.tags.join(" · ")}</span>
                  <span className="pc-go" aria-hidden="true">↗</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
