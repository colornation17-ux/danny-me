const PULSE_BARS = [38, 62, 48, 72, 55, 84, 68]
const FORECAST_ROWS = ['buy', 'hold', 'buy', 'reduce']
const CRM_SEGMENTS = [
  { label: 'Champion', count: 78 },
  { label: 'Loyal', count: 517 },
  { label: 'Potential', count: 314 },
  { label: 'Lost', count: 256 },
]

export default function CompetitorWatchOverlays({ variant, active }) {
  if (!variant || !active) return null

  switch (variant) {
    case 'pulse':
      return (
        <div className="cw-overlay cw-overlay--pulse" aria-hidden>
          <div className="cw-overlay__kpi-flash cw-overlay__kpi-flash--a">+9.7%</div>
          <div className="cw-overlay__kpi-flash cw-overlay__kpi-flash--b">$8,420</div>
          <div className="cw-overlay__bars">
            {PULSE_BARS.map((h, i) => (
              <span
                key={i}
                className="cw-overlay__bar"
                style={{ '--h': `${h}%`, '--d': `${i * 0.07}s` }}
              />
            ))}
          </div>
          <div className="cw-overlay__toast">
            <span className="cw-overlay__toast-icon">↗</span>
            214 visits matched · 7 days
          </div>
        </div>
      )

    case 'weekend':
      return (
        <div className="cw-overlay cw-overlay--weekend" aria-hidden>
          <div className="cw-overlay__weather-pulse cw-overlay__weather-pulse--1" />
          <div className="cw-overlay__weather-pulse cw-overlay__weather-pulse--2" />
          <div className="cw-overlay__weather-pulse cw-overlay__weather-pulse--3" />
          <div className="cw-overlay__tag-flash">Push caldo · ease off grill</div>
        </div>
      )

    case 'forecast':
      return (
        <div className="cw-overlay cw-overlay--forecast" aria-hidden>
          <div className="cw-overlay__forecast-pulse" />
          {FORECAST_ROWS.map((action, i) => (
            <span
              key={i}
              className={`cw-overlay__action-pill cw-overlay__action-pill--${action}`}
              style={{ '--d': `${0.15 + i * 0.12}s` }}
            >
              {action}
            </span>
          ))}
        </div>
      )

    case 'crm':
      return (
        <div className="cw-overlay cw-overlay--crm" aria-hidden>
          <div className="cw-overlay__wa-ping" />
          {CRM_SEGMENTS.map((seg, i) => (
            <span
              key={seg.label}
              className="cw-overlay__seg-pop"
              style={{
                '--d': `${i * 0.1}s`,
                left: `${20 + i * 14}%`,
              }}
            >
              {seg.label} <strong>{seg.count}</strong>
            </span>
          ))}
        </div>
      )

    case 'market':
      return (
        <div className="cw-overlay cw-overlay--market" aria-hidden>
          <div className="cw-overlay__scan-line" />
          <div className="cw-overlay__deal-flash">
            <span className="cw-overlay__deal-tag">MARKET</span>
            Thursday ad scan ready
          </div>
          <div className="cw-overlay__wa-cta">
            <span className="cw-overlay__wa-dot" />
            Copy for WhatsApp
          </div>
        </div>
      )

    default:
      return null
  }
}
