import { useEffect, useRef, useState } from "react";
import { useSettings } from "../settings";
import { education, experience, links, projects } from "../content";
import BusinessCard, { type Section } from "../components/BusinessCard";
import Logo from "../components/Logo";
import { GithubIcon, LinkedinIcon, MailIcon } from "../components/icons";
import "./desk.css";

// Scene audio window (seconds) inside /audio/scene.mp3. Adjust once the exact
// moment of the scene is chosen.
const SCENE_START = 0;
const SCENE_LENGTH = 18;

type Stage = "gate" | "intro" | "idle";

const LABELS = {
  en: {
    enter: "Enter",
    enterMuted: "Enter without sound",
    gateNote: "Sound on for the full effect.",
    title: "Machine Learning · Mila",
    close: "Put the sheet away",
    simple: "Simple view",
    sound: "Sound",
    sections: { experience: "Experience", projects: "Projects", education: "Education", contact: "Contact" },
    hint: "Flip the card to navigate",
  },
  fr: {
    enter: "Entrer",
    enterMuted: "Entrer sans le son",
    gateNote: "Active le son pour l'effet complet.",
    title: "Apprentissage automatique · Mila",
    close: "Ranger la feuille",
    simple: "Vue simple",
    sound: "Son",
    sections: { experience: "Expérience", projects: "Projets", education: "Formation", contact: "Contact" },
    hint: "Retourne la carte pour naviguer",
  },
} as const;

const orgLogo: Record<string, string | undefined> = {
  McKesson: "/logos/mckesson.png",
  "Intact Insurance": "/logos/intact.webp",
  "Radio-Canada / CBC": "/logos/radio-canada.png",
  Stingray: "/logos/stingray.png",
};

export default function DeskPage({ onSimple }: { onSimple: () => void }) {
  const { lang } = useSettings();
  const t = LABELS[lang];
  const cv = lang === "fr" ? "/cv-fr.pdf" : "/cv-en.pdf";
  const [stage, setStage] = useState<Stage>("gate");
  const [open, setOpen] = useState<Section | null>(null);
  const [muted, setMuted] = useState(false);
  const scene = useRef<HTMLAudioElement | null>(null);
  const slide = useRef<HTMLAudioElement | null>(null);
  const stopTimer = useRef<number>();

  const playSlide = (volume = 0.8) => {
    if (muted || !slide.current) return;
    slide.current.currentTime = 0;
    slide.current.volume = volume;
    slide.current.play().catch(() => {});
  };

  const stopScene = () => {
    const a = scene.current;
    if (!a) return;
    // short fade out
    const start = a.volume;
    let k = 0;
    const id = window.setInterval(() => {
      k++;
      a.volume = Math.max(0, start * (1 - k / 10));
      if (k >= 10) {
        window.clearInterval(id);
        a.pause();
      }
    }, 60);
  };

  const enter = (withSound: boolean) => {
    setMuted(!withSound);
    setStage("intro");
    if (withSound) {
      slide.current?.play().catch(() => {});
      const a = scene.current;
      if (a) {
        a.currentTime = SCENE_START;
        a.volume = 0.35;
        a.play().catch(() => {});
        stopTimer.current = window.setTimeout(stopScene, SCENE_LENGTH * 1000);
      }
    }
    window.setTimeout(() => setStage("idle"), 1100);
  };

  useEffect(() => {
    if (muted) {
      scene.current?.pause();
      slide.current?.pause();
    }
  }, [muted]);

  useEffect(
    () => () => {
      window.clearTimeout(stopTimer.current);
      scene.current?.pause();
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navigate = (s: Section) => {
    setOpen(s);
    playSlide(0.5);
  };

  return (
    <div className={`desk stage-${stage}${open ? " is-open" : ""}`}>
      <audio ref={scene} src="/audio/scene.mp3" preload="auto" />
      <audio ref={slide} src="/audio/card-slide.wav" preload="auto" />

      <div className="desk-surface" aria-hidden />
      <div className="desk-light" aria-hidden />

      <header className="nameplate">
        <span className="np-name">Marsel Bakashov</span>
        <span className="np-title">{t.title}</span>
      </header>

      <figure className="desk-frame" aria-hidden>
        <img src="/desk/brain.gif" alt="" />
      </figure>

      <nav className="desk-folders" aria-label="Sections">
        {(Object.keys(t.sections) as Section[]).map((s, i) => (
          <button
            key={s}
            className={"folder" + (open === s ? " active" : "")}
            style={{ ["--i" as string]: i }}
            onClick={() => navigate(s)}
          >
            {t.sections[s]}
          </button>
        ))}
      </nav>

      <div className="desk-pen" aria-hidden />

      {stage !== "gate" && (
        <div className="card-slot">
          <BusinessCard lang={lang} cvHref={cv} onNavigate={navigate} active={open} />
          {!open && <p className="desk-hint">{t.hint}</p>}
        </div>
      )}

      {open && (
        <article className="sheet" key={open} aria-live="polite">
          <BloodStain />
          <button className="sheet-close" onClick={() => setOpen(null)} aria-label={t.close}>
            ×
          </button>
          <h2 className="sheet-title">{t.sections[open]}</h2>
          <SheetBody section={open} />
        </article>
      )}
      {open && <Knife />}

      <div className="desk-tools">
        <button className="desk-chip" onClick={() => setMuted((m) => !m)} aria-pressed={!muted}>
          {muted ? "🔇" : "🔊"} {t.sound}
        </button>
        <button className="desk-chip" onClick={onSimple}>
          {t.simple}
        </button>
      </div>

      {stage === "gate" && (
        <div className="gate">
          <button className="gate-enter" onClick={() => enter(true)}>
            {t.enter}
          </button>
          <p className="gate-note">{t.gateNote}</p>
          <button className="gate-mute" onClick={() => enter(false)}>
            {t.enterMuted}
          </button>
        </div>
      )}
    </div>
  );
}

function SheetBody({ section }: { section: Section }) {
  const { lang } = useSettings();
  if (section === "experience")
    return (
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
    );
  if (section === "projects")
    return (
      <ol className="sheet-list">
        {projects.map((p) => (
          <li key={p.name}>
            <a href={p.url} target="_blank" rel="noreferrer" className="sheet-link">
              <strong>{p.name}</strong> ↗
            </a>
            <p>{p.desc[lang]}</p>
            <span className="sheet-meta">{p.tags.join(" · ")}</span>
          </li>
        ))}
      </ol>
    );
  if (section === "education")
    return (
      <ol className="sheet-list">
        {education.map((e) => (
          <li key={e.degree.en}>
            <strong>{e.degree[lang]}</strong>
            <span className="sheet-meta">
              {e.school[lang]} · {e.period}
            </span>
          </li>
        ))}
      </ol>
    );
  return (
    <div className="sheet-contact">
      <a href={`mailto:${links.email}`}>
        <MailIcon /> {links.email}
      </a>
      <a href={links.linkedin} target="_blank" rel="noreferrer">
        <LinkedinIcon /> LinkedIn
      </a>
      <a href={links.github} target="_blank" rel="noreferrer">
        <GithubIcon /> GitHub
      </a>
    </div>
  );
}

function BloodStain() {
  return (
    <svg className="stain" viewBox="0 0 120 120" aria-hidden>
      <path
        d="M58 14c14 2 30 10 34 26 4 14-6 22 2 34 6 10-4 24-20 26-12 2-18-8-30-6-14 2-26-6-26-20 0-12 10-14 8-26-2-14 6-24 18-28 4-2 10-6 14-6Z"
        fill="#7a0d0d"
        opacity=".55"
      />
      <circle cx="100" cy="22" r="5" fill="#7a0d0d" opacity=".5" />
      <circle cx="16" cy="96" r="3.5" fill="#7a0d0d" opacity=".45" />
      <circle cx="104" cy="98" r="2.5" fill="#7a0d0d" opacity=".45" />
    </svg>
  );
}

function Knife() {
  return (
    <svg className="knife" viewBox="0 0 60 300" aria-hidden>
      <defs>
        <linearGradient id="blade" x1="0" x2="1">
          <stop offset="0" stopColor="#f2f4f7" />
          <stop offset=".5" stopColor="#b9bfc8" />
          <stop offset="1" stopColor="#8a919c" />
        </linearGradient>
      </defs>
      <path d="M22 10 C40 40 42 120 38 175 L22 175 Z" fill="url(#blade)" />
      <rect x="16" y="175" width="28" height="8" rx="2" fill="#555" />
      <rect x="19" y="183" width="22" height="105" rx="8" fill="#1d1a17" />
      <circle cx="30" cy="205" r="2.5" fill="#999" />
      <circle cx="30" cy="235" r="2.5" fill="#999" />
      <circle cx="30" cy="265" r="2.5" fill="#999" />
    </svg>
  );
}
