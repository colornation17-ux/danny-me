import { useEffect, useRef, useState } from 'react'

/**
 * 16:9 case-study video — IntersectionObserver play/pause, reduced-motion → poster.
 */
export default function CaseStudyVideo({
  src,
  poster,
  label,
  className = '',
  mode = 'scroll', // 'scroll' | 'ambient' | 'manual'
  loop = true,
}) {
  const ref = useRef(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [failed, setFailed] = useState(false)
  const ambient = mode === 'ambient'

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const tryPlay = () => {
    const el = ref.current
    if (!el || reduceMotion || failed) return
    el.muted = true
    const p = el.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }

  useEffect(() => {
    const el = ref.current
    if (!el || reduceMotion || mode === 'manual' || failed) return undefined

    if (ambient) {
      tryPlay()
      const onReady = () => tryPlay()
      el.addEventListener('loadeddata', onReady)
      el.addEventListener('canplay', onReady)
      // Retry once after a tick — browsers sometimes block the first play()
      const t = window.setTimeout(tryPlay, 120)
      return () => {
        el.removeEventListener('loadeddata', onReady)
        el.removeEventListener('canplay', onReady)
        window.clearTimeout(t)
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          tryPlay()
        } else {
          el.pause()
        }
      },
      { threshold: [0, 0.35, 0.75] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mode, reduceMotion, failed, src, ambient])

  if (reduceMotion || failed) {
    return (
      <div className={`cs-video ${className}`} role="img" aria-label={label}>
        <img src={poster} alt={label || ''} loading="lazy" />
      </div>
    )
  }

  return (
    <div className={`cs-video ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        autoPlay={ambient}
        playsInline
        loop={loop}
        preload={ambient ? 'auto' : 'metadata'}
        aria-label={label}
        onLoadedData={ambient ? tryPlay : undefined}
        onCanPlay={ambient ? tryPlay : undefined}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
