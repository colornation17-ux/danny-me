import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ProjectMotionPreview, { hasMotionPreview } from './motion/ProjectMotionPreview'
import {
  projectCaseCtaLabel,
  projectDestination,
  projectLiveCtaLabel,
  projectNavLabel,
} from '../lib/projectLinks'

// color-cyan-58 · color-grey-7 · color-orange-55 · color-rose-50 · color-spring-green-45 · color-orange-80
export const FOLDER_TONES = [
  { fill: '#36C5F0', ink: '#111212' },
  { fill: '#111212', ink: '#ffffff' },
  { fill: '#ECB22E', ink: '#111212' },
  { fill: '#E01E5A', ink: '#ffffff' },
  { fill: '#2EB67D', ink: '#111212' },
  { fill: '#F5DDA1', ink: '#111212' },
]

// Nav height in px — default; runtime measurement syncs --folder-nav-h
const NAV_H = 74

function StairsIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M1 14h4v-3h3V8h3V5h4V2H9v3H6v3H3v3H1v3Z"
      />
    </svg>
  )
}

function JpgGlyph() {
  return (
    <svg viewBox="0 0 23 23" width="18" height="18" aria-hidden="true">
      <path
        d="M10.7334 12.2667H11.5001C11.7034 12.2667 11.8984 12.186 12.0422 12.0422C12.186 11.8984 12.2667 11.7034 12.2667 11.5001C12.2667 11.2967 12.186 11.1017 12.0422 10.958C11.8984 10.8142 11.7034 10.7334 11.5001 10.7334H10.7334V12.2667Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5332 2.3C1.5332 1.69 1.77552 1.10499 2.20686 0.673654C2.63819 0.242321 3.22321 0 3.8332 0L16.4173 0L21.4665 5.04927V20.7C21.4665 21.31 21.2242 21.895 20.7929 22.3263C20.3615 22.7577 19.7765 23 19.1665 23H3.8332C3.22321 23 2.63819 22.7577 2.20686 22.3263C1.77552 21.895 1.5332 21.31 1.5332 20.7V2.3ZM6.1332 10.7333H3.06654V9.2H7.66654V16.8667H3.06654V13.8H4.59987V15.3333H6.1332V10.7333ZM9.19987 9.2H11.4999C12.1099 9.2 12.6949 9.44232 13.1262 9.87365C13.5575 10.305 13.7999 10.89 13.7999 11.5C13.7999 12.11 13.5575 12.695 13.1262 13.1263C12.6949 13.5577 12.1099 13.8 11.4999 13.8H10.7332V16.8667H9.19987V9.2ZM15.3332 9.2H19.9332V10.7333H16.8665V15.3333H18.3999V13.0333H19.9332V16.8667H15.3332V9.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M3.99984 13.0001L3.99984 11.0001L15.9998 11.0001L10.4998 5.50008L11.9198 4.08008L19.8398 12.0001L11.9198 19.9201L10.4998 18.5001L15.9998 13.0001L3.99984 13.0001Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FolderTag({ label }) {
  return (
    <span className="folder-card__tag">
      <span className="folder-card__tag-label">{label}</span>
    </span>
  )
}

function resolveLayoutMode() {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  // Width-only: short laptop height must NOT drop desktop sticky stack
  // (that made past cards “disappear” while scrubbing).
  if (w < 768) return 'mobile'
  if (w < 1200) return 'tablet'
  return 'desktop'
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
  const tabTitle =
    layoutMode === 'desktop'
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
  const isActive = cardState === 'active'
  const contentId = `project-content-${project.slug}`
  const buttonId = `project-button-${project.slug}`
  const poster = project.reelPoster || project.cover || project.hero || undefined
  const isStacked = layoutMode !== 'desktop'

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

  // Past cards sit underneath the active card — their tab buttons stay visible
  // through the transparent indent holes in the active card's chrome row.
  // Active card sits on top. Future cards are hidden off-screen below.
  const zIndex = cardState === 'active' ? total + 10 : index + 1

  const CtaEl = isExternalCase ? 'a' : Link
  const ctaProps = isExternalCase
    ? {
        href: to,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `${cta} for ${title} (opens in a new tab)`,
      }
    : { to, 'aria-label': `${cta}: ${title}` }

  const showLive =
    Boolean(project.liveUrl) &&
    to !== project.liveUrl &&
    !/^https?:\/\/wa\.me\//i.test(project.liveUrl || '')

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
          onClick={() => onJump(index)}
        >
          <span className="folder-card__tab-num" aria-hidden="true">{label}</span>
          <span className="folder-card__tab-label">{tabTitle}</span>
        </button>
        <div className="folder-card__tab-slope" aria-hidden="true" />
        <div className="folder-card__ledge" aria-hidden="true" />
      </div>

      <div
        id={contentId}
        className={`folder-card__content${isActive ? '' : ' folder-card__content--inactive'}`}
        aria-labelledby={buttonId}
        aria-hidden={!isActive}
        hidden={isStacked && !isActive ? true : undefined}
        {...(!isActive ? { inert: true } : {})}
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
            {(project.timeline || project.team) && (
              <p className="folder-card__meta folder-card__meta--sub">
                {[project.timeline, project.team].filter(Boolean).join(' · ')}
              </p>
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
              project.whatsappUrl && project.connectUrl
                ? ' folder-card__cta-row--split'
                : ''
            }`}
          >
            <CtaEl {...ctaProps} className="folder-card__cta">
              <span>{cta}</span>
              <span className="folder-card__cta-arrow" aria-hidden="true">↗</span>
            </CtaEl>
            {showLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="folder-card__live"
                aria-label={`${liveLabel} for ${title} (opens in a new tab)`}
                onClick={(e) => e.stopPropagation()}
              >
                {liveLabel} <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.whatsappUrl && (
              <a
                href={project.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="folder-card__live folder-card__live--secondary"
                aria-label={`${project.whatsappCta || `Try ${title}`} (opens in a new tab)`}
                onClick={(e) => e.stopPropagation()}
              >
                {project.whatsappCta || 'Try Lola'} <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.connectUrl && (
              <a
                href={project.connectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="folder-card__live folder-card__live--secondary"
                aria-label={`${project.connectCta || 'Open staff app'} (opens in a new tab)`}
                onClick={(e) => e.stopPropagation()}
              >
                {project.connectCta || 'Open staff app'} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          {tags.length > 0 && (
            <div className="folder-card__tags">
              {tags.map((tag) => (
                <FolderTag key={tag} label={tag} />
              ))}
            </div>
          )}
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

            {project.connectPreviews?.length > 0 && (
              <div className="folder-card__connect-strip folder-card__connect-strip--overlay" aria-label="Lola Connect preview">
                {project.connectPreviews.map((clip) => (
                  <figure key={clip.label} className="folder-card__connect-clip">
                    <video
                      src={clip.src}
                      muted
                      loop
                      playsInline
                      preload={isActive ? 'metadata' : 'none'}
                      aria-hidden="true"
                    />
                    <figcaption>{clip.label}</figcaption>
                  </figure>
                ))}
              </div>
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
 * Desktop (≥1200px, tall): sticky overlapping folder scrub.
 * Tablet / short windows: tab rail + one open panel.
 * Mobile: accordion — tap a named tab, no scroll scrub, media never clips.
 */
export default function FolderStack({ projects }) {
  const stackRef = useRef(null)
  const [tabW, setTabW] = useState(100)
  const [activeIndex, setActiveIndex] = useState(0)
  const [navH, setNavH] = useState(NAV_H)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [layoutMode, setLayoutMode] = useState('desktop')
  const total = projects.length
  const isDesktop = layoutMode === 'desktop'

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
    if (!el) return
    const measure = () => {
      const sticky = el.querySelector('.folder-sticky')
      const width = sticky?.clientWidth || el.clientWidth
      if (layoutMode !== 'desktop') {
        setTabW(Math.max(72, Math.floor(width / Math.min(total, 4))) )
        return
      }
      const usable = Math.max(300, width * 0.88)
      setTabW(Math.floor(Math.min(168, Math.max(112, usable / total))))
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

  const activeIndexRef = useRef(0)
  activeIndexRef.current = activeIndex

  useEffect(() => {
    if (!isDesktop) return undefined
    const stack = stackRef.current
    if (!stack) return undefined

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const rect = stack.getBoundingClientRect()
        const scrolled = -(rect.top - navH)
        const stickyH = window.innerHeight - navH
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
  }, [total, navH, isDesktop])

  const prevActive = useRef(0)
  useLayoutEffect(() => {
    if (!isDesktop) {
      prevActive.current = activeIndex
      return
    }
    const stack = stackRef.current
    if (!stack) return

    const cards = [...stack.querySelectorAll('.folder-card')]
    cards.forEach((card) => gsap.killTweensOf(card))
    // Drop any leftover inline transforms so CSS past/active/future classes win
    cards.forEach((card) => gsap.set(card, { clearProps: 'transform' }))

    const prev = prevActive.current
    prevActive.current = activeIndex
    if (reduceMotion || activeIndex <= prev) return

    const card = cards[activeIndex]
    if (!card) return
    gsap.fromTo(
      card,
      { y: '105%' },
      { y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform' },
    )
  }, [activeIndex, reduceMotion, isDesktop])

  const jumpTo = useCallback(
    (index) => {
      const stack = stackRef.current
      if (!stack || total <= 0) return

      if (!isDesktop) {
        setActiveIndex(index)
        activeIndexRef.current = index
        const card = stack.querySelector(`[data-index="${index}"]`)
        card?.scrollIntoView({
          block: 'nearest',
          behavior: reduceMotion ? 'auto' : 'smooth',
        })
        return
      }

      const stackAbsTop = stack.getBoundingClientRect().top + window.scrollY
      const stickyH = window.innerHeight - navH
      const scrollRange = Math.max(0, stack.offsetHeight - stickyH)
      const progress = total <= 1 ? 0 : index / (total - 1)
      const targetScroll = stackAbsTop - navH + progress * scrollRange
      window.scrollTo({
        top: targetScroll,
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    },
    [total, navH, reduceMotion, isDesktop],
  )

  return (
    <div
      className={`folder-stack folder-stack--${layoutMode}`}
      ref={stackRef}
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
