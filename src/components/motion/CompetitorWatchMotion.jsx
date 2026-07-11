import { useEffect, useRef, useState } from 'react'
import { CW_GALLERY_CLIPS } from '../../data/competitorWatchMotion'

/** Feature gallery — clean clips; this container owns chrome (no double chrome). */
export default function CompetitorWatchMotion() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [ready, setReady] = useState(false)
  const touchStart = useRef(null)
  const prevIndex = useRef(0)
  const videoRefs = useRef([])

  const beat = CW_GALLERY_CLIPS[index]
  const duration = beat?.duration ?? 6000
  const direction = index >= prevIndex.current ? 1 : -1

  useEffect(() => {
    prevIndex.current = index
  }, [index])

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    setTransitioning(true)
    const id = window.setTimeout(() => setTransitioning(false), 320)
    return () => window.clearTimeout(id)
  }, [index, reduceMotion])

  useEffect(() => {
    const video = videoRefs.current[index]
    if (!video || reduceMotion) return
    video.currentTime = 0
    if (paused) {
      video.pause()
      return
    }
    video.play().catch(() => {})
  }, [index, paused, reduceMotion])

  const go = (delta) => {
    setIndex((i) => (i + delta + CW_GALLERY_CLIPS.length) % CW_GALLERY_CLIPS.length)
  }

  useEffect(() => {
    if (paused || reduceMotion) return undefined
    const id = window.setTimeout(() => go(1), duration)
    return () => window.clearTimeout(id)
  }, [index, paused, reduceMotion, duration])

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (e) => {
    if (touchStart.current == null) return
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStart.current
    touchStart.current = null
    if (Math.abs(dx) < 40) return
    go(dx < 0 ? 1 : -1)
  }

  const beatNum = String(index + 1).padStart(2, '0')
  const beatTotal = String(CW_GALLERY_CLIPS.length).padStart(2, '0')

  return (
    <div
      className={`cw-live cw-live--video${paused ? ' cw-live--paused' : ''}${ready || reduceMotion ? ' cw-live--ready' : ''}${transitioning ? ' cw-live--transition' : ''}`}
      aria-hidden="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="cw-live__frame">
        <div
          className="cw-live__viewport"
          style={{ '--cw-dir': direction, '--beat-ms': `${duration}ms` }}
        >
          {CW_GALLERY_CLIPS.map((b, i) => (
            <div
              key={b.id}
              className={`cw-video-slide${i === index ? ' cw-video-slide--active' : ''}`}
              aria-hidden={i !== index}
            >
              {reduceMotion ? (
                <img className="cw-video-slide__media" src={b.poster} alt="" />
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el
                  }}
                  className="cw-video-slide__media"
                  src={b.src}
                  poster={b.poster}
                  muted
                  playsInline
                  preload={i === 0 ? 'auto' : 'metadata'}
                  onLoadedData={() => {
                    if (i === 0) setReady(true)
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div key={beat.id} className="cw-live__flash" aria-hidden />
        <div className="cw-live__vignette" aria-hidden />

        <div key={beat.id} className="cw-live__chrome">
          <span className="cw-live__counter">{beatNum} / {beatTotal}</span>
          <span className="cw-live__label">{beat.label}</span>
          <span className="cw-live__caption">{beat.proof.join(' · ')}</span>
        </div>

        <div className="cw-live__progress" aria-hidden>
          <span
            key={`${beat.id}-${paused}`}
            className="cw-live__progress-bar"
            style={{ animationDuration: paused || reduceMotion ? '0s' : `${duration}ms` }}
          />
        </div>

        {!ready && !reduceMotion && <div className="cw-live__loading">Loading preview…</div>}
      </div>

      <div className="cw-live__dots" aria-hidden>
        {CW_GALLERY_CLIPS.map((b, i) => (
          <button
            key={b.id}
            type="button"
            className={`cw-live__dot${i === index ? ' cw-live__dot--active' : ''}`}
            tabIndex={-1}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
