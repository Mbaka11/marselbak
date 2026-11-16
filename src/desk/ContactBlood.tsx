import { links } from "../content";
import "./contactBlood.css";

type Props = { lang: "en" | "fr"; onClose: () => void };

// Words are written with a finger in blood (public/desk/contact-blood.png,
// rendered by a height-field script). Boxes are in image pixels.
const W = 1400;
const H = 980;
const BOXES = {
  mail: [90, 100, 616, 330],
  in: [148, 388, 1000, 640],
  gh: [107, 678, 835, 960],
} as const;

const pct = (b: readonly number[]) => ({
  left: `${(b[0] / W) * 100}%`,
  top: `${(b[1] / H) * 100}%`,
  width: `${((b[2] - b[0]) / W) * 100}%`,
  height: `${((b[3] - b[1]) / H) * 100}%`,
});

export default function ContactBlood({ lang, onClose }: Props) {
  const items = [
    { key: "mail", href: `mailto:${links.email}`, label: "Email", title: links.email, ext: false },
    { key: "in", href: links.linkedin, label: "LinkedIn", title: lang === "fr" ? "Profil professionnel" : "Professional profile", ext: true },
    { key: "gh", href: links.github, label: "GitHub", title: links.github.replace(/^https?:\/\//, ""), ext: true },
  ] as const;

  return (
    <section className="cb-root" aria-label="Contact">
      <button type="button" className="cb-close" onClick={onClose} aria-label={lang === "fr" ? "Fermer" : "Close"}>
        ×
      </button>
      <div className="cb-stage">
        <img className="cb-writing" src="/desk/contact-blood.png" alt="" draggable={false} />
        {items.map((it) => (
          <a
            key={it.key}
            className="cb-hit"
            style={pct(BOXES[it.key])}
            href={it.href}
            title={it.title}
            aria-label={`${it.label} — ${it.title}`}
            {...(it.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          />
        ))}
      </div>
    </section>
  );
}
