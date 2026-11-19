import { Link } from 'react-router-dom'
import '../../styles/sf-case.css' // .sf-table
import '../../styles/cx-case.css'
import './cw-case-v2.css'
import { Chapter, Row, Figure, SectionNav } from '../cx/Case'
import CaseStudyContact from '../CaseStudyContact'

/*
 * Competitor Watch case study, rebuilt Nov 18 2026 (default; the previous page is at ?v=1).
 * Every screen is the current app with the store's data (local run, Nov 18). Numbers come from the
 * Nov 13 model scorecard; anything not tested is listed as not claimed.
 */
const A = '/work/competitor-watch/v2'

const CHAPTERS = [
  ['problem', 'Problem'],
  ['inputs', 'What I used'],
  ['decisions', 'Decisions'],
  ['market', 'The market'],
  ['store', 'Across the store'],
  ['results', 'Results'],
  ['next', 'Next'],
]

const TESTED = [
  ['Home screen load', '1.8 s', 'down from 14.7 s'],
  ['Which shoppers come back', '0.835', 'AUC, vs 0.777 for a simple rule · 2,205 shoppers'],
  ['Price sensitivity', '32.4%', 'error, vs 35.1% · 106 products'],
  ['Orders per hour', '23.0%', 'error, vs 28.8%'],
]

const NOT_CLAIMED = [
  ['WhatsApp messages bringing people in', 'The holdout was too small (489 of 586 shoppers were messaged), so the test was withdrawn.'],
  ['A weekly sales forecast', 'One week ahead it does no better than a plain average.'],
  ['Weather by department', 'Fails its test; the screen holds it back.'],
  ['The mail pilot', 'The readout is ready; the mail hasn’t gone out.'],
]

export default function CompetitorWatchCaseV2() {
  return (
    <>
      <article className="cw2 cx">
        <header className="cx-wrap">
          <div className="cx-intro cx-intro--solo">
            <div className="cx-intro__text">
              <Link to="/" className="cx-back">← Work</Link>
              <h1 className="cx-h1">Competitor Watch</h1>
              <p className="cx-tag">
                La Bodega’s own register, read against the market around it, so the week gets planned on
                numbers instead of memory.
              </p>
              <dl className="cx-meta">
                <div><dt>Role</dt><dd>Product designer and sole builder, with AI coding tools</dd></div>
                <div><dt>Timeline</dt><dd>Jun–Nov 2026 · live forecasts since Jul 3</dd></div>
                <div><dt>Status</dt><dd>Live, used daily · runs on the store’s computer</dd></div>
              </dl>
            </div>
          </div>
        </header>

        <div className="cw2-band">
          <figure className="cw2-shot cw2-shot--hero">
            <img src={`${A}/home.webp`} width="2000" height="1250"
              alt="Competitor Watch home screen: this week's sales of $38.5K against plan, this month's $96.1K, shoppers expected and came, and what this week can do" />
            <figcaption>Home: is this week on track, and what can it still do. The store’s data, Nov 18.</figcaption>
          </figure>
        </div>

        <div className="cx-wrap cw2-glance">
          <ul className="cx-snap">
            <li><b>Problem</b><span>Chain ads land on Thursday. The weekend was planned from memory, with register exports nobody had time to read.</span></li>
            <li><b>Built</b><span>One app that reads the store’s sales against 18 nearby retailers’ ads, wholesale prices and the weather.</span></li>
            <li><b>Used for</b><span>The weekly call: what to push, what to price, who to bring back.</span></li>
            <li><b>Trust</b><span>Models that fail their test stay off the screen. 4 of 16 pass today.</span></li>
          </ul>
        </div>

        <Chapter id="problem" n="01" label="Problem" title="A small store plans its weekend against chains it can’t see">
          <Row title="For the owner">
            <ul className="cx-list">
              <li>Chain flyers come out Thursday and run through Sunday. Checking them meant opening apps one by one.</li>
              <li>Sales lived in register exports. On a Thursday, nobody had time to read them.</li>
              <li>“Is this week good?” had no quick answer, so ordering and pricing ran on memory.</li>
            </ul>
          </Row>
          <Row title="For the store">
            <ul className="cx-list">
              <li>La Bodega sells meat, produce and Latino staples: the same items the chains put on the front page.</li>
              <li>A wrong guess shows up on Saturday, as an empty shelf or meat that doesn’t sell.</li>
            </ul>
          </Row>
        </Chapter>

        <Chapter id="inputs" n="02" label="What I used" title="The store’s own data first, then the market around it">
          <Row title="Data">
            <ul className="cx-list">
              <li>Register sales since February 2026.</li>
              <li>About 2,800 shoppers who give their phone number at the register.</li>
              <li>Weekly ads from 18 local retailers, plus Latino and national grocers in 15 US metros.</li>
              <li>USDA wholesale and retail prices, and Census, SNAP and postal data for the area.</li>
            </ul>
          </Row>
          <Row title="People">
            <p>
              A survey of 157 shoppers, and the owner’s weekly questions. No formal interviews yet: owner
              interviews are the next research step.
            </p>
          </Row>
        </Chapter>

        <Chapter id="decisions" n="03" label="Decisions" title="Three decisions that shaped it">
          <Row title="1. Explain the week before forecasting it">
            <p>
              “Sales are down” doesn’t tell you what to do. Sales are orders times basket, so the first screen
              splits them. Fewer shoppers means bring people back; smaller baskets means feature bigger items.
            </p>
          </Row>
          <div className="cx-grid cx-grid--body">
            <Figure size="f" src={`${A}/diagnosis.webp`} w={2000} h={944}
              alt="Diagnosis screen: sales equal orders times basket, with 522 orders, a $31.37 basket, 5.58 products per order and $5.62 per product, each against the week before"
              cap="Diagnosis: 58 shoppers came in and 92 went quiet. Orders are down 5.4%, the basket 2.3%." />
          </div>

          <Row title="2. A range, not one number">
            <p>
              A single number reads like a promise. Home shows three: where the week lands at today’s pace,
              what strong weeks like it reached, and the most the store has done. Each one says how it was
              checked.
            </p>
          </Row>
          <div className="cx-grid cx-grid--body">
            <Figure size="f" src={`${A}/week-range.webp`} w={2000} h={625}
              alt="What this week can do: forecast $38.4K, proven $44.5K, potential $45.2K, with $15.6K sold so far"
              cap="Forecast, proven and potential, with what’s sold so far. Held-out weeks missed by 8.5%." />
          </div>

          <Row title="3. Hide what fails its test">
            <p>
              Each of the 16 models has a fixed pass rule, scored on weeks it never saw. A model that doesn’t
              beat a simple baseline doesn’t get a number on screen. Today 4 pass, 1 partly, 7 fail and 4
              aren’t tested yet.
            </p>
          </Row>
        </Chapter>

        <Chapter id="market" n="04" label="The market" title="Shelf prices next to the market, item by item">
          <Row title="Item prices">
            <p>
              The shelf price beside the Atlanta wholesale market and the cheapest market, with nearby chain
              ads called out. Roma tomatoes are $1.59 here; Kroger’s ad says $1.49.
            </p>
          </Row>
          <div className="cx-grid cx-grid--body">
            <Figure size="f" src={`${A}/item-prices.webp`} w={2000} h={1250}
              alt="Competitor deals, Item prices tab for produce: each item's shelf price next to the Atlanta market and the cheapest market, with a Kroger ad at $1.49 on Roma tomatoes"
              cap="Item prices, produce: 53 items, market prices from USDA, updated daily." />
          </div>

          <Row title="What’s rising">
            <p>
              An item counts as a trend only when it rises in two signals: ads, wholesale prices, searches or
              shoppers asking on WhatsApp. A price rise alone usually means short supply, so it never counts by
              itself.
            </p>
          </Row>
          <div className="cx-grid cx-grid--body">
            <Figure size="f" src={`${A}/trending.webp`} w={2000} h={895}
              alt="Trending by region: two items to look into in the Southeast, limes and poblano peppers, each rising in 2 of 3 signals"
              cap="Two to look into this week: limes and poblano peppers. 23 price rises look like supply, not demand." />
          </div>
        </Chapter>

        <Chapter id="store" n="05" label="Across the store" title="The same week, from the shoppers, the flyers and the floor">
          <div className="cx-grid">
            <Figure size="t" src={`${A}/customers.webp`} w={2000} h={1250}
              alt="Customers screen: retention, loyalty and shoppers, with customer experience and repeat visit numbers"
              cap="Customers: who comes back, and how fast Lola answers." />
            <Figure size="t" src={`${A}/marketing.webp`} w={2000} h={1250}
              alt="Marketing screen: this week's flyer, how many shoppers were messaged and how many came in"
              cap="Marketing: each week’s flyer, and who came in after the message." />
            <Figure size="t" src={`${A}/operations.webp`} w={2000} h={1250}
              alt="Operations screen: the weekend plan, with departments to push and the next three days of weather"
              cap="Operations: what to push this weekend, from the weather and the forecast." />
          </div>
        </Chapter>

        <Chapter id="results" n="06" label="Results" title="What’s tested, and what I don’t claim">
          <div className="cw2-two">
            <section aria-labelledby="cw2-tested">
              <h3 id="cw2-tested" className="cw2-two__h">Tested on held-out data</h3>
              <ul className="cw2-nums">
                {TESTED.map(([k, n, s]) => (
                  <li key={k}><span>{k}</span><b>{n}</b><small>{s}</small></li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="cw2-not">
              <h3 id="cw2-not" className="cw2-two__h">Not claimed</h3>
              <ul className="cw2-not">
                {NOT_CLAIMED.map(([k, s]) => (
                  <li key={k}><b>{k}</b><span>{s}</span></li>
                ))}
              </ul>
            </section>
          </div>
          <p className="cx-note">Scores from the model scorecard, Nov 13 2026.</p>
        </Chapter>

        <Chapter id="next" n="07" label="Next" title="Earn the numbers that aren’t there yet">
          <Row title="Next">
            <ul className="cx-list">
              <li>Interview the owner about the weekly call, then cut what doesn’t get used.</li>
              <li>Mail the pilot with a holdout, so the result can be measured.</li>
              <li>Fix or remove the seven failing models.</li>
              <li>Make it work for a second store: store settings and a register connector.</li>
            </ul>
          </Row>
          <Row title="Built with">
            <p>
              React front end · Python backend · forecasts tested against simple baselines · weekly ads via
              Flipp · USDA and BLS prices · read-only register sync.
            </p>
            <nav className="cx-end" aria-label="Next">
              <Link className="cx-end__main" to="/projects/la-bodega-ops">Next: La Bodega Ops →</Link>
              <Link to="/">All work</Link>
            </nav>
          </Row>
        </Chapter>
        <SectionNav sections={CHAPTERS} />
      </article>
      <CaseStudyContact className="cw2-contact" title="Hiring a product designer?" body="I’m open to full-time roles. Email is the fastest way to reach me." />
    </>
  )
}
