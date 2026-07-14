"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitFlap from "@/components/SplitFlap";
import { FLIGHT } from "@/lib/flight";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { label: "TASK", value: FLIGHT.task },
  { label: "FOCUS TIME", value: `${FLIGHT.minutes} MIN` },
  { label: "ROUTE", value: `${FLIGHT.origin.iata} → ${FLIGHT.dest.iata}` },
  { label: "DISTANCE", value: `+${FLIGHT.mi} MI` },
];

export default function Landing() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
        tl.from("[data-landing-title]", { y: 12, duration: 0.1 }, 0.05);
        tl.from(
          "[data-landing-card]",
          { opacity: 0, y: 40, duration: 0.15, ease: "power2.out" },
          0.35
        );
        tl.from(
          "[data-landing-stat]",
          { opacity: 0, y: 10, stagger: 0.03, duration: 0.06 },
          0.45
        );
        tl.to({}, { duration: 0.25 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-mood="dark" className="pin-section relative h-[150vh]">
      <div className="bg-night-grad sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-gutter max-md:px-m">
        {/* dawn at the horizon — arrival light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[40vh]"
          style={{
            background:
              "radial-gradient(70% 90% at 50% 100%, rgba(255,150,90,0.16), transparent 70%)",
          }}
        />
        <div data-landing-title className="text-center">
          <p className="board-caption mb-s text-instrument">04 · FINISH THE SESSION</p>
          <div className="flex items-center justify-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-boarding" aria-hidden="true" />
            <SplitFlap text="SAFE LANDING" className="board-display text-starlight" />
          </div>
          <p className="body-sm mx-auto mt-m max-w-[520px] text-starlight/60">
            Landing closes the loop: the time is complete, the route is recorded, and your
            progress has somewhere to live.
          </p>
        </div>

        <div
          data-landing-card
          className="glass mt-xl w-full max-w-[760px] rounded-2xl p-l max-md:p-m"
        >
          <p className="board-caption text-starlight/50">
            ARRIVAL CARD · {FLIGHT.dest.airport} {FLIGHT.dest.city}
          </p>
          <div className="mt-m grid grid-cols-4 gap-m max-md:grid-cols-2">
            {STATS.map((s) => (
              <div key={s.label} data-landing-stat>
                <p className="board-micro text-starlight/50">{s.label}</p>
                <p className="board tnum mt-1 font-bold text-instrument">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
