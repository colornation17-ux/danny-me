import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProjectBySlug, work } from '../data/projects'
import { SITE } from '../data/site'
import ProjectMotionPreview, { hasMotionPreview } from '../components/motion/ProjectMotionPreview'
import CompetitorWatchCaseStudy from '../components/motion/CompetitorWatchCaseStudy'
import CwHeroChapters from '../components/motion/CwHeroChapters'

export default function Project() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) {
    return (
      <div className="cs-missing">
        <h1>Project not found</h1>
        <p style={{ color: 'var(--muted)', marginTop: '0.75rem' }}>
          That case study isn’t in the selected set.
        </p>
        <Link className="cs-back" to="/">
          ← Back to work
        </Link>
      </div>
    )
  }

  const next =
    work[(work.findIndex((p) => p.slug === project.slug) + 1) % work.length]
  const layout = project.layout || 'default'
  const motion = hasMotionPreview(project.slug)
  const isCwCase = project.caseStudyBody === 'competitor-watch'
  const isGameCase = project.slug === 'bodega-ops'
  const hasMedia = Boolean(project.hero || project.cover || project.reel || motion || isCwCase)
  const [gameActive, setGameActive] = useState(true)

  useEffect(() => {
    if (isGameCase && gameActive) {
      document.body.classList.add('game-embed')
    } else {
      document.body.classList.remove('game-embed')
    }
  }, [isGameCase, gameActive])

  if (isGameCase) {
    return (
      <article className="cs cs--game" style={{ '--cs-accent': project.accent }}>
        {gameActive && (
          <div className="cs-game-frame">
            <iframe
              src="https://mattjr21.github.io/La-Bodega-game/?embed=1"
              title="La Bodega Interactive Case Study"
              className="cs-game-iframe"
              allowFullScreen
            />
            <Link to="/" className="cs-game-badge">
              <span>Danny Varghese</span>
              <span className="cs-game-badge__sep">·</span>
              <span>La Bodega Case Study</span>
            </Link>
            <button
              className="cs-game-skip"
              onClick={() => {
                setGameActive(false)
                setTimeout(() => {
                  document.getElementById('case-study')?.scrollIntoView({ behavior: 'smooth' })
                }, 50)
              }}
            >
              Skip — read the case study ↓
            </button>
          </div>
        )}

        <div id="case-study" className="cs-game-body">
          <Link className="cs-back" to="/">← Work</Link>
          <header className="cs-hero cs-hero--default">
            <div className="cs-hero__copy">
              <p className="cs-hero__meta">{project.meta}</p>
              <h1>{project.outcome}</h1>
              <p className="cs-hero__blurb">{project.blurb}</p>
              <dl className="cs-meta-row">
                <div><dt>Role</dt><dd>{project.role}</dd></div>
                <div><dt>Timeline</dt><dd>{project.timeline}</dd></div>
                <div><dt>Team</dt><dd>{project.team}</dd></div>
                <div><dt>Skills</dt><dd>{project.skills.join(' · ')}</dd></div>
              </dl>
              <div className="cs-actions">
                <a className="btn btn--primary" href={`mailto:${SITE.email}`}>Ask about this work</a>
              </div>
            </div>
          </header>

          {project.sections.map((section, index) => (
            <section className={`cs-section ${index === 0 ? 'cs-section--lead' : ''}`} key={section.eyebrow}>
              <p className="cs-section__eyebrow">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.metrics && (
                <div className="cs-metrics">
                  {section.metrics.map((metric) => (
                    <div className="cs-metric" key={metric.label}>
                      <div className="cs-metric__value">{metric.value}</div>
                      <div className="cs-metric__label">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {section.mobileGallery && section.mobileGallery.length > 0 && (
                <div className="cs-mobile-gallery">
                  {section.mobileGallery.map((item) => (
                    <figure key={item.src} className="cs-mobile-mockup">
                      <img src={item.src} alt={item.caption || ''} />
                      {item.caption && <figcaption>{item.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              )}
              {section.image && (
                <figure className="cs-inline-shot">
                  <img src={section.image} alt="" />
                  {section.caption && <figcaption>{section.caption}</figcaption>}
                </figure>
              )}
            </section>
          ))}

          <aside className="cs-next">
            <div>
              <p>Up next</p>
              <strong>{next.outcome}</strong>
            </div>
            <Link to={`/projects/${next.slug}`}>View project →</Link>
          </aside>
        </div>
      </article>
    )
  }

  return (
    <article
      className={`cs cs--${layout}${isCwCase ? ' cs--cw' : ''}`}
      style={{ '--cs-accent': project.accent }}
    >
      <Link className="cs-back" to="/">
        ← Work
      </Link>

      <header className={`cs-hero cs-hero--${layout}`}>
        <div className="cs-hero__copy">
          <p className="cs-hero__meta">{project.meta}</p>
          <h1>{project.outcome}</h1>
          <p className="cs-hero__blurb">{project.blurb}</p>
          <dl className="cs-meta-row">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>{project.timeline}</dd>
            </div>
            <div>
              <dt>Team</dt>
              <dd>{project.team}</dd>
            </div>
            <div>
              <dt>Skills</dt>
              <dd>{project.skills.join(' · ')}</dd>
            </div>
          </dl>
          <div className="cs-actions">
            {project.slug === 'competitor-watch' ? (
              <>
                <a className="btn btn--primary" href={`mailto:${SITE.email}`}>
                  Ask about this work
                </a>
                {project.liveUrl && (
                  <a
                    className="btn btn--ghost"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="First load on Render can take about 60 seconds"
                  >
                    Open live app
                  </a>
                )}
              </>
            ) : (
              <>
                {project.liveUrl && (
                  <a
                    className="btn btn--primary"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.slug === 'lola' ? 'Open full case study' : 'View live'}
                  </a>
                )}
                <a
                  className={project.liveUrl ? 'btn btn--ghost' : 'btn btn--primary'}
                  href={`mailto:${SITE.email}`}
                >
                  Ask about this work
                </a>
              </>
            )}
          </div>
        </div>

        {hasMedia && (
          <div
            className={`cs-banner cs-banner--${layout}${motion || isCwCase ? ' cs-banner--motion' : ''}${isCwCase ? ' cs-banner--reel' : ''}`}
          >
            {isCwCase ? (
              <CwHeroChapters />
            ) : motion ? (
              <ProjectMotionPreview slug={project.slug} size="hero" />
            ) : project.reel ? (
              <video
                src={project.reel}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img
                src={project.hero || project.cover}
                alt={`${project.title} — project visual`}
              />
            )}
          </div>
        )}
      </header>

      {isCwCase && <CompetitorWatchCaseStudy />}

      {project.sections.map((section, index) => (
        <section
          className={`cs-section ${index === 0 ? 'cs-section--lead' : ''}`}
          key={section.eyebrow}
        >
          <p className="cs-section__eyebrow">{section.eyebrow}</p>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
          {section.metrics && (
            <div className="cs-metrics">
              {section.metrics.map((metric) => (
                <div className="cs-metric" key={metric.label}>
                  <div className="cs-metric__value">{metric.value}</div>
                  <div className="cs-metric__label">{metric.label}</div>
                </div>
              ))}
            </div>
          )}
          {section.image && (
            <figure className="cs-inline-shot">
              <img src={section.image} alt="" />
              {section.caption && <figcaption>{section.caption}</figcaption>}
            </figure>
          )}
        </section>
      ))}

      {project.gallery && project.gallery.length > 0 && (
        <section className="cs-gallery">
          <p className="cs-section__eyebrow">Gallery</p>
          <div className="cs-gallery__grid">
            {project.gallery.map((item) => (
              <figure key={item.src} className="cs-gallery__item">
                <img src={item.src} alt={item.caption || ''} loading="lazy" />
                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      <aside className="cs-next">
        <div>
          <p>Up next</p>
          <strong>{next.outcome}</strong>
        </div>
        <Link to={`/projects/${next.slug}`}>View project →</Link>
      </aside>
    </article>
  )
}
