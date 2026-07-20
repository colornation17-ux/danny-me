import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <p className="not-found__eyebrow">404</p>
      <h1 id="not-found-title" className="not-found__title" tabIndex={-1}>
        Page not found
      </h1>
      <p className="not-found__body">
        That URL doesn’t match anything on this site. Head home or jump to the
        work section.
      </p>
      <div className="not-found__actions">
        <Link to="/" className="not-found__cta">
          Back home
        </Link>
        <Link to="/#projects" className="not-found__link">
          View work
        </Link>
      </div>
    </section>
  )
}
