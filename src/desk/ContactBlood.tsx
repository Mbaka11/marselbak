import { useId } from "react";
import type { ReactNode } from "react";
import { links } from "../content";
import { GithubIcon, LinkedinIcon, MailIcon } from "../components/icons";
import "./contactBlood.css";

type Props = { lang: "en" | "fr"; onClose: () => void };

/* ---------- deterministic organic shapes ---------- */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Closed smooth blob (Catmull-Rom through noisy radial points). */
function blob(cx: number, cy: number, rx: number, ry: number, n: number, seed: number, amp: number, lobes = 0) {
  const r = rng(seed);
  const p1 = r() * 6.28;
  const p2 = r() * 6.28;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    let k = 1 + amp * (0.55 * Math.sin(3 * a + p1) + 0.35 * Math.sin(5 * a + p2) + (r() - 0.5) * 0.9);
    // occasional finger-like lobes
    if (lobes && r() < lobes) k += 0.08 + r() * 0.12;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const q1 = pts[i];
    const q2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = q1[0] + (q2[0] - p0[0]) / 6;
    const c1y = q1[1] + (q2[1] - p0[1]) / 6;
    const c2x = q2[0] - (p3[0] - q1[0]) / 6;
    const c2y = q2[1] - (p3[1] - q1[1]) / 6;
    d += ` C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(q2[0])} ${f(q2[1])}`;
  }
  return d + "Z";
}

const POOL = blob(300, 330, 245, 222, 30, 11, 0.07, 0.18);
const POOL_RIM = blob(300, 332, 252, 229, 30, 11, 0.07, 0.18);
const POOL_CORE = blob(292, 318, 170, 150, 18, 23, 0.06);

// Satellite drops: [cx, cy, r, seed]
const DROPS: [number, number, number, number][] = [
  [548, 120, 15, 3],
  [575, 168, 7, 5],
  [520, 82, 5, 7],
  [42, 214, 11, 9],
  [24, 262, 5, 13],
  [70, 590, 13, 17],
  [38, 622, 6, 19],
  [560, 560, 9, 29],
  [586, 520, 4, 31],
  [300, 62, 6, 37],
  [338, 40, 3.5, 41],
  [118, 98, 8, 43],
  [478, 618, 5, 47],
];
const DROP_PATHS = DROPS.map(([x, y, r, s]) => ({ d: blob(x, y, r, r * 0.9, 9, s, 0.12), x, y, r }));

// A smear / drip trail leaving the pool toward the lower right.
const SMEAR =
  "M470 470 C 500 492, 520 520, 534 552 C 540 566, 548 582, 547 596 C 546 606, 536 606, 532 596 C 526 580, 516 560, 498 540 C 484 524, 466 508, 452 494 Z";

type Item = { key: string; href: string; label: string; sub: string; icon: ReactNode; external: boolean };

export default function ContactBlood({ lang, onClose }: Props) {
  const uid = useId().replace(/:/g, "");
  const id = (s: string) => `cb-${s}-${uid}`;

  const items: Item[] = [
    { key: "mail", href: `mailto:${links.email}`, label: "Email", sub: links.email, icon: <MailIcon />, external: false },
    {
      key: "in",
      href: links.linkedin,
      label: "LinkedIn",
      sub: lang === "fr" ? "Profil professionnel" : "Professional profile",
      icon: <LinkedinIcon />,
      external: true,
    },
    {
      key: "gh",
      href: links.github,
      label: "GitHub",
      sub: links.github.replace(/^https?:\/\//, ""),
      icon: <GithubIcon />,
      external: true,
    },
  ];

  return (
    <section className="cb-root" aria-labelledby="cb-title">
      <button type="button" className="cb-close" onClick={onClose} aria-label={lang === "fr" ? "Fermer" : "Close"}>
        ×
      </button>

      <svg className="cb-pool" viewBox="0 0 600 660" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <radialGradient id={id("fill")} cx="46%" cy="44%" r="62%">
            <stop offset="0" stopColor="#7d0710" />
            <stop offset="0.55" stopColor="#5a040a" />
            <stop offset="0.85" stopColor="#3a0206" />
            <stop offset="1" stopColor="#220103" />
          </radialGradient>
          <radialGradient id={id("drop")} cx="40%" cy="38%" r="70%">
            <stop offset="0" stopColor="#8c0b14" />
            <stop offset="1" stopColor="#2c0205" />
          </radialGradient>
          <radialGradient id={id("core")} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#4a0307" stopOpacity="0.55" />
            <stop offset="1" stopColor="#4a0307" stopOpacity="0" />
          </radialGradient>
          {/* wet, glossy surface: specular lighting on the blurred alpha */}
          <filter id={id("gloss")} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="b" />
            <feSpecularLighting in="b" surfaceScale="5" specularConstant="0.9" specularExponent="28" lightingColor="#ffd9d9" result="s">
              <fePointLight x="180" y="90" z="260" />
            </feSpecularLighting>
            <feComposite in="s" in2="SourceAlpha" operator="in" result="sIn" />
            <feComposite in="SourceGraphic" in2="sIn" operator="arithmetic" k1="0" k2="1" k3="0.55" k4="0" />
          </filter>
          <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <g className="cb-spread">
          {/* darker coagulated rim, slightly larger, under the pool */}
          <path d={POOL_RIM} fill="#1a0102" opacity="0.9" />
          <path d={SMEAR} fill={`url(#${id("drop")})`} opacity="0.9" />
          <path d={POOL} fill={`url(#${id("fill")})`} filter={`url(#${id("gloss")})`} />
          <path d={POOL_CORE} fill={`url(#${id("core")})`} />
          {/* broad soft sheen + sharp specular */}
          <ellipse cx="210" cy="190" rx="110" ry="34" transform="rotate(-24 210 190)" fill="#ffffff" opacity="0.07" filter={`url(#${id("soft")})`} />
          <path d="M150 210 C 170 170, 215 140, 262 132" stroke="#fff" strokeOpacity="0.32" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="282" cy="128" r="3.2" fill="#fff" opacity="0.5" />
        </g>

        <g className="cb-drops">
          {DROP_PATHS.map((p, i) => (
            <g key={i} style={{ animationDelay: `${420 + i * 45}ms` }} className="cb-drop">
              <path d={p.d} fill={`url(#${id("drop")})`} />
              <circle cx={p.x - p.r * 0.32} cy={p.y - p.r * 0.36} r={Math.max(0.8, p.r * 0.2)} fill="#fff" opacity="0.38" />
            </g>
          ))}
        </g>
      </svg>

      <div className="cb-content">
        <h2 id="cb-title" className="cb-title">
          Contact
        </h2>
        <ul className="cb-list">
          {items.map((it, i) => (
            <li key={it.key} style={{ animationDelay: `${700 + i * 120}ms` }} className="cb-item">
              <a
                className="cb-link"
                href={it.href}
                {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="cb-icon">{it.icon}</span>
                <span className="cb-text">
                  <span className="cb-label">{it.label}</span>
                  <span className="cb-sub">{it.sub}</span>
                </span>
                <span className="cb-arrow" aria-hidden="true">
                  {it.external ? "↗" : "→"}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
