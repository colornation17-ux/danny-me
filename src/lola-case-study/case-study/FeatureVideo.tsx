import React, { useEffect, useRef, useState } from "react";

type FeatureVideoProps = {
  src: string;
  title?: string;
  caption?: string;
  variant?: "hero" | "flow" | "inline";
  className?: string;
  /** Hide figcaption when title/caption already sit above the clip */
  hideCaption?: boolean;
  /** Autoplay when in view (muted until user taps Enable sound) */
  autoPlay?: boolean;
};

/** Product clip with soundtrack — Play / Enable sound unlocks audio (browser autoplay policy) */
export function FeatureVideo({
  src,
  title,
  caption,
  variant = "flow",
  className = "",
  hideCaption = false,
  autoPlay = false,
}: FeatureVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = autoPlay ? !soundOn : false;
    el.volume = 1;
  }, [src, autoPlay, soundOn]);

  // Pause when the clip leaves the viewport; autoplay when it enters
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (!el.paused) {
            el.pause();
            setPlaying(false);
          }
          return;
        }
        if (!autoPlay) return;

        el.muted = !soundOn;
        el.volume = 1;
        void el
          .play()
          .then(() => setPlaying(true))
          .catch(() => {
            // Unmuted autoplay blocked — fall back to muted
            el.muted = true;
            void el
              .play()
              .then(() => setPlaying(true))
              .catch(() => setPlaying(false));
          });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, autoPlay, soundOn]);

  // Kick muted autoplay as soon as the hero mounts (IO can miss first paint)
  useEffect(() => {
    if (!autoPlay) return;
    const el = ref.current;
    if (!el) return;
    el.muted = !soundOn;
    void el
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        el.muted = true;
        void el
          .play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      });
  }, [autoPlay, src]);

  function togglePlayback() {
    const el = ref.current;
    if (!el) return;

    // Autoplay mode: first tap unlocks sound while playing; then pause/play
    if (autoPlay && playing && !soundOn) {
      setSoundOn(true);
      el.muted = false;
      el.volume = 1;
      void el.play().catch(() => {
        /* keep muted if still blocked */
      });
      return;
    }

    if (el.paused) {
      if (autoPlay) setSoundOn(true);
      el.muted = false;
      el.volume = 1;
      void el
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  const label = title ?? caption ?? "Product demo";
  const buttonText =
    autoPlay && playing && !soundOn
      ? "Enable sound"
      : playing
        ? "Pause"
        : "Play · sound on";
  const toggleLabel =
    autoPlay && playing && !soundOn
      ? `Enable sound for ${label}`
      : playing
        ? `Pause ${label}`
        : `Play ${label} with sound`;

  return (
    <figure className={`cs-feature-video cs-feature-video--${variant} cs-feature-video--audio ${className}`.trim()}>
      <div className="cs-feature-video__frame">
        <video
          ref={ref}
          className="cs-feature-video__media"
          src={src}
          muted={autoPlay ? !soundOn : false}
          autoPlay={autoPlay}
          loop
          playsInline
          preload={autoPlay ? "auto" : "metadata"}
          aria-label={label}
        />
        <button
          type="button"
          className={`cs-feature-video__toggle${!playing || (autoPlay && !soundOn) ? " is-sound" : ""}`}
          onClick={togglePlayback}
          aria-pressed={playing && (!autoPlay || soundOn)}
          aria-label={toggleLabel}
        >
          {buttonText}
        </button>
      </div>
      {!hideCaption && (title || caption) ? (
        <figcaption className="cs-feature-video__cap">
          {title ? <span className="cs-feature-video__title">{title}</span> : null}
          {caption ? <span className="cs-feature-video__caption">{caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
