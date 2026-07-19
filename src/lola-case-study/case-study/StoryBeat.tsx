import React from "react";
import type { StoryBeatId } from "./storySpine";
import { STORY_BEATS } from "./storySpine";
import { FadeIn } from "./ui";

type StoryBeatProps = {
  id: StoryBeatId;
  className?: string;
};

/** One paragraph + optional chips — phase narrative without essay walls */
export function StoryBeat({ id, className = "" }: StoryBeatProps) {
  const beat = STORY_BEATS[id];
  if (!beat) return null;

  return (
    <FadeIn className={`cs-story-beat ${className}`.trim()}>
      <p className="cs-story-beat-body">{beat.body}</p>
      {beat.bullets.length > 0 ? (
        <ul className="cs-story-beat-chips" aria-label="Key points">
          {beat.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </FadeIn>
  );
}
