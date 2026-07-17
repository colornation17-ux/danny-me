import { SITE } from '../data/site'
import { track } from '../lib/track'

/** Shared blue sticker CTA used on contact surfaces. */
export default function StickerContactLink({
  label = 'Send a note',
  source = 'contact',
  className = '',
  showEmail = true,
}) {
  return (
    <a
      className={`folio-contact__cta${className ? ` ${className}` : ''}`}
      href={`mailto:${SITE.email}`}
      onClick={() => track('contact_click', { source, channel: 'email' })}
    >
      <span className="folio-contact__cta-label">{label}</span>
      {showEmail && (
        <span className="folio-contact__cta-sub">{SITE.email}</span>
      )}
    </a>
  )
}
