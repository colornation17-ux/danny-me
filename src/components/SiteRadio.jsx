import { useEffect, useRef, useState } from 'react'
import {
  prefetchWireRadio,
  toggleWireRadio,
  isWireRadioPlaying,
  getWireRadioVolume,
  setWireRadioVolume,
  WIRE_RADIO,
} from '../lib/wireRadio'

const CORNER_KEY = 'site-radio-corner'
const CORNERS = ['br', 'bl', 'tr', 'tl']
const EDGE = 14
const DRAG_THRESHOLD = 8
const AUTO_COLLAPSE_MS = 3000

function readCorner() {
  try {
    const saved = sessionStorage.getItem(CORNER_KEY)
    if (CORNERS.includes(saved)) return saved
  } catch {
    /* ignore */
  }
  return 'br'
}

function preferBottomCorners() {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(max-width: 600px)').matches ||
    window.innerHeight < 720
  )
}

function snapCorner(x, y, width, height) {
  const midX = window.innerWidth / 2
  const midY = window.innerHeight / 2
  const cx = x + width / 2
  const cy = y + height / 2
  const side = cx < midX ? 'l' : 'r'
  if (preferBottomCorners()) return side === 'l' ? 'bl' : 'br'
  const edge = cy < midY ? 't' : 'b'
  return `${edge}${side}`
}

function useMedia(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function buzz() {
  try {
    navigator.vibrate?.(10)
  } catch {
    /* ignore */
  }
}

function getFocusable(root) {
  if (!root) return []
  return [
    ...root.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
}

/**
 * Collapsible, draggable site radio.
 * Mobile: big play target, grip-only drag, auto-collapse, bottom sheet when open.
 */
export default function SiteRadio() {
  const rootRef = useRef(null)
  const panelRef = useRef(null)
  const expandBtnRef = useRef(null)
  const dragRef = useRef(null)
  const didDragRef = useRef(false)
  const idleTimerRef = useRef(0)
  const restoreFocusRef = useRef(null)

  const isNarrow = useMedia('(max-width: 600px)')

  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(WIRE_RADIO.volume)
  const [busy, setBusy] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [corner, setCorner] = useState(() => {
    const saved = readCorner()
    if (preferBottomCorners() && (saved === 'tr' || saved === 'tl')) return 'br'
    return saved
  })
  const [dragging, setDragging] = useState(false)
  const [dragPos, setDragPos] = useState(null)

  const sheetMode = isNarrow && expanded

  useEffect(() => {
    setPlaying(isWireRadioPlaying())
    setVolume(getWireRadioVolume())
    prefetchWireRadio()
    const onRadio = (e) => {
      setPlaying(Boolean(e.detail?.playing))
      if (typeof e.detail?.volume === 'number') setVolume(e.detail.volume)
    }
    window.addEventListener('wire-radio', onRadio)
    return () => window.removeEventListener('wire-radio', onRadio)
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(CORNER_KEY, corner)
    } catch {
      /* ignore */
    }
  }, [corner])

  const bumpIdle = () => {
    window.clearTimeout(idleTimerRef.current)
    if (!expanded || sheetMode) return
    idleTimerRef.current = window.setTimeout(() => {
      setExpanded(false)
    }, AUTO_COLLAPSE_MS)
  }

  useEffect(() => {
    if (!expanded) {
      window.clearTimeout(idleTimerRef.current)
      return undefined
    }
    // Sheet stays open until user collapses; floating panel auto-collapses
    if (sheetMode) {
      window.clearTimeout(idleTimerRef.current)
      return undefined
    }
    bumpIdle()
    return () => window.clearTimeout(idleTimerRef.current)
  }, [expanded, sheetMode])

  // Sheet mode: dialog semantics, focus trap, Escape, body scroll lock
  useEffect(() => {
    if (!sheetMode) return undefined

    restoreFocusRef.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    const focusables = getFocusable(panel)
    const first = focusables[0]
    window.requestAnimationFrame(() => first?.focus())

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setExpanded(false)
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const items = getFocusable(panel)
      if (!items.length) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
      const restore = restoreFocusRef.current
      restoreFocusRef.current = null
      window.requestAnimationFrame(() => {
        if (restore && typeof restore.focus === 'function') restore.focus()
        else expandBtnRef.current?.focus()
      })
    }
  }, [sheetMode])

  const collapse = () => setExpanded(false)

  const onToggle = async () => {
    if (busy || didDragRef.current) return
    setBusy(true)
    try {
      await toggleWireRadio()
      buzz()
      bumpIdle()
    } finally {
      setBusy(false)
    }
  }

  const onVolume = (e) => {
    const v = Number(e.target.value)
    setVolume(v)
    setWireRadioVolume(v)
    bumpIdle()
  }

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return
    // Clear drag-suppression at the start of a new pointer sequence
    didDragRef.current = false
    // Grip-only drag — play/expand stay clean taps
    if (!e.target.closest('.site-radio__grip')) return
    if (sheetMode) return

    const root = rootRef.current
    if (!root) return
    const rect = root.getBoundingClientRect()
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
      width: rect.width,
      height: rect.height,
      moved: false,
    }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    e.preventDefault()
  }

  const onPointerMove = (e) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return

    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return

    drag.moved = true
    didDragRef.current = true
    if (!dragging) setDragging(true)

    const maxX = Math.max(EDGE, window.innerWidth - drag.width - EDGE)
    const maxY = Math.max(EDGE, window.innerHeight - drag.height - EDGE)
    setDragPos({
      x: Math.min(maxX, Math.max(EDGE, drag.originX + dx)),
      y: Math.min(maxY, Math.max(EDGE, drag.originY + dy)),
    })
  }

  const endDrag = (e) => {
    const drag = dragRef.current
    if (!drag || (e && drag.pointerId !== e.pointerId)) return

    if (drag.moved && e) {
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      const maxX = Math.max(EDGE, window.innerWidth - drag.width - EDGE)
      const maxY = Math.max(EDGE, window.innerHeight - drag.height - EDGE)
      const x = Math.min(maxX, Math.max(EDGE, drag.originX + dx))
      const y = Math.min(maxY, Math.max(EDGE, drag.originY + dy))
      setCorner(snapCorner(x, y, drag.width, drag.height))
    }

    dragRef.current = null
    setDragging(false)
    setDragPos(null)
    // didDragRef clears on the next pointerdown — not a timer
  }

  const style =
    dragPos && !sheetMode
      ? {
          left: dragPos.x,
          top: dragPos.y,
          right: 'auto',
          bottom: 'auto',
        }
      : undefined

  return (
    <div
      ref={rootRef}
      className={[
        'site-radio',
        sheetMode ? 'site-radio--sheet' : `site-radio--${corner}`,
        expanded ? 'is-expanded' : 'is-collapsed',
        playing ? 'is-playing' : '',
        dragging ? 'is-dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      role={sheetMode ? 'dialog' : 'region'}
      aria-modal={sheetMode ? true : undefined}
      aria-label="Site radio"
      aria-labelledby={sheetMode ? 'site-radio-heading' : undefined}
    >
      {sheetMode ? (
        <button
          type="button"
          className="site-radio__scrim"
          aria-label="Collapse radio controls"
          onClick={collapse}
        />
      ) : null}

      <div
        className="site-radio__panel"
        ref={panelRef}
        onPointerDown={bumpIdle}
        onFocus={bumpIdle}
      >
        <div className="site-radio__row">
          {!sheetMode ? (
            <button
              type="button"
              className="site-radio__grip"
              aria-label="Drag radio"
              title="Drag to move"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <span className="site-radio__grip-dots" aria-hidden="true" />
            </button>
          ) : null}

          <button
            type="button"
            className={`site-radio__play${playing ? ' is-playing' : ''}`}
            onClick={onToggle}
            disabled={busy}
            aria-pressed={playing}
            title={playing ? 'Pause radio' : `Play radio — ${WIRE_RADIO.track}`}
          >
            <span className="site-radio__icon" aria-hidden="true">
              {playing ? (
                <svg viewBox="0 0 16 16" width="15" height="15">
                  <rect x="3" y="2" width="3.5" height="12" rx="0.5" fill="currentColor" />
                  <rect x="9.5" y="2" width="3.5" height="12" rx="0.5" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" width="15" height="15">
                  <path fill="currentColor" d="M4 2.5v11l9-5.5L4 2.5Z" />
                </svg>
              )}
            </span>
            {expanded ? (
              <span className="site-radio__copy">
                <span id="site-radio-heading" className="site-radio__eyebrow">
                  {playing ? 'On air' : 'Radio'}
                </span>
                <span className="site-radio__label">{playing ? 'Pause' : 'Play'}</span>
              </span>
            ) : null}
            {playing && !expanded ? (
              <span className="site-radio__bars" aria-hidden="true" />
            ) : null}
          </button>

          <button
            ref={expandBtnRef}
            type="button"
            className="site-radio__expand"
            onClick={() => {
              if (didDragRef.current) return
              setExpanded((v) => !v)
            }}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse radio controls' : 'Expand radio controls'}
            title={expanded ? 'Collapse' : 'More controls'}
          >
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              {expanded ? (
                <path
                  fill="currentColor"
                  d="M3.2 10.2 8 5.4l4.8 4.8-.9.9L8 7.2l-3.9 3.9-.9-.9Z"
                />
              ) : (
                <path
                  fill="currentColor"
                  d="M3.2 5.8 8 10.6l4.8-4.8.9.9L8 12.4 2.3 6.7l.9-.9Z"
                />
              )}
            </svg>
          </button>
        </div>

        {expanded ? (
          <div className="site-radio__extras">
            {playing ? (
              <span className="site-radio__bars site-radio__bars--row" aria-hidden="true" />
            ) : null}
            <p className="site-radio__track">{WIRE_RADIO.track}</p>
            <label className="site-radio__vol">
              <span className="site-radio__vol-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="12" height="12">
                  <path
                    fill="currentColor"
                    d="M2 6h3l3-3v10L5 10H2V6Zm8.2 1.1a2.2 2.2 0 0 1 0 1.8l-.7-.4a1.4 1.4 0 0 0 0-1l.7-.4Zm1.6-1.6a4.2 4.2 0 0 1 0 5l-.7-.45a3.3 3.3 0 0 0 0-4.1l.7-.45Z"
                  />
                </svg>
              </span>
              <input
                type="range"
                className="site-radio__slider"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={onVolume}
                aria-label="Radio volume"
              />
            </label>
            {!sheetMode ? (
              <p className="site-radio__hint">Use the grip to drag · snaps to a corner</p>
            ) : (
              <p className="site-radio__hint">Tap outside, Escape, or the chevron to close</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
