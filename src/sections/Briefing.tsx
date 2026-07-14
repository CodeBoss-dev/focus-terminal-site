"use client";

import { useReveal } from "@/hooks/useReveal";

/** The app's real onboarding register: warm and professional, not shouting. */
export default function Briefing() {
  const root = useReveal<HTMLElement>();
  return (
    <section
      id="briefing"
      ref={root}
      data-mood="dark"
      className="bg-night-grad flex min-h-[82svh] items-center justify-center px-gutter py-xl max-md:px-m"
    >
      <div className="w-full max-w-[1040px]">
        <div className="text-center">
          <p data-reveal className="board-caption mb-m text-instrument">
          PRE-FLIGHT BRIEFING · PA
          </p>
          <h2 data-reveal className="briefing-line text-starlight">
            One focus session. One complete flight.
          </h2>
          <p data-reveal className="body-text mx-auto mt-m max-w-[620px] text-starlight/60">
            The familiar timer is still there. WindowSeat gives it a departure, a route, and
            a satisfying arrival so beginning—and finishing—feels tangible.
          </p>
        </div>

        <div data-reveal className="mt-xl grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1">
          {[
            ["BOOK", "Choose a duration, task, and destination."],
            ["BOARD", "Your plan becomes a boarding pass."],
            ["FOCUS", "Work while your flight advances."],
            ["LAND", "Finish the session and earn the stamp."],
          ].map(([title, copy], index) => (
            <div
              key={title}
              className={`border-starlight/15 px-m py-s ${index > 0 ? "border-l" : ""} ${index > 1 ? "max-md:border-t" : ""} ${index === 2 ? "max-md:border-l-0" : ""} ${index > 0 ? "max-sm:border-l-0 max-sm:border-t" : ""}`}
            >
              <p className="board-micro text-instrument">0{index + 1} · {title}</p>
              <p className="body-sm mt-s text-starlight/65">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
