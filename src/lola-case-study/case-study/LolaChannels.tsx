import React from "react";
import { LolaMark, FadeIn, Panel } from "./ui";
import { LOLA_CHANNELS } from "./constants";

function ChannelTitle({ title }: { title: string }) {
  if (!title.includes("Lola")) return title;
  const [before, after] = title.split("Lola");
  return (
    <>
      {before}
      <LolaMark variant="inline" />
      {after}
    </>
  );
}

export function LolaChannels() {
  return (
    <div className="mb-12 md:mb-14">
      <FadeIn>
        <p className="cs-eyebrow mb-2">How the mascot talks</p>
        <h3 className="cs-h3 mb-2">Text and voice — same brain, grounded answers</h3>
        <p className="cs-body mb-6">
          <LolaMark /> is La Bodega&apos;s bilingual store mascot on WhatsApp: specials, hours, buffet, SNAP, reminders,
          and pickup lists. Voice notes transcribe through Whisper; replies can be text or TTS when it helps. Coach and
          confusion paths stay text-only.
        </p>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LOLA_CHANNELS.map((ch) => (
          <Panel key={ch.title} className="h-full">
            <p className="cs-eyebrow text-[var(--cs-teal)] mb-2">
              <ChannelTitle title={ch.title} />
            </p>
            <ul className="space-y-2 cs-body">
              {ch.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[var(--cs-accent)]">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}
