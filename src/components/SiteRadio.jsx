import { useEffect, useState } from 'react'
import {
  prefetchWireRadio,
  toggleWireRadio,
  isWireRadioPlaying,
  WIRE_RADIO,
} from '../lib/wireRadio'

/**
 * Persistent play/pause for the site radio bed.
 * Stays mounted across Home / About / Lab / all case studies.
 */
export default function SiteRadio() {
  const [playing, setPlaying] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setPlaying(isWireRadioPlaying())
    prefetchWireRadio()
    const onRadio = (e) => setPlaying(Boolean(e.detail?.playing))
    window.addEventListener('wire-radio', onRadio)
    return () => window.removeEventListener('wire-radio', onRadio)
  }, [])

  const onToggle = async () => {
    if (busy) return
    setBusy(true)
    try {
      await toggleWireRadio()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="site-radio" role="region" aria-label="Site radio">
      <button
        type="button"
        className={`site-radio__btn${playing ? ' is-playing' : ''}`}
        onClick={onToggle}
        disabled={busy}
        aria-pressed={playing}
        title={playing ? 'Pause radio' : `Play radio from 1:03 — ${WIRE_RADIO.track}`}
      >
        <span className="site-radio__icon" aria-hidden="true">
          {playing ? (
            <svg viewBox="0 0 16 16" width="14" height="14">
              <rect x="3" y="2" width="3.5" height="12" rx="0.5" fill="currentColor" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="0.5" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path fill="currentColor" d="M4 2.5v11l9-5.5L4 2.5Z" />
            </svg>
          )}
        </span>
        <span className="site-radio__copy">
          <span className="site-radio__eyebrow">{playing ? 'On air' : 'Radio'}</span>
          <span className="site-radio__label">{playing ? 'Pause' : 'Play'}</span>
        </span>
        {playing ? <span className="site-radio__bars" aria-hidden="true" /> : null}
      </button>
    </div>
  )
}
