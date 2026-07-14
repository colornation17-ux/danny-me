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
      'Bilingual assistant on the thread ~1,200 loyalty families already use, flyer Q&A, voice + text, pickup orders, and staff handoff. Designed from 180 live threads (310 messages); the channel Competitor Watch later attributes.',
    role: 'Product designer',
    timeline: 'May – Jun 2026',
    team: 'Solo design & build',
    skills: ['Conversation design', 'Service design', 'WhatsApp UX', 'EN/ES copy'],
    accent: '#1FA97A',
    liveUrl: 'https://la-bodega-lola.vercel.app/',
    cover: '/work/lola/journey.png',
    hero: '/work/lola/service.png',
    gallery: [
      { src: '/work/lola/portrait.png', caption: 'Lola, the face of the weekly thread' },
      { src: '/work/lola/store.png', caption: 'Store-grounded broadcast art' },
    ],
    layout: 'character',
    sections: [
      {
        eyebrow: 'Overview',
        title: 'Engagement on the thread families already use',
        body: 'La Bodega is an independent Hispanic grocer in Calhoun, GA. Its weekly WhatsApp flyer reaches ~1,200 loyalty families, but replies turn into English, Spanish, voice notes, SNAP questions, and pickup lists inside one staff inbox. Lola is the engagement layer, converse, order, hand off, not the planning dashboard.',
      },
      {
        eyebrow: 'Problem',
        title: 'The broadcast worked. The inbox couldn\'t keep up.',
        body: 'Weekly deal texts created demand. Replies came back as bilingual text, voice notes, and pickup-order requests, faster than staff could answer during rush.',
      },
      {
        eyebrow: 'Opportunity',
        title: 'Weekly marketing could become an ordering channel',
        body: 'If Lola can answer flyer questions instantly and turn messy replies into structured pickup requests, the broadcast becomes more than marketing, it becomes a way to order without downloading a new app.',
      },
      {
        eyebrow: 'Solution',
        title: 'Six flows on the thread families already use',
        body: 'Grounded answers from this week\'s flyer. Tap-first pickup lists. Voice notes that follow the same order path as text. Hard asks escalate to humans, Lola steps back.',
      },
      {
        eyebrow: 'Research',
        title: '180 threads before a single flow shipped',
        body: 'May–Jun 2026 inbox study: 180 conversations · 310 customer messages. Spanish led among threads with a saved language preference. Live staff-help (30d): 14 answered (avg 8.2 min) · 9 expired (~39%), the open handoff gap. Lola bot first replies: 97.7% under 2 min (median ~4s), not staff speed.',
        metrics: [
          { value: '180', label: 'Threads reviewed' },
          { value: '310', label: 'Customer messages coded' },
          { value: '~39%', label: 'Escalations expired (30d)' },
        ],
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
        body: 'Conversation craft only works when staff ops are designed with it. Lock-screen alerts, quote flows, and clear escalation rules mattered as much as the agent prompts. The remaining gap is staff replies that still expire.',
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
      'Competitor benchmarks, weather playbooks, and demand forecasts in one place, so one store plans weekend promos like a chain, then proves WhatsApp outreach with visit attribution.',
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
      'Stabilized a live retail launch, product onboarding stage, barcode normalization, SKU recognition 60% → 100%.',
    role: 'Service designer',
    timeline: '1 week · launch recovery',
    team: 'With store ops',
    skills: ['Service design', 'Systems', 'Operational recovery'],
    accent: '#E8A030',
    sections: [
      {
        eyebrow: 'Overview',
        title: 'Structural recovery of a live retail launch',
        body: 'La Bodega opened as a 25,000 sq ft hybrid grocery and restaurant. On day one, roughly 40% of SKUs failed at checkout, price disputes, unattributable revenue, and 2–5 minute lookups on live lanes.',
      },
      {
        eyebrow: 'Problem',
        title: 'Inventory entered the system at checkout, not at receiving',
        body: 'No product onboarding stage. No governance. Products billed as miscellaneous. Every terminal shared the same broken database, grocery and restaurant billing failed together.',
      },
      {
        eyebrow: 'Diagnosis',
        title: 'Three converging signals, one missing stage',
        body: 'Diagnosed by walking the floor during live checkout failures, pulling POS logs for miscellaneous-billing counts, and talking to register staff directly, three converging signals pointing at the same missing stage, not a single assumption.',
      },
      {
        eyebrow: 'Design decision',
        title: 'Fix the cause, not the symptom',
        body: 'Chose to insert a mandatory onboarding stage before shelving, not a faster lookup tool at the register. The symptom was slow checkout, but the cause was products entering the system with no record. Fixing the register wouldn\'t have fixed that.',
      },
      {
        eyebrow: 'Solution',
        title: 'Insert the missing stage before the shelf',
        body: 'Mandatory product onboarding before shelving. Barcode normalization pipeline. Role ownership and a weekly governance cadence so recognition didn\'t rot after the fix.',
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
        body: 'The interface wasn\'t a screen, it was the path from truck to shelf to register. Fix the stage that was missing, not the symptom at the till.',
      },
    ],
  },
  {
    slug: 'wing-hmi',
    outcome: '92% task success rate, mission-control HMI for premium smart vehicles',
    title: 'Wing HMI',
    meta: 'Wing · Concept 2025',
    status: 'Concept',
    year: '2025',
    domain: 'Automotive HMI',
    cover: '/work/wing-hmi/hero.png',
    hero: '/work/wing-hmi/hero.png',
    reel: '/work/wing-hmi/demo-1.mp4',
    gallery: [
      { src: '/work/wing-hmi/screen-1.png', caption: 'Cluster and HUD layout' },
      { src: '/work/wing-hmi/screen-2.png', caption: 'Center display system state' },
      { src: '/work/wing-hmi/screen-3.png', caption: 'Voice interface layer' },
      { src: '/work/wing-hmi/screen-4.png', caption: 'Alert states and attention zones' },
    ],
    blurb:
      'Next-gen in-vehicle experience inspired by interplanetary mission control, validated in a driving simulator with a 20mm camera rig matched to human eye field-of-view.',
    role: 'Product designer',
    timeline: '2 weeks · 3-phase design sprint',
    team: 'Design exploration',
    skills: ['HMI', 'UX/UI', 'Voice UI', 'Simulator testing'],
    accent: '#7C5CFF',
    sections: [
      {
        eyebrow: 'Overview',
        title: 'An HMI that feels like mission control, not a tablet glued to a dash',
        body: 'Wing needed a premium smart-vehicle interface for tech-driven buyers aged 28–42 who expect intelligence and immersion, without drowning the driver in chrome.',
      },
      {
        eyebrow: 'Problem',
        title: 'Automotive UI still copies phone patterns',
        body: 'Dense menus, shallow hierarchy, and little sense of system state. Drivers need glanceable status and calm motion, not app-drawer thinking at highway speed.',
      },
      {
        eyebrow: 'Foundation',
        title: 'Three phases, two weeks, one simulator',
        body: 'Mapped use cases and interaction zones (HUD, cluster, center display) against a segmentation study of tech-savvy premium buyers aged 28–42. Built low-fi flows and tested light/dark modes and alert states. Refined into hi-fi frames with a voice interface, then validated in a driving simulator using a 20mm camera rig matched to natural human eye field-of-view.',
      },
      {
        eyebrow: 'Outcome',
        title: '92% task success in simulation',
        body: 'Critical information landed in the driver\'s primary line of sight; secondary controls stayed reachable without breaking focus. Limitation: generative features stayed surface-level, personalization lacked deep logic or multi-turn context.',
        metrics: [
          { value: '92%', label: 'Task success rate in simulator' },
        ],
      },
      {
        eyebrow: 'Delivered',
        title: 'Hi-fi screens, voice interface, simulator-tested prototype',
        body: 'A direction for next-gen mobility UX, hi-fi HMI screens, a voice interface layer, and a simulator-tested interactive prototype. Concept work positioning Wing for younger buyers who want intelligence without surveillance theater.',
      },
      {
        eyebrow: 'Next',
        title: 'Where this would go with more time',
        body: 'Integrate a fine-tuned model for contextual, multi-turn dialogue. Link voice commands to intent and logic maps. Test stress states, low-light conditions, and new-driver onboarding.',
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
      'Rebuilt the digital platform for an AI-driven racing team, persona-driven IA for four audiences, field research at Indianapolis Motor Speedway, and SEO that outlasted the launch spike.',
    role: 'Product designer',
    timeline: 'Oct – Dec 2024',
    team: 'With CODE19',
    skills: ['Web design', 'Content strategy', 'SEO', 'Information architecture'],
    accent: '#E11D48',
    cover: '/work/code19/hero.jpg',
    hero: '/work/code19/hero.jpg',
    layout: 'photo',
    liveUrl: 'https://code19.ai',
    sections: [
      {
        eyebrow: 'Overview',
        title: 'A platform that converted fans and sponsors',
        body: 'CODE19 needed a platform that converted fans and sponsors, not a brochure site that went quiet between events.',
      },
      {
        eyebrow: 'Problem',
        title: 'Four audiences, one generic page',
        body: 'Fans, sponsors, engineers, and drivers hit the same shallow content, nobody found what they came for. A heuristic evaluation and competitive teardown against Mercedes AMG F1 and other top teams confirmed it: high bounce, short sessions, thin content, no SEO structure, and no reason to stay.',
      },
      {
        eyebrow: 'Foundation',
        title: 'Research at the track and in the data',
        body: 'Heuristic evaluation, a competitive audit against top motorsports sites, 30+ fan and sponsor surveys, and field research at Indianapolis Motor Speedway, then persona-driven IA for four distinct users (fan, sponsor, engineer, driver), built through card sorting. Three months, Oct–Dec 2024.',
      },
      {
        eyebrow: 'Outcomes',
        title: 'Sessions, funding, and organic growth',
        body: 'Seed funding grew from $150K to $500K post-launch. New monthly sessions peaked near 1,850 in December 2024, then faded as direct traffic typically does. Organic search started near zero and grew steadily through mid-2025, the slower, more durable payoff of the SEO work.',
        metrics: [
          { value: '$150K → $500K', label: 'Seed funding raised post-launch' },
          { value: '1,500+', label: 'New monthly sessions (peak ~1,850)' },
          { value: '−36%', label: 'Bounce rate, organic (down to 58.5%)' },
        ],
      },
      {
        eyebrow: 'Session data',
        title: 'Launch spike vs. organic durability',
        body: 'Direct traffic and referrals spiked at launch. Organic search told a different story: starting near zero, it grew steadily through mid-2025, holding its share even as direct traffic cooled. Average session duration: 3.6 min (direct) · 96 sec (organic).',
      },
      {
        eyebrow: 'What I learned',
        title: 'The hard constraint was data, not design',
        body: 'Real-time integration across third-party feeds was the hard technical constraint, not the design system. Serving four audiences on one platform meant real trade-offs in information architecture, not just responsive breakpoints.',
      },
    ],
  },
  {
    slug: 'edge-ai',
    outcome: 'Privacy-first AI at the edge, eliminating cloud dependency for mission-critical vehicle decisions',
    title: 'WING Edge AI',
    meta: 'Wing · Concept 2025',
    status: 'Concept',
    year: '2025',
    domain: 'Edge AI',
    cover: '/work/edge-ai/hero.jpg',
    hero: '/work/edge-ai/hero.jpg',
    reel: '/work/edge-ai/demo-1.mp4',
    gallery: [
      { src: '/work/edge-ai/screen-2.png', caption: 'Local-first architecture overview' },
      { src: '/work/edge-ai/screen-3.png', caption: 'Driver transparency controls' },
      { src: '/work/edge-ai/screen-4.png', caption: 'Edge inference pipeline' },
      { src: '/work/edge-ai/screen-5.png', caption: 'Privacy data boundary diagram' },
    ],
    blurb:
      'Extends the WING HMI ecosystem into real-time, privacy-first AI at the edge, local-first processing for split-second decisions, transparent controls, and data that stays in the car.',
    role: 'Product designer',
    timeline: '2025',
    team: 'Design exploration',
    skills: ['HAI', 'UX/UI', 'Edge AI', 'Systems design'],
    accent: '#0891B2',
    sections: [
      {
        eyebrow: 'Overview',
        title: 'Extending WING HMI into real-time, privacy-first AI',
        body: 'Smart-vehicle AI leans on cloud compute, adding latency to split-second decisions and drivers have no visibility into how their data is used. WING Edge AI brings personalization on-device, where it belongs.',
      },
      {
        eyebrow: 'Problem',
        title: 'Cloud dependency at highway speed',
        body: 'Mission-critical vehicle decisions (lane assist, hazard alerts, adaptive routing) shouldn\'t wait on a network round-trip. And drivers increasingly want to know and control, what data leaves the car.',
      },
      {
        eyebrow: 'Research method',
        title: 'AI-assisted synthesis, not primary research',
        body: 'Conceptual project. Research was AI-assisted synthesis across automotive forums, product reviews, and driver-safety reports, not direct interviews or usability studies. Findings informed design principles, not validated user needs.',
      },
      {
        eyebrow: 'Design principles',
        title: 'Transparency, control, efficiency',
        body: 'Transparency: show how AI decisions get made. Control: driver-facing toggles over training, sync, and data use. Efficiency: cut visual scan time under driving load. All three principles apply to the interaction layer above the architecture.',
      },
      {
        eyebrow: 'Architecture',
        title: 'Local-first, cloud-optional',
        body: 'Sensitive data, driving behavior, routes, voice, stays on-device. Only generalized data (firmware updates, public maps) syncs to cloud. The driver controls what crosses that boundary.',
      },
      {
        eyebrow: 'Target outcomes',
        title: 'Targets, not measured results',
        body: 'These are design targets from the concept phase, not measured outcomes. Visual scan time ↓30% vs. legacy systems · edge latency <20ms · AI trust index >80% · cloud opt-out sustained >65% · alert response time ↓25%.',
        metrics: [
          { value: '<20ms', label: 'Target edge latency' },
          { value: '>80%', label: 'Target AI trust index' },
          { value: '↓30%', label: 'Target scan time vs. legacy' },
        ],
      },
      {
        eyebrow: 'Roadmap',
        title: 'Phases 1–2 complete, 3–4 planned',
        body: 'Phase 1 (architecture + design principles) and Phase 2 (hi-fi prototyping) are complete. Phase 3 (companion watch app) is in progress. Phase 4 (OEM pilot integration) is planned.',
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
      'Multi-modal generative video plugin for Premiere Pro, create on the timeline instead of bouncing between tools.',
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
        body: 'Generate, iterate, and place clips in-timeline. Multi-modal inputs meet Premiere\'s existing selection and mark language.',
      },
      {
        eyebrow: 'Outcome',
        title: 'A direction for AI that stays in the craft tool',
        body: 'Concept and prototype for editors who want generative speed without abandoning professional workflow.',
      },
      {
        eyebrow: 'What I learned',
        title: 'AI features inherit the host app\'s mental model',
        body: 'If the plugin fights Premiere\'s verbs, editors won\'t adopt it, no matter how good the model is.',
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
    blurb: 'Multiplatform DS for CODE19.ai\'s digital identity.',
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
