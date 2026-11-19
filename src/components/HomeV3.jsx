import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProjectGrid, Field } from './HomeV2'
import { SITE } from '../data/site'
import '../styles/home-v3.css'

/**
 * Home mock (?home=v3), round 2. What the reference portfolios do, applied:
 * one type system (Geist, as in the storefront case study), a left-aligned hero with one specific
 * sentence (Rauno, Brian Lovin), proof straight under it (daavvid), then the work, and nothing decorative
 * (qiulin's restraint). No grid paper, no display font, no "my name is", no extra sections.
 */

// La Bodega's own register export, grocery registers only (no restaurant or test registers), full months.
const NUMBERS = [
  ['+26%', 'store sales a day, March to October'],
  ['+19%', 'orders a day: 151 in March, 179 in October'],
  ['74%', 'shopper adoption on Lola Rewards since May, 62.2% active'],  // Danny's figure, Nov 18
  ['$1,800', 'a month in WhatsApp orders, a channel the store didn’t have before May'],
]

function CopyEmail() {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(SITE.email); setDone(true); setTimeout(() => setDone(false), 1800) } catch { /* the mail link still works */ }
  }
  return <button type="button" className="v3-copy" onClick={copy} aria-live="polite">{done ? 'Copied' : 'Copy'}</button>
}

export default function HomeV3() {
  return (
    <div className="v3">
      <section className="v3-hero" aria-labelledby="v3-h1">
        <p className="v3-who">Danny Varghese · Alpharetta, GA</p>
        <h1 id="v3-h1" className="v3-line">Product designer shipping AI into physical operations.</h1>
        <p className="v3-value">
          I design and ship the software stack behind La Bodega, an independent grocer—the online store, a
          vision-based produce kiosk, a WhatsApp shopping assistant (Lola), and the internal tools staff run the
          floor with. Previously at CODE19 Racing and Indiana University (HCI).
        </p>
        <p className="v3-links">
          <a href="#projects">See the work ↓</a>
          <a href={SITE.resume} target="_blank" rel="noopener noreferrer">Resume ↗<span className="sr-only"> (opens in a new tab)</span></a>
        </p>
        <ul className="v3-proof" aria-label="La Bodega since March">
          {NUMBERS.map(([n, l]) => <li key={n}><b>{n}</b><span>{l}</span></li>)}
        </ul>
        <p className="v3-src">La Bodega’s register data, March–October 2026.</p>
      </section>

      <section id="projects" className="v3-work" aria-label="Selected work"><ProjectGrid /></section>

      <div className="v3-field"><Field /></div>

      <section className="v3-about" aria-labelledby="v3-about-t">
        <div className="v3-about__main">
          <h2 id="v3-about-t" className="v3-label">About</h2>
          <p className="v3-about__lead">I’m Danny, a product designer in Alpharetta, Georgia. I design the whole service, not just the screens.</p>
          <dl className="v3-how">
            <div><dt>Research</dt><dd>I start with the people who use it: store staff, customers, the local drivers.</dd></div>
            <div><dt>Design</dt><dd>What staff do, what customers see, and what happens when something goes wrong.</dd></div>
            <div><dt>Build</dt><dd>I build the front end with AI tools, so ideas get tested in the store, not only in Figma.</dd></div>
          </dl>
        </div>
        <aside className="v3-about__side">
          <figure className="v3-quote">
            <blockquote>“Danny brought a rare blend of creative vision and methodical design thinking, ensuring every interface decision was grounded in user insights.”</blockquote>
            <figcaption><img src="/recs/lawrence-walter.png" alt="" /><span><b>Lawrence Walter</b>CEO, Code19 Racing</span></figcaption>
          </figure>
          <p className="v3-before"><span>Before La Bodega</span>CODE19 Racing’s website and fan experience · HCI at Indiana University</p>
        </aside>
      </section>

      <footer className="v3-foot" id="contact" aria-labelledby="v3-foot-t">
        <div className="v3-foot__in">
          <div>
            <h2 id="v3-foot-t" className="v3-foot__line">Hiring a product designer?</h2>
            <p className="v3-foot__sub">I’m open to full-time roles. Email is the fastest way to reach me.</p>
            <p className="v3-foot__mail">
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <CopyEmail />
            </p>
          </div>
          <ul className="v3-foot__links">
            <li><a href={SITE.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></li>
            <li><a href={SITE.resume} target="_blank" rel="noopener noreferrer">Resume, PDF <span aria-hidden="true">↗</span></a></li>
            <li><Link to="/play">Lab <span aria-hidden="true">→</span></Link></li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
