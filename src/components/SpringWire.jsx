import { useEffect, useId, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  getWireRadioProgress,
  hasFoundWireRadio,
  isWireRadioPlaying,
  markFoundWireRadio,
  toggleWireRadio,
  wireRadioDefaults,
} from '../lib/wireRadio'
import { track } from '../lib/track'

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

/** Sample position + tangent angle along the live wire points (0–1). */
function sampleAlongWire(pts, t) {
  if (!pts.length) return { x: 0, y: BASE_Y, angle: 0 }
  if (pts.length === 1) return { x: pts[0].x, y: pts[0].y, angle: 0 }

  const segs = []
  let total = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const len = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y)
    segs.push(len)
    total += len
  }
  if (total <= 0) return { x: pts[0].x, y: pts[0].y, angle: 0 }

  let target = Math.max(0, Math.min(1, t)) * total
  for (let i = 0; i < segs.length; i++) {
    const len = segs[i]
    if (target <= len || i === segs.length - 1) {
      const u = len <= 0 ? 0 : Math.min(1, target / len)
      const p0 = pts[i]
      const p1 = pts[i + 1]
      return {
        x: p0.x + (p1.x - p0.x) * u,
        y: p0.y + (p1.y - p0.y) * u,
        angle: (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI,
      }
    }
    target -= len
  }
  const last = pts[pts.length - 1]
  return { x: last.x, y: last.y, angle: 0 }
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
  const tramRef = useRef(null)
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
    let humming = false
    let tramRiding = false
    let tramT = 0.4
    let tramNudgeX = 0
    let humPhase = 0
    let humStartTimer = 0
    let pointerOver = false
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarse =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
    // Phones: direct follow + soft return (no elastic bounce)
    const springEase = isCoarse ? 'power3.out' : 'elastic.out(1.12, 0.36)'
    const springDuration = isCoarse ? 0.48 : 0.95
    const pullPlayMinMove = isCoarse ? 10 : 10
    const pullPlayMinHold = isCoarse ? 90 : 120
    // Normalized progress per second (~3 min full fallback crossing)
    const tramFallbackSpeed = 1 / 180
    const tramNudgeMax = isCoarse ? 64 : 90
    const pullFalloff = isCoarse ? 6.2 : 5.5

    const placeTram = () => {
      const tram = tramRef.current
      const svg = wrap.querySelector('svg')
      if (!tram || !svg || !hasRadio) return
      const pts = pointsRef.current
      if (!pts.length) return

      const t = reduceMotion ? 0.5 : tramT
      const { x, y, angle } = sampleAlongWire(pts, t)
      const vbW = svg.viewBox.baseVal.width || Math.max(wrap.clientWidth, 320)
      const vbH = svg.viewBox.baseVal.height || VIEW_H
      const svgRect = svg.getBoundingClientRect()
      const wrapRect = wrap.getBoundingClientRect()
      const left =
        (x / vbW) * svgRect.width + (svgRect.left - wrapRect.left) + tramNudgeX
      // Sit on top of the wire (no hanging stem)
      const top = (y / vbH) * svgRect.height + (svgRect.top - wrapRect.top) - 1
      const sx = svgRect.width / vbW
      const sy = svgRect.height / vbH
      const pathTilt = reduceMotion
        ? 0
        : Math.max(
            -10,
            Math.min(
              10,
              (Math.atan2(
                Math.sin((angle * Math.PI) / 180) * sy,
                Math.cos((angle * Math.PI) / 180) * sx,
              ) *
                180) /
                Math.PI,
            ),
          )
      const tilt = reduceMotion ? 0 : pathTilt

      tram.style.transform = `translate3d(${left}px, ${top}px, 0) translate(-50%, -100%) rotate(${tilt.toFixed(2)}deg)`
      tram.style.opacity = tramRiding ? (reduceMotion ? '0.75' : '1') : '0'
    }

    const setPath = () => {
      const pts = pointsRef.current
      const d = buildPath(pts)
      main.setAttribute('d', d)
      const ghostPts = pts.map((p) => ({ ...p, y: p.y + 0.85 }))
      ghost.setAttribute('d', buildPath(ghostPts))
      placeTram()
    }

    /** Soft uneven hum while radio plays — settle to rest when pause */
    const tickHum = (_time, deltaTime) => {
      if (tramRiding && !reduceMotion) {
        const songProgress = getWireRadioProgress()
        if (songProgress != null) {
          // Start ~40% across the wire; finish the page as the song ends
          tramT = 0.4 + songProgress * 0.58
        } else {
          tramT += tramFallbackSpeed * ((deltaTime || 16.67) / 1000)
          if (tramT > 0.98) tramT = 0.4
        }
      }

      if (humming && !pullingRef.current && !pointerOver && !reduceMotion) {
        humPhase += 0.055
        const pts = pointsRef.current
        pts.forEach((p, i) => {
          const amp = 0.42 + (i % 5) * 0.08
          const wobble =
            Math.sin(humPhase * 2.35 + i * 0.91) * amp +
            Math.sin(humPhase * 5.7 + i * 1.63) * amp * 0.38 +
            Math.sin(humPhase * 0.9 + seed + i * 0.3) * 0.18
          p.y = p.oy + wobble
        })
        setPath()
        return
      }

      if (tramRiding) placeTram()
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

      // Touch: set points directly so the wire tracks the finger with no tween lag
      if (pullingRef.current && isCoarse) {
        gsap.killTweensOf(pts)
        pts.forEach((p, i) => {
          const dist = Math.abs(i - nearest)
          const falloff = Math.max(0, 1 - dist / pullFalloff) ** 1.15
          if (falloff <= 0) return
          const pull = Math.min(strength, 0.95) * falloff
          p.y = gsap.utils.clamp(
            3,
            VIEW_H - 3,
            gsap.utils.interpolate(p.oy, y, pull),
          )
        })
        setPath()
      } else {
        pts.forEach((p, i) => {
          const dist = Math.abs(i - nearest)
          const falloff = Math.max(0, 1 - dist / pullFalloff) ** 1.2
          if (falloff <= 0) return
          const pull = Math.min(strength, 0.95) * falloff
          const targetY = gsap.utils.clamp(
            3,
            VIEW_H - 3,
            gsap.utils.interpolate(p.oy, y, pull),
          )
          gsap.to(p, {
            y: targetY,
            duration: pullingRef.current ? 0.08 : isCoarse ? 0.14 : 0.2,
            ease: pullingRef.current ? 'power3.out' : 'power2.out',
            overwrite: 'auto',
            onUpdate: setPath,
          })
        })
      }

      // Small horizontal nudge while plucking (capped ~60–100px)
      if (pullingRef.current && hasRadio && !reduceMotion) {
        const svg = wrap.querySelector('svg')
        const vbW = svg?.viewBox?.baseVal?.width || Math.max(wrap.clientWidth, 320)
        const baseX = sampleAlongWire(pts, reduceMotion ? 0.5 : tramT).x
        const baseLeft = (baseX / vbW) * wrap.clientWidth
        const pullLeft = clientX - wrap.getBoundingClientRect().left
        tramNudgeX = gsap.utils.clamp(-tramNudgeMax, tramNudgeMax, pullLeft - baseLeft)
        placeTram()
      }

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
      if (hasRadio && !reduceMotion) {
        const nudgeProxy = { n: tramNudgeX }
        gsap.to(nudgeProxy, {
          n: 0,
          duration: 0.55,
          ease: 'power2.out',
          overwrite: true,
          onUpdate: () => {
            tramNudgeX = nudgeProxy.n
            placeTram()
          },
          onComplete: () => {
            tramNudgeX = 0
            placeTram()
          },
        })
      }
      pointsRef.current.forEach((p, i) => {
        gsap.to(p, {
          y: p.oy,
          duration: springDuration + (i % 4) * (isCoarse ? 0.02 : 0.05),
          ease: springEase,
          overwrite: 'auto',
          onUpdate: setPath,
        })
      })
    }

    const onPointerDown = (e) => {
      // Ignore multi-touch pinch — one finger plucks the wire
      if (e.isPrimary === false) return
      pullingRef.current = true
      pointerIdRef.current = e.pointerId
      pullStartRef.current = { x: e.clientX, y: e.clientY, t: performance.now() }
      wrap.classList.add('spring-wire--pulling')
      // Kill any lingering spring/hum so the grab feels instant
      gsap.killTweensOf(pointsRef.current)
      placeHint(e.clientX)
      if (!invitingRef.current) {
        gsap.to(hint, { opacity: 0.35, duration: 0.12, overwrite: 'auto' })
      }
      wrap.setPointerCapture?.(e.pointerId)
      pullToward(e.clientX, e.clientY, 1)
      if (e.pointerType === 'touch') {
        e.preventDefault()
      }
    }

    const onPointerMove = (e) => {
      if (pullingRef.current && pointerIdRef.current === e.pointerId) {
        placeHint(e.clientX)
        pullToward(e.clientX, e.clientY, 1)
        if (e.pointerType === 'touch') e.preventDefault()
        return
      }
      // Hover: wire follows cursor along the full length (mouse / stylus only)
      if (!pullingRef.current && e.pointerType !== 'touch') {
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

      if (radioRef.current && (moved > pullPlayMinMove || held > pullPlayMinHold)) {
        // Pull toggles: play when off, pause when on
        invitingRef.current = false
        setFound(true)
        wrap.classList.remove('spring-wire--invite')
        wrap.classList.remove('spring-wire--invite-inview')
        markFoundWireRadio()
        track('pull_wire', { action: radioOn ? 'pause' : 'play', input: 'pull' })
        toggleWireRadio(radioRef.current).catch(() => {})
      }
    }

    const onPointerLeave = () => {
      pointerOver = false
      if (pullingRef.current) return
      springHome()
    }

    const onPointerEnter = (e) => {
      pointerOver = true
      if (pullingRef.current) return
      pullToward(e.clientX, e.clientY, HOVER_PULL)
    }

    const onRadioHum = (e) => {
      if (!hasRadio) return
      const on = Boolean(e.detail?.playing)
      window.clearTimeout(humStartTimer)
      tramRiding = on
      if (on) {
        // Let pull-release elastic finish before the bed vibrates
        humStartTimer = window.setTimeout(() => {
          humming = true
        }, 320)
        placeTram()
      } else {
        humming = false
        humPhase = 0
        springHome()
        placeTram()
      }
    }

    layout()
    gsap.ticker.add(tickHum)
    window.addEventListener('wire-radio', onRadioHum)
    if (hasRadio && isWireRadioPlaying() && !reduceMotion) {
      humming = true
      tramRiding = true
    } else if (hasRadio && isWireRadioPlaying()) {
      tramRiding = true
    }
    placeTram()

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

    wrap.addEventListener('pointerdown', onPointerDown, { passive: false })
    wrap.addEventListener('pointermove', onPointerMove, { passive: false })
    wrap.addEventListener('pointerup', onPointerUp)
    wrap.addEventListener('pointercancel', onPointerUp)
    wrap.addEventListener('pointerleave', onPointerLeave)
    wrap.addEventListener('pointerenter', onPointerEnter)

    return () => {
      io?.disconnect()
      ro.disconnect()
      window.clearTimeout(humStartTimer)
      gsap.ticker.remove(tickHum)
      window.removeEventListener('wire-radio', onRadioHum)
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
                track('pull_wire', { action: radioOn ? 'pause' : 'play', input: 'keyboard' })
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
      {hasRadio ? (
        <span ref={tramRef} className="spring-wire__tram" aria-hidden="true">
          <svg
            className="spring-wire__tram-svg"
            viewBox="0 0 64 24"
            width="42"
            height="16"
            fill="none"
          >
            {/* Streetcar roof — sits on the wire */}
            <path
              className="spring-wire__tram-body"
              d="M8 2h48v2.2H8z"
              fill="currentColor"
            />
            {/* Cabin body */}
            <rect
              className="spring-wire__tram-body"
              x="6"
              y="4"
              width="52"
              height="14.5"
              rx="2.2"
              fill="currentColor"
            />
            {/* Windows row */}
            <rect x="10" y="6.2" width="8.5" height="6" rx="0.7" fill="var(--bg)" />
            <rect x="21.5" y="6.2" width="8.5" height="6" rx="0.7" fill="var(--bg)" />
            <rect x="33" y="6.2" width="8.5" height="6" rx="0.7" fill="var(--bg)" />
            <rect x="44.5" y="6.2" width="8.5" height="6" rx="0.7" fill="var(--bg)" />
            {/* Belt line */}
            <path
              d="M10 14h44"
              stroke="var(--bg)"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.4"
            />
            {/* Soft runner along the cable */}
            <path
              d="M12 20h40"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </span>
      ) : null}
      <span ref={hintRef} className="spring-wire__hint" aria-hidden="true">
        {hintCopy}
      </span>
    </div>
  )
}
