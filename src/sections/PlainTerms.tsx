"use client";

import { useReveal } from "@/hooks/useReveal";

/**
 * The metaphor-to-product bridge, placed before the scroll story begins.
 *
 * Reviewers who were not told what Focus Terminal is could not work it out from
 * the flight narrative alone — they skim, and every early heading was aviation
 * language. This band says the product part first and keeps the aviation term
 * as a small caption underneath, so a skimmer gets four concrete features
 * without reading a single line of the story.
 *
 * Kept on the night surface so the light/dark choreography still turns over at
 * Departures rather than here.
 */
const FEATURES = [
  {
    title: "Timed focus sessions",
    copy: "Pick a length and one task to spend it on. The session has a single job instead of an open-ended list.",
    term: "THE FLIGHT",
  },
  {
    title: "Nudges when you drift",
    copy: "Open something distracting and the cabin hits turbulence — a reminder to come back, never a lock on your Mac.",
    term: "CABIN MODE",
  },
  {
    title: "Progress in the menu bar",
    copy: "Work in any app you like. Remaining minutes and the task you chose stay visible at the top of the screen.",
    term: "IN-FLIGHT STATUS",
  },
  {
    title: "A record that adds up",
    copy: "Each finished session is logged with its task, time and distance, and new countries fill in as you go.",
    term: "PASSPORT STAMPS",
  },
];

export default function PlainTerms() {
  const root = useReveal<HTMLElement>();

  return (
    <section
      id="what-it-is"
      ref={root}
      data-mood="dark"
      className="bg-night-grad-flip border-y border-starlight/15 px-gutter py-xl text-starlight max-md:px-m"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-12 items-start gap-6 border-b border-starlight/15 pb-l max-lg:grid-cols-1 max-lg:gap-4">
          <p data-reveal className="board-caption col-span-3 pt-2 text-instrument">
            IN PLAIN TERMS
          </p>
          <h2 data-reveal className="headline-lg col-span-9 max-w-[780px]">
            Focus Terminal is a focus timer for Mac.
            <span className="block text-starlight/55">
              The flying is how it keeps you in the session.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-x-8 gap-y-l pt-l max-lg:grid-cols-2 max-sm:grid-cols-1">
          {FEATURES.map((feature, index) => (
            <div key={feature.title} data-reveal>
              <div className="flex items-center gap-3">
                <span className="instrument tnum text-[13px] text-starlight/40">
                  0{index + 1}
                </span>
                <span className="h-px w-6 bg-instrument" aria-hidden="true" />
              </div>
              <h3 className="headline-sm mt-4">{feature.title}</h3>
              <p className="body-text mt-2 text-starlight/70">{feature.copy}</p>
              <p className="board-micro mt-4 text-starlight/45">{feature.term}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
