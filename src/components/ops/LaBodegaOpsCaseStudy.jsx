import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  APPROACH,
  CONTEXT,
  HERO,
  IDEATION,
  IMPACT,
  LBD_OPS_LIVE,
  LESSONS,
  PROBLEM,
  PROBLEM_FLOWS,
  PROOF,
  RESEARCH,
  RESEARCH_BOARD,
  ROLE,
  ROLES_STRIP,
  SOLUTION_OPEN,
  SUMMARY,
} from '../../data/laBodegaOpsCase'
import { SketchStroke } from '../SketchStroke'
import {
  PhoneShot,
  ProblemFlowMap,
  ResearchBoard,
  SolutionFlow,
  WireAb,
  WIRE_APPROVE,
  WIRE_BUDGET,
  WIRE_CLOCK,
  WIRE_DOOR,
  WIRE_INVENTORY,
  WIRE_KITCHEN,
  WIRE_ROLE_HOME,
  WIRE_WALK,
} from './OpsWireframes'
import { FailuresBoard } from './FailuresBoard'
import { OpsSolutionCubes } from './OpsSolutionCubes'
import '../../styles/la-bodega-ops-case.css'

export { LBD_OPS_RAIL_STEPS } from '../../data/laBodegaOpsCase'

const SHOTS = {
  staff: {
    src: '/work/la-bodega-ops/staff-home.png',
    alt: 'La Bodega Ops staff home — sign-in pass and Where to work',
    caption: 'Staff · Clock in · Where to work',
  },
  manager: {
    src: '/work/la-bodega-ops/manager-today.png',
    alt: 'La Bodega Ops manager Today — On the floor and Store Pulse',
    caption: 'Today · Store Pulse',
  },
  purchasing: {
    src: '/work/la-bodega-ops/manager-purchasing.png',
    alt: 'Purchasing — Walk with vendor, Door delivery, Invoice batch',
    caption: 'Purchasing',
  },
  walk: {
    src: '/work/la-bodega-ops/walk-vendor-intel.png',
    alt: 'Walk with vendor — Goya last paid, lowest, suggested qty',
    caption: 'Walk with vendor',
  },
  dsd: {
    src: '/work/la-bodega-ops/dsd-checkin.png',
    alt: 'Door delivery check-in with invoice lines',
    caption: 'Door delivery',
  },
  putaway: {
    src: '/work/la-bodega-ops/putaway-replenish.png',
    alt: 'Putaway replenish with aisle and bay',
    caption: 'Putaway',
  },
  kitchen: {
    src: '/work/la-bodega-ops/kitchen-prep.png',
    alt: 'Kitchen prep log',
    caption: 'Kitchen prep',
  },
  inventory: {
    src: '/work/la-bodega-ops/inventory-count.png',
    alt: 'Cycle count on phone camera',
    caption: 'Cycle count',
  },
  budgets: {
    src: '/work/la-bodega-ops/admin-budgets.png',
    alt: 'Department budgets with weekly caps',
    caption: 'Dept budgets',
  },
  team: {
    src: '/work/la-bodega-ops/manager-team.png',
    alt: 'Live team — on floor, late, clocked out',
    caption: 'Live team',
  },
  schedule: {
    src: '/work/la-bodega-ops/admin-schedule-plan.png',
    alt: 'Weekly schedule plan',
    caption: 'Schedule',
  },
  scheduleWeek: {
    src: '/work/la-bodega-ops/admin-schedule-week.png',
    alt: 'Weekly schedule vs payroll budget',
    caption: 'Schedule · payroll',
  },
}

function Section({ id, eyebrow, title, children, mark, bleed, wide }) {
  return (
    <section
      id={id}
      className={`lbd-ops__section${bleed ? ' lbd-ops__section--bleed' : ''}${wide ? ' lbd-ops__section--wide' : ''}`}
      aria-labelledby={`${id}-title`}
    >
      <header className="lbd-ops__head">
        {eyebrow ? <p className="lbd-ops__eyebrow">{eyebrow}</p> : null}
        <h2 id={`${id}-title`} className="lbd-ops__h2">
          {title}
          {mark ? (
            <span className="lbd-ops__scribble" aria-hidden="true">
              <SketchStroke variant="underline" />
            </span>
          ) : null}
        </h2>
      </header>
      {children}
    </section>
  )
}

function StoryBeat({ eyebrow, title, children, note }) {
  return (
    <div className="lbd-ops__beat">
      {eyebrow ? <p className="lbd-ops__beat-kicker">{eyebrow}</p> : null}
      {title ? <h3 className="lbd-ops__beat-title">{title}</h3> : null}
      {children}
      {note ? <p className="lbd-ops__beat-note">{note}</p> : null}
    </div>
  )
}

function BeatSplit({ children, pair }) {
  return (
    <div className={`lbd-ops__beat-split${pair ? ' lbd-ops__beat-split--pair' : ''}`.trim()}>
      {children}
    </div>
  )
}

function LivePilotCta({ early }) {
  return (
    <p className={`lbd-ops__cta-row${early ? ' lbd-ops__cta-row--early' : ''}`}>
      <a className="folio-btn folio-btn--solid lbd-ops__btn" href={LBD_OPS_LIVE} target="_blank" rel="noreferrer">
        Try the live app ↗
      </a>
      {!early ? (
        <Link className="folio-btn" to="/projects/bodega-ops">
          ← Chapter 01 · Checkout Ops
        </Link>
      ) : null}
    </p>
  )
}

export default function LaBodegaOpsCaseStudy() {
  const [showMoreFails, setShowMoreFails] = useState(false)
  const [showMorePairs, setShowMorePairs] = useState(false)

  const leadFlow = PROBLEM_FLOWS[0]
  const highlightFlows = PROBLEM_FLOWS.slice(1, 4)
  const moreFlows = PROBLEM_FLOWS.slice(4)

  return (
    <div className="lbd-ops">
      <div className="lbd-ops__grain" aria-hidden="true" />

      <header id="lbd-hero" className="lbd-ops__hero">
        <figure className="lbd-ops__hero-visual">
          <img
            src="/work/la-bodega-ops/hero.png"
            alt="La Bodega Ops — phones showing purchasing, clock-in, Store Pulse, vendor walk, live team, and budgets on a red field"
            width={5000}
            height={3333}
            decoding="async"
            fetchPriority="high"
          />
        </figure>
        <div className="lbd-ops__hero-copy">
          <p className="lbd-ops__kicker">{HERO.kicker}</p>
          <h1 className="lbd-ops__title">{HERO.title}</h1>
          <p className="lbd-ops__thesis">{HERO.thesis}</p>
          <p className="lbd-ops__bridge-ticket">
            Reads on its own
            <span aria-hidden="true"> · </span>
            {CONTEXT.family.map((f, i) => (
              <span key={f.href}>
                {i > 0 ? <span aria-hidden="true"> · </span> : null}
                <Link to={f.href}>{f.label}</Link>
              </span>
            ))}
          </p>
        </div>
      </header>

      <Section id="lbd-summary" eyebrow="Summary" title="Case overview" mark>
        <p className="lbd-ops__summary-blurb">{SUMMARY.blurb}</p>
        <p className="lbd-ops__process-cue">{SUMMARY.process}</p>
        <div className="lbd-ops__twin" aria-label="Problem and solution">
          <div className="lbd-ops__twin-col">
            <p className="lbd-ops__twin-label">Problem</p>
            <p className="lbd-ops__twin-body">{SUMMARY.bet.problem}</p>
          </div>
          <div className="lbd-ops__twin-col lbd-ops__twin-col--solution">
            <p className="lbd-ops__twin-label">Solution</p>
            <p className="lbd-ops__twin-body">{SUMMARY.bet.solution}</p>
          </div>
        </div>

        <aside className="lbd-ops__decision lbd-ops__decision--digest" aria-label={SUMMARY.decisionDigest.title}>
          <p className="lbd-ops__po-label">{SUMMARY.decisionDigest.title}</p>
          <p className="lbd-ops__decision-lead">{SUMMARY.decisionDigest.lead}</p>
          <p className="lbd-ops__decision-digest-stakes">{SUMMARY.decisionDigest.stakes}</p>
          <a className="lbd-ops__decision-digest-link" href={SUMMARY.decisionDigest.href}>
            {SUMMARY.decisionDigest.more}
          </a>
        </aside>

        <div className="lbd-ops__skim-bar">
          <p className="lbd-ops__skim-jumps" aria-label="Skim paths">
            <a className="lbd-ops__skim-jump lbd-ops__skim-jump--primary" href={SUMMARY.jump.decision.href}>
              {SUMMARY.jump.decision.label}
            </a>
            <a className="lbd-ops__skim-jump" href={SUMMARY.jump.screens.href}>
              {SUMMARY.jump.screens.label}
            </a>
            <a className="lbd-ops__skim-jump" href={SUMMARY.jump.research.href}>
              {SUMMARY.jump.research.label}
            </a>
          </p>
          <LivePilotCta early />
        </div>

        <figure className="lbd-ops__cover">
          <img
            src="/work/la-bodega-ops/cover.png"
            alt="La Bodega Ops staff home on a phone, with the red L app icon and Get chip"
            width={6000}
            height={4171}
            loading="lazy"
            decoding="async"
          />
          <figcaption>Staff home: clock in, then open Where to work</figcaption>
        </figure>
        <dl className="lbd-ops__fact-grid">
          {SUMMARY.facts.map((f) => (
            <div key={f.label} className="lbd-ops__fact">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="lbd-ops__roles" role="list">
          {ROLES_STRIP.map((r) => (
            <div key={r.role} className="lbd-ops__role" role="listitem">
              <strong>{r.role}</strong>
              <span>{r.owns}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="lbd-problem" eyebrow="Problem" title="No floor system — only a spreadsheet" bleed mark>
        <p className="lbd-ops__scene-line">{CONTEXT.scene}</p>
        <p className="lbd-ops__problem">{PROBLEM.statement}</p>
        <p className="lbd-ops__north">
          <span className="lbd-ops__north-label">Design question</span>
          <span className="lbd-ops__north-q">{PROBLEM.north}</span>
        </p>
        <div className="lbd-ops__fail-board">
          <FailuresBoard flows={PROBLEM_FLOWS} />
        </div>
        <div className="lbd-ops__fail-strips">
          <ProblemFlowMap
            lead={leadFlow}
            highlights={highlightFlows}
            more={moreFlows}
            moreOpen={showMoreFails}
            onToggleMore={() => setShowMoreFails((v) => !v)}
          />
        </div>
        <ul className="lbd-ops__voices lbd-ops__voices--tight">
          {PROBLEM.whoHurts.map((v) => (
            <li key={v.role} className="lbd-ops__voice">
              <p className="lbd-ops__voice-role">{v.role}</p>
              <blockquote>“{v.line}”</blockquote>
              <p className="lbd-ops__note">{v.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="lbd-approach" eyebrow="Research" title={APPROACH.title} mark>
        <div className="lbd-ops__research">
          <p className="lbd-ops__north">
            <span className="lbd-ops__north-label">Research question</span>
            <span className="lbd-ops__north-q">{APPROACH.question}</span>
          </p>
          <p className="lbd-ops__lede lbd-ops__lede--tight">{APPROACH.lede}</p>

          <dl className="lbd-ops__frame-strip" aria-label="5W1H">
            {APPROACH.frame.map((f) => (
              <div key={f.w} className="lbd-ops__frame-row">
                <dt>{f.w}</dt>
                <dd>{f.body}</dd>
              </div>
            ))}
          </dl>

          <div className="lbd-ops__research-block">
            <p className="lbd-ops__landscape-gap">{APPROACH.landscape.lead}</p>
            <ul className="lbd-ops__landscape-links" aria-label="Related products">
              {APPROACH.landscape.apps.map((app) => (
                <li key={app.id} className={app.current ? 'is-current' : undefined}>
                  {app.href ? <Link to={app.href}>{app.name}</Link> : <span>{app.name}</span>}
                  {app.current ? <span className="lbd-ops__landscape-tag">This case</span> : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="lbd-ops__research-block">
            <h3 className="lbd-ops__summary-h">Methods</h3>
            <ul className="lbd-ops__method-chips" aria-label="Research methods">
              {APPROACH.methods.map((m) => (
                <li key={m.title}>
                  <strong>{m.title}</strong>
                  <span>{m.detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lbd-ops__research-block">
            <h3 className="lbd-ops__summary-h">Findings</h3>
            <ol className="lbd-ops__findings lbd-ops__findings--grid">
              {APPROACH.findings.map((f, i) => (
                <li key={f.title}>
                  <span className="lbd-ops__approach-n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <dl className="lbd-ops__baseline" aria-label="Baseline facts">
            {APPROACH.baseline.map((b) => (
              <div key={b.label} className="lbd-ops__baseline-item">
                <dt>{b.label}</dt>
                <dd>{b.value}</dd>
              </div>
            ))}
          </dl>

          <figure className="lbd-ops__research-quote">
            <blockquote>“{APPROACH.quote.line}”</blockquote>
            <figcaption>
              {APPROACH.quote.role}
              <span className="lbd-ops__note"> · {APPROACH.quote.note}</span>
            </figcaption>
          </figure>

          <p className="lbd-ops__ideate-bet">
            <span className="lbd-ops__ideate-bet-label">Implication → bet</span>
            {APPROACH.bet}
          </p>

          <ul className="lbd-ops__assume-skim" aria-label="Assumptions to test">
            {APPROACH.assumptions.slice(0, 2).map((a) => (
              <li key={a.assume}>
                <p>
                  <span className="lbd-ops__po-label">Assume</span>
                  {a.assume}
                </p>
                <p>
                  <span className="lbd-ops__po-label">Test</span>
                  {a.test}
                </p>
              </li>
            ))}
          </ul>

          <div className="lbd-ops__uxr-meta lbd-ops__uxr-meta--compact" aria-label="Validation">
            <div>
              <p className="lbd-ops__po-label">Validation</p>
              <ul className="lbd-ops__uxr-list">
                {APPROACH.validation.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          </div>

          <details className="lbd-ops__details lbd-ops__details--inline">
            <summary>Observation notes and affinity board</summary>
            <div className="lbd-ops__details-body">
              <p className="lbd-ops__lede">{RESEARCH.lead}</p>
              <h4 className="lbd-ops__subh">Prompts used on the floor</h4>
              <ul className="lbd-ops__prompt-list">
                {APPROACH.prompts.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <ul className="lbd-ops__method-grid">
                {RESEARCH.methods.map((m) => (
                  <li key={m.title}>
                    <strong>{m.title}</strong>
                    <p>{m.detail}</p>
                  </li>
                ))}
              </ul>
              <ResearchBoard board={RESEARCH_BOARD} />
            </div>
          </details>
        </div>
      </Section>

      <Section id="lbd-ideation" eyebrow="Ship" title={IDEATION.title} mark>
        <p className="lbd-ops__lede">{IDEATION.lede}</p>

        <aside className="lbd-ops__decision" aria-label={IDEATION.decision.title}>
          <p className="lbd-ops__po-label">{IDEATION.decision.title}</p>
          <p className="lbd-ops__decision-lead">{IDEATION.decision.decision}</p>
          <dl className="lbd-ops__decision-grid">
            <div>
              <dt>Stakes</dt>
              <dd>{IDEATION.decision.stakes}</dd>
            </div>
            <div>
              <dt>Rejected</dt>
              <dd>{IDEATION.decision.rejected}</dd>
            </div>
            <div>
              <dt>Lock</dt>
              <dd>{IDEATION.decision.lock}</dd>
            </div>
            <div>
              <dt>Revisit</dt>
              <dd>{IDEATION.decision.revisit}</dd>
            </div>
            <div>
              <dt>Collab</dt>
              <dd>{IDEATION.decision.collab}</dd>
            </div>
            <div>
              <dt>Suite</dt>
              <dd>{IDEATION.decision.suite}</dd>
            </div>
          </dl>
        </aside>

        <div className="lbd-ops__po-strip" aria-label="Product owner ship rationale">
          <div className="lbd-ops__po-card">
            <p className="lbd-ops__po-label">Shipped first</p>
            <p>{IDEATION.ship.first}</p>
          </div>
          <div className="lbd-ops__po-card">
            <p className="lbd-ops__po-label">Supports the floor</p>
            <p>{IDEATION.ship.support}</p>
          </div>
          <div className="lbd-ops__po-card">
            <p className="lbd-ops__po-label">Deferred</p>
            <ul>
              {IDEATION.ship.deferred.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="lbd-ops__success-signals">
          {IDEATION.success.map((s) => (
            <li key={s.label}>
              <strong>{s.label}</strong>
              <p>{s.body}</p>
            </li>
          ))}
        </ul>

        <details className="lbd-ops__details lbd-ops__details--inline">
          <summary>Product map and rejected directions</summary>
          <div className="lbd-ops__details-body">
            <ul className="lbd-ops__ideate-qs">
              {IDEATION.questions.map((q) => (
                <li key={q.id}>
                  <p className="lbd-ops__ideate-q">{q.q}</p>
                  <p className="lbd-ops__ideate-a">{q.a}</p>
                </li>
              ))}
            </ul>
            <p className="lbd-ops__ideate-bet">
              <span className="lbd-ops__ideate-bet-label">Bet</span>
              {IDEATION.bet}
            </p>
            <h4 className="lbd-ops__subh">Rejected directions</h4>
            <ul className="lbd-ops__ideate-reject">
              {IDEATION.rejected.map((r) => (
                <li key={r.no}>
                  <p>
                    <span className="lbd-ops__ideate-no">Not</span> {r.no}
                  </p>
                  <p>
                    <span className="lbd-ops__ideate-yes">Instead</span> {r.yes}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </Section>

      <Section id="lbd-loops" eyebrow="Solution" title="Shipped screens" mark wide>
        <p className="lbd-ops__lede lbd-ops__lede--solution">{SOLUTION_OPEN.lede}</p>
        <SolutionFlow />

        <figure className="lbd-ops__cover lbd-ops__cover--roles">
          <img
            src="/work/la-bodega-ops/roles-pair.png"
            alt="La Bodega Ops on two phones — cashier Mercado shift tools and admin Analytics"
            width={1024}
            height={711}
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            Cashier tools on the left. Admin analytics on the right. Same system, different homes.
          </figcaption>
        </figure>

        <OpsSolutionCubes shots={SHOTS} />

        <LivePilotCta early />
      </Section>

      <Section id="lbd-decisions" eyebrow="Challenge → Solution" title="Before and after" mark>
        <p className="lbd-ops__lede">
          Challenge on the left. Shipped pattern on the right. Phones show the live screens.
        </p>

        <StoryBeat
          eyebrow="Walk with vendor"
          title="Manager scans on the aisle. Screen shows last paid, lowest price, and budget."
        >
          <BeatSplit>
            <WireAb
              hypothesis={WIRE_WALK.hypothesis}
              title={WIRE_WALK.title}
              aLabel="Before · Shelf guess"
              bLabel="After · Walk with vendor"
              aItems={WIRE_WALK.aItems}
              bItems={WIRE_WALK.bItems}
            />
            <PhoneShot className="lbd-ops__phone--bento" {...SHOTS.walk} />
          </BeatSplit>
        </StoryBeat>

        <StoryBeat
          eyebrow="Dept budgets"
          title="Admin sets weekly caps. Managers can hold a buy when the cap is hit."
        >
          <BeatSplit>
            <WireAb
              hypothesis={WIRE_BUDGET.hypothesis}
              title={WIRE_BUDGET.title}
              aLabel="Before · Spreadsheet after the buy"
              bLabel="After · Dept caps"
              aItems={WIRE_BUDGET.aItems}
              bItems={WIRE_BUDGET.bItems}
            />
            <PhoneShot className="lbd-ops__phone--bento" {...SHOTS.budgets} />
          </BeatSplit>
          <p className="lbd-ops__beat-note">
            Caps follow P&L contribution and live as weekly rails in Ops.
          </p>
        </StoryBeat>

        <StoryBeat
          eyebrow="Door delivery"
          title="Manager scans the invoice (OCR). If a line is missed, a voice note fills product, quantity, and price."
        >
          <BeatSplit>
            <WireAb
              hypothesis={WIRE_DOOR.hypothesis}
              title={WIRE_DOOR.title}
              aLabel="Before · WhatsApp photos"
              bLabel="After · Door delivery"
              aItems={WIRE_DOOR.aItems}
              bItems={WIRE_DOOR.bItems}
            />
            <PhoneShot className="lbd-ops__phone--bento" {...SHOTS.dsd} />
          </BeatSplit>
        </StoryBeat>

        {showMorePairs ? (
          <>
            <StoryBeat eyebrow="Role home" title="Each role opens its own home screen.">
              <BeatSplit>
                <WireAb
                  hypothesis={WIRE_ROLE_HOME.hypothesis}
                  title={WIRE_ROLE_HOME.title}
                  aLabel="Before · Flat menu"
                  bLabel="After · Role home"
                  aItems={WIRE_ROLE_HOME.aItems}
                  bItems={WIRE_ROLE_HOME.bItems}
                />
                <PhoneShot className="lbd-ops__phone--bento" {...SHOTS.staff} />
              </BeatSplit>
            </StoryBeat>

            <StoryBeat
              eyebrow="Verified clock"
              title="Staff clock in with geofence or kiosk. Punches link to the schedule."
            >
              <BeatSplit>
                <WireAb
                  hypothesis={WIRE_CLOCK.hypothesis}
                  title={WIRE_CLOCK.title}
                  aLabel="Before · Paper sheet"
                  bLabel="After · Verified clock"
                  aItems={WIRE_CLOCK.aItems}
                  bItems={WIRE_CLOCK.bItems}
                />
                <PhoneShot className="lbd-ops__phone--bento" {...SHOTS.team} />
              </BeatSplit>
            </StoryBeat>

            <StoryBeat
              eyebrow="Manager approve"
              title="Manager handles overtime and floor requests in-app. Owner sees escalations."
              note="Approvals inbox is empty in the demo seed. Wire shows the pattern; Store Pulse shows the shift view."
            >
              <WireAb
                hypothesis={WIRE_APPROVE.hypothesis}
                title={WIRE_APPROVE.title}
                aLabel="Before · Text the owner"
                bLabel="After · Manager approve"
                aItems={WIRE_APPROVE.aItems}
                bItems={WIRE_APPROVE.bItems}
              />
            </StoryBeat>

            <StoryBeat
              eyebrow="Cycle count"
              title="Staff count stock on phone camera. No POS inventory license or scanner fleet."
            >
              <BeatSplit>
                <WireAb
                  hypothesis={WIRE_INVENTORY.hypothesis}
                  title={WIRE_INVENTORY.title}
                  aLabel="Before · POS / scanner cost"
                  bLabel="After · Phone cycle count"
                  aItems={WIRE_INVENTORY.aItems}
                  bItems={WIRE_INVENTORY.bItems}
                />
                <PhoneShot className="lbd-ops__phone--bento" {...SHOTS.inventory} />
              </BeatSplit>
            </StoryBeat>

            <StoryBeat
              eyebrow="Kitchen prep"
              title="Kitchen logs prep date and expiry. Manager and admin can open the cooler log."
            >
              <BeatSplit>
                <WireAb
                  hypothesis={WIRE_KITCHEN.hypothesis}
                  title={WIRE_KITCHEN.title}
                  aLabel="Before · Cooler blind"
                  bLabel="After · Prep log"
                  aItems={WIRE_KITCHEN.aItems}
                  bItems={WIRE_KITCHEN.bItems}
                />
                <PhoneShot className="lbd-ops__phone--bento" {...SHOTS.kitchen} />
              </BeatSplit>
            </StoryBeat>
          </>
        ) : null}

        <button
          type="button"
          className="lbd-ops__more-btn"
          onClick={() => setShowMorePairs((v) => !v)}
          aria-expanded={showMorePairs}
        >
          {showMorePairs
            ? 'Hide role home, clock, approvals, count, kitchen'
            : 'Show role home, clock, approvals, count, kitchen'}
        </button>
      </Section>

      <Section id="lbd-lessons" eyebrow="Lessons" title="Takeaways" mark>
        <ol className="lbd-ops__lessons">
          {LESSONS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </Section>

      <Section id="lbd-impact" eyebrow="Impact" title="Outcomes">
        {IMPACT.context.length > 0 ? (
          <ul className="lbd-ops__metrics">
            {IMPACT.context.map((m) => (
              <li key={m.label}>
                <span className="lbd-ops__metric-v">{m.value}</span>
                <span className="lbd-ops__metric-l">{m.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="lbd-ops__outcomes">
          {IMPACT.outcomes.slice(0, 3).map((o) => (
            <li key={o.title}>
              <strong>{o.title}</strong>
              <p>{o.detail}</p>
            </li>
          ))}
        </ul>

        <details className="lbd-ops__details">
          <summary>Appendix · proof, credits, caveats</summary>
          <h3 className="lbd-ops__appendix-h">Proof</h3>
          <ul className="lbd-ops__proof">
            {PROOF.map((p) => (
              <li key={p.title}>
                <strong>{p.title}</strong>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
          <ul className="lbd-ops__outcomes">
            {IMPACT.outcomes.slice(3).map((o) => (
              <li key={o.title}>
                <strong>{o.title}</strong>
                <p>{o.detail}</p>
              </li>
            ))}
          </ul>
          <h3 className="lbd-ops__appendix-h">Credits</h3>
          <p className="lbd-ops__lede">{ROLE.not}</p>
          <p className="lbd-ops__appendix-sub">What I owned</p>
          <ul className="lbd-ops__caveat-list">
            {ROLE.mine.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="lbd-ops__appendix-sub">Floor partners</p>
          <ul className="lbd-ops__caveat-list">
            {ROLE.partners.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="lbd-ops__appendix-h">Still measuring</h3>
          <ul className="lbd-ops__caveat-list">
            {IMPACT.stillMeasuring.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>

        <LivePilotCta />
      </Section>
    </div>
  )
}
