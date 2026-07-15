import { useEffect, useId, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  hasFoundWireRadio,
  markFoundWireRadio,
  toggleWireRadio,
  wireRadioDefaults,
} from '../lib/wireRadio'

const POINT_COUNT = 20
const VIEW_H = 52
const BASE_Y = VIEW_H / 2
/** Hover follow strength — full-width, not just the right tip */
const HOVER_PULL = 0.72
const HINT_EDGE_PAD = 56

function restY(i, seed) {
  const n =
    Math.sin(i * 1.7 + seed * 2.1) * 2.1 +
    Math.sin(i * 0.55 + seed) * 1.05 +
    Math.cos(i * 3.1 + seed * 0.7) * 0.55
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
 * Full-bleed pencil rule. Optional radio: pull toggles the shared bed.
 * `invite` — first-visit “try pulling me” cue (readable on fast scroll).
 */
export default function SpringWire({
  className = '',
  label = 'Hand-drawn section rule',
  seed = 1,
  radio = false,
  invite = false,
}) {
  const wrapRef = useRef(null)
  const mainRef = useRef(null)
  const ghostRef = useRef(null)
  const hintRef = useRef(null)
  const pointsRef = useRef([])
  const pullingRef = useRef(false)
  const pointerIdRef = useRef(null)
  const pullStartRef = useRef(null)
  const invitingRef = useRef(false)
  const radioOpts = radio === true ? wireRadioDefaults() : radio || null
  const radioRef = useRef(radioOpts)
  radioRef.current = radioOpts
  const filterId = useId().replace(/:/g, '')
  const [radioOn, setRadioOn] = useState(false)
  const [found, setFound] = useState(() =>
    typeof window !== 'undefined' ? hasFoundWireRadio() : false,
  )
  const hasRadio = Boolean(radio)
  const showInvite = hasRadio && invite && !found

  useEffect(() => {
    if (!hasRadio) return undefined
    const onRadio = (e) => setRadioOn(Boolean(e.detail?.playing))
    window.addEventListener('wire-radio', onRadio)
    return () => window.removeEventListener('wire-radio', onRadio)
  }, [hasRadio])

  useEffect(() => {
    const wrap = wrapRef.current
    const main = mainRef.current
    const ghost = ghostRef.current
    const hint = hintRef.current
    if (!wrap || !main || !ghost || !hint) return

    invitingRef.current = showInvite

    const setPath = () => {
      const pts = pointsRef.current
      const d = buildPath(pts)
      main.setAttribute('d', d)
      const ghostPts = pts.map((p) => ({ ...p, y: p.y + 0.85 }))
      ghost.setAttribute('d', buildPath(ghostPts))
    }

    const placeHint = (clientX) => {
      const rect = wrap.getBoundingClientRect()
      const x = gsap.utils.clamp(
        HINT_EDGE_PAD,
        Math.max(HINT_EDGE_PAD, rect.width - HINT_EDGE_PAD),
        clientX - rect.left,
      )
      gsap.set(hint, {
        left: x,
        xPercent: -50,
        yPercent: -50,
        top: '50%',
      })
    }

    const setHint = (visible, clientX) => {
      // Invite cue stays readable — never fade it during scroll
      if (invitingRef.current) {
        gsap.set(hint, { opacity: 1, y: 0 })
        wrap.classList.add('spring-wire--hint')
        if (typeof clientX === 'number') placeHint(clientX)
        return
      }
      if (visible && typeof clientX === 'number') placeHint(clientX)
      gsap.to(hint, {
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 6,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      })
      if (visible) wrap.classList.add('spring-wire--hint')
      else wrap.classList.remove('spring-wire--hint')
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
      const { x, y } = localPoint(clientX, clientY)
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
        const falloff = Math.max(0, 1 - dist / 5.5) ** 1.2
        if (falloff <= 0) return
        const pull = Math.min(strength, 0.95) * falloff
        const targetY = gsap.utils.clamp(
          3,
          VIEW_H - 3,
          gsap.utils.interpolate(p.oy, y, pull),
        )
        gsap.to(p, {
          y: targetY,
          duration: pullingRef.current ? 0.08 : 0.2,
          ease: pullingRef.current ? 'power3.out' : 'power2.out',
          overwrite: 'auto',
          onUpdate: setPath,
        })
      })

      // Hint + emphasis wherever the pointer is on the wire
      if (!pullingRef.current) {
        setHint(true, clientX)
      } else if (invitingRef.current) {
        setHint(true, clientX)
      }
    }

    const springHome = () => {
      if (!invitingRef.current) {
        setHint(false)
      } else {
        // Re-center invite label when pointer leaves
        const rect = wrap.getBoundingClientRect()
        placeHint(rect.left + rect.width / 2)
        setHint(true)
      }
      wrap.classList.remove('spring-wire--pulling')
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
      pullStartRef.current = { x: e.clientX, y: e.clientY, t: performance.now() }
      wrap.classList.add('spring-wire--pulling')
      placeHint(e.clientX)
      if (!invitingRef.current) {
        gsap.to(hint, { opacity: 0.35, duration: 0.15, overwrite: 'auto' })
      }
      wrap.setPointerCapture?.(e.pointerId)
      pullToward(e.clientX, e.clientY, 1)
    }

    const onPointerMove = (e) => {
      if (pullingRef.current && pointerIdRef.current === e.pointerId) {
        placeHint(e.clientX)
        pullToward(e.clientX, e.clientY, 1)
        return
      }
      // Hover: wire follows cursor along the full length
      if (!pullingRef.current) {
        pullToward(e.clientX, e.clientY, HOVER_PULL)
      }
    }

    const onPointerUp = (e) => {
      if (pointerIdRef.current != null && e.pointerId !== pointerIdRef.current) return
      const start = pullStartRef.current
      const moved = start
        ? Math.hypot(e.clientX - start.x, e.clientY - start.y)
        : 0
      const held = start ? performance.now() - start.t : 0
      pullingRef.current = false
      pointerIdRef.current = null
      pullStartRef.current = null
      springHome()

      if (radioRef.current && (moved > 10 || held > 120)) {
        // Reveal player on intentional pull even if audio file fails to load
        invitingRef.current = false
        setFound(true)
        wrap.classList.remove('spring-wire--invite')
        wrap.classList.remove('spring-wire--invite-inview')
        markFoundWireRadio()
        toggleWireRadio(radioRef.current).catch(() => {})
      }
    }

    const onPointerLeave = () => {
      if (pullingRef.current) return
      springHome()
    }

    const onPointerEnter = (e) => {
      if (pullingRef.current) return
      pullToward(e.clientX, e.clientY, HOVER_PULL)
    }

    layout()

    if (showInvite) {
      wrap.classList.add('spring-wire--invite')
      const rect = wrap.getBoundingClientRect()
      placeHint(rect.left + rect.width / 2)
      gsap.set(hint, { opacity: 1, y: 0 })
      wrap.classList.add('spring-wire--hint')
    } else {
      gsap.set(hint, { opacity: 0, y: 6, xPercent: -50, yPercent: -50, left: '50%', top: '50%' })
    }

    let io
    if (showInvite && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return
          wrap.classList.toggle('spring-wire--invite-inview', entry.isIntersecting)
          if (entry.isIntersecting) setHint(true)
        },
        { threshold: [0, 0.15, 0.4], rootMargin: '0px 0px -8% 0px' },
      )
      io.observe(wrap)
    }

    const ro = new ResizeObserver(layout)
    ro.observe(wrap)

    wrap.addEventListener('pointerdown', onPointerDown)
    wrap.addEventListener('pointermove', onPointerMove)
    wrap.addEventListener('pointerup', onPointerUp)
    wrap.addEventListener('pointercancel', onPointerUp)
    wrap.addEventListener('pointerleave', onPointerLeave)
    wrap.addEventListener('pointerenter', onPointerEnter)

    return () => {
      io?.disconnect()
      ro.disconnect()
      wrap.removeEventListener('pointerdown', onPointerDown)
      wrap.removeEventListener('pointermove', onPointerMove)
      wrap.removeEventListener('pointerup', onPointerUp)
      wrap.removeEventListener('pointercancel', onPointerUp)
      wrap.removeEventListener('pointerleave', onPointerLeave)
      wrap.removeEventListener('pointerenter', onPointerEnter)
      gsap.killTweensOf(pointsRef.current)
      gsap.killTweensOf(hint)
    }
  }, [seed, hasRadio, showInvite])

  const hintCopy = !hasRadio
    ? 'drag me'
    : showInvite
      ? 'try pulling me'
      : radioOn
        ? 'pull to pause'
        : 'pull to play'

  const wireLabel = hasRadio
    ? `${label}. Pull to ${radioOn ? 'pause' : 'play'} a quiet radio clip.`
    : label

  return (
    <div
      ref={wrapRef}
      className={`spring-wire${hasRadio ? ' spring-wire--radio' : ''}${radioOn ? ' spring-wire--playing' : ''}${showInvite ? ' spring-wire--invite' : ''} ${className}`.trim()}
      role={hasRadio ? 'button' : 'img'}
      tabIndex={hasRadio ? 0 : undefined}
      aria-label={wireLabel}
      aria-pressed={hasRadio ? radioOn : undefined}
      onKeyDown={
        hasRadio
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setFound(true)
                markFoundWireRadio()
                toggleWireRadio(radioRef.current).catch(() => {})
              }
            }
          : undefined
      }
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
        {hintCopy}
      </span>
    </div>
  )
}
