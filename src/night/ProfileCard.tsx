import { useEffect, useRef } from "react";
import { links } from "../content";
import { useSettings } from "../settings";
import { EyeIcon, GithubIcon, LinkedinIcon, MailIcon, MusicIcon } from "./icons";
import { NAME, t } from "./strings";
import { useReducedMotion } from "./useReducedMotion";

type Props = {
  bio: string;
  nameOut: string;
  views: number | null;
  playing: boolean;
  onOpenPlayer: () => void;
};

/** 3D card: tilts toward the cursor with spring-like lerp, sheen follows the pointer. */
export default function ProfileCard({ bio, nameOut, views, playing, onOpenPlayer }: Props) {
  const { lang } = useSettings();
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = card.current!;
    // target / current / velocity for rotX, rotY; sheen x,y
    const tg = { rx: 0, ry: 0, sx: 50, sy: 50 };
    const cur = { rx: 0, ry: 0, sx: 50, sy: 50 };
    const vel = { rx: 0, ry: 0 };
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      tg.ry = Math.max(-1, Math.min(1, nx)) * 16;
      tg.rx = -Math.max(-1, Math.min(1, ny)) * 12;
      tg.sx = ((e.clientX - r.left) / r.width) * 100;
      tg.sy = ((e.clientY - r.top) / r.height) * 100;
    };
    const leave = () => { tg.rx = 0; tg.ry = 0; tg.sx = 50; tg.sy = 50; };
    const loop = () => {
      // spring with damping gives the card some weight / overshoot
      vel.rx += (tg.rx - cur.rx) * 0.06; vel.rx *= 0.82; cur.rx += vel.rx;
      vel.ry += (tg.ry - cur.ry) * 0.06; vel.ry *= 0.82; cur.ry += vel.ry;
      cur.sx += (tg.sx - cur.sx) * 0.12; cur.sy += (tg.sy - cur.sy) * 0.12;
      el.style.transform = `rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      el.style.setProperty("--sx", `${cur.sx.toFixed(1)}%`);
      el.style.setProperty("--sy", `${cur.sy.toFixed(1)}%`);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [reduced]);

  return (
    <div className="nt-card-wrap" ref={wrap}>
      <div className="nt-card" ref={card}>
        <div className="nt-card-sheen" aria-hidden="true" />
        <div className="nt-card-body">
          <h1 className="nt-name" aria-label={NAME}>
            <span aria-hidden="true">{nameOut}</span>
            <span className="nt-caret" aria-hidden="true" />
          </h1>
          <p className="nt-bio" aria-label={bio}>
            <span aria-hidden="true">{bio}</span>
            <span className="nt-caret" aria-hidden="true" />
          </p>
          <p className="nt-line">{t.line[lang]}</p>

          <div className="nt-socials">
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon /></a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon /></a>
            <a href={`mailto:${links.email}`} aria-label="Email"><MailIcon /></a>
          </div>

          <div className="nt-card-foot">
            <button className={"nt-music-btn" + (playing ? " is-on" : "")} onClick={onOpenPlayer} aria-label={t.openPlayer[lang]}>
              <MusicIcon /> <span>{t.music[lang]}</span>
            </button>
            {views !== null && (
              <span className="nt-views" title={t.views[lang]}>
                <EyeIcon /> {views.toLocaleString(lang === "fr" ? "fr-CA" : "en-US")} <span className="nt-views-l">{t.views[lang]}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
