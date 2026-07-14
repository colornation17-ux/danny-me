import { play } from '../data/projects'

export default function Play() {
  return (
    <div className="page-hero folio--fullgrid">
      <h1>I lose sleep to prototypes, race weekends, and silly side quests.</h1>
      <p className="about-lead" style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Work stays curated. Everything else lives here: design systems, experiments,
        branding, and motion.
      </p>
      <div className="play-grid">
        {play.map((item) => (
          <article className="play-card" key={item.slug}>
            <p className="play-card__meta">{item.meta}</p>
            <h3>{item.title}</h3>
            <p>{item.blurb}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
