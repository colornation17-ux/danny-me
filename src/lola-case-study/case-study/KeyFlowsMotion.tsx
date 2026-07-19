import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { FeatureVideo } from "./FeatureVideo";
import { KEY_FLOW_CLIPS } from "./motionAssets";
import { FadeIn } from "./ui";

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function useNarrow(maxWidth = 899) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [maxWidth]);
  return narrow;
}

function FlowsStaticList() {
  return (
    <ol className="cs-flows-sticky__static-list">
      {KEY_FLOW_CLIPS.map((clip, i) => (
        <li key={clip.src} className="cs-flows-sticky__static-item">
          <div className="cs-flows-sticky__copy-block">
            <p className="cs-flows-sticky__kicker">
              {String(i + 1).padStart(2, "0")} · {clip.kicker}
            </p>
            <h4 className="cs-flows-sticky__headline">{clip.headline}</h4>
            <p className="cs-flows-sticky__body">{clip.body}</p>
          </div>
          <FeatureVideo src={clip.src} variant="flow" title={clip.title} hideCaption autoPlay />
        </li>
      ))}
    </ol>
  );
}

/**
 * Sticky key flows — all three beat headlines stay visible (UX copy),
 * scroll thirds lock text + video; devices fan with real gaps (no pile).
 */
export function KeyFlowsMotion() {
  const reduce = useReducedMotion();
  const narrow = useNarrow();
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lastActive = useRef(-1);
  const [progress, setProgress] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(false);

  const usePin = !reduce && !narrow;
  const stepCount = KEY_FLOW_CLIPS.length;

  // Equal thirds — hold each beat cleanly
  const rawStep = progress * stepCount;
  const active = Math.min(stepCount - 1, Math.max(0, Math.floor(rawStep)));
  const stepFloat = Math.min(stepCount - 0.001, rawStep);
  const stepLocal = clamp01(rawStep - active);
  // Fan opens through beat 1, then stays open
  const spread = clamp01(progress / (1 / stepCount));

  useEffect(() => {
    if (!usePin) return;
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const nav = (document.querySelector(".site-nav") ||
        document.querySelector(".folio-nav")) as HTMLElement | null;
      const navH = nav?.offsetHeight ?? 74;
      const pinH = Math.max(1, window.innerHeight - navH);
      const range = Math.max(1, track.offsetHeight - pinH);
      setProgress(clamp01(-rect.top / range));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [usePin]);

  // Step change → play matching clip; sound toggle only remutes, does not rewind
  useEffect(() => {
    if (!usePin) return;

    videoRefs.current.forEach((el, i) => {
      if (!el || i === active) return;
      el.pause();
    });

    const el = videoRefs.current[active];
    if (!el) return;

    const stepped = lastActive.current !== active;
    lastActive.current = active;

    if (stepped) {
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
    }

    el.muted = !soundOn;
    el.volume = 1;

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
  }, [active, usePin, soundOn]);

  function scrollToStep(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const nav = (document.querySelector(".site-nav") ||
        document.querySelector(".folio-nav")) as HTMLElement | null;
    const navH = nav?.offsetHeight ?? 74;
    const pinH = Math.max(1, window.innerHeight - navH);
    const range = Math.max(1, track.offsetHeight - pinH);
    const top = window.scrollY + track.getBoundingClientRect().top;
    window.scrollTo({
      top: top + (range * (i + 0.5)) / stepCount,
      behavior: "smooth",
    });
  }

  function enableSound() {
    setSoundOn(true);
    const el = videoRefs.current[active];
    if (!el) return;
    el.muted = false;
    el.volume = 1;
    void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }

  function togglePlayback() {
    const el = videoRefs.current[active];
    if (!el) return;
    if (el.paused) {
      el.muted = !soundOn;
      el.volume = 1;
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  return (
    <section className="cs-flows-sticky" aria-labelledby="key-flows-heading">
      <FadeIn>
        <header className="cs-section-intro cs-section-intro--tight max-w-[40ch]">
          <p className="cs-meta-label">Develop · motion</p>
          <h3 id="key-flows-heading" className="cs-h3">
            One loop. Three beats.
          </h3>
          <p className="cs-body">
            {usePin
              ? "Scroll — text and devices stay in sync. Tap once for sound."
              : "Guest thread → orders → staff alert."}
          </p>
        </header>
      </FadeIn>

      {!usePin ? (
        <FlowsStaticList />
      ) : (
        <div ref={trackRef} className="cs-flows-sticky__track">
          <div className="cs-flows-sticky__pin">
            <div className="cs-flows-sticky__layout">
              <div className="cs-flows-sticky__rail">
                <div className="cs-flows-sticky__steps" role="list" aria-label="Key flow steps">
                  {KEY_FLOW_CLIPS.map((c, i) => {
                    const dist = Math.abs(stepFloat - i);
                    const focus = clamp01(1 - dist);
                    const on = i === active;
                    return (
                      <button
                        key={c.src}
                        type="button"
                        role="listitem"
                        className={`cs-flows-sticky__step${on ? " is-active" : ""}`}
                        aria-current={on ? "step" : undefined}
                        aria-label={`Beat ${i + 1}: ${c.kicker} — ${c.headline}`}
                        onClick={() => scrollToStep(i)}
                        style={{
                          opacity: 0.34 + focus * 0.66,
                          transform: `translateY(${(1 - focus) * 0.25}rem)`,
                        }}
                      >
                        <p className="cs-flows-sticky__kicker">
                          {String(i + 1).padStart(2, "0")} · {c.kicker}
                        </p>
                        <h4 className="cs-flows-sticky__headline">{c.headline}</h4>
                        <p
                          className={`cs-flows-sticky__body${on ? " is-visible" : ""}`}
                          style={{
                            opacity: on ? 1 : 0,
                            maxHeight: on ? "7rem" : 0,
                            marginTop: on ? undefined : 0,
                          }}
                        >
                          {c.body}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="cs-flows-sticky__controls">
                  <ol className="cs-flows-sticky__dots" aria-label="Flow progress">
                    {KEY_FLOW_CLIPS.map((c, i) => (
                      <li key={c.src}>
                        <button
                          type="button"
                          className={`cs-flows-sticky__dot${i === active ? " is-active" : ""}${i < active ? " is-done" : ""}`}
                          aria-current={i === active ? "step" : undefined}
                          aria-label={`Jump to ${c.kicker}`}
                          onClick={() => scrollToStep(i)}
                        >
                          <span className="cs-flows-sticky__dot-track" aria-hidden>
                            <span
                              className="cs-flows-sticky__dot-fill"
                              style={{
                                transform: `scaleX(${i < active ? 1 : i === active ? Math.max(0.12, stepLocal) : 0})`,
                              }}
                            />
                          </span>
                          <span className="cs-flows-sticky__dot-num">{String(i + 1).padStart(2, "0")}</span>
                          <span className="cs-flows-sticky__dot-label">{c.kicker}</span>
                        </button>
                      </li>
                    ))}
                  </ol>

                  <button
                    type="button"
                    className={`cs-flows-sticky__sound${soundOn ? " is-on" : ""}`}
                    onClick={() => (soundOn ? togglePlayback() : enableSound())}
                    aria-pressed={soundOn && playing}
                  >
                    {!soundOn ? "Enable sound" : playing ? "Pause" : "Play"}
                  </button>
                </div>
              </div>

              <div
                className="cs-flows-sticky__stage"
                style={{ ["--flows-spread" as string]: String(spread) }}
                data-active={active}
              >
                <div className="cs-flows-sticky__cluster" role="group" aria-label="Key flow devices">
                  {KEY_FLOW_CLIPS.map((c, i) => {
                    const on = i === active;
                    return (
                      <figure
                        key={c.src}
                        className={`cs-flows-sticky__phone${on ? " is-active" : ""}`}
                        data-slot={i}
                        aria-current={on ? "step" : undefined}
                      >
                        <div className="cs-flows-sticky__frame">
                          <video
                            ref={(el) => {
                              videoRefs.current[i] = el;
                            }}
                            src={c.src}
                            muted={!soundOn}
                            loop
                            playsInline
                            preload={on || spread > 0.5 ? "auto" : "metadata"}
                            aria-label={c.title}
                          />
                          {!on ? (
                            <button
                              type="button"
                              className="cs-flows-sticky__phone-hit"
                              aria-label={`Jump to ${c.kicker}: ${c.headline}`}
                              onClick={() => scrollToStep(i)}
                            />
                          ) : null}
                        </div>
                        <figcaption className="cs-flows-sticky__cap">{c.kicker}</figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
