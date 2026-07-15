import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { getProjectBySlug, lab, work } from '../data/projects'
import { featured } from '../data/featured'
import { SITE } from '../data/site'
import ProjectMotionPreview, { hasMotionPreview } from '../components/motion/ProjectMotionPreview'
import CompetitorWatchCaseStudy, {
  CW_RAIL_STEPS,
} from '../components/motion/CompetitorWatchCaseStudy'
import CwHeroChapters from '../components/motion/CwHeroChapters'
import {
  CaseStudyNav,
  sectionAnchorId,
  stepsFromSections,
} from '../components/CaseStudyRail'
import CaseStudyContact from '../components/CaseStudyContact'
import CaseStudyNext from '../components/CaseStudyNext'
import CaseStudyVideo from '../components/CaseStudyVideo'
import {
  projectLiveCtaLabel,
  projectNavLabel,
} from '../lib/projectLinks'

export default function Project() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  const [gameActive, setGameActive] = useState(true)

  const isLab = project?.collection === 'lab'
  const featuredBySlug = useMemo(
    () => Object.fromEntries(featured.map((p) => [p.slug, p])),
    [],
  )
  const featuredOrder = useMemo(() => featured.map((p) => p.slug), [])
  const featuredIndex = project ? featuredOrder.indexOf(project.slug) : -1

  const { prev, next } = useMemo(() => {
    if (!project) return { prev: null, next: null }
    const resolveNav = (s) => featuredBySlug[s] || getProjectBySlug(s)
    if (isLab) {
      const i = lab.findIndex((p) => p.slug === project.slug)
      const len = lab.length
      return { prev: lab[(i - 1 + len) % len], next: lab[(i + 1) % len] }
    }
    if (featuredIndex === -1) {
      const i = work.findIndex((p) => p.slug === project.slug)
      const len = work.length
      return { prev: work[(i - 1 + len) % len], next: work[(i + 1) % len] }
    }
    const len = featuredOrder.length
    return {
      prev: resolveNav(featuredOrder[(featuredIndex - 1 + len) % len]),
      next: resolveNav(featuredOrder[(featuredIndex + 1) % len]),
    }
  }, [project, isLab, featuredIndex, featuredBySlug, featuredOrder])

  const isCwCase = project?.caseStudyBody === 'competitor-watch'
  const isGameCase = project?.slug === 'bodega-ops'
  const railSteps = useMemo(() => {
    if (!project) return []
    if (isCwCase) return CW_RAIL_STEPS
    return stepsFromSections(project.sections)
  }, [project, isCwCase])

  // External full case studies (e.g. Lola) — never keep the short on-site stub.
  const externalHref =
    project && typeof project.href === 'string' && /^https?:\/\//i.test(project.href)
      ? project.href
      : null

  useEffect(() => {
    if (!externalHref) return undefined
    window.location.replace(externalHref)
    return undefined
  }, [externalHref])

  useEffect(() => {
    if (isGameCase && gameActive) {
      document.body.classList.add('game-embed')
    } else {
      document.body.classList.remove('game-embed')
    }
    return () => document.body.classList.remove('game-embed')
  }, [isGameCase, gameActive])

  if (!project) {
    return (
      <div className="cs-missing">
        <h1>Project not found</h1>
        <p style={{ color: 'var(--muted)', marginTop: '0.75rem' }}>
          That case study isn’t in the selected set.
        </p>
        <Link className="cs-back" to="/">
          <span className="cs-rail__back-arrow" aria-hidden="true">
            ←
          </span>
          <span>Work</span>
        </Link>
      </div>
    )
  }

  if (externalHref) {
    return (
      <div className="cs-missing">
        <h1>{project.title || 'Opening case study…'}</h1>
        <p style={{ color: 'var(--muted)', marginTop: '0.75rem' }}>
          Taking you to the full case study.
        </p>
        <a className="folio-btn folio-btn--solid" href={externalHref}>
          Continue →
        </a>
      </div>
    )
  }

  const backTo = isLab ? '/play' : '/'
  const backLabel = isLab ? 'Lab' : 'Work'
  const layout = project.layout || 'default'
  const motion = hasMotionPreview(project.slug)
  const hasMedia = Boolean(project.hero || project.cover || project.reel || motion || isCwCase)
  const railBrand =
    project.slug === 'competitor-watch'
      ? 'CW'
      : project.slug === 'wing-hmi'
        ? 'Wing'
        : project.slug === 'edge-ai'
          ? 'Edge'
          : project.title?.split(' ')[0] || project.title
  const showRail = railSteps.length >= 2
  const contactId = isCwCase ? 'cw-close' : 'contact'
  const contactHeadingId = isCwCase ? 'cw-contact-heading' : 'contact-heading'

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
              Skip · read the case study ↓
            </button>
          </div>
        )}

        <div id="case-study" className={`cs-game-body${showRail ? ' cs--with-rail' : ''}`}>
          {showRail ? (
            <CaseStudyNav
              brand={railBrand}
              steps={railSteps}
              backTo={backTo}
              backLabel={backLabel}
            />
          ) : (
            <Link className="cs-back" to={backTo}>
              <span className="cs-rail__back-arrow" aria-hidden="true">
                ←
              </span>
              <span>{backLabel}</span>
            </Link>
          )}
          <header className="cs-hero cs-hero--default">
            <div className="cs-hero__copy">
              <p className="cs-hero__meta">{project.meta}</p>
              <h1>{projectNavLabel(project)}</h1>
              {project.outcome && project.outcome !== project.title ? (
                <p className="cs-hero__outcome">{project.outcome}</p>
              ) : null}
              <p className="cs-hero__blurb">{project.blurb}</p>
              <dl className="cs-meta-row">
                <div><dt>Role</dt><dd>{project.role}</dd></div>
                <div><dt>Timeline</dt><dd>{project.timeline}</dd></div>
                <div><dt>Team</dt><dd>{project.team}</dd></div>
                <div><dt>Skills</dt><dd>{project.skills.join(' · ')}</dd></div>
              </dl>
              <div className="cs-actions">
                <a className="folio-btn folio-btn--solid" href={`mailto:${SITE.email}`}>Ask about this work</a>
              </div>
            </div>
          </header>

          {project.sections.map((section, index) => (
            <section
              id={sectionAnchorId(section.eyebrow, index)}
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

          <CaseStudyContact />
          <CaseStudyNext prev={prev} next={next} />
        </div>
      </article>
    )
  }

  return (
    <article
      className={`cs cs--${layout}${isCwCase ? ' cs--cw' : ''}${showRail ? ' cs--with-rail' : ''}`}
      style={{ '--cs-accent': project.accent }}
    >
      {showRail ? (
        <CaseStudyNav
          brand={railBrand}
          steps={railSteps}
          backTo={backTo}
          backLabel={backLabel}
        />
      ) : (
        <Link className="cs-back" to={backTo}>
          <span className="cs-rail__back-arrow" aria-hidden="true">
            ←
          </span>
          <span>{backLabel}</span>
        </Link>
      )}

      <header className={`cs-hero cs-hero--${layout}`}>
        <div className="cs-hero__copy">
          <p className="cs-hero__meta">{project.meta}</p>
          <h1>{projectNavLabel(project)}</h1>
          {project.outcome && project.outcome !== project.title ? (
            <p className="cs-hero__outcome">{project.outcome}</p>
          ) : null}
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
            <a className="folio-btn folio-btn--solid" href={`mailto:${SITE.email}`}>
              Ask about this work
            </a>
            {project.liveUrl && (
              <a
                className="folio-btn"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                title={
                  project.slug === 'competitor-watch'
                    ? 'First load on Render can take about 60 seconds'
                    : undefined
                }
              >
                {projectLiveCtaLabel(project)}
              </a>
            )}
            {project.connectUrl && (
              <a
                className="folio-btn"
                href={project.connectUrl}
                target="_blank"
                rel="noreferrer"
              >
                {project.connectCta || 'Lola Connect'} ↗
              </a>
            )}
            {project.whatsappUrl && (
              <a
                className="folio-btn"
                href={project.whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Try on WhatsApp ↗
              </a>
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
              <CaseStudyVideo
                src={project.reel}
                poster={project.hero || project.cover}
                label={`${project.title} demo`}
                mode="ambient"
                className="cs-banner__video"
              />
            ) : (
              <img
                src={project.hero || project.cover}
                alt={`${project.title}: project visual`}
              />
            )}
          </div>
        )}
      </header>

      {isCwCase && <CompetitorWatchCaseStudy />}

      {project.sections.map((section, index) => (
        <section
          id={sectionAnchorId(section.eyebrow, index)}
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

      <CaseStudyContact id={contactId} headingId={contactHeadingId} />
      <CaseStudyNext prev={prev} next={next} />
    </article>
  )
}
