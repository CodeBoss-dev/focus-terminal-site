"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import Barcode from "@/components/Barcode";
import EmailSignup from "@/components/EmailSignup";
import { MULTI_LEG } from "@/lib/flight";

export function Manifesto() {
  const root = useReveal<HTMLElement>();
  return (
    <section
      ref={root}
      data-mood="light"
      className="relative overflow-hidden bg-paper px-gutter py-[15vh] text-ink max-md:px-m max-md:py-24"
    >
      <div className="mx-auto max-w-[1320px]">
        <div data-reveal className="flex items-center justify-between border-b border-ink/15 pb-4">
          <p className="board-caption text-ink/45">AFTER ARRIVAL / WHY IT WORKS</p>
          <p className="board-micro text-ink/35">SAME MINUTES · DIFFERENT GRAVITY</p>
        </div>

        <div className="grid grid-cols-12 border-b border-ink/15 max-lg:grid-cols-1">
          <div className="col-span-5 flex min-h-[390px] flex-col justify-between border-r border-ink/15 py-l pr-l max-lg:min-h-0 max-lg:border-b max-lg:border-r-0 max-lg:pr-0">
            <p data-reveal className="board-caption text-ink/40">THE OLD OBJECT</p>
            <p data-reveal className="outline-display tnum py-l">50:00</p>
            <p data-reveal className="section-deck max-w-[390px] text-ink/65">
              A number going down. Useful, but with nothing waiting at the other end.
            </p>
          </div>

          <div className="col-span-7 flex min-h-[390px] flex-col justify-between py-l pl-l max-lg:min-h-0 max-lg:pl-0">
            <p data-reveal className="board-caption text-ink/40">THE WINDOWSEAT OBJECT</p>
            <p data-reveal className="route-display py-l max-sm:text-[44px]">
              TKS <span className="text-ink/25">→</span> HND
            </p>
            <div data-reveal className="flex max-w-[590px] items-center gap-5">
              <span className="h-3 w-3 shrink-0 rounded-full bg-boarding" />
              <p className="section-deck text-ink/68">
                A task with a departure, progress you can see, and a landing worth reaching.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 pt-xl max-lg:grid-cols-1">
          <p data-reveal className="board-caption col-span-3 text-ink/40">
            THE DIFFERENCE
          </p>
          <h2
            data-reveal
            className="col-span-9 max-w-[980px] text-[clamp(43px,6vw,86px)] font-bold leading-[0.98] tracking-[-0.055em]"
          >
            Same fifty minutes.
            <span className="block text-ink/35">A much better reason to finish.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}

const NUMBERS = [
  { value: "04", label: "FOCUS CLASSES", detail: "WORK / STUDY / READ / CREATE" },
  { value: "1,152", label: "AIRPORTS", detail: "REAL DESTINATIONS TO FLY BETWEEN" },
  { value: "40,075", label: "KILOMETRES", detail: "THE ROUND-THE-WORLD ACHIEVEMENT" },
  { value: "02", label: "CABIN MOODS", detail: "BRIGHT TERMINAL / NIGHT FLIGHT" },
];

export function Numbers() {
  const root = useReveal<HTMLElement>();
  return (
    <section ref={root} data-mood="dark" className="bg-nighttop border-y border-starlight/15 text-starlight">
      <div className="grid grid-cols-[110px_repeat(4,1fr)] max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div className="flex items-center justify-center border-r border-starlight/15 bg-signal text-ink max-lg:col-span-2 max-lg:min-h-16 max-lg:border-b max-lg:border-r-0 max-sm:col-span-1">
          <p className="board-caption lg:-rotate-90">AIRCRAFT / SPECS</p>
        </div>
        {NUMBERS.map((number, index) => (
          <div
            key={number.label}
            data-reveal
            className={`min-h-[300px] px-l py-xl ${index > 0 ? "border-l border-starlight/15 max-sm:border-l-0 max-sm:border-t" : ""} ${index === 2 ? "max-lg:border-l-0 max-lg:border-t" : ""} ${index === 3 ? "max-lg:border-t" : ""} max-md:min-h-[240px] max-md:px-m max-md:py-l max-sm:min-h-[210px]`}
          >
            <div className="flex items-center justify-between">
              <p className="board-micro text-starlight/30">DATA / 00{index + 1}</p>
              <span className="h-1.5 w-1.5 rounded-full bg-route" />
            </div>
            <p className="instrument tnum mt-xl text-[clamp(46px,5vw,76px)] leading-none text-instrument">
              {number.value}
            </p>
            <p className="board-sm mt-m text-starlight">{number.label}</p>
            <p className="board-micro mt-2 max-w-[220px] leading-relaxed text-starlight/35">
              {number.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LegChip({
  label,
  route,
  detail,
  isBreak,
}: (typeof MULTI_LEG)[number] & { isBreak?: boolean }) {
  return (
    <div className={`border-l-2 px-4 py-3 ${isBreak ? "border-signal bg-signal/10" : "border-ink/20"}`}>
      <p className="board-micro text-ink/40">{label}</p>
      <p className="board-sm mt-1 font-bold">{route}</p>
      <p className="board-micro mt-1 text-ink/50">{detail}</p>
    </div>
  );
}

const CRAFT: {
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  vignette: ReactNode;
}[] = [
  {
    eyebrow: "MULTI-LEG JOURNEYS",
    title: "Long work has a connection.",
    body: "A three-hour afternoon becomes a journey with a plane change. Breaks are part of the itinerary, not a failure to focus.",
    note: "BREAKS / SCHEDULED",
    vignette: (
      <div className="flex items-stretch gap-2 max-md:flex-col">
        {MULTI_LEG.map((leg) => (
          <LegChip key={leg.label} {...leg} isBreak={leg.label === "BREAK"} />
        ))}
      </div>
    ),
  },
  {
    eyebrow: "CABIN AUDIO",
    title: "A hum without a loop to notice.",
    body: "Procedurally generated cabin noise gives the room a steady floor. It is optional, restrained, and one click from silence.",
    note: "AUDIO / OPT-IN",
    vignette: (
      <div className="bg-night-grad border border-starlight/15 p-m text-starlight">
        <div className="flex items-center justify-between border-b border-starlight/15 pb-m">
          <span className="board-caption">CABIN BED · ACTIVE</span>
          <span className="board-caption text-boarding">● ON</span>
        </div>
        <div className="mt-m flex h-16 items-center justify-between gap-1" aria-hidden="true">
          {[13, 27, 18, 39, 22, 45, 31, 18, 36, 24, 42, 16, 29, 20, 34, 14].map(
            (height, index) => (
              <span
                key={index}
                className="w-full bg-instrument/55"
                style={{ height }}
              />
            )
          )}
        </div>
        <p className="board-micro mt-m text-starlight/40">PINK NOISE / FILTERED / NO FILE LOOP</p>
      </div>
    ),
  },
  {
    eyebrow: "MENU BAR",
    title: "The flight follows you to work.",
    body: "Leave WindowSeat in the background. Flight number, remaining minutes, and destination stay visible at the top of your Mac.",
    note: "STATUS / ALWAYS NEAR",
    vignette: (
      <div className="border border-ink/15 bg-lifted">
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-2 max-sm:justify-end">
          <span className="board-micro text-ink/30 max-sm:hidden">FINDER&ensp; FILE&ensp; EDIT&ensp; VIEW</span>
          <span className="board-sm tnum bg-ink px-3 py-1 font-bold text-paper max-sm:text-[12px]">
            ✈ WS214 · 42m → HND
          </span>
        </div>
        <div className="grid grid-cols-3 px-4 py-m">
          {[["FLIGHT", "WS 214"], ["REMAINING", "42 MIN"], ["DEST", "HND"]].map(([label, value]) => (
            <div key={label}>
              <p className="board-micro text-ink/35">{label}</p>
              <p className="board-sm mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    eyebrow: "CABIN MODE",
    title: "A seatbelt sign, not handcuffs.",
    body: "Drift to an app on your no-fly list and the cabin hits turbulence—a nudge to return, never a lock on your Mac.",
    note: "NUDGE / NEVER BLOCK",
    vignette: (
      <div className="bg-night-grad border border-turbulence/35 p-m text-starlight">
        <div className="flex items-center justify-between">
          <p className="board-caption text-turbulence">● TURBULENCE AHEAD</p>
          <p className="board-micro text-starlight/35">CABIN MODE</p>
        </div>
        <p className="mt-m text-[18px] font-medium">Slack has been open for a while.</p>
        <p className="body-sm mt-2 max-w-[500px] text-starlight/55">
          The seatbelt sign is on. Return to your flight when you&apos;re ready.
        </p>
      </div>
    ),
  },
  {
    eyebrow: "KEYBOARD CONTROL",
    title: "Hands stay on the work.",
    body: "Book, divert, or enter the full-window Pure Mode without breaking your rhythm to hunt through controls.",
    note: "CONTROL / INSTANT",
    vignette: (
      <div className="grid grid-cols-3 border border-ink/15 bg-lifted">
        {[
          { key: "⌘N", label: "BOOK" },
          { key: "⌘.", label: "DIVERT" },
          { key: "F", label: "PURE MODE" },
        ].map((shortcut, index) => (
          <div key={shortcut.key} className={`p-m max-sm:p-s ${index > 0 ? "border-l border-ink/10" : ""}`}>
            <p className="text-[clamp(26px,3vw,42px)] font-semibold tracking-tight">{shortcut.key}</p>
            <p className="board-micro mt-s text-ink/45">{shortcut.label}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export function Craft() {
  const root = useReveal<HTMLElement>();
  return (
    <section
      ref={root}
      data-mood="light"
      className="bg-paper px-gutter py-[15vh] text-ink max-md:px-m max-md:py-24"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-12 gap-6 pb-xl max-lg:grid-cols-1">
          <div className="col-span-4">
            <p data-reveal className="board-caption text-ink/40">CABIN MANUAL / FIVE SYSTEMS</p>
          </div>
          <div className="col-span-8">
            <h2
              data-reveal
              className="max-w-[850px] text-[clamp(43px,5.6vw,78px)] font-bold leading-[0.98] tracking-[-0.055em]"
            >
              The details that keep a flight on course.
            </h2>
            <p data-reveal className="section-deck mt-l max-w-[620px] text-ink/68">
              The aviation metaphor is not a skin. It shapes how long sessions break, how
              distractions feel, and how progress stays visible while you work elsewhere.
            </p>
          </div>
        </div>

        <div className="border-b border-ink/15">
          {CRAFT.map((feature, index) => (
            <article
              key={feature.eyebrow}
              data-reveal
              className="grid grid-cols-[92px_4fr_5fr] gap-l border-t border-ink/15 py-xl max-lg:grid-cols-[64px_1fr] max-md:gap-m max-md:py-l max-sm:grid-cols-1 max-sm:gap-s"
            >
              <div>
                <p className="instrument tnum text-[30px] text-ink/20">0{index + 1}</p>
                <span className="mt-3 block h-px w-8 bg-signal" />
              </div>
              <div>
                <p className="board-caption text-ink/40">{feature.eyebrow}</p>
                <h3 className="mt-m max-w-[430px] text-[clamp(28px,3.6vw,48px)] font-semibold leading-[1.02] tracking-[-0.04em]">
                  {feature.title}
                </h3>
                <p className="section-deck mt-m max-w-[470px] text-ink/68">{feature.body}</p>
                <p className="board-micro mt-l text-ink/30">{feature.note}</p>
              </div>
              <div className="self-center max-lg:col-start-2 max-lg:mt-m max-lg:min-w-0 max-sm:col-start-1">{feature.vignette}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTABand() {
  const root = useReveal<HTMLElement>();
  return (
    <section
      ref={root}
      id="board"
      data-mood="light"
      className="relative overflow-hidden bg-signal px-gutter py-[14vh] text-ink max-md:px-m max-md:py-24"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-3 bg-ink" />
      <div className="mx-auto max-w-[1320px]">
        <div className="flex items-end justify-between border-b border-ink/25 pb-5 max-sm:block">
          <p className="board-caption">FINAL CALL / GATE YOURS</p>
          <p className="board-micro text-ink/55 max-sm:mt-2">BOARDING STATUS · OPEN</p>
        </div>
        <h2
          data-reveal
          className="mt-l text-[clamp(66px,11vw,168px)] font-black leading-[0.78] tracking-[-0.075em] max-sm:text-[56px]"
        >
          YOUR GATE
          <span className="block">IS OPEN.</span>
        </h2>

        <div
          data-reveal
          className="relative z-10 ml-auto mt-xl grid w-full max-w-[940px] rotate-[-1.5deg] grid-cols-[1fr_240px] shadow-[0_30px_80px_rgba(20,22,26,0.24)] transition-transform duration-300 hover:rotate-0 max-md:rotate-0 max-md:grid-cols-1"
        >
          <div className="paper-texture relative p-l max-md:p-m">
            <span className="absolute inset-y-0 left-0 w-1.5 bg-ink" />
            <div className="flex items-baseline justify-between gap-m max-sm:block">
              <p className="board-caption text-ink/50">WINDOWSEAT AIR · NOW BOARDING</p>
              <p className="board-caption text-ink/50 max-sm:mt-2">GATE · YOURS</p>
            </div>
            <h3 className="mt-m text-[clamp(34px,5vw,58px)] font-bold tracking-[-0.045em]">
              Be first to board.
            </h3>
            <p className="section-deck mt-s max-w-[540px] text-ink/68">
              Leave your email and we&apos;ll let you know when WindowSeat is ready for departure.
            </p>
            <EmailSignup />
          </div>
          <div className="paper-texture border-l border-dashed border-ink/30 p-m max-md:border-l-0 max-md:border-t">
            <p className="board-sm font-bold">TKS → ???</p>
            <p className="board-micro mt-1 text-ink/40">DESTINATION · YOUR CHOICE</p>
            <div className="mt-m grid grid-cols-2 gap-m">
              <div>
                <p className="board-micro text-ink/40">SEAT</p>
                <p className="board-sm mt-1 font-bold">WINDOW</p>
              </div>
              <div>
                <p className="board-micro text-ink/40">STATUS</p>
                <p className="board-sm mt-1 font-bold text-boarding">READY</p>
              </div>
            </div>
            <div className="mt-l">
              <Barcode data="WINDOWSEAT MACOS FOCUS FLIGHT" className="h-12 w-full" />
              <p className="board-micro mt-2 text-ink/40">FOCUS SESSIONS, FLOWN.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
