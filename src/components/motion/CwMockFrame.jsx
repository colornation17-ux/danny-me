import { useEffect, useRef, useState } from 'react'
import CompetitorWatchMockScreen, { CW_CLIP_SCENE } from './CompetitorWatchMockScreens'

/**
 * Readable animated UI mock for proof / hero — IntersectionObserver drives replay.
 */
export default function CwMockFrame({
  clipId,
  scene: sceneProp,
  label,
  className = '',
  size = 'proof', // 'proof' | 'hero'
}) {
  const ref = useRef(null)
  const [active, setActive] = useState(true)
  const scene = sceneProp || CW_CLIP_SCENE[clipId]

  useEffect(() => {
    const el = ref.current
    if (!el || !scene) return undefined
    setActive(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio >= 0.2)
      },
      { threshold: [0, 0.2, 0.5] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [scene])

  if (!scene) return null

  return (
    <div
      ref={ref}
      className={`cw-mock-frame cw-mock-frame--${size} ${className}`.trim()}
      aria-label={label || `${scene} product UI`}
    >
      <div aria-hidden="true">
        <CompetitorWatchMockScreen scene={scene} active={active} />
      </div>
    </div>
  )
}
