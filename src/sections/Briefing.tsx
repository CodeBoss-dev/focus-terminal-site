"use client";

import { useReveal } from "@/hooks/useReveal";

const STEPS = [
  {
    callout: "50 MIN",
    title: "Choose the time.",
    copy: "Start with the block you want to protect—not an intimidating list of everything left to do.",
    status: "DURATION SET",
  },
  {
    callout: "DEEP WORK",
    title: "Name the reason.",
    copy: "Your task prints on the boarding pass, so the flight always has a purpose.",
    status: "TASK LOADED",
  },
  {
    callout: "TKS → HND",
    title: "Let the route move.",
    copy: "Work in any app while the aircraft, countdown, and menu-bar status advance toward arrival.",
    status: "IN FLIGHT",
  },
  {
    callout: "JP · 001",
    title: "Bring back proof.",
    copy: "Land the session and its time, miles, route, and country become part of your passport.",
    status: "STAMPED",
  },
];

export default function Briefing() {
  const root = useReveal<HTMLElement>();
  return (
    <section
      id="briefing"
      ref={root}
      data-mood="dark"
      className="bg-night-grad-flip relative overflow-hidden px-gutter py-[15vh] max-md:px-m max-md:py-24"
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-12 gap-x-8 max-lg:grid-cols-1">
        <header className="col-span-5 pr-xl max-lg:pr-0">
          <p data-reveal className="board-caption text-instrument">
            PRE-FLIGHT BRIEFING / THE IDEA
          </p>
          <h2 data-reveal className="mt-l text-[clamp(46px,6.5vw,94px)] font-bold leading-[0.94] tracking-[-0.055em] text-starlight">
            A timer counts down.
            <span className="mt-3 block text-instrument">A flight moves forward.</span>
          </h2>
          <p data-reveal className="section-deck mt-l max-w-[480px] text-starlight/72">
            Both measure the same minutes. Only one gives those minutes a departure, a horizon,
            and a reason to stay until arrival.
          </p>
          <div data-reveal className="mt-xl flex items-center gap-4 border-t border-starlight/15 pt-5">
            <span className="h-2 w-2 rounded-full bg-boarding" />
            <p className="board-caption text-starlight/55">CABIN READY · FOUR PART FLIGHT PLAN</p>
          </div>
        </header>

        <div className="relative col-span-7 mt-2 max-lg:mt-xl">
          <span className="absolute bottom-8 left-[27px] top-8 w-px bg-starlight/15 max-sm:left-[21px]" aria-hidden="true" />
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              data-reveal
              className="group relative grid grid-cols-[56px_1fr_auto] gap-5 border-t border-starlight/15 py-7 first:border-t-0 max-sm:grid-cols-[44px_1fr] max-sm:gap-3"
            >
              <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-starlight/20 bg-nighttop font-mono text-xs text-instrument transition-colors group-hover:border-route max-sm:h-11 max-sm:w-11">
                0{index + 1}
              </span>
              <div>
                <p className="board-micro text-route">{step.callout}</p>
                <h3 className="mt-2 text-[clamp(24px,2.8vw,38px)] font-semibold tracking-[-0.035em] text-starlight">
                  {step.title}
                </h3>
                <p className="body-text mt-2 max-w-[520px] text-starlight/68">{step.copy}</p>
              </div>
              <p className="board-micro self-center text-right text-starlight/35 max-sm:col-start-2 max-sm:text-left">
                {step.status} ✓
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
