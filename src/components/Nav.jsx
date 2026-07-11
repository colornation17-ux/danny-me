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
        <a className="nav-cta" href={`mailto:${SITE.email}`}>
          Say hello
        </a>
      </div>
    </header>
  )
}
