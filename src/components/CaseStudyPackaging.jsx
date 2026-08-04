import { useEffect, useState } from 'react'
import { getCaseStudyPackaging } from '../data/caseStudyPackaging'

/**
 * Visual skim: one outcome line + up to three sketch/screen beats.
 * Renders nothing when the slug has no packaging entry.
 */
export default function CaseStudyPackaging({ slug, className = '' }) {
  const pack = getCaseStudyPackaging(slug)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  if (!pack?.line) return null

  const beats = Array.isArray(pack.beats) ? pack.beats.filter((b) => b?.src) : []

  return (
    <section
      id="cs-pack"
      className={`cs-pack${className ? ` ${className}` : ''}`}
      aria-labelledby="cs-pack-line"
    >
      <h2 id="cs-pack-line" className="cs-pack__line">
        {pack.line}
      </h2>

      {beats.length > 0 ? (
        <ul className="cs-pack__beats">
          {beats.map((beat) => {
            const kind = beat.kind === 'video' ? 'video' : 'image'
            return (
              <li key={`${beat.src}-${beat.caption}`} className="cs-pack__beat">
                <div className="cs-pack__media">
                  {kind === 'video' ? (
                    <video
                      src={beat.src}
                      muted
                      loop
                      playsInline
                      autoPlay={!reduceMotion}
                      preload="metadata"
                      aria-label={beat.alt || beat.caption}
                    />
                  ) : (
                    <img
                      src={beat.src}
                      alt={beat.alt || beat.caption || ''}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                {beat.caption ? (
                  <p className="cs-pack__caption">{beat.caption}</p>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}
