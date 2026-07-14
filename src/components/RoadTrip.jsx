import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import STATE_PATHS from '../data/usStatePaths.json'

gsap.registerPlugin(ScrollTrigger)

const MAP_VIEWBOX = '174 100 959 593'
const ROUTE_COLOR = '#EA580C'
const VISITED_COLOR = '#c9d9c9'
const BASE_COLOR = '#d9d3bd'
const OTHER_COLOR = '#f6f4ee'

// Fractional position (0-1) within each stop's state bounding box, based on
// the real-world location relative to that state's shape.
const TRIP_STOPS = [
  // Departure / midwest → west (photos pending for IN + OK)
  { id: 'indianapolis', title: 'Indianapolis', desc: 'Indiana — departure', state: 'IN', fx: 0.55, fy: 0.55, note: 'Packed the car. Twelve states waiting.' },
  { id: 'illinois', title: 'Chicago', desc: 'Illinois — kayaks under the bridge', state: 'IL', fx: 0.82, fy: 0.18, note: 'Lime kayaks, steel overhead, Chicago in the middle.', photo: '/travel/chicago-il.jpg' },
  { id: 'missouri', title: 'Missouri', desc: 'Crossing the Mississippi', state: 'MO', fx: 0.92, fy: 0.55, note: 'Somewhere past St. Louis, the trip finally felt real.', photo: '/travel/missouri.jpg' },
  { id: 'kansas', title: 'Fort Riley', desc: 'Junction City, Kansas', state: 'KS', fx: 0.55, fy: 0.38, note: 'Water tower and open sky — Midwestern mile marker.', photo: '/travel/fort-riley-ks.jpg' },
  { id: 'garden-of-gods', title: 'Garden of the Gods', desc: 'Colorado Springs', state: 'CO', fx: 0.55, fy: 0.62, note: 'Red rock spires, no crowds, just us and the wind.', photo: '/travel/garden-of-gods.jpg' },
  { id: 'cliff-dwellers', title: 'Manitou Cliff Dwellings', desc: 'Manitou Springs', state: 'CO', fx: 0.53, fy: 0.6, note: 'Ancient homes carved into sandstone, still standing.', photo: '/travel/cliff-dwellings.jpg' },
  { id: 'pikes-peak', title: 'Pikes Peak', desc: 'America’s Mountain', state: 'CO', fx: 0.52, fy: 0.58 },
  { id: 'fairplay', title: 'Fairplay', desc: 'South Park, Colorado', state: 'CO', fx: 0.42, fy: 0.5 },
  { id: 'breckenridge', title: 'Breckenridge · Blue River', desc: 'Summit County', state: 'CO', fx: 0.38, fy: 0.38 },
  { id: 'vail', title: 'Vail', desc: 'Driving through, snow on the pass', state: 'CO', fx: 0.3, fy: 0.35, note: 'Snow on the pass in July. Drove through anyway.', photo: '/travel/vail.jpg' },
  { id: 'canyonlands', title: 'Canyonlands · Island in the Sky', desc: 'Potash off-roading, Mesa Arch', state: 'UT', fx: 0.85, fy: 0.65, note: 'Off-roading Potash Road, dust everywhere, worth it.', photo: '/travel/canyonlands.jpg' },
  { id: 'monument-valley', title: 'Monument Valley', desc: 'Navajo Nation, UT/AZ', state: 'UT', fx: 0.75, fy: 0.95, note: 'The buttes from every movie, actually there.', photo: '/travel/monument-valley.jpg' },
  { id: 'forrest-gump', title: 'Forrest Gump Point', desc: 'Highway 163', state: 'UT', fx: 0.73, fy: 0.93 },
  { id: 'petroglyphs', title: 'Petroglyphs', desc: 'Ancient rock art, UT', state: 'UT', fx: 0.6, fy: 0.8 },
  { id: 'antelope-canyon', title: 'Antelope Canyon', desc: 'Page, Arizona', state: 'AZ', fx: 0.55, fy: 0.08, note: 'Light beams cutting through the slot canyon walls.', photo: '/travel/antelope-canyon.jpg' },
  { id: 'horseshoe-bend', title: 'Horseshoe Bend', desc: 'Colorado River overlook', state: 'AZ', fx: 0.53, fy: 0.1, note: 'One wrong step from the edge. Best view of the trip.', photo: '/travel/horseshoe-bend.jpg' },
  { id: 'wirepass', title: 'Wire Pass Trail', desc: 'Paria Canyon', state: 'AZ', fx: 0.45, fy: 0.05, note: 'A slot canyon with no straight lines, just curves.', photo: '/travel/wirepass.jpg' },
  { id: 'white-pocket', title: 'White Pocket', desc: 'Vermilion Cliffs, after dark', state: 'AZ', fx: 0.4, fy: 0.07, note: 'Hiked in after dark, stars overhead, worth the risk.', photo: '/travel/white-pocket.jpg' },
  { id: 'zion', title: 'Zion · Emerald Pools & The Narrows', desc: 'Zion National Park', state: 'UT', fx: 0.25, fy: 0.85, note: 'Emerald Pools, then the Narrows. Wet shoes for days.', photo: '/travel/zion.jpg' },
  { id: 'vegas', title: 'Las Vegas', desc: 'The drive through', state: 'NV', fx: 0.75, fy: 0.92 },
  { id: 'sequoia', title: 'Sequoia National Park', desc: 'California', state: 'CA', fx: 0.65, fy: 0.55, note: 'Trees older than any of our problems.', photo: '/travel/sequoia.jpg' },
  { id: 'route66', title: 'Route 66 · End of the Trail', desc: 'Santa Monica Pier', state: 'CA', fx: 0.25, fy: 0.78, note: 'End of the road. Feet in the Pacific at last.', photo: '/travel/route66-santa-monica.jpg' },
  { id: 'grand-canyon', title: 'Grand Canyon', desc: 'South Rim', state: 'AZ', fx: 0.25, fy: 0.15, note: 'Stood at the rim and still couldn’t believe the scale.', photo: '/travel/grand-canyon.jpg' },
  // Return leg
  { id: 'new-mexico', title: 'Santa Rosa', desc: 'New Mexico — sunrise on the highway', state: 'NM', fx: 0.72, fy: 0.38, note: 'Sun through the windshield. Still heading home.', photo: '/travel/santa-rosa-nm.jpg' },
  { id: 'texas', title: 'Big Texan', desc: 'Amarillo, Texas', state: 'TX', fx: 0.42, fy: 0.1, note: 'Flags, a yellow landmark, and a Texas-sized lunch.', photo: '/travel/amarillo-big-texan.jpg' },
  { id: 'oklahoma', title: 'Oklahoma', desc: 'Almost back east', state: 'OK', fx: 0.55, fy: 0.45, note: 'Last open stretch before the map folds up.' },
]

// Full 12-state corridor — every state here has a stop so the marker visits it.
const ROUTE_STATES = [...new Set(TRIP_STOPS.map((s) => s.state))]
const ALL_STATE_CODES = Object.keys(STATE_PATHS)

export default function RoadTrip() {
  const svgRef = useRef(null)
  const scrollerRef = useRef(null)
  const pinRef = useRef(null)
  const markerRef = useRef(null)
  const panelRefs = useRef({})

  useEffect(() => {
    const svg = svgRef.current
    const marker = markerRef.current
    if (!svg || !marker) return

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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollerRef.current,
          start: 'top top',
          end: () => `+=${Math.max(3600, window.innerHeight * (2.2 + TRIP_STOPS.length * 0.12))}`,
          scrub: 1,
          pin: pinRef.current,
          invalidateOnRefresh: true,
        },
      })

      let lastState = null
      stops.forEach((s, i) => {
        const t = i
        const panel = panelRefs.current[s.id]
        const statePath = svg.querySelector(`#us-${s.state}`)

        if (s.state !== lastState) {
          if (lastState) {
            const prevPath = svg.querySelector(`#us-${lastState}`)
            tl.to(prevPath, { attr: { fill: VISITED_COLOR }, duration: 0.3 }, t)
          }
          tl.to(statePath, { attr: { fill: ROUTE_COLOR }, duration: 0.3 }, t)
          lastState = s.state
        }

        tl.to(marker, {
          attr: { cx: s.cx, cy: s.cy },
          autoAlpha: 1,
          duration: 0.4,
          ease: 'power2.out',
        }, t)

        if (panel) {
          tl.to(panel, { autoAlpha: 1, duration: 0.3 }, t + 0.1)
          tl.to(panel, { autoAlpha: 0, duration: 0.3 }, t + 0.85)
        }
      })
    }, scrollerRef)

    // GSAP's automatic refresh listeners are tied to the window 'load' event,
    // which has already fired by the time this mounts via client-side route
    // navigation, so the pin distance never gets calculated without this.
    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [])

  return (
    <div className="road-trip" ref={scrollerRef} aria-label="Cross-country road trip route, 12 states, 6,000 miles">
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
            >
              {s.photo && (
                <div className="road-trip__polaroid">
                  <img src={s.photo} alt={`${s.title}, ${s.desc}`} loading="lazy" />
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

        <p className="road-trip__hint">Scroll to drive it</p>
      </div>
    </div>
  )
}
