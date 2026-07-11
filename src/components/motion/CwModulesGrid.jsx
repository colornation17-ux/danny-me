import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/** Six core Competitor Watch features — clickable proof jump cards. */
const MODULES = [
  {
    id: 'sales-summary',
    n: '01',
    title: 'Sales pulse',
    body: 'Is this week good or not? Store heartbeat — revenue, orders, and movers at a glance.',
    metricLabel: 'Week over week',
    metricDisplay: '+19.2%',
    metric: 88,
    tags: ['$46,091 week', '1,582 orders', 'Daily bars'],
    tone: 'green',
    icon: 'bars',
  },
  {
    id: 'competitor-deals',
    n: '02',
    title: 'Competitor deals',
    body: 'What are the chains advertising? Live Flipp index with meat winners surfaced first.',
    metricLabel: 'Ads indexed',
    metricDisplay: '144',
    metric: 90,
    tags: ['15 chains', 'Meat winners', 'ZIP markets'],
    tone: 'blue',
    icon: 'scan',
  },
  {
    id: 'weekend-playbook',
    n: '03',
    title: 'Weekend playbook',
    body: 'What do we push this weekend? Weather-tied category targets operators can act on.',
    metricLabel: 'Hot food lift',
    metricDisplay: '↑30%',
    metric: 78,
    tags: ['Rain wknd', 'Push / skip', 'Category targets'],
    tone: 'orange',
    icon: 'weather',
  },
  {
    id: 'demand-forecast',
    n: '04',
    title: 'Demand forecast',
    body: 'How much will we sell? 7-day outlook with per-SKU buy / hold / reduce.',
    metricLabel: 'Prediction band',
    metricDisplay: '80%',
    metric: 80,
    tags: ['$42.4K next wk', 'Buy · Hold · Reduce'],
    tone: 'violet',
    icon: 'forecast',
  },
  {
    id: 'customers-rfm',
    n: '05',
    title: 'Customers · RFM · Retention',
    body: 'Who are my shoppers & who’s slipping? Segments by recency, frequency, spend — plus next-visit predictions.',
    metricLabel: 'Due to return',
    metricDisplay: '277',
    metric: 74,
    tags: ['1,469 customers', '5 RFM tiers', 'Win-back'],
    tone: 'teal',
    icon: 'users',
  },
  {
    id: 'whatsapp-crm',
    n: '06',
    title: 'WhatsApp attribution',
    body: 'Did the outreach work? Match each message to a POS visit within seven days — proof for the channel loyalty and Lola already use.',
    metricLabel: 'Attributed visits',
    metricDisplay: '2,088',
    metric: 66,
    tags: ['8,369 sent', '65.9% read', '7-day match'],
    tone: 'green',
    icon: 'chat',
  },
]

const EASE = [0.22, 1, 0.36, 1]

function ModuleIcon({ name }) {
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (name === 'bars') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19V11M10 19V5M15 19v-7M20 19V8" {...stroke} />
      </svg>
    )
  }
  if (name === 'scan') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3M7 12h10" {...stroke} />
      </svg>
    )
  }
  if (name === 'weather') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10" cy="10" r="3.2" {...stroke} />
        <path
          d="M10 4.5v1.2M10 14.3v1.2M4.5 10h1.2M14.3 10h1.2M6.2 6.2l.9.9M12.9 12.9l.9.9M6.2 13.8l.9-.9M12.9 7.1l.9-.9M14 15.5a3.5 3.5 0 0 1 0 7H8.8a3.2 3.2 0 1 1 .4-6.4"
          {...stroke}
        />
      </svg>
    )
  }
  if (name === 'forecast') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 18h16M6 14l3-4 3 2 4-6 2 3" {...stroke} />
      </svg>
    )
  }
  if (name === 'users') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M16 19v-1.2A3.2 3.2 0 0 0 12.8 14.6H8.2A3.2 3.2 0 0 0 5 17.8V19M14.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM19 19v-1a2.8 2.8 0 0 0-2-2.7M16.2 6.2a2.4 2.4 0 0 1 0 4.6"
          {...stroke}
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19V9l7-4 7 4v10M9 12h6M9 15.5h4" {...stroke} />
    </svg>
  )
}

  function focusFeature(id) {
  const el = document.getElementById(`cw-feature-${id}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add('cw-feature--flash')
  window.history.replaceState(null, '', `#cw-feature-${id}`)
  // Move focus, not just scroll — keyboard/screen-reader users get a signal
  // the click actually did something, not just sighted mouse users.
  el.focus({ preventScroll: true })
  window.setTimeout(() => el.classList.remove('cw-feature--flash'), 1200)
}

export default function CwModulesGrid() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(MODULES[1].id)
  const labelId = useId()

  return (
    <div className="cw-modules-wrap">
      <p className="cw-modules-hint" id={labelId}>
        Click a module to jump to its proof clip
      </p>
      <motion.div
        className="cw-modules cw-modules--six"
        role="list"
        aria-labelledby={labelId}
        initial={reduceMotion ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
          },
        }}
      >
        {MODULES.map((mod, i) => {
          const isActive = active === mod.id
          return (
            <motion.button
              key={mod.id}
              type="button"
              role="listitem"
              className={`cw-module cw-module--${mod.tone}${isActive ? ' cw-module--active' : ''}`}
              aria-pressed={isActive}
              onClick={() => {
                setActive(mod.id)
                focusFeature(mod.id)
              }}
              variants={{
                hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.42, ease: EASE },
                },
              }}
              whileHover={
                reduceMotion ? undefined : { y: -3, transition: { duration: 0.2, ease: EASE } }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            >
              <header className="cw-module__top">
                <span className="cw-module__icon">
                  <ModuleIcon name={mod.icon} />
                </span>
                <span className="cw-module__n">{mod.n}</span>
              </header>
              <h3>{mod.title}</h3>
              <p>{mod.body}</p>
              <div className="cw-module__metric">
                <div className="cw-module__metric-row">
                  <span>{mod.metricLabel}</span>
                  <strong>{mod.metricDisplay}</strong>
                </div>
                <div className="cw-module__bar" aria-hidden>
                  <motion.span
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    variants={{
                      hidden: { scaleX: 0 },
                      show: {
                        scaleX: 1,
                        transition: {
                          delay: 0.16 + i * 0.04,
                          duration: 0.65,
                          ease: EASE,
                        },
                      },
                    }}
                    style={{
                      width: `${mod.metric}%`,
                      transformOrigin: 'left center',
                    }}
                  />
                </div>
              </div>
              <ul className="cw-module__tags">
                {mod.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <span className="cw-module__cta">
                {isActive ? 'Viewing proof ↓' : 'View proof ↓'}
              </span>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
