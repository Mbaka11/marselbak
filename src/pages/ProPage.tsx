import { useSettings } from "../settings";
import { education, experience, links, projects, ui } from "../content";

export default function ProPage() {
  const { lang } = useSettings();
  return (
    <div className="page">
      <section className="hero">
        <h1>{ui.name}</h1>
        <p className="role">
          {ui.role[lang].replace("Mila", "")}
          <a href={links.mila} target="_blank" rel="noreferrer">
            Mila
          </a>
        </p>
        <p className="lead">{ui.tagline[lang]}</p>
        <div className="actions">
          <a className="btn primary" href="/cv.pdf" download>
            {ui.cv[lang]}
          </a>
          <a className="btn" href="#contact">
            {ui.nav.contact[lang]}
          </a>
        </div>
      </section>

      <section id="experience">
        <h2>{ui.nav.experience[lang]}</h2>
        {experience.map((e) => (
          <article className="card" key={e.org}>
            <div className="row">
              <h3>
                {e.org} <span className="muted">· {e.title[lang]}</span>
              </h3>
              <span className="muted">{e.period}</span>
            </div>
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
          </article>
        ))}
      </section>

      <section id="projects">
        <h2>{ui.nav.projects[lang]}</h2>
        <div className="grid">
          {projects.map((p) => (
            <a className="card link" href={p.url} target="_blank" rel="noreferrer" key={p.name}>
              <h3>{p.name}</h3>
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
            <div>
              <strong>{e.degree[lang]}</strong>
              <div className="muted">{e.school[lang]}</div>
            </div>
            <span className="muted">{e.period}</span>
          </div>
        ))}
      </section>

      <section id="contact">
        <h2>{ui.nav.contact[lang]}</h2>
        <p className="links">
          <a href={`mailto:${links.email}`}>Email</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </p>
      </section>
    </div>
  );
}
