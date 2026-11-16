import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { useSettings } from "../settings";
import { experience } from "../content";
import BusinessCard, { type Section } from "../components/BusinessCard";
import Logo from "../components/Logo";
import ProjectCards from "../desk/ProjectCards";
import EducationCoat from "../desk/EducationCoat";
import ContactBlood from "../desk/ContactBlood";
import "./desk.css";

type Stage = "intro" | "idle";

const LABELS = {
  en: { title: "Machine Learning · Mila", close: "Put the sheet away", experience: "Experience", hint: "Flip the card" },
  fr: { title: "Apprentissage automatique · Mila", close: "Ranger la feuille", experience: "Expérience", hint: "Retourne la carte" },
} as const;

const orgLogo: Record<string, string | undefined> = {
  McKesson: "/logos/mckesson.png",
  "Intact Insurance": "/logos/intact.webp",
  "Radio-Canada / CBC": "/logos/radio-canada.png",
  Stingray: "/logos/stingray.png",
};

export default function DeskPage() {
  const { lang } = useSettings();
  const t = LABELS[lang];
  const cv = lang === "fr" ? "/cv-fr.pdf" : "/cv-en.pdf";
  const [stage, setStage] = useState<Stage>("intro");
  const [open, setOpen] = useState<Section | null>(null);
  const scene = useRef<HTMLAudioElement | null>(null);

  // The card is thrown on load. Browsers block sound until the visitor
  // interacts, so we try right away and otherwise start on the first click.
  useEffect(() => {
    const start = () => {
      const a = scene.current;
      if (!a || !a.paused) return;
      a.volume = 0.35;
      a.play().catch(() => {});
    };
    scene.current?.play().catch(() => {});
    if (scene.current) scene.current.volume = 0.35;
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    const id = window.setTimeout(() => setStage("idle"), 1100);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      scene.current?.pause();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navigate = (s: Section) => {
    setOpen(s);
  };
  const close = () => setOpen(null);

  return (
    <div className={`desk stage-${stage}${open ? " is-open" : ""}`}>
      <audio ref={scene} src="/audio/scene.mp3" preload="auto" />

      <div className="desk-surface" aria-hidden />
      <div className="desk-pad" aria-hidden />
      <div className="desk-light" aria-hidden />

      <header className="nameplate">
        <span className="np-name">Marsel Bakashov</span>
        <span className="np-rule" aria-hidden />
        <span className="np-title">{t.title}</span>
      </header>

      <figure className="desk-frame" aria-hidden>
        <img src="/desk/brain.gif" alt="" />
      </figure>

      <Knife />
      <Pen />

      <div className="card-slot">
        <BusinessCard lang={lang} cvHref={cv} onNavigate={navigate} active={open} />
        {!open && <p className="desk-hint">{t.hint}</p>}
      </div>

      {open && (
        <div className="stage-area" key={open}>
          {open === "experience" && (
            <article className="sheet" aria-live="polite">
              <button className="sheet-close" onClick={close} aria-label={t.close}>
                ×
              </button>
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
          )}
          {open === "projects" && <ProjectCards lang={lang} onClose={close} />}
          {open === "education" && <EducationCoat lang={lang} onClose={close} />}
          {open === "contact" && <ContactBlood lang={lang} onClose={close} />}
        </div>
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
        {/* nib */}
        <path d="M12 0 C 15 10 17 22 17 34 L7 34 C7 22 9 10 12 0Z" fill="url(#pg)" />
        <path d="M12 6 V28" stroke="#4a3810" strokeWidth="0.8" />
        <circle cx="12" cy="26" r="1" fill="#4a3810" />
        {/* section + barrel */}
        <rect x="6" y="34" width="12" height="26" rx="2" fill="#0b0b0d" />
        <rect x="4" y="60" width="16" height="6" fill="url(#pg)" />
        <rect x="3" y="66" width="18" height="170" rx="9" fill="url(#pb)" />
        <rect x="3" y="150" width="18" height="3.5" fill="url(#pg)" />
        <rect x="5.6" y="70" width="2.6" height="156" rx="1.3" fill="#fff" fillOpacity="0.2" />
      </svg>
    </div>
  );
}

function Knife() {
  // Full-tang chef's knife, seen from above. Sober: steel, black handle, three rivets.
  return (
    <svg className="knife" viewBox="0 0 640 150" aria-hidden>
      <defs>
        <linearGradient id="kb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f6f8" />
          <stop offset="0.18" stopColor="#c9ced4" />
          <stop offset="0.5" stopColor="#8d949c" />
          <stop offset="0.52" stopColor="#b9bfc6" />
          <stop offset="1" stopColor="#e9ecef" />
        </linearGradient>
        <linearGradient id="kh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2b2d" />
          <stop offset="0.45" stopColor="#141415" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <clipPath id="kc"><path d="M214 38 L536 38 C590 40 624 56 636 74 C560 98 400 100 214 94 Z" /></clipPath>
      </defs>
      {/* blade: spine on top, belly curving down to the tip on the right */}
      <path d="M214 38 L536 38 C590 40 624 56 636 74 C560 98 400 100 214 94 Z" fill="url(#kb)" />
      <g clipPath="url(#kc)">
        <path d="M214 62 C330 66 480 70 636 74" stroke="#7a8189" strokeWidth="1.2" fill="none" opacity="0.8" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <path key={i} d={`M${230 + i * 6} ${44 + i * 5} L${540 + i * 6} ${44 + i * 5}`} stroke="#fff" strokeOpacity="0.07" strokeWidth="1" fill="none" />
        ))}
        <path d="M214 94 C400 100 560 98 636 74" stroke="#fdfdfd" strokeWidth="2" fill="none" opacity="0.9" />
      </g>
      {/* bolster */}
      <path d="M196 36 L218 38 L218 96 L196 98 Z" fill="#aeb4bb" />
      <path d="M196 36 L218 38 L218 46 L196 44 Z" fill="#e8ebee" />
      {/* handle with steel tang edge visible */}
      <path d="M20 54 C20 46 32 44 46 44 L196 44 L196 90 L46 90 C32 90 20 88 20 80 Z" fill="url(#kh)" />
      <path d="M26 49 H196" stroke="#8c8c8c" strokeOpacity="0.55" strokeWidth="1.2" />
      <path d="M26 50.5 L196 50.5" stroke="#d8d8d8" strokeOpacity="0.15" strokeWidth="3" />
      {[70, 118, 166].map((x) => (
        <g key={x}>
          <circle cx={x} cy="67" r="6.2" fill="#b9bec4" />
          <circle cx={x - 1.5} cy="65.5" r="2" fill="#fff" fillOpacity="0.85" />
        </g>
      ))}
    </svg>
  );
}
