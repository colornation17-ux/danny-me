import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import STATE_PATHS from '../data/usStatePaths.json'
import { track } from '../lib/track'

gsap.registerPlugin(ScrollTrigger)

const MAP_VIEWBOX = '174 100 959 593'
const ROUTE_COLOR = '#EA580C'
const VISITED_COLOR = '#c9d9c9'
const BASE_COLOR = '#d9d3bd'
const OTHER_COLOR = '#f6f4ee'

// Fractional position (0-1) within each stop's state bounding box, based on
// the real-world location relative to that state's shape.
const TRIP_STOPS = [
  // Departure / midwest → west (photos pending for IN)
  { id: 'indianapolis', title: 'Indianapolis', desc: 'Indiana, departure', state: 'IN', fx: 0.55, fy: 0.55, note: 'Packed the car. Twelve states waiting.' },
  { id: 'illinois', title: 'Chicago', desc: 'Illinois, kayaks under the bridge', state: 'IL', fx: 0.82, fy: 0.18, note: 'Lime kayaks, steel overhead, Chicago in the middle.', photo: '/travel/chicago-il.jpg' },
  { id: 'missouri', title: 'Missouri', desc: 'Crossing the Mississippi', state: 'MO', fx: 0.92, fy: 0.55, note: 'Somewhere past St. Louis, the trip finally felt real.', photo: '/travel/missouri.jpg' },
  { id: 'kansas', title: 'Fort Riley', desc: 'Junction City, Kansas', state: 'KS', fx: 0.55, fy: 0.38, note: 'Water tower and open sky. Midwestern mile marker.', photo: '/travel/fort-riley-ks.jpg' },
  { id: 'garden-of-gods', title: 'Garden of the Gods', desc: 'Colorado Springs', state: 'CO', fx: 0.55, fy: 0.62, note: 'Red rock spires, no crowds, just us and the wind.', photo: '/travel/garden-of-gods.jpg' },
  { id: 'cliff-dwellers', title: 'Manitou Cliff Dwellings', desc: 'Manitou Springs', state: 'CO', fx: 0.53, fy: 0.6, note: 'Ancient homes carved into sandstone, still standing.', photo: '/travel/cliff-dwellings.jpg' },
  { id: 'pikes-peak', title: 'Pikes Peak', desc: 'America’s Mountain', state: 'CO', fx: 0.52, fy: 0.58, note: 'Snow gate, map board, peaks waiting above.', photo: '/travel/pikes-peak.jpg' },
  { id: 'fairplay', title: 'Fairplay', desc: 'South Park, Colorado', state: 'CO', fx: 0.42, fy: 0.5, note: 'Open road, red barn, snowline ahead.', photo: '/travel/fairplay-co.jpg' },
  { id: 'breckenridge', title: 'Breckenridge · Blue River', desc: 'Summit County', state: 'CO', fx: 0.38, fy: 0.38, note: 'Snow walls on both sides. Summer, somehow.', photo: '/travel/breckenridge-blue-river.jpg' },
  { id: 'vail', title: 'Vail', desc: 'Driving through, snow on the pass', state: 'CO', fx: 0.3, fy: 0.35, note: 'Snow on the pass in July. Drove through anyway.', photo: '/travel/vail.jpg' },
  { id: 'canyonlands', title: 'Canyonlands', desc: 'Island in the Sky · Potash', state: 'UT', fx: 0.85, fy: 0.65, note: 'Off-roading Potash Road, dust everywhere, worth it.', photo: '/travel/canyonlands.jpg' },
  { id: 'noahs-arc', title: 'Noah’s Arc', desc: 'Mesa Arch, Canyonlands', state: 'UT', fx: 0.8, fy: 0.62, note: 'Orange under the arch. Worth the early rise.', photo: '/travel/noahs-arc.jpg' },
  { id: 'monument-valley', title: 'Monument Valley', desc: 'Navajo Nation, UT/AZ', state: 'UT', fx: 0.75, fy: 0.95, note: 'The buttes from every movie, actually there.', photo: '/travel/monument-valley.jpg' },
  { id: 'frybread', title: 'Frybread', desc: 'Monument Valley roadside', state: 'UT', fx: 0.74, fy: 0.94, note: 'Hot frybread after the buttes. Best lunch of the trip.', photo: '/travel/monument-valley-frybread.jpg' },
  { id: 'forrest-gump', title: 'Forrest Gump Point', desc: 'Highway 163', state: 'UT', fx: 0.73, fy: 0.93, note: 'That straight shot everyone knows — we stood on it.', photo: '/travel/forrest-gump-point.jpg' },
  { id: 'antelope-canyon', title: 'Antelope Canyon', desc: 'Page, Arizona', state: 'AZ', fx: 0.55, fy: 0.08, note: 'Light beams cutting through the slot canyon walls.', photo: '/travel/antelope-canyon.jpg' },
  { id: 'horseshoe-bend', title: 'Horseshoe Bend', desc: 'Colorado River overlook', state: 'AZ', fx: 0.53, fy: 0.1, note: 'One wrong step from the edge. Best view of the trip.', photo: '/travel/horseshoe-bend.jpg' },
  { id: 'wirepass', title: 'Wire Pass Trail', desc: 'Paria Canyon', state: 'AZ', fx: 0.45, fy: 0.05, note: 'A slot canyon with no straight lines, just curves.', photo: '/travel/wirepass.jpg' },
  { id: 'white-pocket', title: 'White Pocket', desc: 'Vermilion Cliffs, after dark', state: 'AZ', fx: 0.4, fy: 0.07, note: 'Hiked in after dark, stars overhead, worth the risk.', photo: '/travel/white-pocket.jpg' },
  { id: 'zion', title: 'Zion', desc: 'Emerald Pools & The Narrows', state: 'UT', fx: 0.25, fy: 0.85, note: 'Emerald Pools, then the Narrows. Wet shoes for days.', photo: '/travel/zion.jpg' },
  { id: 'vegas', title: 'Las Vegas', desc: 'The drive through', state: 'NV', fx: 0.75, fy: 0.92, note: 'Sphere glowing on the night drive through.', photo: '/travel/las-vegas-sphere.jpg' },
  { id: 'sequoia', title: 'Sequoia', desc: 'National Park, California', state: 'CA', fx: 0.65, fy: 0.55, note: 'Trees older than any of our problems.', photo: '/travel/sequoia.jpg' },
  { id: 'route66', title: 'Route 66', desc: 'End of the Trail · Santa Monica', state: 'CA', fx: 0.25, fy: 0.78, note: 'End of the road. Feet in the Pacific at last.', photo: '/travel/route66-santa-monica.jpg' },
  { id: 'grand-canyon', title: 'Grand Canyon', desc: 'South Rim', state: 'AZ', fx: 0.25, fy: 0.15, note: 'Stood at the rim and still couldn’t believe the scale.', photo: '/travel/grand-canyon.jpg' },
  // Return leg
  { id: 'new-mexico', title: 'Santa Rosa', desc: 'New Mexico, sunrise on the highway', state: 'NM', fx: 0.72, fy: 0.38, note: 'Sun through the windshield. Still heading home.', photo: '/travel/santa-rosa-nm.jpg' },
  { id: 'texas', title: 'Big Texan', desc: 'Amarillo, Texas', state: 'TX', fx: 0.42, fy: 0.1, note: 'Flags, a yellow landmark, and a Texas-sized lunch.', photo: '/travel/amarillo-big-texan.jpg' },
  { id: 'oklahoma', title: 'Oklahoma', desc: 'Almost back east', state: 'OK', fx: 0.55, fy: 0.45, note: 'Last open stretch before the map folds up.', photo: '/travel/oklahoma-drive.jpg' },
]

// Full 12-state corridor — every state here has a stop so the marker visits it.
const ROUTE_STATES = [...new Set(TRIP_STOPS.map((s) => s.state))]
const ALL_STATE_CODES = Object.keys(STATE_PATHS)

function getFocusable(root) {
  if (!root) return []
  return [
    ...root.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ]
}

function TravelLightbox({ open, stop, onClose, labelId }) {
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 30)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      const items = getFocusable(root)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !stop?.photo || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="travel-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      ref={dialogRef}
      onClick={onClose}
    >
      <button
        ref={closeBtnRef}
        type="button"
        className="travel-lightbox__close"
        aria-label="Close photo"
        onClick={onClose}
      >
        Close
      </button>
      <figure
        className="travel-lightbox__frame"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className="travel-lightbox__img"
          src={stop.photo}
          alt={`${stop.title}${stop.desc ? ` — ${stop.desc}` : ''}`}
          decoding="async"
        />
        <figcaption id={labelId} className="travel-lightbox__cap">
          <span className="travel-lightbox__title">{stop.title}</span>
          {stop.note ? <span className="travel-lightbox__note">{stop.note}</span> : null}
        </figcaption>
      </figure>
    </div>,
    document.body,
  )
}

function RoadTripStatic({ stops, onOpenPhoto }) {
  return (
    <div className="road-trip road-trip--static" role="region" aria-label="Cross-country road trip stops">
      <ol className="road-trip__static-list">
        {stops.map((s) => (
          <li key={s.id} className="road-trip__static-item">
            {s.photo ? (
              <button
                type="button"
                className="road-trip__static-photo"
                aria-label={`View ${s.title} photo full size`}
                onClick={(e) => onOpenPhoto(s, e)}
              >
                <img src={s.photo} alt="" loading="lazy" decoding="async" />
              </button>
            ) : null}
            <div className="road-trip__static-text">
              <p className="road-trip__panel-eyebrow">{s.desc}</p>
              <h3 className="road-trip__panel-title">{s.title}</h3>
              {s.note ? <p className="road-trip__panel-note">{s.note}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function RoadTrip() {
  const svgRef = useRef(null)
  const scrollerRef = useRef(null)
  const pinRef = useRef(null)
  const markerRef = useRef(null)
  const panelRefs = useRef({})
  const [lightbox, setLightbox] = useState(null)
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )
  const lightboxLabelId = useId()
  const openerRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduceMotion(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
    const opener = openerRef.current
    openerRef.current = null
    window.requestAnimationFrame(() => {
      opener?.focus?.()
    })
  }, [])

  const openLightbox = useCallback((stop, event) => {
    if (!stop?.photo) return
    openerRef.current = event?.currentTarget ?? null
    setLightbox(stop)
    track('photo_map', { action: 'lightbox', stop: stop.id || stop.title || 'unknown' })
  }, [])

  useEffect(() => {
    if (reduceMotion) return undefined

    const svg = svgRef.current
    const marker = markerRef.current
    if (!svg || !marker) return undefined

    const ctx = gsap.context(() => {
      // Real geographic position for each stop, resolved from its state's
      // actual rendered shape rather than hand-placed coordinates.
      const stops = TRIP_STOPS.map((s) => {
        const statePath = svg.querySelector(`#us-${s.state}`)
        const box = statePath.getBBox()
        return { ...s, cx: box.x + s.fx * box.width, cy: box.y + s.fy * box.height }
      })

      gsap.set(marker, { attr: { cx: stops[0].cx, cy: stops[0].cy }, autoAlpha: 0 })
      gsap.set(Object.values(panelRefs.current).filter(Boolean), { autoAlpha: 0 })

      const stopGap = 1
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollerRef.current,
          start: 'top top',
          end: () =>
            `+=${Math.max(5200, window.innerHeight * (3.2 + TRIP_STOPS.length * 0.22))}`,
          scrub: 1.85,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (self.progress > 0.08) {
              track('photo_map', { action: 'scroll' }, { once: 'photo_map_scroll' })
            }
          },
        },
      })

      let lastState = null
      stops.forEach((s, i) => {
        const t = i * stopGap
        const panel = panelRefs.current[s.id]
        const statePath = svg.querySelector(`#us-${s.state}`)

        if (s.state !== lastState) {
          if (lastState) {
            const prevPath = svg.querySelector(`#us-${lastState}`)
            tl.to(prevPath, { attr: { fill: VISITED_COLOR }, duration: 0.45, ease: 'none' }, t)
          }
          tl.to(statePath, { attr: { fill: ROUTE_COLOR }, duration: 0.45, ease: 'none' }, t)
          lastState = s.state
        }

        tl.to(
          marker,
          {
            attr: { cx: s.cx, cy: s.cy },
            autoAlpha: 1,
            duration: 0.55,
            ease: 'none',
          },
          t,
        )

        if (panel) {
          // Soft crossfade windows so cards don't pop hard mid-scrub
          tl.fromTo(
            panel,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: 'none' },
            t + 0.08,
          )
          tl.to(
            panel,
            { autoAlpha: 0, y: -10, duration: 0.38, ease: 'none' },
            t + stopGap * 0.78,
          )
        }
      })
    }, scrollerRef)

    // GSAP's automatic refresh listeners are tied to the window 'load' event,
    // which has already fired by the time this mounts via client-side route
    // navigation, so the pin distance never gets calculated without this.
    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [reduceMotion])

  if (reduceMotion) {
    return (
      <>
        <RoadTripStatic stops={TRIP_STOPS} onOpenPhoto={openLightbox} />
        <TravelLightbox
          open={Boolean(lightbox)}
          stop={lightbox}
          onClose={closeLightbox}
          labelId={lightboxLabelId}
        />
      </>
    )
  }

  return (
    <div
      className="road-trip"
      ref={scrollerRef}
      role="region"
      aria-label={`Cross-country road trip, ${TRIP_STOPS.length} stops across ${ROUTE_STATES.length} states, about 6,000 miles`}
    >
      {/* Screen-reader itinerary — visual panels are motion-only */}
      <ol className="sr-only">
        {TRIP_STOPS.map((s) => (
          <li key={`sr-${s.id}`}>
            {s.title}
            {s.desc ? ` — ${s.desc}` : ''}
            {s.note ? `. ${s.note}` : ''}
          </li>
        ))}
      </ol>

      <div className="road-trip__pin" ref={pinRef}>
        <svg ref={svgRef} viewBox={MAP_VIEWBOX} className="road-trip__map" aria-hidden="true">
          {ALL_STATE_CODES.map((code) => (
            <path
              key={code}
              id={`us-${code}`}
              d={STATE_PATHS[code]}
              fill={ROUTE_STATES.includes(code) ? BASE_COLOR : OTHER_COLOR}
              stroke="#fff"
              strokeWidth="1"
            />
          ))}
          <circle ref={markerRef} r="6" fill={ROUTE_COLOR} stroke="#fff" strokeWidth="2" className="road-trip__marker" />
        </svg>

        <div className="road-trip__panel-stack">
          {TRIP_STOPS.map((s) => (
            <div
              key={s.id}
              ref={(el) => { panelRefs.current[s.id] = el }}
              className="road-trip__panel"
              aria-hidden="true"
            >
              {s.photo && (
                <div className="road-trip__media">
                  <button
                    type="button"
                    className="road-trip__polaroid"
                    aria-label={`View ${s.title} photo full size`}
                    onClick={(e) => openLightbox(s, e)}
                  >
                    <img
                      src={s.photo}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                  <span className="road-trip__view-cue" aria-hidden="true">
                    <span className="road-trip__view-cue--click">click to view</span>
                    <span className="road-trip__view-cue--tap">tap to view</span>
                  </span>
                </div>
              )}
              <div className="road-trip__panel-text">
                <p className="road-trip__panel-eyebrow">{s.desc}</p>
                <h3 className="road-trip__panel-title">{s.title}</h3>
                {s.note && <p className="road-trip__panel-note">{s.note}</p>}
              </div>
            </div>
          ))}
        </div>

        <p className="road-trip__hint" aria-hidden="true">
          <span className="road-trip__hint-car">🚗</span>
          Scroll to drive it
        </p>
      </div>

      <TravelLightbox
        open={Boolean(lightbox)}
        stop={lightbox}
        onClose={closeLightbox}
        labelId={lightboxLabelId}
      />
    </div>
  )
}
