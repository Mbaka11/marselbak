import { useSettings } from "../settings";
import { education, experience, links, projects, ui } from "../content";
import Logo from "../components/Logo";
import Collapsible from "../components/Collapsible";
import HeroNetwork from "../components/HeroNetwork";
import BusinessCard from "../components/BusinessCard";
import { GithubIcon, LinkedinIcon, MailIcon } from "../components/icons";

const orgLogo: Record<string, string | undefined> = {
  McKesson: "/logos/mckesson.png",
  "Intact Insurance": "/logos/intact.webp",
  "Radio-Canada / CBC": "/logos/radio-canada.png",
  Stingray: "/logos/stingray.png",
};

const schoolLogo: Record<string, string | undefined> = {
  "Professional Master's in Machine Learning": "/logos/mila.png",
  "Bachelor of Software Engineering": "/logos/polytechnique.png",
  "Exchange, Computer Engineering": "/logos/korea.png",
};

export default function ProPage() {
  const { lang } = useSettings();
  const cv = lang === "fr" ? "/cv-fr.pdf" : "/cv-en.pdf";

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <HeroNetwork />
          <span className="chip">
            <span className="dot" />
            {lang === "fr" ? "En ce moment : McKesson, science des données et ML" : "Now: Data Science & ML at McKesson"}
          </span>
          <h1 className="name">{ui.name}</h1>
          <p className="role">
            <Logo src="/logos/mila.png" name="Mila" size={26} />
            <span>
              {ui.role[lang].replace(" Mila", " ")}
              <a href={links.mila} target="_blank" rel="noreferrer">
                Mila
              </a>
            </span>
          </p>
          <p className="lead">{ui.tagline[lang]}</p>
          <div className="actions">
            <a className="btn primary" href={cv} target="_blank" rel="noreferrer">
              {ui.cv[lang]}
            </a>
            <a className="btn" href="#contact">
              {ui.nav.contact[lang]}
            </a>
          </div>
        </div>
        <div className="hero-card">
          <BusinessCard lang={lang} cvHref={cv} />
        </div>
      </section>

      <section id="experience">
        <h2>{ui.nav.experience[lang]}</h2>
        {experience.map((e) => (
          <Collapsible
            key={e.org}
            markdown={`## ${e.org}\n### ${e.title[lang]} (${e.period})\n\n${e.points[lang].map((p) => "- " + p).join("\n")}`}
            header={
              <>
                <Logo src={orgLogo[e.org]} name={e.org} />
                <div className="stack">
                  <strong>{e.title[lang]}</strong>
                  <span className="muted">
                    {e.org} · {e.period}
                  </span>
                </div>
              </>
            }
          >
            <ul>
              {e.points[lang].map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="tags">
              {e.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </Collapsible>
        ))}
      </section>

      <section id="projects">
        <h2>{ui.nav.projects[lang]}</h2>
        <div className="pgrid">
          {projects.map((p) => (
            <a className="pcard" href={p.url} target="_blank" rel="noreferrer" key={p.name}>
              <div className="top">
                <Logo name={p.name} />
                <strong>{p.name}</strong>
              </div>
              <p>{p.desc[lang]}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="education">
        <h2>{ui.nav.education[lang]}</h2>
        {education.map((e) => (
          <div className="row item" key={e.degree.en}>
            <div className="head">
              <Logo src={schoolLogo[e.degree.en]} name={e.school.en} />
              <div>
                <strong>{e.degree[lang]}</strong>
                <div className="muted">{e.school[lang]}</div>
              </div>
            </div>
            <span className="muted">{e.period}</span>
          </div>
        ))}
      </section>

      <section id="contact">
        <h2>{ui.nav.contact[lang]}</h2>
        <p className="links">
          <a href={`mailto:${links.email}`}>
            <MailIcon /> Email
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            <LinkedinIcon /> LinkedIn
          </a>
          <a href={links.github} target="_blank" rel="noreferrer">
            <GithubIcon /> GitHub
          </a>
        </p>
      </section>
    </div>
  );
}
