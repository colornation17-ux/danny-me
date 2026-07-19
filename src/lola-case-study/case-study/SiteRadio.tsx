import React, { useEffect, useState } from "react";
import {
  getWireRadioVolume,
  isWireRadioPlaying,
  prefetchWireRadio,
  setWireRadioVolume,
  toggleWireRadio,
  WIRE_RADIO,
} from "./wireRadio";

/** Persistent radio control — same bed as the portfolio site */
export function SiteRadio() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(WIRE_RADIO.volume);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPlaying(isWireRadioPlaying());
    setVolume(getWireRadioVolume());
    prefetchWireRadio();
    const onRadio = (e: Event) => {
      const detail = (e as CustomEvent<{ playing?: boolean; volume?: number }>).detail;
      setPlaying(Boolean(detail?.playing));
      if (typeof detail?.volume === "number") setVolume(detail.volume);
    };
    window.addEventListener("wire-radio", onRadio);
    return () => window.removeEventListener("wire-radio", onRadio);
  }, []);

  const onToggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await toggleWireRadio();
    } finally {
      setBusy(false);
    }
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    setWireRadioVolume(v);
  };

  return (
    <div className="site-radio" role="region" aria-label="Site radio">
      <div className={`site-radio__panel${playing ? " is-playing" : ""}`}>
        <button
          type="button"
          className={`site-radio__btn${playing ? " is-playing" : ""}`}
          onClick={onToggle}
          disabled={busy}
          aria-pressed={playing}
          title={playing ? "Pause radio" : `Play radio from 1:03 — ${WIRE_RADIO.track}`}
        >
          <span className="site-radio__icon" aria-hidden="true">
            {playing ? (
              <svg viewBox="0 0 16 16" width="14" height="14">
                <rect x="3" y="2" width="3.5" height="12" rx="0.5" fill="currentColor" />
                <rect x="9.5" y="2" width="3.5" height="12" rx="0.5" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="14" height="14">
                <path fill="currentColor" d="M4 2.5v11l9-5.5L4 2.5Z" />
              </svg>
            )}
          </span>
          <span className="site-radio__copy">
            <span className="site-radio__eyebrow">{playing ? "On air" : "Radio"}</span>
            <span className="site-radio__label">{playing ? "Pause" : "Play"}</span>
          </span>
          {playing ? <span className="site-radio__bars" aria-hidden="true" /> : null}
        </button>

        <label className="site-radio__vol">
          <span className="site-radio__vol-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="12" height="12">
              <path
                fill="currentColor"
                d="M2 6h3l3-3v10L5 10H2V6Zm8.2 1.1a2.2 2.2 0 0 1 0 1.8l-.7-.4a1.4 1.4 0 0 0 0-1l.7-.4Zm1.6-1.6a4.2 4.2 0 0 1 0 5l-.7-.45a3.3 3.3 0 0 0 0-4.1l.7-.45Z"
              />
            </svg>
          </span>
          <input
            type="range"
            className="site-radio__slider"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolume}
            aria-label="Radio volume"
          />
        </label>
      </div>
    </div>
  );
}
