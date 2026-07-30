import { useEffect, useRef, useState } from 'react'
import CaseStudyVideo from '../CaseStudyVideo'
import { CW_GALLERY_CLIPS } from '../../data/competitorWatchMotion'

const EASE_MS = 5500

/**
 * Hero chapters — clean clips only (no baked-in 0N/06 chrome).
 * Auto-advances; dots jump to a chapter.
 */
export default function CwHeroChapters() {
  const [index, setIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const timer = useRef(null)
  const clip = CW_GALLERY_CLIPS[index]

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reduceMotion || CW_GALLERY_CLIPS.length < 2) return undefined
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % CW_GALLERY_CLIPS.length)
    }, EASE_MS)
    return () => window.clearInterval(timer.current)
  }, [reduceMotion, index])

  if (!clip) return null

  return (
    <div className="cw-hero-chapters">
      <div className="cw-hero-chapters__stage">
        <CaseStudyVideo
          key={clip.id}
          src={clip.src}
          poster={clip.poster}
          label={`${clip.label}. ${clip.caption}`}
          mode="ambient"
          className="cs-video--hero"
          loop
        />
      </div>
      <div className="cw-hero-chapters__meta">
        <p className="cw-hero-chapters__label">
          <span>{clip.n}</span>
          {clip.label}
        </p>
        <div className="cw-hero-chapters__dots" role="tablist" aria-label="Product chapters">
          {CW_GALLERY_CLIPS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${c.n} ${c.label}`}
              className={`cw-hero-chapters__dot${i === index ? ' cw-hero-chapters__dot--active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
