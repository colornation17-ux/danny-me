import React from "react";
import { STORY_TRACKS } from "./storySpine";
import { FadeIn } from "./ui";

/** Two pickup paths — order now vs remind later */
export function StoryTracks() {
  return (
    <FadeIn className="cs-page mb-8">
      <p className="cs-meta-label mb-3">Two tracks, one counter</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {STORY_TRACKS.map((track) => (
          <article key={track.id} className="cs-story-track">
            <h3 className="cs-story-track-title">{track.title}</h3>
            <p className="cs-story-track-summary">{track.summary}</p>
          </article>
        ))}
      </div>
    </FadeIn>
  );
}
