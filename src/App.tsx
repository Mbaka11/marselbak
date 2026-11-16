import { useSettings } from "./settings";
import { ui } from "./content";
import ProPage from "./pages/ProPage";
import NightPage from "./pages/NightPage";

export default function App() {
  const { lang, mode, setLang, setMode } = useSettings();
  const night = mode === "night";

  return (
    <>
      <header className="bar">
        <span className="brand">{ui.name}</span>
        <div className="controls">
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
      <main>{night ? <NightPage /> : <ProPage />}</main>
    </>
  );
}
