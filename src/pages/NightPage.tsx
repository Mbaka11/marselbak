import { useCallback, useEffect, useRef, useState } from "react";
import { links, projects } from "../content";
import { useSettings } from "../settings";
import RainBackground from "../night/RainBackground";
import Orbit from "../night/Orbit";
import { tracks, trackUrl } from "../night/tracks";
import { fetchViews } from "../night/views";
import "../night/night.css";

const NAME = "Marsel Bak";
const BIOS = {
  en: ['"ML @ Mila"', "reinforcement learning", '"it works on my machine"', "training agents", '"one more epoch"', "video editing"],
  fr: ['"ML @ Mila"', "apprentissage par renforcement", '"ça marche chez moi"', "j'entraîne des agents", '"encore une epoch"', "montage vidéo"],
};
const T = {
  en: { views: "profile views", listening: "listening to", online: "online", scroll: "SCROLL", projects: "// projects_" },
  fr: { views: "vues du profil", listening: "écoute", online: "en ligne", scroll: "SCROLL", projects: "// projets_" },
};

const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Typewriter: random small "glitch" jitter on the text only, like the reference.
function useTypewriter(lang: "en" | "fr") {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [glitchName, setGlitchName] = useState(false);
  const [glitchBio, setGlitchBio] = useState(false);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (reduced()) {
      setName(NAME);
      setBio(BIOS[lang][0]);
      return;
    }
    let alive = true;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => alive && fn(), ms));
    const glitch = (set: (v: boolean) => void) => {
      if (Math.random() < 0.1) {
        set(true);
        later(() => set(false), 200);
      }
    };

    let ni = 0, nDel = false;
    const tickName = () => {
      if (!nDel && ni < NAME.length) ni++;
      else if (nDel && ni > 0) ni--;
      else if (ni === NAME.length) {
        nDel = true;
        return later(tickName, 10000);
      } else nDel = false;
      setName(NAME.slice(0, ni));
      glitch(setGlitchName);
      later(tickName, nDel ? 150 : 300);
    };

    const msgs = BIOS[lang];
    let bi = 0, mi = 0, bDel = false;
    const tickBio = () => {
      const m = msgs[mi];
      if (!bDel && bi < m.length) bi++;
      else if (bDel && bi > 0) bi--;
      else if (bi === m.length) {
        bDel = true;
        return later(tickBio, 2000);
      } else {
        bDel = false;
        mi = (mi + 1) % msgs.length;
      }
      setBio(msgs[mi].slice(0, bi));
      glitch(setGlitchBio);
      later(tickBio, bDel ? 75 : 150);
    };

    tickName();
    tickBio();
    const blink = window.setInterval(() => setCursor((c) => !c), 500);
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      clearInterval(blink);
    };
  }, [lang]);

  return { name, bio, glitchName, glitchBio, cursor };
}

export default function NightPage() {
  const { lang } = useSettings();
  const t = T[lang];
  const tw = useTypewriter(lang);
  const audio = useRef<HTMLAudioElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [views, setViews] = useState<number | null>(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [glass, setGlass] = useState(0.7);
  const [scrollP, setScrollP] = useState(0);
  const [inView, setInView] = useState(false);
  const projRef = useRef<HTMLElement>(null);

  // views
  useEffect(() => {
    const ac = new AbortController();
    fetchViews(ac.signal).then(setViews);
    return () => ac.abort();
  }, []);

  // snap scrolling only while the night page is shown
  useEffect(() => {
    document.documentElement.classList.add("nt-snap");
    return () => document.documentElement.classList.remove("nt-snap");
  }, []);

  // music: switching to night is a click, so playback is allowed right away
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.volume = volume;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    return () => a.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);
  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else {
      a.pause();
      setPlaying(false);
    }
  };
  const next = useCallback(() => setIdx((i) => (i + 1) % tracks.length), []);
  const prev = () => setIdx((i) => (i - 1 + tracks.length) % tracks.length);

  // scroll: the profile moves down, shrinks and fades as you scroll to projects
  useEffect(() => {
    const onScroll = () => setScrollP(Math.min(1, window.scrollY / window.innerHeight));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const el = projRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // tilt the whole profile toward the mouse
  const onMove = (e: React.MouseEvent) => {
    if (reduced() || !wrap.current) return;
    const rx = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 15;
    const ry = -((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 15;
    wrap.current.style.setProperty("--rx", `${rx}deg`);
    wrap.current.style.setProperty("--ry", `${ry}deg`);
  };
  const onLeave = () => {
    wrap.current?.style.setProperty("--rx", "0deg");
    wrap.current?.style.setProperty("--ry", "0deg");
  };

  const track = tracks[idx];
  const glassStyle = {
    background: `rgba(0,0,0,${glass})`,
    backdropFilter: glass > 0 ? `blur(${10 * glass}px)` : "none",
    WebkitBackdropFilter: glass > 0 ? `blur(${10 * glass}px)` : "none",
  };

  return (
    <div className="nt-root">
      <RainBackground />
      <div className="nt-scanlines" aria-hidden />
      <audio
        ref={audio}
        src={trackUrl(track)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onEnded={next}
      />

      <section className="nt-hero" onMouseMove={onMove} onMouseLeave={onLeave}>
        <div
          className="nt-wrap"
          ref={wrap}
          style={{
            opacity: 1 - scrollP * 0.7,
            ["--sy" as string]: `${scrollP * 60}px`,
            ["--ss" as string]: 1 - scrollP * 0.15,
          }}
        >
          <div className="nt-profile" style={glassStyle}>
            <div className="nt-head">
              <div className="nt-avatar">
                <Orbit radius="circle" duration={3} />
                <img src="/night/avatar.gif" alt="" />
              </div>
              <div className="nt-info">
                <div className={"nt-name" + (tw.glitchName ? " nt-glitch" : "")}>
                  {tw.name}
                  <span className="nt-caret">{tw.cursor ? "|" : " "}</span>
                </div>
                <div className="nt-status">
                  <span className={"nt-dot" + (playing ? " on" : "")} />
                  {playing ? `${t.listening} ${track.title} — ${track.artist}` : t.online}
                </div>
                <div className={"nt-bio" + (tw.glitchBio ? " nt-glitch" : "")}>
                  {tw.bio}
                  <span className="nt-caret">{tw.cursor ? "|" : " "}</span>
                </div>
              </div>
            </div>
            <div className="nt-sep" />
            <div className="nt-socials">
              <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="nt-social gh">
                <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" /></svg>
              </a>
              <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="nt-social li">
                <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0a66c2" /><path fill="#fff" d="M6.5 9.5h2.6V18H6.5zM7.8 5.6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10.7 9.5h2.5v1.2c.4-.7 1.3-1.4 2.6-1.4 2.7 0 3.2 1.8 3.2 4.1V18h-2.6v-4c0-1 0-2.2-1.4-2.2s-1.6 1-1.6 2.1V18h-2.7z" /></svg>
              </a>
              <a href={`mailto:${links.email}`} aria-label="Email" className="nt-social em">
                <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#ea4335" /><path fill="#fff" d="M5 7h14v10H5zm1.6 1.4v.3L12 12.4l5.4-3.7v-.3zM6.6 10.3v5.3h10.8v-5.3L12 14z" /></svg>
              </a>
              <a href="https://leetcode.com/u/mBaka/" target="_blank" rel="noreferrer" aria-label="LeetCode" className="nt-social lc">
                <svg viewBox="0 0 24 24"><path fill="#ffa116" d="M13.5 2.5 6 10.1a3.3 3.3 0 0 0 0 4.6l4.4 4.4a3.3 3.3 0 0 0 4.6 0l2.3-2.3-1.6-1.6-2.3 2.3a1.1 1.1 0 0 1-1.6 0l-4.4-4.4a1.1 1.1 0 0 1 0-1.6l7.5-7.5z" /><path fill="#b3b3b3" d="M10 12.2h10v2.2H10z" /></svg>
              </a>
            </div>
            <div className="nt-views" title={t.views}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7Zm0 11.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-2.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="currentColor" />
              </svg>
              <span>{views === null ? "—" : views.toLocaleString()}</span>
            </div>
          </div>

          <div className="nt-player" style={{ ...glassStyle, borderColor: `rgba(255,255,255,${0.2 * (glass > 0 ? 1 : 0)})` }}>
            <Orbit radius={15} duration={6} />
            <div className="nt-art" style={{ background: cover(track.title) }}>
              {initials(track.title)}
            </div>
            <span className="nt-time">{fmt(time)}</span>
            <input
              className="nt-progress"
              type="range"
              min={0}
              max={dur || 1}
              step={0.1}
              value={time}
              onChange={(e) => {
                if (audio.current) audio.current.currentTime = Number(e.target.value);
              }}
              aria-label="Progress"
            />
            <span className="nt-time">{fmt(dur)}</span>
            <div className="nt-ctrls">
              <button onClick={prev} aria-label="Previous">
                <svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 5v14L9 12z" fill="currentColor" /></svg>
              </button>
              <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="big">
                {playing ? (
                  <svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z" fill="currentColor" /></svg>
                )}
              </button>
              <button onClick={next} aria-label="Next">
                <svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM4 5v14l11-7z" fill="currentColor" /></svg>
              </button>
            </div>
          </div>

          <div className="nt-controls" style={{ background: `rgba(0,0,0,${glass})` }}>
            <button className="nt-icon" onClick={() => setVolume((v) => (v > 0 ? 0 : 0.5))} aria-label="Mute">
              <svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />{volume > 0 && <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />}</svg>
            </button>
            <input className="nt-slider" type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="Volume" />
            <span className="nt-icon" aria-hidden>
              <svg viewBox="0 0 24 24"><path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7Zm0 11.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" fill="currentColor" /></svg>
            </span>
            <input className="nt-slider" type="range" min={0} max={1} step={0.01} value={glass} onChange={(e) => setGlass(Number(e.target.value))} aria-label="Transparency" />
          </div>
        </div>

        <div className="nt-scroll" style={{ opacity: Math.max(0, 1 - scrollP * 5), transform: `translate(-50%, ${-scrollP * 150}px)` }} aria-hidden>
          <div className="nt-mouse" />
          <span>{t.scroll}</span>
        </div>
      </section>

      <section className={"nt-projects" + (inView ? " in" : "")} ref={projRef}>
        <h2 className="nt-heading">{t.projects}</h2>
        <div className="nt-grid">
          {projects.map((p, i) => (
            <a key={p.name} className="nt-card" href={p.url} target="_blank" rel="noreferrer" style={{ ["--i" as string]: i }}>
              <div className="nt-top">
                <span className="nt-pdot" />
                <span className="nt-ptitle">{p.name.toLowerCase()}</span>
              </div>
              <p>{p.desc[lang]}</p>
              <div className="nt-tags">
                {p.tags.map((g) => (
                  <span key={g}>{g.toLowerCase()}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}
function cover(title: string) {
  const h = hash(title);
  const a = h % 360;
  const b = (a + 40 + (h % 80)) % 360;
  return `linear-gradient(135deg, hsl(${a} 55% 38%), hsl(${b} 60% 18%))`;
}
function initials(title: string) {
  return title
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
