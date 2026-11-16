import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { SITE } from '../data/site'
import CaseStudyContact from '../components/CaseStudyContact'
import '../styles/storefront-case.css' // keeps the Home page's storefront link style
import '../styles/cx-case.css' // shared footer and contact block (body:has(article.cx))
import '../styles/sf2-case.css'

const A = '/work/la-bodega-storefront'
const F = `${A}/flow`
const HQ = `${F}/hq` // 3x exports of the Figma Master frames (1170 x 2532)
const V = '2026-11-16b' // bump when screens are recaptured

/* Rebuilt Nov 15 from docs/STOREFRONT-CASE-OUTLINE.md and the approved style sheet (public/drafts/storefront-case-style.html).
   Rules: one image, one job; each screen appears once; comparisons at the same scale; every number has its period
   and a caveat; methods and raw boards stay collapsed. Phone screens only: it is a mobile app. */

const REDUCED = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Loops only while at least a quarter of it is on screen. */
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

/** A screen in Danny's iPhone frame (the same frame as the live hero). */
function Screen({ src, alt, base = F, video, poster, children }) {
  const media = video && !REDUCED
    ? <AutoVideo src={`${base}/${video}?v=${V}`} poster={`${base}/${poster}?v=${V}`} label={alt} />
    : <img src={`${base}/${video ? poster : src}?v=${V}`} alt={alt} loading="lazy" />
  return (
    <div className="s2-dev">
      <div className="s2-dev__screen">{media}{children}</div>
      <img className="s2-dev__frame" src={`${A}/frame-iphone16.png`} alt="" aria-hidden="true" />
    </div>
  )
}

/** A board or diagram, full width, opens full size. */
function Board({ src, alt, cap }) {
  const url = `${F}/${src}?v=${V}`
  return (
    <figure className="s2-board">
      <a href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt={alt} loading="lazy" /><span className="sr-only"> (opens full size in a new tab)</span></a>
      {cap ? <figcaption>{cap}</figcaption> : null}
    </figure>
  )
}

function Label({ children }) { return <span className="s2-label">{children}</span> }

function Chapter({ id, n, label, title, children }) {
  return (
    <section id={id} className="s2-chapter" aria-labelledby={`${id}-t`}>
      <div className="s2-col">
        <div className="s2-ch"><Label>{n}</Label><Label>{label}</Label></div>
        <h2 id={`${id}-t`} className="s2-h2">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function More({ title, children }) {
  return (
    <details className="s2-more">
      <summary>{title}</summary>
      <div className="s2-more__body">{children}</div>
    </details>
  )
}

/* ---------- data ---------- */

/** Service evolution, May–Nov 2026 (confirmed by Danny, Nov 14). */
const TIMELINE = [
  ['May', 'Phone-number loyalty replaced paper coupons'],
  ['Jun – Aug', 'WhatsApp ordering, Lola and a shared staff inbox'],
  ['Sep – Oct', 'Paid delivery orders, and customers ordering again'],
  ['Oct', 'Known lists worked in chat; browsing didn’t'],
  ['Nov', 'Approved on Google Play, held for launch; iPhone in App Store review; website browse-only'],
]

/** The backstage before the app: Lola collects, staff confirm. */
const HANDOFF = [
  ['Customer', 'A message, voice note or list'],
  ['Lola', 'Answers and clarifies'],
  ['Shared inbox', 'A ticket for staff'],
  ['Staff', 'Check, pack, resolve'],
  ['Order', 'Pickup or delivery'],
]

/** Hand-coded WhatsApp threads, Aug 4 – Sep 2, 2026. */
const ASKS = [['The price of an item', 10], ['“Do you have…?”', 9], ['An order, as a short list', 5], ['What’s on sale', 4]]

const QUOTES = [
  ['Yo ahora necesito nopales.', 'Now I need nopales.'],
  ['Tres libras de rabo. No carne para caldo.', 'Three pounds of oxtail. Not soup beef.'],
  ['Es que no sé cuánto es 4 onzas.', 'I just don’t know how much 4 ounces is.'],
]

const ROUTES = [
  ['Marketplace (Instacart’s offer)', '12–16% of every order', 'The platform’s shoppers pick; prices can differ from the shelf', 'Rejected: the commission, and the customer belongs to the platform'],
  ['WhatsApp with Lola', 'No commission', 'Staff check, pack and answer; a median 33-minute wait for a price', 'Kept for lists, special cuts and help'],
  ['The store’s own app', 'One person to build and maintain; App Store review', 'Shoppers browse and pay; staff pack and approve swaps', 'Chosen'],
]

const COMPETITORS = [
  ['Instacart', 'Yes: Kroger, ALDI, Food City', '12% if prices match the store, 16% if not (offer to La Bodega)', 'Fees, and prices that can differ from the shelf', 'What the chains carry'],
  ['DoorDash', 'Grocery not confirmed', '15% (offer to La Bodega)', 'Delivery and service fees', '—'],
  ['Uber Eats', 'Yes: Kroger, Food City, Dollar General', '20–30% list rate', 'Delivery and service fees', 'What the chains carry'],
  ['Walmart, Kroger', 'Their own pickup and delivery', 'Their own channel', 'Chain prices', 'A small Hispanic aisle'],
  ['Local tiendas', 'No online ordering found', '—', 'In store only', 'Deep'],
  ['La Bodega online', 'Yes, pickup and local delivery', 'No commission', 'Store prices', 'Deep'],
]

const REFS = [
  ['r-wolt.jpg', 'Wolt', 'One clear start → the Welcome screen with Lola'],
  ['r-target.jpg', 'Target', 'Brand red and a mascot on a working home → Lola on Home'],
  ['r-glovo.jpg', 'Glovo', 'First delivery free, said up front → first delivery free with Lola Rewards'],
  ['r-instacart-who.jpg', 'Instacart', 'Who you shop for → People you shop for, in preferences'],
  ['r-instacart-address.jpg', 'Instacart', 'Address errors on the field → the address sheet'],
  ['r-swapi.jpg', 'Swapi', 'One idea per screen for points → the Lola Rewards explainer'],
  ['r-menubar.jpg', 'Property app', 'A light pill on the selected tab → the menu bar'],
]

/** More screens, by moment: extra states only, nothing shown above. */
const GALLERY = [
  ['3-cart.jpg', 'Cart', 'Close the gap to free delivery'],
  ['3-applepay.jpg', 'Apple Pay', 'The system sheet, one tap'],
  ['3-placed.jpg', 'Order placed', 'A few minutes to change it'],
  ['4-delivered.jpg', 'Delivered', 'Then a rating'],
  ['5-imhere.jpg', 'Pickup', '“I’m here”, and where you parked'],
  ['e-changed.jpg', 'Prices changed', 'Two things changed in your cart'],
  ['e-outside.jpg', 'Outside the area', 'Pick up instead'],
  ['e-notimes.jpg', 'Delivery is full', 'The next open times'],
  ['e-toolate.jpg', 'Too late to change', 'We’ve started packing'],
  ['e-missed.jpg', 'Missed pickup', 'Held until closing, then refunded'],
  ['e-beer.jpg', 'Beer', '21+ check at the first add'],
]

/** Tokens from the storefront's app/tokens.css, generated from the Figma SF2 variables. */
const DS_COLOURS = [
  ['Brand', '#8e0029', 'Act: buttons, the cart'], ['Brand deep', '#69041d', 'Pressed, headers'], ['Ink', '#241d1d', 'Text, selected borders'],
  ['Page', '#f6f1ee', 'Background'], ['Cream', '#fff5ea', 'Soft surfaces'], ['Sale', '#0a6f32', 'Only for savings'],
  ['Rewards', '#ffc233', 'Lola Rewards'], ['Muted', '#6a5953', 'Secondary text'], ['Border', '#e0d8d9', 'Lines, cards'],
]
const DS_SPACE = [4, 8, 12, 16, 20, 24, 32]
const DS_RADIUS = [4, 8, 12, 16, 24]

/** Hero device wall: real screens at 3x, the store, and three phones playing the app's own motion. */
/** Hero wall (Nov 15): the shopper's journey left to right, four clips spaced apart, the store last. No unbuilt screens. */
const HERO_WALL = [
  { video: 'splash-anim.mp4', poster: 'splash-anim-poster.jpg', base: A, alt: 'Opening: the La Bodega wordmark, then the arch rises' },
  { src: 'major-home.jpg', base: A, alt: 'Home: deliver to 412 Oak St, at your door in 30 minutes, shop by brand, deals this week' },
  { video: 'deals-anim.mp4', poster: 'deals-anim-poster.jpg', base: HQ, alt: 'This week’s deals, Nov 13 to 16: the heading settles and the grocery bag rises' },
  { src: 'weight-type.jpg', alt: 'Ribeye steak sold by the pound: pick 1, 2 or 3 lb, or type a weight, then add to cart' },
  { src: 'major-sched.jpg', base: A, alt: 'Checkout: delivery or pickup, delivery time scheduled today, 1 to 1:30 pm' },
  { video: 'motion-placed.mp4', poster: 'motion-placed-poster.jpg', base: HQ, alt: 'Order placed: payment approved, sent to the store, the stamp lands, then Lola' },
  { video: 'd-live.mp4', poster: 'd-live-poster.jpg', alt: 'Live Activity on the Lock Screen: received, preparing, on the way, delivered' },
  { src: 'chat-handoff.jpg', alt: 'Ask Lola: the chorizo was missing; Lola says sorry and connects the store team, who are typing' },
  { photo: 'store-registers.jpg', alt: 'La Bodega’s registers in Calhoun, Georgia, with yellow carts and a cashier at work' },
]

/** Product card states, rendered from the app's component page (Nov 15). */
const CARD_STATES = [
  ['card-default.png', 'Ready to add', 'Serrano Peppers, ready to add'],
  ['card-incart.png', 'In your cart', 'Serrano Peppers with 1 lb in the cart'],
  ['card-soldout.png', 'Sold out today', 'Serrano Peppers, faded, marked sold out today'],
  ['card-onlist.png', 'On your list', 'Serrano Peppers, outlined and checked as on your list'],
]
/** Crops are 2x phone captures; widths are a third of their pixels (two-thirds of phone size). */
const SAME_PARTS = [['m-weight.png', 'Weight', 207], ['m-swap.png', 'If something’s out', 249], ['m-stepper.png', 'Quantity', 89], ['a-button.png', 'Primary button', 249]]

const SECTIONS = [['opportunity', 'Already ordering'], ['channel', 'Own channel'], ['pilot', 'Pilot'], ['evidence', 'Why build'], ['design', 'Designing'], ['decisions', 'Decisions'], ['service', 'Service'], ['outcome', 'Status']]

/* ---------- section bar: a slim line under the site header, never floating over a figure ---------- */
function SectionNav() {
  const [on, setOn] = useState(false)
  const [at, setAt] = useState(SECTIONS[0][0])
  const ref = useRef(null)
  useEffect(() => {
    const heads = SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean)
    const onScroll = () => {
      const intro = document.querySelector('.sf2 .s2-wall-band')
      setOn(!!intro && intro.getBoundingClientRect().bottom < window.innerHeight * 0.4)
      const y = window.innerHeight * 0.35
      let cur = heads[0]?.id
      for (const h of heads) if (h.getBoundingClientRect().top < y) cur = h.id
      setAt(cur)
      const site = document.querySelector('.site-nav')
      if (ref.current) ref.current.style.top = `${site ? Math.max(0, Math.round(site.getBoundingClientRect().bottom)) : 0}px`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])
  return (
    <nav ref={ref} className={`sf2-nav${on ? ' is-on' : ''}`} aria-label="Sections">
      {SECTIONS.map(([id, label]) => (
        <a key={id} href={`#${id}`} className={at === id ? 'is-at' : ''} aria-current={at === id ? 'true' : undefined}
          onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }) }}>{label}</a>
      ))}
    </nav>
  )
}

/* ---------- page ---------- */
export default function StorefrontCase() {
  const max = Math.max(...ASKS.map(([, n]) => n))
  const meta = (
          <div className="s2-meta">
            <div><Label>Role</Label><ul><li>Product designer: research, service design, UI, design system, front-end build</li><li>The owner set the business rules and made the final picks</li><li>AI-assisted implementation, under my design ownership</li></ul></div>
            <div><Label>Timeline</Label><ul><li>Service: May – Nov 2026</li><li>Storefront build: Aug – Nov 2026</li><li>Shopper testing next</li></ul></div>
            <div><Label>Status</Label><ul><li>iPhone app in App Store review</li><li>Approved on Google Play, held for launch</li><li>Website browse-only; orders on test payments until launch</li></ul></div>
          </div>
  )
  return (
    <>
    <article className="cx sf2">
      {/* Intro: statement, role and results, a row of real screens (Goolkasian, Kosas) */}
      <header className="s2-intro s2-intro--v2">
        <div className="s2-wide">
          <Link to="/" className="s2-back">← Work</Link>
          <Label>La Bodega online store · Calhoun, Georgia · 2026</Label>
          <div className="s2-headrow">
          <h1 className="s2-title">From WhatsApp orders to the store’s own app</h1>
          <div>
          <p className="s2-sub">Families were already ordering by text and through local drivers. I designed the bilingual app that lets them see prices, pick a weight and get it delivered, from the same store.</p>
          <ul className="s2-tags" aria-label="Disciplines"><li>Service design</li><li>Mobile</li><li>Design system</li></ul>
          </div>
          </div>
        </div>
        {/* Device wall (Goolkasian / Instacart): breadth of real screens, the store itself, and three phones playing the app's own motion */}
        <div className="s2-wall-band">
          <div className="s2-wall">
            {HERO_WALL.map((t, i) => t.photo ? (
              <figure key={t.photo} className="s2-wall__photo">
                <img src={`${HQ}/${t.photo}?v=${V}`} alt={t.alt} loading="eager" />
              </figure>
            ) : (
              <figure key={t.src || t.video} className={`s2-wall__phone${i % 2 ? ' is-down' : ''}`}>
                {t.video
                  ? <Screen video={t.video} poster={t.poster} base={t.base || F} alt={t.alt} />
                  : <Screen src={t.src} base={t.base || HQ} alt={t.alt} />}
              </figure>
            ))}
          </div>
        </div>
        <div className="s2-wide s2-meta-after">{meta}</div>
      </header>

      {/* Beat 1 */}
      <Chapter id="opportunity" n="01" label="Already ordering" title="Customers were already ordering, by text and through local drivers">
        <div className="s2-col">
          <blockquote className="s2-hook">At the register, staff noticed drivers checking out on other customers’ loyalty numbers.</blockquote>
          <p>Local cab drivers were buying groceries for several families at once. Working families, especially mothers, trusted them, skipped app fees and markups, and some had no car.</p>
          <p className="s2-muted">Customers were also asking the store, by message, whether they could order. Some already knew exactly what they wanted and sent the list.</p>
        </div>
        <div className="s2-wide s2-block">
          <div className="s2-panel">
            <div className="s2-flow" aria-label="The delivery that already existed">
              <div className="s2-node"><b>Families</b><span>Familiar groceries, store prices</span></div><span className="s2-arrow" aria-hidden="true">↔</span>
              <div className="s2-node"><b>Local drivers</b><span>Buy, carry, deliver; paid by the family</span></div><span className="s2-arrow" aria-hidden="true">↔</span>
              <div className="s2-node is-us"><b>La Bodega</b><span>Sells at the register, on someone’s loyalty number</span></div>
            </div>
          </div>
          <p className="s2-note">The store already knew who these shoppers were: a phone-number loyalty program had replaced paper coupons in May.</p>
        </div>
        <div className="s2-wide s2-block">
          <ol className="s2-rail" aria-label="Service evolution, May to November 2026">
            {TIMELINE.map(([when, what]) => <li key={when + what}><b>{when}</b>{what}</li>)}
          </ol>
        </div>
      </Chapter>

      {/* Beat 2 */}
      <Chapter id="channel" n="02" label="Own channel" title="A marketplace, or the store’s own channel">
        <div className="s2-col">
          <p>Instacart offered to list the store for 12% of each order at store prices, or 16% if online prices could differ: $7–9 on a $58 basket. Drivers said the delivery apps didn’t pay once their time and fuel were counted.</p>
        </div>
        <div className="s2-wide s2-block">
          <div className="s2-money">
            <div className="s2-panel">
              <Label>The marketplace offer</Label>
              <div className="s2-flow" style={{ marginTop: 16 }}>
                <div className="s2-node"><b>Shopper</b><span>Pays the platform: items, fees</span></div><span className="s2-arrow" aria-hidden="true">→</span>
                <div className="s2-node"><b>Marketplace</b><span>Keeps 12–16% of the order</span></div><span className="s2-arrow" aria-hidden="true">→</span>
                <div className="s2-node"><b>La Bodega</b><span>Gets the rest; the platform keeps the customer</span></div>
              </div>
            </div>
            <div className="s2-panel">
              <Label>The store’s own channel</Label>
              <div className="s2-flow" style={{ marginTop: 16 }}>
                <div className="s2-node"><b>Shopper</b><span>Groceries at store prices</span></div><span className="s2-arrow" aria-hidden="true">→</span>
                <div className="s2-node is-us"><b>La Bodega</b><span>Keeps the sale and the customer</span></div><span className="s2-arrow" aria-hidden="true">+</span>
                <div className="s2-node"><b>Local driver</b><span>Gets the delivery fee; the store takes no cut</span></div>
              </div>
            </div>
          </div>
          <p className="s2-note">No commission isn’t no cost. Card processing, software, packing and fixing what goes wrong stay with the store, and one person builds and maintains it.</p>
        </div>
        <div className="s2-wide s2-block">
          <div className="s2-table-wrap">
            <table className="s2-table">
              <thead><tr><th></th><th>Cost to the store</th><th>Who does the work</th><th>Decision</th></tr></thead>
              <tbody>{ROUTES.map((r) => <tr key={r[0]} className={r[3] === 'Chosen' ? 'is-us' : ''}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>)}</tbody>
            </table>
          </div>
          <More title="Who else sells groceries in Calhoun, and the local market">
            <div className="s2-table-wrap">
              <table className="s2-table">
                <thead><tr><th></th><th>Orders in Calhoun</th><th>What the store pays</th><th>What the shopper pays</th><th>Hispanic range</th></tr></thead>
                <tbody>{COMPETITORS.map((r) => <tr key={r[0]} className={r[0] === 'La Bodega online' ? 'is-us' : ''}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>)}</tbody>
              </table>
            </div>
            <ul className="s2-list">
              <li><b>24.8%</b> of Calhoun’s 18,183 residents are Hispanic.</li>
              <li><b>22%</b> speak Spanish at home; 13.8% speak English less than very well.</li>
              <li><b>56%</b> of Hispanic adults use WhatsApp, against 26% of all US adults.</li>
            </ul>
            <p className="s2-note">Sources: each app’s Calhoun listings and its offer to the store; US Census ACS 2020–2024; Pew Research Center, 2026.</p>
          </More>
        </div>
      </Chapter>

      {/* Beat 3 */}
      <Chapter id="pilot" n="03" label="Pilot" title="The smallest test: orders by WhatsApp">
        <div className="s2-col">
          <p>Before building anything, the store took orders where customers already were. They sent short Spanish messages, voice notes and lists. Lola, the store’s assistant, collected and clarified; staff confirmed what the store could pack; local drivers delivered.</p>
          <p className="s2-muted">We automated collection, not acceptance. With changing stock and cuts weighed to order, an automatic “confirmed” could promise what the store couldn’t keep.</p>
        </div>
        <div className="s2-wide s2-block">
          <div className="s2-panel">
            <ol className="s2-flow" aria-label="How a WhatsApp order moved from customer to staff">
              {HANDOFF.map(([who, what], i) => (
                <li key={who} style={{ display: 'contents' }}>
                  {i ? <span className="s2-arrow" aria-hidden="true">→</span> : null}
                  <div className="s2-node"><b>{who}</b><span>{what}</span></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="s2-wide s2-block">
          <div className="s2-research">
            <div>
              <h3 className="s2-h4">What customers asked</h3>
              <p className="s2-muted">25 of the 66 WhatsApp threads coded by hand (Aug 4 – Sep 2) were about shopping; 19 asked a price or “do you have…?”. A thread can count under more than one topic.</p>
              <div className="s2-bars">{ASKS.map(([t, n]) => <div className="s2-bar" key={t}><span>{t}</span><i style={{ width: `${(n / max) * 100}%` }} /><span>{n}</span></div>)}</div>
            </div>
            <div className="s2-quotes s2-quotes--stack" aria-label="From the store’s WhatsApp, anonymised">
              {QUOTES.map(([es, en]) => <blockquote key={es} className="s2-quote" lang="es">{es}<span lang="en">{en}</span></blockquote>)}
            </div>
          </div>
        </div>
      </Chapter>

      {/* Beat 4 */}
      <Chapter id="evidence" n="04" label="Why build" title="The pilot paid, and showed its limit">
        <div className="s2-wide">
          <div className="s2-results">
            <div><b>$1,800</b><span>a month from WhatsApp orders</span><em>September and October 2026, before the app</em></div>
            <div><b>$1,300</b><span>of it from 22 delivery orders, averaging $58.41</span><em>Against a $28.41 register basket; about $500 came from pickup</em></div>
            <div><b>5</b><span>customers ordered delivery more than once</span><em>A pilot signal, not a retention rate</em></div>
          </div>
          <p className="s2-note">Reported pilot figures. A small, self-selected group, and staff helped with every order.</p>
        </div>
        <div className="s2-wide s2-block s2-side">
          <div className="s2-panel"><Screen src="search-results.jpg" base={HQ} alt="Search results with product photos and the price per pound" /></div>
          <div>
            <Label>The limit</Label>
            <blockquote className="s2-quote" lang="es" style={{ marginTop: 16 }}>¿A cómo tiene la libra de carne chamorro?<span lang="en">How much is a pound of beef shank?</span></blockquote>
            <p>93 of 95 price questions still went to staff, with a median 33-minute wait; a quarter waited over 14 hours. Known lists worked in chat. “Do you have…?” meant another message and another wait.</p>
            <p className="s2-muted">The answer was browsing: the photo and the price per pound on the screen, without asking.</p>
          </div>
        </div>
        <div className="s2-wide s2-block">
          <div className="s2-research">
            <div>
              <h3 className="s2-h4">Why WhatsApp alone wasn’t enough</h3>
              <ul className="s2-list">
                <li><b>Reach.</b> About 600 of roughly 2,800 loyalty customers aren’t on WhatsApp.</li>
                <li><b>Finding.</b> Showing items in chat meant syncing 8,000+ register-priced products into a second catalog.</li>
                <li><b>Retention.</b> Customers drift if flyers stop for a few weeks; a “we miss you” message worked only with the flyer.</li>
                <li><b>Rules.</b> Beer posters, and even replies that said “cerveza”, were blocked; after 24 hours of silence only paid templates are allowed.</li>
              </ul>
            </div>
            <div>
              <h3 className="s2-h4">The decision</h3>
              <p>Paid orders and repeat customers made the case to build the store’s own app. The limit set its job: keep chat for lists and help, and add what chat couldn’t do: browsing, prices and checkout, in Spanish or English.</p>
            </div>
          </div>
          <More title="Methods: register data, inbox coding, conversations, reviews, walk-throughs">
            <div className="s2-table-wrap">
              <table className="s2-table s2-table--fit">
                <thead><tr><th>Method</th><th>What</th><th>When</th></tr></thead>
                <tbody>
                  <tr><td>Register data</td><td>17,010 sales; 62% of 2,785 customers back within 90 days</td><td>Sep</td></tr>
                  <tr><td>WhatsApp inbox, coded by hand</td><td>66 threads, plus 180 from an earlier study</td><td>May – Sep</td></tr>
                  <tr><td>Conversations</td><td>Staff, customers and local cab drivers</td><td>Oct</td></tr>
                  <tr><td>Delivery-app reviews</td><td>Six friction patterns, each from two or more sources</td><td>Oct</td></tr>
                  <tr><td>Competitor walk-throughs</td><td>23 grocery sites and apps</td><td>Oct</td></tr>
                </tbody>
              </table>
            </div>
          </More>
        </div>
      </Chapter>

      {/* Beat 5 placeholder (to be built): who can order */}
      <div className="s2-wide s2-block">
        <ul className="s2-access" aria-label="Who can order">
          <li><b>Help stays</b>Customers can still order by message, with staff help.</li>
          <li><b>No card needed</b>Cash customers top up store credit at the register.</li>
          <li><b>EBT</b>Online EBT is pending approval; in the store it works as before.</li>
        </ul>
      </div>

      {/* 03 */}
      <Chapter id="design" n="05" label="Designing" title="What the app had to get right">
        <div className="s2-col">
          <p>The first direction, on Oct 6, carried desktop habits onto a phone. On Oct 24 I archived three weeks of finished screens and re-wireframed every flow phone-first.</p>
          <p className="s2-muted">Prices and stock come from the register. Meat and produce are priced after weighing. Most chats are in Spanish. Beer needs a 21+ check, and Apple requires account deletion in the app.</p>
        </div>
        <div className="s2-wide s2-block">
          <div className="s2-step"><Label>Step 1</Label><h3 className="s2-h3">What I took from other apps</h3>
            <p className="s2-muted">Screens from delivery, grocery, loyalty and property apps, kept only where one answered a frustration from the research. Seven made it in. Refused: checkout on another company’s site, and a pop-up on the first screen; six of nine food sites did each one.</p></div>
          <div className="s2-refs">
            {REFS.map(([src, app, took]) => (
              <figure key={src}><a href={`${F}/${src}?v=${V}`} target="_blank" rel="noopener noreferrer"><img src={`${F}/${src}?v=${V}`} alt={`${app} reference screen`} loading="lazy" /></a><figcaption><b>{app}</b>{took}</figcaption></figure>
            ))}
          </div>
        </div>

        <div className="s2-wide s2-block">
          <div className="s2-step"><Label>Step 2</Label><h3 className="s2-h3">Five directions, one picked</h3>
            <p className="s2-muted">Same content and type in each, so only the look changed. C, built on the store’s own hand-painted signs, became the base; D added A’s product photos and kept B’s print style only for the weekly deal block.</p></div>
          <Board src="p-directions.jpg" alt="Directions A to E on a phone, same carne asada content: A cut-out food on cream, B halftone print, C painted signs, D signs with photos and a printed deal block, E a fuller single-brand take" cap="Directions A–E, same content. D was picked." />
          <div className="s2-table-wrap" style={{ marginTop: 24 }}>
            <table className="s2-table">
              <thead><tr><th>Direction</th><th>Built on</th><th>What happened</th></tr></thead>
              <tbody>
                <tr><th scope="row">A · Counter</th><td>Cut-out food on cream</td><td>Kept its product photos</td></tr>
                <tr><th scope="row">B · Print</th><td>Halftone photos, colour blocks</td><td>The most distinctive and the most tiring; kept only for the weekly deal block</td></tr>
                <tr><th scope="row">C · Painted signs</th><td>The store’s hand-painted signs and marker price cards</td><td>My recommendation; became the base</td></tr>
                <tr className="is-us"><th scope="row">D · C + A + B</th><td>C’s signs, A’s photos, B only in the deal block</td><td>Picked</td></tr>
                <tr><th scope="row">E · Counter, fuller</th><td>One reference brand, pushed further</td><td>Dropped: it looked like that brand, not the store</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="s2-wide s2-block">
          <div className="s2-step"><Label>Step 3</Label><h3 className="s2-h3">The Oct 24 reset</h3>
            <p className="s2-muted">An audit of the Oct 6 screens found a web catalogue squeezed onto a phone. I archived three weeks of finished screens and re-wireframed every flow phone-first.</p></div>
          <div className="s2-ba">
            <figure>
              <Label>Oct 6 · a catalogue on a phone</Label>
              <Screen src="oct6-aisle.jpg" base={HQ} alt="October 6 design: a category sidebar and small product tiles with Agregar buttons"><span className="s2-pin" style={{ left: '1%', top: '71%' }}>1</span><span className="s2-pin" style={{ left: '44%', top: '61%' }}>2</span></Screen>
            </figure>
            <figure>
              <Label>Shipped · phone first</Label>
              <Screen src="aisle-meat.jpg" base={HQ} alt="Shipped Meat and Seafood aisle: category chips and large product cards with prices by the pound"><span className="s2-pin" style={{ left: '2%', top: '14%' }}>1</span><span className="s2-pin" style={{ left: '44%', top: '34%' }}>2</span></Screen>
            </figure>
          </div>
          <div className="s2-ba-notes">
            <p><span className="s2-pin">1</span><span><b>Navigation.</b> The category sidebar took a third of the screen. Chips across the top give it back.</span></p>
            <p><span className="s2-pin">2</span><span><b>Picking a product.</b> Small tiles with an “Agregar” button became photo cards with the price per pound and one-tap add.</span></p>
          </div>
          <p className="s2-note">The same task at the same size. Revised through design critique, not a user test.</p>
        </div>

        <div className="s2-wide s2-block">
          <div className="s2-step"><Label>Step 4</Label><h3 className="s2-h3">Where things live</h3>
            <p className="s2-muted">Four tabs. Search, Cart, Ask Lola and sign-in open as sheets over any screen. Checkout and order pages open from the cart, a text or a notification. Staff use a separate handheld app.</p></div>
          <div className="s2-panel s2-ia" aria-label="Where things live">
            <div className="s2-ia__row"><Label>Four tabs</Label><div className="s2-flow"><div className="s2-node"><b>Home</b><span>Start shopping</span></div><div className="s2-node"><b>Shop</b><span>Departments → product</span></div><div className="s2-node"><b>Deals</b><span>This week’s offers</span></div><div className="s2-node"><b>Account</b><span>Orders, rewards, settings</span></div></div></div>
            <div className="s2-ia__row"><Label>Always one tap away</Label><div className="s2-flow"><div className="s2-node is-global"><b>Search</b></div><div className="s2-node is-global"><b>Cart</b></div><div className="s2-node is-global"><b>Ask Lola</b></div></div></div>
            <div className="s2-ia__row"><Label>Ordering</Label><div className="s2-flow"><div className="s2-node"><b>Cart</b></div><span className="s2-arrow" aria-hidden="true">→</span><div className="s2-node"><b>Checkout</b></div><span className="s2-arrow" aria-hidden="true">→</span><div className="s2-node"><b>Order status</b><span>Placed → packed → on its way</span></div></div></div>
            <div className="s2-ia__row"><Label>Staff</Label><div className="s2-flow"><div className="s2-node"><b>Handheld</b><span>Accept and pick orders</span></div><div className="s2-node"><b>Register</b><span>Weigh, pack, charge the packed total</span></div></div></div>
          </div>
          <div style={{ marginTop: 24 }}><Board src="p-sitemap.jpg" alt="Sitemap of the shipped app with real screens: four tabs, sheets over any screen, checkout and orders, first open, and the staff handheld" cap="The shipped sitemap. Every box is a screen in the app." /></div>
        </div>

        <div className="s2-wide s2-block">
          <div className="s2-step"><Label>Step 5</Label><h3 className="s2-h3">Seven flows, with their failure branches</h3>
            <p className="s2-muted">First open, delivery, pickup, change or cancel, find a product, Ask Lola, and one order seen by the shopper, the staff and the payment.</p></div>
          <div className="s2-boards">
            <Board src="p-flow-sides.jpg" alt="One order from three sides: what the shopper sees, what staff do on the handheld and at the register, and what happens to the payment hold and final charge" cap="One order, three sides: shopper, staff, payment." />
            <Board src="p-flow-find.jpg" alt="Find a product flow: search, browse departments, or ask the store to add an item, with branches for no results and sold out" cap="Find a product: search, browse, or ask the store to add it." />
          </div>
        </div>

        <div className="s2-wide s2-block">
          <div className="s2-step"><Label>Step 6</Label><h3 className="s2-h3">Oct 24 wireframes</h3>
            <p className="s2-muted">The shopper side and the staff side, drawn together so each handoff had a screen on both ends.</p></div>
          <div className="s2-boards">
            <Board src="p-wire-phones.jpg" alt="Oct 24 phone wireframes: home, aisle, cart, checkout and order tracker" cap="Shopper: home, aisle, cart, checkout, tracker." />
            <Board src="p-wire-staff.jpg" alt="Oct 24 staff wireframes: the register with web orders, and the manager's queue" cap="Staff: the register, and the manager’s queue." />
          </div>
        </div>

        <div className="s2-wide s2-block" id="design-system">
          <div className="s2-step"><Label>Step 7</Label><h3 className="s2-h3">The design system</h3>
            <p className="s2-muted">Figma variables become the app’s style values, and 27 shared components build every screen. Foundations first, then the component shoppers see most, in its states and both languages.</p></div>
          <div className="s2-panel s2-sys">
            <div className="s2-sys__found">
              <div>
                <Label>Colour</Label>
                <ul className="s2-sys__sw">{DS_COLOURS.map(([n, hex, use]) => <li key={n}><i style={{ background: hex }} /><b>{n}</b><span>{use}</span><code>{hex}</code></li>)}</ul>
              </div>
              <div>
                <Label>Type</Label>
                <p className="s2-sys__type" style={{ fontFamily: '"Bricolage Grotesque", var(--s2-font)', fontWeight: 800, fontSize: 28, lineHeight: 1.1 }}>Bricolage Grotesque</p>
                <p className="s2-sys__meta">ExtraBold, for display and the store’s voice</p>
                <p className="s2-sys__type" style={{ fontFamily: 'Figtree, var(--s2-font)', fontWeight: 600, fontSize: 22 }}>Figtree $12.99 /lb</p>
                <p className="s2-sys__meta">Text and prices · buttons 17 semibold, 15 in rows and sheets</p>
              </div>
              <div>
                <Label>Space · tap</Label>
                <ul className="s2-sys__space">{DS_SPACE.map((n) => <li key={n}><i style={{ width: n * 3 }} />{n}</li>)}<li className="is-tap"><i />48 tap target</li></ul>
              </div>
              <div>
                <Label>Radius</Label>
                <ul className="s2-sys__rad">{DS_RADIUS.map((n) => <li key={n}><i style={{ borderRadius: n }} />{n}</li>)}<li><i style={{ borderRadius: 999 }} />full</li></ul>
              </div>
            </div>
            <div className="s2-sys__rule" />
            <Label>Product card · four states · English and Spanish</Label>
            <div className="s2-comp" style={{ marginTop: 20 }}>
              {CARD_STATES.map(([src, name, alt]) => (
                <figure key={src}><img src={`${F}/ds3/${src}?v=${V}`} width="121" alt={alt} loading="lazy" /><figcaption>{name}</figcaption></figure>
              ))}
              <span className="s2-vr" aria-hidden="true" />
              <figure lang="es"><img src={`${F}/ds3/card-es.png?v=${V}`} width="121" alt="Spanish card: Chile serrano, Serrano Peppers underneath, Ahorra $0.48" loading="lazy" /><figcaption>Español</figcaption></figure>
            </div>
            <div className="s2-parts">
              {SAME_PARTS.map(([src, name, w]) => (
                <figure key={src}><img src={`${F}/ds2/${src}?v=${V}`} width={w} alt={name} loading="lazy" /><figcaption>{name}</figcaption></figure>
              ))}
            </div>
          </div>
          <div className="s2-comp-text">
            <p>“Sold out today” shows on the card in the aisle, so nobody adds what the store can’t pack. If an item sells out after it’s in the cart, the cart offers a replacement. The aisle, search, the weekly flyer, the product page and the cart all use this card.</p>
            <p>The shopper’s language decides which name leads; the other stays underneath. Search matches either name, so “serrano peppers” and “chile serrano” find the same item.</p>
          </div>
          <p className="s2-note">Designed and built; not yet tested with shoppers.</p>
        </div>
      </Chapter>

      {/* 04 */}
      <Chapter id="decisions" n="06" label="Decisions" title="Three decisions, each with what it cost">
        <div className="s2-wide">
          <section className="s2-decision s2-chain" aria-labelledby="d1">
            <div>
              <h3 id="d1" className="s2-h3">Browse with photos, keep Lola for lists</h3>
              <dl>
                <dt className="s2-label">We saw</dt><dd>Known lists worked in chat; “do you have…?” didn’t. About 600 of 2,800 loyalty customers aren’t on WhatsApp.</dd>
                <dt className="s2-label">We considered</dt><dd>Showing products inside WhatsApp: a second 8,000-item catalog to keep in step with the register.</dd>
                <dt className="s2-label">We chose</dt><dd>An app to browse, search and pay. Lola and staff still take lists, special cuts and big orders.</dd>
                <dt className="s2-label">The cost</dt><dd>Two ordering paths that must agree on price, stock and who owns the order. Saved shopping lists are designed, not built.</dd>
                <dt className="s2-label">Status</dt><dd><div className="s2-status"><span><i />Built</span><span><i />Browsable on the web</span><span className="is-open"><i />Not tested with shoppers</span></div></dd>
              </dl>
            </div>
            <div className="s2-panel"><figure><Screen src="lola-list.jpg" base={HQ} alt="Ask Lola: a pasted shopping list, I found 8 of your 10 items, tap to add" /><figcaption className="s2-cap">Ask Lola with a list: she finds what she can, and asks about the rest.</figcaption></figure></div>
          </section>

          <section className="s2-decision" aria-labelledby="d2">
            <div className="s2-chain s2-chain--text">
              <div>
                <h3 id="d2" className="s2-h3">Weighed items, with a hold</h3>
                <dl>
                  <dt className="s2-label">We saw</dt><dd>Shoppers want the meat price before paying. Fixed-price packs answered that, but meant a second product list drifting from the register.</dd>
                  <dt className="s2-label">We considered</dt><dd>Keeping packs: simple prices, two catalogues to maintain.</dd>
                  <dt className="s2-label">We chose</dt><dd>Pick a weight. The card holds the estimate plus 15%; the register charges the packed total and releases the rest.</dd>
                  <dt className="s2-label">The cost</dt><dd>The hold is bigger than the estimate, which changes what shoppers think they’re paying. Checkout says it once, before they pay:
                    <p className="s2-copy">“Meat and produce are weighed when packed. We hold $X on your card and charge only the exact total.”</p></dd>
                  <dt className="s2-label">Status</dt><dd><div className="s2-status"><span><i />Built</span><span><i />Test orders passed</span><span className="is-open"><i />Not tested with shoppers</span></div></dd>
                </dl>
              </div>
            </div>
            <div className="s2-ba s2-block" style={{ '--n': 3, marginTop: 48 }}>
              <figure><Label>Before · a price per pack (wireframe)</Label><Screen src="d1-before.jpg" alt="October 24 wireframe: Chuck Roll sold in 1, 2 or 4 lb packs at a fixed pack price" /><figcaption>Fixed packs: one more list to keep in step with the register.</figcaption></figure>
              <figure><Label>Shipped · pick a weight</Label><Screen src="product.jpg" base={HQ} alt="Shipped: Ribeye chosen by weight, 1, 2, 3 lb or Other, with a note for the butcher" /><figcaption>Priced by the pound; the butcher weighs the cut.</figcaption></figure>
              <figure><Label>After packing · the exact weight</Label><Screen src="final-total.jpg" base={HQ} alt="Your order is packed: $0.98 back to your card, charged the exact weight" /><figcaption>The difference goes back to the card, said in dollars.</figcaption></figure>
            </div>
          </section>

          <section className="s2-decision" aria-labelledby="d3">
            <div className="s2-chain s2-chain--text">
              <h3 id="d3" className="s2-h3">One order, across shopper and staff</h3>
              <dl>
                <dt className="s2-label">We saw</dt><dd>In chat, staff checked every item by hand, and a missing item meant another round of messages.</dd>
                <dt className="s2-label">We chose</dt><dd>Each handoff is a screen someone acts on. Swaps are the same price or less; if the shopper doesn’t answer in 15 minutes, the item is left out and not charged.</dd>
                <dt className="s2-label">Status</dt><dd><div className="s2-status"><span><i />Built</span><span><i />Test orders passed</span><span className="is-open"><i />Not tested with staff at volume</span></div></dd>
              </dl>
            </div>
            <div className="s2-ba" style={{ '--n': 3, marginTop: 48 }}>
              <figure><Label>1 · Staff accept</Label><Screen src="h-weborders.jpg" alt="Staff handheld: open web orders with the accept countdown" /><figcaption>The order lands on the staff handheld.</figcaption></figure>
              <figure><Label>2 · Staff pick</Label><Screen src="h-picklist.jpg" alt="Staff pick list: have 2 of 3, send a swap to the shopper" /><figcaption>Have 2 of 3: staff propose a swap.</figcaption></figure>
              <figure><Label>3 · Shopper</Label><Screen src="approve-swap.jpg" base={HQ} alt="Shopper approves the swap or leaves the item out" /><figcaption>The shopper approves it or leaves it out; the register charges the packed total.</figcaption></figure>
            </div>
          </section>

          <More title="Other decisions, and what I cut">
            <ul className="s2-list">
              <li><b>Own app.</b> A direct storefront connected to the register, not a marketplace: no 12–16% cut, and the store owns push, live order status, the Wallet pass and order history. Cost: one person builds and maintains it, and every release goes through App Store review.</li>
              <li><b>Drivers.</b> Orders go to a trusted community driver first, who keeps the delivery fee; store staff are the backup. Screening, insurance, liability and tracking still need answers before it can grow.</li>
              <li><b>Payment.</b> Card delivery orders are authorized at checkout and charged for the packed total after weighing. Approved customers can pay at pickup. Once online EBT is approved, it can pay for eligible groceries only, so delivery fees go on store credit or a card.</li>
              <li><b>Colour.</b> Red means act, an ink border means selected, and green only means you save.</li>
              <li><b>Cut.</b> A pop-up on the first screen; offer stickers on product photos (the deal lives on the price); a sample saved card for new customers: helpful-looking, and not true.</li>
            </ul>
          </More>
        </div>
      </Chapter>

      {/* 05 */}
      <Chapter id="service" n="07" label="Service" title="When something goes wrong, and the details">
        <div className="s2-wide">
          <div className="s2-ba" style={{ '--n': 3 }}>
            <figure><Label>Sold out before checkout</Label><Screen src="sold-out.jpg" base={HQ} alt="Ataulfo Mangos sold out while you were shopping: use Ripe Papaya instead, or remove mangos" /><figcaption>A replacement is ready; the shopper decides, before anything is paid.</figcaption></figure>
            <figure><Label>Card declined</Label><Screen src="declined.jpg" base={HQ} alt="Your card was declined: nothing was charged; Apple Pay, a different card, or pay at the register for pickup" /><figcaption>“Nothing was charged” comes first, then what to do.</figcaption></figure>
            <figure><Label>Missing from the order</Label><Screen video="motion-chat.mp4" poster="chat-handoff.jpg" base={HQ} alt="Ask Lola: the shopper says the chorizo was missing; Lola says sorry and connects the store team; the team types, then replies that they are checking the order" /><figcaption>Lola hands it to the store team in the same chat. Shoppers see “La Bodega team”, never a staff name.</figcaption></figure>
          </div>
        </div>

        {/* The one colour moment (Halpin) */}
        <div className="s2-wide s2-block">
          <div className="s2-moment">
            <div>
              <Label>Lola Rewards</Label>
              <p className="s2-statement">Points in the wallet they already carry</p>
              <p>The same card works in the app and in Apple Wallet. The register scans it, and the points update on their own.</p>
            </div>
            <div className="s2-phones">
              <figure><Screen video="d-wallet.mp4" poster="d-wallet-poster.jpg" alt="In-app wallet: tap the Lola Rewards card and it lifts out with its barcode" /><figcaption>In the app</figcaption></figure>
              <figure className="is-up"><Screen video="d-pass.mp4" poster="d-pass-poster.jpg" alt="Apple Wallet pass updating from 180 to 222 points, reward ready" /><figcaption>In Apple Wallet</figcaption></figure>
            </div>
          </div>
          <div className="s2-block">
            <div className="s2-step"><Label>Motion</Label><h3 className="s2-h3">The moments that move</h3>
              <p className="s2-muted">Recorded from the app. Each one confirms something happened: the store opened, the order moved, the points landed.</p></div>
            <div className="s2-panel s2-motion">
              <figure><Screen video="splash-anim.mp4" poster="splash-anim-poster.jpg" base={A} alt="Opening: the La Bodega wordmark and the arch rise" /><figcaption><b>Opening</b>The wordmark, then the arch rises</figcaption></figure>
              <figure><Screen video="d-live.mp4" poster="d-live-poster.jpg" alt="Live Activity on the Lock Screen: received, preparing, on the way, delivered" /><figcaption><b>Lock Screen</b>The order as a Live Activity</figcaption></figure>
              <figure><Screen video="d-points.mp4" poster="d-points-poster.jpg" alt="Points sheet after delivery: 180 counts up to 222, $5 off ready" /><figcaption><b>Points</b>Counted up after delivery</figcaption></figure>
            </div>
          </div>
          <div className="s2-block">
            <div className="s2-step"><Label>Moments of done</Label><h3 className="s2-h3">One success language, built once</h3>
              <p className="s2-muted">A wait that sits where you tapped, a stamp, the words, and a success haptic with the stamp. The same pieces confirm a code, a saved card, a placed order, alerts turned on, and the end of a delivery or a pickup. Recorded from the app.</p></div>
            <div className="s2-panel s2-motion s2-motion--six">
              <figure><Screen video="motion-signin.mp4" poster="motion-signin-poster.jpg" base={HQ} alt="Sign-in code accepted: the code boxes melt into dots, a stamp lands, Code verified, then Welcome back" /><figcaption><b>Code verified</b>The boxes melt into the stamp</figcaption></figure>
              <figure><Screen video="motion-cardsaved.mp4" poster="motion-cardsaved-poster.jpg" base={HQ} alt="Card saved: the button rounds into a disc, a ring circles while it saves, the stamp blooms, Card saved" /><figcaption><b>Card saved</b>The button becomes the stamp</figcaption></figure>
              <figure><Screen video="motion-placed.mp4" poster="motion-placed-poster.jpg" base={HQ} alt="Order placed: Place order, then Payment approved and Sending order to the store check off, the stamp lands on the order page, then Lola takes its place" /><figcaption><b>Order placed</b>Steps check off, then the stamp</figcaption></figure>
              <figure><Screen video="motion-alerts.mp4" poster="motion-alerts-poster.jpg" base={HQ} alt="Alerts on: Turn on all becomes a wait ring where it was tapped, the stamp blooms, Order updates and deals are on, then the sheet closes" /><figcaption><b>Alerts on</b>The tap becomes the wait</figcaption></figure>
              <figure><Screen video="motion-delivered.mp4" poster="motion-delivered-poster.jpg" base={HQ} alt="Order delivered: the stamp lands, then Lola takes its place" /><figcaption><b>Order delivered</b>The stamp lands, then Lola</figcaption></figure>
              <figure><Screen video="motion-pickedup.mp4" poster="motion-pickedup-poster.jpg" base={HQ} alt="Picked up: Picked up. Enjoy! fades in, then the stamp lands" /><figcaption><b>Picked up</b>The same stamp ends a pickup</figcaption></figure>
            </div>
          </div>
          <More title="More screens: every state, the store side and the full delivery diagram">
            <div className="s2-grid-figs s2-grid-figs--phones">
              {GALLERY.map(([src, t, cap]) => (
                <figure key={src}><img src={`${F}/${src}?v=${V}`} alt={`${t}: ${cap}`} loading="lazy" /><figcaption><b>{t}</b> {cap}</figcaption></figure>
              ))}
            </div>
            <p><a href={`${F}/dia-delivery.png?v=${V}`} target="_blank" rel="noopener noreferrer">Open the delivery decisions diagram full size ↗</a><span className="s2-muted"> Diamonds are the app’s questions; red branches are what the shopper sees.</span></p>
          </More>
        </div>
      </Chapter>

      {/* 06 */}
      <Chapter id="outcome" n="08" label="Status" title="Where it stands">
        <div className="s2-wide">
          <div className="s2-three">
            <div>
              <h3>Release status</h3>
              <ul>
                <li>The iPhone app, submitted November 10, 2026, is in App Store review.</li>
                <li>The Android app is approved on Google Play and held for launch.</li>
                <li>The website, <a href="https://shop.labodegacalhoun.com" target="_blank" rel="noopener noreferrer">shop.labodegacalhoun.com</a>, is browse-only. Orders run on test payments until launch.</li>
              </ul>
            </div>
            <div>
              <h3>Verified so far</h3>
              <ul>
                <li>Test orders covered delivery, pickup, a scheduled order, a declined card, every status change and a cancellation.</li>
                <li>That shows the app works. It doesn’t show that customers understand it or will use it.</li>
              </ul>
            </div>
            <div>
              <h3>Next validation</h3>
              <ul>
                <li><b>Can customers order?</b> Checkout completion, split by orders with and without weighed items.</li>
                <li><b>Do they understand the price?</b> Watch shoppers explain the hold; record final-price differences.</li>
                <li><b>Can the store keep up?</b> Orders ready in their window, and the calls and swaps it took.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="s2-wide s2-block">
          <Label>What I’d do first next time</Label>
          <p className="s2-lesson" style={{ marginTop: 16 }}>Design against the real catalogue from day one. That’s what exposed the pack problem.</p>
          <p className="s2-note">Built with Next.js and Capacitor, Stripe, a SwiftUI Live Activity, the WhatsApp Business API and Figma, connected to the store’s register.</p>
          <nav className="s2-end" aria-label="Next">
            <a href="https://shop.labodegacalhoun.com" target="_blank" rel="noopener noreferrer">Browse the store ↗<span className="sr-only"> (opens in a new tab)</span></a>
            <Link to="/projects/produce-kiosk">Next: Produce kiosk →</Link>
            <a href={`mailto:${SITE.email}`}>Get in touch</a>
          </nav>
        </div>
      </Chapter>
    </article>
    <SectionNav />
    <CaseStudyContact />
    </>
  )
}
