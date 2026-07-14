import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PATH_D =
  'M 200 20 Q 300 110 90 210 Q -40 320 310 440 Q 440 550 90 660 Q -40 770 310 870 Q 370 940 200 900'

const STOPS = [
  {
    id: 'iu',
    cx: 90, cy: 210,
    year: '2020 – 2023',
    title: 'IU Human Computer Interaction',
    desc: 'HCI research methods & foundations',
    dir: 'right',
    color: '#4f7cff',
  },
  {
    id: 'code19',
    cx: 310, cy: 440,
    year: '2023 – 2024',
    title: 'CODE19 Racing',
    desc: 'Web, brand & AI-driven fan experience',
    dir: 'left',
    color: '#111212',
  },
  {
    id: 'wing',
    cx: 90, cy: 660,
    year: '2024 – 2025',
    title: 'Wing Automotive HMI',
    desc: 'Mission-control HMI for smart vehicles',
    dir: 'right',
    color: '#EA580C',
  },
  {
    id: 'bodega',
    cx: 310, cy: 870,
    year: '2025 – Present',
    title: 'La Bodega AI',
    desc: 'Shipping AI for 1,200+ families',
    dir: 'left',
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
        viewBox="0 0 400 920"
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
        <circle cx="200" cy="900" r="5" fill="#111212" />
        <text x="200" y="918" fontSize="8" fontFamily="DM Mono, monospace" fill="#888" textAnchor="middle" letterSpacing="0.1em">NOW</text>
      </svg>
    </div>
  )
}
