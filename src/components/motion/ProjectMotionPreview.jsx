import CompetitorWatchMotion from './CompetitorWatchMotion'
import LolaMotion from './LolaMotion'

const PREVIEWS = {
  'competitor-watch': CompetitorWatchMotion,
  lola: LolaMotion,
}

export default function ProjectMotionPreview({ slug, size = 'card' }) {
  const Preview = PREVIEWS[slug]
  if (!Preview) return null
  return (
    <div className={`motion-preview motion-preview--${size}`} data-slug={slug}>
      <Preview />
    </div>
  )
}

export function hasMotionPreview(slug) {
  return Boolean(PREVIEWS[slug])
}
