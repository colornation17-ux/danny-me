/**
 * Pulls a slim, privacy-safe fixture set from Competitor Watch local caches
 * into src/data/cwMockFixtures.js for stable case-study mocks.
 *
 * Source of truth (CW repo):
 *   data/portfolio_snapshot.json  — frozen /api/data + forecast
 *   data/weather_cache.json       — NWS playbook days (fresher labels)
 *   data/crm_attribution.json     — aggregate WhatsApp stats only (no phones)
 *   frontend demo libs            — fallbacks when snapshot facts are empty
 *
 * Usage: node scripts/extract-cw-mock-fixtures.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CW_ROOT = path.resolve(__dirname, '../../competitor-watch')
const OUT = path.resolve(__dirname, '../src/data/cwMockFixtures.js')

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function money(n, digits = 0) {
  if (n == null || Number.isNaN(Number(n))) return '—'
  return (
    '$' +
    Number(n).toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  )
}

function pct(n, digits = 1) {
  if (n == null || Number.isNaN(Number(n))) return '—'
  const v = Number(n)
  return `${v > 0 ? '+' : ''}${v.toFixed(digits)}%`
}

function titleCase(s) {
  return String(s || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const snap = readJson(path.join(CW_ROOT, 'data/portfolio_snapshot.json'))
const weatherLive = readJson(path.join(CW_ROOT, 'data/weather_cache.json'))
const a = snap.api_data || {}
const fc = snap.forecast || {}
const facts = a.facts || {}

// Demo fallbacks (same shapes as CW frontend demo libs)
const DEMO_PULSE = {
  pulse: {
    last_7_days: { revenue: 53880, orders: 1624, avg_basket: 33.15 },
    wow_revenue_pct: 9.7,
    wow_avg_basket_pct: 7.2,
  },
  daily_sales: [
    { label: 'Sun 05/25', revenue: 8120 },
    { label: 'Mon 05/26', revenue: 6240 },
    { label: 'Tue 05/27', revenue: 6980 },
    { label: 'Wed 05/28', revenue: 7120 },
    { label: 'Thu 05/29', revenue: 7340 },
    { label: 'Fri 05/30', revenue: 9680 },
    { label: 'Sat 05/31', revenue: 8420 },
  ],
  product_movers: {
    rising: [
      { name: 'El Milagro Corn Tortillas', recent_revenue: 2840, change_pct: 17.8 },
      { name: 'Carne Asada (thin cut)', recent_revenue: 4120, change_pct: 12.0 },
    ],
    falling: [{ name: 'Store-brand rice 20lb', recent_revenue: 620, change_pct: -26.2 }],
  },
}

const DEMO_CUSTOMERS = {
  rfm: [
    { label: 'Champion (11+)', count: 44 },
    { label: 'Loyal (4–10)', count: 168 },
    { label: 'Returning (2–3)', count: 498 },
    { label: 'New (1 visit)', count: 1132 },
  ],
  rows: [
    { name: 'C-•••4821', visits: 18, spend: '$1,248', tier: 'Champion' },
    { name: 'C-•••9034', visits: 14, spend: '$986', tier: 'Champion' },
    { name: 'C-•••7712', visits: 11, spend: '$842', tier: 'Loyal' },
    { name: 'C-•••3389', visits: 9, spend: '$715', tier: 'Loyal' },
  ],
}

const DEMO_OUTREACH = {
  stats: [
    { label: 'Sent', value: '842' },
    { label: 'Read', value: '73%' },
    { label: '7-day POS', value: '96' },
  ],
  matches: [
    { campaign: 'Weekend caldo push', visits: '+142 visits', window: '7d' },
    { campaign: 'At-risk win-back', visits: '+89 visits', window: '7d' },
    { campaign: 'Meat special blast', visits: '+61 visits', window: '7d' },
  ],
}

const DEMO_FORECAST = {
  buy: ['El Milagro Corn Tortillas 30ct', 'Carne Asada thin cut', 'Jarritos Mandarin 12pk', 'Cilantro bunch'],
  hold: ['Whole chicken fryer', 'Crema Mexicana', 'Queso fresco', 'Store rice 20lb'],
  reduce: ['Ice cream novelty', 'Grill pack seasonal', 'Paleta packs', 'Frozen dessert trays'],
}

// ── Pulse ──────────────────────────────────────────────────────────
const pulseRaw = facts.store_pulse?.has_date_data ? facts.store_pulse : DEMO_PULSE.pulse
const daily = (facts.daily_sales?.length ? facts.daily_sales : DEMO_PULSE.daily_sales).slice(-7)
const movers = facts.product_movers?.has_data ? facts.product_movers : DEMO_PULSE.product_movers
const maxRev = Math.max(...daily.map((d) => d.revenue || 0), 1)

const loc = fc.location || {}
const store = a.store_name || 'La Bodega'
const market =
  [loc.city, loc.state].filter(Boolean).join(', ') ||
  [facts.city, facts.state].filter(Boolean).join(', ') ||
  (a.primary_zip ? `ZIP ${a.primary_zip}` : 'Calhoun, GA')

const risingClean = (movers.rising || [])
  .filter((r) => r.change_pct != null && Number.isFinite(Number(r.change_pct)))
  .slice(0, 2)
const fallingClean = (movers.falling || [])
  .filter((r) => r.change_pct != null && Number.isFinite(Number(r.change_pct)))
  .slice(0, 1)
const risingFallback = (movers.rising || []).slice(0, 2)
const fallingFallback = (movers.falling || []).slice(0, 1)

const pulse = {
  store,
  market,
  kpis: [
    {
      label: 'Week revenue',
      value: money(pulseRaw.last_7_days?.revenue),
      delta: pct(pulseRaw.wow_revenue_pct),
      up: (pulseRaw.wow_revenue_pct || 0) >= 0,
    },
    {
      label: 'Avg basket',
      value: money(pulseRaw.last_7_days?.avg_basket, 2),
      delta: pct(pulseRaw.wow_avg_basket_pct),
      up: (pulseRaw.wow_avg_basket_pct || 0) >= 0,
    },
    {
      label: 'Orders',
      value: Number(pulseRaw.last_7_days?.orders ?? 0).toLocaleString('en-US'),
      delta: '7 days',
      up: null,
    },
  ],
  bars: daily.map((d) => Math.round(((d.revenue || 0) / maxRev) * 100)),
  movers: [
    ...(risingClean.length ? risingClean : risingFallback).map((r) => ({
      name: r.name,
      delta: r.change_pct != null ? pct(r.change_pct) : r.change_label || 'New',
      amt: money(r.recent_revenue),
      up: true,
    })),
    ...(fallingClean.length ? fallingClean : fallingFallback).map((r) => ({
      name: r.name,
      delta: r.change_pct != null ? pct(r.change_pct) : r.change_label || '—',
      amt: money(r.recent_revenue),
      up: false,
    })),
  ].slice(0, 3),
}

// ── Weather ────────────────────────────────────────────────────────
const weatherDays = (fc.weather_days?.length ? fc.weather_days : weatherLive.days || []).slice(0, 3)
const targetDay =
  (fc.targets?.days || []).find((d) => /sat|sun|weekend/i.test(d.label || d.dow || '')) ||
  (fc.targets?.days || [])[0] ||
  null
const targetCats = targetDay?.categories || []
let targetRows = targetCats.slice(0, 3).map((t) => {
  const mult = Number(t.multiplier || 1)
  return {
    label: t.label || titleCase(t.key),
    width: Math.min(100, Math.round(Math.abs(mult) * 70)),
    down: mult < 1,
    amount: t.target != null ? money(t.target) : `${mult.toFixed(2)}×`,
  }
})

const weather = {
  alert:
    weatherDays[0]?.playbook_note ||
    'Rain day — push caldo/soup, prepared hot food, comfort groceries; ease off grill items.',
  days: weatherDays.map((d) => ({
    label: d.label,
    temp: d.temp_high_f != null ? `${d.temp_high_f}°` : '—',
    rain: d.rain_prob_pct != null ? `${d.rain_prob_pct}%` : '—',
    push: (d.push_categories || []).slice(0, 3).map((c) => titleCase(c)),
  })),
  targets: targetRows.length
    ? targetRows
    : [
        { label: 'Hot Food', width: 91, down: false, amount: '1.3×' },
        { label: 'Grocery', width: 80, down: false, amount: '1.15×' },
        { label: 'Meat', width: 63, down: true, amount: '0.9×' },
      ],
  targetHead: `Category targets · ${targetDay?.label || targetDay?.dow || weatherDays[0]?.label || 'Weekend'}`,
}

// ── Deals ──────────────────────────────────────────────────────────
const byCat = a.deals_by_category || {}
const dealPool = []
for (const [cat, deals] of Object.entries(byCat)) {
  for (const d of deals || []) {
    dealPool.push({
      merchant: d.merchant || 'Retailer',
      item: d.name || d.product || d.title || 'Item',
      price:
        d.price_text ||
        (d.price != null
          ? `$${Number(d.price).toFixed(2)}${d.unit ? `/${d.unit}` : ''}`
          : '—'),
      tag: titleCase(cat),
    })
  }
}
const meatFirst = [
  ...dealPool.filter((d) => /meat|carne|pollo|beef|chicken|chorizo|pork/i.test(`${d.tag} ${d.item}`)),
  ...dealPool,
]
const seen = new Set()
const deals = []
for (const d of meatFirst) {
  const k = `${d.merchant}|${d.item}`
  if (seen.has(k)) continue
  seen.add(k)
  deals.push(d)
  if (deals.length >= 6) break
}
const merchantCount = (a.merchants || []).length
const adsIndexed = Object.values(byCat).reduce((n, arr) => n + (arr?.length || 0), 0)

const dealsScene = {
  subtitle: `${market} · ${merchantCount || '—'} retailers · ${adsIndexed} ads`,
  deals,
  scanNote: `Ad scan · ${merchantCount} merchants`,
}

// ── Pricing (category shelf avg vs market low from snapshot) ───────
const priceCompList = Array.isArray(a.price_comparison)
  ? a.price_comparison
  : a.price_comparison?.items || a.price_comparison?.rows || []
let pricingRows = priceCompList.slice(0, 6).map((r) => {
  const shelf = r.own_avg ?? r.your_price ?? r.shelf
  // Prefer median — category avg vs /lb deal low is not apples-to-apples
  const marketRef = r.market?.median ?? r.market?.low ?? r.market_low ?? r.market
  let gap = '—'
  if (shelf != null && marketRef != null) {
    const diff = Number(shelf) - Number(marketRef)
    gap = `${diff > 0 ? '-' : diff < 0 ? '+' : ''}$${Math.abs(diff).toFixed(2)}`
  }
  return {
    item: r.label || titleCase(r.key),
    shelf: shelf != null ? `$${Number(shelf).toFixed(2)}` : '—',
    market: marketRef != null ? `$${Number(marketRef).toFixed(2)}` : '—',
    gap,
  }
})

if (!pricingRows.length && deals.length) {
  pricingRows = deals.slice(0, 6).map((d) => {
    const m = parseFloat(String(d.price).replace(/[^0-9.]/g, ''))
    if (!Number.isFinite(m)) {
      return { item: d.item, shelf: '—', market: d.price, gap: '—' }
    }
    const shelf = m * 1.12
    return {
      item: d.item,
      shelf: `$${shelf.toFixed(2)}`,
      market: `$${m.toFixed(2)}`,
      gap: `-$${(shelf - m).toFixed(2)}`,
    }
  })
}

const aboveCount = pricingRows.filter((r) => String(r.gap).startsWith('-')).length
const pricing = {
  rows: pricingRows,
  insight: pricingRows.length
    ? `${aboveCount} categories above market median ad price`
    : 'Shelf vs nearby weekly ads',
}

// ── Customers (masked ids only — never store raw phones/names) ─────
const ca = facts.customer_analytics || {}
const tiers = ca.loyalty_tiers || []
const topCust = (ca.top_customers || []).slice(0, 4)

const customers = {
  rfm: tiers.length
    ? tiers.map((t) => ({ label: t.label || titleCase(t.key), count: t.count }))
    : DEMO_CUSTOMERS.rfm,
  rows: topCust.length
    ? topCust.map((c) => ({
        name: c.id_masked || 'Shopper',
        visits: c.orders ?? c.visits ?? '—',
        spend: money(c.spend),
        tier: c.tier || 'Loyal',
      }))
    : DEMO_CUSTOMERS.rows,
}

// ── Forecast from merchandising heroes + product movers ────────────
const merch = facts.merchandising || {}
const heroSkus = (merch.skus || [])
  .filter((s) => /A/i.test(s.abc_tier || s.tier || s.abc || '') || s.hero)
  .slice(0, 4)
  .map((s) => s.name || s.sku)
const fallingNames = (movers.falling || []).slice(0, 4).map((r) => r.name)
const risingNames = (movers.rising || [])
  .filter((r) => r.change_pct != null)
  .slice(0, 4)
  .map((r) => r.name)
const topProducts = (facts.top_products || []).map((p) => p.name).filter(Boolean)
const holdNames = topProducts
  .filter((n) => !risingNames.includes(n) && !fallingNames.includes(n))
  .slice(3, 7)

const forecast = {
  buy: (risingNames.length ? risingNames : heroSkus).slice(0, 4).length
    ? (risingNames.length ? risingNames : heroSkus).slice(0, 4)
    : DEMO_FORECAST.buy,
  hold: holdNames.length ? holdNames.slice(0, 4) : DEMO_FORECAST.hold,
  reduce: fallingNames.length ? fallingNames.slice(0, 4) : DEMO_FORECAST.reduce,
  note: `POS movers · ${merch.meta?.anchor_date || snap.captured_at || 'snapshot'}`,
}

// ── WhatsApp (aggregates + campaign names only — no phones) ────────
let whatsapp = { ...DEMO_OUTREACH }
try {
  const crm = readJson(path.join(CW_ROOT, 'data/crm_attribution.json'))
  const s = crm.summary || {}
  const records = Array.isArray(crm.records) ? crm.records : []
  let read = 0
  const sampleN = Math.min(records.length, 8000)
  for (let i = 0; i < sampleN; i++) {
    if (records[i]?.read) read++
  }
  const readRate = sampleN ? (read / sampleN) * 100 : null
  const sent = crm.record_count ?? records.length
  const visited = s.pos_visit_attributed

  whatsapp = {
    stats: [
      { label: 'Sent', value: sent != null ? Number(sent).toLocaleString('en-US') : '—' },
      { label: 'Read', value: readRate != null ? `${readRate.toFixed(1)}%` : '—' },
      {
        label: '7-day POS',
        value: visited != null ? Number(visited).toLocaleString('en-US') : '—',
      },
    ],
    matches: DEMO_OUTREACH.matches,
  }

  const by = {}
  for (const r of records) {
    const c = r.campaign || 'Campaign'
    if (!by[c]) by[c] = { campaign: c, visits: 0 }
    if (r.pos_visit_7d || r.visited_store) by[c].visits++
  }
  const topCamps = Object.values(by)
    .filter((c) => c.visits > 0)
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5)
  if (topCamps.length) {
    whatsapp.matches = topCamps.map((c) => ({
      campaign: c.campaign,
      visits: `+${c.visits} visits`,
      window: `${crm.visit_window_days || 7}d`,
    }))
  }
} catch {
  /* keep demo */
}

const fixture = {
  meta: {
    captured_at: snap.captured_at || null,
    store,
    market,
    source: 'competitor-watch/data (portfolio_snapshot + weather/crm caches)',
    extracted_at: new Date().toISOString().slice(0, 10),
  },
  pulse,
  weather,
  deals: dealsScene,
  pricing,
  customers,
  forecast,
  whatsapp,
}

const body = `/** Auto-generated from Competitor Watch local caches — do not edit by hand.
 *  Regenerate: node scripts/extract-cw-mock-fixtures.mjs
 *  Captured: ${fixture.meta.captured_at || 'unknown'} · extracted ${fixture.meta.extracted_at}
 */
export const CW_MOCK_META = ${JSON.stringify(fixture.meta, null, 2)}

export const CW_MOCK = ${JSON.stringify(
  {
    pulse: fixture.pulse,
    weather: fixture.weather,
    deals: fixture.deals,
    pricing: fixture.pricing,
    customers: fixture.customers,
    forecast: fixture.forecast,
    whatsapp: fixture.whatsapp,
  },
  null,
  2,
)}
`

fs.writeFileSync(OUT, body, 'utf8')
console.log('Wrote', OUT)
console.log('deals', deals.length, 'pricing', pricingRows.length, 'pulse bars', pulse.bars.length)
console.log('store', store, 'market', market, 'ads', adsIndexed)
