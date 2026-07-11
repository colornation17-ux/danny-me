import { useEffect, useId, useState } from 'react'
import CwModulesGrid from './CwModulesGrid'
import CwVideoFrame from './CwVideoFrame'
import { CW_PROOF_CLIPS } from '../../data/competitorWatchMotion'
import { SITE } from '../../data/site'

const TOC = [
  { id: 'cw-brief', label: 'Problem' },
  { id: 'cw-foundation', label: 'Foundation' },
  { id: 'cw-product', label: 'Product' },
  { id: 'cw-proof', label: 'Proof' },
  { id: 'cw-impact', label: 'Impact' },
  { id: 'cw-close', label: 'Contact' },
]

const BRIEF_PROBLEM = [
  {
    n: '01',
    title: 'Blind vs the chains',
    body: 'Thursday ads rewrite the weekend. Without a live competitor view, the owner prices and features meat by gut — while mainstream and Latino chains set the floor, and the store finds out it was wrong on Saturday.',
    user: 'Know in one glance if pricing and features are competitive — before the ad window closes.',
    business: "Turn Thursday's chain ads into same-day pricing calls, not gut instinct.",
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
    body: 'Loyalty and WhatsApp could already reach shoppers (Lola + campaigns). The gap was proving which messages drove a register visit — not building CRM from scratch.',
    user: 'Know which WhatsApp message actually got someone back in the store.',
    business: 'Prove outreach as POS visits, not send/read counts — justify the continued spend.',
  },
]

const BRIEF_SOLUTION = [
  {
    n: '01',
    title: 'Competitor benchmarks',
    body: 'Live Flipp index across markets — meat winners surfaced first so independents can answer the chains on price and pack.',
  },
  {
    n: '02',
    title: 'Weather → weekend actions',
    body: '3-day forecast mapped to plain-language category targets: push, ease off, or hold.',
  },
  {
    n: '03',
    title: 'Sales + demand in one loop',
    body: 'Store pulse beside 7-day forecast bands and buy/hold/reduce lists — decision support, not another report dump.',
  },
  {
    n: '04',
    title: 'Attribution on the channel they run',
    body: 'Segment who is slipping, message on WhatsApp, match POS visits in seven days — close the loop with the engagement layer already in market.',
  },
]

const DECISIONS = [
  {
    title: 'Intelligence, not another inbox',
    body: 'Engagement already lived in loyalty and Lola. Competitor Watch owns the Thursday planning call — competitors, weather, forecast — then proves outreach with visits.',
  },
  {
    title: 'Forecasts as ranges',
    body: 'Operators ignored single numbers; bands and buy/hold/reduce lists got used.',
  },
  {
    title: 'Attribution over send counts',
    body: 'WhatsApp is the channel the store already runs. The product is CRM phone → POS visit within seven days — not vanity campaign metrics.',
  },
]

const IMPACT = [
  { value: '2,088', label: 'Attributed POS visits' },
  { value: '65.9%', label: 'WhatsApp read rate' },
  { value: '277', label: 'Shoppers due to return' },
  { value: '144', label: 'Live ads indexed' },
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

function CaseToc() {
  const [active, setActive] = useState(TOC[0].id)

  useEffect(() => {
    const nodes = TOC.map((t) => document.getElementById(t.id)).filter(Boolean)
    if (!nodes.length) return undefined

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <nav className="cw-toc" aria-label="Case study sections">
      {TOC.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`cw-toc__link${active === item.id ? ' cw-toc__link--active' : ''}`}
        >
          {item.label}
        </a>
      ))}
    </nav>
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
      <h2>Thursday decides the weekend — without a decision system</h2>
      <p>
        La Bodega already had loyalty and WhatsApp reach. What it lacked was an intelligence layer:
        live competitor prices, weather-tied weekend calls, and demand signal in one place — in the
        twelve minutes between ad drop and the order. Competitor Watch is that decision-support
        stack; attribution closes the loop with the engagement layer already in market.
      </p>

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
      <h2>Two weeks, one builder, five tabs of IA</h2>
      <p>
        I started with the Thursday window — the twelve minutes between the chains&apos; ad drop and
        La Bodega&apos;s order call — and mapped every question the owner needed answered inside it:
        what are they advertising, what should we push, will we sell it, who&apos;s slipping, did the
        outreach land. That became the IA: five tabs, one story each.
      </p>
      <p>
        Solo build, React frontend + Python backend (StatsForecast ensemble), MVP to production in
        two weeks. The hard calls weren&apos;t visual — they were legibility: making avg-vs-floor
        pricing readable in seconds, keeping the guest view honest without gating the owner&apos;s
        real numbers, and drawing a hard line between engagement (already owned by loyalty/Lola) and
        decision support (this product) so Competitor Watch never turned into a second CRM.
      </p>
      <p>
        Designing with a constraint: the demand-forecast model got disabled in production before
        launch. Rather than cut the surface, I built it for the model&apos;s real output shape — buy /
        hold / reduce plus bands, not a fake-precise single number — so forecasting drops back in
        cleanly whenever it&apos;s re-enabled.
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
          <em>{clip.job}</em> — {clip.problem}
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
      <CaseToc />

      <div className="cw-cs__body">
      <BriefToggle />

      <FoundationSection />

      <section className="cs-section cw-cs__system" id="cw-product">
        <p className="cs-section__eyebrow">Product</p>
        <h2>Six surfaces for one planning call</h2>
        <p>
          Watch competitors → set the weekend → forecast demand → see who&apos;s slipping → message
          on WhatsApp → prove the visit. Engagement stays with loyalty and Lola; this product owns
          visibility and proof.
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
        <h2>Planning signal + attributed visits</h2>
        <p>
          Success is twofold: operators can see competitor and demand signal before the weekend, and
          outreach is measured as register visits — not send counts alone.
        </p>
        <ImpactStats />
      </section>

      <section className="cw-cs__close" id="cw-close">
        <h2>Intelligence for the call operators actually make.</h2>
        <p>
          Looking to bring the same problem-framing — engagement layer + decision layer — to product
          teams.
        </p>
        <div className="cs-actions">
          <a className="btn btn--primary" href={`mailto:${SITE.email}`}>
            Get in touch
          </a>
          <a
            className="btn btn--ghost"
            href="https://competitor-watch-1.onrender.com"
            target="_blank"
            rel="noreferrer"
            title="First load on Render can take about 60 seconds"
          >
            Open live app
          </a>
        </div>
      </section>
      </div>
    </div>
  )
}
