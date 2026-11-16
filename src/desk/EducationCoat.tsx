import { education } from "../content";
import "./educationCoat.css";

type Props = { lang: "en" | "fr"; onClose: () => void };

export default function EducationCoat({ lang, onClose }: Props) {
  return (
    <section className="ec-root" aria-labelledby="ec-title">
      <button type="button" className="ec-close" onClick={onClose} aria-label={lang === "fr" ? "Fermer" : "Close"}>
        ×
      </button>

      <div className="ec-rig">
        {/* Clear plastic panel, only part of the coat is in frame */}
        <div className="ec-coat" aria-hidden="true">
          <svg className="ec-folds" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* creases: bright edge + soft shade */}
            <g fill="none">
              <path className="ec-crease" d="M18 0 C 22 18, 14 34, 20 52 S 26 82, 19 100" />
              <path className="ec-crease-shade" d="M19.6 0 C 23.6 18, 15.6 34, 21.6 52 S 27.6 82, 20.6 100" />
              <path className="ec-crease" d="M44 0 C 40 22, 50 40, 45 60 S 40 86, 47 100" />
              <path className="ec-crease-shade" d="M46 0 C 42 22, 52 40, 47 60 S 42 86, 49 100" />
              <path className="ec-crease ec-faint" d="M70 0 C 74 26, 66 44, 72 66 S 76 90, 70 100" />
              <path className="ec-crease ec-faint" d="M30 34 C 36 37, 41 36, 48 40" />
              <path className="ec-crease ec-faint" d="M52 70 C 60 66, 70 69, 82 64" />
              {/* side seam with stitches */}
              <path className="ec-seam" d="M60 0 C 58 30, 62 60, 59 100" />
              <path className="ec-stitch" d="M61.4 0 C 59.4 30, 63.4 60, 60.4 100" />
              {/* front placket edge */}
              <path className="ec-stitch" d="M5.5 0 C 3.5 30, 6.5 64, 4 100" />
            </g>
          </svg>
          <span className="ec-gloss ec-gloss-a" />
          <span className="ec-gloss ec-gloss-b" />
          <span className="ec-gloss ec-gloss-c" />
        </div>

        {/* Waist belt with buckle */}
        <div className="ec-belt" aria-hidden="true">
          <span className="ec-belt-tail" />
          <span className="ec-buckle">
            <span className="ec-prong" />
          </span>
          <span className="ec-loop" />
        </div>

        {/* Care-label style tag, sewn under the belt */}
        <div className="ec-tagwrap">
          <div className="ec-tag">
            <span className="ec-sewn" aria-hidden="true" />
            <h2 id="ec-title" className="ec-title">
              {lang === "fr" ? "Formation" : "Education"}
            </h2>
            <svg className="ec-care" viewBox="0 0 120 18" aria-hidden="true">
              {/* wash tub */}
              <path d="M3 4 L6 15 H18 L21 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3 6.5 Q7 4.5 12 6.5 T21 6.5" fill="none" stroke="currentColor" strokeWidth="1" />
              {/* triangle */}
              <path d="M38 15 L46 3 L54 15 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* iron */}
              <path d="M70 15 H90 L88 8 Q86 5 80 5 H74 Q72 9 70 15 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="80" cy="11.5" r="1" fill="currentColor" />
              {/* tumble dry */}
              <rect x="102" y="3" width="13" height="12" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="108.5" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
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
      </div>
    </section>
  );
}
