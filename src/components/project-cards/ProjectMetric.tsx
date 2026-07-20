import type { ProjectMetric as MetricModel } from './project-card.types'

type Props = {
  metric?: MetricModel
  reserveSpace?: boolean
}

export default function ProjectMetric({ metric, reserveSpace = true }: Props) {
  if (!metric && !reserveSpace) return null

  return (
    <p
      className={`folder-card__metric${metric ? '' : ' folder-card__metric--empty'}`}
      {...(!metric ? { 'aria-hidden': true } : {})}
    >
      {metric ? (
        <>
          <span className="folder-card__metric-kind">{metric.kind}</span>
          <span className="folder-card__metric-value">{metric.value}</span>
        </>
      ) : (
        '\u00a0'
      )}
    </p>
  )
}
