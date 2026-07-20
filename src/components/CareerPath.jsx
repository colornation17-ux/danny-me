import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { track } from '../lib/track'

gsap.registerPlugin(ScrollTrigger)

const PATH_D =
  // Original dramatic column S-curve. Last leg bows into NOW below Bodega.
  'M 200 20 Q 160 110 90 180 Q -40 270 310 360 Q 440 450 90 540 Q -40 630 310 720 Q 440 810 90 900 Q -40 990 310 1080 Q 440 1170 90 1260 Q 40 1335 200 1385'

const STOPS = [
  {
    id: 'civil',
    cx: 90, cy: 180,
    year: '2017 – 2021',
    title: 'B.S. Civil Engineering',
    desc: 'Foundational engineering degree',
    // Outer side — path arrives from the right on left-column stops
    dir: 'left',
    color: '#64748b',
  },
  {
    id: 'sprazzo',
    cx: 310, cy: 360,
    year: 'Nov 2019 – Jun 2021',
    title: 'Motion Designer · Sprazzo',
    desc: 'Kerala, India',
    // Outer side — path arrives from the left on right-column stops
    dir: 'right',
    color: '#4f7cff',
  },
  {
    id: 'digitel',
    cx: 90, cy: 540,
    year: 'Aug 2021 – Aug 2023',
    title: 'UX Designer · Make It Digitel',
    desc: 'Kerala, India',
    dir: 'left',
    color: '#111212',
  },
  {
    id: 'iu-hci',
    cx: 310, cy: 720,
    year: 'Aug 2023 – May 2025',
    title: 'M.S. Human-Computer Interaction',
    desc: 'Indiana University Indianapolis',
    dir: 'right',
    color: '#7c3aed',
    photos: [
      // Inner pocket so outer labels stay clear
      {
        id: 'grad',
        src: '/timeline/graduation.jpg',
        alt: 'Danny at his Indiana University HCI graduation',
        x: 155,
        y: 695,
        rot: -4,
      },
    ],
  },
  {
    id: 'scaling-nature',
    cx: 90, cy: 900,
    year: 'May 2024 – Jun 2024',
    title: 'UX Designer · Scaling Nature',
    desc: 'Finland',
    dir: 'left',
    color: '#0891b2',
  },
  {
    id: 'code19',
    cx: 310, cy: 1080,
    year: 'Sep 2024 – Dec 2025',
    title: 'UX Engineer · Code19 Racing',
    desc: 'Indianapolis, Indiana',
    dir: 'right',
    color: '#EA580C',
    photos: [
      {
        id: 'track',
        src: '/timeline/code19-track.jpg',
        alt: 'CODE19 Racing trackside work',
        x: 145,
        y: 1045,
        rot: 6,
      },
      {
        id: 'poster',
        src: '/timeline/code19-poster.jpg',
        alt: 'CODE19 Racing project poster',
        x: 175,
        y: 1120,
        rot: -7,
      },
    ],
  },
  {
    id: 'bodega',
    cx: 90, cy: 1260,
    year: 'Feb 2026 – Present',
    title: 'Service & Ops UX Lead · La Bodega',
    desc: 'Calhoun, Georgia',
    dir: 'left',
    color: '#166534',
  },
]

const TICK = 26   // connector line length from circle edge
const LABEL_GAP = 8  // gap between tick end and text

/** Classic Instant Polaroid proportions (SVG units, centered on photo point) */
const POLAROID = {
  frameW: 118,
  frameH: 152,
  padX: 7,
  padTop: 7,
  padBottom: 38, // thick Instant foot — must read clearly at thumbnail size
}

function polaroidGeometry() {
  const { frameW, frameH, padX, padTop, padBottom } = POLAROID
  const frame = {
    x: -frameW / 2,
    y: -frameH / 2,
    w: frameW,
    h: frameH,
  }
  const photo = {
    x: frame.x + padX,
    y: frame.y + padTop,
    w: frameW - padX * 2,
    h: frameH - padTop - padBottom,
  }
  return { frame, photo }
}

export default function CareerPath() {
  const svgRef = useRef(null)
  const progressRef = useRef(null)
  const { frame: polaroidFrame, photo: polaroidPhoto } = polaroidGeometry()

  useEffect(() => {
    const svg = svgRef.current
    const progressPath = progressRef.current
    if (!svg || !progressPath) return

    // SVG timeline is desktop-only; mobile uses the HTML list.
    const mq = window.matchMedia('(max-width: 600px)')
    let ctx

    const setup = () => {
      if (ctx) {
        ctx.revert()
        ctx = undefined
      }
      if (mq.matches) return

      ctx = gsap.context(() => {
        const totalLen = progressPath.getTotalLength()

        gsap.set(progressPath, {
          strokeDasharray: totalLen,
          strokeDashoffset: totalLen,
        })

        STOPS.forEach((s) => {
          const circle = svg.querySelector(`#cp-stop-${s.id}`)
          const label = svg.querySelector(`#cp-label-${s.id}`)
          if (circle) gsap.set(circle, { scale: 0, autoAlpha: 0, svgOrigin: `${s.cx} ${s.cy}` })
          if (label) gsap.set(label, { autoAlpha: 0 })
          ;(s.photos || []).forEach((p) => {
            const photo = svg.querySelector(`#cp-photo-${p.id}`)
            if (photo) gsap.set(photo, { scale: 0.85, autoAlpha: 0, svgOrigin: `${p.x} ${p.y}` })
          })
        })

        function fractionOf(cx, cy) {
          const steps = 1000
          let best = 0, min = Infinity
          for (let i = 0; i <= steps; i++) {
            const t = i / steps
            const pt = progressPath.getPointAtLength(t * totalLen)
            const d = Math.hypot(pt.x - cx, pt.y - cy)
            if (d < min) { min = d; best = t }
          }
          return best
        }

        const DUR = 10

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: svg,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.5,
            onUpdate(self) {
              if (self.progress > 0.1) {
                track('career_timeline', { action: 'scroll' }, { once: 'career_timeline_scroll' })
              }
            },
          },
        })

        tl.to(progressPath, { strokeDashoffset: 0, duration: DUR, ease: 'none' })

        const stopTimes = STOPS.map((s) => fractionOf(s.cx, s.cy) * DUR)

        STOPS.forEach((s, i) => {
          const t = stopTimes[i]
          const nextT = stopTimes[i + 1] ?? DUR
          const circle = svg.querySelector(`#cp-stop-${s.id}`)
          const label = svg.querySelector(`#cp-label-${s.id}`)
          if (circle) {
            tl.to(circle, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.5)' }, t)
          }
          if (label) {
            tl.to(label, { autoAlpha: 1, duration: 0.25 }, t + 0.05)
          }

          ;(s.photos || []).forEach((p, pi) => {
            const photo = svg.querySelector(`#cp-photo-${p.id}`)
            if (!photo) return
            const inAt = t + 0.35 + pi * 0.1
            const outAt = Math.max(inAt + 0.4, nextT - 0.4)
            tl.to(photo, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, inAt)
            tl.to(photo, { autoAlpha: 0, scale: 0.9, duration: 0.5, ease: 'power1.in' }, outAt)
          })
        })
      }, svgRef)

      ScrollTrigger.refresh()
    }

    setup()
    mq.addEventListener('change', setup)

    return () => {
      mq.removeEventListener('change', setup)
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <div className="career-path" aria-label="Career journey">
      <p className="career-path__eyebrow">The path so far</p>

      {/* Always in DOM for screen readers; SVG is decorative on desktop */}
      <ol className="career-path__list">
        {STOPS.map((s) => (
          <li key={s.id} className="career-path__item">
            <span
              className="career-path__dot"
              style={{ background: s.color }}
              aria-hidden="true"
            />
            <div className="career-path__copy">
              <span className="career-path__year">{s.year}</span>
              <span className="career-path__title">{s.title}</span>
              <span className="career-path__desc">{s.desc}</span>
              {s.photos?.length ? (
                <div className="career-path__photos">
                  {s.photos.map((p, i) => (
                    <figure
                      key={p.id}
                      className="career-path__polaroid"
                      style={{ '--rot': `${p.rot ?? (i % 2 === 0 ? -4 : 5)}deg` }}
                    >
                      <img
                        src={p.src}
                        alt={p.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        ))}
        <li className="career-path__item career-path__item--now">
          <span className="career-path__dot career-path__dot--now" aria-hidden="true" />
          <div className="career-path__copy">
            <span className="career-path__title">Now</span>
          </div>
        </li>
      </ol>

      <svg
        ref={svgRef}
        viewBox="-140 0 680 1420"
        fill="none"
        aria-hidden="true"
        className="career-path__svg"
      >
        <defs>
          <clipPath id="cp-polaroid-window">
            <rect
              x={polaroidPhoto.x}
              y={polaroidPhoto.y}
              width={polaroidPhoto.w}
              height={polaroidPhoto.h}
              rx="1"
            />
          </clipPath>
          <filter id="cp-polaroid-shadow" x="-50%" y="-40%" width="200%" height="210%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.22" />
            <feDropShadow dx="1" dy="1" stdDeviation="0.6" floodColor="#000" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Start dot */}
        <circle cx="200" cy="20" r="4" fill="#d5dde5" />

        {/* Ghost base path */}
        <path
          d={PATH_D}
          stroke="#d5dde5"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Animated progress path */}
        <path
          ref={progressRef}
          d={PATH_D}
          stroke="#111212"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {STOPS.map((s) => {
          const isRight = s.dir === 'right'
          const tickX1 = isRight ? s.cx + 10 : s.cx - 10
          const tickX2 = isRight ? s.cx + 10 + TICK : s.cx - 10 - TICK
          const textX   = isRight ? tickX2 + LABEL_GAP : tickX2 - LABEL_GAP
          const anchor  = isRight ? 'start' : 'end'

          return (
            <g key={s.id}>
              {/* Circle stop */}
              <circle
                id={`cp-stop-${s.id}`}
                className="cp-stop"
                cx={s.cx}
                cy={s.cy}
                r="9"
                fill={s.color}
                stroke="#fff"
                strokeWidth="2.5"
              />

              {/* Label group — straight tick + text */}
              <g id={`cp-label-${s.id}`} className="cp-label">
                <line
                  x1={tickX1} y1={s.cy}
                  x2={tickX2} y2={s.cy}
                  stroke={s.color}
                  strokeWidth="1.2"
                />
                <text
                  x={textX} y={s.cy - 12}
                  fontSize="12"
                  fontFamily="DM Sans, sans-serif"
                  fontWeight="600"
                  fill="#888"
                  letterSpacing="0.08em"
                  textAnchor={anchor}
                >
                  {s.year}
                </text>
                <text
                  x={textX} y={s.cy + 5}
                  fontSize="15"
                  fontFamily="DM Sans, sans-serif"
                  fontWeight="700"
                  fill="#111212"
                  textAnchor={anchor}
                >
                  {s.title}
                </text>
                <text
                  x={textX} y={s.cy + 20}
                  fontSize="12"
                  fontFamily="DM Sans, sans-serif"
                  fill="#666"
                  textAnchor={anchor}
                >
                  {s.desc}
                </text>
              </g>

              {/* Instant Polaroid frames tied to this stop */}
              {(s.photos || []).map((p) => (
                <g
                  key={p.id}
                  id={`cp-photo-${p.id}`}
                  className="cp-photo cp-polaroid"
                  transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`}
                >
                  <rect
                    x={polaroidFrame.x}
                    y={polaroidFrame.y}
                    width={polaroidFrame.w}
                    height={polaroidFrame.h}
                    rx="2"
                    fill="#fffcf7"
                    stroke="#ddd6cb"
                    strokeWidth="1"
                    filter="url(#cp-polaroid-shadow)"
                  />
                  <rect
                    x={polaroidPhoto.x}
                    y={polaroidPhoto.y}
                    width={polaroidPhoto.w}
                    height={polaroidPhoto.h}
                    fill="#dfe3e8"
                  />
                  <image
                    href={p.src}
                    x={polaroidPhoto.x}
                    y={polaroidPhoto.y}
                    width={polaroidPhoto.w}
                    height={polaroidPhoto.h}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#cp-polaroid-window)"
                  />
                  {/* Emulsion edge */}
                  <rect
                    x={polaroidPhoto.x}
                    y={polaroidPhoto.y}
                    width={polaroidPhoto.w}
                    height={polaroidPhoto.h}
                    fill="none"
                    stroke="rgba(17,18,18,0.08)"
                    strokeWidth="0.75"
                  />
                  {/* Foot accent line — Instant Polaroid cue */}
                  <line
                    x1={polaroidFrame.x + 10}
                    y1={polaroidFrame.y + polaroidFrame.h - 14}
                    x2={polaroidFrame.x + polaroidFrame.w - 10}
                    y2={polaroidFrame.y + polaroidFrame.h - 14}
                    stroke="rgba(17,18,18,0.06)"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </g>
          )
        })}

        {/* End dot */}
        <circle cx="200" cy="1385" r="5" fill="#111212" />
        <text x="200" y="1405" fontSize="11" fontFamily="DM Sans, sans-serif" fill="#888" textAnchor="middle" letterSpacing="0.1em">NOW</text>
      </svg>
    </div>
  )
}
