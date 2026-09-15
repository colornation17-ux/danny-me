import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

function getFocusable(root) {
  if (!root) return []
  return [
    ...root.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ]
}

/**
 * Full-viewport image viewer for case-study galleries / inline shots.
 * Reuses travel-lightbox chrome so About + Work stay visually consistent.
 */
export default function ImageLightbox({ open, src, caption, alt, onClose }) {
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const autoLabelId = useId()
  const labelId = autoLabelId

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 30)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      const items = getFocusable(root)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !src || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="travel-lightbox cs-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby={caption ? labelId : undefined}
      aria-label={caption ? undefined : 'Enlarged image'}
      ref={dialogRef}
      onClick={onClose}
    >
      <button
        ref={closeBtnRef}
        type="button"
        className="travel-lightbox__close"
        aria-label="Close image"
        onClick={onClose}
      >
        Close
      </button>
      <figure
        className="travel-lightbox__frame"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className="travel-lightbox__img"
          src={src}
          alt={alt || caption || ''}
          decoding="async"
        />
        {caption ? (
          <figcaption id={labelId} className="travel-lightbox__cap">
            <span className="travel-lightbox__title">{caption}</span>
          </figcaption>
        ) : null}
      </figure>
    </div>,
    document.body,
  )
}
