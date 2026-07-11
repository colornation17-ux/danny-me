const STORE = 'Mercado Norte'
const MARKET = 'Calhoun, GA'

const PULSE_BARS = [42, 58, 51, 72, 64, 88, 76]
const MOVERS = [
  { name: 'Pollo entero', delta: '+18%', amt: '$2,840' },
  { name: 'Arroz 20 lb', delta: '+12%', amt: '$1,120' },
  { name: 'Tortillas', delta: '-6%', amt: '$640' },
]

const WEATHER_DAYS = [
  { label: 'Today', temp: '93°', rain: '50%', push: ['Hot food', 'Grocery', 'Deli'] },
  { label: 'Sat', temp: '90°', rain: '80%', push: ['Caldo', 'Prepared', 'Deli'] },
  { label: 'Sun', temp: '88°', rain: '73%', push: ['Soup', 'Grocery', 'Snacks'] },
]

const DEALS = [
  { merchant: 'FreshMart', item: 'Pechuga sin hueso', price: '$1.99/lb', tag: 'Meat' },
  { merchant: 'Valley Foods', item: 'Carne molida 80/20', price: '$3.49/lb', tag: 'Meat' },
  { merchant: 'Super Ahorro', item: 'Chorizo casero', price: '$2.79/lb', tag: 'Deli' },
  { merchant: 'FreshMart', item: 'Aguacate Hass', price: '4 / $5', tag: 'Produce' },
]

const PRICING = [
  { item: 'Pechuga sin hueso', shelf: '$2.49', market: '$1.99', gap: '-$0.50' },
  { item: 'Carne molida', shelf: '$4.29', market: '$3.49', gap: '-$0.80' },
  { item: 'Arroz 20 lb', shelf: '$11.99', market: '$10.49', gap: '-$1.50' },
  { item: 'Queso Oaxaca', shelf: '$5.99', market: '$5.49', gap: '-$0.50' },
]

const CUSTOMERS = [
  { name: 'María G.', visits: 42, spend: '$3,840', tier: 'Champion' },
  { name: 'Carlos R.', visits: 28, spend: '$2,610', tier: 'Loyal' },
  { name: 'Ana L.', visits: 19, spend: '$1,980', tier: 'Potential' },
  { name: 'José M.', visits: 11, spend: '$940', tier: 'At risk' },
]

const FORECAST = {
  buy: ['Pechuga sin hueso', 'Arroz 20 lb', 'Caldo base'],
  hold: ['Tortillas', 'Queso fresco', 'Cilantro'],
  reduce: ['Carne asada', 'Helados', 'Paleta packs'],
}

function MockHeader({ title, subtitle }) {
  return (
    <header className="cw-mock__header">
      <div className="cw-mock__header-text">
        <h2 className="cw-mock__title">{title}</h2>
        <p className="cw-mock__subtitle">{subtitle || `${MARKET} · ${STORE}`}</p>
      </div>
      <span className="cw-mock__owner">Owner</span>
    </header>
  )
}

function ScenePulse({ active }) {
  return (
    <div className={`cw-mock__scene cw-mock__scene--pulse${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Store insights" subtitle={`${MARKET} · weekly pulse`} />
      <div className="cw-mock__body">
        <div className="cw-mock__kpis">
          <div className="cw-mock__kpi">
            <span className="cw-mock__kpi-label">Week revenue</span>
            <strong className="cw-mock__kpi-value">$46,218</strong>
            <span className="cw-mock__kpi-delta cw-mock__kpi-delta--up">+9.7%</span>
          </div>
          <div className="cw-mock__kpi">
            <span className="cw-mock__kpi-label">Avg basket</span>
            <strong className="cw-mock__kpi-value">$38.40</strong>
            <span className="cw-mock__kpi-delta cw-mock__kpi-delta--up">+4.2%</span>
          </div>
          <div className="cw-mock__kpi">
            <span className="cw-mock__kpi-label">Visits</span>
            <strong className="cw-mock__kpi-value">1,204</strong>
            <span className="cw-mock__kpi-delta">7 days</span>
          </div>
        </div>
        <div className="cw-mock__panel">
          <div className="cw-mock__panel-head">Daily sales</div>
          <div className="cw-mock__bars">
            {PULSE_BARS.map((h, i) => (
              <span
                key={i}
                className="cw-mock__bar"
                style={{ '--h': `${h}%`, '--d': `${i * 0.06}s` }}
              />
            ))}
          </div>
        </div>
        <div className="cw-mock__panel">
          <div className="cw-mock__panel-head">Top movers</div>
          <ul className="cw-mock__list">
            {MOVERS.map((row, i) => (
              <li key={row.name} className="cw-mock__list-row" style={{ '--d': `${0.2 + i * 0.08}s` }}>
                <span>{row.name}</span>
                <span className={row.delta.startsWith('+') ? 'cw-mock__up' : 'cw-mock__down'}>
                  {row.delta}
                </span>
                <strong>{row.amt}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function SceneWeather({ active }) {
  return (
    <div className={`cw-mock__scene cw-mock__scene--weather${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Weekend playbook" subtitle={`${MARKET} · rain-week targets`} />
      <div className="cw-mock__body">
        <div className="cw-mock__alert cw-mock__alert--rain">
          <span className="cw-mock__alert-icon">☔</span>
          Rain week — push comfort food, ease off grill
        </div>
        <div className="cw-mock__weather-grid">
          {WEATHER_DAYS.map((day, i) => (
            <article key={day.label} className="cw-mock__weather-card" style={{ '--d': `${i * 0.1}s` }}>
              <header>
                <strong>{day.label}</strong>
                <span>{day.temp}</span>
              </header>
              <p>{day.rain} rain</p>
              <div className="cw-mock__tags">
                {day.push.map((tag) => (
                  <span key={tag} className="cw-mock__tag cw-mock__tag--push">
                    Push {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="cw-mock__panel">
          <div className="cw-mock__panel-head">Category targets · Saturday</div>
          <div className="cw-mock__targets">
            <div className="cw-mock__target">
              <span>Hot food</span>
              <div className="cw-mock__target-bar"><span style={{ width: '78%' }} /></div>
              <strong>$48</strong>
            </div>
            <div className="cw-mock__target">
              <span>Meat</span>
              <div className="cw-mock__target-bar cw-mock__target-bar--down"><span style={{ width: '62%' }} /></div>
              <strong>$2,235</strong>
            </div>
            <div className="cw-mock__target">
              <span>Grocery</span>
              <div className="cw-mock__target-bar"><span style={{ width: '85%' }} /></div>
              <strong>$220</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SceneDeals({ active }) {
  return (
    <div className={`cw-mock__scene cw-mock__scene--deals${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Competitor deals" subtitle={`${MARKET} · 144 ads indexed`} />
      <div className="cw-mock__body">
        <div className="cw-mock__filters">
          <span className="cw-mock__chip cw-mock__chip--on">Meat winners</span>
          <span className="cw-mock__chip">Produce</span>
          <span className="cw-mock__chip">Latino grocery</span>
        </div>
        <div className="cw-mock__deal-grid">
          {DEALS.map((deal, i) => (
            <article key={`${deal.merchant}-${deal.item}`} className="cw-mock__deal" style={{ '--d': `${i * 0.09}s` }}>
              <span className="cw-mock__deal-tag">{deal.tag}</span>
              <strong>{deal.item}</strong>
              <span className="cw-mock__deal-merchant">{deal.merchant}</span>
              <span className="cw-mock__deal-price">{deal.price}</span>
            </article>
          ))}
        </div>
        <div className="cw-mock__scan">
          <span className="cw-mock__scan-line" />
          Thursday ad scan · 6 merchants
        </div>
      </div>
    </div>
  )
}

function ScenePricing({ active }) {
  return (
    <div className={`cw-mock__scene cw-mock__scene--pricing${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Shelf vs market" subtitle={`${MARKET} · checkout vs ad low`} />
      <div className="cw-mock__body">
        <div className="cw-mock__table-wrap">
          <table className="cw-mock__table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Shelf avg</th>
                <th>Market low</th>
                <th>Gap</th>
              </tr>
            </thead>
            <tbody>
              {PRICING.map((row, i) => (
                <tr key={row.item} style={{ '--d': `${i * 0.08}s` }}>
                  <td>{row.item}</td>
                  <td>{row.shelf}</td>
                  <td>{row.market}</td>
                  <td className="cw-mock__gap">{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="cw-mock__insight">
          <strong>4 items</strong> priced above local ad lows — meat basket most exposed
        </div>
      </div>
    </div>
  )
}

function SceneCustomers({ active }) {
  return (
    <div className={`cw-mock__scene cw-mock__scene--customers${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Customers & RFM" subtitle={`${MARKET} · loyalty tiers`} />
      <div className="cw-mock__body">
        <div className="cw-mock__rfm">
          <span className="cw-mock__rfm-pill">Champion 78</span>
          <span className="cw-mock__rfm-pill">Loyal 517</span>
          <span className="cw-mock__rfm-pill">Potential 314</span>
          <span className="cw-mock__rfm-pill cw-mock__rfm-pill--muted">At risk 256</span>
        </div>
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
              {CUSTOMERS.map((row, i) => (
                <tr key={row.name} style={{ '--d': `${i * 0.08}s` }}>
                  <td>{row.name}</td>
                  <td>{row.visits}</td>
                  <td>{row.spend}</td>
                  <td>
                    <span className={`cw-mock__tier cw-mock__tier--${row.tier.toLowerCase().replace(' ', '-')}`}>
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

function SceneForecast({ active }) {
  return (
    <div className={`cw-mock__scene cw-mock__scene--forecast${active ? ' cw-mock__scene--active' : ''}`}>
      <MockHeader title="Demand forecast" subtitle={`${MARKET} · Nixtla · next 7 days`} />
      <div className="cw-mock__body">
        <div className="cw-mock__forecast-cols">
          {Object.entries(FORECAST).map(([action, items], col) => (
            <div key={action} className={`cw-mock__forecast-col cw-mock__forecast-col--${action}`}>
              <header>{action}</header>
              <ul>
                {items.map((item, i) => (
                  <li key={item} style={{ '--d': `${col * 0.1 + i * 0.07}s` }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="cw-mock__forecast-note">
          POS series · weather multipliers applied · updated 03:35 AM
        </div>
      </div>
    </div>
  )
}

const SCENES = {
  pulse: ScenePulse,
  weather: SceneWeather,
  deals: SceneDeals,
  pricing: ScenePricing,
  customers: SceneCustomers,
  forecast: SceneForecast,
}

export default function CompetitorWatchMockScreen({ scene, active }) {
  const Scene = SCENES[scene]
  if (!Scene) return null
  return <Scene active={active} />
}
