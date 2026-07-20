import { SITE } from '../data/site'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <div className="site-footer__links">
          <a href={`mailto:${SITE.email}`}>Email</a>
          <a href={SITE.linkedIn} target="_blank" rel="noreferrer">
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={SITE.resume} target="_blank" rel="noreferrer">
            Resume
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
