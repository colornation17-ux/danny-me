import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { getProjectBySlug, lab, work } from '../data/projects'
import { featured } from '../data/featured'
import { SITE } from '../data/site'
import ProjectMotionPreview, { hasMotionPreview } from '../components/motion/ProjectMotionPreview'
import CompetitorWatchCaseStudyA, {
  CW_RAIL_STEPS as CW_RAIL_STEPS_A,
} from '../components/motion/CompetitorWatchCaseStudyA'
import CompetitorWatchCaseStudyB, {
  CW_RAIL_STEPS as CW_RAIL_STEPS_B,
} from '../components/motion/CompetitorWatchCaseStudyB'
import CwHeroChaptersA from '../components/motion/CwHeroChaptersA'
import CwHeroChaptersB from '../components/motion/CwHeroChaptersB'
import LolaCaseStudy, { LOLA_RAIL_STEPS } from '../components/lola/LolaCaseStudy'
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
import BreathingText from '../components/fancy/BreathingText'
import { CW_HERO_PROOF, CW_METRICS, cwBlurb } from '../data/cwMetrics'
import { resolveCwCaseStudyRoute } from '../data/cwCaseStudyAb'

export default function Project() {
  const { slug } = useParams()
  const cwRoute = resolveCwCaseStudyRoute(slug)
  const project = cwRoute
    ? getProjectBySlug('competitor-watch')
    : getProjectBySlug(slug)
  const cwVariant = cwRoute?.variant ?? null
  const isCwB = cwVariant === 'b'
  /** Frame visible in the page flow */
  const [gameVisible, setGameVisible] = useState(true)
  /** Iframe only mounts after Play — keeps first paint light on phones */
  const [gameStarted, setGameStarted] = useState(false)

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
    // Featured strip wins — WING concepts stay in lab data but navigate with Work
    if (featuredIndex !== -1) {
      const len = featuredOrder.length
      return {
        prev: resolveNav(featuredOrder[(featuredIndex - 1 + len) % len]),
        next: resolveNav(featuredOrder[(featuredIndex + 1) % len]),
      }
    }
    if (isLab) {
      const i = lab.findIndex((p) => p.slug === project.slug)
      const len = lab.length
      return { prev: lab[(i - 1 + len) % len], next: lab[(i + 1) % len] }
    }
    const i = work.findIndex((p) => p.slug === project.slug)
    const len = work.length
    return { prev: work[(i - 1 + len) % len], next: work[(i + 1) % len] }
  }, [project, isLab, featuredIndex, featuredBySlug, featuredOrder])

  const isCwCase = Boolean(cwRoute)
  const isLolaCase = project?.caseStudyBody === 'lola'
  const embedUrl =
    project?.embedUrl ||
    (project?.slug === 'bodega-ops'
      ? 'https://la-bodega-game-preview.vercel.app/?embed=1'
      : null)
  const isGameCase = Boolean(embedUrl) && !isLolaCase
  const railSteps = useMemo(() => {
    if (!project) return []
    if (isCwCase) return isCwB ? CW_RAIL_STEPS_B : CW_RAIL_STEPS_A
    return stepsFromSections(project.sections)
  }, [project, isCwCase, isCwB])

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
    if (isGameCase && gameVisible && gameStarted) {
      document.body.classList.add('game-embed')
    } else {
      document.body.classList.remove('game-embed')
    }
    return () => document.body.classList.remove('game-embed')
  }, [isGameCase, gameVisible, gameStarted])

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

  const onFeaturedStrip = featuredIndex !== -1
  const backTo = onFeaturedStrip ? '/' : isLab ? '/play' : '/'
  const backLabel = onFeaturedStrip || !isLab ? 'Work' : 'Lab'
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

  if (isLolaCase) {
    return (
      <article
        className="cs cs--lola cs--with-rail"
        style={{ '--cs-accent': '#290545' }}
      >
        <CaseStudyNav
          brand="Lola"
          steps={LOLA_RAIL_STEPS}
          backTo={backTo}
          backLabel={backLabel}
        />
        <LolaCaseStudy />
        <CaseStudyNext prev={prev} next={next} />
      </article>
    )
  }

  if (isGameCase) {
    const dismissGame = () => {
      setGameStarted(false)
      setGameVisible(false)
      window.requestAnimationFrame(() => {
        document.getElementById('case-study')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    return (
      <article className="cs cs--game" style={{ '--cs-accent': project.accent }}>
        {gameVisible && (
          <div className={`cs-game-frame${gameStarted ? ' is-playing' : ' is-idle'}`}>
            {!gameStarted ? (
              <div className="cs-game-poster">
                <img
                  className="cs-game-poster__img"
                  src={project.cover || project.hero}
                  alt=""
                  decoding="async"
                  fetchPriority="high"
                />
                <div className="cs-game-poster__veil" aria-hidden="true" />
                <div className="cs-game-poster__copy">
                  <p className="cs-game-poster__eyebrow">Interactive case study · ~2 min</p>
                  <h2 className="cs-game-poster__title">Walk the store floor</h2>
                  <p className="cs-game-poster__blurb">
                    Tap zones to fix the POS, roles, and pricing — the same recovery path from the live launch.
                  </p>
                  <div className="cs-game-poster__actions">
                    <button
                      type="button"
                      className="cs-game-play"
                      onClick={() => setGameStarted(true)}
                    >
                      Play interactive →
                    </button>
                    <button type="button" className="cs-game-poster__skip" onClick={dismissGame}>
                      Skip to write-up
                    </button>
                  </div>
                  <a
                    className="cs-game-poster__external"
                    href={embedUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open full screen ↗
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                src={embedUrl}
                title={project.embedTitle || `${project.title} Interactive Case Study`}
                className="cs-game-iframe"
                allow="fullscreen"
                allowFullScreen
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}

            <Link to="/" className="cs-game-badge">
              <span>Danny Varghese</span>
              <span className="cs-game-badge__sep">·</span>
              <span>{project.embedBadge || 'La Bodega Case Study'}</span>
            </Link>

            {gameStarted && (
              <button type="button" className="cs-game-skip" onClick={dismissGame}>
                Skip · read the case study ↓
              </button>
            )}
          </div>
        )}

        {!gameVisible && (
          <div className="cs-game-replay">
            <button type="button" className="folio-btn folio-btn--solid" onClick={() => {
              setGameVisible(true)
              setGameStarted(false)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
              Play interactive demo
            </button>
            <a className="folio-btn" href={embedUrl} target="_blank" rel="noreferrer">
              Open full screen ↗
            </a>
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
              <h1 className="cs-hero__title">{projectNavLabel(project)}</h1>
              {project.outcome && project.outcome !== project.title ? (
                <p className="cs-hero__outcome">
                  <BreathingText
                    as="span"
                    className="cs-hero__breathe"
                    staggerDuration={0.05}
                    staggerFrom="first"
                    repeat={2}
                    fromFontVariationSettings="'wght' 450"
                    toFontVariationSettings="'wght' 720"
                  >
                    {project.outcome}
                  </BreathingText>
                </p>
              ) : null}
              <p className="cs-hero__blurb">{project.blurb}</p>
              <dl className="cs-meta-row">
                <div><dt>Role</dt><dd>{project.role}</dd></div>
                <div><dt>Timeline</dt><dd>{project.timeline}</dd></div>
                <div><dt>Team</dt><dd>{project.team}</dd></div>
                <div><dt>Skills</dt><dd>{project.skills.join(' · ')}</dd></div>
              </dl>
              <div className="cs-actions">
                <a className="folio-btn folio-btn--solid" href={`mailto:${SITE.email}`}>Discuss this project</a>
                {project.evidenceDoc && (
                  <a className="folio-btn" href={project.evidenceDoc} target="_blank" rel="noopener noreferrer">
                    {project.evidenceDocLabel || 'Research appendix'} ↗
                  </a>
                )}
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
                      <img src={item.src} alt={item.caption || ''} loading="lazy" decoding="async" />
                      {item.caption && <figcaption>{item.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              )}
              {section.image && (
                <figure className="cs-inline-shot">
                  <img src={section.image} alt="" loading="lazy" decoding="async" />
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

      <header
        className={`cs-hero cs-hero--${layout}${isCwB ? ' cs-hero--cw195' : ''}`}
      >
        <div className="cs-hero__copy">
          <p className="cs-hero__meta">{project.meta}</p>
          {isCwB ? (
            <h1 className="cs-hero__title">{projectNavLabel(project)}</h1>
          ) : (
            <h1>{projectNavLabel(project)}</h1>
          )}
          {project.outcome && project.outcome !== project.title ? (
            isCwCase ? (
              <p className="cs-hero__outcome">{project.outcome}</p>
            ) : (
              <p className="cs-hero__outcome">
                <BreathingText
                  as="span"
                  className="cs-hero__breathe"
                  staggerDuration={0.05}
                  staggerFrom="first"
                  repeat={2}
                  fromFontVariationSettings="'wght' 450"
                  toFontVariationSettings="'wght' 720"
                >
                  {project.outcome}
                </BreathingText>
              </p>
            )
          ) : null}
          {isCwB && project.problem ? (
            <p className="cs-hero__problem">{project.problem}</p>
          ) : null}
          {isCwB ? (
            <p className="cs-hero__proof">
              <strong>{CW_HERO_PROOF}</strong>
              <span>
                {CW_METRICS.store} · {CW_METRICS.market}
              </span>
            </p>
          ) : null}
          {isCwB ? (
            <p className="cs-hero__blurb">{cwBlurb()}</p>
          ) : (
            <p className="cs-hero__blurb">{project.blurb}</p>
          )}
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
          <div className={`cs-actions${isCwB ? ' cs-actions--cw195' : ''}`}>
            {isCwB && project.liveUrl ? (
              <a
                className="folio-btn folio-btn--solid"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                title="First load can take about 60 seconds on free hosting"
              >
                {projectLiveCtaLabel(project)}
              </a>
            ) : (
              <>
                <a className="folio-btn folio-btn--solid" href={`mailto:${SITE.email}`}>
                  Discuss this project
                </a>
                {project.evidenceDoc && (
                  <a className="folio-btn" href={project.evidenceDoc} target="_blank" rel="noopener noreferrer">
                    {project.evidenceDocLabel || 'Research appendix'} ↗
                  </a>
                )}
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
              </>
            )}
          </div>
          {isCwB && (
            <p className="cs-hero__note">
              Live app on free hosting — first load can take ~60s
            </p>
          )}
        </div>

        {hasMedia && (
          <div
            className={`cs-banner cs-banner--${layout}${motion || isCwCase ? ' cs-banner--motion' : ''}${isCwCase ? ' cs-banner--reel' : ''}`}
          >
            {isCwCase ? (
              isCwB ? <CwHeroChaptersB /> : <CwHeroChaptersA />
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

      {isCwCase && (isCwB ? <CompetitorWatchCaseStudyB /> : <CompetitorWatchCaseStudyA />)}

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
