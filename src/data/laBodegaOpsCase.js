/**
 * La Bodega Ops — publishable claims + NN/g case copy.
 * SSOT: Internal lib/case-study/content.ts + live pilot + floor partners.
 * Do not invent ROI %, findability scores, or research N.
 */

export const LBD_OPS_LIVE = 'https://labodega-ops-ivory.vercel.app'
export const LBD_OPS_ACCENT = '#9F1239'

export const LBD_OPS_RAIL_STEPS = [
  { id: 'lbd-hero', num: '00', label: 'Story' },
  { id: 'lbd-summary', num: '01', label: 'Summary' },
  { id: 'lbd-problem', num: '02', label: 'Problem' },
  { id: 'lbd-approach', num: '03', label: 'Research' },
  { id: 'lbd-ideation', num: '04', label: 'Ship' },
  { id: 'lbd-loops', num: '05', label: 'Solution' },
  { id: 'lbd-decisions', num: '06', label: 'Challenge' },
  { id: 'lbd-lessons', num: '07', label: 'Lessons' },
  { id: 'lbd-impact', num: '08', label: 'Impact' },
  { id: 'contact', num: '09', label: 'Contact' },
]

export const HERO = {
  kicker: 'Product design · La Bodega Mercado',
  title: 'Designing La Bodega Ops',
  thesis:
    'I designed La Bodega Ops for Mercado. Managers purchase and receive on phone; staff clock in; admin sets budgets. Each role has its own home screen.',
  meta: {
    role: 'Product design',
    scope: 'IA · flows · PWA',
    client: 'La Bodega',
    timeframe: 'Q1–Q2 2026',
  },
}

export const SUMMARY = {
  blurb:
    'Product design for La Bodega Ops — a store PWA used by staff, managers, kitchen, and admin at Mercado.',
  process:
    'Double Diamond · Discover → Define (Problem, Research) · Develop → Deliver (Ship, Solution, Impact)',
  jump: {
    decision: { href: '#lbd-ideation', label: 'Decision I owned' },
    screens: { href: '#lbd-loops', label: 'Jump to shipped screens' },
    research: { href: '#lbd-approach', label: 'Read the research' },
  },
  decisionDigest: {
    title: 'Decision I owned',
    lead: 'Ship Purchasing (Walk / Door) and department budgets before schedule.',
    stakes: 'Friday bleed on the aisle vs a labor app that ignored spend hold.',
    href: '#lbd-ideation',
    more: 'Full stakes, lock, and revisit →',
  },
  bet: {
    problem:
      'Managers had no last price or budget on the aisle. Invoices lived in WhatsApp. Overtime went to the owner. The hourly P&L pass was not tightening the store — Mercado was still bleeding money.',
    solution:
      'Managers use Purchasing and Store Pulse on phone. Staff clock in and open Where to work. Admin sets department budgets. Excel exports after the fact.',
  },
  facts: [
    { label: 'Client', value: 'La Bodega · Mercado' },
    { label: 'Duration', value: 'Q1–Q2 2026' },
    { label: 'Status', value: 'Live pilot' },
    { label: 'My role', value: 'Solo design + build' },
    { label: 'Scope', value: 'IA · flows · PWA' },
    { label: 'Tools', value: 'Figma · Next.js · Azure DI · voice' },
  ],
}

export const CONTEXT = {
  store:
    'Mercado has cashiers, managers, kitchen, and an owner. The POS could sell. Floor ops still ran through a spreadsheet.',
  related: {
    label: 'Related · Checkout Ops',
    href: '/projects/bodega-ops',
    note: 'Checkout Ops fixed product data at the register. This case covers floor ops after the sale.',
  },
  family: [
    { label: 'Competitor Watch', href: '/projects/competitor-watch' },
    { label: 'Lola + Connect', href: '/projects/lola' },
    { label: 'Checkout Ops', href: '/projects/bodega-ops' },
  ],
  scene: 'Friday: a truck at the door, a vendor on empty shelves, the owner in Excel.',
}

/** Keep BRIDGE export for any legacy imports — mirrors CONTEXT.related */
export const BRIDGE = {
  from: {
    chapter: 'Checkout Ops',
    title: 'Register knew the product',
    body: 'Earlier work put barcode, cost, and price into Odoo so the store could keep selling without replacing the POS.',
    href: '/projects/bodega-ops',
  },
  stillBroken:
    'People, trucks, stock, kitchen, and spend still lived on paper, chat photos, and hourly Excel. Product truth was fixed. Shift truth was not.',
  scene:
    'Friday, late afternoon: a truck at the door, an overtime text mid-rush, the owner still reconciling workbooks. The register worked. The shift did not.',
  sceneNote: 'Same failure shape everywhere — trigger → blind spot → bottleneck → stall. Mapped below.',
}

/**
 * Problem framing as failure flows (same visual language as Friday).
 * tone: default | hot (bottleneck) | out (failure)
 */
export const PROBLEM_FLOWS = [
  {
    id: 'friday',
    label: '01 · Friday rush',
    caption: 'Owner in Excel is the decision choke.',
    steps: [
      { title: 'Truck at door', sub: 'WhatsApp pics' },
      { title: 'Overtime text mid-rush', sub: 'Call the owner' },
      { title: 'Owner in Excel', sub: 'Hourly reconcile', tone: 'hot' },
      { title: 'Shift stalls', sub: 'No decision path', tone: 'out' },
    ],
  },
  {
    id: 'labor',
    label: '02 · Paper clock',
    caption: 'Hours invent themselves until payroll fights back.',
    steps: [
      { title: 'Sign the sheet', sub: 'No schedule link' },
      { title: 'Past hours', sub: 'Nobody sees live' },
      { title: 'Found in Excel', sub: 'Next workbook pass', tone: 'hot' },
      { title: 'Payroll fight', sub: 'Dispute / surprise overtime', tone: 'out' },
    ],
  },
  {
    id: 'purchase',
    label: '03 · Vendor walk',
    caption: 'Empty shelf is the forecast — no price or budget rail.',
    steps: [
      { title: 'Rep on aisle', sub: 'Suggests cases' },
      { title: 'Shelf looks empty', sub: 'No demand signal' },
      { title: 'No last / budget', sub: 'Guess the buy', tone: 'hot' },
      { title: 'Blind order', sub: 'Can’t cut or hold', tone: 'out' },
    ],
  },
  {
    id: 'receive',
    label: '04 · Door drop',
    caption: 'Photos and cells stand in for a cost trail.',
    steps: [
      { title: 'Invoice arrives', sub: 'Door delivery' },
      { title: 'WhatsApp photo', sub: 'Chat is the file' },
      { title: 'Later Excel paste', sub: 'Hours later', tone: 'hot' },
      { title: 'Cost drifts', sub: 'No PO match', tone: 'out' },
    ],
  },
  {
    id: 'backroom',
    label: '05 · Backroom sit',
    caption: 'Verbal putaway — goods wait, first-in rotation dies.',
    steps: [
      { title: 'Goods in back', sub: 'Received-ish' },
      { title: 'Chase manager', sub: 'Who shelves?' },
      { title: 'Assign in person', sub: 'No notify', tone: 'hot' },
      { title: 'Sit · rotation slips', sub: 'Shelf late', tone: 'out' },
    ],
  },
  {
    id: 'inventory',
    label: '06 · Cycle count',
    caption: 'Inventory count stuck behind POS license + laser scanners.',
    steps: [
      { title: 'Need a cycle count', sub: 'Aisle / bay inventory' },
      { title: 'POS add-on $', sub: 'Hefty license', tone: 'hot' },
      { title: 'Or buy Zebras', sub: 'Can’t afford' },
      { title: 'Count skipped', sub: 'Blind on hand', tone: 'out' },
    ],
  },
  {
    id: 'kitchen',
    label: '07 · Cooler blind',
    caption: 'Prep exists — manager and admin can’t see it.',
    steps: [
      { title: 'Prep in cooler', sub: 'Batch on shelf' },
      { title: 'No shared log', sub: 'Tribal memory', tone: 'hot' },
      { title: 'Admin blind', sub: 'No expiry view' },
      { title: 'Waste', sub: 'Found too late', tone: 'out' },
    ],
  },
  {
    id: 'spend',
    label: '08 · Spend rails',
    caption: 'Hourly P&L saw the bleed late — no hold on the floor when the buy happened.',
    steps: [
      { title: 'Manager orders', sub: 'Vendor / dept' },
      { title: 'Budget in Excel', sub: 'No floor cap', tone: 'hot' },
      { title: 'P&L pass late', sub: 'After the buy' },
      { title: 'Store still bleeds', sub: 'No hold in time', tone: 'out' },
    ],
  },
]

export const PROBLEM = {
  statement:
    'Buys, receiving, and spend had no floor record. Each exception pulled the owner back into Excel during the rush.',
  north: 'Can managers order, receive, and hold a budget on phone without opening the spreadsheet?',
  whoHurts: [
    {
      role: 'Manager',
      line: 'Vendor wants cases off the shelf. No last price, no budget left — and I’m chasing putaway in person.',
      note: 'Paraphrased',
    },
    {
      role: 'Owner',
      line: 'I updated POs and budgets every hour. Then an overtime text I didn’t see coming. Cooler? Blind.',
      note: 'Paraphrased',
    },
    {
      role: 'Floor',
      line: 'I signed the sheet. Payroll said I stayed too long. Nobody said I was over schedule.',
      note: 'Paraphrased',
    },
  ],
}

export const HYPOTHESES = [
  {
    id: 'H1',
    bet: 'Verified punch',
    text: 'If punches are verified and schedule-linked, payroll disputes and remote-fake risk drop.',
  },
  {
    id: 'H2',
    bet: 'Manager decide',
    text: 'If managers can approve overtime and receive in-app, owner escalations shrink to exceptions.',
  },
  {
    id: 'H3',
    bet: 'Door trail',
    text: 'If receive writes a cost and PO trail at the door, WhatsApp and Excel stop being the system of record for deliveries.',
  },
  {
    id: 'H4',
    bet: 'Role home',
    text: 'If each role has a home instead of a flat menu, floor and managers stop bouncing to the owner for routine work.',
  },
  {
    id: 'H5',
    bet: 'Walk with vendor',
    text: 'If the manager scans while walking the rep — seeing last/lowest price, margin signals, suggested qty, and vendor budget — they can place, cut, or hold on the floor.',
  },
  {
    id: 'H6',
    bet: 'Phone inventory',
    text: 'If cycle count, putaway, and aisle/bay live on a fast camera scanner, the store doesn’t need a POS inventory license or Zebra hardware to know where stock is.',
  },
  {
    id: 'H7',
    bet: 'Kitchen log',
    text: 'If prep in the cooler is logged with date and expiry, managers and admin can see waste risk instead of guessing what’s inside.',
  },
  {
    id: 'H8',
    bet: 'Dept budgets',
    text: 'If department budgets are set from P&L and revenue contribution (DMF on department sales) and live in Ops, buys can hold on the floor instead of waiting for the next Excel pass.',
  },
]

export const ROLE = {
  title: 'What I owned',
  mine: [
    'Product design for role homes, IA, and core flows',
    'Design system and PWA UI for staff, manager, kitchen, and admin',
    'Build partnership on clock, Walk with vendor, Door delivery, putaway, cycle count, kitchen prep, and Store Pulse',
  ],
  partners: [
    'Floor staff — paper clock, tasks, putaway, handoffs',
    'Managers — approvals, vendor walk, receive, live team',
    'Kitchen — prep / cooler with no admin visibility',
    'Owner — dept budgets, escalations, scope go / no-go',
  ],
  not: 'Solo product design and build. Floor partners decided during the shift; this was not a multi-designer squad.',
}

export const RESEARCH = {
  lead: 'I audited the workbook, shadowed the floor, then ran affinity into TIME, OPS, and CONTROL.',
  methods: [
    {
      title: 'Owner’s workbook',
      detail: 'POs, expenses, budgets, and sales — often updated hourly — across 20+ vendors.',
    },
    {
      title: 'Paper clock',
      detail: 'About 20 staff signed sheets with no live link to schedule or payroll.',
    },
    {
      title: 'Vendor walk',
      detail: 'Orders came from empty shelves. Last price was weak; budget was not checked on the aisle.',
    },
    {
      title: 'Backroom + cooler',
      detail: 'Putaway was assigned in person. Kitchen prep had no shared log.',
    },
  ],
}

/** Research spine: 5W1H → methods → findings → bet → validation (depth in details) */
export const APPROACH = {
  title: 'What the floor showed',
  question: 'Can managers buy, receive, and hold spend on phone before the next P&L pass?',
  lede: 'Audit the workbook. Shadow aisle, door, and clock. Affinity the notes. Map CW and Lola. The hourly P&L was busy — Mercado was still bleeding money.',
  /** 5W1H — purpose, audience, context, deliverable, measure */
  frame: [
    {
      w: 'Why',
      label: 'Purpose',
      body: 'Stop the bleed on the floor — the hourly P&L was not tightening the store.',
    },
    {
      w: 'Who',
      label: 'Audience',
      body: 'Managers buy / receive. Staff clock in. Kitchen logs prep. Owner sets budgets.',
    },
    {
      w: 'When & Where',
      label: 'Context',
      body: 'Aisle, door, cooler, clock — mid-rush at Mercado, not the desk after close.',
    },
    {
      w: 'What',
      label: 'Deliverable',
      body: 'Role-home PWA: Walk, Door, Store Pulse, dept budgets, verified clock.',
    },
    {
      w: 'How',
      label: 'Measure',
      body: 'Leading: Walk / Door without owner Excel; OT in-app; invoice off WhatsApp. Lagging still open.',
    },
  ],
  landscape: {
    lead: 'CW = Thursday vs chains. Lola = guest WhatsApp. Ops = truck, aisle buy, spend hold, punch.',
    apps: [
      {
        id: 'cw',
        name: 'Competitor Watch',
        line: 'Thursday shelf vs ads — not Walk, Door, or clock.',
        href: '/projects/competitor-watch',
      },
      {
        id: 'crm',
        name: 'Lola + Connect',
        line: 'Guest thread + staff CRM — not trucks or budgets.',
        href: '/projects/lola',
      },
      {
        id: 'ops',
        name: 'La Bodega Ops',
        line: 'Floor hold while the store bleeds — this case.',
        href: null,
        current: true,
      },
    ],
  },
  methods: [
    {
      title: 'Workbook audit',
      detail:
        'POs, budgets, and sales — often updated hourly — across 20+ vendors. The P&L looked current on paper and late on the floor.',
    },
    {
      title: 'Floor shadow',
      detail:
        'Empty-shelf vendor walks, WhatsApp invoices at the door, paper sign-in, verbal putaway, and a cooler with no shared log.',
    },
    {
      title: 'Sibling product map',
      detail:
        'Competitor Watch owns Thursday intel. Lola Connect owns guest WhatsApp. Neither holds spend, receives a truck, or writes the punch.',
    },
    {
      title: 'Affinity',
      detail:
        'Clustered notes into themes first — hours, buys, stock — then the bet. Screens came after, not as an Excel-tab feature dump.',
    },
  ],
  findings: [
    {
      title: 'Hours invent themselves',
      body: '~20 signed a sheet. OT as a text. Hours appeared in the next workbook pass.',
    },
    {
      title: 'Buys happen blind',
      body: 'Empty shelf = order. Last price weak. Budget checked after the money left.',
    },
    {
      title: 'P&L did not tighten the store',
      body: 'Caps after the buy. Nothing held spend when the decision happened — still bleeding.',
    },
  ],
  baseline: [
    { label: 'Paper clock', value: '~20' },
    { label: 'Vendors', value: '20+' },
    { label: 'Invoices', value: 'WhatsApp' },
    { label: 'P&L hold', value: 'Too late' },
  ],
  quote: {
    role: 'Owner',
    line: 'I updated POs and budgets every hour. The P&L still wasn’t tightening the store — we were bleeding money.',
    note: 'Paraphrased',
  },
  bet: 'Role homes. Managers buy and receive with a live hold. Work writes the record. Excel exports. CW and Lola stay put.',
  assumptions: [
    {
      assume: 'Dept caps from P&L contribution can live as weekly rails.',
      test: 'Place / cut / hold on Walk before the next workbook pass.',
    },
    {
      assume: 'Manager-first shrinks owner interrupts.',
      test: 'OT and holds in-app; owner on escalations only.',
    },
    {
      assume: 'Phone OCR + voice covers door invoices.',
      test: 'Missed OCR lines fill from a voice note.',
    },
  ],
  prompts: [
    'Walk me through the last truck.',
    'When does overtime get approved?',
    'Where does last price live on a vendor walk?',
    'When does the P&L catch an overspend — too late?',
  ],
  validation: [
    'Manager walkthrough: Walk, Door, Store Pulse.',
    'Door OCR + voice for missed lines.',
    'Excel still exports — not a full P&L rebuild.',
  ],
}

/** Structure + PO strip — skim: ship + success; loops in details */
export const IDEATION = {
  title: 'Ship order',
  lede: 'Purchasing and budgets shipped first. Clock and schedule support the floor — they are not the product bet.',
  questions: [
    {
      id: 'ops',
      q: 'Purchasing — what to buy / what arrived?',
      a: 'Walk with vendor, Door delivery, putaway, cycle count, kitchen prep.',
    },
    {
      id: 'control',
      q: 'Budgets — who decides / what can we spend?',
      a: 'Dept budgets and purchase hold. Owner handles escalations.',
    },
    {
      id: 'time',
      q: 'Store Pulse — who is on the floor?',
      a: 'Today, schedule, verified clock, approvals.',
    },
  ],
  bet: 'Role homes. Managers decide on the floor. Work updates the record when it happens.',
  ship: {
    first: 'Walk, Door, and department budgets — highest Friday failure cost.',
    support: 'Clock, schedule, and Store Pulse support who is on the floor.',
    deferred: [
      'POS inventory license sync',
      'Laser-scanner fleet',
      'Multi-store rollout',
      'Thursday intel (Competitor Watch)',
      'Guest WhatsApp (Lola Connect)',
      'Owner still owns exceptions and P&L',
    ],
  },
  success: [
    {
      label: 'Leading',
      body: 'Walk / Door without owner Excel mid-rush. OT in-app. Invoice off WhatsApp.',
    },
    {
      label: 'Lagging',
      body: 'Owner interrupt rate, payroll disputes, hold / cut on Walk — still measuring.',
    },
  ],
  rejected: [
    { no: 'One flat menu for every role', yes: 'Staff, Manager, Kitchen, and Admin homes' },
    { no: 'A scheduling app with store tools added later', yes: 'Purchasing and budgets first' },
    { no: 'Every PO and overtime to the owner', yes: 'Manager decides first; owner on budgets and exceptions' },
  ],
  decision: {
    title: 'Decision I owned',
    decision: 'Ship Purchasing (Walk / Door) and department budgets before schedule.',
    stakes: 'Friday bleed on the aisle vs a labor app that ignored spend hold.',
    rejected: 'Scheduling-first product. One flat menu. Every PO and OT to the owner.',
    lock: 'Walk, Door, and budgets ship. Clock and Store Pulse support the floor — they are not the bet.',
    revisit: 'Multi-store only after hold / cut and owner-interrupt signals prove out.',
    collab:
      'I designed and built solo. Managers validated Walk / Door on shift. Owner locked budget rails and exception policy.',
    suite:
      'CW, Lola, and Ops stay separate — shared roles, clear owners. Not a mega-app.',
  },
}

/** Affinity board — cluster stickies from Excel-as-SoR problems into themes → bet */
export const RESEARCH_BOARD = {
  title: 'Affinity · Excel problems → themes',
  caption: 'Notes paraphrased from shadowing · clustered by theme · bet emerges last',
  clusters: [
    {
      id: 'hours',
      label: 'Hours invent themselves',
      thesis: 'The sheet never saw live labor — only after-the-fact cells.',
      stickies: [
        {
          id: 'clk',
          tone: 'pink',
          rot: -2.2,
          label: 'Sign-in sheet',
          body: '20 names · no schedule link · payroll fights later',
          tag: 'note',
        },
        {
          id: 'ot',
          tone: 'yellow',
          rot: 1.6,
          label: 'Overtime mid-rush',
          body: 'Text the owner · Excel reconcile · shift stalls',
          tag: 'note',
        },
        {
          id: 'pay',
          tone: 'pink',
          rot: -1.1,
          label: 'Surprise overtime',
          body: 'Hours “found” in the next workbook pass',
          tag: 'pattern',
        },
      ],
    },
    {
      id: 'spend',
      label: 'Buys without a rail',
      thesis: 'The hourly P&L was not tightening the store — money left on the aisle before the next pass.',
      stickies: [
        {
          id: 'walk',
          tone: 'mint',
          rot: 2.1,
          label: 'Empty shelf = forecast',
          body: 'Rep suggests · no last/lowest · no hold on the floor',
          tag: 'note',
        },
        {
          id: 'wa',
          tone: 'blue',
          rot: -1.8,
          label: 'Invoice → chat',
          body: 'WhatsApp photo · paste into cells hours later',
          tag: 'note',
        },
        {
          id: 'cap',
          tone: 'mint',
          rot: 1.2,
          label: 'P&L too late',
          body: 'Hourly pass · store still bleeding money',
          tag: 'pattern',
        },
      ],
    },
    {
      id: 'stock',
      label: 'Stock dark to the sheet',
      thesis: 'Receive and prep existed on the floor — Excel never saw them live.',
      stickies: [
        {
          id: 'dock',
          tone: 'yellow',
          rot: -2.8,
          label: 'Backroom wait',
          body: 'Verbal putaway · first-in slips · no notify',
          tag: 'note',
        },
        {
          id: 'cool',
          tone: 'blue',
          rot: 2.4,
          label: 'Cooler tribal',
          body: 'Prep in fridge · no shared expiry view',
          tag: 'note',
        },
        {
          id: 'own',
          tone: 'pink',
          rot: -0.6,
          label: 'Owner = SoR',
          body: 'Every exception pulls back to the workbook',
          tag: 'insight',
        },
      ],
    },
  ],
  bet: {
    id: 'bet',
    tone: 'blue',
    rot: 1.4,
    label: 'Working bet',
    body: 'Role homes. Managers decide on the floor. Work updates the record when it happens.',
    tag: 'synth',
  },
}

export const DECISIONS = [
  {
    insight: 'One flat app would dump 40 items on every role.',
    choice: 'Role homes — staff on wallet + clock; manager on Store Pulse; kitchen on prep; owner on today’s snapshot.',
    rejected: 'Feature menu for everyone',
  },
  {
    insight: 'Honor-system sheets invite disputes.',
    choice: 'Verified clock — geofence + scan / kiosk TAG.',
    rejected: 'Digital sheet without proof',
  },
  {
    insight: 'Vendor suggests from empty shelf — store buys blind.',
    choice: 'Walk-with-vendor mode — scan each suggested SKU with last/lowest, velocity/margin, suggested qty, and live vendor budget.',
    rejected: 'Paper order pad + later Excel PO',
  },
  {
    insight: 'Owner bottleneck kills rush decisions.',
    choice: 'Manager-first approvals and purchase holds; CEO on escalation, budgets, audit.',
    rejected: 'Every overtime ask and PO to the owner',
  },
  {
    insight: 'Catalog gate dies if cost drifts at the door — and OCR misses lines.',
    choice: 'Invoice OCR (Azure Document Intelligence) + voice line fill (OpenAI) when OCR fails — adjacent to Odoo, not a POS replacement.',
    rejected: 'WhatsApp photo → later Excel paste',
  },
  {
    insight: 'Spend had no floor control — the hourly P&L was not tightening the store; budgets caught the bleed after the buy.',
    choice:
      'Dept budgets from P&L / revenue contribution (DMF on department sales) — weekly caps in Ops so managers can hold before Excel catches up.',
    rejected: 'Workbook tabs checked after the order',
  },
  {
    insight: 'Inventory truth can’t wait on a POS license or laser scanners.',
    choice: 'Phone camera scanner for cycle count, DSD, and walk — aisle/bay locations as the map.',
    rejected: 'Buy Zebra + POS inventory add-on',
  },
]

export const LOOPS = [
  {
    id: 'time',
    label: 'TIME',
    hypothesis: 'H1',
    title: 'Who is on the floor',
    body: 'Live headcount, verified clock, and approvals — not a guess from chat.',
    cards: [
      { title: 'Clock in', why: 'Geofence / kiosk punch — hard to fake remotely.' },
      { title: 'On the floor', why: 'Live headcount before you walk the aisles.' },
      { title: 'Approvals', why: 'OT and requests stay with the manager.' },
      { title: 'Schedule', why: 'Plan the week; payroll export later.' },
    ],
  },
  {
    id: 'schedule',
    label: 'SCHEDULE',
    hypothesis: 'H1 · H2',
    title: 'Who should be working',
    body: 'Week plan on phones; payroll before the week ships.',
    cards: [
      { title: 'Schedule', why: 'Stops roster-only-in-chat.' },
      { title: 'Templates', why: 'Copy a good week.' },
      { title: 'Payroll', why: 'Hours vs budget before export.' },
    ],
  },
  {
    id: 'ops',
    label: 'OPS',
    hypothesis: 'H3 · H5 · H6 · H7',
    title: 'Purchasing — buy and receive',
    body: 'Aisle orders and door check-in with a trail — not a WhatsApp photo.',
    cards: [
      { title: 'Walk with vendor', why: 'Last / lowest · suggest qty · budget → place, cut, or hold.' },
      { title: 'Door delivery', why: 'Invoice OCR at the door — not a WhatsApp photo.' },
      { title: 'Putaway', why: 'Dock → aisle/bay tasks (136 live).' },
      { title: 'Cycle count', why: 'Phone camera — no Zebra fleet.' },
      { title: 'Kitchen prep', why: 'Cooler log with prep date + expiry.' },
    ],
  },
  {
    id: 'control',
    label: 'CONTROL',
    hypothesis: 'H2 · H4 · H8',
    title: 'Budgets and approvals',
    body: 'Caps live where the buy happens. Managers hold; owner sees escalations.',
    cards: [
      { title: 'Dept budgets', why: 'Weekly caps from P&L contribution.' },
      { title: 'Purchase hold', why: 'Cut qty or hold when budget / price says no.' },
      { title: 'Approvals', why: 'Manager-first; owner on exceptions.' },
      { title: 'Audit', why: 'Trail when something important changes.' },
    ],
  },
]

export const SOLUTION_OPEN = {
  lede: 'Four shipped screens follow. Purchasing first, then budgets, then Today / Store Pulse.',
}

export const PROOF = [
  {
    title: 'Walk with vendor',
    body: 'Manager scans products on the aisle. Screen shows last paid, lowest price, and vendor budget.',
  },
  {
    title: 'Door delivery',
    body: 'Manager scans the invoice (OCR). If a line is missed, a voice note fills product, quantity, and price.',
  },
  {
    title: 'Putaway + count',
    body: 'Camera identify under 100ms. Dock tasks and cycle count run on phone.',
  },
  {
    title: 'Dept budgets',
    body: 'Admin sets weekly caps from contribution. Managers can hold a buy when the cap is hit.',
  },
  {
    title: 'Kitchen prep',
    body: 'Kitchen logs prep date and expiry. Manager and admin can open the cooler log.',
  },
  {
    title: 'Verified clock',
    body: 'Staff clock in with geofence or kiosk / TAG. Punches only count at the store.',
  },
]

export const LESSONS = [
  'Give each role a home screen. A flat menu puts every decision on every person.',
  'Show last price and budget on the aisle if purchase control has to stick.',
  'Set department caps from contribution, then enforce them where the buy happens — an hourly P&L pass does not tighten the store by itself.',
  'Ship the door trail before inventory theater. A chat photo is not a record.',
  'Keep CW, Lola, and Ops as separate products — shared roles, clear owners, not a mega-app.',
]

export const IMPACT = {
  context: [],
  outcomes: [
    {
      title: 'Work updates the record',
      detail: 'Receiving, cheques, and dept budgets change when the job happens — not in a separate hourly workbook pass.',
    },
    {
      title: 'Managers decide on shift',
      detail: 'Overtime, floor requests, and purchase place / cut / hold stay in-app. The owner sees escalations.',
    },
    {
      title: 'Budgets hold on the aisle',
      detail: 'Weekly caps from P&L contribution live in Ops — hold before the next workbook pass, so spend control is not “P&L later while the store bleeds.”',
    },
    {
      title: 'Purchase control on the walk',
      detail: 'Vendor suggestions meet last / lowest price and vendor budget before the PO is placed.',
    },
    {
      title: 'Door trail + putaway',
      detail: 'Invoice OCR with voice fallback, then shelve tasks so stock doesn’t sit in back.',
    },
    {
      title: 'Inventory on phone',
      detail: 'Cycle count and aisle / bay locations without a POS inventory license or laser-scanner fleet.',
    },
    {
      title: 'Kitchen log',
      detail: 'Cooler prep is visible to manager and admin.',
    },
  ],
  stillMeasuring: [
    'Owner interrupt rate before vs after (no baseline yet)',
    'Payroll dispute rate after verified punches',
    'Receive cost-mismatch catch rate on live invoices',
    'Purchase hold / qty-cut rate on Walk with vendor',
    'Cooler waste trend after prep logging',
  ],
}

export const ROLES_STRIP = [
  { role: 'Admin', owns: 'Money & rails' },
  { role: 'Manager', owns: 'The shift' },
  { role: 'Floor', owns: 'The work' },
]
