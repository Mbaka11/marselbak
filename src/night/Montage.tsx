import { useEffect, useRef, useState } from "react";
import "./montage.css";

type Props = { lang: "en" | "fr" };

const T = {
  en: {
    title: "// montage_",
    intro: "I also edit videos for companies: promos, LED screen loops, ads.",
  },
  fr: {
    title: "// montage_",
    intro: "je monte aussi des vidéos pour des entreprises : promos, boucles d'écrans LED, pubs.",
  },
} as const;

// name = file in public/night/montage (mp4 + jpg poster), ar = width / height
const CLIPS = [
  { name: "film", ar: 16 / 9, label: { en: "promo film", fr: "film promo" } },
  { name: "led", ar: 516 / 1032, label: { en: "led loop", fr: "boucle led" } },
  { name: "clinic", ar: 516 / 1032, label: { en: "screen loop", fr: "boucle écran" } },
  { name: "ad", ar: 540 / 960, label: { en: "social ad", fr: "pub verticale" } },
] as const;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// A showcase strip of short muted loops: each one plays only while it is on screen.
export default function Montage({ lang }: Props) {
  const t = T[lang];
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const vids = Array.from(el.querySelectorAll("video"));
    const still = reduced();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === el && e.isIntersecting) setInView(true);
          if (e.target instanceof HTMLVideoElement && !still) {
            if (e.isIntersecting) e.target.play().catch(() => {});
            else e.target.pause();
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <section className={"mt-root" + (inView ? " in" : "")} ref={root}>
      <h2 className="mt-heading">{t.title}</h2>
      <p className="mt-intro">{t.intro}</p>
      <div className="mt-grid">
        {CLIPS.map((c, i) => (
          <figure key={c.name} className={"mt-item mt-" + c.name} style={{ ["--ar" as string]: c.ar, ["--i" as string]: i }}>
            <video
              src={`/night/montage/${c.name}.mp4`}
              poster={`/night/montage/${c.name}.jpg`}
              muted
              loop
              playsInline
              preload="none"
              aria-label={c.label[lang]}
            />
            <figcaption>{c.label[lang]}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
