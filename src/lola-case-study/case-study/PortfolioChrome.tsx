import React, { useEffect, useRef, useState } from "react";
import { PORTFOLIO } from "./constants";

/** Absolute URLs — same destinations as danny-me Nav/Footer */
const HOME = PORTFOLIO.backUrl.replace(/\/$/, "") || "https://danny-me-rho.vercel.app";
const SITE = {
  name: "Danny Varghese",
  email: PORTFOLIO.email,
  linkedIn: PORTFOLIO.linkedIn,
  resume: `${HOME}/resume/Danny_Varghese_Senior_Product_Designer.pdf`,
};

const links = [
  { href: `${HOME}/`, label: "Home", icon: "home" as const },
  { href: `${HOME}/about`, label: "About", icon: "about" as const },
  { href: `${HOME}/#projects`, label: "Work", icon: "work" as const },
  { href: `${HOME}/play`, label: "Lab", icon: "play" as const },
];

function NavIcon({ type }: { type: (typeof links)[number]["icon"] }) {
  if (type === "home") {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path fill="currentColor" d="M8 1.5 1 7h2v7h4V9h2v5h4V7h2L8 1.5Z" />
      </svg>
    );
  }
  if (type === "about") {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path stroke="currentColor" strokeWidth="1.5" d="M8 7v4M8 5v.5" />
      </svg>
    );
  }
  if (type === "work") {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <rect x="2" y="3" width="5" height="5" rx="1" fill="currentColor" />
        <rect x="9" y="3" width="5" height="5" rx="1" fill="currentColor" opacity=".5" />
        <rect x="2" y="10" width="5" height="3" rx="1" fill="currentColor" opacity=".5" />
        <rect x="9" y="10" width="5" height="3" rx="1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path fill="currentColor" d="M2 12V4l4 2.5L10 4v8L6 9.5 2 12Zm8-8 4 2v6l-4-2V4Z" />
    </svg>
  );
}

/** Exact danny-me Nav markup (absolute links instead of React Router) */
export function PortfolioNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className="site-nav site-nav--folio" ref={menuRef}>
      <div className="site-nav__inner">
        <a href={`${HOME}/`} className="nav-brand" aria-label="Danny home" onClick={close}>
          <span className="nav-brand__text nav-brand__text--full">{SITE.name}</span>
        </a>

        <nav aria-label="Primary" className={menuOpen ? "nav-open" : undefined}>
          <ul className="nav-links nav-links--folio">
            {links.map(({ href, label, icon }) => (
              <li key={label}>
                <a
                  className={`nav-tab${label === "Work" ? " active" : ""}`}
                  href={href}
                  onClick={close}
                >
                  <NavIcon type={icon} />
                  {label}
                </a>
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
          >
            in
          </a>
          <a className="nav-cta nav-cta--resume" href={SITE.resume} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
          <a className="nav-cta nav-cta--contact" href={`mailto:${SITE.email}`}>
            Contact
          </a>
          <button
            type="button"
            className="nav-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`nav-hamburger__icon${menuOpen ? " nav-hamburger__icon--open" : ""}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`nav-mobile-menu${menuOpen ? " nav-mobile-menu--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <ul className="nav-mobile-links">
          {links.map(({ href, label, icon }) => (
            <li key={`mob-${label}`}>
              <a
                className={`nav-mobile-link${label === "Work" ? " active" : ""}`}
                href={href}
                onClick={close}
              >
                <NavIcon type={icon} />
                {label}
              </a>
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
                <path
                  fill="currentColor"
                  d="M4.5 6.5h-3v9h3v-9Zm-1.5-4a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 3 2.5ZM7 15.5h3v-5c0-1.1.9-2 2-2s2 .9 2 2v5h3v-5.5a4.5 4.5 0 0 0-4.5-4.5c-1.3 0-2.4.6-3.1 1.5H9.1L9 6.5H7v9Z"
                />
              </svg>
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

/** Folio contact strip — mirrors danny-me CaseStudyContact */
export function PortfolioContact() {
  return (
    <section className="folio-contact" id="contact" aria-labelledby="folio-contact-heading">
      <div className="folio-contact__inner">
        <div className="folio-contact__left">
          <p className="folio-contact__eyebrow">Get in touch</p>
          <h2 id="folio-contact-heading" className="folio-contact__title">
            Let&apos;s build
            <br />
            something real.
          </h2>
          <p className="folio-contact__body">
            Open to contract work, full-time roles, and hard design problems. I read every note.
          </p>
        </div>
        <div className="folio-contact__right">
          <a className="folio-contact__cta" href={`mailto:${SITE.email}`}>
            <span className="folio-contact__cta-label">Send a note</span>
            <span className="folio-contact__cta-sub">{SITE.email}</span>
          </a>
          <div className="folio-contact__links">
            <a href={SITE.linkedIn} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
            <a href={`${HOME}/play`}>Playground ↗</a>
            <a href={SITE.resume} target="_blank" rel="noopener noreferrer">
              Resume ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Exact danny-me Footer */
export function PortfolioFooter() {
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
          </a>
          <a href={SITE.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
}
