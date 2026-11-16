import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import "./businessCard.css";

type Lang = "en" | "fr";

interface BusinessCardProps {
  lang: Lang;
  cvHref: string;
}

const NAME = "Marsel Bakashov";

const TEXT = {
  en: {
    subtitle: "Machine Learning · Reinforcement Learning · AI Agents",
    degree: "Master's in Machine Learning — Mila",
    hint: "Click to flip",
    frontLabel: "Business card of Marsel Bakashov. Flip to see the sections.",
    backLabel: "Flip the card back",
    nav: "Sections",
    links: [
      { href: "#experience", label: "Experience" },
      { href: "#projects", label: "Projects" },
      { href: "#education", label: "Education" },
      { href: "#contact", label: "Contact" },
    ],
    cv: "CV",
    cvLabel: "CV (opens in a new tab)",
  },
  fr: {
    subtitle: "Apprentissage automatique · Apprentissage par renforcement · Agents IA",
    degree: "Maîtrise en apprentissage automatique — Mila",
    hint: "Cliquez pour retourner",
    frontLabel: "Carte de visite de Marsel Bakashov. Retourner pour voir les sections.",
    backLabel: "Retourner la carte",
    nav: "Sections",
    links: [
      { href: "#experience", label: "Expérience" },
      { href: "#projects", label: "Projets" },
      { href: "#education", label: "Formation" },
      { href: "#contact", label: "Contact" },
    ],
    cv: "CV",
    cvLabel: "CV (s'ouvre dans un nouvel onglet)",
  },
} as const;

const NUMERALS = ["I", "II", "III", "IV", "V"];

function usePrefersReducedMotion(): boolean {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : false,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const MAX_TILT_X = 7; // deg, vertical mouse movement
const MAX_TILT_Y = 10; // deg, horizontal mouse movement

export default function BusinessCard({ lang, cvHref }: BusinessCardProps) {
  const t = TEXT[lang];
  const [flipped, setFlipped] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const tiltRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasInteracted = useRef(false);

  const setTilt = useCallback((rx: number, ry: number) => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--bc-rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--bc-ry", `${ry.toFixed(2)}deg`);
  }, []);

  const resetTilt = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setTilt(0, 0);
  }, [setTilt]);

  useEffect(() => {
    if (reducedMotion) resetTilt();
  }, [reducedMotion, resetTilt]);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  // Move focus to the newly visible face (only after a user flip, not on mount).
  useEffect(() => {
    if (!hasInteracted.current) return;
    if (flipped) firstLinkRef.current?.focus({ preventScroll: true });
    else frontRef.current?.focus({ preventScroll: true });
  }, [flipped]);

  const flip = useCallback(() => {
    hasInteracted.current = true;
    setFlipped((f) => !f);
  }, []);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setTilt(-y * 2 * MAX_TILT_X, x * 2 * MAX_TILT_Y);
    });
  };

  // Clicking empty paper on the back flips it back; links and buttons keep their own behaviour.
  const onBackClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("a, button")) return;
    flip();
  };

  const onBackKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      flip();
    }
  };

  return (
    <div className="bc-wrap" lang={lang}>
      <div
        className="bc-stage"
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
      >
        <div className="bc-tilt" ref={tiltRef}>
          <div className={`bc-card${flipped ? " bc-is-flipped" : ""}`}>
            {/* Front: the whole face is the flip button */}
            <button
              type="button"
              ref={frontRef}
              className="bc-face bc-front"
              onClick={flip}
              aria-label={t.frontLabel}
              aria-pressed={flipped}
              aria-hidden={flipped || undefined}
              tabIndex={flipped ? -1 : 0}
            >
              <span className="bc-watermark" aria-hidden="true">
                MB
              </span>
              <span className="bc-corner bc-corner-tl" aria-hidden="true">
                ML · RL
              </span>
              <span className="bc-corner bc-corner-tr" aria-hidden="true">
                Mila
              </span>
              <span className="bc-front-body">
                <span className="bc-name">{NAME}</span>
                <span className="bc-rule" aria-hidden="true" />
                <span className="bc-subtitle">{t.subtitle}</span>
              </span>
              <span className="bc-degree">{t.degree}</span>
            </button>

            {/* Back: section links */}
            <div
              className="bc-face bc-back"
              onClick={onBackClick}
              onKeyDown={onBackKeyDown}
              aria-hidden={!flipped || undefined}
            >
              <span className="bc-watermark bc-watermark-back" aria-hidden="true">
                MB
              </span>
              <button
                type="button"
                className="bc-flipback"
                onClick={flip}
                aria-label={t.backLabel}
                tabIndex={flipped ? 0 : -1}
              >
                <span aria-hidden="true">↺</span>
              </button>
              <nav className="bc-nav" aria-label={t.nav}>
                <ol className="bc-links">
                  {t.links.map((l, i) => (
                    <li key={l.href}>
                      <a
                        ref={i === 0 ? firstLinkRef : undefined}
                        className="bc-link"
                        href={l.href}
                        tabIndex={flipped ? 0 : -1}
                      >
                        <span className="bc-num" aria-hidden="true">
                          {NUMERALS[i]}
                        </span>
                        <span className="bc-label">{l.label}</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      className="bc-link"
                      href={cvHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.cvLabel}
                      tabIndex={flipped ? 0 : -1}
                    >
                      <span className="bc-num" aria-hidden="true">
                        {NUMERALS[4]}
                      </span>
                      <span className="bc-label">
                        {t.cv} <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <p className="bc-hint" aria-hidden="true">
        {t.hint}
      </p>
    </div>
  );
}
