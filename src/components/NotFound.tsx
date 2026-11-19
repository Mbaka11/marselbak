import { useSettings } from "../settings";
import "./notFound.css";

const T = {
  en: { line: "Nothing to see here. The page you wanted was last seen leaving the scene.", back: "Back to the desk", tape: "404 · NOTHING HERE · 404 · DO NOT CROSS · " },
  fr: { line: "Rien à voir ici. La page que tu cherchais a été vue pour la dernière fois quittant les lieux.", back: "Retour au bureau", tape: "404 · RIEN ICI · 404 · NE PAS FRANCHIR · " },
} as const;

// "Crime scene" 404: police tape, a chalk outline of a business card, a tiny stain.
export default function NotFound() {
  const { lang } = useSettings();
  const t = T[lang];
  const tape = t.tape.repeat(8);
  return (
    <main className="nf">
      <div className="nf-tape nf-tape-a" aria-hidden="true"><span>{tape}</span></div>
      <div className="nf-tape nf-tape-b" aria-hidden="true"><span>{tape}</span></div>

      <div className="nf-center">
        <svg className="nf-chalk" viewBox="0 0 320 200" aria-hidden="true">
          <g fill="none" stroke="#e9e6df" strokeLinecap="round" strokeLinejoin="round">
            <path className="nf-line" d="M22 30 L150 14 L298 26 L304 166 L170 184 L30 172 Z" strokeWidth="3" />
            <path className="nf-line" d="M62 74 L150 68 L238 72" strokeWidth="2" strokeDasharray="6 9" opacity="0.7" />
            <path className="nf-line" d="M70 112 L190 108" strokeWidth="2" strokeDasharray="4 10" opacity="0.6" />
            <path className="nf-line" d="M262 142 q10 -6 18 2" strokeWidth="2" opacity="0.6" />
          </g>
          <path d="M268 40c5-3 11 0 11 6 0 4-3 6-4 10-1 5-7 6-9 2-2-3 0-5-1-8-1-4-1-8 3-10z" fill="#5c0b0e" opacity="0.75" />
        </svg>
        <h1 className="nf-code">404</h1>
        <p className="nf-line-text">{t.line}</p>
        <a className="nf-back" href="/">{t.back}</a>
      </div>
    </main>
  );
}
