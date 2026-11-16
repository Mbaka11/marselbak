import { useSettings } from "./settings";
import { ui } from "./content";
import DeskPage from "./pages/DeskPage";
import NightPage from "./pages/NightPage";

export default function App() {
  const { lang, mode, setLang, setMode, muted, setMuted } = useSettings();
  const night = mode === "night";

  return (
    <>
      <header className="bar">
        <div className="controls">
          <button
            className="pill pill-icon"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? (lang === "fr" ? "Activer le son" : "Unmute") : lang === "fr" ? "Couper le son" : "Mute"}
            aria-pressed={muted}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
              <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
              {muted ? (
                <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              ) : (
                <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              )}
            </svg>
          </button>
          <button className="pill" onClick={() => setLang(lang === "en" ? "fr" : "en")} aria-label="Language">
            {lang === "en" ? "FR" : "EN"}
          </button>
          <button
            className="pill"
            onClick={() => setMode(night ? "day" : "night")}
            aria-label={night ? ui.day[lang] : ui.night[lang]}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden style={{ marginRight: 7, verticalAlign: "-2px" }}>
              {night ? (
                <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
                </g>
              ) : (
                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 6.7 6.7 0 0 0 20 14.5Z" fill="currentColor" />
              )}
            </svg>
            {night ? ui.day[lang] : ui.night[lang]}
          </button>
        </div>
      </header>
      <main>{night ? <NightPage /> : <DeskPage />}</main>
    </>
  );
}
