import { useCallback, useEffect, useRef, useState } from "react";
import "./streetEgg.css";

type Props = { active: boolean; lang: "en" | "fr" };

const T = {
  en: { window: "Window", close: "Close" },
  fr: { window: "Fenêtre", close: "Fermer" },
} as const;

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Easter egg: a small window in the corner of the desk. Click it (or scroll over it) and the
// view cuts to the street at night: a lit wall, two shadows, and a lamp that dies.
// Only shadows are ever shown. Rendered offline in Blender (see temp/tools/street.py).
export default function StreetEgg({ active, lang }: Props) {
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const video = useRef<HTMLVideoElement | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback(() => {
    setLeaving(false);
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setLeaving(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setOpen(false);
      setLeaving(false);
    }, 450);
  }, []);

  // Escape closes; the page's own Escape handler only goes "home", which is harmless.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hide]);

  // Start playing when opened (the click that opened it is the user gesture).
  useEffect(() => {
    if (open && !reduced()) video.current?.play().catch(() => {});
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Leaving the home view closes it.
  useEffect(() => {
    if (!active && open) setOpen(false);
  }, [active, open]);

  return (
    <>
      {active && (
        <button
          type="button"
          className="egg-window"
          aria-label={t.window}
          onClick={show}
          onWheel={(e) => {
            if (e.deltaY > 0) show();
          }}
        >
          <span className="egg-glass" aria-hidden />
        </button>
      )}

      {open && (
        <div className={`egg-overlay${leaving ? " is-leaving" : ""}`} role="dialog" aria-modal="true" aria-label={t.window}>
          {reduced() ? (
            <img className="egg-media" src="/desk/egg/street-still.jpg" alt="" />
          ) : (
            <video
              ref={video}
              className="egg-media"
              src="/desk/egg/street.mp4"
              poster="/desk/egg/street-still.jpg"
              muted
              playsInline
              preload="none"
              onEnded={() => window.setTimeout(hide, 500)}
            />
          )}
          <button type="button" className="egg-close" onClick={hide} aria-label={t.close}>
            ✕
          </button>
        </div>
      )}
    </>
  );
}
