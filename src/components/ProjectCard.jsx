import { Link } from 'react-router-dom'
import ProjectMotionPreview, { hasMotionPreview } from './motion/ProjectMotionPreview'

export default function ProjectCard({ project }) {
  const motion = hasMotionPreview(project.slug)

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="project-card"
      style={{ '--card-accent': project.accent }}
    >
      <div
        className={`project-card__media${motion ? ' project-card__media--motion' : ''}`}
        aria-hidden={!motion && !project.cover}
      >
        {motion ? (
          <ProjectMotionPreview slug={project.slug} size="card" />
        ) : project.cover ? (
          <img
            className="project-card__img"
            src={project.cover}
            alt=""
            loading="lazy"
          />
        ) : (
          <div className="project-card__orb" data-label={project.status} />
        )}
        <span className="project-card__badge">{project.status}</span>
      </div>
      <div className="project-card__body">
        <p className="project-card__meta">{project.meta}</p>
        <h3 className="project-card__title">{project.outcome}</h3>
        <p className="project-card__blurb">{project.blurb}</p>
        <span className="project-card__status">{project.domain}</span>
      </div>
    </Link>
  )
}
