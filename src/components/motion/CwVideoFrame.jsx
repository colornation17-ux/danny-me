import CaseStudyVideo from '../CaseStudyVideo'

/**
 * Video beat frame — soft card + hover.
 * Bottom of recordings is cropped to hide baked-in 01/06 counter chrome.
 */
export default function CwVideoFrame({
  src,
  poster,
  label,
  mode = 'scroll',
  className = '',
  videoClassName = 'cs-video--feature',
}) {
  return (
    <div className={`cw-vframe ${className}`.trim()}>
      <div className="cw-vframe__stage">
        <CaseStudyVideo
          src={src}
          poster={poster}
          label={label}
          mode={mode}
          className={videoClassName}
        />
      </div>
    </div>
  )
}
