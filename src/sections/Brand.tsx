"use client";

import { useReveal } from "@/hooks/useReveal";
import Barcode from "@/components/Barcode";
import { MULTI_LEG } from "@/lib/flight";

/* ---------------------------------------------------------------- */
/* Manifesto                                                          */
/* ---------------------------------------------------------------- */

export function Manifesto() {
  const root = useReveal<HTMLElement>();
  return (
    <section ref={root} data-mood="light" className="bg-paper px-gutter py-[18vh] text-ink max-md:px-m">
      <div className="hairline-t hairline-b mx-auto max-w-[1200px] py-xl">
        <p data-reveal className="board-caption text-ink/40">
          MANIFESTO
        </p>
        <h2 data-reveal className="signage signage-lg mt-m max-w-[900px]">
          Focus is a place you fly to.
        </h2>
        <p data-reveal className="body-text mt-l max-w-[560px] text-ink/60">
          A timer is just a number going down — easy to start, easier to quit. A flight has a
          departure, a route, and a destination with your name on it.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Numbers strip — real figures only                                  */
/* ---------------------------------------------------------------- */

const NUMBERS = [
  { value: "4", label: "FOCUS CLASSES · WORK, STUDY, READ, CREATE" },
  { value: "1,152", label: "REAL AIRPORTS TO FLY BETWEEN" },
  { value: "40,075", label: "KM — THE ROUND-THE-WORLD ACHIEVEMENT" },
  { value: "2", label: "MOODS · BRIGHT TERMINAL, DARK CABIN" },
];

export function Numbers() {
  const root = useReveal<HTMLElement>();
  return (
    <section ref={root} data-mood="light" className="bg-paper px-gutter pb-[14vh] text-ink max-md:px-m">
      <div className="mx-auto grid max-w-[1200px] grid-cols-4 max-md:grid-cols-2 max-md:gap-y-l">
        {NUMBERS.map((n, i) => (
          <div
            key={n.label}
            data-reveal
            className={`pr-l max-md:pr-m ${i > 0 ? "border-l border-ink/10 pl-l max-md:pl-m" : ""} ${
              i === 2 ? "max-md:border-l-0 max-md:pl-0" : ""
            }`}
          >
            <p className="signage signage-md tnum">{n.value}</p>
            <p className="board-caption mt-s text-ink/50">{n.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Craft chapters — every claim true, every vignette from the app     */
/* ---------------------------------------------------------------- */

function LegChip({ label, route, detail, isBreak }: (typeof MULTI_LEG)[number] & { isBreak?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        isBreak ? "border-signal bg-signal/10" : "border-ink/15 bg-lifted"
      }`}
    >
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
  vignette: React.ReactNode;
}[] = [
  {
    eyebrow: "MULTI-LEG JOURNEYS",
    title: "Long session? Book it in legs.",
    body: "A three-hour afternoon becomes a journey with a plane change — breaks are built into the itinerary, not bolted on.",
    vignette: (
      <div className="flex items-stretch gap-3 max-md:flex-col">
        {MULTI_LEG.map((leg) => (
          <LegChip key={leg.label} {...leg} isBreak={leg.label === "BREAK"} />
        ))}
      </div>
    ),
  },
  {
    eyebrow: "CABIN AUDIO",
    title: "A cabin hum you opt into.",
    body: "Procedurally generated cabin noise — filtered pink noise and restrained lifecycle cues. Off by default, one click to mute.",
    vignette: (
      <div className="bg-night-grad rounded-2xl p-m">
        <div className="flex items-center gap-3">
          <span className="glass rounded-full px-4 py-2">
            <span className="board-caption text-starlight">AUDIO · ON</span>
          </span>
          <div className="flex items-end gap-1" aria-hidden="true">
            {[10, 16, 8, 20, 12, 18, 9, 14].map((h, i) => (
              <span key={i} className="w-1 rounded-full bg-instrument/70" style={{ height: h }} />
            ))}
          </div>
        </div>
        <p className="board-micro mt-s text-starlight/50">
          PROCEDURAL CABIN BED · PINK NOISE, FILTERED · NO LOOPS TO RECOGNISE
        </p>
      </div>
    ),
  },
  {
    eyebrow: "MENU BAR",
    title: "Your flight, top of screen.",
    body: "The menu bar shows the live leg while you work in other apps — flight number, minutes remaining, destination.",
    vignette: (
      <div className="rounded-xl border border-ink/10 bg-lifted px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="board-micro text-ink/30">FINDER&ensp;FILE&ensp;EDIT&ensp;VIEW</span>
          <span className="board-sm tnum rounded-md bg-ink px-3 py-1 font-bold text-paper">
            ✈ WS214 · 42m → HND
          </span>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "CABIN MODE",
    title: "Turbulence, not handcuffs.",
    body: "Drift to a distracting app and the cabin hits turbulence — a nudge to return, never a lock. Nothing is blocked, ever.",
    vignette: (
      <div className="bg-night-grad rounded-2xl p-m">
        <div className="glass rounded-2xl border-turbulence/30 px-5 py-4">
          <p className="board-caption text-turbulence">● TURBULENCE AHEAD</p>
          <p className="body-sm mt-1 text-starlight/85">
            Slack has been open for a while. The seatbelt sign is on — return to your flight.
          </p>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "KEYBOARD",
    title: "Hands stay on the yoke.",
    body: "Book, divert, or go full-window without touching the mouse.",
    vignette: (
      <div className="flex flex-wrap gap-3">
        {[
          { key: "⌘N", label: "BOOK A FLIGHT" },
          { key: "⌘.", label: "DIVERT" },
          { key: "F", label: "PURE MODE" },
        ].map((k) => (
          <div key={k.key} className="flex items-center gap-2">
            <span className="board rounded-lg border border-ink/15 bg-lifted px-3 py-2 font-bold shadow-[0_2px_0_rgba(20,22,26,0.08)]">
              {k.key}
            </span>
            <span className="board-micro text-ink/50">{k.label}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export function Craft() {
  const root = useReveal<HTMLElement>();
  return (
    <section ref={root} data-mood="light" className="bg-paper px-gutter pb-[10vh] text-ink max-md:px-m">
      <div className="mx-auto max-w-[1200px]">
        <p data-reveal className="board-caption text-ink/40">
          CRAFT — THE DETAILS
        </p>
        <h2 data-reveal className="signage signage-md mt-m">
          Built like an airline runs.
        </h2>

        <div className="mt-l">
          {CRAFT.map((c, i) => (
            <div
              key={c.eyebrow}
              data-reveal
              className="hairline-t grid grid-cols-2 items-center gap-xl py-xl max-md:grid-cols-1 max-md:gap-m max-md:py-l"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <p className="board-caption text-ink/40">{c.eyebrow}</p>
                <h3 className="signage signage-sm mt-s">{c.title}</h3>
                <p className="body-text mt-m max-w-[440px] text-ink/60">{c.body}</p>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>{c.vignette}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Closing CTA — a boarding pass with your name on it                 */
/* ---------------------------------------------------------------- */

export function CTABand() {
  const root = useReveal<HTMLElement>();
  return (
    <section ref={root} id="board" data-mood="light" className="bg-paper px-gutter py-[16vh] text-ink max-md:px-m">
      <div
        data-reveal
        className="mx-auto grid w-full max-w-[920px] grid-cols-[1fr_240px] transition-transform duration-300 hover:-translate-y-1 max-md:grid-cols-1"
      >
        <div className="paper-texture relative rounded-l-2xl p-l shadow-[0_24px_60px_rgba(20,22,26,0.14)] max-md:rounded-t-2xl max-md:rounded-bl-none max-md:p-m">
          <span className="absolute inset-y-0 left-0 w-1.5 rounded-l-2xl bg-signal" />
          <div className="flex items-baseline justify-between">
            <p className="board-caption text-ink/50">WINDOWSEAT AIR · NOW BOARDING</p>
            <p className="board-caption text-ink/50">GATE · YOURS</p>
          </div>
          <h2 className="signage signage-md mt-m">Board now.</h2>
          <p className="body-text mt-s max-w-[420px] text-ink/60">
            Bring the next task. WindowSeat will give it a departure, a route, and somewhere
            satisfying to arrive.
          </p>
          {/* TODO: App Store URL */}
          <a
            href="#"
            className="board-sm mt-l inline-block rounded-full bg-signal px-8 py-4 font-bold text-ink transition-transform hover:scale-[1.03]"
          >
            GET WINDOWSEAT
          </a>
          <p className="board-micro mt-m text-ink/40">
            DESIGNED FOR MACOS · FOCUS SESSIONS, FLOWN
          </p>
        </div>
        <div className="paper-texture relative rounded-r-2xl border-l border-dashed border-ink/25 p-m shadow-[0_24px_60px_rgba(20,22,26,0.14)] max-md:rounded-b-2xl max-md:rounded-tr-none max-md:border-l-0 max-md:border-t">
          <p className="board-sm font-bold">TKS → ???</p>
          <p className="board-micro mt-1 text-ink/40">RANDOM DESTINATION AVAILABLE</p>
          <div className="mt-m">
            <p className="board-micro text-ink/40">SEAT</p>
            <p className="board-sm mt-1 font-bold">WINDOW, OBVIOUSLY</p>
          </div>
          <div className="mt-l">
            <Barcode data="WINDOWSEAT MACOS FOCUS FLIGHT" className="h-12 w-full" />
            <p className="board-micro mt-2 text-ink/40">FOCUS SESSIONS, FLOWN.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
