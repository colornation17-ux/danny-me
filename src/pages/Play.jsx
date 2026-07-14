import { Link } from 'react-router-dom'
import { play } from '../data/projects'

export default function Play() {
  return (
    <div className="page-hero folio--fullgrid">
      <h1>I lose sleep to prototypes, race weekends, and silly side quests.</h1>
      <p className="about-lead" style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Work stays curated. Everything else lives here: pitch prototypes, student
        projects, design systems, branding, and motion.
      </p>
      <div className="play-grid">
        {play.map((item) => {
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
              {item.href && <span className="play-card__cta">Open case study →</span>}
            </>
          )

          return item.href ? (
            <Link className="play-card play-card--link" to={item.href} key={item.slug}>
              {inner}
            </Link>
          ) : (
            <article className="play-card" key={item.slug}>
              {inner}
            </article>
          )
        })}
      </div>
    </div>
  )
}
