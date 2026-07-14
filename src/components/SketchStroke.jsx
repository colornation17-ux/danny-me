/** Decorative pencil / ink sketch strokes for the folio. */
export function SketchStroke({ variant = 'arc', className = '' }) {
  if (variant === 'underline') {
    return (
      <svg
        className={`sketch-stroke sketch-stroke--underline ${className}`}
        viewBox="0 0 200 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 11c28-6 55 4 82-1 27-5 54 6 80 1 10-2 22-5 30-2"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          pathLength="1"
        />
        <path
          d="M10 14c40-3 70 2 110-2 20-2 40 3 55 1"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    )
  }

  if (variant === 'circle') {
    return (
      <svg
        className={`sketch-stroke sketch-stroke--circle ${className}`}
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M22 18c18-12 46-8 52 14 6 22-10 42-32 44S8 58 12 36c3-14 16-22 28-22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (variant === 'arrow') {
    return (
      <svg
        className={`sketch-stroke sketch-stroke--arrow ${className}`}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 34c8-14 18-22 32-26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M28 8l12 2-4 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  // default arc / divider
  // Both paths share the same cubic curve — secondary is offset +5px on every
  // y control point so the lines are always parallel and never cross.
  return (
    <svg
      className={`sketch-stroke sketch-stroke--arc ${className}`}
      viewBox="0 0 800 48"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M0 26 C160 14 360 36 560 24 C680 18 740 22 800 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M0 31 C160 19 360 41 560 29 C680 23 740 27 800 25"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

export function SketchFrame({ children, className = '' }) {
  return (
    <div className={`sketch-frame ${className}`.trim()}>
      <svg className="sketch-frame__ink" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M3 8c2-4 8-5 12-4l70 2c6 0 10 3 11 8l2 68c0 6-4 11-10 12l-72 3c-6 0-11-4-12-10L2 18c0-4 1-7 1-10z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {children}
    </div>
  )
}
