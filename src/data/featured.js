import { work } from './projects'

const bySlug = Object.fromEntries(work.map((p) => [p.slug, p]))

/**
 * Homepage featured strip — Nudge-style ordered showcase.
 * Edge AI lives in Play; shown here as a concept card.
 */
export const featured = [
  {
    ...bySlug['competitor-watch'],
    index: '01',
    displayTitle: 'Competitor Watch',
    folderDate: 'Jun 10, 2026',
    outcome: '2,088 attributed visits · +19.2% WoW — store intelligence dashboard',
    tags: ['Retail ops', 'AI'],
    reel: '/work/competitor-watch/motion/CompetitorWatch-Reel.mp4',
    folderFill: '#166534',
    folderInk: '#ffffff',
  },
  {
    ...bySlug['lola'],
    index: '02',
    displayTitle: 'Lola',
    folderDate: 'Jun 28, 2026',
    outcome: '97.7% of bot replies under 2 min · conversational AI for La Bodega',
    blurb: 'Guests ask, order, and get handed to staff — all on the WhatsApp thread ~1,200 loyalty families already use. Built from 180 real threads before a single flow shipped.',
    tags: ['Conversational AI', 'WhatsApp'],
    reel: '/work/lola/motion/Lola-Reel.mp4',
    href: 'https://la-bodega-lola.vercel.app/',
    folderFill: '#7C3AED',
    folderInk: '#ffffff',
    folderTitleFont: 'pixelify',
  },
  {
    ...bySlug['bodega-ops'],
    index: '03',
    displayTitle: 'La Bodega',
    folderDate: 'Feb 24, 2026',
    tags: ['Service Design', 'Ops'],
  },
  {
    ...bySlug['code19'],
    index: '04',
    displayTitle: 'CODE19 Racing',
    folderDate: 'Dec 2024',
    tags: ['Web', 'Brand'],
    folderFill: '#111212',
    folderInk: '#ffffff',
  },
  {
    ...bySlug['wing-hmi'],
    index: '05',
    displayTitle: 'Wing Automotive HMI',
    folderDate: 'Aug 18, 2025',
    outcome: '92% task success rate · mission-control HMI for premium smart vehicles',
    tags: ['HMI', 'AI', 'Concept'],
    folderFill: '#EA580C',
    folderInk: '#ffffff',
  },
  {
    ...bySlug['edge-ai'],
    index: '06',
    displayTitle: 'WING Edge AI',
    folderDate: 'Nov 4, 2025',
    outcome: 'Target: <20ms edge latency — privacy-first AI for mission-critical vehicle decisions',
    tags: ['Edge AI', 'Mobility', 'Concept'],
    folderFill: '#0891B2',
    folderInk: '#ffffff',
  },
]
