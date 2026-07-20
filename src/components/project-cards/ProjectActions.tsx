import { Link } from 'react-router-dom'
import type { ProjectAction } from './project-card.types'

type Props = {
  primary: ProjectAction
  secondary: ProjectAction[]
  compact?: boolean
}

function ActionLink({
  action,
  className,
}: {
  action: ProjectAction
  className: string
}) {
  if (action.external || /^https?:\/\//i.test(action.href)) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {action.label}
        <span className="sr-only"> (opens in a new tab)</span>
        <span className="folder-card__cta-arrow" aria-hidden="true">
          {' '}
          ↗
        </span>
      </a>
    )
  }

  return (
    <Link to={action.href} className={className}>
      <span>{action.label}</span>
      <span className="folder-card__cta-arrow" aria-hidden="true">
        ↗
      </span>
    </Link>
  )
}

export default function ProjectActions({
  primary,
  secondary,
  compact = false,
}: Props) {
  const useOverflow = compact && secondary.length > 1
  const visible = useOverflow ? [] : secondary
  const overflow = useOverflow ? secondary : []

  return (
    <div
      className={`folder-card__actions folder-card__cta-row${
        secondary.length > 1 && !compact ? ' folder-card__cta-row--split' : ''
      }`}
    >
      <ActionLink
        action={primary}
        className="folder-card__cta folder-card__primary"
      />
      {overflow.length > 0 ? (
        <details className="folder-card__more">
          <summary>Live experiences</summary>
          {overflow.map((action) => (
            <ActionLink
              key={action.href}
              action={action}
              className="folder-card__live folder-card__secondary"
            />
          ))}
        </details>
      ) : (
        visible.map((action) => (
          <ActionLink
            key={action.href}
            action={action}
            className="folder-card__live folder-card__secondary"
          />
        ))
      )}
    </div>
  )
}
