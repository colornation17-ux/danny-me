import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { featuredProjects } from '../data/featuredProjects'
import { play } from '../data/projects'
import { projectDestination } from '../lib/projectLinks'

if (typeof window !== 'undefined') gsap.registerPlugin(DrawSVGPlugin)
const REDUCED = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
import CaseStudyContact from './CaseStudyContact'
import SpringWire from './SpringWire'
import '../styles/home-v2.css'

/**
 * Home mock (?home=v2): kinzaghanchi.com's home structure, in Danny's own type, colours and words.
 * Split hero (name mark | one line + currently / previously), a marquee band, an edge-to-edge tile
 * grid (3 squares; a wide + 2 quarters; 2 quarters + a wide), a two-panel about, then contact.
 */
const TYPE = {
  'la-bodega-storefront': 'mobile app', 'produce-kiosk': 'in-store kiosk', lola: 'WhatsApp assistant',
  'la-bodega-ops': 'store operations', 'competitor-watch': 'store analytics', 'bodega-ops': 'data recovery',
  code19: 'website', 'wing-hmi': 'automotive HMI', 'edge-ai': 'vehicle AI',
}
// tile shapes, in order: three squares; a wide and two quarters; two quarters and a wide
/** Tile colours that follow the product's own surface instead of the card colour. */
// Row 3 colour options for review (?row3=a|b|c). a: quiet darks so La Bodega leads · b: each product's own UI colour · c: warm neutrals.
const ROW3 = {
  a: { code19: '#111212', 'wing-hmi': '#1B2140', 'edge-ai': '#2B3A55' },
  b: { code19: '#0E0E0E', 'wing-hmi': '#2A1F5C', 'edge-ai': '#1F5E4F' },
  c: { code19: '#111212', 'wing-hmi': '#36312C', 'edge-ai': '#5E5348' },
}
// Danny picked A (Nov 18); ?row3=b|c still previews the others.
const ROW3_PICK = (typeof window !== 'undefined' && ROW3[new URLSearchParams(window.location.search).get('row3')]) || ROW3.a
const TILE_THEME = {
  'competitor-watch': { fill: '#F7F7F9', ink: '#111212' },
  // Ops: the tile takes the red of its own image, so the phones don't sit on a clashing blue
  'la-bodega-ops': { fill: '#C6182C', ink: '#ffffff' },
  ...(ROW3_PICK ? Object.fromEntries(Object.entries(ROW3_PICK).map(([k, fill]) => [k, { fill, ink: '#ffffff' }])) : {}),
}
/** Tile loops recorded from the real product (seamless, played only while on screen). */
/** [loop video, poster, optional overlay]. CW: the sign-in screen's real dot pattern, with real chart cards on top
 * (sales plan and forecast, shoppers by status, orders per hour), captured from the app Nov 18. */
const LOOP = { 'competitor-watch': ['/work/competitor-watch/tile-grid.mp4?v=1', '/work/competitor-watch/tile-grid-poster.jpg?v=1', '/work/competitor-watch/tile-charts-over.webp?v=1'] }
/** Full-bleed tile art (caption sits on a gradient). */
const BLEED = new Set(['competitor-watch'])
/** Demo videos that sit inside the tile with rounded corners and a soft shadow (no device frame). */
const ROUND = new Set(['wing-hmi', 'edge-ai'])
/** Loglines where the card's line is vague but the project record has the number. */
const LOG = {
  'wing-hmi': '92% task success in a driving simulator.',
  'competitor-watch': 'The store’s own register, read against the chains’ weekly ads, to plan the weekend.',
}
const SHAPE = ['third', 'third', 'third', 'quarter', 'wide', 'quarter', 'quarter', 'quarter', 'wide']

const shortStatus = (s = '') => {
  const t = s.toLowerCase()
  if (t.includes('used daily')) return 'used daily'
  if (t.includes('pre-launch')) return 'pre-launch'
  if (t.includes('live pilot')) return 'live pilot'
  if (t.includes('pilot')) return 'pilot'
  if (t.includes('production')) return 'in production'
  if (t.includes('shipped')) return 'shipped'
  return 'concept'
}

const FIELD = [
  { src: '/work/bodega-ops/store-floor.jpg', where: 'Calhoun, Georgia · Feb 2026', cap: 'La Bodega’s store floor during launch-week recovery', alt: 'La Bodega store floor with yellow carts at the registers' },
  { video: '/work/produce-kiosk/on-the-scale.mp4', poster: '/work/produce-kiosk/on-the-scale-poster.jpg', where: 'Calhoun, Georgia · Nov 2026', cap: 'The produce kiosk on the store’s real scale and scanner', alt: 'Phone video of the produce kiosk on the scale and scanner' },
  { src: '/work/code19/screen-5.jpg', where: 'Indianapolis Motor Speedway · 2024', cap: 'Field research for CODE19 Racing', alt: 'Danny with two people at the Indianapolis Motor Speedway' },
  { src: '/work/code19/screen-6.jpg', where: 'Indianapolis Motor Speedway · 2024', cap: 'Driver and sponsor interviews', alt: 'Danny with members of a racing team at the speedway' },
]

function Field() {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current?.querySelector('video')
    if (!v) return undefined
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.3 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <section className="h2-field" aria-labelledby="h2-field-t" ref={ref}>
      <div className="h2-field__head">
        <h2 id="h2-field-t">From the field</h2>
      </div>
      <ul className="h2-field__row">
        {FIELD.map((f) => (
          <li key={f.src || f.video}>
            <figure>
              <span className="h2-field__img">{f.video
                ? <video src={f.video} poster={f.poster} muted loop playsInline preload="metadata" aria-label={f.alt} />
                : <img src={f.src} alt={f.alt} loading="lazy" />}</span>
              <figcaption><span>{f.where}</span>{f.cap}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Tile({ p, shape }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current?.querySelector('video')
    if (!v) return undefined
    if (REDUCED) return undefined // poster only for reduced motion
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.3 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  const m = p.media
  const href = p.primaryAction?.href || `/projects/${p.slug}`
  const status = shortStatus(p.status)
  return (
    <li ref={ref} className={`h2-tile is-${shape}${LOOP[p.slug] || BLEED.has(p.slug) ? ' is-bleed' : ''}${ROUND.has(p.slug) ? ' is-round' : ''}`} style={{ background: (TILE_THEME[p.slug] || p.theme).fill, color: (TILE_THEME[p.slug] || p.theme).ink }}>
      <Link to={href} aria-label={`${p.title}, ${TYPE[p.slug] || ''}, ${status}`}>
        <span className="h2-tile__media">
          {LOOP[p.slug] ? <>
            <video src={LOOP[p.slug][0]} poster={LOOP[p.slug][1]} muted loop playsInline preload="metadata" aria-hidden="true" />
            {LOOP[p.slug][2] ? <img className="h2-tile__over" src={LOOP[p.slug][2]} alt="" loading="lazy" /> : null}
          </>
            : COVER[p.slug] ? <img src={COVER[p.slug]} alt="" loading="lazy" />
            : m?.kind === 'video'
            ? <video src={m.src} poster={m.poster} muted loop playsInline preload="metadata" aria-hidden="true" />
            : m?.src ? <img src={m.src} alt="" loading="lazy" /> : null}
        </span>
        <span className="h2-tile__doc">
          <span className="h2-tile__meta">
            <span>{String(p.indexLabel).padStart(2, '0')}</span>
            <span>{p.organization} · {p.timeline}</span>
            <span className={`h2-tile__st is-${status.replace(/\s/g, '-')}`}><i aria-hidden="true" />{status}</span>
          </span>
          <span className="h2-tile__title">{p.title} <span className="h2-tile__type">/ {TYPE[p.slug]}</span></span>
          {LOG[p.slug] || p.metric?.value ? <span className="h2-tile__log">{LOG[p.slug] || p.metric.value}</span> : null}
        </span>
      </Link>
    </li>
  )
}

/** Tile art: whole, uncropped screens (the app's own captures in phone frames), or stills from a project's reel. */
const COVER = {
  'la-bodega-storefront': '/work/la-bodega-storefront/tile-phones.webp?v=3',
  'produce-kiosk': '/work/produce-kiosk/tile-tablet.webp',
  code19: '/work/code19/tile-pages.jpg', lola: '/work/lola/tile-cover.jpg',
}

/** The Lab, as tabs: one open panel, the others as narrow upright strips. */
const LAB_TABS = [
  { k: 'pitch', label: 'pitches & school', color: '#ECB22E', ink: '#111212', slugs: ['ocusync', 'stutax'] },
  { k: 'system', label: 'systems & brand', color: '#E01E5A', ink: '#ffffff', slugs: ['loom', 'branding'] },
  { k: 'motion', label: 'motion', color: '#2EB67D', ink: '#111212', slugs: ['motion'] },
]

function Lab() {
  const [open, setOpen] = useState(LAB_TABS[0].k)
  return (
    <div className="h2-lab">
      <h2 className="h2-lab__title"><Link to="/play">lab</Link></h2>
      <div className="h2-lab__tabs">
        {LAB_TABS.map((t) => {
          const on = t.k === open
          const items = t.slugs.map((sl) => play.find((x) => x.slug === sl)).filter(Boolean)
          return (
            <div key={t.k} className={`h2-lab__tab${on ? ' is-on' : ''}`} style={{ background: t.color, color: t.ink }}>
              <button type="button" className="h2-lab__btn" aria-expanded={on} onClick={() => setOpen(t.k)}><span>{t.label}</span></button>
              {on ? (
                <ul className="h2-lab__items">
                  {items.map((it) => {
                    const d = projectDestination(it)
                    return (
                      <li key={it.slug}>
                        <Link to={d.to} className={it.cover ? undefined : 'is-text'}>
                          {it.cover ? <img src={it.cover} alt="" loading="lazy" onError={(e) => { e.currentTarget.parentElement.classList.add('is-text'); e.currentTarget.remove() }} /> : null}
                          <span><b>{it.title}</b>{it.blurb}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** The name, with one ink stroke drawn under it as the page opens. */
function Mark() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED) return undefined
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.15 })
        .from('.h2-mark__kicker', { opacity: 0, y: 10, rotate: -10, duration: 0.5, ease: 'power3.out' })
        .from('.h2-mark__box', { scale: 0.9, rotate: -3, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, 0.1)
        .from('.h2-mark__name span', { yPercent: 60, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'back.out(1.8)' }, 0.3)
    }, el)
    return () => ctx.revert()
  }, [])
  return (
    <div className="h2-mark" ref={ref}>
      <p className="h2-mark__kicker">my name is</p>
      <div className="h2-mark__box">
        <h1 id="h2-name" className="h2-mark__name" aria-label="Danny">{'Danny'.split('').map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}</h1>
      </div>
    </div>
  )
}

/* Hero options (?hero=a | b). A: the name is the one object, one sentence under it.
   B: one big sentence is the hero, the name boxed inside it. Facts only from the site: Indianapolis / Georgia,
   La Bodega's online store, produce kiosk and Lola, CODE19 Racing, open to full-time roles. */
const HERO = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('hero') : null

function HeroA() {
  return (
    <section className="h2-hero h2-heroA" aria-labelledby="h2-name">
      <Mark />
      <p className="h2a-say">
        Product designer between Indianapolis and Georgia, designing La Bodega’s own apps: the online store,
        the produce kiosk and Lola on WhatsApp. Before that, CODE19 Racing. Open to full-time roles,{' '}
        <a href="#contact">say hello</a>.
      </p>
    </section>
  )
}

function HeroB() {
  return (
    <section className="h2-hero h2-heroB" aria-labelledby="h2-name">
      <h1 id="h2-name" className="h2b-line">
        <span className="h2b-name">Danny</span> is a product designer building La Bodega’s own apps: the online store,
        the produce kiosk and Lola on WhatsApp.
      </h1>
      <p className="h2b-sub">Indianapolis and Georgia · before that, CODE19 Racing · open to full-time roles, <a href="#contact">say hello</a></p>
    </section>
  )
}

export default function HomeV2() {
  return (
    <div className="h2v">
      {HERO === 'a' ? <HeroA /> : HERO === 'b' ? <HeroB /> : <section className="h2-hero" aria-labelledby="h2-name">
        <Mark />
        <div className="h2-say">
          <p className="h2-line">A product designer who ships AI into real operations.</p>
          <dl className="h2-record">
            <div><dt>Now</dt><dd>La Bodega, a grocery store in Georgia: AI and store operations</dd></div>
            <div><dt>Before</dt><dd>CODE19 Racing · Indiana University, HCI</dd></div>
            <div><dt>Based</dt><dd>Indianapolis / Georgia</dd></div>
            <div><dt>Open to</dt><dd>Full-time product design roles · <a href="#contact">get in touch</a></dd></div>
          </dl>
        </div>
      </section>}

      <SpringWire className="folio-spring h2-wire" seed={2} radio invite />

      <section id="projects" aria-label="Featured work">
        <ul className="h2-grid">{featuredProjects.map((p, i) => <Tile key={p.id} p={p} shape={SHAPE[i] || 'third'} />)}</ul>
      </section>

      <Field />

      <section className="h2-split" aria-label="About">
        <div className="h2-about">
          <h2 className="h2-hello">Hello World</h2>
          <p>Hi, I’m Danny. I translate complex problem spaces into clear, useful experiences that bridge customer needs and business goals.</p>
          <p>Across conversational AI, retail operations, mobility and high-performance interfaces.</p>
        </div>
        <Lab />
      </section>

      <figure className="h2-rec">
        <blockquote>“Danny brought a rare blend of creative vision and methodical design thinking, ensuring every interface decision was grounded in user insights.”</blockquote>
        <figcaption><img src="/recs/lawrence-walter.png" alt="" /><span><b>Lawrence Walter</b>CEO · Code19 Racing · LinkedIn recommendation</span></figcaption>
      </figure>

      <CaseStudyContact />
    </div>
  )
}

/** Shared with the proof-order mock (?home=v3): the project tiles and the field strip, unchanged. */
export function ProjectGrid() {
  return <ul className="h2-grid">{featuredProjects.map((p, i) => <Tile key={p.id} p={p} shape={SHAPE[i] || 'third'} />)}</ul>
}
export { Field }
