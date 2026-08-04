import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LOOPS } from '../../data/laBodegaOpsCase'
import { PhoneShot } from './OpsWireframes'

gsap.registerPlugin(ScrollTrigger)

const LOOP_BY_ID = Object.fromEntries(LOOPS.map((l) => [l.id, l]))

/** Per-beat copy so WALK and DOOR don’t share the same OPS block */
function beatLoop(base, overrides) {
  return {
    ...base,
    ...overrides,
    cards: overrides.cards || base.cards,
  }
}

function BeatCopy({ phase, loop }) {
  if (!loop) return null
  return (
    <div className="lbd-ops__beat-copy">
      {/* One eyebrow only — phase already names the loop (OPS / CONTROL / TIME) */}
      {phase ? (
        <p className="lbd-ops__phase-label">{phase}</p>
      ) : (
        <p className="lbd-ops__loop-label">{loop.label}</p>
      )}
      <p className="lbd-ops__loop-title">{loop.title}</p>
      {loop.body ? <p className="lbd-ops__loop-body">{loop.body}</p> : null}
      <ul className="lbd-ops__loop-chips">
        {loop.cards.slice(0, 3).map((c) => (
          <li key={c.title}>{c.title}</li>
        ))}
      </ul>
    </div>
  )
}

function BeatCard({ phase, loop, phone, step }) {
  return (
    <article className="lbd-ops__vbeat-card" data-beat={step || loop.id}>
      <div className="lbd-ops__vbeat-inner">
        <BeatCopy phase={phase} loop={loop} />
        <PhoneShot
          className="lbd-ops__phone--bento lbd-ops__phone--lead lbd-ops__phone--vbeat"
          {...phone}
          caption={undefined}
        />
      </div>
    </article>
  )
}

function StaticBeats({ beats }) {
  return (
    <div className="lbd-ops__vbeat-static-list">
      {beats.map((b, i) => (
        <div key={`${b.step}-${i}`} className="lbd-ops__phase lbd-ops__phase--static">
          <BeatCard phase={b.phase} loop={b.loop} phone={b.phone} step={b.step} />
        </div>
      ))}
    </div>
  )
}

/** One readable card at a time — neighbors cut at half-step. */
function beatOpacity(abs) {
  if (abs >= 0.5) return 0
  if (abs <= 0.1) return 1
  return Math.max(0, (1 - abs / 0.5) ** 1.35)
}

function clampIndex(i, n) {
  return Math.max(0, Math.min(n - 1, i))
}

/**
 * Gabriel-style vertical scroll beats: pinned stage, cards stack on rotateX.
 * WALK → DOOR → BUDGET → PULSE — right-rail progress stays in view.
 */
export function OpsSolutionCubes({ shots }) {
  const rootRef = useRef(null)

  const beats = useMemo(
    () => [
      {
        phase: 'Purchasing',
        step: 'WALK',
        phone: shots.walk,
        loop: beatLoop(LOOP_BY_ID.ops, {
          title: 'Walk with vendor',
          body: 'Manager scans products while walking the rep. Screen shows last paid, lowest price, and vendor budget.',
          cards: [
            { title: 'Last paid' },
            { title: 'Lowest price' },
            { title: 'Vendor budget' },
          ],
        }),
      },
      {
        phase: 'Purchasing',
        step: 'DOOR',
        phone: shots.dsd,
        loop: beatLoop(LOOP_BY_ID.ops, {
          title: 'Door delivery',
          body: 'Manager scans the invoice (OCR). If a line is missed, a voice note fills product, quantity, and price.',
          cards: [
            { title: 'Invoice OCR' },
            { title: 'Voice note' },
            { title: 'Product · qty · price' },
          ],
        }),
      },
      {
        phase: 'Control',
        step: 'BUDGET',
        phone: shots.budgets,
        loop: beatLoop(LOOP_BY_ID.control, {
          title: 'Dept budgets',
          body: 'Admin sets weekly caps from department contribution. Managers can hold a buy when the cap is hit.',
          cards: [
            { title: 'Weekly caps' },
            { title: 'Purchase hold' },
            { title: 'Owner escalations' },
          ],
        }),
      },
      {
        phase: 'Today',
        step: 'PULSE',
        phone: shots.manager ?? shots.team,
        loop: beatLoop(LOOP_BY_ID.time, {
          title: 'Store Pulse',
          body: 'Manager opens Today. Screen shows who is on the floor, open approvals, and sales vs labor.',
          cards: [
            { title: 'On the floor' },
            { title: 'Approvals' },
            { title: 'Sales vs labor' },
          ],
        }),
      },
    ],
    [shots],
  )

  const beatCount = beats.length

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrow = window.matchMedia('(max-width: 799px)').matches
    const staticEl = root.querySelector('.lbd-ops__vbeat-static')

    if (reduce || narrow) {
      root.classList.add('is-static')
      if (staticEl) staticEl.removeAttribute('aria-hidden')
      return undefined
    }

    root.classList.remove('is-static')
    if (staticEl) staticEl.setAttribute('aria-hidden', 'true')

    const stepNames = beats.map((b) => b.step)
    const n = beatCount

    const ctx = gsap.context(() => {
      const pin = root.querySelector('.lbd-ops__vbeat-pin')
      const stage = root.querySelector('.lbd-ops__vbeat-stage')
      const chrome = root.querySelector('.lbd-ops__vbeat-chrome')
      if (!pin || !stage || !chrome) return

      // Direct children only — never pick static-stack cards or nested nodes
      const cards = Array.from(stage.children).filter((el) => el.classList.contains('lbd-ops__vbeat-card'))
      const dots = Array.from(chrome.querySelectorAll('.lbd-ops__vbeat-dot'))
      const stepLabel = chrome.querySelector('.lbd-ops__vbeat-step-active')
      const stepIndex = chrome.querySelector('.lbd-ops__vbeat-step-index')
      if (cards.length !== n || dots.length !== n) return

      let lastActive = 0

      const setActive = (index) => {
        const i = clampIndex(index, n)
        lastActive = i
        dots.forEach((d, di) => d.classList.toggle('is-active', di === i))
        if (stepLabel) stepLabel.textContent = stepNames[i]
        if (stepIndex) stepIndex.textContent = String(i + 1)
        chrome.dataset.beat = stepNames[i]
      }

      const place = (rawProgress) => {
        const progress = Math.min(1, Math.max(0, rawProgress))
        // Hold each beat until we cross into the next (avoids label jumping ahead of phone)
        const p = progress * (n - 1)
        const active = clampIndex(Math.round(p), n)

        cards.forEach((card, i) => {
          const d = i - p
          const abs = Math.abs(d)
          const settled = abs < 0.12
          const opacity = settled ? 1 : beatOpacity(abs)
          gsap.set(card, {
            yPercent: settled ? 0 : d * 70,
            rotateX: settled ? 0 : d * -55,
            z: settled ? 0 : -abs * 200,
            scale: settled ? 1 : 1 - Math.min(abs, 1) * 0.03,
            opacity,
            filter: settled || abs < 0.14 ? 'none' : `blur(${Math.min(abs * 1.4, 1.2)}px)`,
            zIndex: Math.round(200 - abs * 40),
            transformOrigin: '50% 50%',
            force3D: true,
            pointerEvents: abs < 0.22 ? 'auto' : 'none',
            visibility: opacity < 0.05 ? 'hidden' : 'visible',
          })
        })

        // Prefer the card closest to camera (highest opacity / lowest abs)
        let best = active
        let bestAbs = Math.abs(active - p)
        for (let i = 0; i < n; i += 1) {
          const abs = Math.abs(i - p)
          if (abs < bestAbs - 0.001) {
            bestAbs = abs
            best = i
          }
        }
        // Hysteresis: don't flip label until the new beat is clearly nearer
        if (best !== lastActive && bestAbs > 0.42) {
          best = lastActive
        }
        setActive(best)
      }

      place(0)

      ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (n * 1.05))}`,
        scrub: 0.35,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => place(self.progress),
        onRefresh: (self) => place(self.progress),
      })
    }, root)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [beats, beatCount])

  return (
    <div className="lbd-ops__cubes lbd-ops__vbeat" ref={rootRef}>
      <div className="lbd-ops__vbeat-static" aria-hidden="true">
        <StaticBeats beats={beats} />
      </div>

      <div className="lbd-ops__vbeat-motion">
        <div className="lbd-ops__vbeat-pin">
          <aside
            className="lbd-ops__vbeat-chrome"
            aria-label="Solution beat progress"
            data-beat={beats[0].step}
          >
            <p className="lbd-ops__vbeat-step">
              <span className="lbd-ops__vbeat-step-active">{beats[0].step}</span>
              <span className="lbd-ops__vbeat-step-count" aria-hidden="true">
                <span className="lbd-ops__vbeat-step-index">1</span>
                <span>/{beatCount}</span>
              </span>
            </p>
            <ol className="lbd-ops__vbeat-dots">
              {beats.map((b, i) => (
                <li key={`${b.step}-${i}`}>
                  <span
                    className={`lbd-ops__vbeat-dot${i === 0 ? ' is-active' : ''}`}
                    title={b.step}
                  />
                </li>
              ))}
            </ol>
          </aside>

          <div className="lbd-ops__vbeat-stage" aria-label="Solution scroll beats">
            {beats.map((b, i) => (
              <BeatCard
                key={`${b.step}-${i}`}
                phase={b.phase}
                loop={b.loop}
                phone={b.phone}
                step={b.step}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpsSolutionCubes
