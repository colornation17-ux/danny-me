import { Link } from 'react-router-dom'
import {
  projectCtaLabel,
  projectDestination,
  projectNavBlurb,
  projectNavLabel,
} from '../lib/projectLinks'

function NavLink({ project, direction, className }) {
  const dest = projectDestination(project)
  if (!dest) return null

  const label =
    direction === 'prev'
      ? '← Previous'
      : projectCtaLabel(project, { direction: 'next' })

  const body = (
    <>
      <span className="cs-pager__cta">{label}</span>
      <strong className="cs-pager__title">{projectNavLabel(project)}</strong>
      {direction === 'next' ? (
        <span className="cs-pager__blurb">{projectNavBlurb(project)}</span>
      ) : null}
    </>
  )

  if (dest.external) {
    return (
      <a
        className={className}
        href={dest.to}
        target="_blank"
        rel="noreferrer"
      >
        {body}
      </a>
    )
  }

  return (
    <Link className={className} to={dest.to}>
      {body}
    </Link>
  )
}

/**
 * Prev / next project strip — uses project.href for external case studies (e.g. Lola).
 */
export default function CaseStudyNext({ prev, next }) {
  if (!prev && !next) return null

  return (
    <nav className="cs-pager" aria-label="Adjacent projects">
      {prev ? (
        <NavLink
          project={prev}
          direction="prev"
          className="cs-pager__link cs-pager__link--prev"
        />
      ) : (
        <span className="cs-pager__spacer" aria-hidden="true" />
      )}

      {next ? (
        <NavLink
          project={next}
          direction="next"
          className="cs-pager__link cs-pager__link--next"
        />
      ) : null}
    </nav>
  )
}
