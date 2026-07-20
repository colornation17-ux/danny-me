import { useEffect, useId, useState } from 'react'
import CwModulesGrid from './CwModulesGrid'
import CwVideoFrame from './CwVideoFrame'
import { CW_PROOF_CLIPS } from '../../data/competitorWatchMotion'
export const CW_RAIL_STEPS = [
  { id: 'cw-brief', num: '00', label: 'Problem' },
  { id: 'cw-foundation', num: '01', label: 'Foundation' },
  { id: 'cw-product', num: '02', label: 'Product' },
  { id: 'cw-proof', num: '03', label: 'Proof' },
  { id: 'cw-impact', num: '04', label: 'Impact' },
  { id: 'cw-close', num: '05', label: 'Contact' },
]

const BRIEF_PROBLEM = [
  {
    n: '01',
    title: 'Blind vs the chains',
    body: 'Thursday ads rewrite the weekend. Without shelf-vs-market pricing and a live competitor view, the owner prices and features meat by gut, while mainstream and Latino chains set the floor — and the store finds out on Saturday.',
    user: 'Know in one glance if shelf prices sit above or below the live ad floor, before the window closes.',
    business: "Turn Thursday's chain ads into same-day shelf-vs-floor pricing calls, not gut instinct.",
    proofId: 'competitive-pricing',
  },
  {
    n: '02',
    title: 'Weather without a playbook',
    body: 'Rain and heat move caldo, hot food, and grill demand. Forecasts existed; nothing turned them into push/skip category calls before the order window.',
    user: 'Get a plain push-or-skip call for the weekend, not another weather chart to interpret.',
    business: 'Convert rain/heat forecasts into category actions the floor can execute same-day.',
  },
  {
    n: '03',
    title: 'Pulse stuck in exports',
    body: "Sales lived in CSVs and back-office reports. No single screen answered: is this week good, and what should we feature next?",
    user: 'See if this week was actually good without pulling a CSV.',
    business: 'Make the weekly pulse a 10-second habit instead of a report-pull chore.',
  },
  {
    n: '04',
    title: 'Outreach without proof',
    body: 'Loyalty and WhatsApp could already reach shoppers (Lola + campaigns). The gap was proving which messages drove a register visit, not building CRM from scratch.',
    user: 'Know which WhatsApp message actually got someone back in the store.',
    business: 'Prove outreach as POS visits, not send/read counts: justify the continued spend.',
  },
]

const BRIEF_SOLUTION = [
  {
    n: '01',
    title: 'Deals + shelf-vs-floor pricing',
    body: 'Live Flipp across ZIP markets (winners, combo packs, national rank) plus competitive pricing: checkout averages vs the live ad floor.',
  },
  {
    n: '02',
    title: 'Weather → weekend actions',
    body: '3-day forecast mapped to plain-language category targets: push, ease off, or hold.',
  },
  {
    n: '03',
    title: 'Pulse, trends, and demand in one loop',
    body: 'Store pulse and market-trends (Latino vs mainstream national pulse) beside 7-day buy/hold/reduce bands — decision support, not another report dump.',
  },
  {
    n: '04',
    title: 'Attribution on the channel they run',
    body: 'Labeled RFM tiers, visit-rhythm nudges, WhatsApp outreach, then POS visits in seven days — close the loop with loyalty/Lola.',
  },
]

const DECISIONS = [
  {
    title: 'Intelligence, not another inbox',
    body: 'Engagement already lived in loyalty and Lola. Competitor Watch owns the Thursday planning call (competitors, weather, forecast), then proves outreach with visits.',
  },
  {
    title: 'Forecasts as ranges',
    body: 'Operators ignored single numbers; bands and buy/hold/reduce lists got used.',
  },
  {
    title: 'Attribution over send counts',
    body: 'WhatsApp is the channel the store already runs. Proof is CRM phone → POS visit within seven days (2,088 matched visits) — not vanity send counts.',
  },
]

const IMPACT = [
  { value: '2,088', label: 'POS visits matched in 7 days' },
  { value: '65.9%', label: 'WhatsApp read rate' },
  { value: '277', label: 'Shoppers due to return' },
  { value: '144', label: 'Live ads indexed' },
]

const LOOP_STEPS = [
  { n: '01', label: 'See the floor', detail: 'Deals + shelf-vs-ad pricing' },
  { n: '02', label: 'Call the weekend', detail: 'Playbook + demand bands' },
  { n: '03', label: 'Reach & prove', detail: 'WhatsApp → POS visit' },
]

function ImpactStats({ compact = false }) {
  return (
    <div className={`cs-metrics${compact ? ' cs-metrics--hook' : ''}`}>
      {IMPACT.map((m) => (
        <div className="cs-metric" key={m.label}>
          <div className="cs-metric__value">{m.value}</div>
          <div className="cs-metric__label">{m.label}</div>
        </div>
      ))}
    </div>
  )
}

function ProofList({ proof }) {
  return (
    <ul className="cw-cs__proof">
      {proof.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function BriefToggle() {
  const [tab, setTab] = useState('problem')
  const items = tab === 'problem' ? BRIEF_PROBLEM : BRIEF_SOLUTION
  const labelId = useId()
  const panelId = useId()
  const problemTabId = useId()
  const solutionTabId = useId()

  return (
    <section className="cs-section cw-cs__brief" id="cw-brief">
      <p className="cs-section__eyebrow">Problem → solution</p>
      <h2>One Thursday decision loop — not a dashboard pile</h2>
      <p>
        La Bodega already had loyalty and WhatsApp reach. What it lacked was an intelligence layer
        for the twelve minutes between chain ad drop and the order call: live competitor prices,
        weather-tied weekend actions, and demand signal in one place. Competitor Watch is that
        decision loop; attribution closes it with the engagement layer already in market.
      </p>

      <ol className="cw-loop" aria-label="Thursday decision loop">
        {LOOP_STEPS.map((s) => (
          <li key={s.n} className="cw-loop__step">
            <span className="cw-loop__n">{s.n}</span>
            <span className="cw-loop__label">{s.label}</span>
            <span className="cw-loop__detail">{s.detail}</span>
          </li>
        ))}
      </ol>

      <ImpactStats compact />

      <div className="cw-brief">
        <div className="cw-brief__tabs" role="tablist" aria-labelledby={labelId}>
          <span id={labelId} className="sr-only">
            Problem and solution
          </span>
          <button
            type="button"
            id={problemTabId}
            role="tab"
            aria-selected={tab === 'problem'}
            aria-controls={panelId}
            className={`cw-brief__tab${tab === 'problem' ? ' cw-brief__tab--active cw-brief__tab--problem' : ''}`}
            onClick={() => setTab('problem')}
          >
            The problem
          </button>
          <button
            type="button"
            id={solutionTabId}
            role="tab"
            aria-selected={tab === 'solution'}
            aria-controls={panelId}
            className={`cw-brief__tab${tab === 'solution' ? ' cw-brief__tab--active cw-brief__tab--solution' : ''}`}
            onClick={() => setTab('solution')}
          >
            The solution
          </button>
        </div>

        <div
          className="cw-brief__grid"
          role="tabpanel"
          id={panelId}
          aria-labelledby={tab === 'problem' ? problemTabId : solutionTabId}
          tabIndex={0}
        >
          {items.map((item) => (
            <article key={item.n} className={`cw-brief__card cw-brief__card--${tab}`}>
              <span className="cw-brief__n">{item.n}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              {tab === 'problem' && (
                <div className="cw-brief__goals">
                  <p>
                    <span className="cw-goals__tag cw-goals__tag--user">User</span>
                    {item.user}
                  </p>
                  <p>
                    <span className="cw-goals__tag cw-goals__tag--business">Business</span>
                    {item.business}
                  </p>
                  {item.proofId && (
                    <p>
                      <a
                        className="cw-brief__proof-link"
                        href={`#cw-feature-${item.proofId}`}
                        onClick={(e) => {
                          e.preventDefault()
                          const el = document.getElementById(`cw-feature-${item.proofId}`)
                          if (!el) return
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          el.classList.add('cw-feature--flash')
                          window.history.replaceState(null, '', `#cw-feature-${item.proofId}`)
                          el.focus({ preventScroll: true })
                          window.setTimeout(() => el.classList.remove('cw-feature--flash'), 1200)
                        }}
                      >
                        See competitive pricing proof ↓
                      </a>
                    </p>
                  )}
                </div>
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
    <section className="cs-section cw-cs__story" id="cw-foundation">
      <p className="cs-section__eyebrow">Foundation</p>
      <h2>MVP in ~2 weeks · ongoing production</h2>
      <p>
        I started with the Thursday window (the twelve minutes between the chains&apos; ad drop and
        La Bodega&apos;s order call) and mapped every question the owner needed answered inside it:
        what are they advertising, how do our shelves compare, what should we push, will we sell it,
        who&apos;s slipping, did the outreach land. That became the IA: five primary tabs (Dashboard,
        Weekend playbook, Competitor deals, Your store data, Market trends) plus nested owner tools
        and store chat — a larger surface than a two-week MVP alone.
      </p>
      <p>
        Solo design &amp; build, React frontend + Python backend (StatsForecast ensemble). MVP reached
        production in about two weeks; the full system kept growing in production after that. The hard
        calls weren&apos;t visual; they were legibility: making avg-vs-floor pricing readable in
        seconds, keeping the guest view honest without gating the owner&apos;s real numbers, and
        drawing a hard line between engagement (already owned by loyalty/Lola) and decision support
        (this product) so Competitor Watch never turned into a second CRM.
      </p>
      <p>
        Designed for the model&apos;s real output shape (buy / hold / reduce plus bands, not a
        fake-precise single number). The demand-forecast model was briefly offline before launch;
        the UI stayed ready, and forecasting is live again in production today.
      </p>

      <div className="cw-cs__decisions-block">
        <h3>Three product calls that shaped the system</h3>
        <div className="cw-decisions">
          {DECISIONS.map((d) => (
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

function CapabilityProof({ clip, index }) {
  const [announced, setAnnounced] = useState('')

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === `#cw-feature-${clip.id}`) {
        setAnnounced(`Showing proof for ${clip.label}`)
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
    >
      <div className="cw-cs__deep-copy">
        <p className="cw-cs__eyebrow">Proof · {clip.n}</p>
        <h2>{clip.label}</h2>
        <p className="cw-cs__job">
          <em>{clip.job}</em>: {clip.problem}
        </p>
        <p className="cw-cs__signature">
          <strong>{clip.signature}</strong>
          <span>{clip.signatureLabel}</span>
        </p>
        <ProofList proof={clip.proof} />
        {clip.decision && (
          <p className="cw-cs__decision">
            <span>Design decision</span>
            {clip.decision}
          </p>
        )}
      </div>
      <div className="cw-cs__deep-media">
        <CwVideoFrame
          src={clip.src}
          poster={clip.poster}
          label={clip.caption}
          mode="scroll"
        />
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

      <section className="cs-section cw-cs__system" id="cw-product">
        <p className="cs-section__eyebrow">Product</p>
        <h2>Surfaces that serve one planning call</h2>
        <p>
          The product is a loop, not a feature list: watch competitors and shelf-vs-floor pricing →
          set the weekend → forecast demand → see who&apos;s slipping → message on WhatsApp → prove
          the visit. Market trends (Latino vs mainstream national pulse) lives in the live app as a
          fifth primary tab; clip recording is next. Engagement stays with loyalty and Lola; this
          product owns visibility and proof.
        </p>
        <CwModulesGrid />
      </section>

      <div id="cw-proof" className="cw-cs__proof-stack">
        <div className="cs-section cw-cs__proof-intro">
          <p className="cs-section__eyebrow">Proof</p>
          <h2>Each surface, with the clip and the call</h2>
        </div>
        {CW_PROOF_CLIPS.map((clip, i) => (
          <CapabilityProof key={clip.id} clip={clip} index={i} />
        ))}
      </div>

      <section className="cs-section" id="cw-impact">
        <p className="cs-section__eyebrow">Impact</p>
        <h2>Did the Thursday call get better — and did outreach land?</h2>
        <p>
          Success is the loop: operators can see competitor and demand signal before the weekend,
          then measure outreach as register visits — not send counts alone.
        </p>
        <ImpactStats />
        <p className="cw-cs__impact-closer">
          Intelligence for the call operators actually make — engagement stays with loyalty and Lola;
          this product owns visibility and proof.
        </p>
      </section>
      </div>
    </div>
  )
}
