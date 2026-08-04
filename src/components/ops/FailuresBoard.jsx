import { useEffect, useId, useRef, useState } from 'react'
import { PROBLEM_FLOWS } from '../../data/laBodegaOpsCase'

/* Board canvas — padded so edge cards never clip */
const BW = 1280
const BH = 1000

/* Larger Excel hub — height matches chrome + 4 data rows (no empty footer pad) */
const EX = { cx: 640, cy: 490, w: 500, h: 284 }
const CARD = { w: 208, h: 188, hw: 104, hh: 94 }
/** Clearance so stroke never enters cards or the Excel sheet */
const GAP = 26

/**
 * Exit point on axis-aligned box boundary, then step outward by GAP
 * along the ray toward the target.
 */
function exitToward(cx, cy, tx, ty, hw, hh, gap = GAP) {
  const dx = tx - cx
  const dy = ty - cy
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const txScale = Math.abs(ux) < 1e-6 ? Infinity : hw / Math.abs(ux)
  const tyScale = Math.abs(uy) < 1e-6 ? Infinity : hh / Math.abs(uy)
  const t = Math.min(txScale, tyScale)
  return [cx + ux * (t + gap), cy + uy * (t + gap)]
}

/** Short quadratic control — slight arc */
function shortCp(fx, fy, tx, ty, bend = 0.12) {
  const mx = (fx + tx) / 2
  const my = (fy + ty) / 2
  const dx = tx - fx
  const dy = ty - fy
  const len = Math.hypot(dx, dy) || 1
  const nx = (-dy / len) * len * bend
  const ny = (dx / len) * len * bend
  return [mx + nx, my + ny]
}

const ICONS = {
  friday: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="1" y="7" width="11" height="8" rx="1" />
      <path d="M12 9h3l3 4v2h-6V9Z" />
      <circle cx="4" cy="16.5" r="1.5" />
      <circle cx="15" cy="16.5" r="1.5" />
    </svg>
  ),
  labor: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.5v5l3.5 2" />
    </svg>
  ),
  purchase: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M1 2.5h3l3 10.5h10" />
      <path d="M4.5 2.5l2 7.5h11L19 5H5" />
      <circle cx="8" cy="16" r="1.5" />
      <circle cx="14" cy="16" r="1.5" />
    </svg>
  ),
  receive: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="2" y="4.5" width="16" height="11" rx="1.5" />
      <path d="M2 4.5l8 7 8-7" />
    </svg>
  ),
  backroom: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="6.5" y="11" width="7" height="7" rx="0.5" />
      <rect x="4" y="5.5" width="12" height="6.5" rx="0.5" />
    </svg>
  ),
  inventory: (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <rect x="2" y="3" width="2" height="12" rx="0.3" opacity="0.85" />
      <rect x="5.5" y="3" width="1.2" height="12" rx="0.3" opacity="0.85" />
      <rect x="8.2" y="3" width="2.5" height="12" rx="0.3" opacity="0.85" />
      <rect x="12.2" y="3" width="1" height="12" rx="0.3" opacity="0.85" />
      <rect x="14.5" y="3" width="2.5" height="12" rx="0.3" opacity="0.85" />
    </svg>
  ),
  kitchen: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M2 10Q10 3 18 10Q10 17 2 10Z" />
      <circle cx="10" cy="10" r="2.5" />
      <line x1="4" y1="4" x2="16" y2="16" strokeWidth="1.8" />
    </svg>
  ),
  spend: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <circle cx="10" cy="10" r="7.5" />
      <line x1="10" y1="4.5" x2="10" y2="15.5" />
    </svg>
  ),
}

/**
 * Orbit seats — ≥56px safe margin from canvas edge (pins + mild float).
 * Edge seats use quieter motion.
 */
const SEATS = [
  { cx: 195, cy: 240, rot: -2, anim: 'float-y', dur: '3.4s', delay: '0s', bend: 0.1, pin: 'var(--cs-accent, #9F1239)', edge: false },
  { cx: 520, cy: 160, rot: 1, anim: 'sway-x', dur: '3.9s', delay: '0.4s', bend: -0.1, pin: 'var(--accent-cool, #3B82F6)', edge: true },
  { cx: 1000, cy: 215, rot: -1.5, anim: 'float-y', dur: '3.6s', delay: '0.8s', bend: 0.1, pin: 'var(--cs-accent, #9F1239)', edge: false },
  { cx: 1135, cy: 490, rot: 2, anim: 'wiggle-r', dur: '4.2s', delay: '0.2s', bend: -0.08, pin: 'var(--accent-cool, #3B82F6)', edge: true },
  { cx: 1000, cy: 770, rot: -2, anim: 'float-y', dur: '3.7s', delay: '1s', bend: 0.1, pin: 'var(--cs-accent, #9F1239)', edge: false },
  { cx: 600, cy: 845, rot: 1.5, anim: 'sway-x', dur: '4s', delay: '0.6s', bend: -0.1, pin: 'var(--ok, #16A34A)', edge: true },
  { cx: 195, cy: 770, rot: -1, anim: 'wiggle-r', dur: '3.5s', delay: '1.2s', bend: 0.1, pin: 'var(--accent-cool, #3B82F6)', edge: false },
  { cx: 145, cy: 490, rot: 2, anim: 'float-y', dur: '3.8s', delay: '0.3s', bend: -0.08, pin: 'var(--cs-accent, #9F1239)', edge: true },
]

function buildLayouts() {
  const exHw = EX.w / 2
  const exHh = EX.h / 2
  return SEATS.map((seat, i) => {
    const arrowFrom = exitToward(seat.cx, seat.cy, EX.cx, EX.cy, CARD.hw, CARD.hh)
    const arrowTo = exitToward(EX.cx, EX.cy, seat.cx, seat.cy, exHw, exHh)
    const cp = shortCp(arrowFrom[0], arrowFrom[1], arrowTo[0], arrowTo[1], seat.bend)
    return {
      ...seat,
      arrowFrom,
      arrowTo,
      cp,
      arrowDelay: 0.25 + i * 0.2,
    }
  })
}

const LAYOUTS = buildLayouts()

function useBoardScale(containerRef) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined
    const update = () => {
      const w = el.clientWidth || BW
      setScale(Math.min(1, w / BW))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [containerRef])
  return scale
}

function nodeState(step) {
  if (step.tone === 'hot') return 'hot'
  if (step.tone === 'out') return 'out'
  return 'default'
}

function ExcelSheet() {
  const left = EX.cx - EX.w / 2
  const top = EX.cy - EX.h / 2
  // Drop Notes — keep Item / Hrs / Cost / Status readable
  const cols = ['Item', 'Hrs', 'Cost', 'Status']
  const cw = [168, 56, 88, 120]
  const rows = [
    { cells: ['Overtime 10/4', '6h', '—', 'Pending'], highlight: false },
    { cells: ['Vendor Fri', '—', '$847', 'Unverif.'], highlight: true },
    { cells: ['Overtime pay', '84h', '$2,100', 'Draft'], highlight: false },
    { cells: ['Invoice #442', '—', '$1,240', 'Unmatched'], highlight: false },
  ]
  const errC = new Set(['Unverif.', 'Unmatched', 'Pending'])
  const warnC = new Set(['Draft'])

  return (
    <div
      className="lbd-fail__excel"
      style={{ left, top, width: EX.w, height: EX.h }}
      aria-hidden="true"
    >
      <div className="lbd-fail__excel-bar">
        <div className="lbd-fail__excel-dots">
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{ backgroundColor: c }} />
          ))}
        </div>
        <span>la_bodega_ops_master.xlsx</span>
      </div>
      <div className="lbd-fail__excel-formula">
        <strong>C3</strong>
        <span className="lbd-fail__excel-sep" />
        <span>=SUM(C2:C5)</span>
        <em>⚠ 4 unverified</em>
      </div>
      <div className="lbd-fail__excel-cols">
        <div className="lbd-fail__excel-rn">#</div>
        {cols.map((col, i) => (
          <div key={col} style={{ width: cw[i] }}>
            {col}
          </div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div
          key={ri}
          className={`lbd-fail__excel-row${row.highlight ? ' is-hot' : ''}${ri % 2 ? ' is-alt' : ''}`}
        >
          <div className="lbd-fail__excel-rn">{ri + 2}</div>
          {row.cells.map((cell, ci) => (
            <div
              key={ci}
              style={{ width: cw[ci] }}
              className={ri === 1 && ci === 2 ? 'is-cell-hot' : undefined}
            >
              <span
                className={
                  errC.has(cell) ? 'is-err' : warnC.has(cell) ? 'is-warn' : undefined
                }
              >
                {cell}
              </span>
            </div>
          ))}
        </div>
      ))}
      <div className="lbd-fail__excel-foot">
        <span>Sheet1</span>
        <span>/ ops_tracking</span>
        <span className="lbd-fail__excel-foot-end">Last edit 11:47 PM</span>
      </div>
    </div>
  )
}

function ClusterCard({ flow, layout, index }) {
  const num = String(index + 1).padStart(2, '0')
  const label = flow.label.replace(/^\d+\s*·\s*/, '')
  const icon = ICONS[flow.id]
  const edgeClass = layout.edge ? ' lbd-fail__card--edge' : ''

  return (
    <div
      className={`lbd-fail__card lbd-fail__card--${layout.anim}${edgeClass}`}
      style={{
        left: layout.cx - CARD.w / 2,
        top: layout.cy - CARD.hh,
        width: CARD.w,
        '--fail-dur': layout.dur,
        '--fail-delay': layout.delay,
        '--fail-pin': layout.pin,
        '--fail-pin-delay': `${layout.arrowDelay}s`,
      }}
    >
      <span className="lbd-fail__pin" />
      <div className="lbd-fail__card-inner" style={{ transform: `rotate(${layout.rot}deg)` }}>
        <div className="lbd-fail__card-kicker">
          <span className="lbd-fail__card-icon">{icon}</span>
          <span>
            <strong>{num}</strong>
            <span aria-hidden="true"> · </span>
            {label}
          </span>
        </div>
        <ul className="lbd-fail__nodes">
          {flow.steps.map((step, i) => {
            const state = nodeState(step)
            return (
              <li key={step.title} className={`lbd-fail__node lbd-fail__node--${state}`}>
                <span className="lbd-fail__node-n">{i + 1}</span>
                <span className="lbd-fail__node-copy">
                  <strong>{step.title}</strong>
                  <em>{step.sub}</em>
                </span>
              </li>
            )
          })}
        </ul>
        <p className="lbd-fail__caption">{flow.caption}</p>
      </div>
    </div>
  )
}

function ArrowsLayer({ uid }) {
  const brush = `${uid}-brush`
  const tip = `${uid}-tip`
  return (
    <svg className="lbd-fail__arrows" width={BW} height={BH} aria-hidden="true">
      <defs>
        <filter id={brush} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <marker id={tip} markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0,6 2.5,0 5" fill="currentColor" opacity="0.8" />
        </marker>
      </defs>
      {LAYOUTS.map((lay, i) => {
        const [fx, fy] = lay.arrowFrom
        const [tx, ty] = lay.arrowTo
        const [cpx, cpy] = lay.cp
        const d = `M${fx.toFixed(1)} ${fy.toFixed(1)} Q${cpx.toFixed(1)} ${cpy.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`
        const len = Math.hypot(tx - fx, ty - fy)
        return (
          <g key={i} style={{ '--fail-draw-delay': `${lay.arrowDelay}s`, '--fail-dash': Math.ceil(len + 24) }}>
            <path className="lbd-fail__stroke-soft" d={d} fill="none" filter={`url(#${brush})`} />
            <path
              className="lbd-fail__stroke"
              d={d}
              fill="none"
              filter={`url(#${brush})`}
              markerEnd={`url(#${tip})`}
            />
          </g>
        )
      })}
    </svg>
  )
}

function DecorLayer({ showNotes }) {
  return (
    <svg className="lbd-fail__decor" width={BW} height={BH} aria-hidden="true">
      <text className="lbd-fail__sor" x={EX.cx} y={EX.cy - EX.h / 2 - 22} textAnchor="middle">
        SOURCE OF RECORD
      </text>
      <path
        className="lbd-fail__sor-line"
        d={`M${EX.cx - 80} ${EX.cy - EX.h / 2 - 14} Q${EX.cx} ${EX.cy - EX.h / 2 - 8} ${EX.cx + 80} ${EX.cy - EX.h / 2 - 14}`}
        fill="none"
      />

      {showNotes
        ? (
            [
              { x: EX.cx - 250, y: EX.cy - 50, text: '3am edits?', rot: -8 },
              { x: EX.cx + 245, y: EX.cy - 60, text: 'whose version', rot: 6 },
              { x: EX.cx + 240, y: EX.cy + 90, text: '↑ needs merge', rot: -4 },
              { x: EX.cx - 245, y: EX.cy + 85, text: 'last tuesday?', rot: 7 },
            ]
          ).map(({ x, y, text, rot }, i) => (
            <text
              key={text}
              className="lbd-fail__note"
              x={x}
              y={y}
              textAnchor="middle"
              transform={`rotate(${rot} ${x} ${y})`}
              style={{ '--fail-note-delay': `${3.2 + i * 0.15}s` }}
            >
              {text}
            </text>
          ))
        : null}

      <g className="lbd-fail__legend" transform={`translate(36, ${BH - 40})`}>
        {[
          { fill: 'var(--white)', stroke: 'var(--line, #E2E5E9)', label: 'Step' },
          {
            fill: 'color-mix(in srgb, var(--cs-accent, #9f1239) 10%, var(--white))',
            stroke: 'color-mix(in srgb, var(--cs-accent, #9f1239) 28%, var(--white))',
            label: 'Choke',
          },
          {
            fill: 'var(--cs-accent, #9f1239)',
            stroke: 'color-mix(in srgb, var(--cs-accent, #9f1239) 72%, var(--ink))',
            label: 'Failure',
          },
        ].map(({ fill, stroke, label }, i) => (
          <g key={label} transform={`translate(${i * 88}, 0)`}>
            <rect width="10" height="10" rx="2" fill={fill} stroke={stroke} strokeWidth="0.8" />
            <text x="15" y="9">
              {label}
            </text>
          </g>
        ))}
        <g transform="translate(280, 0)">
          <line x1="0" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
          <polygon points="16,1.5 22,5 16,8.5" fill="currentColor" opacity="0.7" />
          <text x="28" y="9">
            Pulls to Excel
          </text>
        </g>
      </g>
    </svg>
  )
}

/**
 * Desktop Failures composition — Excel as source-of-record hub,
 * eight failure clusters with short black brush connectors.
 */
export function FailuresBoard({ flows = PROBLEM_FLOWS }) {
  const wrapRef = useRef(null)
  const scale = useBoardScale(wrapRef)
  const uid = useId().replace(/:/g, '')
  const showNotes = scale >= 0.95

  return (
    <div
      className={`lbd-fail${showNotes ? ' lbd-fail--hi' : ''}`}
      ref={wrapRef}
      style={{ height: BH * scale }}
    >
      <div
        className="lbd-fail__stage"
        style={{
          width: BW,
          height: BH,
          transform: `scale(${scale})`,
        }}
      >
        <DecorLayer showNotes={showNotes} />
        <ArrowsLayer uid={uid} />
        <ExcelSheet />
        {flows.slice(0, 8).map((flow, i) => (
          <ClusterCard key={flow.id} flow={flow} layout={LAYOUTS[i]} index={i} />
        ))}
      </div>
    </div>
  )
}

export default FailuresBoard
