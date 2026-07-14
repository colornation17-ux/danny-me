import { SITE } from '../data/site'
import CoffeeNotes from '../components/CoffeeNotes'
import RoadTrip from '../components/RoadTrip'

const SOLO_SHOTS = [
  { src: '/travel/sf-cable-car.jpg', alt: 'San Francisco cable car with the Bay Bridge behind it', caption: 'San Francisco' },
  { src: '/travel/sf-golden-gate.jpg', alt: 'Golden Gate Bridge framed through flowers', caption: 'San Francisco' },
  { src: '/travel/nyc-dumbo.jpg', alt: 'DUMBO, Brooklyn, with the Manhattan Bridge behind', caption: 'New York' },
  { src: '/travel/nyc-street.jpg', alt: 'Street scene in downtown New York', caption: 'New York' },
]

export default function About() {
  return (
    <div className="about-hero folio--fullgrid">
      <div className="about-hero__content">
        <h1>{SITE.about.lead}</h1>
        <div className="about-body">
          {SITE.about.body.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>

        <div className="about-panel">
          <div className="about-box">
            <h2>Currently</h2>
            <p className="about-seeking">{SITE.about.seeking}</p>
            <div className="contact-row">
              <a className="btn btn--primary" href={`mailto:${SITE.email}`}>
                Email me
              </a>
              <a
                className="btn btn--ghost"
                href={SITE.linkedIn}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="btn btn--ghost"
                href={SITE.resume}
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </a>
            </div>

            <hr className="about-box__divider" />

            <h2>Outside the deck</h2>
            <ul>
              {SITE.about.outside.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="about-panel__coffee">
            <p className="about-section__eyebrow">Currently brewing</p>
            <CoffeeNotes />
          </div>
        </div>
      </div>

      <section className="about-travel">
        <p className="about-section__eyebrow">Solo, and not so solo</p>
        <p className="about-travel__story">
          I travel solo when I want to get lost in a city with just a camera, and in a
          group when the plan is to just go. This one started as a phone wallpaper, a
          photo of Arizona red rock I couldn&apos;t stop looking at. By the next
          afternoon, four of us were in a car with no real itinerary. Twelve states,
          eleven days, and about 6,000 miles later, we&apos;d stood at the Grand Canyon,
          camped under a sky full of stars, and hit the end of Route 66.
        </p>

        <RoadTrip />
      </section>

      <section className="about-solo-trips">
        <p className="about-section__eyebrow">Street photography, solo</p>
        <div className="solo-trips__grid">
          {SOLO_SHOTS.map((shot) => (
            <figure key={shot.src}>
              <img src={shot.src} alt={shot.alt} loading="lazy" />
              <figcaption>{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="about-photobook">
        <p className="about-photobook__label">photobook.photography</p>
        <iframe
          className="about-photobook__frame"
          src="https://dannyphoto.framer.website/"
          title="Danny's photography portfolio"
          loading="lazy"
        />
      </section>
    </div>
  )
}
