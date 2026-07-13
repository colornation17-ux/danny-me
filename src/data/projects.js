/** Work = curated flagship. Play = side quests. Keep Work ≤ 6. */

export const work = [
  {
    slug: 'lola',
    outcome: 'WhatsApp AI that runs the weekly shop',
    title: 'Lola',
    meta: 'La Bodega · Shipped 2026',
    status: 'Shipped',
    year: '2026',
    domain: 'Conversational AI',
    layer: 'Engagement layer',
    blurb:
      'Bilingual assistant on the thread ~1,200 loyalty families already use — flyer Q&A, voice + text, pickup orders, and staff handoff. The channel Competitor Watch later attributes.',
    role: 'Design technologist',
    timeline: 'May – Jun 2026',
    team: 'Solo design & build',
    skills: ['Conversation design', 'Service design', 'WhatsApp UX', 'EN/ES copy'],
    accent: '#1FA97A',
    liveUrl: 'https://la-bodega-lola.vercel.app/',
    cover: '/work/lola/journey.png',
    hero: '/work/lola/service.png',
    gallery: [
      { src: '/work/lola/portrait.png', caption: 'Lola — the face of the weekly thread' },
      { src: '/work/lola/store.png', caption: 'Store-grounded broadcast art' },
    ],
    layout: 'character',
    sections: [
      {
        eyebrow: 'Overview',
        title: 'Engagement on the thread families already use',
        body: 'La Bodega is an independent Hispanic grocer in Calhoun, GA. Its weekly WhatsApp flyer reaches ~1,200 loyalty families, but replies turn into English, Spanish, voice notes, SNAP questions, and pickup lists inside one staff inbox. Lola is the engagement layer — converse, order, hand off — not the planning dashboard.',
      },
      {
        eyebrow: 'Problem',
        title: 'The broadcast worked. The inbox couldn’t keep up.',
        body: 'Weekly deal texts created demand. Replies came back as bilingual text, voice notes, and pickup-order requests — faster than staff could answer during rush.',
      },
      {
        eyebrow: 'Opportunity',
        title: 'Weekly marketing could become an ordering channel',
        body: 'If Lola can answer flyer questions instantly and turn messy replies into structured pickup requests, the broadcast becomes more than marketing — it becomes a way to order without downloading a new app.',
      },
      {
        eyebrow: 'Solution',
        title: 'Six flows on the thread families already use',
        body: 'Grounded answers from this week’s flyer. Tap-first pickup lists. Voice notes that follow the same order path as text. Hard asks escalate to humans — Lola steps back.',
      },
      {
        eyebrow: 'Outcomes',
        title: 'Live in production with a staff dashboard',
        body: 'Families stay on the weekly thread. Repeat questions (hours, SNAP, deals) resolve in chat. Pickup lists reach staff before the customer walks in. Voice works like text. Competitor Watch later closes the loop by attributing visits to this same channel.',
        metrics: [
          { value: '~1,200', label: 'Loyalty families on the blast' },
          { value: 'EN / ES', label: 'One language per reply' },
          { value: 'Live', label: 'WhatsApp + staff dashboard' },
        ],
      },
      {
        eyebrow: 'What I learned',
        title: 'Ship the handoff, not just the bot',
        body: 'Conversation craft only works when staff ops are designed with it. Lock-screen alerts, quote flows, and clear escalation rules mattered as much as the agent prompts.',
      },
    ],
  },
  {
    slug: 'competitor-watch',
    outcome: 'Decision support for the Thursday merchandising call',
    title: 'Competitor Watch',
    meta: 'La Bodega · Shipped 2026',
    status: 'Shipped',
    year: '2026',
    domain: 'Retail ops',
    layer: 'Intelligence layer',
    blurb:
      'Competitor benchmarks, weather playbooks, and demand forecasts in one place — so one store plans weekend promos like a chain, then proves WhatsApp outreach with visit attribution.',
    role: 'Product design · UX/IA · Full-stack',
    timeline: '2 weeks · MVP → production',
    team: 'Solo',
    skills: ['Product design', 'Service design', 'React', 'Python'],
    accent: '#166534',
    liveUrl: 'https://competitor-watch-1.onrender.com',
    cover: '/work/competitor-watch/motion/CW-02-CompetitorDeals.png',
    hero: '/work/competitor-watch/motion/CW-02-CompetitorDeals.png',
    layout: 'product',
    caseStudyBody: 'competitor-watch',
    sections: [],
  },
  {
    slug: 'bodega-ops',
    outcome: 'Checkout from 5 minutes to under 30 seconds',
    title: 'Bodega Ops',
    meta: 'La Bodega · Shipped 2026',
    status: 'Shipped',
    year: '2026',
    domain: 'Service design',
    blurb:
      'Stabilized a live retail launch — product onboarding stage, barcode normalization, SKU recognition 60% → 100%.',
    role: 'Service designer',
    timeline: '1 week · launch recovery',
    team: 'With store ops',
    skills: ['Service design', 'Systems', 'Operational recovery'],
    accent: '#E8A030',
    sections: [
      {
        eyebrow: 'Overview',
        title: 'Structural recovery of a live retail launch',
        body: 'La Bodega opened as a 25,000 sq ft hybrid grocery and restaurant. On day one, roughly 40% of SKUs failed at checkout — price disputes, unattributable revenue, and 2–5 minute lookups on live lanes.',
      },
      {
        eyebrow: 'Problem',
        title: 'Inventory entered the system at checkout, not at receiving',
        body: 'No product onboarding stage. No governance. Products billed as miscellaneous. Every terminal shared the same broken database — grocery and restaurant billing failed together.',
      },
      {
        eyebrow: 'Solution',
        title: 'Insert the missing stage before the shelf',
        body: 'Mandatory product onboarding before shelving. Barcode normalization pipeline. Role ownership and a weekly governance cadence so recognition didn’t rot after the fix.',
      },
      {
        eyebrow: 'Outcomes',
        title: 'Stabilized in 72 hours',
        body: 'SKU recognition restored. Margins measurable per SKU. Checkout without lookup stalls. Product master established with clear ownership.',
        metrics: [
          { value: '60% → 100%', label: 'SKU recognition' },
          { value: '<30 sec', label: 'Checkout time' },
          { value: '72 hrs', label: 'To stabilize' },
        ],
      },
      {
        eyebrow: 'What I learned',
        title: 'Service design is product design when the floor is on fire',
        body: 'The interface wasn’t a screen — it was the path from truck to shelf to register. Fix the stage that was missing, not the symptom at the till.',
      },
    ],
  },
  {
    slug: 'wing-hmi',
    outcome: 'Mission-control HMI for premium smart vehicles',
    title: 'Wing HMI',
    meta: 'Wing · Concept 2025',
    status: 'Concept',
    year: '2025',
    domain: 'Automotive HMI',
    blurb:
      'Next-gen in-vehicle experience inspired by interplanetary mission control — built for younger, tech-driven buyers.',
    role: 'Product design · HMI',
    timeline: '2025',
    team: 'Design exploration',
    skills: ['HMI', 'UX/UI', 'AI personalization'],
    accent: '#7C5CFF',
    sections: [
      {
        eyebrow: 'Overview',
        title: 'An HMI that feels like mission control, not a tablet glued to a dash',
        body: 'Wing needed a premium smart-vehicle interface for buyers who expect intelligence and immersion — without drowning the driver in chrome.',
      },
      {
        eyebrow: 'Problem',
        title: 'Automotive UI still copies phone patterns',
        body: 'Dense menus, shallow hierarchy, and little sense of system state. Drivers need glanceable status, not app-drawer thinking at highway speed.',
      },
      {
        eyebrow: 'Approach',
        title: 'Borrow from mission-control information design',
        body: 'Prioritize system status, spatial hierarchy, and calm motion. Pair the HMI concept with on-device Edge AI personalization — instant decisions, data that stays in the car.',
      },
      {
        eyebrow: 'Outcome',
        title: 'A direction for next-gen mobility UX',
        body: 'Concept system spanning cabin HMI and companion Edge platform — positioning Wing for younger buyers who want intelligence without surveillance theater.',
      },
      {
        eyebrow: 'What I learned',
        title: 'Glanceability is a constraint, not a style',
        body: 'Every pixel competes with the road. Hierarchy and motion have to earn their keep under real driving load.',
      },
    ],
  },
  {
    slug: 'code19',
    outcome: 'Digital platform that helped unlock $350K seed',
    title: 'CODE19 Racing',
    meta: 'CODE19 · Shipped 2024–25',
    status: 'Shipped',
    year: '2025',
    domain: 'Brand + product',
    blurb:
      'Redesigned the racing team’s digital platform — +70% pre-race engagement, +25% sponsorship interest.',
    role: 'Product / web design',
    timeline: '2024–25 season',
    team: 'With CODE19',
    skills: ['Web design', 'Content strategy', 'SEO'],
    accent: '#E11D48',
    cover: '/work/code19/hero.jpg',
    hero: '/work/code19/hero.jpg',
    layout: 'photo',
    sections: [
      {
        eyebrow: 'Overview',
        title: 'A digital home worthy of a race weekend',
        body: 'CODE19 needed a platform that converted fans and sponsors — not a brochure site that went quiet between events.',
      },
      {
        eyebrow: 'Problem',
        title: 'Energy on track, silence online',
        body: 'Pre-race moments weren’t captured. Sponsorship stories were hard to find. The site didn’t match the ambition of an AI-driven fan experience.',
      },
      {
        eyebrow: 'Solution',
        title: 'Content, structure, and performance as one system',
        body: 'Rebuilt information architecture, race storytelling, and SEO so fans could follow the season and sponsors could see proof.',
      },
      {
        eyebrow: 'Outcomes',
        title: 'Engagement and funding moved together',
        body: 'Pre-race engagement and sponsorship interest rose; the platform supported a $350K increase in seed funding.',
        metrics: [
          { value: '+70%', label: 'Pre-race engagement' },
          { value: '+25%', label: 'Sponsorship interest' },
          { value: '$350K', label: 'Seed funding lift' },
        ],
      },
      {
        eyebrow: 'What I learned',
        title: 'Fans and sponsors read different stories on the same page',
        body: 'One platform has to serve emotion and due diligence. Structure is how you do both without splitting the brand.',
      },
    ],
  },
  {
    slug: 'timely-ne',
    outcome: 'AI video creation without leaving Premiere',
    title: 'Timely-ne',
    meta: 'Personal · Concept 2025',
    status: 'Concept',
    year: '2025',
    domain: 'Creative tools',
    blurb:
      'Multi-modal generative video plugin for Premiere Pro — create on the timeline instead of bouncing between tools.',
    role: 'Product design · Front-end',
    timeline: '2025',
    team: 'Solo',
    skills: ['Product design', 'Plugin UX', 'Generative AI'],
    accent: '#0D9488',
    sections: [
      {
        eyebrow: 'Overview',
        title: 'Generative video where editors already work',
        body: 'Editors lose flow switching between generative tools and the NLE. Timely-ne keeps multi-modal generation on the Premiere timeline.',
      },
      {
        eyebrow: 'Problem',
        title: 'Context dies at the export boundary',
        body: 'Prompting in a separate app means losing sequence context, timing, and the edit decision already made on the timeline.',
      },
      {
        eyebrow: 'Solution',
        title: 'A plugin that respects editorial rhythm',
        body: 'Generate, iterate, and place clips in-timeline. Multi-modal inputs meet Premiere’s existing selection and mark language.',
      },
      {
        eyebrow: 'Outcome',
        title: 'A direction for AI that stays in the craft tool',
        body: 'Concept and prototype for editors who want generative speed without abandoning professional workflow.',
      },
      {
        eyebrow: 'What I learned',
        title: 'AI features inherit the host app’s mental model',
        body: 'If the plugin fights Premiere’s verbs, editors won’t adopt it — no matter how good the model is.',
      },
    ],
  },
]

export const play = [
  {
    slug: 'edge-ai',
    title: 'Wing Edge AI',
    blurb: 'On-device personalization for next-gen mobility.',
    meta: 'Concept · 2025',
  },
  {
    slug: 'loom',
    title: 'Loom Design System',
    blurb: 'Multiplatform DS for CODE19.ai’s digital identity.',
    meta: 'Design systems · 2025',
  },
  {
    slug: 'ocusync',
    title: 'Ocusync',
    blurb: 'CRM inside the NLE for video production workflows.',
    meta: 'Product · 2024',
  },
  {
    slug: 'stutax',
    title: 'StuTax',
    blurb: 'Tax filing SaaS for international students in the US.',
    meta: 'UI/UX · 2024',
  },
  {
    slug: 'branding',
    title: 'Race season branding',
    blurb: '2024–25 CODE19 brand and marketing collateral.',
    meta: 'Graphic design',
  },
  {
    slug: 'motion',
    title: 'Motion & cinema',
    blurb: 'Motion graphics, cinematography, and product mockups.',
    meta: 'Playground',
  },
]

export const projects = work

export function getProjectBySlug(slug) {
  return work.find((p) => p.slug === slug) ?? null
}
