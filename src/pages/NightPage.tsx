import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "../content";
import { useSettings } from "../settings";
import Background from "../night/Background";
import Player from "../night/Player";
import ProfileCard from "../night/ProfileCard";
import { montage } from "../night/montage";
import { bios, NAME, t } from "../night/strings";
import { useAudio } from "../night/useAudio";
import { useReducedMotion } from "../night/useReducedMotion";
import { useTypewriter } from "../night/useTypewriter";
import { fetchViews } from "../night/views";
import "../night/night.css";

export default function NightPage() {
  const { lang } = useSettings();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const shakeTimer = useRef(0);
  const [views, setViews] = useState<number | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  const audio = useAudio(root);

  const shake = useCallback(() => {
    const el = root.current;
    if (!el || reduced) return;
    el.classList.remove("nt-shake");
    void el.offsetWidth;
    el.classList.add("nt-shake");
    clearTimeout(shakeTimer.current);
    shakeTimer.current = window.setTimeout(() => el.classList.remove("nt-shake"), 120);
  }, [reduced]);

  const { nameOut, bioOut } = useTypewriter(NAME, bios.map((b) => b[lang]), reduced, shake);

  useEffect(() => {
    const ac = new AbortController();
    fetchViews(ac.signal).then(setViews);
    return () => { ac.abort(); clearTimeout(shakeTimer.current); };
  }, []);

  const closePlayer = useCallback(() => setPlayerOpen(false), []);

  return (
    <div className="nt-root" ref={root}>
      <Background />

      <section className="nt-hero">
        <ProfileCard
          bio={bioOut}
          nameOut={nameOut}
          views={views}
          playing={audio.playing}
          onOpenPlayer={() => setPlayerOpen(true)}
        />
        <a className="nt-scroll" href="#nt-projects" aria-label={t.scroll[lang]}>
          <span>{t.scroll[lang]}</span>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M5 8l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      <section className="nt-section" id="nt-projects">
        <h2>{t.projects[lang]}</h2>
        <div className="nt-grid">
          {projects.map((p) => (
            <a key={p.name} className="nt-tile" href={p.url} target="_blank" rel="noreferrer">
              <h3>{p.name}</h3>
              <p>{p.desc[lang]}</p>
              <div className="nt-tags">{p.tags.map((g) => <span key={g}>{g}</span>)}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="nt-section">
        <h2>{t.montage[lang]}</h2>
        <div className="nt-grid">
          {montage.map((m) => (
            <a key={m.title} className="nt-tile" href={m.url} target="_blank" rel="noreferrer">
              <h3>{m.title}</h3>
              <p>{m.desc[lang]}</p>
              <div className="nt-tags">{m.tags.map((g) => <span key={g}>{g}</span>)}</div>
            </a>
          ))}
        </div>
      </section>

      {playerOpen && <Player audio={audio} onClose={closePlayer} />}
    </div>
  );
}
