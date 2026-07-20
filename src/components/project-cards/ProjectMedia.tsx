import { useCallback, useEffect, useRef, useState } from 'react'
import ProjectMotionPreview, {
  hasMotionPreview,
} from '../motion/ProjectMotionPreview'
import type { ProjectMedia as MediaModel } from './project-card.types'

type Props = {
  media: MediaModel
  title: string
  isActive: boolean
  reduceMotion: boolean
  isInitialCard: boolean
}

export default function ProjectMedia({
  media,
  title,
  isActive,
  reduceMotion,
  isInitialCard,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const hasAudio =
    media.kind === 'video' && Boolean(media.audioControl) && Boolean(media.src)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    if (!isActive) {
      video.pause()
      video.muted = true
      if (isAudioOn) setIsAudioOn(false)
      return undefined
    }

    if (reduceMotion) {
      video.pause()
      return undefined
    }

    video.muted = !isAudioOn
    video.play().catch(() => {
      /* poster remains */
    })

    return () => {
      video.pause()
    }
  }, [isActive, reduceMotion, isAudioOn])

  const toggleAudio = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    const next = !isAudioOn
    video.muted = !next
    video.volume = next ? 1 : 0
    try {
      if (next) await video.play()
      setIsAudioOn(next)
    } catch {
      video.muted = true
      setIsAudioOn(false)
    }
  }, [isAudioOn])

  const poster =
    media.kind === 'video' ? media.poster : undefined
  const alt = media.alt || `${title} preview`

  return (
    <div className="folder-card__img">
      <div
        className="folder-card__image folder-card__image--fill"
        {...(media.kind === 'video' || media.kind === 'motion'
          ? { role: 'img', 'aria-label': alt }
          : {})}
      >
        {media.kind === 'video' ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload={isActive ? 'metadata' : 'none'}
            poster={poster}
            aria-hidden="true"
          >
            <source src={media.src} type="video/mp4" />
          </video>
        ) : media.kind === 'motion' && hasMotionPreview(media.slug) ? (
          <ProjectMotionPreview slug={media.slug} size="card" />
        ) : media.kind === 'image' ? (
          <img
            src={media.src}
            alt={alt}
            loading={isInitialCard ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={isInitialCard ? 'high' : 'auto'}
          />
        ) : (
          <div className="folder-card__placeholder" aria-hidden="true">
            <span>{title}</span>
          </div>
        )}

        {hasAudio && isActive && !reduceMotion && (
          <button
            type="button"
            className="folder-card__audio"
            onClick={toggleAudio}
            aria-pressed={isAudioOn}
            aria-label={
              isAudioOn
                ? `Mute ${title} preview audio`
                : `Play ${title} preview audio`
            }
          >
            {isAudioOn ? 'Audio on' : 'Play audio'}
          </button>
        )}
      </div>
    </div>
  )
}
