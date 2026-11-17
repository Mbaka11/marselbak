import { useCallback, useEffect, useRef, useState } from "react";
import "./streetEgg.css";

const T = {
  en: { window: "Window", close: "Close" },
  fr: { window: "Fenêtre", close: "Fermer" },
} as const;

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Camera-tilt timing (keep in sync with streetEgg.css)
const TILT_MS = 2300;
const ZOOM_MS = 1500;

type Props = { lang: "en" | "fr" };

// Easter egg, part 1: a small dark window in the corner of the desk. One click (or a scroll over it)
// lifts the camera off the table towards a real window.
export default function StreetEgg({ active, lang, onOpen }: Props & { active: boolean; onOpen: () => void }) {
  const t = T[lang];
  if (!active) return null;
  return (
    <button
      type="button"
      className="egg-window"
      aria-label={t.window}
      onClick={onOpen}
      onWheel={(e) => {
        if (e.deltaY !== 0) onOpen();
      }}
    >
      <svg className="egg-svg" viewBox="0 0 48 68" aria-hidden="true">
        <defs>
          <linearGradient id="egg-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c3e55" />
            <stop offset="1" stopColor="#0b0f15" />
          </linearGradient>
          <radialGradient id="egg-lamp" cx="0.3" cy="0.78" r="0.55">
            <stop offset="0" stopColor="#ffb866" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ff9a40" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="egg-wood" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4a3626" />
            <stop offset="1" stopColor="#1d140d" />
          </linearGradient>
          <clipPath id="egg-clip"><rect x="6" y="6" width="36" height="50" /></clipPath>
        </defs>
        <rect x="1" y="1" width="46" height="58" rx="1.5" fill="url(#egg-wood)" />
        <rect x="6" y="6" width="36" height="50" fill="url(#egg-sky)" />
        <g clipPath="url(#egg-clip)">
          <path d="M6 56 V40 h5 v-6 h6 v9 h4 v-14 h7 v12 h5 v-8 h5 V56Z" fill="#06080b" />
          <g fill="#ffc46b" fillOpacity="0.85">
            <rect x="13" y="38" width="1.6" height="2" /><rect x="23" y="31" width="1.6" height="2" />
            <rect x="26" y="40" width="1.6" height="2" /><rect x="33" y="36" width="1.6" height="2" />
            <rect x="9" y="44" width="1.6" height="2" /><rect x="36" y="46" width="1.6" height="2" />
          </g>
          <rect x="6" y="6" width="36" height="50" fill="url(#egg-lamp)" />
          <g stroke="#cfe0f2" strokeOpacity="0.28" strokeWidth="0.5">
            <path d="M10 8 l-2 9 M18 12 l-2 9 M27 7 l-2 9 M34 14 l-2 9 M40 9 l-2 9 M22 26 l-2 9 M13 28 l-2 9" />
          </g>
          <path d="M6 6 H26 L10 56 H6Z" fill="#fff" fillOpacity="0.06" />
        </g>
        <rect x="22.4" y="6" width="3.2" height="50" fill="url(#egg-wood)" />
        <rect x="6" y="29.4" width="36" height="3.2" fill="url(#egg-wood)" />
        <rect x="6" y="6" width="36" height="50" fill="none" stroke="#0a0705" strokeWidth="0.8" />
        <path d="M1.8 1.8 H46.2" stroke="#8a6c52" strokeOpacity="0.55" strokeWidth="0.6" />
        <rect x="-1" y="58" width="50" height="5.5" rx="1" fill="url(#egg-wood)" />
        <path d="M-0.5 58.3 H48.5" stroke="#9c7b5e" strokeOpacity="0.6" strokeWidth="0.6" />
      </svg>
    </button>
  );
}

type Phase = "idle" | "tilt" | "zoom" | "play" | "end";

// Easter egg, part 2: the room with the window (a zone of the world camera). When the camera has
// arrived it zooms into the glass, and the night street plays: only the rendered shadows of two
// people. Rendered in Blender (see temp/tools/street3d.py). Esc or the cross goes back down.
export function StreetWindow({ active, lang, onClose }: Props & { active: boolean; onClose: () => void }) {
  const t = T[lang];
  const [phase, setPhase] = useState<Phase>("idle");
  const zone = useRef<HTMLDivElement | null>(null);
  const win = useRef<HTMLDivElement | null>(null);
  const glass = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const clear = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const zoomIn = useCallback(() => {
    const z = zone.current;
    const g = glass.current;
    const w = win.current;
    if (!z || !g || !w) return;
    // scale so the whole 16:9 picture fits the frame of the page ("contain"); the rest goes black
    const s = Math.min(z.clientWidth / g.offsetWidth, z.clientHeight / g.offsetHeight);
    w.style.setProperty("--egg-scale", String(s));
    setPhase("zoom");
    const v = video.current;
    if (v && !reduced()) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
    later(() => setPhase("play"), reduced() ? 0 : ZOOM_MS);
  }, [later]);

  useEffect(() => {
    if (active) {
      setPhase("tilt");
      later(zoomIn, reduced() ? 50 : TILT_MS);
    } else {
      clear();
      setPhase("idle");
      const v = video.current;
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    }
    return clear;
  }, [active, zoomIn, later, clear]);

  const classes = `egg-zone phase-${phase}`;
  return (
    <div className={classes} ref={zone} role="dialog" aria-label={t.window} aria-hidden={!active}>
      <div className="egg-room" aria-hidden />
      <div className="egg-win" ref={win}>
        <div className="egg-frame" aria-hidden>
          <span className="egg-sill" />
          <span className="egg-curtain egg-curtain-l" />
          <span className="egg-curtain egg-curtain-r" />
        </div>
        <div className="egg-glass" ref={glass}>
          {reduced() ? (
            <img className="egg-media" src="/desk/egg/street-still.jpg" alt="" />
          ) : (
            <video
              ref={video}
              className="egg-media"
              src="/desk/egg/street.mp4"
              poster="/desk/egg/street-poster.jpg"
              muted
              playsInline
              preload="auto"
              onEnded={() => {
                setPhase("end");
                later(onClose, 900);
              }}
            />
          )}
          <span className="egg-bars" aria-hidden />
          <span className="egg-reflect" aria-hidden />
        </div>
      </div>
      <button type="button" className="egg-close" onClick={onClose} aria-label={t.close} tabIndex={active ? 0 : -1}>
        ✕
      </button>
    </div>
  );
}
