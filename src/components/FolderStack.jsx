import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ProjectMotionPreview, { hasMotionPreview } from './motion/ProjectMotionPreview'
import {
  projectCaseCtaLabel,
  projectDestination,
  projectLiveCtaLabel,
  projectNavLabel,
} from '../lib/projectLinks'

export const FOLDER_TONES = [
  { fill: '#36C5F0', ink: '#111212' },
  { fill: '#111212', ink: '#ffffff' },
  { fill: '#ECB22E', ink: '#111212' },
  { fill: '#E01E5A', ink: '#ffffff' },
  { fill: '#2EB67D', ink: '#111212' },
  { fill: '#F5DDA1', ink: '#111212' },
]

const NAV_H = 74

function resolveLayoutMode() {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  // Align with CSS 2-col cut (≥900) and desktop chrome (≥1200)
  if (w < 900) return 'mobile'
  if (w < 1200) return 'tablet'
  return 'desktop'
}

function FolderTag({ label }) {
  return (
    <span className="folder-card__tag">
      <span className="folder-card__tag-label">{label}</span>
    </span>
  )
}

function FolderCard({
  project,
  index,
  total,
  tone: baseTone,
  tabW,
  cardState,
  onJump,
  reduceMotion,
  isInitialCard,
  layoutMode,
}) {
  const mediaVideoRef = useRef(null)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const tone = project.folderFill
    ? { fill: project.folderFill, ink: project.folderInk ?? baseTone.ink }
    : baseTone
  const dest = projectDestination(project)
  const to = dest?.to || `/projects/${project.slug}`
  const isExternalCase = Boolean(dest?.external)
  const motion = hasMotionPreview(project.slug)
  const cta = projectCaseCtaLabel(project)
  const title = projectNavLabel(project)
  const isActive = cardState === 'active'
  // Mobile: numbers only. Else active = full label, inactive = compact.
  const tabTitle =
    layoutMode === 'mobile'
      ? null
      : isActive
        ? project.tabLabel || title
        : project.tabLabelCompact || project.tabLabel || title
  const label = project.index || String(index + 1).padStart(2, '0')
  const tags = project.tags || project.skills?.slice(0, 2) || []
  const mediaAlt = project.coverAlt || `${title} preview`
  const company =
    project.company ||
    (project.meta ? project.meta.split('·')[0].trim() : null)
  const status = project.status || null
  const role = project.role || null
  const liveLabel = projectLiveCtaLabel(project)
  const hasAudioControl = Boolean(project.reelAudioControl && project.reel)
  const contentId = `project-content-${project.slug}`
  const buttonId = `project-button-${project.slug}`
  const poster = project.reel
    ? project.reelPoster || undefined
    : project.cover || project.hero || undefined
  // Past cards stay under the active one — higher index = higher paint order
  const zIndex = isActive ? total + 10 : index + 1

  const showLive =
    Boolean(project.liveUrl) &&
    to !== project.liveUrl &&
    !/^https?:\/\/wa\.me\//i.test(project.liveUrl || '')

  // Cap at 2 secondary actions so footers don't blow the sticky frame
  const secondaryLinks = []
  if (showLive) {
    secondaryLinks.push({
      href: project.liveUrl,
      label: liveLabel,
      aria: `${liveLabel} for ${title} (opens in a new tab)`,
    })
  }
  if (project.whatsappUrl) {
    secondaryLinks.push({
      href: project.whatsappUrl,
      label: project.whatsappCta || `Try ${title}`,
      aria: `${project.whatsappCta || `Try ${title}`} (opens in a new tab)`,
    })
  }
  if (project.connectUrl) {
    secondaryLinks.push({
      href: project.connectUrl,
      label: project.connectCta || 'Open staff app',
      aria: `${project.connectCta || 'Open staff app'} (opens in a new tab)`,
    })
  }
  const visibleSecondary = secondaryLinks.slice(0, 2)
  const isDenseFooter = visibleSecondary.length >= 2
  const showMetaSub = Boolean(project.timeline || project.team) && !isDenseFooter

  useEffect(() => {
    const video = mediaVideoRef.current
    if (!video) return undefined

    if (!isActive) {
      video.pause()
      video.muted = true
      if (isAudioOn) setIsAudioOn(false)
      return undefined
    }

    if (reduceMotion) {
      video.pause()
      return undefined
    }

    video.muted = !isAudioOn
    video.play().catch(() => {})

    return () => {
      video.pause()
    }
  }, [isActive, reduceMotion, isAudioOn])

  const toggleAudio = useCallback(async () => {
    const video = mediaVideoRef.current
    if (!video) return

    const nextAudioState = !isAudioOn
    video.muted = !nextAudioState
    video.volume = nextAudioState ? 1 : 0

    try {
      if (nextAudioState) await video.play()
      setIsAudioOn(nextAudioState)
    } catch {
      video.muted = true
      setIsAudioOn(false)
    }
  }, [isAudioOn])

  const CtaEl = isExternalCase ? 'a' : Link
  const ctaProps = isExternalCase
    ? {
        href: to,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `${cta} for ${title} (opens in a new tab)`,
      }
    : { to, 'aria-label': `${cta}: ${title}` }

  return (
    <article
      className={`folder-card folder-card--${cardState}${isActive ? '' : ' folder-card--inactive'}`}
      id={`project-${project.slug}`}
      data-index={index}
      style={{
        '--folder-fill': tone.fill,
        '--folder-ink': tone.ink,
        '--folder-index': index,
        '--folder-tab-w': `${tabW}px`,
        zIndex,
      }}
    >
      <div className="folder-card__chrome">
        {index > 0 && (
          <div className="folder-card__indent" aria-hidden="true" />
        )}
        <button
          type="button"
          id={buttonId}
          className="folder-card__tab"
          aria-label={`Project ${label}: ${title}`}
          aria-expanded={isActive}
          aria-controls={contentId}
          aria-current={isActive ? 'true' : undefined}
          onClick={() => onJump(index)}
          onFocus={() => {
            // Future tabs are visually off-stage — focusing them should reveal the card.
            if (cardState === 'future') onJump(index)
          }}
        >
          <span className="folder-card__tab-num" aria-hidden="true">{label}</span>
          {tabTitle ? (
            <span className="folder-card__tab-label">{tabTitle}</span>
          ) : null}
        </button>
        <div className="folder-card__tab-slope" aria-hidden="true" />
        <div className="folder-card__ledge" aria-hidden="true" />
      </div>

      <div
        id={contentId}
        className="folder-card__content"
        aria-labelledby={buttonId}
        aria-hidden={reduceMotion ? undefined : !isActive}
        {...(!isActive && !reduceMotion ? { inert: true } : {})}
      >
        <div className="folder-card__text">
          <p className="folder-card__progress" aria-hidden="true">
            {label} / {String(total).padStart(2, '0')}
          </p>
          <div className="folder-card__text-main">
            <div className="folder-card__date">
              <span className="folder-card__date-dot" aria-hidden="true" />
              <span>{project.folderDate || project.year || '2026'}</span>
            </div>
            <h3
              className="folder-card__title"
              data-font={project.folderTitleFont || ''}
            >
              {title}
            </h3>
            {(role || company || status) && (
              <p className="folder-card__meta">
                {[role, company, status].filter(Boolean).join(' · ')}
              </p>
            )}
            {showMetaSub && (
              <p className="folder-card__meta folder-card__meta--sub">
                {[project.timeline, project.team].filter(Boolean).join(' · ')}
              </p>
            )}
            {tags.length > 0 && (
              <div className="folder-card__tags folder-card__tags--identity">
                {tags.map((tag) => (
                  <FolderTag key={tag} label={tag} />
                ))}
              </div>
            )}
            <p className="folder-card__blurb">
              {project.blurb || project.outcome}
            </p>
            {project.metric ? (
              <p className="folder-card__metric">
                {project.metricKind ? (
                  <span className="folder-card__metric-kind">{project.metricKind}</span>
                ) : null}
                <span className="folder-card__metric-value">{project.metric}</span>
              </p>
            ) : null}
          </div>

          <div
            className={`folder-card__cta-row${
              isDenseFooter ? ' folder-card__cta-row--split' : ''
            }`}
          >
            <CtaEl {...ctaProps} className="folder-card__cta">
              <span>{cta}</span>
              <span className="folder-card__cta-arrow" aria-hidden="true">↗</span>
            </CtaEl>
            {visibleSecondary.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="folder-card__live"
                aria-label={link.aria}
                onClick={(e) => e.stopPropagation()}
              >
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>

        <div className="folder-card__img">
          <div
            className={`folder-card__image${
              project.reelPortrait
                ? ' folder-card__image--portrait'
                : ' folder-card__image--fill'
            }${project.reelObjectPosition === 'top' ? ' folder-card__image--pos-top' : ''}`}
          >
            {project.reel && project.reelPortrait ? (
              <div className="folder-card__portrait-wrap">
                <video
                  ref={mediaVideoRef}
                  muted
                  loop
                  playsInline
                  preload={isActive ? 'metadata' : 'none'}
                  {...(poster ? { poster } : {})}
                  aria-hidden="true"
                >
                  <source src={project.reel} type="video/mp4" />
                </video>
              </div>
            ) : project.reel ? (
              <video
                ref={mediaVideoRef}
                muted
                loop
                playsInline
                preload={isActive ? 'metadata' : 'none'}
                {...(poster ? { poster } : {})}
                aria-hidden="true"
              >
                <source src={project.reel} type="video/mp4" />
              </video>
            ) : motion ? (
              <ProjectMotionPreview slug={project.slug} size="card" />
            ) : project.cover ? (
              <img
                src={project.cover}
                alt={mediaAlt}
                loading={isInitialCard ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={isInitialCard ? 'high' : 'auto'}
              />
            ) : (
              <div className="folder-card__placeholder" aria-hidden="true">
                <span>{title}</span>
              </div>
            )}

            {hasAudioControl && isActive && !reduceMotion && (
              <button
                type="button"
                className="folder-card__audio"
                onClick={toggleAudio}
                aria-pressed={isAudioOn}
              >
                {isAudioOn ? 'Audio on' : 'Play audio'}
              </button>
            )}

            <div className="folder-card__corners" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Sticky folder scrub on all viewports — CSS transforms only (no GSAP).
 * Past cards stay painted underneath so the stack never flashes empty grid.
 * Reduced-motion falls back to a static stacked list via CSS.
 */
export default function FolderStack({ projects }) {
  const stackRef = useRef(null)
  const [tabW, setTabW] = useState(100)
  const [activeIndex, setActiveIndex] = useState(0)
  const [navH, setNavH] = useState(NAV_H)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [layoutMode, setLayoutMode] = useState(() =>
    typeof window !== 'undefined' ? resolveLayoutMode() : 'desktop',
  )
  const total = projects.length
  const activeIndexRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setReduceMotion(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])

  useEffect(() => {
    const read = () => setLayoutMode(resolveLayoutMode())
    read()
    window.addEventListener('resize', read, { passive: true })
    window.visualViewport?.addEventListener('resize', read)
    return () => {
      window.removeEventListener('resize', read)
      window.visualViewport?.removeEventListener('resize', read)
    }
  }, [])

  useEffect(() => {
    const el = stackRef.current
    if (!el) return undefined
    const measure = () => {
      const sticky = el.querySelector('.folder-sticky')
      const width = sticky?.clientWidth || el.clientWidth
      // Fit all tabs in the chrome row with room for slope
      const slope = layoutMode === 'mobile' ? 28 : 40
      const minTab = layoutMode === 'mobile' ? 56 : layoutMode === 'tablet' ? 72 : 96
      const maxTab = layoutMode === 'mobile' ? 88 : 140
      const usable = Math.max(200, width - slope - 8)
      setTabW(Math.floor(Math.min(maxTab, Math.max(minTab, usable / total))))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [total, layoutMode])

  useEffect(() => {
    const nav = document.querySelector('.site-nav--folio, .site-nav')
    if (!nav) return undefined
    const read = () => {
      const h = Math.round(nav.getBoundingClientRect().height) || NAV_H
      setNavH(h)
      stackRef.current?.style.setProperty('--folder-nav-h', `${h}px`)
    }
    read()
    const ro = new ResizeObserver(read)
    ro.observe(nav)
    window.visualViewport?.addEventListener('resize', read)
    return () => {
      ro.disconnect()
      window.visualViewport?.removeEventListener('resize', read)
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) return undefined
    const stack = stackRef.current
    if (!stack) return undefined

    let raf = 0
    const stickyHOf = () => {
      const sticky = stack.querySelector('.folder-sticky')
      return sticky?.clientHeight || Math.max(1, window.innerHeight - navH)
    }
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const rect = stack.getBoundingClientRect()
        const scrolled = -(rect.top - navH)
        const stickyH = stickyHOf()
        const scrollRange = stack.offsetHeight - stickyH
        if (scrollRange <= 0 || total <= 1) {
          if (activeIndexRef.current !== 0) {
            activeIndexRef.current = 0
            setActiveIndex(0)
          }
          return
        }
        const progress = Math.max(0, Math.min(1, scrolled / scrollRange))
        const idx = Math.round(progress * (total - 1))
        if (idx !== activeIndexRef.current) {
          activeIndexRef.current = idx
          setActiveIndex(idx)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.visualViewport?.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [total, navH, reduceMotion])

  // If scroll changes the active card while focus sits inside an inert panel,
  // move focus to the newly active project tab so keyboard users aren't trapped.
  useEffect(() => {
    const activeEl = document.activeElement
    if (!(activeEl instanceof HTMLElement)) return
    const panel = activeEl.closest('.folder-card__content')
    if (!panel) return
    if (!panel.hasAttribute('inert') && panel.getAttribute('aria-hidden') !== 'true') {
      return
    }
    const slug = projects[activeIndex]?.slug
    if (!slug) return
    const nextTab = document.getElementById(`project-button-${slug}`)
    nextTab?.focus({ preventScroll: true })
  }, [activeIndex, projects])

  const jumpTo = useCallback(
    (index) => {
      const stack = stackRef.current
      if (!stack || total <= 0) return

      if (reduceMotion) {
        activeIndexRef.current = index
        setActiveIndex(index)
        stack.querySelector(`[data-index="${index}"]`)?.scrollIntoView({
          block: 'nearest',
          behavior: 'auto',
        })
        return
      }

      const sticky = stack.querySelector('.folder-sticky')
      const stickyH = sticky?.clientHeight || Math.max(1, window.innerHeight - navH)
      const stackAbsTop = stack.getBoundingClientRect().top + window.scrollY
      const scrollRange = Math.max(0, stack.offsetHeight - stickyH)
      const progress = total <= 1 ? 0 : index / (total - 1)
      window.scrollTo({
        top: stackAbsTop - navH + progress * scrollRange,
        behavior: 'smooth',
      })
    },
    [total, navH, reduceMotion],
  )

  return (
    <div
      className={`folder-stack folder-stack--${layoutMode}`}
      ref={stackRef}
      role="region"
      aria-label="Featured projects"
      style={{
        '--folder-count': total,
        '--folder-tab-w': `${tabW}px`,
        '--folder-nav-h': `${navH}px`,
      }}
    >
      <div className="folder-sticky">
        {projects.map((project, index) => {
          const cardState =
            index < activeIndex
              ? 'past'
              : index === activeIndex
                ? 'active'
                : 'future'
          return (
            <FolderCard
              key={project.slug}
              project={project}
              index={index}
              total={total}
              tone={FOLDER_TONES[index % FOLDER_TONES.length]}
              tabW={tabW}
              cardState={cardState}
              onJump={jumpTo}
              reduceMotion={reduceMotion}
              isInitialCard={index === 0}
              layoutMode={layoutMode}
            />
          )
        })}
      </div>
    </div>
  )
}
