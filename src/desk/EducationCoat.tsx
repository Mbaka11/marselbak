import { education } from "../content";
import "./educationCoat.css";

type Props = { lang: "en" | "fr" };

// The coat and the axe are rendered images (public/desk/coat.png, axe.png).
// Only part of the coat is in frame: it enters from the top edge.
export default function EducationCoat({ lang }: Props) {
  return (
    <section className="ec-root" aria-labelledby="ec-title">
      <div className="ec-coat">
        <img className="ec-img" src="/desk/coat.png" alt="" draggable={false} />

        {/* Care-label style tag sewn on the coat */}
        <div className="ec-tag">
          <span className="ec-stitch" aria-hidden="true" />
          <h2 id="ec-title" className="ec-title">
            {lang === "fr" ? "Formation" : "Education"}
          </h2>
          <ol className="ec-list">
            {education.map((e) => (
              <li key={e.period} className="ec-item">
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

      <img className="ec-axe" src="/desk/axe.png" alt="" draggable={false} />
    </section>
  );
}
