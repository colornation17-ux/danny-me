import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy'

/** Stable section ids from case-study eyebrows */
export function sectionAnchorId(eyebrow, index) {
  const slug = String(eyebrow || `section-${index}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `cs-${slug || `section-${index}`}`
}

export function stepsFromSections(sections = []) {
  return sections.map((section, index) => ({
    id: sectionAnchorId(section.eyebrow, index),
    num: String(index).padStart(2, '0'),
    label: section.eyebrow || `Section ${index + 1}`,
  }))
}

function Chevron({ open }) {
  return (
    <svg
      className={`cs-rail-mobile__chevron${open ? ' is-open' : ''}`}
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M3.2 5.6 8 10.4l4.8-4.8.9.9L8 12.2 2.3 6.5l.9-.9Z"
      />
    </svg>
  )
}

/** Compact fixed left timeline — desktop */
export function CaseStudyRail({ brand, steps }) {
  const ids = useMemo(() => steps.map((s) => s.id), [steps])
  const { activeId, activeIdx } = useScrollSpy(ids)
  const fillPct =
    steps.length <= 1
      ? 100
      : ((Math.max(activeIdx, 0) + 0.5) / steps.length) * 100

  if (steps.length < 2) return null

  return (
    <aside className="cs-rail" aria-label="Case study timeline">
      {brand ? (
        <a href={`#${steps[0].id}`} className="cs-rail__brand" title={brand}>
          {brand}
        </a>
      ) : null}

      <div className="cs-rail__body">
        <div className="cs-rail__progress" aria-hidden="true">
          <div className="cs-rail__track">
            <div className="cs-rail__fill" style={{ height: `${Math.min(100, fillPct)}%` }} />
          </div>
        </div>

        <ol className="cs-rail__steps">
          {steps.map((step, i) => {
            const isActive = activeId === step.id
            const isPast = activeIdx > i
            return (
              <li key={step.id}>
                <a
                  href={`#${step.id}`}
                  className={`cs-rail__step${isActive ? ' is-active' : ''}${isPast ? ' is-past' : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                  title={step.label}
                >
                  <span className="cs-rail__dot" aria-hidden="true" />
                  <span className="cs-rail__meta">
                    <span className="cs-rail__num">{step.num}</span>
                    <span className="cs-rail__label">{step.label}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </aside>
  )
}

/** Mobile phase picker under the portfolio nav */
export function CaseStudyMobileBar({ brand, steps }) {
  const ids = useMemo(() => steps.map((s) => s.id), [steps])
  const { activeId, activeIdx } = useScrollSpy(ids)
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const current = steps[Math.max(activeIdx, 0)] || steps[0]

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  if (steps.length < 2) return null

  return (
    <div className="cs-rail-mobile" ref={rootRef}>
      <div className="cs-rail-mobile__inner">
        {brand ? <span className="cs-rail-mobile__brand">{brand}</span> : null}
        <button
          ref={triggerRef}
          type="button"
          className="cs-rail-mobile__trigger"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="cs-rail-mobile__value">
            <span className="cs-rail-mobile__num">{current?.num}</span>
            {current?.label}
          </span>
          <Chevron open={open} />
        </button>
      </div>

      {open ? (
        <ul className="cs-rail-mobile__menu" role="listbox">
          {steps.map((step) => (
            <li key={step.id}>
              <a
                href={`#${step.id}`}
                className={`cs-rail-mobile__option${activeId === step.id ? ' is-active' : ''}`}
                role="option"
                aria-selected={activeId === step.id}
                onClick={close}
              >
                <span className="cs-rail-mobile__num">{step.num}</span>
                {step.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
