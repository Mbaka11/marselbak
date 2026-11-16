import { education } from "../content";
import "./educationCoat.css";

type Props = { lang: "en" | "fr" };

const BODY =
  "M150 40 C118 48 72 60 52 90 L14 360 L66 372 L92 200 L84 596 L316 596 L308 200 L334 372 L386 360 L348 90 C328 60 282 48 250 40 L200 118 Z";

export default function EducationCoat({ lang }: Props) {
  return (
    <section className="ec-root" aria-labelledby="ec-title">
      {/* Clear plastic raincoat, waist strap closed */}
      <div className="ec-coat">
        <svg viewBox="0 0 400 620" className="ec-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ec-plastic" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#eaf3f8" stopOpacity="0.30" />
              <stop offset="0.5" stopColor="#cfe0ea" stopOpacity="0.14" />
              <stop offset="1" stopColor="#e4eef5" stopOpacity="0.26" />
            </linearGradient>
            <linearGradient id="ec-sheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.38" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ec-belt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f2f6f8" stopOpacity="0.55" />
              <stop offset="1" stopColor="#c3d2dc" stopOpacity="0.38" />
            </linearGradient>
            <filter id="ec-blur"><feGaussianBlur stdDeviation="3" /></filter>
            <clipPath id="ec-clip"><path d={BODY} /></clipPath>
          </defs>

          <path d={BODY} fill="url(#ec-plastic)" stroke="#f4fafd" strokeOpacity="0.55" strokeWidth="1.6" strokeLinejoin="round" />

          <g clipPath="url(#ec-clip)">
            {/* soft light bands and creases */}
            <rect x="96" y="60" width="26" height="560" fill="url(#ec-sheen)" filter="url(#ec-blur)" transform="rotate(4 110 300)" />
            <rect x="250" y="80" width="18" height="540" fill="url(#ec-sheen)" opacity="0.7" filter="url(#ec-blur)" transform="rotate(-3 260 300)" />
            <rect x="24" y="110" width="14" height="240" fill="url(#ec-sheen)" opacity="0.8" filter="url(#ec-blur)" transform="rotate(8 30 230)" />
            <g fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.1">
              <path d="M120 420 C 150 428, 180 424, 200 436" />
              <path d="M230 470 C 262 466, 288 474, 304 468" />
              <path d="M98 250 C 120 262, 118 300, 100 330" />
              <path d="M300 250 C 282 262, 284 300, 302 330" />
              <path d="M40 160 C 46 220, 38 280, 30 340" />
              <path d="M360 160 C 354 220, 362 280, 370 340" />
            </g>
            <g fill="none" stroke="#0e1a22" strokeOpacity="0.18" strokeWidth="1.4">
              <path d="M123 424 C 153 432, 183 428, 203 440" />
              <path d="M233 474 C 265 470, 291 478, 307 472" />
            </g>
          </g>

          {/* lapel collar */}
          <path d="M150 40 L200 118 L168 152 L126 96 Z" fill="#dcebf3" fillOpacity="0.32" stroke="#f4fafd" strokeOpacity="0.6" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M250 40 L200 118 L232 152 L274 96 Z" fill="#dcebf3" fillOpacity="0.26" stroke="#f4fafd" strokeOpacity="0.6" strokeWidth="1.4" strokeLinejoin="round" />

          {/* front placket + snaps */}
          <path d="M200 118 L200 596" stroke="#f4fafd" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="4 3" fill="none" />
          {[190, 268, 440, 510, 566].map((y) => (
            <g key={y}>
              <circle cx="200" cy={y} r="7" fill="#d9e3ea" fillOpacity="0.85" stroke="#7c8b96" strokeWidth="1" />
              <circle cx="198" cy={y - 2} r="2" fill="#fff" fillOpacity="0.9" />
            </g>
          ))}

          {/* pockets */}
          <path d="M112 452 H176 V480 H112 Z" fill="#e7f0f6" fillOpacity="0.2" stroke="#f4fafd" strokeOpacity="0.55" strokeWidth="1.2" />
          <path d="M224 452 H288 V480 H224 Z" fill="#e7f0f6" fillOpacity="0.2" stroke="#f4fafd" strokeOpacity="0.55" strokeWidth="1.2" />

          {/* sleeve cuffs and seam stitches */}
          <path d="M14 360 L66 372" stroke="#f4fafd" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
          <path d="M386 360 L334 372" stroke="#f4fafd" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
          <path d="M92 200 L52 96 M308 200 L348 96" stroke="#f4fafd" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" fill="none" />

          {/* waist strap, buckle and tail */}
          <path d="M86 372 L314 372 L314 402 L86 402 Z" fill="url(#ec-belt)" stroke="#f4fafd" strokeOpacity="0.7" strokeWidth="1.4" />
          <path d="M90 377 H310 M90 397 H310" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 3" />
          <rect x="226" y="366" width="38" height="42" rx="4" fill="none" stroke="#dfe8ee" strokeOpacity="0.95" strokeWidth="3.4" />
          <path d="M245 372 V402" stroke="#dfe8ee" strokeWidth="3" strokeLinecap="round" />
          <path d="M264 380 C 300 384, 332 392, 340 440 L 322 444 C 316 410, 296 402, 264 398 Z" fill="url(#ec-belt)" stroke="#f4fafd" strokeOpacity="0.65" strokeWidth="1.2" />
          <rect x="278" y="383" width="10" height="22" rx="2" fill="none" stroke="#f4fafd" strokeOpacity="0.7" strokeWidth="1.2" />
        </svg>

        {/* Care-label style tag sewn on the chest */}
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

      {/* Axe lying on the desk in front of the coat */}
      <svg className="ec-axe" viewBox="0 0 540 150" aria-hidden="true">
        <defs>
          <linearGradient id="ec-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a5a33" />
            <stop offset="0.45" stopColor="#6a4122" />
            <stop offset="1" stopColor="#3f2411" />
          </linearGradient>
          <linearGradient id="ec-steel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c9ced3" />
            <stop offset="0.4" stopColor="#7d858d" />
            <stop offset="1" stopColor="#3b4046" />
          </linearGradient>
        </defs>
        {/* handle */}
        <path d="M6 66 C10 58 22 58 30 64 C150 60 280 60 372 62 L372 90 C280 92 150 90 30 88 C22 94 10 94 6 86 Z" fill="url(#ec-wood)" />
        <g stroke="#2a170a" strokeOpacity="0.35" strokeWidth="1" fill="none">
          <path d="M34 70 C150 68 280 68 370 69" />
          <path d="M34 76 C150 74 280 74 370 76" />
          <path d="M34 83 C150 82 280 82 370 83" />
        </g>
        <path d="M34 66 C150 63 280 63 370 65" stroke="#d9a877" strokeOpacity="0.45" strokeWidth="2" fill="none" />
        {/* head: eye block on the handle, poll above, blade flaring below with the edge parallel to the handle */}
        <path d="M352 40 L402 40 L402 96 C412 110 436 122 448 138 C404 152 374 148 326 138 C340 122 352 110 352 96 Z" fill="url(#ec-steel)" />
        <path d="M448 138 C404 152 374 148 326 138" stroke="#f1f4f6" strokeOpacity="0.95" strokeWidth="2.4" fill="none" />
        <path d="M356 46 H398" stroke="#e7ebee" strokeOpacity="0.55" strokeWidth="1.4" />
        <rect x="356" y="52" width="42" height="42" fill="#000" fillOpacity="0.14" />
      </svg>
    </section>
  );
}
