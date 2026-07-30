/**
 * Competitor Watch motion assets.
 * Numbers come from cwMockFixtures (frozen CW cache extract).
 */

import { CW_MOCK, CW_MOCK_META } from './cwMockFixtures'

const BASE = '/work/competitor-watch/motion'

const pulseKpi = (label) => CW_MOCK.pulse.kpis.find((k) => k.label === label)
const waStat = (label) => CW_MOCK.whatsapp.stats.find((s) => s.label === label)
const adsCount = (() => {
  const m = String(CW_MOCK.deals.subtitle || '').match(/(\d+)\s+ads/i)
  return m ? m[1] : '144'
})()
const merchantCount = (() => {
  const m = String(CW_MOCK.deals.scanNote || '').match(/(\d+)\s+merchants/i)
  return m ? m[1] : '15'
})()
const hotFoodLift = (() => {
  const t =
    CW_MOCK.weather.targets.find((x) => /hot/i.test(x.label)) ||
    CW_MOCK.weather.targets.find((x) => !x.down)
  if (!t) return '↑30%'
  if (!t.down && t.width) return `↑${Math.max(0, t.width - 70)}%`
  return t.amount || '↑30%'
})()

export const CW_REEL = {
  src: `${BASE}/CompetitorWatch-Reel.mp4`,
  poster: `${BASE}/still-reel.png`,
  label: 'Competitor Watch reel',
  durationLabel: '~31s',
}

export const CW_CLIPS = [
  {
    id: 'sales-summary',
    file: 'CW-01-SalesSummary',
    n: '01',
    label: 'Sales pulse',
    job: 'Was this week up or down?',
    problem: 'Week revenue, orders, basket, and movers on one screen.',
    signature: pulseKpi('Week revenue')?.delta || '+19.2%',
    signatureLabel: 'vs last week',
    proof: [
      `${pulseKpi('Week revenue')?.value || '$46,091'} week`,
      `${pulseKpi('Orders')?.value || '1,582'} orders`,
      CW_MOCK_META.store,
    ],
    caption: `${CW_MOCK_META.store}, ${CW_MOCK_META.market}`,
    decision: 'First screen before the Thursday order. Yes/no on the week without opening Excel.',
  },
  {
    id: 'competitor-deals',
    file: 'CW-02-CompetitorDeals',
    n: '02',
    label: 'Competitor deals',
    job: 'What are nearby chains advertising?',
    problem: `Flipp index for the home ZIP. Meat ads first. ${adsCount} ads across ${merchantCount} merchants.`,
    signature: adsCount,
    signatureLabel: 'Ads indexed',
    proof: [
      `${merchantCount} merchants`,
      CW_MOCK.deals.deals[0]?.merchant || 'ALDI',
      CW_MOCK.deals.deals[0]?.price || 'Live ads',
      CW_MOCK_META.market,
    ],
    caption: `${adsCount} ads · ${merchantCount} retailers · ${CW_MOCK_META.market}`,
    decision: 'Meat leads the list because that is where La Bodega loses weekends to chains.',
  },
  {
    id: 'weekend-playbook',
    file: 'CW-03-WeekendPlaybook',
    n: '03',
    label: 'Weekend playbook',
    job: 'What should we feature this weekend?',
    problem: '3-day weather with category targets for push and ease.',
    signature: hotFoodLift,
    signatureLabel: 'Hot food target',
    proof: [
      CW_MOCK.weather.days[0] ? `${CW_MOCK.weather.days[0].rain} rain` : 'Rain weekend',
      CW_MOCK.weather.days[0]?.push?.[0] || 'Hot food',
      CW_MOCK.weather.targets[0]?.label || 'Grocery',
    ],
    caption: CW_MOCK.weather.alert || 'Rain plan: hot food and grocery up, grill down.',
    decision: 'Writes push / ease language from the forecast so the weekend buy list is obvious.',
  },
  {
    id: 'competitive-pricing',
    file: 'CW-07-CompetitivePricing',
    ext: 'webm',
    n: '04',
    label: 'Shelf vs ads',
    job: 'Are we above the nearby ad price?',
    problem: 'Category shelf average next to market median from weekly ads.',
    signature: CW_MOCK.pricing.rows[0]?.gap || '—',
    signatureLabel: CW_MOCK.pricing.rows[0]?.item || 'Meat',
    proof: CW_MOCK.pricing.rows.slice(0, 3).map((r) => `${r.item} ${r.gap}`),
    caption: CW_MOCK.pricing.insight || 'Shelf averages vs ad medians',
    decision: 'Built for the pricing question first. Deals alone do not show the gap.',
    posterOverride: `${BASE}/CW-02-CompetitorDeals.png`,
  },
  {
    id: 'demand-forecast',
    file: 'CW-04-SalesForecast',
    n: '05',
    label: 'Order guidance',
    job: 'What should we reorder?',
    problem: 'Buy / hold / reduce from POS movers for the next week.',
    signature: 'Buy',
    signatureLabel: CW_MOCK.forecast.buy[0] || 'POS movers',
    proof: [
      `Buy · ${CW_MOCK.forecast.buy[0] || '—'}`,
      `Hold · ${CW_MOCK.forecast.hold[0] || '—'}`,
      `Reduce · ${CW_MOCK.forecast.reduce[0] || '—'}`,
    ],
    caption: 'Buy / hold / reduce from POS movers',
    decision: 'Three buckets match what the model can support. No single invented weekly total.',
  },
  {
    id: 'customers-rfm',
    file: 'CW-05-CustomersRetention',
    n: '06',
    label: 'Customers · RFM',
    job: 'Who shops here, and who is cooling off?',
    problem: 'RFM tiers from POS. Champions through new visitors.',
    signature: String(CW_MOCK.customers.rfm.find((t) => /champion/i.test(t.label))?.count ?? 65),
    signatureLabel: 'Champions',
    proof: CW_MOCK.customers.rfm.slice(0, 3).map((t) => `${t.label.split('(')[0].trim()} ${t.count}`),
    caption: `${CW_MOCK.customers.rfm.reduce((n, t) => n + (t.count || 0), 0).toLocaleString('en-US')} shoppers in RFM tiers`,
    decision: 'Win-back lists start from who already shops, then who stopped showing up.',
  },
  {
    id: 'whatsapp-crm',
    file: 'CW-06-WhatsAppCrm',
    n: '07',
    label: 'WhatsApp → register',
    job: 'Did a blast show up at the register?',
    problem: 'CRM phone matched to POS within seven days of a send.',
    signature: waStat('7-day POS')?.value || '2,086',
    signatureLabel: 'Visits matched',
    proof: [
      `${waStat('Sent')?.value || '—'} sent`,
      `${waStat('Read')?.value || '—'} read`,
      `${waStat('7-day POS')?.value || '—'} at register`,
    ],
    caption: `${CW_MOCK.whatsapp.matches[0]?.campaign || 'Campaign'} · ${CW_MOCK.whatsapp.matches[0]?.visits || 'visits'}`,
    decision: 'Visit match sits here. Message threads stay in Lola.',
  },
].map((clip) => {
  const ext = clip.ext || 'mp4'
  return {
    ...clip,
    src: `${BASE}/${clip.file}.${ext}`,
    poster: clip.posterOverride || `${BASE}/${clip.file}.png`,
    duration: 6000,
  }
})

export const CW_GALLERY_ORDER = [
  'competitor-deals',
  'competitive-pricing',
  'weekend-playbook',
  'demand-forecast',
  'customers-rfm',
  'whatsapp-crm',
  'sales-summary',
]

export function clipById(id) {
  return CW_CLIPS.find((c) => c.id === id)
}

export const CW_GALLERY_CLIPS = CW_GALLERY_ORDER.map(clipById).filter(Boolean)

export const CW_PROOF_CLIPS = [...CW_CLIPS].sort((a, b) => a.n.localeCompare(b.n))

export const CW_HERO_CLIPS = [
  'sales-summary',
  'competitor-deals',
  'competitive-pricing',
  'demand-forecast',
  'whatsapp-crm',
]
  .map((id) => CW_CLIPS.find((c) => c.id === id))
  .filter(Boolean)

export const CW_SUPPORT_CLIPS = CW_CLIPS.filter((c) =>
  ['weekend-playbook', 'customers-rfm'].includes(c.id),
)
export const CW_FOUNDATION_CLIPS = CW_CLIPS.filter((c) => c.id === 'sales-summary')

/** @deprecated use CW_GALLERY_CLIPS */
export const CW_BEATS = CW_GALLERY_CLIPS.map((c) => ({
  id: c.id,
  label: c.label,
  caption: c.proof.join(' · '),
  duration: c.duration,
  video: c.src,
  poster: c.poster,
}))
