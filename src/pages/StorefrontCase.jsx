import { Link } from 'react-router-dom'
import { useEffect, useId, useRef, useState } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { SITE } from '../data/site'
import CaseStudyContact from '../components/CaseStudyContact'
import '../styles/storefront-case.css' // keeps the Home page's storefront link style
import '../styles/cx-case.css' // shared footer and contact block (body:has(article.cx))
import '../styles/sf2-case.css'

const A = '/work/la-bodega-storefront'
const F = `${A}/flow`
const HQ = `${F}/hq` // 3x exports of the Figma Master frames (1170 x 2532)
const V = '2026-11-18a' // bump when screens are recaptured

/* Rebuilt Nov 15 from docs/STOREFRONT-CASE-OUTLINE.md and the approved style sheet (public/drafts/storefront-case-style.html).
   Rules: one image, one job; each screen appears once; comparisons at the same scale; every number has its period
   and a caveat; methods and raw boards stay collapsed. Phone screens only: it is a mobile app. */

const REDUCED = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* Nov 18 ideas mock (?ideas=1), from the kinzaghanchi.com analysis: in-short strip, tap-through order, stamp marks,
   Lola notes on the reset screens, and a source tag on each screen. The page without the flag is what's live. */
const IDEAS = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('ideas') === '1'

/* Nov 18 mock: one hue for the whole case study (?theme=light | dark) and the motion hero (?hero=motion). */
const QS = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
const THEME = ['light', 'dark'].includes(QS.get('theme')) ? QS.get('theme') : null
const HERO_MOTION = QS.get('hero') === 'motion' || QS.get('tight') !== '0'
/* Nov 18: the tight version (fewer, bigger sections; detail in More panels) is the page. ?tight=0 shows the Nov 16 version. */
const TIGHT = QS.get('tight') !== '0'
if (typeof window !== 'undefined') gsap.registerPlugin(DrawSVGPlugin)

/** The motion hero (Nov 18 v2): the real splash plays and turns into Home, Home steps left for one line, a tidy tree
 *  (trunk, spine, five even arms) brings in five blocks of what the store offers, built as app cards, and each block
 *  grows into the screen that delivers it. All six settle into one row. Plays once when in view; Replay restarts it.
 *  Phones and reduced motion get the final row. */
const HERO_LINE = 'Shop Calhoun’s favorite market with zero app markups.'
const HERO_MARK = 'zero app markups.' // gets the white brush highlight in the end state
const HERO_ICON = {
  weight: <><circle cx="12" cy="5" r="3" /><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" /></>,
  tag: <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r="1" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  truck: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>,
  chat: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></>,
}
const HERO_HOME = { src: 'major-home.jpg', base: A, splash: 'splash-anim.mp4', t: 'Home' }
const HERO_BLOCKS = [
  { icon: 'weight', t: 'Meat cut to order', c: 'Pick the weight; the butcher cuts it', src: 'weight-type.jpg', base: HQ },
  { icon: 'tag', t: 'This week’s deals', c: 'Store prices, in the app', video: 'deals-anim.mp4', poster: 'deals-anim-poster.jpg', base: HQ },
  { icon: 'clock', t: 'Delivery or pickup', c: 'In a half-hour window', src: 'major-sched.jpg', base: A },
  { icon: 'truck', t: 'Delivered by local drivers', c: 'Follow it on your Lock Screen', video: 'd-live.mp4', poster: 'd-live-poster.jpg', base: F },
  { icon: 'chat', t: 'Ask Lola', c: 'In English or Spanish', src: 'chat-handoff.jpg', base: HQ },
]
/** A hand-drawn branch: an S-curve from (x0,y0) to (x1,y1), sampled and nudged with a small seeded wobble (none at the
 *  ends), then smoothed back into curves. Same seed, same line, so it doesn't change on every render. */
function inkPath(x0, y0, x1, y1, seed, amp = 2.6) {
  let r = seed * 9301 + 49297
  const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280 - 0.5 }
  const dx = x1 - x0
  const bez = (t) => {
    const c1x = x0 + dx * 0.42, c2x = x0 + dx * 0.58
    const u = 1 - t
    return [u * u * u * x0 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x1,
      u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1]
  }
  const n = 16, pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, [x, y] = bez(t), [x2, y2] = bez(Math.min(1, t + 0.01))
    const len = Math.hypot(x2 - x, y2 - y) || 1, nx = -(y2 - y) / len, ny = (x2 - x) / len
    const w = Math.sin(Math.PI * t) * amp * rnd() * 2
    pts.push([x + nx * w, y + ny * w])
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d
}
const SPLASH_CUT = 2.7 // seconds of the splash: the arch, Lola and "Your neighborhood market"
const DEAL_TAGS = ['New deals every week', '2× points Tue & Wed', 'Free pickup']
/** The rotating pill: what the app does, plus Lola Rewards (1 point per $1 on every order). */
const TICKER = [HERO_BLOCKS[0], HERO_BLOCKS[1], { icon: 'gift', t: 'Points on every order' }, ...HERO_BLOCKS.slice(2)]
function HeroTicker() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (REDUCED) return undefined
    const id = setInterval(() => setI((n) => (n + 1) % TICKER.length), 2400)
    return () => clearInterval(id)
  }, [])
  const b = TICKER[i]
  return (
    <p className="hm-ticker">
      <span className="hm-block__icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{HERO_ICON[b.icon]}</svg></span>
      <span className="hm-ticker__win"><span key={i} className="hm-ticker__item">{b.t}</span></span>
    </p>
  )
}
function HeroMotion() {
  const stage = useRef(null)
  const splash = useRef(null)
  const tl = useRef(null)
  const [done, setDone] = useState(false)
  const [canPlay, setCanPlay] = useState(false)
  useEffect(() => {
    const el = stage.current
    if (!el) return undefined
    if (REDUCED || window.innerWidth < 900) { setDone(true); return undefined }
    setCanPlay(true)
    const ctx = gsap.context(() => {
      const S = el.getBoundingClientRect()
      const W = S.width, H = S.height
      const rel = (r) => ({ x: r.left - S.left, y: r.top - S.top, w: r.width, h: r.height })
      const phones = [...el.querySelectorAll('.hm-phone')]
      const P = phones.map((ph) => rel(ph.getBoundingClientRect()))
      const SCR = phones.map((ph) => rel(ph.querySelector('.s2-dev__screen').getBoundingClientRect()))
      const at = (cx, cy, sc) => ({ x: cx - (P[0].x + P[0].w / 2), y: cy - (P[0].y + P[0].h / 2), scale: sc })
      const MAIN = { cx: W * 0.17, cy: H * 0.5, s: 1.16 }
      // the tree: trunk from Home's right edge, a spine, five even arms to an aligned column of blocks
      const BW = 330, BH = 64, GAP = 16, N = HERO_BLOCKS.length
      const colH = N * BH + (N - 1) * GAP, top0 = (H - colH) / 2
      const bx = W * 0.5, spineX = bx - 40
      const ys = HERO_BLOCKS.map((_, k) => top0 + k * (BH + GAP) + BH / 2)
      const sx = MAIN.cx + (P[0].w * MAIN.s) / 2 + 14
      void spineX
      el.querySelectorAll('.hm-ink').forEach((a, k) => a.setAttribute('d', inkPath(sx, MAIN.cy, bx - 16, ys[k], k + 3, 0)))
      el.querySelectorAll('.hm-ghost').forEach((a, k) => a.setAttribute('d', inkPath(sx, MAIN.cy + 1.5, bx - 18, ys[k] + 1.5, k + 11, 3.4)))
      const blocks = [...el.querySelectorAll('.hm-block')]
      blocks.forEach((b, k) => gsap.set(b, { left: bx, top: ys[k] - BH / 2, width: BW, height: BH }))
      const inks = el.querySelectorAll('.hm-ink'), ghosts = el.querySelectorAll('.hm-ghost')
      const words = el.querySelectorAll('.hm-word'), splashEl = el.querySelector('.hm-splash')
      const endBits = el.querySelectorAll('.hm-end__label, .hm-eword, .hm-end .hm-ticker'), tagsEnd = el.querySelectorAll('.hm-dtag')
      const t = gsap.timeline({ paused: true, onComplete: () => setDone(true) })
      t.set(endBits, { opacity: 0, x: -20 }).set(tagsEnd, { opacity: 0, scale: 0.7 })
        .set(el.querySelectorAll('.hm-mark__brush'), { scaleX: 0 }).set(el.querySelector('.hm-mark__txt'), { color: '#ffffff' })
      t.set(phones, { opacity: 0, transformOrigin: '50% 50%' })
        .set(phones[0], { ...at(W * 0.5, H * 0.5 + 60, 1.3), opacity: 0 })
        .set(splashEl, { opacity: 0 })
        .set([...inks, ...ghosts], { drawSVG: '0%' })
        .set(words, { opacity: 0, y: 14 })
        .set(blocks, { opacity: 0, x: -28, y: 0, borderRadius: 16 })
        .set(el.querySelectorAll('.hm-block__shot'), { opacity: 0 })
        .set(el.querySelectorAll('.hm-block__card'), { opacity: 1 })
      blocks.forEach((b, k) => t.set(b, { left: bx, top: ys[k] - BH / 2, width: BW, height: BH }))
      // 1. Home slides up in the middle (version 1's opening)
      t.to(phones[0], { opacity: 1, y: `-=60`, duration: 0.8, ease: 'power3.out' }, 0.2)
      // 2. Home steps left; the line (version 1's pacing)
      const T2 = 1.1
      t.to(phones[0], { ...at(MAIN.cx, MAIN.cy, MAIN.s), duration: 0.9, ease: 'power3.inOut' }, T2)
        .to(words, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' }, T2 + 0.5)
        .to(words, { opacity: 0, y: -10, duration: 0.3, stagger: 0.02, ease: 'power2.in' }, T2 + 2.2)
      // 3. the tree draws; the blocks slide in
      const T3 = T2 + 2.4
      t.to(inks, { drawSVG: '100%', duration: 0.9, stagger: 0.09, ease: 'power2.inOut' }, T3)
        .to(ghosts, { drawSVG: '100%', duration: 0.9, stagger: 0.09, ease: 'power2.inOut' }, T3 + 0.08)
        .to(blocks, { opacity: 1, x: 0, duration: 0.5, stagger: 0.09, ease: 'power3.out' }, T3 + 0.5)
      // Float's bob: each tag drifts up about 7 px and back on its own slow beat while they hold
      blocks.forEach((b, k) => t.to(b, { y: -6, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: 1 }, T3 + 1.0 + k * 0.12))
      // 4. hold, then the lines go and each block grows into its screen while Home takes its place in the row
      const T4 = T3 + 1.9
      t.to([...inks, ...ghosts], { drawSVG: '100% 100%', duration: 0.45, ease: 'power2.in' }, T4)
        .to(phones[0], { x: 0, y: 0, scale: 1, duration: 1, ease: 'power3.inOut' }, T4 + 0.1)
      blocks.forEach((b, k) => {
        const r = SCR[k + 1]
        // move first, grow late: the cards spread out before they become screens, so they never pile up
        const tk = T4 + 0.15 + k * 0.07
        t.to(b.querySelector('.hm-block__card'), { opacity: 0, duration: 0.2 }, tk)
          .to(b, { left: r.x + r.w * 0.5 - BW * 0.22, top: r.y + r.h * 0.42, width: BW * 0.44, height: BH * 1.6, borderRadius: 14, duration: 0.55, ease: 'power3.inOut' }, tk)
          .to(b, { left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.w * 0.144, duration: 0.5, ease: 'power3.out' }, tk + 0.5)
          .to(b.querySelector('.hm-block__shot'), { opacity: 1, duration: 0.25 }, tk + 0.1)
      })
      t.to(phones.slice(1), { opacity: 1, duration: 0.25, stagger: 0.07 }, T4 + 1.1)
        .to(blocks, { opacity: 0, duration: 0.2, stagger: 0.07 }, T4 + 1.3)
      // 5. the line lands on the left with the value pill and the deal tags, while the wall settles
        .to(endBits, { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }, T4 + 0.55)
        .to(tagsEnd, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }, T4 + 1.15)
        .to(el.querySelectorAll('.hm-mark__brush'), { scaleX: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' }, T4 + 1.0)
        .to(el.querySelector('.hm-mark__txt'), { color: '#8e0029', duration: 0.3, ease: 'power1.out' }, T4 + 1.12)
      t.time(0.001, true)
      t.timeScale(1.3) // about 6 s end to end
      tl.current = t
    }, el)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { tl.current?.play(); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); ctx.revert() }
  }, [])
  const replay = () => { setDone(false); tl.current?.restart() }
  const flow = [HERO_HOME, ...HERO_BLOCKS]
  return (
    <div className={`hm${done ? ' is-done' : ''}${canPlay ? ' is-anim' : ''}`} ref={stage}>
      <svg className="hm-lines" aria-hidden="true">
        <defs />
        <g>
          {HERO_BLOCKS.map((b) => <path key={b.t} className="hm-ink" d="M0,0" />)}
        </g>
      </svg>
      <p className="hm-text" aria-hidden="true">{HERO_LINE.split(' ').map((w, k) => <span key={k} className="hm-word">{w}</span>)}</p>
      <div className="hm-end">
        <span className="hm-end__label">La Bodega app</span>
        <p className="hm-end__line">
          {HERO_LINE.slice(0, HERO_LINE.indexOf(HERO_MARK)).trim().split(' ').map((w, k) => <span key={k} className="hm-eword">{w}</span>)}
          <span className="hm-eword hm-mark"><span className="hm-mark__brush" aria-hidden="true" /><span className="hm-mark__brush is-b" aria-hidden="true" /><span className="hm-mark__txt">{HERO_MARK}</span></span><span className="hm-mark__end">{HERO_LINE.slice(HERO_LINE.indexOf(HERO_MARK) + HERO_MARK.length)}</span>
        </p>
        <HeroTicker />
        <div className="hm-dtags">{DEAL_TAGS.map((d) => <span key={d} className="hm-dtag"><span>{d}</span></span>)}</div>
      </div>
      <div className="hm-row">
        {flow.map((s, k) => (
          <div className="hm-phone" key={s.t}>
            <Screen src={s.src} video={done ? s.video : undefined} poster={s.poster} base={s.base} alt={s.c ? `${s.t}: ${s.c}` : s.t} noTag>
              {k === 0 ? <video ref={splash} className="hm-splash" src={`${A}/${HERO_HOME.splash}?v=${V}`} muted playsInline preload="metadata" aria-hidden="true" /> : null}
            </Screen>
          </div>
        ))}
      </div>
      {HERO_BLOCKS.map((b) => (
        <div key={b.t} className="hm-block" aria-hidden="true">
          <img className="hm-block__shot" src={`${b.base}/${b.src || b.poster}?v=${V}`} alt="" />
          <div className="hm-block__card">
            <span className="hm-block__icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{HERO_ICON[b.icon]}</svg></span>
            <span><b>{b.t}</b><span>{b.c}</span></span>
          </div>
        </div>
      ))}
      {canPlay && done ? <button type="button" className="hm-replay" onClick={replay}>Replay</button> : null}
    </div>
  )
}

/** Where each screen came from, only where it's known for sure. Anything not listed gets no tag. */
const SOURCE = {
  'search-results.jpg': 'App capture', 'aisle-meat.jpg': 'App capture', 'chat-handoff.jpg': 'App recording',
  'deals-anim.mp4': 'App recording', 'motion-signin.mp4': 'App recording', 'motion-cardsaved.mp4': 'App recording',
  'motion-placed.mp4': 'App recording', 'motion-alerts.mp4': 'App recording', 'motion-delivered.mp4': 'App recording',
  'motion-pickedup.mp4': 'App recording', 'motion-chat.mp4': 'App recording',
  'product.jpg': 'Figma', 'weight-type.jpg': 'Figma', 'final-total.jpg': 'Figma', 'approve-swap.jpg': 'Figma',
  'sold-out.jpg': 'Figma', 'declined.jpg': 'Figma', 'oct6-aisle.jpg': 'Figma · Oct 6',
  'd-live.mp4': 'Rebuilt from the app’s code',
}

/** The app's stamp (a scalloped seal with a check), landing once when it scrolls into view. */
const SEAL = (() => {
  const pts = []
  const n = 72
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    const r = 46 + 3.2 * Math.cos(a * 12)
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
})()
function Stamp({ size = 28 }) {
  const ref = useRef(null)
  const [inView, setIn] = useState(REDUCED)
  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED || typeof IntersectionObserver === 'undefined') { setIn(true); return undefined }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect() } }, { threshold: 0.9 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <svg ref={ref} className={`s2-stamp${inView ? ' is-in' : ''}`} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <path d={SEAL} fill="#8E0029" />
      <path d="M31 51 l13 13 l26 -28" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Lola pointing something out on a screen (her real app art, cropped to a badge). */
function LolaNote({ who = 'think', at, side = 'right', children }) {
  return (
    <span className={`s2-lola s2-lola--${side}`} style={at}>
      <img src={`${A}/lola/lola-${who}-head.png?v=${V}`} alt="" aria-hidden="true" />
      <span className="s2-lola__say">{children}</span>
    </span>
  )
}

/** One order, start to finish: tap the phone or a step to move through the real screens. */
const TAP_STEPS = [
  { src: 'major-home.jpg', base: A, t: 'Open the store', c: 'Delivery to the door, this week’s deals, shop by brand.' },
  { src: 'weight-type.jpg', base: HQ, t: 'Pick a weight', c: 'Meat by the pound: 1, 2 or 3 lb, or type your own.' },
  { src: 'major-sched.jpg', base: A, t: 'Choose a time', c: 'Delivery or pickup, in a half-hour window.' },
  { video: 'motion-placed.mp4', poster: 'motion-placed-poster.jpg', base: HQ, t: 'Place the order', c: 'Payment approved, sent to the store, then the stamp.' },
  { video: 'd-live.mp4', poster: 'd-live-poster.jpg', base: F, t: 'Follow it', c: 'The order moves on the Lock Screen as the store packs it.' },
  { video: 'motion-delivered.mp4', poster: 'motion-delivered-poster.jpg', base: HQ, t: 'Delivered', c: 'The stamp lands, then Lola, and the points.' },
]
function TapPhone() {
  const [i, setI] = useState(0)
  const s = TAP_STEPS[i]
  const next = () => setI((i + 1) % TAP_STEPS.length)
  return (
    <div className="s2-tap">
      <button type="button" className="s2-tap__phone" onClick={next} aria-label={`Step ${i + 1} of ${TAP_STEPS.length}: ${s.t}. Show the next step`}>
        <Screen key={i} src={s.src} video={s.video} poster={s.poster} base={s.base} alt={`${s.t}: ${s.c}`} noTag />
        <span className="s2-tap__hint" aria-hidden="true">{i < TAP_STEPS.length - 1 ? 'Tap for the next step' : 'Tap to start again'}</span>
      </button>
      <ol className="s2-tap__steps">
        {TAP_STEPS.map((st, k) => (
          <li key={st.t}>
            <button type="button" className={k === i ? 'is-on' : ''} aria-current={k === i ? 'step' : undefined} onClick={() => setI(k)}>
              <span className="s2-tap__n">{k + 1}</span><span><b>{st.t}</b><span>{st.c}</span></span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

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
function Screen({ src, alt, base = F, video, poster, children, noTag }) {
  const tag = IDEAS && !noTag ? SOURCE[video || src] : null
  if (!video && !src && poster) src = poster
  const media = video && !REDUCED
    ? <AutoVideo src={`${base}/${video}?v=${V}`} poster={`${base}/${poster}?v=${V}`} label={alt} />
    : <img src={`${base}/${video ? poster : src}?v=${V}`} alt={alt} loading="lazy" />
  return (
    <div className="s2-dev">
      <div className="s2-dev__screen">{media}{children}</div>
      {tag ? <span className="s2-src">{tag}</span> : null}
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
  const LIST = TIGHT ? SECTIONS.filter(([id]) => id !== 'evidence') : SECTIONS
  const [at, setAt] = useState(LIST[0][0])
  const ref = useRef(null)
  useEffect(() => {
    const heads = LIST.map(([id]) => document.getElementById(id)).filter(Boolean)
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
      {LIST.map(([id, label]) => (
        <a key={id} href={`#${id}`} className={at === id ? 'is-at' : ''} aria-current={at === id ? 'true' : undefined}
          onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }) }}>{label}</a>
      ))}
    </nav>
  )
}

function DirTable() {
  return (
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
  )
}

function TightIA({ sitemap }) {
  return (
    <>
      <div className="s2-panel s2-ia" aria-label="Where things live">
        <div className="s2-ia__row"><Label>Four tabs</Label><div className="s2-flow"><div className="s2-node"><b>Home</b><span>Start shopping</span></div><div className="s2-node"><b>Shop</b><span>Departments → product</span></div><div className="s2-node"><b>Deals</b><span>This week’s offers</span></div><div className="s2-node"><b>Account</b><span>Orders, rewards, settings</span></div></div></div>
        <div className="s2-ia__row"><Label>Always one tap away</Label><div className="s2-flow"><div className="s2-node is-global"><b>Search</b></div><div className="s2-node is-global"><b>Cart</b></div><div className="s2-node is-global"><b>Ask Lola</b></div></div></div>
        <div className="s2-ia__row"><Label>Staff</Label><div className="s2-flow"><div className="s2-node"><b>Handheld</b><span>Accept and pick orders</span></div><div className="s2-node"><b>Register</b><span>Weigh, pack, charge the packed total</span></div></div></div>
      </div>
      <div className="s2-boards" style={{ marginTop: 24 }}>
        {sitemap ? <Board src="p-sitemap.jpg" alt="Sitemap of the shipped app with real screens: four tabs, sheets over any screen, checkout and orders, first open, and the staff handheld" cap="The shipped sitemap: every box is a screen." /> : null}
        {<Board src="p-flow-find.jpg" alt="Find a product flow: search, browse departments, or ask the store to add an item, with branches for no results and sold out" cap="Find a product: search, browse, or ask the store to add it." />}
        <Board src="p-wire-phones.jpg" alt="Oct 24 phone wireframes: home, aisle, cart, checkout and order tracker" cap="Oct 24 shopper wireframes." />
        <Board src="p-wire-staff.jpg" alt="Oct 24 staff wireframes: the register with web orders, and the manager's queue" cap="Oct 24 staff wireframes." />
      </div>
    </>
  )
}

/* ---------- hand-drawn diagrams (?tight=1): ink lines roughened by an SVG noise filter, drawn in on scroll ---------- */
function ring({ x, y, w, rx: RX, ry: RY }) {
  const rx = RX || w * 0.62, ry = RY || 54
  return `M${x - rx},${y + 6} C${x - rx},${y - ry * 1.33} ${x + rx},${y - ry * 1.33} ${x + rx},${y} C${x + rx},${y + ry * 1.33} ${x - rx - 8},${y + ry * 1.3} ${x - rx + 4},${y - 8} C${x - rx + 6},${y - 30} ${x - rx * 0.8},${y - ry * 0.8} ${x - rx * 0.5},${y - ry * 0.95}`
}

function useNarrow(q = '(max-width: 760px)') {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

/** Picks the stacked layout on phones; remounts so the arrowheads are measured for the layout on screen. */
function SketchR({ d, m }) {
  const narrow = useNarrow()
  const cfg = narrow && m ? { ...m, label: d.label, phone: true } : d
  return <Sketch key={narrow ? 'm' : 'd'} {...cfg} />
}

function Sketch({ w = 1000, h, nodes, edges, tags = [], label, phone }) {
  const ref = useRef(null)
  const fid = `sk${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    // arrowheads: a small open V at the end of each line, from the path's own end tangent
    el.querySelectorAll('.sk-line').forEach((ln, i) => {
      const head = el.querySelector(`.sk-head[data-i="${i}"]`)
      if (!head) return
      const L = ln.getTotalLength(), a = ln.getPointAtLength(L), b = ln.getPointAtLength(Math.max(0, L - 10))
      const ang = Math.atan2(a.y - b.y, a.x - b.x), s1 = ang + 2.6, s2 = ang - 2.6, k = 11
      head.setAttribute('d', `M${a.x + k * Math.cos(s1)},${a.y + k * Math.sin(s1)} L${a.x},${a.y} L${a.x + k * Math.cos(s2)},${a.y + k * Math.sin(s2)}`)
    })
    if (REDUCED) return undefined
    const lines = el.querySelectorAll('.sk-line'), heads = el.querySelectorAll('.sk-head'), bits = el.querySelectorAll('.sk-node, .sk-tag, .sk-ring')
    gsap.set(lines, { drawSVG: '0%' })
    gsap.set(heads, { opacity: 0 })
    gsap.set(bits, { opacity: 0, y: 6 })
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      gsap.timeline()
        .to(bits, { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out' })
        .to(lines, { drawSVG: '100%', duration: 0.6, stagger: 0.14, ease: 'power2.inOut' }, 0.25)
        .to(heads, { opacity: 1, duration: 0.15, stagger: 0.14 }, 0.8)
    }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div className={`sk-wrap${phone ? ' is-m' : ''}`}>
      <svg ref={ref} className={`sk${phone ? ' is-m' : ''}`} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
        <defs>
          <filter id={fid} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="1" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="1.8" />
          </filter>
          {tags.filter((t) => t.path).map((t, i) => <path key={t.t} id={`${fid}t${i}`} d={t.path} fill="none" />)}
        </defs>
        <g filter={`url(#${fid})`}>
          {nodes.filter((n) => n.ring).map((n) => (
            <path key={`r${n.t}${n.x}`} className="sk-ring" d={ring(n)} />
          ))}
          {edges.map((e, i) => <path key={`l${i}`} className={`sk-line${e.tone ? ` is-${e.tone}` : ''}`} d={e.d} />)}
          {edges.map((e, i) => <path key={`h${i}`} data-i={i} className={`sk-head${e.tone ? ` is-${e.tone}` : ''}`} />)}
        </g>
        {tags.filter((t) => !t.path).map((t) => <text key={t.t} className={`sk-tag${t.tone ? ` is-${t.tone}` : ''}`} x={t.x} y={t.y} textAnchor={t.a || 'middle'}>{t.t}</text>)}
        {tags.filter((t) => t.path).map((t, i) => <text key={t.t} className={`sk-tag${t.tone ? ` is-${t.tone}` : ''}`}><textPath href={`#${fid}t${i}`} startOffset="50%" textAnchor="middle">{t.t}</textPath></text>)}
        {nodes.map((n) => (
          <foreignObject key={n.t + n.x} className="sk-node" x={n.x - n.w / 2} y={n.y - 55} width={n.w} height="110">
            <div className={`sk-box${n.tone ? ` is-${n.tone}` : ''}`}><b>{n.t}</b>{n.s ? <span>{n.s}</span> : null}</div>
          </foreignObject>
        ))}
      </svg>
    </div>
  )
}

/* ---------- story strips (?tight=1): ink panels drawn in left to right, captions in the case study's own words ---------- */
const bag = (x, k) => (
  <g key={x}>
    <path className="st-ln" d={`M${x},176 L${x + 3},134 L${x + 25},134 L${x + 28},176 Z`} />
    <path className="st-ln" d={`M${x + 8},134 C${x + 8},122 ${x + 20},122 ${x + 20},134`} />
    <path className="st-ln" d={k === 0 ? `M${x + 6},134 L${x + 2},118 M${x + 12},134 L${x + 13},114` : k === 1 ? `M${x + 18},134 L${x + 22},116` : `M${x + 9},134 L${x + 6},120 M${x + 16},134 L${x + 19},118`} />
    <circle className="st-ln is-red" cx={x + 14} cy={157} r="8" />
    <text className="st-txt is-red" x={x + 14} y={161} textAnchor="middle">{k + 1}</text>
  </g>
)
const STORY_DRIVER = [
  {
    cap: 'Local cab drivers took ride calls around town: a pick-up here, a drop-off there. The drivers we spoke with said the delivery apps paid too little once they counted gas and time.',
    art: (
      <>
        <rect className="st-ln" x="18" y="46" width="66" height="116" rx="12" />
        <path className="st-ln" d="M40,56 L62,56" />
        <text className="st-txt is-sm" x="51" y="96" textAnchor="middle">CALLING</text>
        <circle className="st-ln is-red" cx="51" cy="126" r="13" />
        <path className="st-ln is-red" d="M45,122 C45,130 50,134 57,132" />
        <path className="st-ln" d="M92,62 C100,68 100,80 92,86 M100,54 C114,64 114,88 100,98" />
        <path className="st-ln" d="M134,160 C122,146 120,138 134,128 C148,138 146,146 134,160 Z" />
        <circle className="st-ln" cx="134" cy="141" r="4" />
        <path className="st-ln" d="M146,154 C186,176 200,112 236,118 C258,122 266,102 278,90" />
        <path className="st-ln is-red" d="M290,84 C278,70 276,62 290,52 C304,62 302,70 290,84 Z" />
        <circle className="st-ln is-red" cx="290" cy="65" r="4" />
        <text className="st-txt is-sm" x="134" y="182" textAnchor="middle">PICK-UP</text>
        <text className="st-txt is-sm" x="290" y="40" textAnchor="middle">DROP-OFF</text>
      </>
    ),
  },
  {
    cap: 'Families, some without a car, sent a local driver they trusted their list.',
    art: (
      <>
        <path className="st-ln" d="M12,150 L100,150" />
        <path className="st-ln" d="M24,150 L24,104 L56,78 L88,104 L88,150" />
        <path className="st-ln" d="M48,150 L48,126 L64,126 L64,150" />
        <path className="st-ln" d="M96,98 C110,88 124,106 140,96 M132,90 L141,96 L133,103" />
        <rect className="st-ln" x="152" y="16" width="110" height="192" rx="18" />
        <path className="st-ln" d="M192,28 L222,28" />
        <rect className="st-ln" x="164" y="50" width="86" height="98" rx="10" />
        <path className="st-ln" d="M172,148 L168,162 L184,148" />
        <text className="st-txt" x="174" y="72">tortillas</text>
        <text className="st-txt" x="174" y="90">chorizo</text>
        <text className="st-txt" x="174" y="108">nopales</text>
        <text className="st-txt" x="174" y="126">3 lb rabo</text>
        <path className="st-ln is-red" d="M222,138 L226,142 L233,134 M229,142 L236,134" />
      </>
    ),
  },
  {
    cap: 'The driver shopped for several families in one trip: no app fees, no markups.',
    art: (
      <>
        <path className="st-ln" d="M8,176 L312,176" />
        <path className="st-ln" d="M2,112 L12,112 M0,130 L10,130" />
        <path className="st-ln" d="M18,160 L18,138 Q20,124 40,122 L66,98 Q72,92 82,92 L150,92 Q160,92 168,100 L190,122 Q210,124 212,140 L212,160 L188,160 M146,160 L80,160 M44,160 L18,160" />
        <path className="st-ln" d="M76,120 L90,104 L114,104 L114,120 Z M122,120 L122,104 L148,104 L162,120 Z" />
        <circle className="st-ln" cx="62" cy="162" r="16" />
        <circle className="st-ln" cx="168" cy="162" r="16" />
        <rect className="st-ln" x="98" y="76" width="36" height="15" rx="3" />
        <text className="st-txt is-sm" x="116" y="87" textAnchor="middle">TAXI</text>
        {[226, 256, 286].map((x, k) => bag(x, k))}
      </>
    ),
  },
  {
    cap: 'At the register, staff noticed drivers checking out on other customers’ loyalty numbers.',
    art: (
      <>
        <rect className="st-ln" x="30" y="24" width="160" height="96" rx="8" />
        <path className="st-ln" d="M110,120 L110,140" />
        <rect className="st-ln" x="20" y="140" width="180" height="36" rx="6" />
        <rect className="st-ln" x="40" y="148" width="56" height="20" rx="4" />
        <path className="st-ln" d="M110,152 L180,152 M110,162 L164,162" />
        <text className="st-txt is-sm" x="46" y="50">LOYALTY</text>
        <text className="st-txt is-lg" x="46" y="78">706 ··· 4412</text>
        <path className="st-ln" d="M46,96 L120,96" />
        <path className="st-ln" d="M218,18 L294,18 L294,190 L285,198 L276,190 L267,198 L258,190 L249,198 L240,190 L231,198 L222,190 L218,194 Z" />
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <path className="st-ln" d={`M228,${38 + k * 52} L284,${38 + k * 52} M228,${48 + k * 52} L262,${48 + k * 52}`} />
            <text className="st-txt" x="256" y={`${73 + k * 52}`} textAnchor="middle">··4412</text>
            <path className="st-ln is-red" d={`M232,${66 + k * 52} C230,${58 + k * 52} 284,${56 + k * 52} 284,${68 + k * 52} C284,${80 + k * 52} 228,${80 + k * 52} 230,${68 + k * 52} C231,${62 + k * 52} 244,${59 + k * 52} 252,${59 + k * 52}`} />
          </g>
        ))}
      </>
    ),
  },
]

function StoryStrip({ panels, label, quote }) {
  const ref = useRef(null)
  const fid = `st${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  // Review, Nov 19: the panels used to draw in one after another, so a skimmer saw one panel and three empty frames.
  // Now every panel and caption is there from the start; only the small step numbers move, after the story is visible.
  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED) return undefined
    const nums = el.querySelectorAll('.st-n')
    gsap.set(nums, { scale: 0.6, opacity: 0 })
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      gsap.to(nums, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.12, ease: 'back.out(2)', delay: 0.2 })
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} role="group" aria-label={label}>
      {quote ? <blockquote className="st-quote"><p>{quote.t}</p><cite>{quote.who}</cite></blockquote> : null}
      <div className="st" style={{ '--n': panels.length }}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id={fid}><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="1" seed="4" /><feDisplacementMap in="SourceGraphic" scale="1.6" /></filter>
      </svg>
      {panels.map((pn, i) => (
        <figure key={pn.cap} className="st-fig">
          <span className="st-n">{i + 1}</span>
          <svg viewBox="0 0 320 214" aria-hidden="true"><g filter={`url(#${fid})`}>{pn.art}</g></svg>
          <figcaption>{pn.cap}</figcaption>
        </figure>
      ))}
      </div>
    </div>
  )
}

/** Phone versions: the same stories, stacked top to bottom. */
const SK_LOOP_M = {
  w: 380, h: 560,
  nodes: [
    { x: 190, y: 55, w: 260, t: 'Families', s: 'Familiar groceries, store prices' },
    { x: 190, y: 250, w: 260, t: 'Local drivers', s: 'Buy, carry, deliver; paid by the family' },
    { x: 190, y: 445, w: 240, t: 'La Bodega', s: 'Sells at the register, on someone’s loyalty number', ring: true },
  ],
  edges: [
    { d: 'M84,98 C62,132 62,178 82,212' },
    { d: 'M84,294 C62,330 62,370 86,404' },
    { d: 'M300,494 C350,520 372,470 372,330 C372,190 362,110 318,62' },
  ],
  tags: [
    { x: 98, y: 160, t: 'a list, and the fare', a: 'start' },
    { x: 98, y: 356, t: 'one trip, several families', a: 'start' },
    { path: 'M356,470 C356,330 356,200 334,112', t: 'groceries home, no app markup' },
  ],
}
const SK_FORK_M = {
  w: 390, h: 470,
  nodes: [
    { x: 195, y: 45, w: 200, t: 'Shopper', s: 'A $58 basket' },
    { x: 98, y: 205, w: 176, t: 'Instacart’s offer', s: 'Keeps 12–16%: $7–9', tone: 'off' },
    { x: 290, y: 205, w: 168, t: 'The store’s app', s: 'Keeps the sale and the customer', ring: true, rx: 110, ry: 66 },
    { x: 98, y: 390, w: 176, t: 'La Bodega', s: 'Gets the rest; the platform keeps the customer', tone: 'off' },
    { x: 290, y: 390, w: 176, t: 'Local driver', s: 'Gets the delivery fee; the store takes no cut' },
  ],
  edges: [
    { d: 'M160,84 C130,110 112,134 104,154', tone: 'off' },
    { d: 'M230,84 C258,104 270,118 276,134', tone: 'on' },
    { d: 'M98,254 C94,292 94,312 98,336', tone: 'off' },
    { d: 'M290,276 C287,302 287,318 290,338', tone: 'on' },
  ],
}
const SK_PILOT_M = {
  w: 390, h: 740,
  nodes: [
    { x: 195, y: 50, w: 230, t: 'Customer', s: 'A message, voice note or list' },
    { x: 195, y: 190, w: 200, t: 'Lola', s: 'Collects and clarifies' },
    { x: 195, y: 330, w: 200, t: 'Shared inbox', s: 'A ticket for staff' },
    { x: 195, y: 470, w: 220, t: 'Staff', s: 'Check what the store can pack' },
    { x: 100, y: 650, w: 150, t: 'Order', s: 'Pickup, or a local driver delivers', ring: true },
    { x: 290, y: 650, w: 170, t: 'Missing, or a price?', s: 'Another message, another wait' },
  ],
  edges: [
    { d: 'M195,98 C192,116 192,130 195,146' },
    { d: 'M112,196 C50,180 40,100 80,66' },
    { d: 'M195,238 C192,256 192,270 195,286' },
    { d: 'M195,378 C192,396 192,410 195,426' },
    { d: 'M150,516 C130,545 116,568 110,592' },
    { d: 'M240,516 C262,545 276,568 282,600' },
    { d: 'M360,600 C392,440 392,190 312,66', tone: 'on' },
  ],
  tags: [
    { x: 64, y: 130, t: 'asks back', a: 'start' },
    { x: 112, y: 560, t: 'have it', a: 'end' },
    { x: 276, y: 560, t: 'not sure', a: 'start' },
    { path: 'M346,590 C374,440 374,200 302,80', t: 'a median 33-minute wait for a price', tone: 'on' },
  ],
}

/** Beat 1: the loop that already existed. */
const SK_LOOP = {
  h: 360, label: 'Families send a list and pay a local driver; the driver shops at La Bodega for several families; the groceries come home at store prices',
  nodes: [
    { x: 160, y: 250, w: 230, t: 'Families', s: 'Familiar groceries, store prices' },
    { x: 500, y: 62, w: 250, t: 'Local drivers', s: 'Buy, carry, deliver; paid by the family' },
    { x: 840, y: 250, w: 250, t: 'La Bodega', s: 'Sells at the register, on someone’s loyalty number', ring: true },
  ],
  edges: [
    { d: 'M150,198 C170,120 260,72 362,62' },
    { d: 'M640,62 C740,72 826,112 840,186' },
    { d: 'M740,300 C640,346 360,346 262,300' },
  ],
  tags: [
    { x: 262, y: 168, t: 'a list, and the fare', a: 'start' },
    { x: 738, y: 168, t: 'one trip, several families', a: 'end' },
    { x: 500, y: 302, t: 'groceries home, no app markup' },
  ],
}

/** Beat 2: where the money goes, two routes from the same basket. */
const SK_FORK = {
  h: 330, label: 'A $58 basket: through the marketplace, it keeps 12 to 16 percent and the customer; through the store’s own app, the store keeps the sale and the customer and the local driver gets the delivery fee',
  nodes: [
    { x: 120, y: 165, w: 190, t: 'Shopper', s: 'A $58 basket' },
    { x: 470, y: 60, w: 230, t: 'Marketplace', s: 'Keeps 12–16%: $7–9', tone: 'off' },
    { x: 830, y: 60, w: 250, t: 'La Bodega', s: 'Gets the rest; the platform keeps the customer', tone: 'off' },
    { x: 470, y: 270, w: 230, t: 'La Bodega', s: 'Keeps the sale and the customer', ring: true },
    { x: 830, y: 270, w: 250, t: 'Local driver', s: 'Gets the delivery fee; the store takes no cut' },
  ],
  edges: [
    { d: 'M200,128 C250,70 300,58 352,58', tone: 'off' },
    { d: 'M588,58 C630,52 668,52 702,58', tone: 'off' },
    { d: 'M200,202 C240,256 280,270 322,272', tone: 'on' },
    { d: 'M620,272 C650,266 676,266 702,272', tone: 'on' },
  ],
  tags: [
    { x: 246, y: 66, t: 'Instacart’s offer', a: 'end', tone: 'off' },
    { x: 236, y: 300, t: 'the store’s own app', a: 'end', tone: 'on' },
  ],
}

/** Beat 3: the WhatsApp pilot as a loop: every gap went back to the customer as another message. */
const SK_PILOT = {
  w: 1040, h: 460, label: 'A customer sends a message, voice note or list; Lola collects it and asks back to clarify; it becomes a ticket in the shared inbox; staff check what the store can pack; if they have it, it becomes a pickup or delivery order; if something is missing or it is a price question, it goes back to the customer as another message, a median 33-minute wait',
  nodes: [
    { x: 95, y: 225, w: 160, t: 'Customer', s: 'A message, voice note or list' },
    { x: 320, y: 225, w: 170, t: 'Lola', s: 'Collects and clarifies' },
    { x: 535, y: 225, w: 170, t: 'Shared inbox', s: 'A ticket for staff' },
    { x: 745, y: 225, w: 170, t: 'Staff', s: 'Check what the store can pack' },
    { x: 935, y: 92, w: 150, t: 'Order', s: 'Pickup, or a local driver delivers', ring: true },
    { x: 935, y: 350, w: 170, t: 'Missing, or a price?', s: 'Another message, another wait' },
  ],
  edges: [
    { d: 'M184,232 C204,228 222,228 240,232' },
    { d: 'M310,176 C282,118 160,118 118,174' },
    { d: 'M408,232 C424,228 438,228 452,232' },
    { d: 'M620,232 C636,228 648,228 662,232' },
    { d: 'M792,176 C806,146 820,132 836,124' },
    { d: 'M792,276 C806,302 820,318 840,330' },
    { d: 'M880,404 C740,478 230,478 104,280', tone: 'on' },
  ],
  tags: [
    { x: 214, y: 120, t: 'asks back' },
    { x: 806, y: 128, t: 'have it', a: 'end' },
    { x: 806, y: 336, t: 'not sure', a: 'end' },
    { x: 560, y: 418, t: 'a median 33-minute wait for a price', tone: 'on' },
  ],
}

/* ---------- page ---------- */
/** Opening panel: the store's WhatsApp, asked again and again. Bubbles paraphrase the asks; the real wording is pending. */
const ASK_ART = (
  <>
    <path className="st-ln" d="M84,58 L72,50 M86,74 L72,74 M84,90 L72,98" />
    <rect className="st-ln" x="100" y="10" width="124" height="198" rx="18" />
    <path className="st-ln" d="M148,22 L176,22" />
    <circle className="st-ln" cx="122" cy="40" r="6" />
    <text className="st-txt is-sm" x="134" y="43">LA BODEGA</text>
    <path className="st-ln" d="M110,54 L214,54" />
    <rect className="st-ln" x="110" y="64" width="110" height="28" rx="8" />
    <text className="st-txt" x="117" y="82">Do you deliver?</text>
    <rect className="st-ln" x="110" y="100" width="72" height="28" rx="8" />
    <text className="st-txt" x="118" y="118">Pickup?</text>
    <rect className="st-ln" x="110" y="136" width="94" height="28" rx="8" />
    <text className="st-txt" x="118" y="154">Can I order?</text>
    <circle className="st-ln is-red" cx="232" cy="10" r="11" />
    <text className="st-txt is-red" x="232" y="14" textAnchor="middle">3</text>
  </>
)
const STORY_OPEN = [
  { cap: 'Customers kept asking on the store’s WhatsApp: do you do pickup or delivery?', art: ASK_ART },
  { ...STORY_DRIVER[0], cap: 'Meanwhile, local cab drivers took ride calls around town. The ones we spoke with said the delivery apps paid too little after gas and time.' },
  { ...STORY_DRIVER[2], cap: 'Families, some without a car, sent them a list. One trip covered several families.' },
  { ...STORY_DRIVER[3], cap: 'At the register, staff saw drivers checking out on other customers’ loyalty numbers.' },
]

/** Reference captions, cut to the idea each one gave. */
const REFS_SHORT = {
  'r-wolt.jpg': 'One clear start', 'r-target.jpg': 'A mascot on a working home', 'r-glovo.jpg': 'First delivery free, said up front',
  'r-instacart-who.jpg': 'Who you shop for', 'r-instacart-address.jpg': 'Errors on the field', 'r-swapi.jpg': 'One idea per screen',
  'r-menubar.jpg': 'A light pill on the selected tab',
}

function TightBody() {
  const max = Math.max(...ASKS.map(([, n]) => n))
  return (
    <>
      {/* 01 · they asked, and some were already doing it */}
      <Chapter id="opportunity" n="01" label="Already ordering" title="Customers were already ordering, by text and through local drivers">
        <div className="s2-wide st-block">
          <StoryStrip panels={STORY_OPEN} label="How customers were already ordering, in four panels" />
          <div className="st-coda">
            <blockquote className="st-quote"><p>“The apps don’t pay once you count the gas and the time.”</p><cite>A local cab driver · paraphrased</cite></blockquote>
            <p className="st-so">So the store set out to do the same, itself.</p>
          </div>
          <More title="How the service grew, May to November">
            <ol className="s2-rail" aria-label="Service evolution, May to November 2026">
              {TIMELINE.map(([when, what]) => <li key={when + what}><b>{when}</b>{what}</li>)}
            </ol>
          </More>
        </div>
      </Chapter>

      {/* 02 · a marketplace, or its own channel */}
      <Chapter id="channel" n="02" label="Own channel" title="A marketplace, or the store’s own channel">
        <div className="s2-col"><p>Instacart offered to list the store for 12–16% of every order: $7–9 on a $58 basket.</p></div>
        <div className="s2-wide s2-block">
          <SketchR d={SK_FORK} m={SK_FORK_M} />
          <p className="s2-note">No commission isn’t no cost: card fees, software and packing stay with the store, and one person builds it.</p>
          <More title="The three routes compared, who else sells groceries in Calhoun, and the local market">
            <div className="s2-table-wrap" style={{ marginBottom: 24 }}>
              <table className="s2-table">
                <thead><tr><th></th><th>Cost to the store</th><th>Who does the work</th><th>Decision</th></tr></thead>
                <tbody>{ROUTES.map((r) => <tr key={r[0]} className={r[3] === 'Chosen' ? 'is-us' : ''}>{r.map((x, i) => (i === 0 ? <th key={i} scope="row">{x}</th> : <td key={i}>{x}</td>))}</tr>)}</tbody>
              </table>
            </div>
            <div className="s2-table-wrap">
              <table className="s2-table">
                <thead><tr><th></th><th>Orders in Calhoun</th><th>What the store pays</th><th>What the shopper pays</th><th>Hispanic range</th></tr></thead>
                <tbody>{COMPETITORS.map((r) => <tr key={r[0]} className={r[0] === 'La Bodega online' ? 'is-us' : ''}>{r.map((x, i) => (i === 0 ? <th key={i} scope="row">{x}</th> : <td key={i}>{x}</td>))}</tr>)}</tbody>
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

      {/* 03 · the pilot, what it earned, and where it stopped */}
      <Chapter id="pilot" n="03" label="Pilot" title="Orders by WhatsApp: it paid, and hit a limit">
        <div className="s2-col">
          <p>Before building anything, the store took orders by WhatsApp. We automated collection, not acceptance: stock changes, and meat is weighed to order.</p>
        </div>
        <div className="s2-wide s2-block"><SketchR d={SK_PILOT} m={SK_PILOT_M} /></div>
        <div className="s2-wide s2-block">
          <div className="s2-results">
            <div><b>$1,800</b><span>a month from WhatsApp orders</span><em>Sep and Oct 2026, before the app</em></div>
            <div><b>$58</b><span>average delivery order, 22 of them</span><em>Against a $28 register basket</em></div>
            <div><b>5</b><span>customers ordered delivery again</span><em>A pilot signal, not a retention rate</em></div>
          </div>
          <p className="s2-note">Reported pilot figures: a small group, and staff helped with every order.</p>
        </div>
        <div className="s2-wide s2-block s2-side">
          <div className="s2-panel"><Screen src="search-results.jpg" base={HQ} alt="Search results with product photos and the price per pound" /></div>
          <div>
            <Label>The limit</Label>
            <blockquote className="s2-quote" lang="es" style={{ marginTop: 16 }}>¿A cómo tiene la libra de carne chamorro?<span lang="en">How much is a pound of beef shank?</span></blockquote>
            <div className="st-stats">
              <div><b>93 of 95</b><span>price questions still needed staff</span></div>
              <div><b>1 in 4</b><span>waited over 14 hours</span></div>
            </div>
            <p className="s2-muted">The answer was browsing: the price per pound on the screen, without asking.</p>
          </div>
        </div>
        <div className="s2-wide">
          <More title="What customers asked, why WhatsApp alone wasn’t enough, and the methods">
            <div className="s2-research" style={{ marginBottom: 32 }}>
              <div>
                <Label>What customers asked</Label>
                <p className="s2-muted">25 of 66 hand-coded threads (Aug 4 – Sep 2) were about shopping; 19 asked a price or “do you have…?”.</p>
                <div className="s2-bars">{ASKS.map(([t, n]) => <div className="s2-bar" key={t}><span>{t}</span><i style={{ width: `${(n / max) * 100}%` }} /><span>{n}</span></div>)}</div>
              </div>
              <div className="s2-quotes s2-quotes--stack" aria-label="From the store’s WhatsApp, anonymised">
                {QUOTES.map(([es, en]) => <blockquote key={es} className="s2-quote" lang="es">{es}<span lang="en">{en}</span></blockquote>)}
              </div>
            </div>
            <ul className="s2-list" style={{ marginBottom: 24 }}>
              <li><b>Reach.</b> About 600 of roughly 2,800 loyalty customers aren’t on WhatsApp.</li>
              <li><b>Finding.</b> Showing items in chat meant syncing 8,000+ register-priced products into a second catalog.</li>
              <li><b>Retention.</b> Customers drift if flyers stop for a few weeks; a “we miss you” message worked only with the flyer.</li>
              <li><b>Rules.</b> Beer posters, and even replies that said “cerveza”, were blocked; after 24 hours of silence only paid templates are allowed.</li>
            </ul>
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
        <div className="s2-wide s2-block">
          <ul className="s2-access" aria-label="Who can order">
            <li><b>Help stays</b>Customers can still order by message, with staff help.</li>
            <li><b>No card needed</b>Cash customers top up store credit at the register.</li>
            <li><b>EBT</b>Online EBT is pending approval; in the store it works as before.</li>
          </ul>
        </div>
      </Chapter>

      {/* 04 · designing */}
      <Chapter id="design" n="04" label="Designing" title="What the app had to get right">
        <div className="s2-col">
          <p>Prices and stock come from the register. Meat and produce are priced after weighing. Most chats are in Spanish. Beer needs a 21+ check.</p>
        </div>
        <div className="s2-wide s2-block">
          <div className="dz-split">
            <div>
              <div className="s2-step"><Label>1 of 3</Label><h3 className="s2-h3">What I took, and five directions</h3>
                <p className="s2-muted">Seven ideas from other apps made it in, each answering a frustration from the research. Then five directions with the same content: D won, the store’s painted signs with product photos.</p></div>
              <More title="What happened to each direction"><DirTable /></More>
            </div>
            <Board src="p-directions.jpg" alt="Directions A to E on a phone, same carne asada content: A cut-out food on cream, B halftone print, C painted signs, D signs with photos and a printed deal block, E a fuller single-brand take" cap="Directions A–E, same content. D was picked." />
          </div>
          <div className="s2-refs dz-refs">
            {REFS.map(([src, app]) => (
              <figure key={src}><a href={`${F}/${src}?v=${V}`} target="_blank" rel="noopener noreferrer"><img src={`${F}/${src}?v=${V}`} alt={`${app} reference screen`} loading="lazy" /></a><figcaption><b>{app}</b>{REFS_SHORT[src]}</figcaption></figure>
            ))}
          </div>
        </div>
        <div className="s2-wide s2-block">
          <div className="dz-split">
          <div>
          <div className="s2-step"><Label>2 of 3</Label><h3 className="s2-h3">The Oct 24 reset</h3>
            <p className="s2-muted">The Oct 6 screens were a web catalogue squeezed onto a phone. I archived three weeks of work and redrew every flow phone-first.</p></div>
          <div className="s2-ba-notes">
            <p><span className="s2-pin">1</span><span><b>Navigation.</b> The sidebar took a third of the screen; chips give it back.</span></p>
            <p><span className="s2-pin">2</span><span><b>Picking.</b> Tiny tiles became photo cards with the price per pound.</span></p>
          </div>
          {/* Review, Nov 19: the two screens aren't the same view, so the note says what is compared (no equivalence claim). */}
          <p className="s2-note">Not the same screen: the Oct 6 build had no aisle page, so the nearest is its deals page (in Spanish); the shipped one is the meat aisle. Compared: how you move between departments and how a product card reads. Revised through critique, not a user test.</p>
          </div>
          <div className="s2-ba">
            <figure><Label>Oct 6 · deals page, department sidebar</Label><Screen src="oct6-aisle.jpg" base={HQ} alt="October 6 design: a category sidebar and small product tiles with Agregar buttons"><span className="s2-pin" style={{ left: '1%', top: '71%' }}>1</span><span className="s2-pin" style={{ left: '44%', top: '61%' }}>2</span></Screen></figure>
            <figure><Label>Shipped · meat aisle, department chips</Label><Screen src="aisle-meat.jpg" base={HQ} alt="Shipped Meat and Seafood aisle: category chips and large product cards with prices by the pound"><span className="s2-pin" style={{ left: '2%', top: '14%' }}>1</span><span className="s2-pin" style={{ left: '44%', top: '34%' }}>2</span></Screen></figure>
          </div>
          </div>
          <div className="dz-split" style={{ marginTop: 48 }}>
            <div className="s2-step"><Label>Flows</Label>
              <p className="s2-muted" style={{ marginTop: 10 }}>Seven flows, each with its failure branches, drawn from the shopper’s, the staff’s and the payment’s side.</p></div>
            <Board src="p-flow-sides.jpg" alt="One order from three sides: what the shopper sees, what staff do on the handheld and at the register, and what happens to the payment hold and final charge" cap="One order, three sides: shopper, staff, payment." />
          </div>
          <More title="Where things live, the sitemap, the find-a-product flow and the Oct 24 wireframes"><TightIA sitemap /></More>
        </div>
        <div className="s2-wide s2-block" id="design-system">
          <div className="s2-step"><Label>3 of 3</Label><h3 className="s2-h3">The design system</h3>
            <p className="s2-muted">Figma variables feed the app’s styles; 27 shared components build every screen.</p></div>
          <div className="s2-panel s2-sys">
            <div className="s2-sys__found">
              <div><Label>Colour</Label><ul className="s2-sys__sw">{DS_COLOURS.map(([n, hex, use]) => <li key={n}><i style={{ background: hex }} /><b>{n}</b><span>{use}</span><code>{hex}</code></li>)}</ul></div>
              <div>
                <Label>Type</Label>
                <p className="s2-sys__type" style={{ fontFamily: '"Bricolage Grotesque", var(--s2-font)', fontWeight: 800, fontSize: 28, lineHeight: 1.1 }}>Bricolage Grotesque</p>
                <p className="s2-sys__meta">Display and the store’s voice</p>
                <p className="s2-sys__type" style={{ fontFamily: 'Figtree, var(--s2-font)', fontWeight: 600, fontSize: 22 }}>Figtree $12.99 /lb</p>
                <p className="s2-sys__meta">Text and prices</p>
              </div>
              <div><Label>Space · tap</Label><ul className="s2-sys__space">{DS_SPACE.map((n) => <li key={n}><i style={{ width: n * 3 }} />{n}</li>)}<li className="is-tap"><i />48 tap target</li></ul></div>
              <div><Label>Radius</Label><ul className="s2-sys__rad">{DS_RADIUS.map((n) => <li key={n}><i style={{ borderRadius: n }} />{n}</li>)}<li><i style={{ borderRadius: 999 }} />full</li></ul></div>
            </div>
            <div className="s2-sys__rule" />
            <Label>Product card · four states · English and Spanish</Label>
            <div className="s2-comp" style={{ marginTop: 20 }}>
              {CARD_STATES.map(([src, name, alt]) => <figure key={src}><img src={`${F}/ds3/${src}?v=${V}`} width="121" alt={alt} loading="lazy" /><figcaption>{name}</figcaption></figure>)}
              <span className="s2-vr" aria-hidden="true" />
              <figure lang="es"><img src={`${F}/ds3/card-es.png?v=${V}`} width="121" alt="Spanish card: Chile serrano, Serrano Peppers underneath, Ahorra $0.48" loading="lazy" /><figcaption>Español</figcaption></figure>
            </div>
            <div className="s2-parts">{SAME_PARTS.map(([src, name, w]) => <figure key={src}><img src={`${F}/ds2/${src}?v=${V}`} width={w} alt={name} loading="lazy" /><figcaption>{name}</figcaption></figure>)}</div>
          </div>
          <More title="How the card behaves">
            <p>“Sold out today” shows on the card in the aisle, so nobody adds what the store can’t pack. If an item sells out after it’s in the cart, the cart offers a replacement. The aisle, search, the weekly flyer, the product page and the cart all use this card.</p>
            <p>The shopper’s language decides which name leads; the other stays underneath. Search matches either name, so “serrano peppers” and “chile serrano” find the same item.</p>
          </More>
        </div>
      </Chapter>

      {/* 05 · decisions */}
      <Chapter id="decisions" n="05" label="Decisions" title="Three decisions, each with what it cost">
        <div className="s2-wide">
          <section className="s2-decision s2-chain" aria-labelledby="d1">
            <div>
              <h3 id="d1" className="s2-h3">Browse with photos, keep Lola for lists</h3>
              <dl>
                <dt className="s2-label">We saw</dt><dd>Lists worked in chat; “do you have…?” didn’t. About 600 of 2,800 loyalty customers aren’t on WhatsApp.</dd>
                <dt className="s2-label">We chose</dt><dd>An app to browse, search and pay, not an 8,000-item catalog inside WhatsApp. Lola and staff still take lists and special cuts.</dd>
                <dt className="s2-label">The cost</dt><dd>Two ordering paths that must agree on price and stock. Saved lists are designed, not built.</dd>
              </dl>
            </div>
            <div className="s2-panel"><figure><Screen src="lola-list.jpg" base={HQ} alt="Ask Lola: a pasted shopping list, I found 8 of your 10 items, tap to add" /><figcaption className="s2-cap">Paste a list: Lola finds what she can.</figcaption></figure></div>
          </section>
          <section className="s2-decision s2-decision--side" aria-labelledby="d2">
            <div className="s2-chain s2-chain--text"><div>
              {/* Review, Nov 19: the shop launched in "charge" mode (owner, Nov 3), so the page says what runs today and
                  what was built; the checkout line is the shop's own words (labodega-storefront app/checkout). */}
              <h3 id="d2" className="s2-h3">Weighed items: a hold, then one simple charge</h3>
              <dl>
                <dt className="s2-label">We saw</dt><dd>Shoppers want the meat price before paying.</dd>
                <dt className="s2-label">We chose</dt><dd>Pick a weight, not fixed-price packs that drift from the register.</dd>
                <dt className="s2-label">We built</dt><dd>A card hold of the estimate plus 15%; the register charges the packed weight and releases the rest.</dd>
                <dt className="s2-label">Then</dt><dd>A hold bigger than the estimate is one more thing to explain. For launch the owner chose to charge the estimate once and refund what comes in lighter. The hold stays built, one setting away.</dd>
                <dt className="s2-label">Checkout says</dt><dd>
                  <p className="s2-copy">“Meat and produce are weighed when packed. If they come to less, we refund the difference to your card.”</p></dd>
                <dt className="s2-label">Not known yet</dt><dd>Whether shoppers read it that way: it hasn’t been tested with shoppers.</dd>
              </dl>
            </div></div>
            <div className="s2-ba" style={{ '--n': 3 }}>
              <figure><Label>Before · packs</Label><Screen src="d1-before.jpg" alt="October 24 wireframe: Chuck Roll sold in 1, 2 or 4 lb packs at a fixed pack price" /><figcaption>One more list to keep in step.</figcaption></figure>
              <figure><Label>Shipped · by weight</Label><Screen src="product.jpg" base={HQ} alt="Shipped: Ribeye chosen by weight, 1, 2, 3 lb or Other, with a note for the butcher" /><figcaption>The butcher weighs the cut.</figcaption></figure>
              <figure><Label>Packed · exact</Label><Screen src="final-total.jpg" base={HQ} alt="Your order is packed: $0.98 back to your card, charged the exact weight" /><figcaption>The difference goes back, in dollars.</figcaption></figure>
            </div>
          </section>
          <section className="s2-decision s2-decision--side" aria-labelledby="d3">
            <div className="s2-chain s2-chain--text">
              <h3 id="d3" className="s2-h3">One order, across shopper and staff</h3>
              <dl>
                <dt className="s2-label">We saw</dt><dd>In chat, a missing item meant another round of messages.</dd>
                <dt className="s2-label">We chose</dt><dd>Each handoff is a screen someone acts on. Swaps cost the same or less; no answer in 15 minutes, and the item is left out, not charged.</dd>
              </dl>
            </div>
            <div className="s2-ba" style={{ '--n': 3 }}>
              <figure><Label>1 · Staff accept</Label><Screen src="h-weborders.jpg" alt="Staff handheld: open web orders with the accept countdown" /><figcaption>It lands on the handheld.</figcaption></figure>
              <figure><Label>2 · Staff pick</Label><Screen src="h-picklist.jpg" alt="Staff pick list: have 2 of 3, send a swap to the shopper" /><figcaption>Have 2 of 3: offer a swap.</figcaption></figure>
              <figure><Label>3 · Shopper</Label><Screen src="approve-swap.jpg" base={HQ} alt="Shopper approves the swap or leaves the item out" /><figcaption>Approve it, or leave it out.</figcaption></figure>
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

      {/* 06 · service */}
      <Chapter id="service" n="06" label="Service" title="When something goes wrong, and the details">
        <div className="s2-wide">
          <div className="s2-ba" style={{ '--n': 3 }}>
            <figure><Label>Sold out before checkout</Label><Screen src="sold-out.jpg" base={HQ} alt="Ataulfo Mangos sold out while you were shopping: use Ripe Papaya instead, or remove mangos" /><figcaption>A replacement is ready before anything is paid.</figcaption></figure>
            <figure><Label>Card declined</Label><Screen src="declined.jpg" base={HQ} alt="Your card was declined: nothing was charged; Apple Pay, a different card, or pay at the register for pickup" /><figcaption>“Nothing was charged” comes first.</figcaption></figure>
            <figure><Label>Missing from the order</Label><Screen video="motion-chat.mp4" poster="chat-handoff.jpg" base={HQ} alt="Ask Lola: the shopper says the chorizo was missing; Lola says sorry and connects the store team; the team types, then replies that they are checking the order" /><figcaption>Lola hands it to the store team, in the same chat.</figcaption></figure>
          </div>
        </div>
        <div className="s2-wide s2-block">
          <div className="s2-moment">
            <div>
              <Label>Lola Rewards</Label>
              <p className="s2-statement">Points in the wallet they already carry</p>
              <p>One card in the app and in Apple Wallet. The register scans it; the points update on their own.</p>
            </div>
            <div className="s2-phones">
              <figure><Screen video="d-wallet.mp4" poster="d-wallet-poster.jpg" alt="In-app wallet: tap the Lola Rewards card and it lifts out with its barcode" /><figcaption>In the app</figcaption></figure>
              <figure className="is-up"><Screen video="d-pass.mp4" poster="d-pass-poster.jpg" alt="Apple Wallet pass updating from 180 to 222 points, reward ready" /><figcaption>In Apple Wallet</figcaption></figure>
            </div>
          </div>
          <div className="s2-block">
            <div className="s2-step"><Label>Motion</Label><h3 className="s2-h3">One way to say done, built once</h3>
              <p className="s2-muted">One wait, one stamp, one haptic, for every finished task. Recorded from the app.</p></div>
            {/* Review, Nov 19: two examples show the shared pattern; the other four sit under More so motion doesn't
                compete with the service story. */}
            <div className="s2-panel s2-motion s2-motion--two">
              <figure><Screen video="motion-signin.mp4" poster="motion-signin-poster.jpg" base={HQ} alt="Sign-in code accepted: the code boxes melt into dots, a stamp lands, Code verified, then Welcome back" /><figcaption><b>Code verified</b></figcaption></figure>
              <figure><Screen video="motion-placed.mp4" poster="motion-placed-poster.jpg" base={HQ} alt="Order placed: Place order, then Payment approved and Sending order to the store check off, the stamp lands on the order page, then Lola takes its place" /><figcaption><b>Order placed</b></figcaption></figure>
            </div>
          </div>
          <More title="More screens and motion: four more moments of done, the opening, the Lock Screen and points">
            <div className="s2-motion s2-motion--more">
              <figure><Screen video="motion-cardsaved.mp4" poster="motion-cardsaved-poster.jpg" base={HQ} alt="Card saved: the button rounds into a disc, a ring circles while it saves, the stamp blooms, Card saved" /><figcaption><b>Card saved</b>Same stamp, from a button</figcaption></figure>
              <figure><Screen video="motion-alerts.mp4" poster="motion-alerts-poster.jpg" base={HQ} alt="Alerts on: Turn on all becomes a wait ring where it was tapped, the stamp blooms, Order updates and deals are on, then the sheet closes" /><figcaption><b>Alerts on</b>Same stamp, in a sheet</figcaption></figure>
              <figure><Screen video="motion-delivered.mp4" poster="motion-delivered-poster.jpg" base={HQ} alt="Order delivered: the stamp lands, then Lola takes its place" /><figcaption><b>Delivered</b>Then Lola takes its place</figcaption></figure>
              <figure><Screen video="motion-pickedup.mp4" poster="motion-pickedup-poster.jpg" base={HQ} alt="Picked up: Picked up. Enjoy! fades in, then the stamp lands" /><figcaption><b>Picked up</b>The message first, then the stamp</figcaption></figure>
              <figure><Screen video="splash-anim.mp4" poster="splash-anim-poster.jpg" base={A} alt="Opening: the La Bodega wordmark and the arch rise" /><figcaption><b>Opening</b>The wordmark, then the arch rises</figcaption></figure>
              <figure><Screen video="d-live.mp4" poster="d-live-poster.jpg" alt="Live Activity on the Lock Screen: received, preparing, on the way, delivered" /><figcaption><b>Lock Screen</b>The order as a Live Activity</figcaption></figure>
              <figure><Screen video="d-points.mp4" poster="d-points-poster.jpg" alt="Points sheet after delivery: 180 counts up to 222, $5 off ready" /><figcaption><b>Points</b>Counted up after delivery</figcaption></figure>
            </div>
            <div className="s2-grid-figs s2-grid-figs--phones">
              {GALLERY.map(([src, t, cap]) => <figure key={src}><img src={`${F}/${src}?v=${V}`} alt={`${t}: ${cap}`} loading="lazy" /><figcaption><b>{t}</b> {cap}</figcaption></figure>)}
            </div>
            <p><a href={`${F}/dia-delivery.png?v=${V}`} target="_blank" rel="noopener noreferrer">Open the delivery decisions diagram full size ↗</a><span className="s2-muted"> Diamonds are the app’s questions; red branches are what the shopper sees.</span></p>
          </More>
        </div>
      </Chapter>

      {/* 07 · status */}
      <Chapter id="outcome" n="07" label="Status" title="Where it stands">
        <div className="s2-wide">
          <div className="s2-three">
            <div><h3>Release status</h3><ul>
              <li>iPhone app in App Store review, submitted Nov 10.</li>
              <li>Android approved on Google Play, held for launch.</li>
              <li><a href="https://shop.labodegacalhoun.com" target="_blank" rel="noopener noreferrer">The website</a> is browse-only until launch.</li>
            </ul></div>
            <div><h3>Verified so far</h3><ul>
              <li>Test orders: delivery, pickup, scheduled, a declined card, every status, a cancellation.</li>
              <li>That shows it works, not that customers understand it.</li>
            </ul></div>
            <div><h3>Next validation</h3><ul>
              <li><b>Can customers order?</b> Checkout completion, with and without weighed items.</li>
              <li><b>Do they get the price?</b> Shoppers explain the hold.</li>
              <li><b>Can the store keep up?</b> Orders ready on time, and the swaps it took.</li>
            </ul></div>
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
    </>
  )
}

export default function StorefrontCase() {
  const max = Math.max(...ASKS.map(([, n]) => n))
  /** Tight page: role, timeline and status, shown under the title, before the motion hero (review, Nov 19). */
  const tightMeta = (
    <div className="s2-meta">
      <div><Label>Role</Label><ul><li>Product designer, end to end: research, service design, UI, design system, front-end build</li><li>AI-assisted build under my design ownership; the owner made the final calls</li></ul></div>
      <div><Label>Timeline</Label><ul><li>Service: May – Nov 2026</li><li>App: Aug – Nov 2026</li></ul></div>
      <div><Label>Status</Label><ul><li>iPhone in App Store review</li><li>Android approved, held for launch</li></ul></div>
    </div>
  )
  const meta = (
          <div className="s2-meta">
            <div><Label>Role</Label><ul><li>Product designer: research, service design, UI, design system, front-end build</li><li>The owner set the business rules and made the final picks</li><li>AI-assisted implementation, under my design ownership</li></ul></div>
            <div><Label>Timeline</Label><ul><li>Service: May – Nov 2026</li><li>Storefront build: Aug – Nov 2026</li><li>Shopper testing next</li></ul></div>
            <div><Label>Status</Label><ul><li>iPhone app in App Store review</li><li>Approved on Google Play, held for launch</li><li>Website browse-only; orders on test payments until launch</li></ul></div>
          </div>
  )
  return (
    <>
    <article className={`cx sf2${THEME ? ` sf2--${THEME}` : ''}${TIGHT ? ' sf2--tight' : ''}`}>
      {/* Intro: statement, role and results, a row of real screens (Goolkasian, Kosas) */}
      <header className="s2-intro s2-intro--v2">
        {TIGHT ? <div className="s2-wide"><Link to="/" className="s2-back">← Work</Link></div> : null}
        {/* Review, Nov 19: the title, the short story and the role come first, the motion hero right after (it used to
            fill the first screen, so it read as an ad before a recruiter knew what Danny did). */}
        <div className="s2-wide">
          {TIGHT ? null : <Link to="/" className="s2-back">← Work</Link>}
          <Label>La Bodega online store · Calhoun, Georgia · 2026</Label>
          <div className="s2-headrow">
          <h1 className="s2-title">From WhatsApp orders to the store’s own app</h1>
          <div>
          <p className="s2-sub">{TIGHT
            ? 'Families were already ordering by text and through local drivers. A WhatsApp pilot proved the demand and showed where chat ordering stops working, so I designed the store’s own bilingual app: real prices, meat by weight, delivery or pickup.'
            : 'Families were already ordering by text and through local drivers. I designed the bilingual app that lets them see prices, pick a weight and get it delivered, from the same store.'}</p>
          <ul className="s2-tags" aria-label="Disciplines"><li>Service design</li><li>Mobile</li><li>Design system</li></ul>
          </div>
          </div>
        </div>
        {TIGHT ? <div className="s2-wide s2-meta-after s2-meta-first">{tightMeta}</div> : null}
        {/* Device wall (Goolkasian / Instacart): breadth of real screens, the store itself, and three phones playing the app's own motion */}
        <div className="s2-wall-band">
          {HERO_MOTION ? <HeroMotion /> : (
          <div className="s2-wall">
            {HERO_WALL.map((t, i) => t.photo ? (
              <figure key={t.photo} className="s2-wall__photo">
                <img src={`${HQ}/${t.photo}?v=${V}`} alt={t.alt} loading="eager" />
              </figure>
            ) : (
              <figure key={t.src || t.video} className={`s2-wall__phone${i % 2 ? ' is-down' : ''}`}>
                {t.video
                  ? <Screen video={t.video} poster={t.poster} base={t.base || F} alt={t.alt} noTag />
                  : <Screen src={t.src} base={t.base || HQ} alt={t.alt} noTag />}
              </figure>
            ))}
          </div>
          )}
        </div>
        {IDEAS ? (
          <div className="s2-wide s2-short" aria-label="In short">
            <div><span className="s2-label">The problem</span><p>Families were already ordering from the store by text and through local drivers, checking out on other people’s loyalty numbers.</p></div>
            <div><span className="s2-label">What I did</span><p>Ran a WhatsApp pilot, then designed and built the store’s own bilingual app: real prices, meat by weight, delivery or pickup.</p></div>
            <div><span className="s2-label">Where it stands</span><p>iPhone app in App Store review; Android approved and held for launch; the website is browse-only until launch.</p></div>
          </div>
        ) : null}
        {TIGHT ? null : <div className="s2-wide s2-meta-after">{meta}</div>}
      </header>

      {TIGHT ? <TightBody /> : (<>
      {/* Beat 1 */}
      <Chapter id="opportunity" n="01" label="Already ordering" title="Customers were already ordering, by text and through local drivers">
        <div className="s2-col">
          {TIGHT ? null : <blockquote className="s2-hook">At the register, staff noticed drivers checking out on other customers’ loyalty numbers.</blockquote>}
          {TIGHT ? null : <p>Local cab drivers were buying groceries for several families at once. Working families, especially mothers, trusted them, skipped app fees and markups, and some had no car.</p>}
          {TIGHT ? null : <p className="s2-muted">Customers were also asking the store, by message, whether they could order. Some already knew exactly what they wanted and sent the list.</p>}
        </div>
        {TIGHT ? <div className="s2-wide st-block"><StoryStrip panels={STORY_DRIVER} label="The delivery that already existed, in four panels" quote={{ t: '“The apps don’t pay once you count the gas and the time.”', who: 'A local cab driver · paraphrased from our conversations' }} /><p className="s2-note" style={{ marginTop: 32 }}>The store already knew who these shoppers were: a phone-number loyalty program had replaced paper coupons in May.</p></div> : null}
        <div className="s2-wide s2-block" hidden={TIGHT}>
          <div className="s2-panel">
            <div className="s2-flow" aria-label="The delivery that already existed">
              <div className="s2-node"><b>Families</b><span>Familiar groceries, store prices</span></div><span className="s2-arrow" aria-hidden="true">↔</span>
              <div className="s2-node"><b>Local drivers</b><span>Buy, carry, deliver; paid by the family</span></div><span className="s2-arrow" aria-hidden="true">↔</span>
              <div className="s2-node is-us"><b>La Bodega</b><span>Sells at the register, on someone’s loyalty number</span></div>
            </div>
          </div>
          <p className="s2-note">The store already knew who these shoppers were: a phone-number loyalty program had replaced paper coupons in May.</p>
        </div>
        {TIGHT ? (
          <div className="s2-wide"><More title="How the service grew, May to November">
            <ol className="s2-rail" aria-label="Service evolution, May to November 2026">
              {TIMELINE.map(([when, what]) => <li key={when + what}><b>{when}</b>{what}</li>)}
            </ol>
          </More></div>
        ) : (
        <div className="s2-wide s2-block">
          <ol className="s2-rail" aria-label="Service evolution, May to November 2026">
            {TIMELINE.map(([when, what]) => <li key={when + what}><b>{when}</b>{what}</li>)}
          </ol>
        </div>
        )}
      </Chapter>

      {/* Beat 2 */}
      <Chapter id="channel" n="02" label="Own channel" title="A marketplace, or the store’s own channel">
        <div className="s2-col">
          <p>Instacart offered to list the store for 12% of each order at store prices, or 16% if online prices could differ: $7–9 on a $58 basket.{TIGHT ? null : ' Drivers said the delivery apps didn’t pay once their time and fuel were counted.'}</p>
        </div>
        <div className="s2-wide s2-block">
          {TIGHT ? <SketchR d={SK_FORK} m={SK_FORK_M} /> : null}
          <div className="s2-money" hidden={TIGHT}>
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
        <div className={`s2-wide${TIGHT ? '' : ' s2-block'}`}>
          {TIGHT ? null : <div className="s2-table-wrap">
            <table className="s2-table">
              <thead><tr><th></th><th>Cost to the store</th><th>Who does the work</th><th>Decision</th></tr></thead>
              <tbody>{ROUTES.map((r) => <tr key={r[0]} className={r[3] === 'Chosen' ? 'is-us' : ''}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>)}</tbody>
            </table>
          </div>}
          <More title={TIGHT ? 'The three routes compared, who else sells groceries in Calhoun, and the local market' : 'Who else sells groceries in Calhoun, and the local market'}>
            {TIGHT ? <div className="s2-table-wrap" style={{ marginBottom: 24 }}>
              <table className="s2-table">
                <thead><tr><th></th><th>Cost to the store</th><th>Who does the work</th><th>Decision</th></tr></thead>
                <tbody>{ROUTES.map((r) => <tr key={r[0]} className={r[3] === 'Chosen' ? 'is-us' : ''}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>)}</tbody>
              </table>
            </div> : null}
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
        {TIGHT ? <div className="s2-wide s2-block"><SketchR d={SK_PILOT} m={SK_PILOT_M} /></div> : null}
        <div className="s2-wide s2-block" hidden={TIGHT}>
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
              {TIGHT ? <Label>What customers asked</Label> : <h3 className="s2-h4">What customers asked</h3>}
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
            {TIGHT
              ? <p className="s2-muted">The answer was browsing: the photo and the price per pound on the screen, without asking. Paid orders and repeat customers made the case to build the store’s own app; chat stays for lists and help.</p>
              : <p className="s2-muted">The answer was browsing: the photo and the price per pound on the screen, without asking.</p>}
          </div>
        </div>
        <div className={`s2-wide${TIGHT ? '' : ' s2-block'}`}>
          {TIGHT ? null : <div className="s2-research">
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
          </div>}
          <More title={TIGHT ? 'Why WhatsApp alone wasn’t enough, and the methods' : 'Methods: register data, inbox coding, conversations, reviews, walk-throughs'}>
            {TIGHT ? <ul className="s2-list" style={{ marginBottom: 24 }}>
              <li><b>Reach.</b> About 600 of roughly 2,800 loyalty customers aren’t on WhatsApp.</li>
              <li><b>Finding.</b> Showing items in chat meant syncing 8,000+ register-priced products into a second catalog.</li>
              <li><b>Retention.</b> Customers drift if flyers stop for a few weeks; a “we miss you” message worked only with the flyer.</li>
              <li><b>Rules.</b> Beer posters, and even replies that said “cerveza”, were blocked; after 24 hours of silence only paid templates are allowed.</li>
            </ul> : null}
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
          {TIGHT ? null : <p>The first direction, on Oct 6, carried desktop habits onto a phone. On Oct 24 I archived three weeks of finished screens and re-wireframed every flow phone-first.</p>}
          <p className={TIGHT ? undefined : 's2-muted'}>Prices and stock come from the register. Meat and produce are priced after weighing. Most chats are in Spanish. Beer needs a 21+ check, and Apple requires account deletion in the app.</p>
        </div>
        <div className="s2-wide s2-block">
          <div className="s2-step"><Label>{TIGHT ? '1 of 3' : 'Step 1'}</Label><h3 className="s2-h3">{TIGHT ? 'What I took, and five directions' : 'What I took from other apps'}</h3>
            <p className="s2-muted">Screens from delivery, grocery, loyalty and property apps, kept only where one answered a frustration from the research. Seven made it in. Refused: checkout on another company’s site, and a pop-up on the first screen; six of nine food sites did each one.</p></div>
          <div className="s2-refs">
            {REFS.map(([src, app, took]) => (
              <figure key={src}><a href={`${F}/${src}?v=${V}`} target="_blank" rel="noopener noreferrer"><img src={`${F}/${src}?v=${V}`} alt={`${app} reference screen`} loading="lazy" /></a><figcaption><b>{app}</b>{took}</figcaption></figure>
            ))}
          </div>
        </div>

        <div className="s2-wide s2-block">
          {TIGHT
            ? <p className="s2-muted s2-step">Then five directions with the same content, so only the look changed. C, built on the store’s own hand-painted signs, became the base; D added A’s product photos and kept B’s print style for the weekly deal block.</p>
            : <div className="s2-step"><Label>Step 2</Label><h3 className="s2-h3">Five directions, one picked</h3>
            <p className="s2-muted">Same content and type in each, so only the look changed. C, built on the store’s own hand-painted signs, became the base; D added A’s product photos and kept B’s print style only for the weekly deal block.</p></div>}
          <Board src="p-directions.jpg" alt="Directions A to E on a phone, same carne asada content: A cut-out food on cream, B halftone print, C painted signs, D signs with photos and a printed deal block, E a fuller single-brand take" cap="Directions A–E, same content. D was picked." />
          {TIGHT ? <More title="What happened to each direction"><DirTable /></More> : <DirTable />}
        </div>

        <div className="s2-wide s2-block">
          <div className="s2-step"><Label>{TIGHT ? '2 of 3' : 'Step 3'}</Label><h3 className="s2-h3">The Oct 24 reset</h3>
            <p className="s2-muted">An audit of the Oct 6 screens found a web catalogue squeezed onto a phone. I archived three weeks of finished screens and re-wireframed every flow phone-first.</p></div>
          <div className="s2-ba">
            <figure>
              <Label>Oct 6 · a catalogue on a phone</Label>
              <Screen src="oct6-aisle.jpg" base={HQ} alt="October 6 design: a category sidebar and small product tiles with Agregar buttons">{IDEAS ? (<><LolaNote who="think" at={{ left: '3%', top: '73%' }}>The sidebar takes a third</LolaNote><LolaNote who="think" side="left" at={{ right: '3%', top: '86%' }}>Tiny tiles, small buttons</LolaNote></>) : (<><span className="s2-pin" style={{ left: '1%', top: '71%' }}>1</span><span className="s2-pin" style={{ left: '44%', top: '61%' }}>2</span></>)}</Screen>
            </figure>
            <figure>
              <Label>Shipped · phone first</Label>
              <Screen src="aisle-meat.jpg" base={HQ} alt="Shipped Meat and Seafood aisle: category chips and large product cards with prices by the pound">{IDEAS ? (<><LolaNote who="thumbs" at={{ left: '3%', top: '25.5%' }}>Chips give the space back</LolaNote><LolaNote who="thumbs" side="left" at={{ right: '3%', top: '57%' }}>Photo, price per pound, one tap</LolaNote></>) : (<><span className="s2-pin" style={{ left: '2%', top: '14%' }}>1</span><span className="s2-pin" style={{ left: '44%', top: '34%' }}>2</span></>)}</Screen>
            </figure>
          </div>
          <div className={`s2-ba-notes${IDEAS ? ' is-lola' : ''}`}>
            <p><span className="s2-pin">1</span><span><b>Navigation.</b> The category sidebar took a third of the screen. Chips across the top give it back.</span></p>
            <p><span className="s2-pin">2</span><span><b>Picking a product.</b> Small tiles with an “Agregar” button became photo cards with the price per pound and one-tap add.</span></p>
          </div>
          <p className="s2-note">The same task at the same size. Revised through design critique, not a user test.</p>
          {TIGHT ? (
            <>
              <p className="s2-muted s2-step" style={{ marginTop: 48 }}>Then the structure, drawn again phone-first: four tabs with search, cart and Ask Lola one tap away, and seven flows with their failure branches, shopper and staff side by side.</p>
              <div className="s2-boards">
                <Board src="p-sitemap.jpg" alt="Sitemap of the shipped app with real screens: four tabs, sheets over any screen, checkout and orders, first open, and the staff handheld" cap="The shipped sitemap. Every box is a screen in the app." />
                <Board src="p-flow-sides.jpg" alt="One order from three sides: what the shopper sees, what staff do on the handheld and at the register, and what happens to the payment hold and final charge" cap="One order, three sides: shopper, staff, payment." />
              </div>
              <More title="Where things live, the find-a-product flow and the Oct 24 wireframes"><TightIA /></More>
            </>
          ) : null}
        </div>

        {TIGHT ? null : <><div className="s2-wide s2-block">
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
        </div></>}

        <div className="s2-wide s2-block" id="design-system">
          <div className="s2-step"><Label>{TIGHT ? '3 of 3' : 'Step 7'}</Label><h3 className="s2-h3">The design system</h3>
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
            {TIGHT ? null : <p>The shopper’s language decides which name leads; the other stays underneath. Search matches either name, so “serrano peppers” and “chile serrano” find the same item.</p>}
          </div>
          {TIGHT ? null : <p className="s2-note">Designed and built; not yet tested with shoppers.</p>}
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
                {TIGHT ? null : <><dt className="s2-label">Status</dt><dd><div className="s2-status">{IDEAS ? <Stamp size={26} /> : null}<span><i />Built</span><span><i />Browsable on the web</span><span className="is-open"><i />Not tested with shoppers</span></div></dd></>}
              </dl>
            </div>
            <div className="s2-panel"><figure><Screen src="lola-list.jpg" base={HQ} alt="Ask Lola: a pasted shopping list, I found 8 of your 10 items, tap to add" /><figcaption className="s2-cap">Ask Lola with a list: she finds what she can, and asks about the rest.</figcaption></figure></div>
          </section>

          <section className={`s2-decision${TIGHT ? ' s2-decision--side' : ''}`} aria-labelledby="d2">
            <div className="s2-chain s2-chain--text">
              <div>
                <h3 id="d2" className="s2-h3">Weighed items, with a hold</h3>
                <dl>
                  <dt className="s2-label">We saw</dt><dd>Shoppers want the meat price before paying. Fixed-price packs answered that, but meant a second product list drifting from the register.</dd>
                  <dt className="s2-label">We considered</dt><dd>Keeping packs: simple prices, two catalogues to maintain.</dd>
                  <dt className="s2-label">We chose</dt><dd>Pick a weight. The card holds the estimate plus 15%; the register charges the packed total and releases the rest.</dd>
                  <dt className="s2-label">The cost</dt><dd>The hold is bigger than the estimate, which changes what shoppers think they’re paying. Checkout says it once, before they pay:
                    <p className="s2-copy">“Meat and produce are weighed when packed. We hold $X on your card and charge only the exact total.”</p></dd>
                  {TIGHT ? null : <><dt className="s2-label">Status</dt><dd><div className="s2-status">{IDEAS ? <Stamp size={26} /> : null}<span><i />Built</span><span><i />Test orders passed</span><span className="is-open"><i />Not tested with shoppers</span></div></dd></>}
                </dl>
              </div>
            </div>
            <div className="s2-ba s2-block" style={{ '--n': 3, marginTop: 48 }}>
              <figure><Label>Before · a price per pack (wireframe)</Label><Screen src="d1-before.jpg" alt="October 24 wireframe: Chuck Roll sold in 1, 2 or 4 lb packs at a fixed pack price" /><figcaption>Fixed packs: one more list to keep in step with the register.</figcaption></figure>
              <figure><Label>Shipped · pick a weight</Label><Screen src="product.jpg" base={HQ} alt="Shipped: Ribeye chosen by weight, 1, 2, 3 lb or Other, with a note for the butcher" /><figcaption>Priced by the pound; the butcher weighs the cut.</figcaption></figure>
              <figure><Label>After packing · the exact weight</Label><Screen src="final-total.jpg" base={HQ} alt="Your order is packed: $0.98 back to your card, charged the exact weight" /><figcaption>The difference goes back to the card, said in dollars.</figcaption></figure>
            </div>
          </section>

          <section className={`s2-decision${TIGHT ? ' s2-decision--side' : ''}`} aria-labelledby="d3">
            <div className="s2-chain s2-chain--text">
              <h3 id="d3" className="s2-h3">One order, across shopper and staff</h3>
              <dl>
                <dt className="s2-label">We saw</dt><dd>In chat, staff checked every item by hand, and a missing item meant another round of messages.</dd>
                <dt className="s2-label">We chose</dt><dd>Each handoff is a screen someone acts on. Swaps are the same price or less; if the shopper doesn’t answer in 15 minutes, the item is left out and not charged.</dd>
                {TIGHT ? null : <><dt className="s2-label">Status</dt><dd><div className="s2-status">{IDEAS ? <Stamp size={26} /> : null}<span><i />Built</span><span><i />Test orders passed</span><span className="is-open"><i />Not tested with staff at volume</span></div></dd></>}
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
        {IDEAS ? (
          <div className="s2-wide s2-block s2-block--first">
            <div className="s2-step"><Label>Try it</Label><h3 className="s2-h3">One order, start to finish</h3>
              <p className="s2-muted">The real screens in order. Tap the phone, or pick a step.</p></div>
            <div className="s2-panel"><TapPhone /></div>
          </div>
        ) : null}
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
          {TIGHT ? null : <div className="s2-block">
            <div className="s2-step"><Label>Motion</Label><h3 className="s2-h3">The moments that move</h3>
              <p className="s2-muted">Recorded from the app. Each one confirms something happened: the store opened, the order moved, the points landed.</p></div>
            <div className="s2-panel s2-motion">
              <figure><Screen video="splash-anim.mp4" poster="splash-anim-poster.jpg" base={A} alt="Opening: the La Bodega wordmark and the arch rise" /><figcaption><b>Opening</b>The wordmark, then the arch rises</figcaption></figure>
              <figure><Screen video="d-live.mp4" poster="d-live-poster.jpg" alt="Live Activity on the Lock Screen: received, preparing, on the way, delivered" /><figcaption><b>Lock Screen</b>The order as a Live Activity</figcaption></figure>
              <figure><Screen video="d-points.mp4" poster="d-points-poster.jpg" alt="Points sheet after delivery: 180 counts up to 222, $5 off ready" /><figcaption><b>Points</b>Counted up after delivery</figcaption></figure>
            </div>
          </div>}
          <div className="s2-block">
            <div className="s2-step"><Label>{TIGHT ? 'Motion' : 'Moments of done'}</Label><h3 className="s2-h3">{TIGHT ? 'One way to say done, built once' : 'One success language, built once'}</h3>
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
          <More title={TIGHT ? 'More screens and motion: every state, the opening, the Lock Screen and points' : 'More screens: every state, the store side and the full delivery diagram'}>
            {TIGHT ? <div className="s2-motion s2-motion--more">
              <figure><Screen video="splash-anim.mp4" poster="splash-anim-poster.jpg" base={A} alt="Opening: the La Bodega wordmark and the arch rise" /><figcaption><b>Opening</b>The wordmark, then the arch rises</figcaption></figure>
              <figure><Screen video="d-live.mp4" poster="d-live-poster.jpg" alt="Live Activity on the Lock Screen: received, preparing, on the way, delivered" /><figcaption><b>Lock Screen</b>The order as a Live Activity</figcaption></figure>
              <figure><Screen video="d-points.mp4" poster="d-points-poster.jpg" alt="Points sheet after delivery: 180 counts up to 222, $5 off ready" /><figcaption><b>Points</b>Counted up after delivery</figcaption></figure>
            </div> : null}
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
              <h3>{IDEAS ? <Stamp size={30} /> : null}Release status</h3>
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
      </>)}
    </article>
    <SectionNav />
    <CaseStudyContact />
    </>
  )
}
