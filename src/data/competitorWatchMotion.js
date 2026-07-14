/**
 * Competitor Watch motion assets — clean clips for case study (no baked chrome).
 * Drop files into public/work/competitor-watch/motion/
 */

const BASE = '/work/competitor-watch/motion'

export const CW_REEL = {
  src: `${BASE}/CompetitorWatch-Reel.mp4`,
  poster: `${BASE}/still-reel.png`,
  label: 'Competitor Watch system reel',
  durationLabel: '~31s',
}

/** Clean clips — captions live in HTML, not in the video. */
export const CW_CLIPS = [
  {
    id: 'sales-summary',
    file: 'CW-01-SalesSummary',
    n: '01',
    label: 'Sales pulse',
    job: 'Is this week good or not?',
    problem: 'Store heartbeat: revenue, orders, and movers at a glance.',
    signature: '+19.2%',
    signatureLabel: 'Week over week',
    proof: ['$46,091 week', '1,582 orders', 'Daily bars'],
    caption: 'Sales pulse: store heartbeat at a glance.',
    decision:
      'Lead with the week pulse, not a report dump; operators need a yes/no in seconds before the order call.',
  },
  {
    id: 'competitor-deals',
    file: 'CW-02-CompetitorDeals',
    n: '02',
    label: 'Competitor deals',
    job: 'What are the chains advertising?',
    problem: 'Live Flipp index with meat winners surfaced first.',
    signature: '144',
    signatureLabel: 'Ads indexed',
    proof: ['15 chains', 'Meat winners', 'ZIP markets'],
    caption: 'Competitor deals: live Flipp index, meat winners first.',
    decision:
      'Surface meat winners first: the category where independents lose weekends to mainstream and Latino competitors.',
  },
  {
    id: 'weekend-playbook',
    file: 'CW-03-WeekendPlaybook',
    n: '03',
    label: 'Weekend playbook',
    job: 'What do we push this weekend?',
    problem: 'Weather-tied category targets operators can act on.',
    signature: '↑30%',
    signatureLabel: 'Hot food lift',
    proof: ['Rain weekend', 'Push / skip', 'Category targets'],
    caption: 'Weekend playbook: weather-tied category targets.',
    decision:
      'Turn the forecast into push/skip language, not another weather widget operators ignore.',
  },
  {
    id: 'demand-forecast',
    file: 'CW-04-SalesForecast',
    n: '04',
    label: 'Demand forecast',
    job: 'How much will we sell?',
    problem:
      'Live 7-day outlook with per-SKU buy / hold / reduce (StatsForecast ensemble).',
    signature: '80%',
    signatureLabel: 'Prediction band',
    proof: ['$42.4K next week', 'Buy · Hold · Reduce', 'Live in prod'],
    caption: 'Demand forecast: live bands and buy/hold/reduce, not a fake-precise single number.',
    decision:
      'Designed for the model’s real output shape (buy / hold / reduce + bands). Shipped for that contract so the ensemble could go live and stay honest, with no fake-precise single number.',
  },
  {
    id: 'customers-rfm',
    file: 'CW-05-CustomersRetention',
    n: '05',
    label: 'Customers · RFM · Retention',
    job: 'Who are my shoppers & who’s slipping?',
    problem:
      'ML segments by RFM (recency, frequency, spend) plus next-visit predictions.',
    signature: '277',
    signatureLabel: 'Due to return',
    proof: ['1,469 customers', '5 RFM tiers', 'Win-back'],
    caption: 'Customers: RFM segments and who is due back.',
    decision:
      'Win-back starts with who is slipping, not another anonymous coupon blast.',
  },
  {
    id: 'whatsapp-crm',
    file: 'CW-06-WhatsAppCrm',
    n: '06',
    label: 'WhatsApp attribution',
    job: 'Did the outreach work?',
    problem: 'Every message matched to a POS visit within seven days, proof on the channel the store already runs.',
    signature: '2,088',
    signatureLabel: 'Attributed visits',
    proof: ['8,369 sent', '65.9% read', '7-day match'],
    caption: 'WhatsApp attribution: CRM phone → POS visit, not vanity sends.',
    decision:
      'Attribution is the product: close the loop with loyalty/Lola outreach, don’t rebuild CRM from scratch.',
  },
].map((clip) => ({
  ...clip,
  src: `${BASE}/${clip.file}.mp4`,
  poster: `${BASE}/${clip.file}.png`,
  duration: 6000,
}))

/** Case-study proof order — deals first for wow, pulse last as foundation. */
export const CW_GALLERY_ORDER = [
  'competitor-deals',
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

/** All six proofs in module number order (01→06) for deep-dives. */
export const CW_PROOF_CLIPS = [...CW_CLIPS].sort((a, b) => a.n.localeCompare(b.n))

/** @deprecated */
export const CW_HERO_CLIPS = CW_CLIPS.filter((c) =>
  ['competitor-deals', 'demand-forecast', 'whatsapp-crm'].includes(c.id),
)
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
