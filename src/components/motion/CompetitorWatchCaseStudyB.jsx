import { useEffect, useId, useState } from 'react'
import CwModulesGrid from './CwModulesGrid'
import CwMockFrame from './CwMockFrame'
import { CW_PROOF_CLIPS, clipById } from '../../data/competitorWatchMotion'
import { CW_METRICS, CW_SIGNAL_STATS } from '../../data/cwMetrics'

export const CW_RAIL_STEPS = [
  { id: 'cw-brief', num: '00', label: 'Problem' },
  { id: 'cw-foundation', num: '01', label: 'Foundation' },
  { id: 'cw-screens', num: '02', label: 'Screens' },
  { id: 'cw-impact', num: '03', label: 'Signals' },
  { id: 'cw-close', num: '04', label: 'Contact' },
]

const BEFORE = [
  {
    n: '01',
    title: 'Shelf vs ads',
    body: 'Meat and staples priced from memory and Flipp tabs. No side-by-side with checkout averages.',
    proofId: 'competitive-pricing',
  },
  {
    n: '02',
    title: 'Weekend weather',
    body: 'Rain in the phone weather app. No written push list for hot food, grocery, or grill.',
    proofId: 'weekend-playbook',
  },
  {
    n: '03',
    title: 'Week in CSVs',
    body: 'Odoo exports opened in Excel to see if the week was up. Movers buried in rows.',
    proofId: 'sales-summary',
  },
  {
    n: '04',
    title: 'WhatsApp alone',
    body: 'Blasts went out from CRM. Nobody could say which send showed up at the register.',
    proofId: 'whatsapp-crm',
  },
]

const AFTER = [
  {
    n: '01',
    title: 'Deals + shelf gaps',
    body: `Flipp for ZIP ${CW_METRICS.zip}: ${CW_METRICS.adsIndexed} ads, ${CW_METRICS.merchants} merchants, shelf avg next to ad median.`,
    proofId: 'competitor-deals',
  },
  {
    n: '02',
    title: 'Weekend playbook',
    body: '3-day NWS forecast with category targets (push / ease) for the buy list.',
    proofId: 'weekend-playbook',
  },
  {
    n: '03',
    title: 'Pulse + order list',
    body: `Week KPIs (${CW_METRICS.weekRevenue}, ${CW_METRICS.weekDelta}) and buy / hold / reduce from POS movers.`,
    proofId: 'sales-summary',
  },
  {
    n: '04',
    title: 'WhatsApp → register',
    body: `CRM phone matched to POS within 7 days. ${CW_METRICS.waPosVisits} visits matched in the current snapshot.`,
    proofId: 'whatsapp-crm',
  },
]

const FOUNDATION = [
  {
    title: 'Who',
    body: 'La Bodega, Calhoun GA (ZIP 30701). Owner/ops runs Thursday pricing and the wholesale order against Ingles, Food City, ALDI, Food Lion.',
  },
  {
    title: 'When',
    body: 'Chain circulars and the order cut-off land the same day. Spreadsheet dumps and a second inbox were dropped in week one.',
  },
  {
    title: 'Ship order',
    body: 'Weeks 1–2: deals, weekend playbook, store pulse. Then shelf-vs-ads, order list, RFM, WhatsApp→POS once that path was in use.',
  },
]

const REJECTED = [
  {
    title: 'WhatsApp inbox in CW',
    body: 'Lola already owns guest threads. CW only indexes ads and visit match.',
  },
  {
    title: 'Single “next week = $X”',
    body: 'Overstates the model. The UI ships buy / hold / reduce from POS movers instead.',
  },
]

const CALLS = [
  {
    title: 'Boundary with Lola',
    body: 'CW: ads, pricing, pulse, visit match. Lola: guest WhatsApp and staff Connect.',
  },
  {
    title: 'Meat first in deals',
    body: 'Independents lose weekends on protein. The deals list opens on meat winners.',
  },
  {
    title: 'Register as proof',
    body: `${CW_METRICS.waPosVisits} matched visits in 7 days via CRM phone. Open rate stays a supporting line.`,
  },
]

const LIMITATIONS = [
  'Figures below are from production caches and CRM sync: activity and match rates. No margin or revenue-lift claim.',
  'A match means the same phone hit POS within 7 days of a send. Message copy is not proven as the cause.',
  'Ads come from Flipp for the home ZIP. Render free-tier first load can take about a minute.',
]

function jumpTo(id) {
  window.dispatchEvent(new CustomEvent('cw:focus-feature', { detail: { id } }))
  window.history.replaceState(null, '', `#cw-feature-${id}`)
}

function SignalStats() {
  return (
    <div className="cs-metrics">
      {CW_SIGNAL_STATS.map((m) => (
        <div className="cs-metric" key={m.label}>
          <div className="cs-metric__value">{m.value}</div>
          <div className="cs-metric__label">{m.label}</div>
          {m.note ? <div className="cs-metric__note">{m.note}</div> : null}
        </div>
      ))}
    </div>
  )
}

function BriefToggle() {
  const [tab, setTab] = useState('before')
  const items = tab === 'before' ? BEFORE : AFTER
  const labelId = useId()
  const panelId = useId()
  const beforeTabId = useId()
  const afterTabId = useId()

  return (
    <section className="cs-section cw-cs__brief" id="cw-brief">
      <p className="cs-section__eyebrow">Problem</p>
      <h2>Thursday at La Bodega</h2>
      <p className="cw-cs__lead">
        Owner prices and orders against chain circulars the same day they drop. Before CW: Flipp
        tabs, Excel exports, WhatsApp blasts with no register link.
      </p>

      <div className="cw-brief">
        <div className="cw-brief__tabs" role="tablist" aria-labelledby={labelId}>
          <span id={labelId} className="sr-only">
            Before and after
          </span>
          <button
            type="button"
            id={beforeTabId}
            role="tab"
            aria-selected={tab === 'before'}
            aria-controls={panelId}
            tabIndex={tab === 'before' ? 0 : -1}
            className={`cw-brief__tab${tab === 'before' ? ' cw-brief__tab--active cw-brief__tab--problem' : ''}`}
            onClick={() => setTab('before')}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return
              e.preventDefault()
              const next = e.key === 'ArrowLeft' || e.key === 'Home' ? 'before' : 'after'
              setTab(next)
              document.getElementById(next === 'before' ? beforeTabId : afterTabId)?.focus()
            }}
          >
            Before
          </button>
          <button
            type="button"
            id={afterTabId}
            role="tab"
            aria-selected={tab === 'after'}
            aria-controls={panelId}
            tabIndex={tab === 'after' ? 0 : -1}
            className={`cw-brief__tab${tab === 'after' ? ' cw-brief__tab--active cw-brief__tab--solution' : ''}`}
            onClick={() => setTab('after')}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return
              e.preventDefault()
              const next = e.key === 'ArrowRight' || e.key === 'End' ? 'after' : 'before'
              setTab(next)
              document.getElementById(next === 'before' ? beforeTabId : afterTabId)?.focus()
            }}
          >
            After
          </button>
        </div>

        <div
          className="cw-brief__grid"
          role="tabpanel"
          id={panelId}
          aria-labelledby={tab === 'before' ? beforeTabId : afterTabId}
          tabIndex={0}
        >
          {items.map((item) => (
            <article key={item.n} className={`cw-brief__card cw-brief__card--${tab === 'before' ? 'problem' : 'solution'}`}>
              <span className="cw-brief__n">{item.n}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              {item.proofId && (
                <p>
                  <a
                    className="cw-brief__proof-link"
                    href={`#cw-feature-${item.proofId}`}
                    onClick={(e) => {
                      e.preventDefault()
                      jumpTo(item.proofId)
                    }}
                  >
                    Open screen ↓
                  </a>
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FoundationSection() {
  return (
    <section className="cs-section cw-cs__foundation" id="cw-foundation">
      <p className="cs-section__eyebrow">Foundation</p>
      <h2>Who, when, what shipped first</h2>
      <p className="cw-cs__lead">
        Solo React + Python. Features only after the Thursday path still had a gap.
      </p>

      <div className="cw-foundation-grid">
        {FOUNDATION.map((item) => (
          <article key={item.title} className="cw-foundation-card">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      <div className="cw-cs__decisions-block">
        <h3>Did not build</h3>
        <div className="cw-decisions">
          {REJECTED.map((d) => (
            <article key={d.title}>
              <h4>{d.title}</h4>
              <p>{d.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="cw-cs__decisions-block">
        <h3>Calls</h3>
        <div className="cw-decisions">
          {CALLS.map((d) => (
            <article key={d.title}>
              <h4>{d.title}</h4>
              <p>{d.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const PROOF_LEAD_IDS = ['competitive-pricing', 'competitor-deals', 'whatsapp-crm']
const PROOF_LEAD = PROOF_LEAD_IDS.map(clipById).filter(Boolean)
const PROOF_MORE = CW_PROOF_CLIPS.filter((c) => !PROOF_LEAD_IDS.includes(c.id))

function screenNum(i) {
  return String(i + 1).padStart(2, '0')
}

function ScreensSection() {
  const [expanded, setExpanded] = useState(false)
  const [pendingFocus, setPendingFocus] = useState(null)

  const focusClip = (id) => {
    if (PROOF_MORE.some((c) => c.id === id)) {
      setPendingFocus(id)
      setExpanded(true)
      return
    }
    const el = document.getElementById(`cw-feature-${id}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('cw-feature--flash')
    el.focus({ preventScroll: true })
    window.setTimeout(() => el.classList.remove('cw-feature--flash'), 1200)
  }

  useEffect(() => {
    const onFocusFeature = (e) => {
      const id = e.detail?.id
      if (id) focusClip(id)
    }
    const openIfHash = () => {
      const id = window.location.hash.replace(/^#/, '')
      if (!id.startsWith('cw-feature-')) return
      focusClip(id.replace('cw-feature-', ''))
    }
    window.addEventListener('cw:focus-feature', onFocusFeature)
    window.addEventListener('hashchange', openIfHash)
    openIfHash()
    return () => {
      window.removeEventListener('cw:focus-feature', onFocusFeature)
      window.removeEventListener('hashchange', openIfHash)
    }
  }, [])

  useEffect(() => {
    if (!expanded || !pendingFocus) return undefined
    const id = pendingFocus
    const t = window.setTimeout(() => {
      const el = document.getElementById(`cw-feature-${id}`)
      setPendingFocus(null)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('cw-feature--flash')
      el.focus({ preventScroll: true })
      window.setTimeout(() => el.classList.remove('cw-feature--flash'), 1200)
    }, 50)
    return () => window.clearTimeout(t)
  }, [expanded, pendingFocus])

  // Collapsed: story leads, numbered 01–03. Expanded: all modules in 01–07 order.
  const visible = expanded ? CW_PROOF_CLIPS : PROOF_LEAD

  return (
    <div id="cw-screens" className="cw-cs__screens">
      <section className="cs-section cw-cs__system">
        <p className="cs-section__eyebrow">Screens</p>
        <h2>Live UI with frozen store data</h2>
        <p className="cw-cs__lead">
          Snapshots from La Bodega caches ({CW_METRICS.capturedAt || '2026-07'}). Click a module to
          jump.
        </p>
        <CwModulesGrid />
        {!expanded && PROOF_MORE.length > 0 && (
          <div className="cw-cs__proof-intro-row cw-cs__proof-intro-row--solo">
            <button type="button" className="folio-btn" onClick={() => setExpanded(true)}>
              Show all {CW_PROOF_CLIPS.length} screens
            </button>
          </div>
        )}
      </section>

      <div className="cw-cs__proof-deck" role="list" id="cw-proof">
        {visible.map((clip, i) => (
          <CapabilityProof key={clip.id} clip={clip} index={i} num={screenNum(i)} />
        ))}
      </div>
    </div>
  )
}

function CapabilityProof({ clip, index, num }) {
  const [announced, setAnnounced] = useState('')

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === `#cw-feature-${clip.id}`) {
        setAnnounced(`Showing ${clip.label}`)
      }
    }
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => window.removeEventListener('hashchange', onHash)
  }, [clip.id, clip.label])

  return (
    <section
      className={`cw-cs__deep${index % 2 === 1 ? ' cw-cs__deep--flip' : ''}`}
      id={`cw-feature-${clip.id}`}
      tabIndex={-1}
      role="listitem"
      style={{ '--stack-i': index }}
    >
      <div className="cw-cs__deep-copy">
        <p className="cw-cs__eyebrow">{num}</p>
        <h2>{clip.label}</h2>
        <p className="cw-cs__job cw-cs__job--tight">
          <em>{clip.job}</em>
        </p>
        <p className="cw-cs__signature">
          <strong>{clip.signature}</strong>
          <span>{clip.signatureLabel}</span>
        </p>
        <ul className="cw-chip-row cw-chip-row--proof" aria-label="Details">
          {clip.proof.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {clip.decision && (
          <p className="cw-cs__decision cw-cs__decision--tight">
            <span>Why</span>
            {clip.decision}
          </p>
        )}
      </div>
      <div className="cw-cs__deep-media">
        <CwMockFrame clipId={clip.id} label={clip.caption} size="proof" />
      </div>
      <span className="sr-only" aria-live="polite">
        {announced}
      </span>
    </section>
  )
}

export default function CompetitorWatchCaseStudy() {
  return (
    <div className="cw-cs">
      <div className="cw-cs__body">
        <BriefToggle />
        <FoundationSection />
        <ScreensSection />

        <section className="cs-section cw-cs__signals" id="cw-impact">
          <p className="cs-section__eyebrow">Signals</p>
          <h2>Production counts</h2>
          <p className="cw-cs__lead">
            From the live store and CRM sync. Used on Thursday; separate from finance reports.
          </p>
          <SignalStats />
          <div className="cw-limitations">
            <h3>Method</h3>
            <ul>
              {LIMITATIONS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
