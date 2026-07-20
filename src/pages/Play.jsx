import { Link } from 'react-router-dom'
import { play } from '../data/projects'
import CaseStudyContact from '../components/CaseStudyContact'
import { projectCaseCtaLabel, projectDestination } from '../lib/projectLinks'

export default function Play() {
  return (
    <div className="page-hero folio--fullgrid">
      <h1>I lose sleep to prototypes, race weekends, and silly side quests.</h1>
      <p className="about-lead" style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Work stays curated to four shipped proof cases. Explorations live here: WING concepts,
        pitch prototypes, student projects, design systems, branding, and motion.
      </p>
      <div className="play-grid">
        {play.map((item) => {
          const dest = projectDestination(item)
          const cta = `${projectCaseCtaLabel(item)} →`
          const inner = (
            <>
              {item.cover && (
                <div className="play-card__media">
                  <img src={item.cover} alt="" />
                </div>
              )}
              <p className="play-card__meta">{item.meta}</p>
              <h3>{item.title}</h3>
              <p>{item.blurb}</p>
              {dest && <span className="play-card__cta">{cta}</span>}
            </>
          )

          if (!dest) {
            return (
              <article className="play-card" key={item.slug}>
                {inner}
              </article>
            )
          }

          if (dest.external) {
            return (
              <a
                className="play-card play-card--link"
                href={dest.to}
                target="_blank"
                rel="noreferrer"
                key={item.slug}
              >
                {inner}
              </a>
            )
          }

          return (
            <Link className="play-card play-card--link" to={dest.to} key={item.slug}>
              {inner}
            </Link>
          )
        })}
      </div>
      <CaseStudyContact />
    </div>
  )
}
