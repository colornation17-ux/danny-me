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
  const [isReelPaused, setIsReelPaused] = useState(false)
  const hasAudio =
    media.kind === 'video' && Boolean(media.audioControl) && Boolean(media.src)
  const hasVideo = media.kind === 'video' && Boolean(media.src)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    if (!isActive) {
      video.pause()
      video.muted = true
      setIsAudioOn(false)
      setIsReelPaused(false)
      return undefined
    }

    video.load()
    return undefined
  }, [isActive])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !isActive) return undefined

    if (reduceMotion || isReelPaused) {
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
  }, [isActive, reduceMotion, isAudioOn, isReelPaused])

  const toggleAudio = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    const next = !isAudioOn
    video.muted = !next
    video.volume = next ? 1 : 0
    try {
      if (next) {
        setIsReelPaused(false)
        await video.play()
      }
      setIsAudioOn(next)
    } catch {
      video.muted = true
      setIsAudioOn(false)
    }
  }, [isAudioOn])

  const toggleReelPlayback = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setIsReelPaused((paused) => {
      const next = !paused
      if (next) {
        video.pause()
      } else {
        video.muted = !isAudioOn
        video.play().catch(() => {})
      }
      return next
    })
  }, [isAudioOn])

  const poster =
    media.kind === 'video' ? media.poster : undefined
  const alt = media.alt || `${title} preview`

  return (
    <div className="folder-card__img">
      <div
        className="folder-card__image folder-card__image--fill"
        {...(media.kind === 'video' || media.kind === 'motion'
          ? {
              role: 'img',
              'aria-label':
                media.kind === 'video'
                  ? `${alt}, silent`
                  : alt,
            }
          : {})}
      >
        {media.kind === 'video' ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload={isActive ? 'metadata' : 'none'}
            {...(poster ? { poster } : {})}
            aria-hidden="true"
          >
            {isActive ? <source src={media.src} type="video/mp4" /> : null}
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

        {hasVideo && isActive && !reduceMotion && (
          <button
            type="button"
            className="folder-card__audio folder-card__reel-toggle"
            onClick={toggleReelPlayback}
            aria-pressed={!isReelPaused}
            aria-label={
              isReelPaused ? `Play ${title} reel` : `Pause ${title} reel`
            }
          >
            <span className="sr-only">
              {isReelPaused ? 'Play reel' : 'Pause reel'}
            </span>
            {isReelPaused ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path fill="currentColor" d="M3 1.5v11l9-5.5L3 1.5Z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <rect x="3" y="2" width="3" height="10" rx="0.5" fill="currentColor" />
                <rect x="8" y="2" width="3" height="10" rx="0.5" fill="currentColor" />
              </svg>
            )}
          </button>
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
