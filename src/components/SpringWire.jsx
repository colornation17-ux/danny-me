import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'

const POINT_COUNT = 20
const VIEW_H = 52
const BASE_Y = VIEW_H / 2
/** Show "drag me" when pointer is in the right slice of the wire */
const HINT_FROM = 0.72

function restY(i, seed) {
  const n =
    Math.sin(i * 1.7 + seed * 2.1) * 1.15 +
    Math.sin(i * 0.55 + seed) * 0.55 +
    Math.cos(i * 3.1 + seed * 0.7) * 0.35
  return BASE_Y + n
}

function buildPath(pts) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return d
}

/**
 * Full-bleed pencil rule. Stronger hover/drag response.
 * "drag me" hint fades in only when the pointer is near the right end.
 */
export default function SpringWire({
  className = '',
  label = 'Hand-drawn section rule',
  seed = 1,
}) {
  const wrapRef = useRef(null)
  const mainRef = useRef(null)
  const ghostRef = useRef(null)
  const hintRef = useRef(null)
  const pointsRef = useRef([])
  const pullingRef = useRef(false)
  const pointerIdRef = useRef(null)
  const filterId = useId().replace(/:/g, '')

  useEffect(() => {
    const wrap = wrapRef.current
    const main = mainRef.current
    const ghost = ghostRef.current
    const hint = hintRef.current
    if (!wrap || !main || !ghost || !hint) return

    const setPath = () => {
      const pts = pointsRef.current
      const d = buildPath(pts)
      main.setAttribute('d', d)
      const ghostPts = pts.map((p) => ({ ...p, y: p.y + 0.85 }))
      ghost.setAttribute('d', buildPath(ghostPts))
    }

    const setHint = (visible) => {
      gsap.to(hint, {
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 4,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const layout = () => {
      const width = Math.max(wrap.clientWidth, 320)
      wrap.querySelector('svg')?.setAttribute('viewBox', `0 0 ${width} ${VIEW_H}`)
      const prev = pointsRef.current
      const keeping = prev.length === POINT_COUNT && !pullingRef.current
      pointsRef.current = Array.from({ length: POINT_COUNT }, (_, i) => {
        const x = (width / (POINT_COUNT - 1)) * i
        const oy = restY(i, seed)
        return {
          x,
          y: keeping && typeof prev[i]?.y === 'number' ? prev[i].y : oy,
          ox: x,
          oy,
        }
      })
      setPath()
    }

    const localPoint = (clientX, clientY) => {
      const rect = wrap.getBoundingClientRect()
      const svg = wrap.querySelector('svg')
      const width = svg?.viewBox?.baseVal?.width || rect.width
      const nx = (clientX - rect.left) / rect.width
      return {
        x: nx * width,
        y: ((clientY - rect.top) / rect.height) * VIEW_H,
        nx,
      }
    }

    const pullToward = (clientX, clientY, strength = 1) => {
      const { x, y, nx } = localPoint(clientX, clientY)
      const pts = pointsRef.current
      let nearest = 0
      let best = Infinity
      pts.forEach((p, i) => {
        const d = Math.hypot(p.ox - x, BASE_Y - y)
        if (d < best) {
          best = d
          nearest = i
        }
      })

      pts.forEach((p, i) => {
        const dist = Math.abs(i - nearest)
        const falloff = Math.max(0, 1 - dist / 5.5) ** 1.25
        if (falloff <= 0) return
        const pull = Math.min(strength, 0.92) * falloff
        const targetY = gsap.utils.clamp(
          4,
          VIEW_H - 4,
          gsap.utils.interpolate(p.oy, y, pull),
        )
        gsap.to(p, {
          y: targetY,
          duration: pullingRef.current ? 0.1 : 0.28,
          ease: pullingRef.current ? 'power3.out' : 'power2.out',
          overwrite: 'auto',
          onUpdate: setPath,
        })
      })

      // Near the right end: nudge tip + show hint
      if (!pullingRef.current && nx >= HINT_FROM) {
        setHint(true)
        wrap.classList.add('spring-wire--hint')
      } else if (!pullingRef.current) {
        setHint(false)
        wrap.classList.remove('spring-wire--hint')
      }
    }

    const springHome = () => {
      setHint(false)
      wrap.classList.remove('spring-wire--hint', 'spring-wire--pulling')
      pointsRef.current.forEach((p, i) => {
        gsap.to(p, {
          y: p.oy,
          duration: 0.95 + (i % 4) * 0.05,
          ease: 'elastic.out(1.15, 0.32)',
          overwrite: 'auto',
          onUpdate: setPath,
        })
      })
    }

    const onPointerDown = (e) => {
      pullingRef.current = true
      pointerIdRef.current = e.pointerId
      wrap.classList.add('spring-wire--pulling')
      setHint(false)
      wrap.setPointerCapture?.(e.pointerId)
      pullToward(e.clientX, e.clientY, 1)
    }

    const onPointerMove = (e) => {
      if (pullingRef.current && pointerIdRef.current === e.pointerId) {
        pullToward(e.clientX, e.clientY, 1)
        return
      }
      if (e.pointerType === 'mouse' && !pullingRef.current) {
        pullToward(e.clientX, e.clientY, 0.48)
      }
    }

    const onPointerUp = (e) => {
      if (pointerIdRef.current != null && e.pointerId !== pointerIdRef.current) return
      pullingRef.current = false
      pointerIdRef.current = null
      springHome()
    }

    const onPointerLeave = () => {
      if (pullingRef.current) return
      springHome()
    }

    gsap.set(hint, { opacity: 0, y: 4 })
    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(wrap)

    wrap.addEventListener('pointerdown', onPointerDown)
    wrap.addEventListener('pointermove', onPointerMove)
    wrap.addEventListener('pointerup', onPointerUp)
    wrap.addEventListener('pointercancel', onPointerUp)
    wrap.addEventListener('pointerleave', onPointerLeave)

    return () => {
      ro.disconnect()
      wrap.removeEventListener('pointerdown', onPointerDown)
      wrap.removeEventListener('pointermove', onPointerMove)
      wrap.removeEventListener('pointerup', onPointerUp)
      wrap.removeEventListener('pointercancel', onPointerUp)
      wrap.removeEventListener('pointerleave', onPointerLeave)
      gsap.killTweensOf(pointsRef.current)
      gsap.killTweensOf(hint)
    }
  }, [seed])

  return (
    <div
      ref={wrapRef}
      className={`spring-wire ${className}`.trim()}
      role="img"
      aria-label={label}
    >
      <svg
        className="spring-wire__svg"
        viewBox={`0 0 1200 ${VIEW_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id={`pencil-${filterId}`} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed={seed * 7}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0.7"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <path
          ref={ghostRef}
          className="spring-wire__path spring-wire__path--ghost"
          d={`M 0 ${BASE_Y} L 1200 ${BASE_Y}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#pencil-${filterId})`}
        />
        <path
          ref={mainRef}
          className="spring-wire__path spring-wire__path--main"
          d={`M 0 ${BASE_Y} L 1200 ${BASE_Y}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#pencil-${filterId})`}
        />
      </svg>
      <span ref={hintRef} className="spring-wire__hint" aria-hidden="true">
        drag me
      </span>
    </div>
  )
}
