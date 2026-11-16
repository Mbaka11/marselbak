import { links } from "../content";
import "./contactBlood.css";

type Props = { lang: "en" | "fr" };

// public/desk/contact-pool.png: a pool of blood with the logos and text wiped
// through it by a finger (rendered by a height-field script).
// Boxes are in image pixels.
const W = 1900;
const H = 1100;
const BOXES = {
  mail: [260, 210, 1565, 390],
  in: [260, 460, 1092, 640],
  gh: [260, 710, 1085, 890],
} as const;

const pct = (b: readonly number[]) => ({
  left: `${(b[0] / W) * 100}%`,
  top: `${(b[1] / H) * 100}%`,
  width: `${((b[2] - b[0]) / W) * 100}%`,
  height: `${((b[3] - b[1]) / H) * 100}%`,
});

export default function ContactBlood({ lang }: Props) {
  const items = [
    { key: "mail", href: `mailto:${links.email}`, label: "Email", title: links.email, ext: false },
    { key: "in", href: links.linkedin, label: "LinkedIn", title: lang === "fr" ? "Profil professionnel" : "Professional profile", ext: true },
    { key: "gh", href: links.github, label: "GitHub", title: links.github.replace(/^https?:\/\//, ""), ext: true },
  ] as const;

  return (
    <section className="cb-root" aria-label="Contact">
      <div className="cb-stage">
        <img className="cb-pool" src="/desk/contact-pool.png" alt="" draggable={false} />
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
