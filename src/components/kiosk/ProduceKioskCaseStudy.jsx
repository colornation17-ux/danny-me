import { Link } from 'react-router-dom'
import './produce-kiosk.css'
import '../../styles/sf-case.css' // .sf-table
import '../../styles/cx-case.css'
import { Chapter, Row, Figure, AutoVideo, SectionNav } from '../cx/Case'
import CaseStudyContact from '../CaseStudyContact'

const A = '/work/produce-kiosk'
// bump when screens are re-rendered, so browsers don't keep the old images
const V = '2026-11-10c'
const img = (f) => `${A}/${f}?v=${V}`

/** The main flow, three screens. "Confirm the item" is the real kiosk on the store PC with bananas on the scale. */
const FLOW = [
  ['ui-hello.jpg', '1 · Place the bag on the scale'],
  ['ui-matches.jpg', '2 · Tap the item; the label prints'],
  ['ui-done.jpg', '3 · Print the label and stick it on'],
]

/** Walmart's produce scales, Nov 2026. */
const CHAINS = [
  ['walmart-steps-screen.jpg', 'Before you start: scan with Scan & Go. No word about a membership.'],
  ['walmart-members-screen.jpg', 'After weighing: the weight, and a QR code for Walmart+ members.'],
]

/** Loose produce at other chains (sources in the chapter note). */
// { s: true } = something that chain does well (bold). { u: true } = only at La Bodega (cherry, bold).
const OTHERS = [
  ['Walmart', 'Scan its barcode in the app', { t: 'In the app; members skip the checkout line', s: true }, 'English on the screens we saw', 'Phone, app, membership'],
  ['Lidl Germany', { t: 'Camera suggests, shopper confirms', s: true }, 'Through the Lidl app', 'Not stated', 'Lidl app to scan the label'],
  ['Tops, New York', { t: 'Camera shows the best matches', s: true }, { t: 'On the printed label', s: true }, 'Not stated', 'A dedicated AI scale'],
  ['Kroger KroGo', { t: 'Weighed in the cart, no trip to a scale', s: true }, { t: 'On the cart screen', s: true }, 'Not stated', 'One of the smart carts'],
  ['La Bodega', { t: 'Camera suggests, shopper confirms', s: true }, { t: 'On the screen and the label', s: true }, { t: 'English and Spanish', u: true }, { t: 'Existing register, a camera and an open-source vision model', u: true }],
]

function OtherCell({ c }) {
  if (typeof c === 'string') return <td>{c}</td>
  return <td className={c.u ? 'pk-unique' : 'pk-strong'}>{c.t}</td>
}

/** Floating chapter nav labels (ids match the <Chapter> ids below). */
const CHAPTERS = [
  ['problem', 'Problem'],
  ['chains', 'Others'],
  ['approach', 'Approach'],
  ['decisions', 'Decisions'],
  ['states', 'Recovery'],
  ['next', 'Status'],
]

/** States shown small, after the two explained recoveries. */
const STATES = [
  ['ui-looking.jpg', 'Looking at the produce'],
  ['ui-nocam.jpg', 'No camera: best sellers and search'],
  ['ui-lookup.jpg', 'Price check, nothing on the scale'],
]

/**
 * Line diagram of the label barcode 2104087016207: brackets under each digit group,
 * leader lines to what each part means. The weight (what the scale adds) is in cherry.
 */
const DIGITS = '2104087016207'.split('')
const GROUPS = [
  { from: 0, to: 1, col: 52, a: 'Sold by', b: 'weight' },
  { from: 2, to: 6, col: 152, a: 'Item', b: 'Roma tomato' },
  { from: 7, to: 11, col: 260, a: 'Weight', b: '1.620 lb', key: true },
  { from: 12, to: 12, col: 352, a: 'Check', b: 'digit' },
]
const DX = 24 // digit advance
const X0 = 44 // left edge of the first digit
const groupOf = (i) => GROUPS.findIndex((g) => i >= g.from && i <= g.to)

function BarcodeDiagram() {
  return (
    <figure className="cx-fig cx-h pk-bcd">
      <svg viewBox="0 0 400 140" role="img" aria-labelledby="pk-bcd-t pk-bcd-d">
        <title id="pk-bcd-t">What the label barcode carries</title>
        <desc id="pk-bcd-d">2104087016207: 21 means sold by weight, 04087 is the item (Roma tomato), 01620 is the weight (1.620 lb), and 7 is a check digit.</desc>
        {DIGITS.map((d, i) => (
          <text key={i} x={X0 + DX * i + DX / 2} y="38" className={`pk-bcd__digit ${GROUPS[groupOf(i)].key ? 'is-key' : ''}`}>{d}</text>
        ))}
        {GROUPS.map((g) => {
          const xs = X0 + DX * g.from + 3
          const xe = X0 + DX * (g.to + 1) - 3
          const mid = (xs + xe) / 2
          return (
            <g key={g.a} className={g.key ? 'is-key' : ''}>
              <path className="pk-bcd__line" d={`M${xs} 48 V54 H${xe} V48 M${mid} 54 V68 H${g.col} V84`} />
              <text x={g.col} y="104" className="pk-bcd__a">{g.a}</text>
              <text x={g.col} y="122" className="pk-bcd__b">{g.b}</text>
            </g>
          )
        })}
      </svg>
      <figcaption>The weight is what the scale adds. The register reads it back and charges $2.09.</figcaption>
    </figure>
  )
}

/** Side-by-side flow: the shopper's steps at Walmart's scale vs ours, and where the price appears. */
const VS = [
  {
    name: 'Walmart',
    sum: '4 shopper actions before the price · needs a phone, the app and Walmart+',
    steps: [
      { t: 'Open the Walmart app', tag: 'Phone' },
      { t: 'Scan the produce barcode in the app', tag: 'Phone' },
      { t: 'Put the produce on the scale' },
      { t: 'The scale shows the weight only', sys: true },
      { t: 'Scan the QR code on the screen', tag: 'Phone' },
      { t: 'Walmart+ membership needed', tag: 'Walmart+', sys: true },
      { t: 'See the price, in the app', price: true },
    ],
  },
  {
    name: 'La Bodega',
    us: true,
    sum: '2 shopper actions before the price · nothing to install',
    steps: [
      { t: 'Put the bag on the scale' },
      { t: 'Six choices appear', sys: true },
      { t: 'Tap the item' },
      { t: 'See the price, and a deal if it saves money', price: true },
      { t: 'Stick on the label; the register scans it' },
    ],
  },
]

function FlowCompare() {
  return (
    <div className="pk-vs">
      {VS.map((c) => (
        <section key={c.name} className={`pk-vs__col ${c.us ? 'is-us' : ''}`} aria-label={`${c.name}: ${c.sum}`}>
          <h4 className="pk-vs__name">{c.name}</h4>
          <p className="pk-vs__sum">{c.sum}</p>
          <ol className="pk-vs__steps">
            {c.steps.map((s, i) => (
              <li key={i} className={s.price ? 'is-price' : s.sys ? 'is-sys' : ''}>
                <span className="pk-vs__n" aria-hidden={s.sys ? 'true' : undefined}>
                  {s.price ? '$' : s.sys ? '' : c.steps.slice(0, i + 1).filter((x) => !x.sys && !x.price).length}
                </span>
                <span className="pk-vs__t">{s.t}</span>
                {s.tag ? <span className="pk-vs__tag">{s.tag}</span> : null}
              </li>
            ))}
          </ol>
        </section>
      ))}
      <p className="pk-vs__key">
        <span className="pk-vs__n" aria-hidden="true">1</span> shopper action
        <span className="pk-vs__n pk-vs__n--sys" aria-hidden="true" /> the system responds
        <span className="pk-vs__n pk-vs__n--price" aria-hidden="true">$</span> price shown
      </p>
    </div>
  )
}

export default function ProduceKioskCaseStudy() {
  return (
    <>
    <article className="pk cx cx--kiosk">
      <header className="cx-wrap">
        <div className="cx-intro cx-intro--solo">
          <div className="cx-intro__text">
            <Link to="/" className="cx-back">← Work</Link>
            <h1 className="cx-h1">Produce kiosk</h1>
            <p className="cx-tag">Weigh it, confirm it, print the label. Produce priced in the aisle, not at the register.</p>
            <dl className="cx-meta">
              <div><dt>Role</dt><dd>Sole designer and developer</dd></div>
              <div><dt>Timeline</dt><dd>Nov 2026</dd></div>
              <div><dt>Status</dt><dd>In-store pilot</dd></div>
            </dl>
          </div>
        </div>
      </header>

      <div className="cx-band cx-band--pine">
        <div className="cx-band__pair">
          <figure className="pk-device cx-band__device">
            <div className="pk-device__box">
              <div className="pk-device__screen">
                <AutoVideo src={`${A}/produce-to-choices.mp4`} poster={`${A}/produce-to-choices-poster.jpg`} label="Kiosk screen recording: cilantro, carrots, cabbage and bananas each recognised on the scale" />
              </div>
              <img className="pk-device__frame" src={`${A}/frame-tablet.png`} alt="" aria-hidden="true" />
            </div>
            <figcaption>Cilantro, carrots, cabbage and bananas, each recognized on the scale.</figcaption>
          </figure>
          <figure className="cx-band__clip">
            <AutoVideo src={`${A}/on-the-scale.mp4`} poster={`${A}/on-the-scale-poster.jpg`} label="Phone video of the kiosk on the real scale and scanner: a bag of cilantro, then bananas, each showing choices" />
            <figcaption>On the real scale and scanner.</figcaption>
          </figure>
        </div>
      </div>

      <div className="cx-wrap pk-glance">
        <ul className="cx-snap">
          <li><b>Problem</b><span>Produce was weighed and looked up at the register while the line waited.</span></li>
          <li><b>Built</b><span>A scale in the aisle that suggests the item and prints a barcode label the register reads.</span></li>
          <li><b>For shoppers</b><span>The price at the scale, about 2–3 minutes earlier than at the register.</span></li>
          <li><b>Response time</b><span>Suggestions 0.49 seconds after the bag touches the scale (2 test runs).</span></li>
        </ul>
      </div>

      <Chapter id="problem" n="01" label="Problem" title="Weighing produce at the register slowed the line">
        <Row title="For the store">
          <ul className="cx-list">
            <li>Vendors and prices change often, and deals have to stay in step with the registers.</li>
            <li>Specialty produce from Mexico means lookups on a printed chart of 100+ items.</li>
            <li>The line can’t be worked from a handheld: weighed produce needs the register’s scale.</li>
          </ul>
        </Row>
        <Row title="For the shopper">
          <ul className="cx-list">
            <li>The price shows up at the register, about 2–3 minutes after bagging the produce.</li>
            <li>Deals like 4 limes for $1 are found at the register, too late.</li>
          </ul>
        </Row>
      </Chapter>

      <Chapter id="chains" n="02" label="How others do it" title="We compared app-based weighing, dedicated AI scales and smart carts">
        <div className="cx-grid">
          <div className="cx-f cx-scroll">
            <table className="sf-table sf-table--wide pk-others">
              <thead><tr><th></th><th>How the item is found</th><th>Price before the register</th><th>Language</th><th>What it needs</th></tr></thead>
              <tbody>
                {OTHERS.map((r) => (
                  <tr key={r[0]} className={r[0] === 'La Bodega' ? 'is-us' : ''}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <OtherCell key={i} c={c} />))}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Row title="What we took from it">
          <p>The flow isn’t new: at Lidl and Tops the camera suggests and the shopper confirms, too. As precedent, a Tops manager reports customers like a similar scale. The difference here is no app, both languages, and hardware the store already owned.</p>
        </Row>
        <details className="pk-more">
          <summary>Walmart, step by step: photos and shopper actions</summary>
          <Row title="Walmart, up close">
            <p>The scale shows the weight, not the price. The price comes through the Scan &amp; Go app, which needs a paid Walmart+ membership. The scale only says so after you weigh.</p>
          </Row>
          <div className="cx-grid cx-grid--body">
            {CHAINS.map(([f, t]) => <Figure key={f} size="h" src={img(f)} alt={t} cap={t} />)}
          </div>
          <Row title="Step by step">
            <p>Shopper actions before the price, counted the same way for both.</p>
          </Row>
          <div className="cx-grid cx-grid--body">
            <div className="cx-f"><FlowCompare /></div>
          </div>
        </details>
        <p className="cx-note">Sources: Walmart Help (Scan &amp; Go needs Walmart+); retail-optimiser.de, Nov 2025 (Lidl Germany, Mettler Toledo); DIGI (SM-6000 AI at Tops, Lewiston NY, and its Tops case study, published by DIGI); Kroger (KroGo); Bizerba. Photos: Walmart produce scales, Nov 2026.</p>
      </Chapter>

      <Chapter id="approach" n="03" label="Approach" title="Price produce where it’s picked">
        <Row title="How it works">
          <p>Behind the screen, from scale to register.</p>
        </Row>
        <div className="cx-grid">
          <ol className="cx-pipe" aria-label="From the scale to the register">
            <li><b>Camera + scale</b><span>Photo and weight</span></li>
            <li><b>Image recognition</b><span>Six choices</span></li>
            <li><b>Shopper confirms</b><span>One tap</span></li>
            <li><b>Store prices</b><span>Price and deal</span></li>
            <li><b>Device service</b><span>Prints the label</span></li>
            <li><b>Register</b><span>Scans it as usual</span></li>
          </ol>
        </div>
        <div className="cx-grid">
          {FLOW.map(([f, t]) => <Figure key={f} size="t" src={img(f)} alt={t} cap={t} />)}
        </div>
        <Row title="How fast">
          <p>Suggestions appear 0.49 seconds after the bag touches the scale: the average of 2 test runs with bananas. Recognition itself takes about 70 ms of that.</p>
          <p>That is the system’s response time. The shopper’s full task, from bag down to label in hand, also includes a tap and the print.</p>
        </Row>
        <Row title="Why build it">
          <p>The kiosk only weighs and labels: no cart, no payment. That was the simplest way to take the work off the register.</p>
          <p>Recognition runs on the store’s own PC, so it works offline, costs nothing per scan, and no photos leave the store. Any scanner reads the label, including the handheld used to ring up shoppers in line.</p>
        </Row>
      </Chapter>

      <Chapter id="decisions" n="04" label="Decisions" title="Five decisions, and what they replaced">
        <Row title="1. Suggest, then the shopper confirms">
          <p>We ruled out letting the camera pick on its own: a wrong guess would print a wrong price. Nothing is priced until the shopper taps an item.</p>
          <p>If they tap the wrong one, by mistake or to pay less, the label shows the item’s name in English and Spanish, so the cashier can catch it and void the line. The camera’s picks come first; anything else takes more taps.</p>
        </Row>
        <Row title="2. Six choices, and a way out">
          <p>In our test with 115 catalog photos, the right item was always among the six, and six tiles stay big enough to tap on the 15.6-inch screen. “Don’t see your item?” opens search and browse.</p>
          <p>The kiosk also works without the camera: best sellers and search still get the shopper there. The camera only puts the likely items first.</p>
        </Row>
        <Row title="3. One screen fewer">
          <p>We dropped a separate confirm screen. Tapping a match prints, and “Not this? Change it” on the done screen undoes it.</p>
        </Row>
        <Row title="4. Deals show up at the scale">
          <p>Three limes on the scale: “Add 1 more and get 4 for $1.00.” Shown only when it saves money.</p>
        </Row>
        <div className="cx-grid cx-grid--body">
          <Figure size="h" src={img('ui-nudge.jpg')} alt="Three limes on the scale; the kiosk suggests adding one more for 4 for $1" cap="Three limes: the kiosk suggests a fourth." />
          <Figure size="h" src={img('ui-piece.jpg')} alt="Four limes, 4 for $1.00, label ready to print" cap="Four limes: $1.00." />
        </div>
        <Row title="5. A label that carries the weight">
          <p>A sticker on a tomato only says what it is. Our label also carries the weight, or the deal price, inside the barcode, so the register charges it in one scan, without weighing or looking anything up.</p>
        </Row>
        <div className="cx-grid cx-grid--body">
          <figure className="cx-fig cx-h">
            <img src={`${A}/label-printed.png`} alt="Printed produce label: Roma tomato, 1.620 lb at $1.29/lb, $2.09, barcode 2104087016207" loading="lazy" />
            <figcaption>The printed label: Roma tomatoes, sold by weight.</figcaption>
          </figure>
          <BarcodeDiagram />
        </div>
      </Chapter>

      <Chapter id="states" n="05" label="Recovery" title="When something goes wrong">
        <Row title="It can’t tell what’s on the scale">
          <p>A closed bag or an unusual item gives the camera nothing to match. Instead of an error, the kiosk opens search and browse, with the weight still on screen. It plays no error sound, because nothing went wrong.</p>
        </Row>
        <div className="cx-grid cx-grid--body">
          <Figure size="h" src={img('ui-nomatch.jpg')} alt="We couldn't tell what this is: search by name or browse all produce, weight still shown" cap="A closed bag: search and browse, weight kept." />
        </div>
        <Row title="The label didn’t print">
          <p>The device service checks the printer before and after each print. If it fails, the kiosk says: “Take your bag to the register — the cashier will weigh it there. Nothing is lost.”</p>
        </Row>
        <div className="cx-grid cx-grid--body">
          <Figure size="h" src={img('ui-printfail.jpg')} alt="The label didn't print: take your bag to the register, the cashier will weigh it there" cap="Print failed: the register is the fallback." />
        </div>
        <Row title="Other states">
          <p>It never prints without a steady weight; “Espere…” shows while the bag settles.</p>
        </Row>
        <div className="cx-grid">
          {STATES.map(([f, t]) => <Figure key={f} size="t" src={img(f)} alt={t} cap={t} />)}
        </div>
      </Chapter>

      <Chapter id="next" n="06" label="Status" title="Running in the store as a pilot">
        <Row title="What we’re measuring">
          <ul className="cx-list">
            <li>Share of weighed produce rung up from a kiosk label.</li>
            <li>Cashier time per weighed item, before and after.</li>
            <li>Label scan failures per day.</li>
            <li>How often the right item is among the six, on real bags.</li>
            <li>Produce sales and deal uptake, before and after.</li>
          </ul>
        </Row>
        <Row title="Built with">
          <p>
            Self-service kiosk web app · C# device service for the Magellan scanner-scale and Zebra label
            printer · image recognition model · GS1 variable-measure barcodes · price and promotion sync with
            the store’s POS.
          </p>
          <nav className="cx-end" aria-label="Next">
            <Link className="cx-end__main" to="/projects/la-bodega-storefront">Next: La Bodega online store →</Link>
            <Link to="/">All work</Link>
          </nav>
        </Row>
      </Chapter>
      <SectionNav sections={CHAPTERS} />
    </article>
    <CaseStudyContact />
    </>
  )
}
