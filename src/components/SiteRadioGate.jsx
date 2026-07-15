import { useEffect, useState } from 'react'
import SiteRadio from './SiteRadio'
import { hasFoundWireRadio } from '../lib/wireRadio'

/**
 * Hidden until someone pulls a spring wire — then the player stays available
 * across home, lab, and case studies. Never mount before discovery.
 */
export default function SiteRadioGate() {
  const [found, setFound] = useState(false)
  const [enter, setEnter] = useState(false)

  useEffect(() => {
    const revealed = hasFoundWireRadio()
    if (revealed) {
      setFound(true)
      // Next frame so `.is-in` opacity transition runs
      requestAnimationFrame(() => setEnter(true))
    }

    const onFound = () => {
      setFound(true)
      requestAnimationFrame(() => setEnter(true))
    }
    window.addEventListener('wire-radio-found', onFound)
    return () => window.removeEventListener('wire-radio-found', onFound)
  }, [])

  // Strict: no player chrome until the gem is found
  if (!found) return null

  return (
    <div className={`site-radio-gate${enter ? ' is-in' : ''}`}>
      <SiteRadio />
    </div>
  )
}
