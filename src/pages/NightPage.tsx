import { useSettings } from "../settings";
import { links, ui } from "../content";

export default function NightPage() {
  const { lang } = useSettings();
  return (
    <div className="page night-hero">
      <h1>{ui.nightTitle[lang]}</h1>
      <p className="lead">{ui.nightSoon[lang]}</p>
      <p className="links">
        <a href={links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </p>
    </div>
  );
}
