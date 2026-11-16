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
  const slide = useRef<HTMLAudioElement | null>(null);

  // The card is thrown on load. Browsers block sound until the visitor
  // interacts, so we try right away and otherwise start on the first click.
  useEffect(() => {
    const start = () => {
      const a = scene.current;
      if (!a || !a.paused) return;
      a.volume = 0.35;
      a.play().catch(() => {});
    };
    slide.current?.play().catch(() => {});
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
    const a = slide.current;
    if (a) {
      a.currentTime = 0;
      a.volume = 0.5;
      a.play().catch(() => {});
    }
  };
  const close = () => setOpen(null);

  return (
    <div className={`desk stage-${stage}${open ? " is-open" : ""}`}>
      <audio ref={scene} src="/audio/scene.mp3" preload="auto" />
      <audio ref={slide} src="/audio/card-slide.wav" preload="auto" />

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
              <Splatter />
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
      <span className="pen-nib" />
      <span className="pen-clip" />
    </div>
  );
}

function Splatter() {
  return (
    <svg className="splatter" viewBox="0 0 300 300" aria-hidden>
      <defs>
        <radialGradient id="bl" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#c0141a" />
          <stop offset=".7" stopColor="#8e0a0f" />
          <stop offset="1" stopColor="#5a0508" />
        </radialGradient>
      </defs>
      <path
        d="M150 52c22 4 30 26 52 26 24 0 40 20 32 42-6 18 14 30 6 52-8 22-34 18-44 36-10 20-36 30-56 18-18-10-30 4-50-6-22-12-14-34-30-48-16-14-22-40-2-56 16-12 8-34 28-46 20-12 40-22 64-18Z"
        fill="url(#bl)"
      />
      <ellipse cx="128" cy="104" rx="26" ry="10" fill="#fff" opacity=".18" transform="rotate(-25 128 104)" />
      {[
        [262, 70, 9],
        [276, 104, 5],
        [40, 250, 11],
        [22, 222, 6],
        [250, 250, 7],
        [70, 40, 6],
        [286, 180, 4],
        [196, 286, 5],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#8e0a0f" />
      ))}
      <path d="M232 210c6 18 4 40 0 70" stroke="#8e0a0f" strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Knife() {
  return (
    <svg className="knife" viewBox="0 0 120 520" aria-hidden>
      <defs>
        <linearGradient id="kb" x1="0" x2="1">
          <stop offset="0" stopColor="#fafbfc" />
          <stop offset=".35" stopColor="#d9dde3" />
          <stop offset=".55" stopColor="#9aa1ab" />
          <stop offset="1" stopColor="#5f6670" />
        </linearGradient>
        <linearGradient id="kh" x1="0" x2="1">
          <stop offset="0" stopColor="#2a211b" />
          <stop offset=".5" stopColor="#4a3a2e" />
          <stop offset="1" stopColor="#1a1410" />
        </linearGradient>
      </defs>
      {/* blade: long chef knife, edge on the right */}
      <path d="M44 300 L44 40 C44 18 58 6 70 4 C78 60 86 160 84 300 Z" fill="url(#kb)" />
      <path d="M48 300 L48 46 C48 28 56 16 64 12" stroke="#fff" strokeOpacity=".7" strokeWidth="2" fill="none" />
      <path d="M70 4 C78 60 86 160 84 300" stroke="#4b525c" strokeWidth="1.2" fill="none" />
      {/* blood on the tip */}
      <path d="M50 30 C56 14 66 8 70 6 C74 30 74 60 70 78 C64 70 56 72 52 62 Z" fill="#8e0a0f" opacity=".85" />
      {/* bolster */}
      <rect x="38" y="298" width="52" height="16" rx="4" fill="#b8bdc4" />
      <rect x="38" y="298" width="52" height="5" rx="2" fill="#e8ebee" />
      {/* handle */}
      <path d="M42 314 H86 C90 380 90 450 82 508 C70 518 56 518 46 508 C38 450 38 380 42 314 Z" fill="url(#kh)" />
      {[350, 410, 470].map((y) => (
        <circle key={y} cx="64" cy={y} r="5" fill="#c9cdd2" stroke="#6b7078" />
      ))}
    </svg>
  );
}
