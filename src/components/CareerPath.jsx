import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PATH_D =
  'M 200 20 Q 300 100 90 180 Q -40 270 310 360 Q 440 450 90 540 Q -40 630 310 720 Q 440 810 90 900 Q -40 990 310 1080 Q 440 1170 90 1260 Q 150 1330 200 1290'

const STOPS = [
  {
    id: 'civil',
    cx: 90, cy: 180,
    year: '2017 – 2021',
    title: 'B.S. Civil Engineering',
    desc: 'Foundational engineering degree',
    dir: 'right',
    color: '#64748b',
  },
  {
    id: 'sprazzo',
    cx: 310, cy: 360,
    year: 'Nov 2019 – Jun 2021',
    title: 'Motion Designer — Sprazzo',
    desc: 'Kerala, India',
    dir: 'left',
    color: '#4f7cff',
  },
  {
    id: 'digitel',
    cx: 90, cy: 540,
    year: 'Aug 2021 – Aug 2023',
    title: 'UX Designer — Make It Digitel',
    desc: 'Kerala, India',
    dir: 'right',
    color: '#111212',
  },
  {
    id: 'iu-hci',
    cx: 310, cy: 720,
    year: 'Aug 2023 – May 2025',
    title: 'M.S. Human-Computer Interaction',
    desc: 'Indiana University Indianapolis',
    dir: 'left',
    color: '#7c3aed',
  },
  {
    id: 'scaling-nature',
    cx: 90, cy: 900,
    year: 'May 2024 – Jun 2024',
    title: 'UX Designer — Scaling Nature',
    desc: 'Finland',
    dir: 'right',
    color: '#0891b2',
  },
  {
    id: 'code19',
    cx: 310, cy: 1080,
    year: 'Sep 2024 – Dec 2025',
    title: 'UX Engineer — Code19 Racing',
    desc: 'Indianapolis, Indiana',
    dir: 'left',
    color: '#EA580C',
  },
  {
    id: 'bodega',
    cx: 90, cy: 1260,
    year: 'Feb 2026 – Present',
    title: 'Service & Ops UX Lead — La Bodega',
    desc: 'Calhoun, Georgia',
    dir: 'right',
    color: '#166534',
  },
]

const TICK = 26   // connector line length from circle edge
const LABEL_GAP = 8  // gap between tick end and text

export default function CareerPath() {
  const svgRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    const progressPath = progressRef.current
    if (!svg || !progressPath) return

    const ctx = gsap.context(() => {
      const totalLen = progressPath.getTotalLength()

      // Set up draw-on: start fully hidden
      gsap.set(progressPath, {
        strokeDasharray: totalLen,
        strokeDashoffset: totalLen,
      })

      // Hide all stops and labels, set scale origin per circle
      STOPS.forEach((s) => {
        const circle = svg.querySelector(`#cp-stop-${s.id}`)
        const label = svg.querySelector(`#cp-label-${s.id}`)
        if (circle) gsap.set(circle, { scale: 0, autoAlpha: 0, svgOrigin: `${s.cx} ${s.cy}` })
        if (label) gsap.set(label, { autoAlpha: 0 })
      })

      // Find where each stop sits along the path (fraction 0–1)
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

      const DUR = 10  // timeline duration units (maps to full scroll range)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svg,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.5,
        },
      })

      // Main path draw
      tl.to(progressPath, { strokeDashoffset: 0, duration: DUR, ease: 'none' })

      // Pop each stop at the moment the path reaches it
      STOPS.forEach((s) => {
        const frac = fractionOf(s.cx, s.cy)
        const t = frac * DUR
        const circle = svg.querySelector(`#cp-stop-${s.id}`)
        const label = svg.querySelector(`#cp-label-${s.id}`)
        if (circle) {
          tl.to(circle, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.5)' }, t)
        }
        if (label) {
          tl.to(label, { autoAlpha: 1, duration: 0.35 }, t + 0.3)
        }
      })
    }, svgRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="career-path" aria-label="Career journey">
      <p className="career-path__eyebrow">The path so far</p>
      <svg
        ref={svgRef}
        viewBox="0 0 400 1340"
        fill="none"
        aria-hidden="true"
        className="career-path__svg"
      >
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

              {/* Label group (tick + text) */}
              <g id={`cp-label-${s.id}`} className="cp-label">
                <line
                  x1={tickX1} y1={s.cy}
                  x2={tickX2} y2={s.cy}
                  stroke={s.color}
                  strokeWidth="1.2"
                />
                <text
                  x={textX} y={s.cy - 10}
                  fontSize="8.5"
                  fontFamily="DM Mono, monospace"
                  fontWeight="600"
                  fill="#888"
                  letterSpacing="0.08em"
                  textAnchor={anchor}
                >
                  {s.year}
                </text>
                <text
                  x={textX} y={s.cy + 4}
                  fontSize="11.5"
                  fontFamily="DM Mono, monospace"
                  fontWeight="700"
                  fill="#111212"
                  textAnchor={anchor}
                >
                  {s.title}
                </text>
                <text
                  x={textX} y={s.cy + 17}
                  fontSize="8.5"
                  fontFamily="DM Mono, monospace"
                  fill="#666"
                  textAnchor={anchor}
                >
                  {s.desc}
                </text>
              </g>
            </g>
          )
        })}

        {/* End dot */}
        <circle cx="200" cy="1290" r="5" fill="#111212" />
        <text x="200" y="1308" fontSize="8" fontFamily="DM Mono, monospace" fill="#888" textAnchor="middle" letterSpacing="0.1em">NOW</text>
      </svg>
    </div>
  )
}
