import { useState } from "react";
import { education } from "../content";
import "./educationCoat.css";

type Props = { lang: "en" | "fr" };

const T = {
  en: { back: "Show the back", front: "Show the front" },
  fr: { back: "Voir le dos", front: "Voir la face" },
} as const;

// Coat, axe and hand are rendered images (public/desk/coat.png, coat_back.png, axe.png, hand.png).
// Only part of the coat is in frame: it enters from the top edge, and it can be turned around.
export default function EducationCoat({ lang }: Props) {
  const [back, setBack] = useState(false);
  const t = T[lang];

  return (
    <section className={`ec-root${back ? " is-back" : ""}`} aria-labelledby="ec-title">
      <div className="ec-coat">
        <div className="ec-flip">
          <div className="ec-face ec-front" aria-hidden={back}>
            <img className="ec-img" src="/desk/coat.png" alt="" draggable={false} loading="lazy" decoding="async" />

            {/* Care-label style tag sewn on the coat */}
            <div className="ec-tag">
              <span className="ec-stitch" aria-hidden="true" />
              <h2 id="ec-title" className="ec-title">
                {lang === "fr" ? "Formation" : "Education"}
              </h2>
              <ol className="ec-list">
                {education.map((e) => (
                  <li key={e.period} className="ec-item">
                    <img className="ec-logo" src={e.logo} alt="" draggable={false} />
                    <span className="ec-degree">{e.degree[lang]}</span>
                    <span className="ec-school">{e.school[lang]}</span>
                    <span className="ec-period">{e.period}</span>
                  </li>
                ))}
              </ol>
              <span className="ec-fine" aria-hidden="true">
                {lang === "fr" ? "100 % PVC · ne pas repasser" : "100% PVC · do not iron"}
              </span>
            </div>
          </div>
          <div className="ec-face ec-rear" aria-hidden={!back}>
            <img className="ec-img" src="/desk/coat_back.png" alt="" draggable={false} loading="lazy" decoding="async" />
          </div>
        </div>
      </div>

      <div className="ec-axegroup">
        <img className="ec-axe" src="/desk/axe.png" alt="" draggable={false} loading="lazy" decoding="async" />
      </div>

      <button type="button" className="ec-turn" onClick={() => setBack((b) => !b)} aria-pressed={back}>
        {back ? t.front : t.back}
      </button>
    </section>
  );
}
