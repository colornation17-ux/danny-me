import { SITE } from '../data/site'
import CoffeeNotes from '../components/CoffeeNotes'
import RoadTrip from '../components/RoadTrip'

const SOLO_SHOTS = [
  {
    src: '/travel/sf-cable-car.jpg',
    alt: 'San Francisco cable car with the Bay Bridge behind it',
    caption: 'San Francisco',
    size: 'hero',
  },
  {
    src: '/travel/sf-golden-gate.jpg',
    alt: 'Golden Gate Bridge framed through flowers',
    caption: 'San Francisco',
    size: 'std',
  },
  {
    src: '/travel/nyc-dumbo.jpg',
    alt: 'DUMBO, Brooklyn, with the Manhattan Bridge behind',
    caption: 'New York',
    size: 'std',
  },
  {
    src: '/travel/nyc-street.jpg',
    alt: 'Street scene in downtown New York',
    caption: 'New York',
    size: 'wide',
  },
  {
    src: '/travel/nyc-delmonicos.jpg',
    alt: "Delmonico's at night, financial district, New York",
    caption: 'New York',
    size: 'tall',
  },
]

const YT_ID = 'mbZF7gsrWZU'
const YT_EMBED = `https://www.youtube.com/embed/${YT_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_ID}&rel=0&modestbranding=1&playsinline=1`
const YT_WATCH = `https://www.youtube.com/watch?v=${YT_ID}`
const PHOTOBOOK_URL = 'https://dannyphoto.framer.website/'

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

        <div className="solo-bento">
          {SOLO_SHOTS.map((shot) => (
            <figure
              key={shot.src}
              className={`solo-bento__cell solo-bento__cell--${shot.size}`}
            >
              <div className="solo-bento__frame">
                <img src={shot.src} alt={shot.alt} loading="lazy" />
              </div>
              <figcaption>{shot.caption}</figcaption>
            </figure>
          ))}

          <div className="solo-bento__cell solo-bento__cell--video">
            <div className="solo-bento__frame solo-bento__frame--video">
              <iframe
                src={YT_EMBED}
                title="Street photography, YouTube"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <a
              className="solo-bento__video-link"
              href={YT_WATCH}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube ↗
            </a>
          </div>
        </div>
      </section>

      <section className="about-photobook" id="photobook" aria-label="Photography archive">
        <p className="about-photobook__label">photobook.photography</p>
        <div className="about-photobook__frame-wrap">
          <iframe
            className="about-photobook__frame"
            src={PHOTOBOOK_URL}
            title="Danny's photography portfolio"
            loading="lazy"
          />
        </div>
        <a
          className="about-photobook__external"
          href={PHOTOBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open photobook.photography ↗
        </a>
      </section>
    </div>
  )
}
