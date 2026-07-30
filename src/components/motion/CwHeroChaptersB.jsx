import { useEffect, useId, useRef, useState } from 'react'
import CwMockFrame from './CwMockFrame'
import { CW_HERO_CLIPS } from '../../data/competitorWatchMotion'
import { CW_CLIP_SCENE } from './CompetitorWatchMockScreens'

const EASE_MS = 5500

function TabIcon({ id }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  switch (id) {
    case 'sales-summary':
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" />
          <path d="M8 16l3-5 3 3 5-7" />
        </svg>
      )
    case 'competitor-deals':
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h10M4 17h14" />
          <circle cx="18" cy="12" r="2" />
        </svg>
      )
    case 'competitive-pricing':
      return (
        <svg {...common}>
          <path d="M12 3v18M7 8h7a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8" />
        </svg>
      )
    case 'demand-forecast':
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" />
          <path d="M8 15l3-4 3 2 4-6" />
        </svg>
      )
    case 'whatsapp-crm':
      return (
        <svg {...common}>
          <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2.1-5.2A8.5 8.5 0 1 1 21 11.5Z" />
          <path d="M9.5 10.5h.01M12.5 10.5h.01M15.5 10.5h.01" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      )
  }
}

/** Hero: animated UI mocks (not video) + pauseable tabs. */
export default function CwHeroChapters() {
  const [index, setIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hold, setHold] = useState(false)
  const timer = useRef(null)
  const tablistId = useId()
  const panelId = useId()
  const clips = CW_HERO_CLIPS.filter((c) => CW_CLIP_SCENE[c.id])
  const clip = clips[index]
  const autoPlay = !reduceMotion && !paused && !hold

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!autoPlay || clips.length < 2) return undefined
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % clips.length)
    }, EASE_MS)
    return () => window.clearInterval(timer.current)
  }, [autoPlay, index, clips.length])

  if (!clip) return null

  return (
    <div
      className={`cw-hero195${paused || hold ? ' cw-hero195--paused' : ''}`}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHold(false)
      }}
    >
      <div className="cw-hero195__frame">
        <div
          className="cw-hero195__stage cw-hero195__stage--mock"
          role="tabpanel"
          id={panelId}
          aria-labelledby={`${tablistId}-${clip.id}`}
        >
          <CwMockFrame
            key={clip.id}
            clipId={clip.id}
            label={`${clip.label}. ${clip.job}`}
            size="hero"
          />
        </div>
      </div>

      <div className="cw-hero195__toolbar">
        <div
          className="cw-hero195__tabs"
          role="tablist"
          aria-label="Product surfaces"
          id={tablistId}
        >
          {clips.map((c, i) => {
            const selected = i === index
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`${tablistId}-${c.id}`}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                title={c.label}
                className={`cw-hero195__tab${selected ? ' cw-hero195__tab--active' : ''}`}
                onClick={() => {
                  setIndex(i)
                  setPaused(true)
                }}
                onKeyDown={(e) => {
                  if (
                    e.key !== 'ArrowRight' &&
                    e.key !== 'ArrowLeft' &&
                    e.key !== 'Home' &&
                    e.key !== 'End'
                  ) {
                    return
                  }
                  e.preventDefault()
                  let next = i
                  if (e.key === 'ArrowRight') next = (i + 1) % clips.length
                  if (e.key === 'ArrowLeft') next = (i - 1 + clips.length) % clips.length
                  if (e.key === 'Home') next = 0
                  if (e.key === 'End') next = clips.length - 1
                  setIndex(next)
                  setPaused(true)
                  document.getElementById(`${tablistId}-${clips[next].id}`)?.focus()
                }}
              >
                <TabIcon id={c.id} />
                <span className="cw-hero195__tab-label">{c.label}</span>
              </button>
            )
          })}
        </div>

        {!reduceMotion && clips.length > 1 && (
          <button
            type="button"
            className="cw-hero195__pause"
            aria-pressed={paused}
            aria-label={paused ? 'Resume surface slideshow' : 'Pause surface slideshow'}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? 'Play' : 'Pause'}
          </button>
        )}
      </div>

      <div className="cw-hero195__meta">
        <p className="cw-hero195__job">
          <span>{String(index + 1).padStart(2, '0')}</span>
          {clip.job}
        </p>
        <p className="cw-hero195__caption">
          <strong>
            {clip.signature}
            {clip.signatureLabel ? ` · ${clip.signatureLabel}` : ''}
          </strong>
          {clip.proof?.length ? ` — ${clip.proof.join(' · ')}` : ''}
        </p>
        <p className="sr-only" aria-live="polite">
          Showing {clip.label}: {clip.job}. {clip.caption}
        </p>
      </div>
    </div>
  )
}
