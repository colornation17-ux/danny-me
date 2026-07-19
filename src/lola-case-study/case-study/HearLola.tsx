import React, { useCallback, useEffect, useRef, useState } from "react";
import { LOLA_VOICE_SAMPLES } from "./constants";
import { IconSwap } from "./transitions";
import { FadeIn, Panel } from "./ui";

export function HearLola() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    audioRef.current = null;
    setPlayingId(null);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const play = (id: string, src?: string) => {
    if (playingId === id) {
      stop();
      return;
    }
    stop();
    setErrorId(null);

    if (!src) {
      setErrorId(id);
      return;
    }

    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingId(id);

    audio.onended = () => {
      setPlayingId(null);
      audioRef.current = null;
    };
    audio.onerror = () => {
      setPlayingId(null);
      setErrorId(id);
      audioRef.current = null;
    };

    void audio.play().catch(() => {
      setPlayingId(null);
      setErrorId(id);
      audioRef.current = null;
    });
  };

  return (
    <div>
      <FadeIn>
        <header className="cs-section-intro max-w-[52ch]">
          <p className="cs-meta-label">Voice lane</p>
          <h3 className="cs-h3">Voice hits the same grounded path as text</h3>
          <p className="cs-body max-w-[52ch]">
            {/* Slot: swap back to an adoption line once a later-pilot voice % is pulled (study window: 1 of 310). */}
            Customers can speak instead of type — Lola transcribes, then answers from the same staff-approved knowledge,
            in the right language.
          </p>
        </header>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOLA_VOICE_SAMPLES.map((sample, i) => (
          <FadeIn key={sample.id} delay={i * 0.05}>
            <Panel className="cs-voice-sample h-full flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="cs-voice-sample-lang">{sample.lang}</span>
                  <p className="cs-voice-sample-title">{sample.label}</p>
                </div>
                <button
                  type="button"
                  className="cs-btn-ghost cs-btn-sm shrink-0"
                  aria-pressed={playingId === sample.id}
                  aria-label={
                    playingId === sample.id
                      ? `Stop ${sample.label} sample`
                      : `${sample.playLabel} sample`
                  }
                  onClick={() => play(sample.id, sample.audioSrc)}
                >
                  <IconSwap
                    state={playingId === sample.id ? "b" : "a"}
                    iconA={<span aria-hidden>▶</span>}
                    iconB={<span aria-hidden>■</span>}
                  />
                  {playingId === sample.id ? "Stop" : sample.playLabel}
                </button>
              </div>
              <blockquote className="cs-voice-sample-transcript flex-1">
                &ldquo;{sample.transcript}&rdquo;
              </blockquote>
              {errorId === sample.id && (
                <p className="text-[12px] text-red-600 mt-2" role="alert">
                  Could not play audio — check volume or try again.
                </p>
              )}
            </Panel>
          </FadeIn>
        ))}
      </div>

      <p className="mt-5 text-[13px] text-[var(--cs-ink-muted)] max-w-[48ch]">
        Voice replies use the same staff-approved knowledge as text replies.
      </p>
    </div>
  );
}
