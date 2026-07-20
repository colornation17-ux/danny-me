import type { CSSProperties } from 'react'
import ProjectActions from './ProjectActions'
import ProjectMedia from './ProjectMedia'
import ProjectMetric from './ProjectMetric'
import ProjectSelector from './ProjectSelector'
import type {
  FeaturedProjectCard,
  LayoutMode,
} from './project-card.types'

export type CardState = 'past' | 'active' | 'future'

type Props = {
  project: FeaturedProjectCard
  index: number
  total: number
  cardState: CardState
  layoutMode: LayoutMode
  reduceMotion: boolean
  onActivate: (index: number) => void
}

export default function ProjectCard({
  project,
  index,
  total: _total,
  cardState,
  layoutMode,
  reduceMotion,
  onActivate,
}: Props) {
  const isActive = cardState === 'active'
  const triggerId = `project-trigger-${project.id}`
  const panelId = `project-panel-${project.id}`
  const compact = layoutMode !== 'desktop'
  // Six folder tabs need short labels or 06 clips off the sticky edge
  const tabLabel =
    ((compact || total >= 5) && project.tabLabelCompact) || project.tabLabel

  return (
    <article
      className={`folder-card project-card folder-card--${cardState} folder-card--${project.variant}`}
      id={`project-${project.slug}`}
      data-index={index}
      style={
        {
          '--folder-fill': project.theme.fill,
          '--folder-ink': project.theme.ink,
          '--folder-index': index,
        } as CSSProperties
      }
    >
      <ProjectSelector
        id={project.id}
        indexLabel={project.indexLabel}
        tabLabel={tabLabel}
        isActive={isActive}
        showIndent={index > 0}
        onActivate={() => onActivate(index)}
      />

      <div
        id={panelId}
        className="folder-card__content"
        role="region"
        aria-labelledby={triggerId}
        hidden={!isActive}
      >
        <div className="folder-card__text">
          <div className="folder-card__text-head">
            <p className="folder-card__date">
              <span className="folder-card__date-dot" aria-hidden="true" />
              <span>{project.date}</span>
              {project.variant === 'concept' && (
                <span className="folder-card__badge">Concept</span>
              )}
            </p>
          </div>

          <div className="folder-card__text-main">
            <h3
              className="folder-card__title"
              data-font={project.theme.titleFont || ''}
            >
              {project.title}
            </h3>
            <p className="folder-card__meta">
              {[project.role, project.organization].filter(Boolean).join(' · ')}
              {project.variant !== 'concept' && project.status
                ? ` · ${project.status}`
                : ''}
            </p>
            {project.timeline && (
              <p className="folder-card__meta folder-card__meta--sub">
                {project.timeline}
              </p>
            )}
            <p className="folder-card__blurb">{project.summary}</p>
            <ProjectMetric metric={project.metric} />
          </div>

          <ProjectActions
            primary={project.primaryAction}
            secondary={project.secondaryActions}
            compact={compact}
          />

          <ul className="folder-card__tags" aria-label="Project skills">
            {project.tags.map((tag) => (
              <li className="folder-card__tag" key={tag}>
                <span className="folder-card__tag-label">{tag}</span>
              </li>
            ))}
          </ul>
        </div>

        <ProjectMedia
          media={project.media}
          title={project.title}
          isActive={isActive}
          reduceMotion={reduceMotion}
          isInitialCard={index === 0}
        />
      </div>
    </article>
  )
}
