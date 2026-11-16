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
        <span className="brand">{ui.name}</span>
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
            {night ? "☀ " + ui.day[lang] : "☾ " + ui.night[lang]}
          </button>
        </div>
      </header>
      <main>{night ? <NightPage /> : <DeskPage />}</main>
    </>
  );
}
