/**
 * Single source of truth for Competitor Watch case-study numbers.
 * Derived from cwMockFixtures (frozen CW cache extract) — never hardcode elsewhere.
 */
import { CW_MOCK, CW_MOCK_META } from './cwMockFixtures'

function adsFromSubtitle(subtitle) {
  const m = String(subtitle || '').match(/(\d[\d,]*)\s+ads/i)
  return m ? m[1] : '144'
}

function merchantsFromNote(note) {
  const m = String(note || '').match(/(\d[\d,]*)\s+merchants/i)
  return m ? m[1] : '15'
}

const pulseKpi = (label) => CW_MOCK.pulse.kpis.find((k) => k.label === label)
const waStat = (label) => CW_MOCK.whatsapp.stats.find((s) => s.label === label)
const champTier = CW_MOCK.customers.rfm.find((t) => /champion/i.test(t.label))
const shopperTotal = CW_MOCK.customers.rfm.reduce((n, t) => n + (Number(t.count) || 0), 0)

export const CW_METRICS = {
  store: CW_MOCK_META.store || CW_MOCK.pulse.store,
  market: CW_MOCK_META.market || CW_MOCK.pulse.market,
  zip: (() => {
    const fromDeal = String(CW_MOCK.deals.subtitle || '').match(/\b(\d{5})\b/)
    if (fromDeal) return fromDeal[1]
    return '30701'
  })(),
  capturedAt: CW_MOCK_META.captured_at,

  weekRevenue: pulseKpi('Week revenue')?.value || '$46,091',
  weekDelta: pulseKpi('Week revenue')?.delta || '+19.2%',
  avgBasket: pulseKpi('Avg basket')?.value || '$29.13',
  orders: pulseKpi('Orders')?.value || '1,582',

  adsIndexed: adsFromSubtitle(CW_MOCK.deals.subtitle),
  merchants: merchantsFromNote(CW_MOCK.deals.scanNote),

  waSent: waStat('Sent')?.value || '—',
  waRead: waStat('Read')?.value || '—',
  waPosVisits: waStat('7-day POS')?.value || '—',

  champions: champTier ? String(champTier.count) : '65',
  shoppers: shopperTotal ? shopperTotal.toLocaleString('en-US') : '1,469',

  pricingGapLead: CW_MOCK.pricing.rows[0]?.gap || '—',
  pricingLeadCategory: CW_MOCK.pricing.rows[0]?.item || 'Meat',
  pricingInsight: CW_MOCK.pricing.insight,

  forecastBuy: CW_MOCK.forecast.buy[0] || '—',
}

/** Production signals — activity from live store / CRM, not P&L claims. */
export const CW_SIGNAL_STATS = [
  {
    value: CW_METRICS.waPosVisits,
    label: 'Register visits matched · 7 days',
    note: 'CRM phone → POS',
  },
  {
    value: CW_METRICS.waRead,
    label: 'WhatsApp read rate',
    note: 'From CRM sync sample',
  },
  {
    value: CW_METRICS.champions,
    label: 'Champion shoppers',
    note: 'RFM · 11+ visits',
  },
  {
    value: CW_METRICS.adsIndexed,
    label: 'Weekly ads indexed',
    note: `${CW_METRICS.merchants} merchants · ${CW_METRICS.market}`,
  },
]

export const CW_HERO_PROOF = `${CW_METRICS.waPosVisits} register visits matched in 7 days`

export function cwBlurb() {
  return `Solo React + Python for La Bodega’s Thursday order. Chain ads and shelf gaps, weekend weather targets, buy/hold/reduce from POS, WhatsApp matched to the register (${CW_METRICS.waPosVisits} visits in 7 days). Guest chat stays in Lola.`
}
