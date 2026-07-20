import { Link } from 'react-router-dom'
import { SITE } from '../data/site'
import { track } from '../lib/track'
import StickerContactLink from './StickerContactLink'

/** Portfolio contact strip — shared across home + case studies */
export default function CaseStudyContact({
  id = 'contact',
  headingId = 'contact-heading',
  eyebrow = 'Get in touch',
  title = (
    <>
      Let&apos;s build{' '}
      <br />
      something real.
    </>
  ),
  body = 'Open to contract work, full-time roles, and hard design problems. I read every note.',
  ctaLabel = 'Send a note',
  className = '',
}) {
  return (
    <section
      id={id}
      className={`folio-contact cs-folio-contact${className ? ` ${className}` : ''}`}
      aria-labelledby={headingId}
      tabIndex={-1}
    >
      <div className="folio-contact__inner">
        <div className="folio-contact__left">
          <p className="folio-contact__eyebrow">{eyebrow}</p>
          <h2 id={headingId} className="folio-contact__title">
            {title}
          </h2>
          <p className="folio-contact__body">{body}</p>
        </div>
        <div className="folio-contact__right">
          <StickerContactLink label={ctaLabel} source={id || 'contact'} />
          <div className="folio-contact__links">
            <a
              href={SITE.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('contact_click', { source: id || 'contact', channel: 'linkedin' })}
            >
              LinkedIn ↗
            </a>
            <Link
              to="/play"
              onClick={() => track('contact_click', { source: id || 'contact', channel: 'play' })}
            >
              Playground ↗
            </Link>
            <a
              href={SITE.resume}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('contact_click', { source: id || 'contact', channel: 'resume' })}
            >
              Resume ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
