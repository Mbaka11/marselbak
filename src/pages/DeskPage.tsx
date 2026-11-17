import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { useSettings } from "../settings";
import { experience } from "../content";
import BusinessCard, { type Section } from "../components/BusinessCard";
import Logo from "../components/Logo";
import ProjectCards from "../desk/ProjectCards";
import EducationCoat from "../desk/EducationCoat";
import ContactBlood from "../desk/ContactBlood";
import LightFX from "../desk/LightFX";
import StreetEgg from "../desk/StreetEgg";
import DeskObjects from "../desk/DeskObjects";
import "./desk.css";

type View = "home" | Section;

const LABELS = {
  en: { title: "Machine Learning · Mila", back: "Back to center", experience: "Experience", hint: "Flip the card" },
  fr: { title: "Apprentissage automatique · Mila", back: "Retour au centre", experience: "Expérience", hint: "Retourne la carte" },
} as const;

const orgLogo: Record<string, string | undefined> = {
  McKesson: "/logos/mckesson.png",
  "Intact Insurance": "/logos/intact.webp",
  "Radio-Canada / CBC": "/logos/radio-canada.png",
  Stingray: "/logos/stingray.png",
};

// Zones that are out of frame are inert: no tab focus, no hover, no screen-reader noise.
const inert = (off: boolean) => (off ? ({ inert: "", "aria-hidden": true } as object) : {});

export default function DeskPage() {
  const { lang, muted } = useSettings();
  const t = LABELS[lang];
  const cv = lang === "fr" ? "/cv-fr.pdf" : "/cv-en.pdf";
  const [view, setView] = useState<View>("home");
  const scene = useRef<HTMLAudioElement | null>(null);

  // The scene audio can only start after a user gesture, so try right away and
  // fall back to the first click or key press.
  useEffect(() => {
    const a = scene.current;
    if (!a) return;
    a.volume = 0.22;
    const start = () => {
      if (a.paused) a.play().catch(() => {});
    };
    start();
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      a.pause();
    };
  }, []);
  useEffect(() => {
    if (scene.current) scene.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView("home");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`desk view-${view}`}>
      <audio ref={scene} src="/audio/scene.mp3" preload="auto" loop />
      <LightFX />
      <StreetEgg active={view === "home"} lang={lang} />

      <div className="world">
        <div className="table" aria-hidden />

        {/* home */}
        <header className="nameplate" {...inert(view !== "home")}>
          <span className="np-name">Marsel Bakashov</span>
          <span className="np-rule" aria-hidden />
          <span className="np-title">{t.title}</span>
        </header>
        <figure className="desk-frame" aria-hidden>
          <img src="/desk/brain.gif" alt="" />
        </figure>
        <Pen />
        <DeskObjects lang={lang} />
        {/* up: experience */}
        <div className="zone zone-experience" {...inert(view !== "experience")}>
          <div className="sheet-wrap">
            <article className="sheet">
              <h2 className="sheet-title">{t.experience}</h2>
              <ol className="sheet-list">
                {experience.map((e) => (
                  <li key={e.org}>
                    <div className="sheet-head">
                      <Logo src={orgLogo[e.org]} name={e.org} size={30} />
                      <div>
                        <strong>{e.title[lang]}</strong>
                        <span className="sheet-meta">
                          {e.org} · {e.period}
                        </span>
                      </div>
                    </div>
                    <ul>
                      {e.points[lang].map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </article>
            <img className="sheet-stain" src="/desk/paper-stain.png" alt="" draggable={false} />
          </div>
        </div>

        {/* right: projects */}
        <div className="zone zone-projects" {...inert(view !== "projects")}>
          <ProjectCards lang={lang} />
        </div>

        {/* left: education */}
        <div className="zone zone-education" {...inert(view !== "education")}>
          <EducationCoat lang={lang} />
        </div>

        {/* down: contact */}
        <div className="zone zone-contact" {...inert(view !== "contact")}>
          <ContactBlood lang={lang} />
        </div>
      </div>

      {/* the card never leaves: centred at home, docked in the corner elsewhere */}
      <div className={`card-slot${view === "home" ? "" : " is-docked"}`}>
        <BusinessCard lang={lang} cvHref={cv} onNavigate={(s) => setView(s)} active={view === "home" ? null : view} />
        <p className="desk-hint">{t.hint}</p>
      </div>
      {view !== "home" && (
        <button className="home-pill" onClick={() => setView("home")}>
          {t.back}
        </button>
      )}
    </div>
  );
}

// Fountain pen: drag it around the desk, tap to rotate it.
function Pen() {
  const [pos, setPos] = useState({ x: 0, y: 0, r: 32 });
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  const down = (e: RPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false };
  };
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    setPos((p) => ({ ...p, x: d.ox + dx, y: d.oy + dy }));
  };
  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) setPos((p) => ({ ...p, r: p.r + 45 }));
  };

  return (
    <div
      className="desk-pen"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.r}deg)` }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      role="presentation"
    >
      <svg viewBox="0 0 24 240" width="100%" height="100%" aria-hidden>
        <defs>
          <linearGradient id="pb" x1="0" x2="1">
            <stop offset="0" stopColor="#050506" />
            <stop offset="0.28" stopColor="#3a3b42" />
            <stop offset="0.4" stopColor="#15151a" />
            <stop offset="1" stopColor="#020203" />
          </linearGradient>
          <linearGradient id="pg" x1="0" x2="1">
            <stop offset="0" stopColor="#8a6a24" />
            <stop offset="0.4" stopColor="#f0d98e" />
            <stop offset="1" stopColor="#7a5c1c" />
          </linearGradient>
        </defs>
        <path d="M12 0 C 15 10 17 22 17 34 L7 34 C7 22 9 10 12 0Z" fill="url(#pg)" />
        <path d="M12 6 V28" stroke="#4a3810" strokeWidth="0.8" />
        <circle cx="12" cy="26" r="1" fill="#4a3810" />
        <rect x="6" y="34" width="12" height="26" rx="2" fill="#0b0b0d" />
        <rect x="4" y="60" width="16" height="6" fill="url(#pg)" />
        <rect x="3" y="66" width="18" height="170" rx="9" fill="url(#pb)" />
        <rect x="3" y="150" width="18" height="3.5" fill="url(#pg)" />
        <rect x="5.6" y="70" width="2.6" height="156" rx="1.3" fill="#fff" fillOpacity="0.2" />
      </svg>
    </div>
  );
}
