import { NavLink } from 'react-router-dom'
import { SITE } from '../data/site'

const links = [
  { to: '/', label: 'Work', end: true },
  { to: '/play', label: 'Play' },
  { to: '/about', label: 'About' },
]

export default function Nav() {
  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <NavLink to="/" className="nav-brand" end>
          {SITE.shortName}
          <span>.</span>
        </NavLink>
        <ul className="nav-links">
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <a className="nav-cta" href={`mailto:${SITE.email}`} aria-label="Say hello">
          <svg className="nav-cta__icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm0 2.24V6h16v.24l-8 5.99-8-5.99Zm0 2.51V18h16V8.75l-7.4 5.55a1 1 0 0 1-1.2 0L4 8.75Z"
            />
          </svg>
          <span className="nav-cta__label">Say hello</span>
        </a>
      </div>
    </header>
  )
}
