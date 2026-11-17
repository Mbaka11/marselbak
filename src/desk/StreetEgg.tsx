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
      <span className="egg-glass-mini" aria-hidden />
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
