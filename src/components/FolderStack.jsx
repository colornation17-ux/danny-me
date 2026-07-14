import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ProjectMotionPreview, { hasMotionPreview } from './motion/ProjectMotionPreview'

// color-cyan-58 · color-grey-7 · color-orange-55 · color-rose-50 · color-spring-green-45 · color-orange-80
export const FOLDER_TONES = [
  { fill: '#36C5F0', ink: '#111212' },
  { fill: '#111212', ink: '#ffffff' },
  { fill: '#ECB22E', ink: '#111212' },
  { fill: '#E01E5A', ink: '#ffffff' },
  { fill: '#2EB67D', ink: '#111212' },
  { fill: '#F5DDA1', ink: '#111212' },
]

// Nav height in px — must match site-nav height in CSS
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

function FolderCard({ project, index, total, tone: baseTone, tabW, cardState, onJump }) {
  const tone = project.folderFill
    ? { fill: project.folderFill, ink: project.folderInk ?? baseTone.ink }
    : baseTone
  const to = project.href || `/projects/${project.slug}`
  const motion = hasMotionPreview(project.slug)
  const cta = project.placeholder
    ? 'Case study soon'
    : project.conceptOnly
      ? 'View in Play'
      : 'View Project'
  const label = project.index || String(index + 1).padStart(2, '0')
  const tags = project.tags || project.skills?.slice(0, 2) || []
  const mediaAlt = project.coverAlt || `${project.displayTitle} preview`

  // Past cards sit underneath the active card — their tab buttons stay visible
  // through the transparent indent holes in the active card's chrome row.
  // Active card sits on top. Future cards are hidden off-screen below.
  const zIndex = cardState === 'active' ? total + 10 : index + 1

  return (
    <article
      className={`folder-card folder-card--${cardState}`}
      id={`pj${index + 1}`}
      data-index={index}
      aria-label={`Project ${label}: ${project.displayTitle}`}
      aria-hidden={cardState === 'future' ? 'true' : undefined}
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
          className="folder-card__tab"
          aria-label={`Project ${label}: ${project.displayTitle}`}
          onClick={() => onJump(index)}
          tabIndex={cardState === 'future' ? -1 : 0}
        >
          <span className="folder-card__tab-num" aria-hidden="true">{label}</span>
          <span className="folder-card__tab-label">{project.displayTitle}</span>
        </button>
        <div className="folder-card__tab-slope" aria-hidden="true" />
        <div className="folder-card__ledge" aria-hidden="true" />
      </div>

      <div className="folder-card__content">
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
          >{project.displayTitle}</h3>
            <p className="folder-card__blurb">
              {project.outcome || project.blurb}
            </p>
          </div>

          <Link
            to={to}
            className="folder-card__cta"
            tabIndex={cardState === 'active' ? 0 : -1}
          >
            <span>{cta}</span>
            <span className="folder-card__cta-arrow" aria-hidden="true">↗</span>
          </Link>

          {tags.length > 0 && (
            <div className="folder-card__tags">
              {tags.map((tag) => (
                <FolderTag key={tag} label={tag} />
              ))}
            </div>
          )}
        </div>

        <div className="folder-card__img">
          <div className={`folder-card__image${project.reelPortrait ? ' folder-card__image--portrait' : ''}`}>
            {project.reel && project.reelPortrait ? (
              <div className="folder-card__portrait-wrap">
                <video src={project.reel} autoPlay muted loop playsInline />
                <div className="folder-card__corners" aria-hidden="true">
                  <span /><span /><span /><span />
                </div>
              </div>
            ) : project.reel ? (
              <video
                src={project.reel}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : motion ? (
              <ProjectMotionPreview slug={project.slug} size="card" />
            ) : project.cover ? (
              <img src={project.cover} alt={mediaAlt} loading="lazy" />
            ) : (
              <div className="folder-card__placeholder" aria-hidden="true">
                <span>{project.displayTitle}</span>
              </div>
            )}

            {!project.reelPortrait && (
              <div className="folder-card__corners" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Single sticky container holds all 6 cards at the same viewport position.
 * Scroll tracking advances the active card index; past cards stay visible
 * under the active card so their tab buttons show through indent holes,
 * building the full tab row naturally. Future cards wait off-screen below.
 *
 * Stack height = N × 70vh + (100vh − NAV_H), giving each card 70vh of
 * dedicated scroll space with clean math: scrollRange = N × 70vh.
 */
export default function FolderStack({ projects }) {
  const stackRef = useRef(null)
  const [tabW, setTabW] = useState(100)
  const [activeIndex, setActiveIndex] = useState(0)
  const total = projects.length

  useEffect(() => {
    const el = stackRef.current
    if (!el) return
    const measure = () => {
      const width = el.clientWidth
      const usable = Math.max(300, width * 0.85)
      setTabW(Math.floor(Math.min(180, Math.max(100, usable / total))))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [total])

  const activeIndexRef = useRef(0)

  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return

    const onScroll = () => {
      const rect = stack.getBoundingClientRect()
      const scrolled = -(rect.top - NAV_H)
      const scrollRange = stack.offsetHeight - (window.innerHeight - NAV_H)
      if (scrollRange <= 0) return
      const progress = Math.max(0, Math.min(1, scrolled / scrollRange))
      const idx = Math.min(Math.floor(progress * total), total - 1)
      // Only re-render when index actually changes
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx
        setActiveIndex(idx)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [total])

  // GSAP entrance — useLayoutEffect runs before paint so the card is already
  // at y:105% when the browser first renders the new activeIndex frame,
  // eliminating the flash caused by CSS class change → paint → GSAP override.
  const prevActive = useRef(0)
  useLayoutEffect(() => {
    const prev = prevActive.current
    prevActive.current = activeIndex
    // Only animate forward advances; backward jumps snap via CSS
    if (activeIndex <= prev) return
    const stack = stackRef.current
    if (!stack) return
    const card = stack.querySelector(`[data-index="${activeIndex}"]`)
    if (!card) return
    // Kill any in-progress tween on this card before starting a new one
    gsap.killTweensOf(card)
    gsap.fromTo(
      card,
      { y: '105%' },
      { y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform' },
    )
  }, [activeIndex])

  const jumpTo = useCallback(
    (index) => {
      const stack = stackRef.current
      if (!stack) return
      const stackAbsTop = stack.getBoundingClientRect().top + window.scrollY
      const scrollRange = stack.offsetHeight - (window.innerHeight - NAV_H)
      const targetScroll = stackAbsTop - NAV_H + (index / total) * scrollRange
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    },
    [total],
  )

  return (
    <div
      className="folder-stack"
      ref={stackRef}
      style={{ '--folder-count': total, '--folder-tab-w': `${tabW}px` }}
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
            />
          )
        })}
      </div>
    </div>
  )
}
