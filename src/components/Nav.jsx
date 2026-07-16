import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { SITE } from '../data/site'
import { track } from '../lib/track'

const links = [
  { to: '/', label: 'Home', end: true, icon: 'home' },
  { to: '/about', label: 'About', icon: 'about' },
  { to: '/', label: 'Work', end: true, hash: '/#projects', icon: 'work' },
  { to: '/play', label: 'Lab', icon: 'play' },
]

function NavIcon({ type }) {
  if (type === 'home') {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 1.5 1 7h2v7h4V9h2v5h4V7h2L8 1.5Z"
        />
      </svg>
    )
  }
  if (type === 'about') {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path stroke="currentColor" strokeWidth="1.5" d="M8 7v4M8 5v.5" />
      </svg>
    )
  }
  if (type === 'work') {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <rect x="2" y="3" width="5" height="5" rx="1" fill="currentColor" />
        <rect x="9" y="3" width="5" height="5" rx="1" fill="currentColor" opacity=".5" />
        <rect x="2" y="10" width="5" height="3" rx="1" fill="currentColor" opacity=".5" />
        <rect x="9" y="10" width="5" height="3" rx="1" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2 12V4l4 2.5L10 4v8L6 9.5 2 12Zm8-8 4 2v6l-4-2V4Z"
      />
    </svg>
  )
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Close on route change (link click)
  const close = () => setMenuOpen(false)

  return (
    <header className="site-nav site-nav--folio" ref={menuRef}>
      <div className="site-nav__inner">
        <NavLink to="/" className="nav-brand" end aria-label="Danny home" onClick={close}>
          <span className="nav-brand__text nav-brand__text--full">
            {SITE.name}
          </span>
        </NavLink>

        <nav aria-label="Primary" className={menuOpen ? 'nav-open' : ''}>
          <ul className="nav-links nav-links--folio">
            {links.map(({ to, label, end, hash, icon }) => (
              <li key={`${label}-${to}`}>
                {hash ? (
                  <a className="nav-tab" href={hash} onClick={close}>
                    <NavIcon type={icon} />
                    {label}
                  </a>
                ) : (
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `nav-tab${isActive ? ' active' : ''}`
                    }
                    onClick={close}
                  >
                    <NavIcon type={icon} />
                    {label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <a
            className="nav-cta nav-cta--linkedin"
            href={SITE.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            onClick={() => track('contact_click', { source: 'nav', channel: 'linkedin' })}
          >
            in
          </a>
          <a
            className="nav-cta nav-cta--resume"
            href={SITE.resume}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('contact_click', { source: 'nav', channel: 'resume' })}
          >
            Resume
          </a>
          <a
            className="nav-cta nav-cta--contact"
            href={`mailto:${SITE.email}`}
            onClick={() => track('contact_click', { source: 'nav', channel: 'email' })}
          >
            Contact
          </a>
          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`nav-hamburger__icon${menuOpen ? ' nav-hamburger__icon--open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`nav-mobile-menu${menuOpen ? ' nav-mobile-menu--open' : ''}`} aria-hidden={!menuOpen}>
        <ul className="nav-mobile-links">
          {links.map(({ to, label, end, hash, icon }) => (
            <li key={`mob-${label}`}>
              {hash ? (
                <a className="nav-mobile-link" href={hash} onClick={close}>
                  <NavIcon type={icon} />
                  {label}
                </a>
              ) : (
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `nav-mobile-link${isActive ? ' active' : ''}`
                  }
                  onClick={close}
                >
                  <NavIcon type={icon} />
                  {label}
                </NavLink>
              )}
            </li>
          ))}
          <li>
            <a
              className="nav-mobile-link"
              href={SITE.resume}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              Resume
            </a>
          </li>
          <li>
            <a
              className="nav-mobile-link"
              href={SITE.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                <path fill="currentColor" d="M4.5 6.5h-3v9h3v-9Zm-1.5-4a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 3 2.5ZM7 15.5h3v-5c0-1.1.9-2 2-2s2 .9 2 2v5h3v-5.5a4.5 4.5 0 0 0-4.5-4.5c-1.3 0-2.4.6-3.1 1.5H9.1L9 6.5H7v9Z"/>
              </svg>
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
