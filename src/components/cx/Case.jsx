/* Building blocks of the case-study system (styles/cx-case.css). Shared by case-study pages. */
import { useEffect, useRef, useState } from 'react'

export const REDUCED = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Numbered chapter: eyebrow, title, then rows and grids. */
export function Chapter({ id, n, label, title, children }) {
  return (
    <section id={id} className="cx-chapter">
      <div className="cx-wrap">
        <p className="cx-eyebrow"><b>{n}</b>{label}</p>
        <h2 className="cx-h2">{title}</h2>
        {children}
      </div>
    </section>
  )
}

/** Title in the left column, text in the right (desktop); stacked below. */
export function Row({ title, children }) {
  return (
    <div className="cx-row">
      <h3 className="cx-row__h">{title}</h3>
      <div className="cx-row__body">{children}</div>
    </div>
  )
}

/** One figure on the grid. size: q (quarter) · t (third) · h (half) · f (full). */
export function Figure({ src, alt, cap, size = 'q' }) {
  return (
    <figure className={`cx-fig cx-${size}`}>
      <img src={src} alt={alt} loading="lazy" />
      {cap ? <figcaption>{cap}</figcaption> : null}
    </figure>
  )
}

/**
 * Loops only while at least a quarter of it is on screen; a still poster when the reader prefers less motion.
 * A pause/play button lets anyone stop the loop (WCAG 2.2.2); once paused it stays paused while scrolling.
 */
export function AutoVideo({ src, poster, label }) {
  const ref = useRef(null)
  const stopped = useRef(false)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !stopped.current) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  if (REDUCED) return <img src={poster} alt={label} />
  const toggle = () => {
    const v = ref.current
    if (!v) return
    stopped.current = !paused
    if (paused) v.play().catch(() => {})
    else v.pause()
    setPaused(!paused)
  }
  return (
    <div className="cx-vid">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} />
      <button type="button" className="cx-vid__btn" onClick={toggle} aria-label={paused ? 'Play video' : 'Pause video'}>
        {paused
          ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" /></svg>
          : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 3.5h2.5v9H4.5zM9 3.5h2.5v9H9z" /></svg>}
      </button>
    </div>
  )
}

/**
 * Floating chapter nav (same pattern and .sf-nav styles as the storefront case study):
 * appears once the reader is past the opening band, marks the chapter in view. Hidden on phones.
 */
export function SectionNav({ sections, after = '.cx-band' }) {
  const [on, setOn] = useState(false)
  const [at, setAt] = useState(sections[0][0])
  useEffect(() => {
    const heads = sections.map(([id]) => document.getElementById(id)).filter(Boolean)
    if (!heads.length) return undefined
    const onScroll = () => {
      const band = document.querySelector(after)
      setOn(!!band && band.getBoundingClientRect().bottom < window.innerHeight * 0.5)
      let cur = heads[0].id
      for (const h of heads) if (h.getBoundingClientRect().top < window.innerHeight * 0.35) cur = h.id
      setAt(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sections, after])
  return (
    <nav className={`sf-nav${on ? ' is-on' : ''}`} aria-label="Chapters">
      {sections.map(([id, label]) => (
        <a key={id} href={`#${id}`} className={at === id ? 'is-at' : ''} aria-current={at === id ? 'true' : undefined}
          onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }) }}>{label}</a>
      ))}
    </nav>
  )
}
