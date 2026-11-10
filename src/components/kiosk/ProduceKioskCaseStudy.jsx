import { useState } from 'react'
import { Link } from 'react-router-dom'
import './produce-kiosk.css'
import '../../styles/cx-case.css'
import { Chapter, Row, Figure, AutoVideo } from '../cx/Case'
import CaseStudyContact from '../CaseStudyContact'

const A = '/work/produce-kiosk'
// bump when screens are re-rendered, so browsers don't keep the old images
const V = '2026-11-10c'
const img = (f) => `${A}/${f}?v=${V}`

/** The two sticker barcodes. Tap a part to see what it carries. */
const CODES = [
  {
    name: 'Sold by weight',
    digits: '2104087016207',
    parts: [
      { d: '21', t: 'Prefix 21: price-embedded, by weight' },
      { d: '04087', t: 'Item code: Roma tomato (PLU 4087)' },
      { d: '01620', t: 'Weight: 1.620 lb' },
      { d: '7', t: 'Check digit' },
    ],
    result: 'Register: Roma tomato, 1.62 lb × $1.29/lb = $2.09',
  },
  {
    name: 'Sold by the piece',
    digits: '2304048001004',
    parts: [
      { d: '23', t: 'Prefix 23: price-embedded, by price' },
      { d: '04048', t: 'Item code: limes (PLU 4048)' },
      { d: '00100', t: 'Price: $1.00 (4 for a dollar)' },
      { d: '4', t: 'Check digit' },
    ],
    result: 'Register: limes, 4 for $1.00.',
  },
]

function Barcodes() {
  const [pick, setPick] = useState({ c: 0, p: 1 })
  const code = CODES[pick.c]
  return (
    <div className="pk-demo cx-demo">
      <div className="pk-codes">
        {CODES.map((c, ci) => (
          <div key={c.name} className={`pk-code ${pick.c === ci ? 'is-on' : ''}`}>
            <span className="pk-code__name">{c.name}</span>
            <div className="pk-code__digits" role="group" aria-label={c.name}>
              {c.parts.map((p, pi) => (
                <button
                  type="button"
                  key={pi}
                  className={`pk-digit pk-digit--${pi} ${pick.c === ci && pick.p === pi ? 'is-on' : ''}`}
                  onClick={() => setPick({ c: ci, p: pi })}
                  onMouseEnter={() => setPick({ c: ci, p: pi })}
                >
                  {p.d}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pk-demo__bar pk-codes__out" aria-live="polite">
        <span className="pk-strong">{code.parts[pick.p].t}</span>
        <span>{code.result}</span>
      </div>
    </div>
  )
}

/** The main flow, three screens. "Confirm the item" is the real kiosk on the store PC with bananas on the scale. */
const FLOW = [
  ['ui-hello.jpg', '1 · Place the bag on the scale'],
  ['ui-matches.jpg', '2 · Confirm the item'],
  ['ui-done.jpg', '3 · Print the label and stick it on'],
]

const STATES = [
  ['ui-looking.jpg', 'Looking at the produce'],
  ['ui-nomatch.jpg', 'Not produce: a closed bag'],
  ['ui-nocam.jpg', 'No camera'],
  ['ui-printfail.jpg', 'Label didn’t print'],
  ['ui-lookup.jpg', 'Price check, nothing on the scale'],
  ['ui-browse.jpg', 'Browse by section'],
  ['ui-section.jpg', 'A section: 15 per page, swipe or tap the arrows'],
  ['ui-search.jpg', 'Search, on-screen keyboard'],
  ['ui-help.jpg', 'Help'],
]

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
            <ul className="cx-snap">
              <li><b>Problem</b><span>Every bag of produce was weighed, looked up and priced at the register while the line waited.</span></li>
              <li><b>Built</b><span>A scale in the aisle that suggests the item and prints a label the register reads.</span></li>
              <li><b>Proof</b><span>Identifies produce in 1.15 seconds on a retired register and 0.1 seconds on a laptop. A big-box self-checkout scale we timed takes 3 taps and about 5.5 seconds.</span></li>
            </ul>
            <dl className="cx-meta">
              <div><dt>Role</dt><dd>Sole designer and developer</dd></div>
              <div><dt>Timeline</dt><dd>Nov 2026</dd></div>
              <div><dt>Platform</dt><dd>Odoo 18, kiosk PC, scale and label printer</dd></div>
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
            <figcaption>The screen: produce identified in 1.15 seconds.</figcaption>
          </figure>
          <figure className="cx-band__clip">
            <AutoVideo src={`${A}/on-the-scale.mp4`} poster={`${A}/on-the-scale-poster.jpg`} label="Phone video of the kiosk on the real scale and scanner: a bag of cilantro, then bananas, each showing choices" />
            <figcaption>On the real scale and scanner.</figcaption>
          </figure>
        </div>
      </div>

      <Chapter id="problem" n="01" label="Problem" title="Weighing produce at the register slowed the line">
        <Row title="At the register">
          <ul className="cx-list">
            <li>Every bag is weighed, looked up and priced while the line waits.</li>
            <li>Suppliers change about every other week, and with them the PLU stickers and barcodes.</li>
            <li>Specialty produce from Mexico means lookups on a printed chart of 100+ items.</li>
            <li>Deals like 4 limes for $1 are found at the register, too late.</li>
          </ul>
        </Row>
      </Chapter>

      <Chapter id="approach" n="02" label="Approach" title="Price produce where it’s picked">
        <Row title="Three steps at the scale">
          <p>Weigh, confirm and label next to the produce. Checkout just scans.</p>
        </Row>
        <div className="cx-grid">
          {FLOW.map(([f, t]) => <Figure key={f} size="t" src={img(f)} alt={t} cap={t} />)}
        </div>
      </Chapter>

      <Chapter id="decisions" n="03" label="Decisions" title="Four decisions">
        <Row title="1. The camera suggests, the shopper confirms">
          <p>The camera narrows 100+ items to six photos; the shopper taps one. A wrong guess costs a tap, not a wrong price.</p>
        </Row>
        <Row title="2. Deals show up at the scale">
          <p>Three limes on the scale: “Add 1 more and get 4 for $1.00.” Shown only when it saves money.</p>
        </Row>
        <div className="cx-grid cx-grid--body">
          <Figure size="h" src={img('ui-nudge.jpg')} alt="Three limes on the scale; the kiosk suggests adding one more for 4 for $1" cap="Three limes: the kiosk suggests a fourth." />
          <Figure size="h" src={img('ui-piece.jpg')} alt="Four limes, 4 for $1.00, label ready to print" cap="Four limes: $1.00." />
        </div>
        <Row title="3. A label the register already reads">
          <p>Price-embedded barcodes the registers already scan, so checkout needs no new hardware. Tap a part to see what it carries.</p>
        </Row>
        <div className="cx-grid cx-grid--body">
          <Figure size="h" src={`${A}/label-printed.png`} alt="Printed produce label for Roma tomatoes" cap="The printed label: Roma tomatoes, sold by weight." />
          <div className="cx-h"><Barcodes /></div>
        </div>
        <Row title="4. One price, on hardware the store owns">
          <p>Prices come from Odoo, like the registers. It identifies produce in 1.15 seconds on a retired 8 GB register, and in 0.1 seconds on a laptop.</p>
        </Row>
      </Chapter>

      <Chapter id="states" n="04" label="The work" title="Every state">
        <div className="cx-grid">
          {STATES.map(([f, t]) => <Figure key={f} size="t" src={img(f)} alt={t} cap={t} />)}
        </div>
      </Chapter>

      <Chapter id="next" n="05" label="Status" title="In testing on the store’s kiosk PC">
        <Row title="Next">
          <ul className="cx-list">
            <li>Print labels on the Zebra printer and scan them at a live register.</li>
            <li>Next phase: a dedicated PC for the kiosk, replacing the retired register it runs on today.</li>
            <li>Test with shoppers at peak hours, and count lookups at the register before and after.</li>
          </ul>
        </Row>
        <Row title="Built with">
          <p>
            Odoo 18 module · C# bridge for the Magellan scanner-scale and Zebra label printer · on-device image
            recognition · Figma.
          </p>
          <nav className="cx-end" aria-label="Next">
            <Link className="cx-end__main" to="/projects/la-bodega-storefront">Next: La Bodega online store →</Link>
            <Link to="/">All work</Link>
          </nav>
        </Row>
      </Chapter>
    </article>
    <CaseStudyContact />
    </>
  )
}
