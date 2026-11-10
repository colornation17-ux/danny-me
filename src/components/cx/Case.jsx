/* Building blocks of the case-study system (styles/cx-case.css). Shared by case-study pages. */
import { useEffect, useRef } from 'react'

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

/** Loops only while at least a quarter of it is on screen; a still poster when the reader prefers less motion. */
export function AutoVideo({ src, poster, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  if (REDUCED) return <img src={poster} alt={label} />
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} />
}
