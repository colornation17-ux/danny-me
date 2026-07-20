import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ProjectMotionPreview, { hasMotionPreview } from './motion/ProjectMotionPreview'
import {
  projectCaseCtaLabel,
  projectDestination,
  projectLiveCtaLabel,
  projectNavLabel,
} from '../lib/projectLinks'
import { buildFeaturedSecondaryActions } from '../data/featuredCardSchema'

// color-cyan-58 · color-grey-7 · color-orange-55 · color-rose-50 · color-spring-green-45 · color-orange-80
export const FOLDER_TONES = [
  { fill: '#36C5F0', ink: '#111212' },
  { fill: '#111212', ink: '#ffffff' },
  { fill: '#ECB22E', ink: '#111212' },
  { fill: '#E01E5A', ink: '#ffffff' },
  { fill: '#2EB67D', ink: '#111212' },
  { fill: '#F5DDA1', ink: '#111212' },
]

// Nav height in px — default; runtime measurement syncs --folder-nav-h (measured, not layout tab width)
const NAV_H = 74

/** Desktop folder stack only when both dimensions support it (no undefined 680–719 band). */
function resolveLayoutMode(width, height) {
  if (width >= 1200 && height >= 720) return 'desktop'
  if (width < 768) return 'mobile'
  return 'tablet'
}

function FolderCard({
  project,
  index,
  total,
  tone: baseTone,
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
  const tabLabel =
    (layoutMode !== 'desktop' && project.tabLabelCompact) ||
    project.tabLabel ||
    title
  const label = project.index || String(index + 1).padStart(2, '0')
  const tags = (project.tags || project.skills?.slice(0, 3) || []).slice(0, 3)
  const mediaAlt = project.coverAlt || `${title} preview`
  const company =
    project.company ||
    (project.meta ? project.meta.split('·')[0].trim() : null)
  const status = project.status || null
  const role = project.role || null
  const liveLabel = projectLiveCtaLabel(project)
  const hasAudioControl = Boolean(project.reelAudioControl && project.reel)
  const isActive = cardState === 'active'
  const panelId = `project-panel-${project.slug}`
  const triggerId = `project-trigger-${project.slug}`
  const poster = project.reelPoster || project.cover || project.hero || undefined
  const compactCtas = layoutMode !== 'desktop'
  // `hidden` only for tablet/mobile accordion — desktop keeps shell measurements
  const hidePanel =
    layoutMode !== 'desktop' && !isActive && !reduceMotion

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
    video.play().catch(() => {
      /* Poster remains if autoplay is blocked */
    })

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
      if (nextAudioState) {
        await video.play()
      }
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
      }
    : { to }

  const showLive =
    Boolean(project.liveUrl) &&
    to !== project.liveUrl &&
    !/^https?:\/\/wa\.me\//i.test(project.liveUrl || '')

  const secondaryLinks = buildFeaturedSecondaryActions(project, {
    showLive,
    liveLabel,
  })
  const useOverflow = compactCtas && secondaryLinks.length > 1
  const visibleSecondaries = useOverflow ? [] : secondaryLinks
  const overflowSecondaries = useOverflow ? secondaryLinks : []

  return (
    <article
      className={`folder-card folder-card--${cardState}${project.variant ? ` folder-card--${project.variant}` : ''}`}
      id={`project-${project.slug}`}
      data-index={index}
      data-state={cardState}
      style={{
        '--folder-fill': tone.fill,
        '--folder-ink': tone.ink,
        '--folder-index': index,
      }}
    >
      <div className="folder-card__chrome">
        {index > 0 && (
          <div className="folder-card__indent" aria-hidden="true" />
        )}
        <button
          type="button"
          id={triggerId}
          className="folder-card__tab"
          aria-expanded={isActive}
          aria-controls={panelId}
          onClick={() => onJump(index)}
        >
          <span className="folder-card__tab-num" aria-hidden="true">
            {label}
          </span>
          <span className="folder-card__tab-label">{tabLabel}</span>
        </button>
        <div className="folder-card__tab-slope" aria-hidden="true" />
        <div className="folder-card__ledge" aria-hidden="true" />
      </div>

      <div
        id={panelId}
        className={`folder-card__content${isActive ? '' : ' folder-card__content--inactive'}`}
        role="region"
        aria-labelledby={triggerId}
        hidden={hidePanel}
        aria-hidden={!isActive}
        inert={!isActive ? true : undefined}
      >
        <div className="folder-card__text">
          <div className="folder-card__heading folder-card__text-head">
            <p className="folder-card__progress" aria-hidden="true">
              {label} / {String(total).padStart(2, '0')}
            </p>
            <p className="folder-card__date">
              <span className="folder-card__date-dot" aria-hidden="true" />
              <span>{project.folderDate || project.year || '2026'}</span>
            </p>
          </div>

          <div className="folder-card__summary folder-card__text-main">
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
            {(project.timeline || project.team) && (
              <p className="folder-card__meta folder-card__meta--sub">
                {[project.timeline, project.team].filter(Boolean).join(' · ')}
              </p>
            )}
            <p className="folder-card__blurb">
              {project.outcome || project.blurb}
            </p>
          </div>

          <div
            className={`folder-card__metric-slot${project.metric ? '' : ' folder-card__metric-slot--empty'}`}
          >
            <p
              className={`folder-card__metric${project.metric ? '' : ' folder-card__metric--empty'}`}
              {...(!project.metric ? { 'aria-hidden': true } : {})}
            >
              {project.metric ? (
                <>
                  {project.metricKind && (
                    <span className="folder-card__metric-kind">
                      {project.metricKind}
                    </span>
                  )}
                  <span className="folder-card__metric-value">{project.metric}</span>
                </>
              ) : (
                '\u00a0'
              )}
            </p>
          </div>

          <div
            className={`folder-card__actions folder-card__cta-row${
              secondaryLinks.length > 1 && !compactCtas
                ? ' folder-card__cta-row--split'
                : ''
            }`}
          >
            <CtaEl {...ctaProps} className="folder-card__cta folder-card__primary">
              <span>{cta}</span>
              {isExternalCase && (
                <span className="sr-only"> (opens in a new tab)</span>
              )}
              <span className="folder-card__cta-arrow" aria-hidden="true">
                ↗
              </span>
            </CtaEl>
            {overflowSecondaries.length > 0 ? (
              <details className="folder-card__more">
                <summary>
                  {project.whatsappUrl || project.connectUrl
                    ? 'Live experiences'
                    : 'More actions'}
                </summary>
                {overflowSecondaries.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="folder-card__live folder-card__secondary"
                  >
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                    <span aria-hidden="true"> ↗</span>
                  </a>
                ))}
              </details>
            ) : (
              visibleSecondaries.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="folder-card__live folder-card__secondary"
                >
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              ))
            )}
          </div>

          <ul className="folder-card__tags" aria-label="Project skills">
            {tags.map((tag) => (
              <li className="folder-card__tag" key={tag}>
                <span className="folder-card__tag-label">{tag}</span>
              </li>
            ))}
          </ul>
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
                  poster={poster}
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
                poster={poster}
                aria-hidden="true"
              >
                <source src={project.reel} type="video/mp4" />
              </video>
            ) : project.cover ? (
              <img
                src={project.cover}
                alt={mediaAlt}
                loading={isInitialCard ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={isInitialCard ? 'high' : 'auto'}
              />
            ) : motion ? (
              <ProjectMotionPreview slug={project.slug} size="card" />
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
                aria-label={
                  isAudioOn
                    ? `Mute ${title} preview audio`
                    : `Play ${title} preview audio`
                }
              >
                {isAudioOn ? 'Audio on' : 'Play audio'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Single sticky container holds all N cards at the same viewport position.
 * Scroll tracking advances the active card index; past cards stay visible
 * under the active card so their tab buttons show through indent holes,
 * building the full tab row naturally. Future cards wait off-screen below.
 *
 * Desktop: scroll owns active state; tab clicks only scroll to that segment.
 * Tablet/mobile: selectedIndex owns active state (disclosure / accordion).
 */
export default function FolderStack({ projects }) {
  const stackRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollActiveIndex, setScrollActiveIndex] = useState(0)
  const [navH, setNavH] = useState(NAV_H)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [layoutMode, setLayoutMode] = useState(() => {
    if (typeof window === 'undefined') return 'desktop'
    return resolveLayoutMode(window.innerWidth, window.innerHeight)
  })
  const total = projects.length
  const isDesktopStack = layoutMode === 'desktop' && !reduceMotion
  const activeIndex = isDesktopStack ? scrollActiveIndex : selectedIndex
  const scrollActiveRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setReduceMotion(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])

  useEffect(() => {
    const el = stackRef.current
    if (!el) return undefined

    const syncMode = () => {
      const width = el.clientWidth || window.innerWidth
      const height = window.innerHeight
      setLayoutMode(resolveLayoutMode(width, height))
    }

    syncMode()
    const ro = new ResizeObserver(syncMode)
    ro.observe(el)
    window.addEventListener('resize', syncMode, { passive: true })
    window.visualViewport?.addEventListener('resize', syncMode)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', syncMode)
      window.visualViewport?.removeEventListener('resize', syncMode)
    }
  }, [])

  useEffect(() => {
    const nav = document.querySelector('.site-nav--folio, .site-nav')
    if (!nav) return undefined
    const read = () => {
      const h = Math.round(nav.getBoundingClientRect().height) || NAV_H
      setNavH(h)
      if (stackRef.current) {
        stackRef.current.style.setProperty('--folder-nav-h', `${h}px`)
      }
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
    if (!isDesktopStack) return undefined

    const stack = stackRef.current
    if (!stack) return undefined

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const focused = document.activeElement
        const currentPanel = stack.querySelector(
          `[data-index="${scrollActiveRef.current}"] .folder-card__content`,
        )
        if (focused && currentPanel?.contains(focused)) {
          return
        }

        const rect = stack.getBoundingClientRect()
        const scrolled = -(rect.top - navH)
        const stickyH = window.innerHeight - navH
        const scrollRange = stack.offsetHeight - stickyH
        if (scrollRange <= 0 || total <= 1) {
          if (scrollActiveRef.current !== 0) {
            scrollActiveRef.current = 0
            setScrollActiveIndex(0)
          }
          return
        }
        const progress = Math.max(0, Math.min(1, scrolled / scrollRange))
        const idx = Math.min(
          total - 1,
          Math.max(0, Math.floor(progress * total - 1e-6)),
        )
        if (idx !== scrollActiveRef.current) {
          scrollActiveRef.current = idx
          setScrollActiveIndex(idx)
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
  }, [total, navH, isDesktopStack])

  const jumpTo = useCallback(
    (index) => {
      if (!isDesktopStack) {
        setSelectedIndex(index)
        if (reduceMotion) {
          document
            .getElementById(`project-${projects[index]?.slug}`)
            ?.scrollIntoView({ behavior: 'auto', block: 'nearest' })
        }
        return
      }
      // Desktop: click only scrolls to that segment — scroll owns activeIndex
      const stack = stackRef.current
      if (!stack || total <= 0) return
      const stackAbsTop = stack.getBoundingClientRect().top + window.scrollY
      const stickyH = window.innerHeight - navH
      const scrollRange = Math.max(0, stack.offsetHeight - stickyH)
      const progress = total <= 1 ? 0 : (index + 0.5) / total
      const targetScroll = stackAbsTop - navH + progress * scrollRange
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      })
    },
    [total, navH, isDesktopStack, reduceMotion, projects],
  )

  return (
    <div
      className={`folder-stack folder-stack--${layoutMode}${
        reduceMotion ? ' folder-stack--static' : ''
      }`}
      ref={stackRef}
      style={{
        '--folder-count': total,
      }}
    >
      <div className="folder-sticky">
        {projects.map((project, index) => {
          const cardState = reduceMotion
            ? 'active'
            : index < activeIndex
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
