"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Stamp from "@/components/Stamp";
import { useFlightTimes } from "@/hooks/useLocalTime";
import { FLIGHT } from "@/lib/flight";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_STATS = [
  { label: "COUNTRIES", value: "1" },
  { label: "LIFETIME MILES", value: `${FLIGHT.mi}`, suffix: "MI" },
  { label: "FLIGHTS", value: "1" },
];

/**
 * Beat 9 + 10: the stamp thunks in, and terminal light returns —
 * the second mood crossfade, landing on the passport's paper page.
 */
export default function PassportStamp() {
  const root = useRef<HTMLElement | null>(null);
  const times = useFlightTimes(FLIGHT.origin.tz, 0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
        // The heading is deliberately visible at progress 0 so menu/deep-link
        // navigation never lands on an empty transition frame.
        tl.from("[data-passport-head]", { y: 18, duration: 0.1 }, 0.04);
        tl.from(
          "[data-passport-stat]",
          { y: 10, stagger: 0.03, duration: 0.06 },
          0.1
        );
        // The stamp: scale-down thunk…
        tl.fromTo(
          "[data-stamp]",
          { opacity: 0, scale: 1.7, rotation: -2 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.12, ease: "power4.in" },
          0.28
        );
        // …then the ink bleed blooms for a beat
        tl.fromTo(
          "[data-stamp-bleed]",
          { opacity: 0 },
          { opacity: 0.55, duration: 0.04 },
          0.4
        ).to("[data-stamp-bleed]", { opacity: 0.18, duration: 0.1 }, 0.46);
        tl.from("[data-stamp-teaser]", { opacity: 0, y: 16, duration: 0.1 }, 0.48);
        tl.to({}, { duration: 0.2 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="passport" ref={root} data-mood="light" className="pin-section relative h-[170vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden bg-paper px-gutter py-16 text-ink max-lg:py-24 max-md:px-m">
        <div data-passport-head className="flex items-end justify-between gap-l max-md:block">
          <div>
            <p className="board-caption text-ink/50">
              ISSUED AT {FLIGHT.origin.airport} · {FLIGHT.origin.iata}
            </p>
            <p className="board-micro mt-s text-ink/40">05 · KEEP THE JOURNEY</p>
            <h2 className="signage signage-lg mt-xs">PASSPORT</h2>
          </div>
          <p className="section-deck max-w-[460px] pb-1 text-ink/68 max-md:mt-s">
            Each completed focus flight is logged by route, time, and distance. Reach a new
            country and its stamp joins your passport.
          </p>
        </div>

        <div className="mt-l flex flex-wrap items-start justify-between gap-l">
          <div className="flex gap-xl max-md:gap-l max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-l max-sm:gap-y-m">
            {HEADLINE_STATS.map((s) => (
              <div key={s.label} data-passport-stat>
                <p className="board-caption text-ink/40">{s.label}</p>
                <p className="signage signage-sm tnum mt-1">
                  {s.value}
                  {s.suffix && (
                    <span className="board-caption ml-1 align-super text-ink/40">{s.suffix}</span>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* The fresh stamp — pressed by your first landing */}
          <div className="relative h-[220px] w-[220px] max-md:mx-auto">
            <div data-stamp className="absolute inset-0">
              <Stamp
                code="JP"
                country="JAPAN"
                date={times.date}
                fresh
                className="h-full w-full"
              />
            </div>
            <div data-stamp-bleed className="absolute inset-0 opacity-0 blur-[6px]" aria-hidden="true">
              <Stamp code="JP" country="JAPAN" date={times.date} fresh className="h-full w-full" />
            </div>
          </div>
        </div>

        <div data-stamp-teaser className="hairline-t mt-l pt-m">
          <p className="board-caption text-ink/40">STAMPS · COUNTRIES VISITED — ROOM FOR MORE</p>
          <div className="mt-s flex items-center gap-l max-md:grid max-md:grid-cols-3 max-md:items-start max-md:gap-m max-sm:gap-s">
            {[
              { code: "KR", name: "SOUTH KOREA" },
              { code: "TW", name: "TAIWAN" },
              { code: "??", name: "ANYWHERE" },
            ].map((s) => (
              <div key={s.code} className="flex flex-col items-center gap-2">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-ink/25">
                  <span className="board-sm text-ink/30">{s.code}</span>
                </span>
                <span className="board-micro text-ink/30 max-md:text-center">{s.name}</span>
              </div>
            ))}
            <p className="board-caption ml-auto text-ink/40 max-md:hidden">
              ECONOMY → PREMIUM → BUSINESS → FIRST · 40,000 MI TO FIRST
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
