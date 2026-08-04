/** Line wireframes + flow sketches for La Bodega Ops case study. */

const FLOW_LAYOUT = {
  boxW: 148,
  boxH: 72,
  gap: 34,
  startX: 8,
  y: 36,
}

/** Shared failure / solution strip — same language as the Friday map. */
export function FlowStrip({
  id,
  label,
  caption,
  steps,
  className = '',
  featured = false,
}) {
  const { boxW, boxH, gap, startX, y } = FLOW_LAYOUT
  const width = startX * 2 + steps.length * boxW + (steps.length - 1) * gap
  const midY = y + boxH / 2

  return (
    <figure
      className={`lbd-ops__flow${featured ? ' lbd-ops__flow--featured' : ''} ${className}`.trim()}
      aria-label={caption || label}
    >
      {label ? <p className="lbd-ops__flow-kicker">{label}</p> : null}
      <svg
        viewBox={`0 0 ${width} 148`}
        role="img"
        className="lbd-ops__flow-svg"
      >
        <title>{caption || label}</title>
        {steps.map((step, i) => {
          const x = startX + i * (boxW + gap)
          const tone = step.tone ? ` lbd-ops__flow-node--${step.tone}` : ''
          return (
            <g key={`${id}-${i}`} className={`lbd-ops__flow-node${tone}`}>
              <rect x={x} y={y} width={boxW} height={boxH} rx="10" />
              <text x={x + boxW / 2} y={y + 32} textAnchor="middle">
                {step.title}
              </text>
              <text
                x={x + boxW / 2}
                y={y + 52}
                textAnchor="middle"
                className="lbd-ops__flow-sub"
              >
                {step.sub}
              </text>
            </g>
          )
        })}
        {steps.slice(0, -1).map((_, i) => {
          const from = startX + (i + 1) * boxW + i * gap + 4
          const tipX = from + gap - 6
          const tipY = midY
          // Sketch curve (same as before) + explicit › head — markers were spinning into “boats”
          return (
            <g key={`${id}-arr-${i}`} className="lbd-ops__flow-arrow" aria-hidden="true">
              <path d={`M${from} ${midY}c${gap * 0.28} -5 ${gap * 0.52} 5 ${gap - 14} 0`} />
              <path d={`M${tipX - 8} ${tipY - 5}l8 5-8 5`} />
            </g>
          )
        })}
      </svg>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

/** @deprecated prefer FlowStrip + PROBLEM_FLOWS — kept for SolutionFlow sibling */
export function SceneFlow({ className = '' }) {
  return (
    <FlowStrip
      id="friday-legacy"
      className={className}
      caption="One Friday scene — not the whole problem set."
      steps={[
        { title: 'Truck at door', sub: 'WhatsApp pics' },
        { title: 'Overtime text mid-rush', sub: 'Call the owner' },
        { title: 'Owner in Excel', sub: 'Hourly reconcile', tone: 'hot' },
        { title: 'Shift stalls', sub: 'No decision path', tone: 'out' },
      ]}
    />
  )
}

/** 1 featured + highlight strips + optional disclosure for the rest */
export function ProblemFlowMap({
  lead,
  highlights = [],
  more = [],
  moreOpen = false,
  onToggleMore,
}) {
  if (!lead) return null
  return (
    <div className="lbd-ops__flow-map">
      <FlowStrip
        id={lead.id}
        label={lead.label}
        caption={lead.caption}
        steps={lead.steps}
        featured
      />
      <div className="lbd-ops__flow-grid">
        {highlights.map((flow) => (
          <FlowStrip
            key={flow.id}
            id={flow.id}
            label={flow.label}
            caption={flow.caption}
            steps={flow.steps}
          />
        ))}
      </div>
      {more.length ? (
        <div className="lbd-ops__flow-more">
          <button
            type="button"
            className="lbd-ops__more-btn"
            onClick={onToggleMore}
            aria-expanded={moreOpen}
          >
            {moreOpen ? 'Hide more failures' : `+ ${more.length} more failures`}
          </button>
          {moreOpen ? (
            <div className="lbd-ops__flow-grid">
              {more.map((flow) => (
                <FlowStrip
                  key={flow.id}
                  id={flow.id}
                  label={flow.label}
                  caption={flow.caption}
                  steps={flow.steps}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export function SolutionFlow({ className = '' }) {
  return (
    <FlowStrip
      id="solution-loops"
      className={className}
      caption="Live product order: Purchasing, then budgets, then Today / Store Pulse."
      steps={[
        { title: 'OPS', sub: 'Purchasing', tone: 'ok' },
        { title: 'CONTROL', sub: 'Budgets', tone: 'ok' },
        { title: 'TIME', sub: 'Store Pulse', tone: 'ok' },
      ]}
    />
  )
}

/** A/B labeled wireframes — explored left, shipped right */
export function WireAb({
  title,
  hypothesis,
  aLabel = 'Explored',
  bLabel = 'Shipped',
  aItems,
  bItems,
}) {
  return (
    <figure className="lbd-ops__ab">
      <figcaption className="lbd-ops__ab-cap">
        <span className="lbd-ops__ab-h">{hypothesis}</span>
        {title}
      </figcaption>
      <div className="lbd-ops__ab-grid">
        <WirePhone label={aLabel} tone="a" items={aItems} />
        <div className="lbd-ops__ab-arrow" aria-hidden="true">
          <SketchArrow />
        </div>
        <WirePhone label={bLabel} tone="b" items={bItems} />
      </div>
    </figure>
  )
}

function SketchArrow() {
  return (
    <svg viewBox="0 0 48 24" className="lbd-ops__sketch-arrow" aria-hidden="true">
      <path
        d="M4 12c12-6 22 6 36 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M34 6l10 6-10 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WirePhone({ label, tone, items }) {
  return (
    <div className={`lbd-ops__wire lbd-ops__wire--${tone}`}>
      <p className="lbd-ops__wire-label">{label}</p>
      <div className="lbd-ops__wire-frame">
        <span className="lbd-ops__wire-notch" aria-hidden="true" />
        <ul className="lbd-ops__wire-ui">
          {items.map((item, i) => (
            <li
              key={`${label}-${i}-${item.text}`}
              className={`lbd-ops__wire-item lbd-ops__wire-item--${item.kind || 'row'}`}
            >
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const WIRE_ROLE_HOME = {
  title: 'Role home beats a flat dump',
  hypothesis: 'H4',
  aItems: [
    { kind: 'title', text: 'All features' },
    { kind: 'menu', text: 'Clock' },
    { kind: 'menu', text: 'Tasks' },
    { kind: 'menu', text: 'Approvals' },
    { kind: 'menu', text: 'Vendors' },
    { kind: 'menu', text: 'Budgets' },
    { kind: 'menu', text: 'Payroll' },
    { kind: 'menu', text: 'Audit…' },
    { kind: 'note', text: 'Same menu for every role' },
  ],
  bItems: [
    { kind: 'title', text: 'Staff home' },
    { kind: 'pill', text: 'On shift' },
    { kind: 'card', text: 'Today 9:00–5:00' },
    { kind: 'btn', text: 'Start break' },
    { kind: 'btn', text: 'Clock out' },
    { kind: 'row', text: 'Tasks · 3' },
    { kind: 'tab', text: 'Home · Tasks · Schedule' },
  ],
}

export const WIRE_CLOCK = {
  title: 'Verified punch beats honor sheet',
  hypothesis: 'H1',
  aItems: [
    { kind: 'title', text: 'Clock-in sheet' },
    { kind: 'row', text: 'Maria ——— 8:15' },
    { kind: 'row', text: 'James ——— 8:02' },
    { kind: 'row', text: 'Grace ——— ____' },
    { kind: 'row', text: '…' },
    { kind: 'note', text: 'No schedule · no payroll link' },
  ],
  bItems: [
    { kind: 'title', text: 'Grace' },
    { kind: 'pill', text: 'Working' },
    { kind: 'card', text: 'Scan + geofence punch' },
    { kind: 'btn', text: 'Start break' },
    { kind: 'btn', text: 'Clock out' },
    { kind: 'row', text: 'Hours → payroll export' },
  ],
}

export const WIRE_APPROVE = {
  title: 'Manager decide beats owner ping',
  hypothesis: 'H2',
  aItems: [
    { kind: 'title', text: 'WhatsApp' },
    { kind: 'bubble', text: 'Can Maria stay 2 extra hrs?' },
    { kind: 'bubble', text: 'Ask the owner' },
    { kind: 'note', text: 'Rush · no decision on floor' },
  ],
  bItems: [
    { kind: 'title', text: 'Approvals' },
    { kind: 'pill', text: '2 waiting' },
    { kind: 'card', text: 'Extra hours · Grace' },
    { kind: 'btn', text: 'Approve' },
    { kind: 'btn', text: 'Deny' },
    { kind: 'row', text: 'Owner sees escalations only' },
  ],
}

export const WIRE_WALK = {
  title: 'Walk with vendor beats shelf guess',
  hypothesis: 'H5',
  aItems: [
    { kind: 'title', text: 'Vendor pad' },
    { kind: 'row', text: 'Looks empty → order 6' },
    { kind: 'row', text: 'No last price' },
    { kind: 'row', text: 'No budget left' },
    { kind: 'note', text: 'Demand = empty shelf' },
  ],
  bItems: [
    { kind: 'title', text: 'Walk · scan' },
    { kind: 'pill', text: 'Budget OK' },
    { kind: 'card', text: 'Last $2.10 · Low $1.95' },
    { kind: 'row', text: 'Suggest 4 · velocity ~12/wk' },
    { kind: 'btn', text: 'Place 4' },
    { kind: 'btn', text: 'Hold' },
  ],
}

export const WIRE_DOOR = {
  title: 'Door trail beats WhatsApp photos',
  hypothesis: 'H3',
  aItems: [
    { kind: 'title', text: 'WhatsApp' },
    { kind: 'bubble', text: 'Invoice pic × 4' },
    { kind: 'row', text: 'Paste into Excel later' },
    { kind: 'note', text: 'Cost drifts · no PO link' },
  ],
  bItems: [
    { kind: 'title', text: 'DSD check-in' },
    { kind: 'pill', text: 'OCR + voice' },
    { kind: 'card', text: 'Lines → Got / price' },
    { kind: 'btn', text: 'Confirm receive' },
    { kind: 'row', text: 'Writes the cost trail' },
  ],
}

export const WIRE_INVENTORY = {
  title: 'Phone count beats POS scanner cost',
  hypothesis: 'H6',
  aItems: [
    { kind: 'title', text: 'Inventory tax' },
    { kind: 'row', text: 'POS add-on $' },
    { kind: 'row', text: 'Or buy Zebras' },
    { kind: 'note', text: 'Count skipped · blind on hand' },
  ],
  bItems: [
    { kind: 'title', text: 'Cycle count' },
    { kind: 'pill', text: '<100ms identify' },
    { kind: 'card', text: 'Camera → aisle / bay' },
    { kind: 'btn', text: 'Confirm qty' },
    { kind: 'row', text: 'No laser fleet' },
  ],
}

export const WIRE_KITCHEN = {
  title: 'Prep log beats cooler blind',
  hypothesis: 'H7',
  aItems: [
    { kind: 'title', text: 'Cooler' },
    { kind: 'row', text: 'Prep on shelf' },
    { kind: 'row', text: 'Tribal memory' },
    { kind: 'note', text: 'Admin / manager blind' },
  ],
  bItems: [
    { kind: 'title', text: 'Kitchen prep' },
    { kind: 'pill', text: 'Logged' },
    { kind: 'card', text: 'Item · prep · expiry' },
    { kind: 'btn', text: 'Add batch' },
    { kind: 'row', text: 'Waste risk visible' },
  ],
}

export const WIRE_BUDGET = {
  title: 'Live dept caps beat Excel after the buy',
  hypothesis: 'H8',
  aItems: [
    { kind: 'title', text: 'Excel budgets' },
    { kind: 'row', text: 'Grocery tab · Meat tab' },
    { kind: 'row', text: 'Checked after the PO' },
    { kind: 'note', text: 'No floor hold · no P&L link' },
  ],
  bItems: [
    { kind: 'title', text: 'Dept budgets' },
    { kind: 'pill', text: 'Weekly caps' },
    { kind: 'card', text: 'DMF · sales → P&L share' },
    { kind: 'row', text: 'Grocery · Meat · live %' },
    { kind: 'btn', text: 'Save cap' },
    { kind: 'row', text: 'Hold when over' },
  ],
}

export function PhoneShot({ src, alt, caption, className = '', loading = 'lazy' }) {
  return (
    <figure className={`lbd-ops__phone ${className}`.trim()}>
      <div className="lbd-ops__phone-device">
        <div className="lbd-ops__phone-screen">
          <img src={src} alt={alt} loading={loading} decoding="async" />
        </div>
        <img
          className="lbd-ops__phone-bezel"
          src="/work/la-bodega-ops/device-frame.png"
          alt=""
          aria-hidden="true"
          loading={loading}
          decoding="async"
          draggable={false}
        />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

/** Affinity diagram — dotted field, clustered stickies, synth bet */
export function ResearchBoard({ board }) {
  if (!board?.clusters?.length) return null

  return (
    <figure className="lbd-ops__board" aria-label={board.title}>
      <div className="lbd-ops__board-canvas">
        <p className="lbd-ops__board-title">{board.title}</p>

        <div className="lbd-ops__affinity">
          {board.clusters.map((cluster, i) => (
            <section
              key={cluster.id}
              className="lbd-ops__cluster"
              aria-labelledby={`aff-${cluster.id}`}
            >
              <header className="lbd-ops__cluster-head">
                <span className="lbd-ops__cluster-badge" id={`aff-${cluster.id}`}>
                  Group {i + 1} · {cluster.label}
                </span>
                {cluster.thesis ? <p className="lbd-ops__cluster-thesis">{cluster.thesis}</p> : null}
              </header>
              <ul className="lbd-ops__stickies">
                {cluster.stickies.map((s) => (
                  <li
                    key={s.id}
                    className={`lbd-ops__sticky lbd-ops__sticky--${s.tone}`}
                    style={{ '--sticky-rot': `${s.rot}deg` }}
                  >
                    <span className="lbd-ops__sticky-tape" aria-hidden="true" />
                    <span className="lbd-ops__sticky-tag">{s.tag}</span>
                    <strong>{s.label}</strong>
                    <p>{s.body}</p>
                    <span className="lbd-ops__sticky-curl" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {board.bet ? (
          <div className="lbd-ops__affinity-bet">
            <span className="lbd-ops__cluster-badge lbd-ops__cluster-badge--bet">Synth → bet</span>
            <div
              className={`lbd-ops__sticky lbd-ops__sticky--${board.bet.tone} lbd-ops__sticky--bet`}
              style={{ '--sticky-rot': `${board.bet.rot}deg` }}
            >
              <span className="lbd-ops__sticky-tape" aria-hidden="true" />
              <span className="lbd-ops__sticky-tag">{board.bet.tag}</span>
              <strong>{board.bet.label}</strong>
              <p>{board.bet.body}</p>
              <span className="lbd-ops__sticky-curl" aria-hidden="true" />
            </div>
          </div>
        ) : null}
      </div>
      {board.caption ? <figcaption>{board.caption}</figcaption> : null}
    </figure>
  )
}
