import { SITE } from '../data/site'

export default function About() {
  return (
    <div className="about-hero">
      <h1>{SITE.about.lead}</h1>
      <div className="about-body">
        {SITE.about.body.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </div>

      <div className="about-panel">
        <div className="about-box">
          <h2>Currently</h2>
          <p className="about-seeking">{SITE.about.seeking}</p>
          <div className="contact-row">
            <a className="btn btn--primary" href={`mailto:${SITE.email}`}>
              Email me
            </a>
            <a
              className="btn btn--ghost"
              href={SITE.linkedIn}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="about-box">
          <h2>Outside the deck</h2>
          <ul>
            {SITE.about.outside.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
