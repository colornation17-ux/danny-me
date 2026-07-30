import { CW_MOCK } from '../../data/cwMockFixtures'

const D = CW_MOCK

/** Strip SKU noise and bilingual duplicates for portfolio readability. */
function cleanName(raw) {
  let s = String(raw || '').trim()
  if (!s) return '—'
  s = s.replace(/^\[[^\]]+\]\s*/, '')
  s = s.replace(/\bMisc(\s*\([^)]*\))?(\s+\d+\s*CT)?\b/gi, 'Misc grocery')
  s = s.replace(/\bPANINI FIFA WORLD CUP 2026\b/i, 'World Cup panini special')
  s = s.replace(/\bMango\s*\/\s*Mango\b/i, 'Mango')
  s = s.replace(/\bPapaya Madura\s*\/\s*Ripe Papaya\b/i, 'Ripe papaya')
  s = s.replace(/\bWeekend Buffet\s*[–-]\s*Adult\b/i, 'Weekend buffet (adult)')
  s = s.replace(/\bLunch Buffet Special\b/i, 'Lunch buffet')
  s = s.replace(/\s{2,}/g, ' ')
  // Title-case ALL CAPS product strings
  if (s.length > 3 && s === s.toUpperCase() && /[A-Z]/.test(s)) {
    s = s
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\b(Lb|Ct|Oz|Pk)\b/gi, (m) => m.toUpperCase())
  }
  return s
}

function cleanPrice(raw) {
  let s = String(raw || '').trim()
  s = s.replace(/\/Per Lb\.?/i, '/lb')
  s = s.replace(/\/Lb\.?/i, '/lb')
  s = s.replace(/\/LB\b/i, '/lb')
  s = s.replace(/\/With Card/i, ' card')
  return s
}

function humanCampaign(raw) {
  const map = {
    'july 4 final_1st': 'July 4 weekend blast',
    b17: 'Midweek meat push',
    lola_card: 'Lola loyalty card',
    'lb final j22': 'June 22 store blast',
    meet_lola: 'Meet Lola intro',
  }
  const key = String(raw || '')
    .trim()
    .toLowerCase()
  if (map[key]) return map[key]
  return String(raw || 'Campaign')
    .replace(/_/g, ' ')
    .replace(/\bfinal\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function MockHeader({ title, subtitle, badge = 'Owner' }) {
  return (
    <header className="cw-mock__header">
      <div className="cw-mock__header-text">
        <h2 className="cw-mock__title">{title}</h2>
        <p className="cw-mock__subtitle">{subtitle || `${D.pulse.market} · ${D.pulse.store}`}</p>
      </div>
      <span className="cw-mock__owner">{badge}</span>
    </header>
  )
}

function ScenePulse({ active }) {
  const { pulse } = D
  return (
    <div className={`cw-mock__scene cw-mock__scene--pulse${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Store pulse" subtitle={`${pulse.store} · ${pulse.market}`} />
      <div className="cw-mock__body">
        <div className="cw-mock__kpis">
          {pulse.kpis.map((kpi) => (
            <div key={kpi.label} className="cw-mock__kpi">
              <span className="cw-mock__kpi-label">{kpi.label}</span>
              <strong className="cw-mock__kpi-value">{kpi.value}</strong>
              <span
                className={
                  kpi.up === true
                    ? 'cw-mock__kpi-delta cw-mock__kpi-delta--up'
                    : kpi.up === false
                      ? 'cw-mock__kpi-delta cw-mock__kpi-delta--down'
                      : 'cw-mock__kpi-delta'
                }
              >
                {kpi.delta}
              </span>
            </div>
          ))}
        </div>
        <div className="cw-mock__panel">
          <div className="cw-mock__panel-head">
            Last 7 days <span className="cw-mock__panel-meta">daily revenue</span>
          </div>
          <div className="cw-mock__bars">
            {pulse.bars.map((h, i) => (
              <span
                key={i}
                className="cw-mock__bar"
                style={{ '--h': `${h}%`, '--d': `${i * 0.06}s` }}
              />
            ))}
          </div>
        </div>
        <div className="cw-mock__panel">
          <div className="cw-mock__panel-head">
            Week’s movers <span className="cw-mock__panel-meta">vs prior week</span>
          </div>
          <ul className="cw-mock__list">
            {pulse.movers.map((row, i) => (
              <li key={row.name} className="cw-mock__list-row" style={{ '--d': `${0.2 + i * 0.08}s` }}>
                <span className="cw-mock__list-name">{cleanName(row.name)}</span>
                <span className={row.up ? 'cw-mock__up' : 'cw-mock__down'}>{row.delta}</span>
                <strong>{row.amt}</strong>
              </li>
            ))}
          </ul>
        </div>
        <p className="cw-mock__foot">Week view before the Thursday order.</p>
      </div>
    </div>
  )
}

function SceneWeather({ active }) {
  const { weather, pulse } = D
  return (
    <div className={`cw-mock__scene cw-mock__scene--weather${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Weekend playbook" subtitle={`${pulse.market} · 3-day weather`} />
      <div className="cw-mock__body">
        <div className="cw-mock__alert cw-mock__alert--rain">
          <span className="cw-mock__alert-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M7 15l-1 4M12 14l-1 5M17 15l-1 4" strokeLinecap="round" />
              <path d="M4 13a5 5 0 019.9-1A4 4 0 1118 17H5a3 3 0 01-1-5.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {weather.alert}
        </div>
        <div className="cw-mock__weather-grid">
          {weather.days.map((day, i) => (
            <article key={day.label} className="cw-mock__weather-card" style={{ '--d': `${i * 0.1}s` }}>
              <header>
                <strong>{day.label}</strong>
                <span>{day.temp}</span>
              </header>
              <p>{day.rain} chance of rain</p>
              <div className="cw-mock__tags">
                {day.push.map((tag) => (
                  <span key={tag} className="cw-mock__tag cw-mock__tag--push">
                    Feature {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="cw-mock__panel">
          <div className="cw-mock__panel-head">{weather.targetHead}</div>
          <div className="cw-mock__targets">
            {weather.targets.map((t) => (
              <div key={t.label} className="cw-mock__target">
                <span>{t.label}</span>
                <div className={`cw-mock__target-bar${t.down ? ' cw-mock__target-bar--down' : ''}`}>
                  <span style={{ width: `${t.width}%` }} />
                </div>
                <strong>{t.amount}</strong>
              </div>
            ))}
          </div>
        </div>
        <p className="cw-mock__foot">Hot food and grocery up when rain is high; grill packs down.</p>
      </div>
    </div>
  )
}

function SceneDeals({ active }) {
  const { deals, pulse } = D
  const low = deals.deals[0]
  return (
    <div className={`cw-mock__scene cw-mock__scene--deals${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader
        title="Competitor deals"
        subtitle={`${pulse.market} · ${deals.subtitle?.replace(`${pulse.market} · `, '') || 'weekly ads'}`}
      />
      <div className="cw-mock__body">
        <div className="cw-mock__filters">
          <span className="cw-mock__chip cw-mock__chip--on">Meat ads</span>
          <span className="cw-mock__chip">Produce</span>
          <span className="cw-mock__chip">Latino grocery</span>
        </div>
        {low && (
          <div className="cw-mock__callout">
            <span className="cw-mock__callout-label">Lowest meat ad</span>
            <strong>
              {low.merchant} · {cleanPrice(low.price)}
            </strong>
            <span>{cleanName(low.item)}</span>
          </div>
        )}
        <div className="cw-mock__deal-grid">
          {deals.deals.map((deal, i) => (
            <article key={`${deal.merchant}-${deal.item}`} className="cw-mock__deal" style={{ '--d': `${i * 0.09}s` }}>
              <span className="cw-mock__deal-tag">{deal.tag}</span>
              <strong>{cleanName(deal.item)}</strong>
              <span className="cw-mock__deal-merchant">{deal.merchant}</span>
              <span className="cw-mock__deal-price">{cleanPrice(deal.price)}</span>
            </article>
          ))}
        </div>
        <div className="cw-mock__scan">
          <span className="cw-mock__scan-line" />
          Thursday ad scan · {deals.scanNote?.replace(/^Ad scan ·\s*/i, '') || 'merchants'}
        </div>
      </div>
    </div>
  )
}

function ScenePricing({ active }) {
  const { pricing, pulse } = D
  const hot = pricing.rows.find((r) => String(r.gap).startsWith('-'))
  return (
    <div className={`cw-mock__scene cw-mock__scene--pricing${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Shelf vs ads" subtitle={`${pulse.market} · category avg vs ad median`} />
      <div className="cw-mock__body">
        {hot && (
          <div className="cw-mock__callout cw-mock__callout--warn">
            <span className="cw-mock__callout-label">Gap</span>
            <strong>
              {hot.item} is {hot.gap} vs market
            </strong>
            <span>
              Shelf {hot.shelf} · nearby {hot.market}
            </span>
          </div>
        )}
        <div className="cw-mock__table-wrap">
          <table className="cw-mock__table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Your avg</th>
                <th>Ad median</th>
                <th>Gap</th>
              </tr>
            </thead>
            <tbody>
              {pricing.rows.map((row, i) => (
                <tr key={row.item} style={{ '--d': `${i * 0.08}s` }}>
                  <td>{row.item}</td>
                  <td>{row.shelf}</td>
                  <td>{row.market}</td>
                  <td
                    className={
                      String(row.gap).startsWith('-')
                        ? 'cw-mock__gap'
                        : String(row.gap).startsWith('+')
                          ? 'cw-mock__gap cw-mock__gap--ok'
                          : 'cw-mock__gap'
                    }
                  >
                    {row.gap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="cw-mock__insight">{pricing.insight}</div>
      </div>
    </div>
  )
}

function SceneCustomers({ active }) {
  const { customers, pulse } = D
  const champs = customers.rfm.find((t) => /champion/i.test(t.label))
  return (
    <div className={`cw-mock__scene cw-mock__scene--customers${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Customers · RFM" subtitle={`${pulse.market} · loyalty tiers`} />
      <div className="cw-mock__body">
        <div className="cw-mock__rfm">
          {customers.rfm.map((t, i) => (
            <span
              key={t.label}
              className={`cw-mock__rfm-pill${/new/i.test(t.label) ? ' cw-mock__rfm-pill--muted' : ''}`}
            >
              {t.label.split('(')[0].trim()} · {t.count}
            </span>
          ))}
        </div>
        {champs && (
          <div className="cw-mock__callout">
            <span className="cw-mock__callout-label">Champions</span>
            <strong>{champs.count} shoppers · 11+ visits</strong>
            <span>Top spend and visit rhythm for outreach lists.</span>
          </div>
        )}
        <div className="cw-mock__table-wrap">
          <table className="cw-mock__table">
            <thead>
              <tr>
                <th>Shopper</th>
                <th>Visits</th>
                <th>Spend</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {customers.rows.map((row, i) => (
                <tr key={row.name} style={{ '--d': `${i * 0.08}s` }}>
                  <td>{row.name}</td>
                  <td>{row.visits}</td>
                  <td>{row.spend}</td>
                  <td>
                    <span className={`cw-mock__tier cw-mock__tier--${String(row.tier).toLowerCase().replace(/\s+/g, '-')}`}>
                      {row.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const FORECAST_META = {
  buy: { title: 'Buy', hint: 'Up vs last week' },
  hold: { title: 'Hold', hint: 'Steady' },
  reduce: { title: 'Cut', hint: 'Cooling' },
}

function SceneForecast({ active }) {
  const { forecast, pulse } = D
  const scrub = (items) =>
    items
      .map(cleanName)
      .filter((n) => n && !/^Misc grocery$/i.test(n))
      .filter((n, i, arr) => arr.indexOf(n) === i)
      .slice(0, 4)

  const cols = [
    ['buy', scrub(forecast.buy)],
    ['hold', scrub(forecast.hold).length ? scrub(forecast.hold) : ['Crema Mexicana', 'Queso fresco', 'Corn tortillas']],
    ['reduce', scrub(forecast.reduce)],
  ]
  return (
    <div className={`cw-mock__scene cw-mock__scene--forecast${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Order guidance" subtitle={`${pulse.market} · next 7 days from POS`} />
      <div className="cw-mock__body">
        <p className="cw-mock__lede">Reorder list from POS movers for the coming week.</p>
        <div className="cw-mock__forecast-cols">
          {cols.map(([action, items], col) => (
            <div key={action} className={`cw-mock__forecast-col cw-mock__forecast-col--${action}`}>
              <header>
                <span>{FORECAST_META[action].title}</span>
                <em>{FORECAST_META[action].hint}</em>
              </header>
              <ul>
                {items.map((item, i) => (
                  <li key={item} style={{ '--d': `${col * 0.1 + i * 0.07}s` }}>
                    <span className="cw-mock__forecast-item">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="cw-mock__forecast-note">From POS movers · weather stays on the weekend playbook</div>
      </div>
    </div>
  )
}

function SceneWhatsApp({ active }) {
  const { whatsapp, pulse } = D
  return (
    <div className={`cw-mock__scene cw-mock__scene--whatsapp${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="WhatsApp → register" subtitle={`${pulse.market} · matched within 7 days`} />
      <div className="cw-mock__body">
        <div className="cw-mock__kpis">
          {whatsapp.stats.map((s) => (
            <div key={s.label} className="cw-mock__kpi">
              <span className="cw-mock__kpi-label">
                {s.label === '7-day POS' ? 'Store visits' : s.label}
              </span>
              <strong className="cw-mock__kpi-value">{s.value}</strong>
            </div>
          ))}
        </div>
        <div className="cw-mock__panel">
          <div className="cw-mock__panel-head">
            Campaigns with register hits <span className="cw-mock__panel-meta">7-day window</span>
          </div>
          <ul className="cw-mock__list">
            {whatsapp.matches.map((row, i) => (
              <li key={row.campaign} className="cw-mock__list-row" style={{ '--d': `${0.08 + i * 0.06}s` }}>
                <span className="cw-mock__list-name">{humanCampaign(row.campaign)}</span>
                <span className="cw-mock__up">{row.visits.replace('visits', 'in-store')}</span>
                <strong>{row.window}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="cw-mock__insight">
          Match = same phone at the register within 7 days of a send.
        </div>
      </div>
    </div>
  )
}

/** Map case-study clip ids → mock scene keys */
export const CW_CLIP_SCENE = {
  'sales-summary': 'pulse',
  'weekend-playbook': 'weather',
  'competitor-deals': 'deals',
  'competitive-pricing': 'pricing',
  'customers-rfm': 'customers',
  'demand-forecast': 'forecast',
  'whatsapp-crm': 'whatsapp',
}

const SCENES = {
  pulse: ScenePulse,
  weather: SceneWeather,
  deals: SceneDeals,
  pricing: ScenePricing,
  customers: SceneCustomers,
  forecast: SceneForecast,
  whatsapp: SceneWhatsApp,
}

export default function CompetitorWatchMockScreen({ scene, active }) {
  const Scene = SCENES[scene]
  if (!Scene) return null
  return <Scene active={active} />
}
