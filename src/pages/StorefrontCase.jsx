import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { SITE } from '../data/site'
import CaseStudyContact from '../components/CaseStudyContact'
import '../styles/storefront-case.css' // keeps the Home page's storefront link style
import '../components/kiosk/produce-kiosk.css'
import '../styles/sf-case.css'
import '../styles/cx-case.css'

const A = '/work/la-bodega-storefront'
const F = `${A}/flow`
const V = '2026-11-10x' // bump when screens are recaptured

/* Structure follows lbd Internal app/docs/product/PORTFOLIO_PLAN.md:
   problem → constraints → research → decisions → the work (diagrams, flows, edge states, staff side,
   details, system) → outcome → reflect. Screens are Figma BUILD frames with a 47 pt top inset added. */

/** iPhone frame (Danny's, transparent screen) with a screen or a clip inside. */
const REDUCED = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Loops only while at least a quarter of it is on screen; paused otherwise (less motion, less battery). */
function AutoVideo({ src, poster, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} />
}

function Phone({ src, alt, pos = 'top', big = false, video, poster }) {
  if (video && REDUCED) { src = poster; video = null }
  return (
    <div className={`sf-phone${big ? ' sf-phone--big' : ''}`}>
      <div className="sf-phone__screen">
        {video
          ? <AutoVideo src={`${A}/${video}?v=${V}`} poster={`${A}/${poster}?v=${V}`} label={alt} />
          : <img src={`${A}/${src}?v=${V}`} alt={alt} style={{ objectPosition: pos }} />}
      </div>
      <img className="sf-phone__frame" src={`${A}/frame-iphone.png`} alt="" aria-hidden="true" />
    </div>
  )
}



/** Hand-coded WhatsApp threads, Aug 4 – Sep 2, 2026. */
const ASKS = [
  { t: 'The price of an item', n: 10 },
  { t: '“Do you have…?”', n: 9 },
  { t: 'An order, as a short list', n: 5 },
  { t: 'What’s on sale', n: 4 },
]

const QUOTES = [
  ['¿A cómo tiene la libra de carne chamorro?', 'How much is a pound of beef shank?'],
  ['Yo ahora necesito nopales.', 'Now I need nopales.'],
  ['Tres libras de rabo. No carne para caldo.', 'Three pounds of oxtail. Not soup beef.'],
  ['Es que no sé cuánto es 4 onzas.', 'I just don’t know how much 4 ounces is.'],
]

const COMPETITORS = [
  ['Instacart', 'Yes: Kroger, ALDI, Food City', '12% if prices match the store, 16% if not (offer to La Bodega)', 'Fees, and prices that can differ from the shelf', 'What the chains carry'],
  ['DoorDash', 'Grocery not confirmed', '15% (offer to La Bodega)', 'Delivery and service fees', '—'],
  ['Uber Eats', 'Yes: Kroger, Food City, Dollar General', '20–30% list rate', 'Delivery and service fees', 'What the chains carry'],
  ['Walmart, Kroger', 'Their own pickup and delivery', 'Their own channel', 'Chain prices', 'A small Hispanic aisle'],
  ['Local tiendas', 'No online ordering found', '—', 'In store only', 'Deep'],
  ['La Bodega online', 'Yes, pickup and local delivery', 'No commission', 'Store prices', 'Deep'],
]

/** The app, flow by flow. */
const FLOWS = [
  { title: 'Shop', note: 'For people who know what they want: departments, search, prices by the pound.', shots: [
    ['2-aisle', 'Meat & Seafood'], ['2-search', 'Search: tortillas'], ['2-deals', 'Deals'] ] },
  { title: 'Pay', note: 'Free-delivery progress, store credit and the weighed-item hold, each explained once.', shots: [
    ['3-cart', 'Cart: close the gap to free delivery'], ['3-paybtn', 'Checkout with Apple’s own Pay button'], ['3-applepay', 'The Apple Pay sheet'], ['3-placed', 'Order placed, with an edit window'] ] },
  { title: 'After you pay', note: 'Delivered to the door, or picked up with a register code and “I’m here”.', shots: [
    ['4-confirmed', 'Order confirmed'], ['4-delivered', 'Delivered, then a rating'], ['5-ready', 'Ready, with a register code'], ['5-imhere', 'Where are you?'] ] },
]

const EDGES = [
  ['e-changed', '2 things changed in your cart'],
  ['e-declined', 'Card declined: nothing was charged'],
  ['e-soldout', 'Sold out, with a replacement'],
  ['e-outside', 'Outside the delivery area: pick up instead'],
  ['e-notimes', 'Delivery is full for the next 2 hours'],
  ['e-toolate', 'Too late to change: we’ve started packing'],
  ['e-missed', 'Missed pickup: held until closing, then refunded'],
  ['e-beer', 'Beer: 21+ check at the first add'],
]

const SECTIONS = [['problem', 'Problem'], ['research', 'Research'], ['decisions', 'Decisions'], ['work', 'The work'], ['outcome', 'Outcome']]

const TABS = [
  { id: 'shop', label: 'Shop', note: FLOWS[0].note, shots: FLOWS[0].shots },
  { id: 'pay', label: 'Pay', note: FLOWS[1].note, shots: FLOWS[1].shots },
  { id: 'after', label: 'After you pay', note: FLOWS[2].note, shots: FLOWS[2].shots },
  { id: 'errors', label: 'When it goes wrong', note: 'Each error says what happened, what it cost (usually nothing), and what to do next.', shots: EDGES },
  { id: 'store', label: 'Store side', note: 'Staff accept orders on a handheld and pack them at the register, in Odoo. A missing item becomes a swap the shopper approves.',
    shots: [['h-weborders', 'Handheld: open web orders and the accept countdown.'], ['h-picklist', 'Pick list: have 2 of 3, send a swap to the shopper.']],
    extra: ['odoo-order.jpg', 'The register’s Web orders panel in Odoo: a delivery order being packed, with the butcher’s note and Ready, charge packed total', 'At the register, in Odoo: Ready charges the packed total.'] },
]

/** Segmented control (HIG): one set of screens at a time. Arrow keys move between segments. */
function Screens() {
  const [at, setAt] = useState(0)
  const btns = useRef([])
  const tab = TABS[at]
  const key = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (at + d + TABS.length) % TABS.length
    setAt(n); btns.current[n]?.focus()
  }
  const shot = (src, cap, base = F) => (
    <figure key={src} className="cx-fig">
      <img src={`${base}/${src}?v=${V}`} alt={cap} loading="lazy" />
      <figcaption>{cap}</figcaption>
    </figure>
  )
  return (
    <section className="cx-panel cx-panel--screens" aria-labelledby="screens-title">
      <div className="cx-panel__head">
        <h3 id="screens-title" className="cx-panel__title">Screens</h3>
        <div className="cx-seg" role="tablist" aria-label="Screens by moment" onKeyDown={key}>
          {TABS.map((t, i) => (
            <button key={t.id} ref={(el) => { btns.current[i] = el }} type="button" role="tab" id={`tab-${t.id}`} aria-controls="screens-panel"
              aria-selected={i === at} tabIndex={i === at ? 0 : -1} className={i === at ? 'is-on' : ''} onClick={() => setAt(i)}>{t.label}</button>
          ))}
        </div>
      </div>
      <p className="cx-panel__note">{tab.note}</p>
      <div id="screens-panel" role="tabpanel" aria-labelledby={`tab-${tab.id}`} className="cx-screens">
        {tab.shots.map(([src, cap]) => shot(`${src}.jpg`, cap))}
        {tab.extra ? shot(tab.extra[0], tab.extra[2], A) : null}
      </div>
    </section>
  )
}

/** Floating section nav: appears once the reader is past the opening, marks the section in view. */
function SectionNav() {
  const [on, setOn] = useState(false)
  const [at, setAt] = useState('problem')
  useEffect(() => {
    const heads = SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean)
    const onScroll = () => {
      const y = window.innerHeight * 0.35
      const band = document.querySelector('.sf-hero')
      setOn(!!band && band.getBoundingClientRect().bottom < window.innerHeight * 0.5)
      let cur = heads[0].id
      for (const h of heads) if (h.getBoundingClientRect().top < y) cur = h.id
      setAt(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav className={`sf-nav${on ? ' is-on' : ''}`} aria-label="Sections">
      {SECTIONS.map(([id, label]) => (
        <a key={id} href={`#${id}`} className={at === id ? 'is-at' : ''} aria-current={at === id ? 'true' : undefined}
          onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }) }}>{label}</a>
      ))}
    </nav>
  )
}

/* Layout pieces from the case-study system (styles/cx-case.css). */
function Chapter({ id, n, label, title, children }) {
  return (
    <section id={id} className="cx-chapter">
      <div className="cx-wrap">
        <p className="cx-eyebrow"><b>{n}</b>{label}</p>
        <h2 className="cx-h2">{title}</h2>
        {children}
      </div>
    </section>
  )
}

function Row({ title, children }) {
  return (
    <div className="cx-row">
      <h3 className="cx-row__h">{title}</h3>
      <div className="cx-row__body">{children}</div>
    </div>
  )
}

function Fig({ src, alt, cap, size = 'q', base = F }) {
  return (
    <figure className={`cx-fig cx-${size}`}>
      <img src={`${base}/${src}?v=${V}`} alt={alt} loading="lazy" />
      {cap ? <figcaption>{cap}</figcaption> : null}
    </figure>
  )
}

export default function StorefrontCase() {
  const max = Math.max(...ASKS.map((a) => a.n))
  return (
    <>
    <article className="pk sf cx">
      <header className="cx-wrap">
        <div className="cx-intro">
          <div className="cx-intro__text">
            <Link to="/" className="cx-back">← Work</Link>
            <h1 className="cx-h1">La Bodega online store</h1>
            <p className="cx-tag">Groceries to the door in Calhoun, Georgia. In Spanish or English, at store prices.</p>
            <ul className="cx-snap">
              <li><b>Problem</b><span>Shoppers had to message the store and wait to learn a price or what was in stock; delivery platforms wanted 12–16% of every order.</span></li>
              <li><b>Shipped</b><span>The store’s own app: web store live, iOS submitted, Android in testing.</span></li>
              <li><b>Proof</b><span>In the WhatsApp pilot, chat orders averaged $58.41, about twice a $28.41 register basket. About $1,800 in September.</span></li>
            </ul>
            <dl className="cx-meta">
              <div><dt>Role</dt><dd>Sole designer and front-end engineer</dd></div>
              <div><dt>Timeline</dt><dd>Aug – Nov 2026</dd></div>
              <div><dt>Platform</dt><dd>Web, iPhone, Android, Odoo</dd></div>
            </dl>
          </div>
          <div className="cx-intro__phone">
            <Phone video="splash-anim.mp4" poster="splash-anim-poster.jpg" alt="The app opening: La Bodega logo, ¡Hola! Welcome, Lola rises in the arch, then the welcome screen with English and Español" />
          </div>
        </div>
      </header>

      <div className="sf-hero cx-band">
        <div className="sf-phones">
          {[
            ['major-home.jpg', 'Shop', 'Home: deliver to 412 Oak St, at your door in 30 minutes, shop by brand, deals this week', false],
            ['major-sched.jpg', 'Pick a delivery time', 'Checkout: delivery or pickup, deliver to, delivery time scheduled today in the afternoon, 1 to 1:30 pm', true],
            ['major-onway.jpg', 'Know when it’s coming', 'On its way: out for delivery, arriving about 11:10, with order alerts and Ask Lola', false],
          ].map(([src, step, alt, big], i) => (
            <figure key={src} className={`cx-band__item${big ? ' is-big' : ''}`}>
              <Phone big={big} src={src} alt={alt} />
              <figcaption><b>{i + 1}</b>{step}</figcaption>
            </figure>
          ))}
        </div>
        <div className="sf-phones cx-band__details">
          {[
            ['flow/d-live.mp4', 'flow/d-live-poster.jpg', 'The order on the Lock Screen', 'Live Activity on the Lock Screen and in the Dynamic Island: order received, preparing, on the way, delivered'],
            ['flow/d-wallet.mp4', 'flow/d-wallet-poster.jpg', 'Wallet: tap a card', 'Wallet: tap the Lola Rewards card and it lifts out of the pocket with its barcode'],
            ['flow/d-pass.mp4', 'flow/d-pass-poster.jpg', 'The pass updates itself', 'Apple Wallet pass updating from 180 to 222 points, reward ready'],
            ['flow/d-points.mp4', 'flow/d-points-poster.jpg', 'Points after delivery', 'Points sheet after delivery: 180 counts up to 222, $5 off ready'],
          ].map(([video, poster, label, alt]) => (
            <figure key={video} className="cx-band__item">
              <Phone video={video} poster={poster} alt={alt} />
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
      </div>


      <Chapter id="problem" n="01" label="Problem" title="Shoppers had to ask for every price">
        <div className="cx-highlight">
          <div className="cx-stat"><b>19 of 25</b><span>shopping chats asked a price or “do you have…?”</span></div>
          <div className="cx-stat"><b>93 of 95</b><span>price questions still went to staff, even with Lola on WhatsApp</span></div>
          <div className="cx-stat"><b>33 min</b><span>median wait for an answer</span></div>
        </div>
        <Row title="What shoppers had to do">
          <ul className="cx-list">
            <li>To learn a price or check stock, customers messaged the store and waited.</li>
          </ul>
        </Row>
        <Row title="The delivery that already existed">
          <ul className="cx-list">
            <li>Shoppers were checking out on other customers’ loyalty numbers.</li>
            <li>Community cab drivers were buying groceries for several families.</li>
            <li>Customers trusted them, skipped app fees and markups, and some had no car.</li>
            <li>Drivers said app platforms didn’t pay once time and fuel were counted.</li>
          </ul>
        </Row>
        <Row title="What the store faced">
          <ul className="cx-list">
            <li>Every chat order was taken by hand.</li>
            <li>A delivery platform would take 12–16% of each order: $7–9 on a $58 basket.</li>
          </ul>
        </Row>
        <Row title="Constraints">
          <ul className="cx-list">
            <li>Odoo, the register system, owns products, prices, stock and orders.</li>
            <li>Meat and produce are priced only after weighing.</li>
            <li>Most chats are in Spanish.</li>
            <li>Beer needs a 21+ check; Apple requires account deletion in the app.</li>
          </ul>
        </Row>
        <Row title="Lola, the test run">
          <p>It proved demand: about $1,800 in September, at twice the register basket. It couldn’t grow, because a person handled every order.</p>
        </Row>
        <Row title="Why WhatsApp alone wasn’t enough">
          <ul className="cx-list cx-list--labels">
            <li><b>Reach</b>About 600 of roughly 2,800 loyalty customers aren’t on WhatsApp.</li>
            <li><b>Finding</b>Shoppers text Lola a name and expect to see the item. Showing it in chat means syncing 8,000+ register-priced products into a Meta catalog, a second list to keep in step; otherwise shoppers scroll the catalog by hand.</li>
            <li><b>Retention</b>A flyer holdout showed customers drift if flyers stop for a few weeks; a “we miss you” message worked only with the flyer.</li>
            <li><b>Rules</b>Beer posters and even replies that said “cerveza” were blocked, and after 24 hours of silence only paid templates are allowed.</li>
          </ul>
        </Row>
      </Chapter>

      <Chapter id="research" n="02" label="Research" title="What 66 WhatsApp chats showed">
        <Row title="Methods">
          <table className="sf-table">
            <thead><tr><th>Method</th><th>What</th><th>When</th></tr></thead>
            <tbody>
              <tr><td>Register data</td><td>17,010 sales; 62% of 2,785 customers back within 90 days</td><td>Sep</td></tr>
              <tr><td>WhatsApp inbox, coded by hand</td><td>66 threads, plus 180 from an earlier study</td><td>May – Sep</td></tr>
              <tr><td>Conversations</td><td>Staff, customers and local cab drivers, after the loyalty-number pattern at the register</td><td>Oct</td></tr>
              <tr><td>Delivery-app reviews</td><td>Six friction patterns, each from two or more sources</td><td>Oct</td></tr>
              <tr><td>Competitor walk-throughs</td><td>23 grocery sites and apps</td><td>Oct</td></tr>
            </tbody>
          </table>
          <p className="cx-note">No usability sessions yet: the biggest gap, and the next study.</p>
        </Row>
        <Row title="What people ask">
          <p>25 of the 66 threads were about shopping:</p>
          <div className="sf-bars">
            {ASKS.map((a) => (
              <div className="sf-bar" key={a.t}>
                <span className="sf-bar__label">{a.t}</span>
                <span className="sf-bar__track"><span className="sf-bar__fill" style={{ width: `${(a.n / max) * 100}%` }} /></span>
                <span className="sf-bar__n">{a.n}</span>
              </div>
            ))}
          </div>
        </Row>
        <div className="cx-grid">
          {QUOTES.map(([es, en]) => (
            <blockquote key={es} className="cx-quote cx-q"><span>{es}</span><span>{en}</span></blockquote>
          ))}
        </div>
        <p className="cx-note">From the store’s WhatsApp, anonymised.</p>

        <Row title="The market">
          <p>No one else in Calhoun sells this range online, at store prices.</p>
        </Row>
        <div className="cx-grid">
          <div className="cx-f cx-scroll">
            <table className="sf-table sf-table--wide">
              <thead><tr><th></th><th>Orders in Calhoun</th><th>What the store pays</th><th>What the shopper pays</th><th>Hispanic range</th></tr></thead>
              <tbody>
                {COMPETITORS.map((r) => (
                  <tr key={r[0]} className={r[0] === 'La Bodega online' ? 'is-us' : ''}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cx-stat cx-t"><b>24.8%</b><span>of Calhoun’s 18,183 residents are Hispanic</span></div>
          <div className="cx-stat cx-t"><b>22%</b><span>speak Spanish at home; 13.8% speak English less than very well</span></div>
          <div className="cx-stat cx-t"><b>56%</b><span>of Hispanic adults use WhatsApp, against 26% of all US adults</span></div>
        </div>
        <p className="cx-note">Sources: each app’s Calhoun listings and merchant pricing; US Census ACS 2020–2024; Pew Research Center, 2026.</p>
      </Chapter>

      <Chapter id="decisions" n="03" label="Decisions" title="Six decisions, each with a cost">
        <Row title="How it got here">
          <p>Real-app references, five directions, a pick on Oct 6 (fixed packs, Zelle at order), then wireframes on Oct 24. Decisions 3 and 4 undid the Oct 6 pick.</p>
        </Row>
        <div className="cx-journey cx-panel">
          {[
            ['h-refs.jpg', 'Real apps', 'References: Wolt, Uber Eats, DoorDash', 'References board of real shipped apps: Wolt, Uber Eats and DoorDash first-open and welcome screens, each annotated with what to take from it', 'refs'],
            ['h-early.jpg', 'Before Oct 6', 'Directions A–E', 'Five early directions, A to E: poster-style campaign pages, painted signs, and a plain shop layout', 'early'],
            ['h-oct6.jpg', 'Oct 6', 'Chosen: fixed packs, Zelle at order', 'October 6 direction in Spanish: deals list with 1, 2 or 5 lb packs, a toast saying meat is paid by Zelle at order, and a product sheet with fixed pack sizes', 'oct6'],
            ['h-wire.jpg', 'Oct 24', 'Wireframes for every flow', 'October 24 phone wireframes: aisle, product with pack sizes, cart, and checkout', 'wire'],
          ].map(([src, date, title, alt, key]) => (
            <figure key={key} className={`cx-journey__step cx-journey__step--${key}`}>
              <figcaption><span>{date}</span>{title}</figcaption>
              <a href={`${F}/${src}?v=${V}`} target="_blank" rel="noopener noreferrer" className="cx-zoom">
                <img src={`${F}/${src}?v=${V}`} alt={alt} loading="lazy" />
                <span className="cx-zoom__hint" aria-hidden="true">Open full size ↗</span>
                <span className="sr-only"> (opens full size in a new tab)</span>
              </a>
            </figure>
          ))}
        </div>

        <Row title="1. Our own app on Odoo, not a marketplace">
          <p>Platforms take 12–16% and keep the customer; a hosted shop drifts from the register. An app gives the store its own channel: push, the Wallet pass and Lola Rewards, with no 24-hour window. Odoo keeps the data; I built what shoppers see.</p>
          <span className="cx-cost"><b>Cost</b>One person builds and maintains it, and every release goes through App Store review.</span>
        </Row>

        <Row title="2. Community drivers first, store staff as backup">
          <p>Orders go to a trusted community driver first, who keeps the delivery fee; store staff are the backup. Groceries stay at shelf prices.</p>
          <span className="cx-cost"><b>Cost</b>Driver screening, insurance, liability and tracking still need answers before it can grow.</span>
        </Row>

        <Row title="3. Fixed-price packs → weighed items with a hold">
          <p>Fixed packs meant a second product list drifting from Odoo. Now meat is chosen by weight, the card holds 15% extra, and the shopper pays the exact total.</p>
          <span className="cx-cost"><b>Cost</b>One more thing to explain at checkout.</span>
        </Row>
        <div className="cx-grid cx-grid--body">
          <Fig size="q" src="d1-before.jpg" alt="October 24 wireframe: Chuck Roll sold in 1, 2 or 4 lb packs at a fixed pack price" cap="Oct 24 wireframe: a price per pack." />
          <Fig size="q" src="d1-after.jpg" alt="Shipped: Ribeye chosen by weight, 1, 2, 3 lb or Other, with a note for the butcher" cap="Shipped: chosen by weight, priced when weighed." />
          <Fig size="q" src="4-final.jpg" alt="Your order is packed: $0.98 back to your card, charged the exact weight" cap="After packing: the exact weight is charged." />
        </div>

        <Row title="4. Pay at pickup → delivery paid up front">
          <ul className="cx-list">
            <li>Delivery is paid up front, so packed meat never goes uncollected.</li>
            <li>Older customers without a card top up store credit with cash at the register.</li>
            <li>Pickups can still pay at the register, for customers the store approves.</li>
          </ul>
          <span className="cx-cost"><b>Cost</b>EBT can’t pay for delivery until online EBT is approved; then store credit covers the fees.</span>
        </Row>
        <Row title="5. Red for actions, green only for savings">
          <p>Red means act, an ink border means selected, and green only means you save.</p>
        </Row>
        <Row title="6. Browse with photos; keep Lola for lists">
          <p>Search works the way shoppers already text Lola: type a name and the item appears with its photo. Departments help newcomers explore a wide Latin American range, and reordering is one tap. Ask Lola stays one tap away for special cuts and big orders, answered by staff.</p>
          <span className="cx-cost"><b>Cost</b>A saved shopping list is designed but not built yet.</span>
        </Row>
        <Row title="What I cut">
          <ul className="cx-list">
            <li>A pop-up on the first screen.</li>
            <li>Offer stickers on product photos; the deal lives on the price.</li>
            <li>A sample saved card for new customers: helpful-looking, and not true.</li>
          </ul>
        </Row>
      </Chapter>

      <Chapter id="work" n="04" label="The work" title="What I designed">
        <Row title="Every way a delivery order can fail">
          <p>Diamonds are the app’s questions; red branches are what the shopper sees.</p>
          <a className="cx-link" href={`${F}/dia-delivery.png?v=${V}`} target="_blank" rel="noopener noreferrer">Open the diagram full size ↗<span className="sr-only"> (opens in a new tab)</span></a>
        </Row>
        <div className="cx-panel">
          <Fig size="f" src="dia-delivery.png" alt="Delivery order flow from cart to doorstep with decisions: in stock, inside the area, delivery time open, signed in, bank approves the hold, prices changed, in stock at packing, handed over; each no branch leads to its screen and back" />
        </div>

        <Screens />
      </Chapter>

      <Chapter id="outcome" n="05" label="Outcome" title="Shipped to production">
        <div className="cx-highlight cx-highlight--2">
          <div className="cx-stat"><b>2×</b><span>average order in the pilot: $58.41 by chat against $28.41 at the register</span></div>
          <div className="cx-stat"><b>$1,800</b><span>from WhatsApp orders in September, before the app</span></div>
        </div>
        <p className="cx-note">Signal from the pilot: 22 chat orders matched to register purchases. A small sample; the app will show whether it holds.</p>
        <Row title="Where it stands">
          <p>The store takes delivery and pickup orders in its own app, at store prices, with no commission.</p>
          <ul className="cx-list">
            <li>The web store is live at <a href="https://shop.labodegacalhoun.com" target="_blank" rel="noopener noreferrer">shop.labodegacalhoun.com</a>.</li>
            <li>iOS 1.0 submitted November 10, 2026; Android in closed testing.</li>
            <li>Launched in production this month; measurement starts with the first orders.</li>
          </ul>
        </Row>
        <Row title="What it’s built to move">
          <p>No results yet: the starting point, and what moves each.</p>
          <div className="cx-scroll">
            <table className="sf-table cx-move">
              <thead><tr><th>Goal</th><th>Starting point</th><th>What in the app moves it</th><th>Measured by</th></tr></thead>
              <tbody>
                <tr><th scope="row">Bigger baskets</th><td>Chat orders averaged $58.41, about twice the $28.41 register average</td><td>Free delivery at $75 with a progress bar; “Forgot something?” in the cart; deals on the price</td><td>Average app basket against the register</td></tr>
                <tr><th scope="row">Loyalty</th><td>62% of 2,785 customers came back within 90 days</td><td>Lola Rewards points on every order, Double Points on Tuesdays and Wednesdays, the Apple Wallet pass</td><td>Repeat rate at 90 days; Rewards sign-ups</td></tr>
                <tr><th scope="row">Revenue</th><td>About $1,800 from WhatsApp orders in September</td><td>Delivery reaches people who can’t come in; no 12–16% platform commission</td><td>Monthly app revenue; commission avoided</td></tr>
              </tbody>
            </table>
          </div>
        </Row>
        <Row title="First experiment">
          <p>Two versions of the hold wording, measured on checkout completion for carts with weighed items.</p>
        </Row>
        <Row title="What I learned">
          <ul className="cx-list">
            <li>Designing against the real catalog exposed the pack problem. Start there.</li>
            <li>Test the weighed-item checkout with shoppers before building the hold.</li>
            <li>Measure the funnel from the first order.</li>
          </ul>
        </Row>
        <Row title="Built with">
          <p>Next.js and Capacitor · Odoo 18 · Stripe · SwiftUI Live Activity · WhatsApp Business API · Figma.</p>
        </Row>
        <Row title="Next">
          <nav className="cx-end cx-end--first" aria-label="Next">
            <a className="cx-end__main" href="https://shop.labodegacalhoun.com" target="_blank" rel="noopener noreferrer">Open the live store ↗<span className="sr-only"> (opens in a new tab)</span></a>
            <Link to="/projects/produce-kiosk">Next: Produce kiosk →</Link>
            <a href={`mailto:${SITE.email}`}>Get in touch</a>
          </nav>
        </Row>
      </Chapter>
      <SectionNav />
    </article>
    <CaseStudyContact />
    </>
  )
}
