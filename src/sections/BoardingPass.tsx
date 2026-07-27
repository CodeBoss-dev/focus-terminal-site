"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Barcode from "@/components/Barcode";
import { useFlightTimes } from "@/hooks/useLocalTime";
import { FLIGHT } from "@/lib/flight";

gsap.registerPlugin(ScrollTrigger);

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="board-micro text-ink/60">{label}</p>
      <p className="board-sm tnum mt-1 font-bold">{value}</p>
    </div>
  );
}

/**
 * The one deliberate card in the whole system: a printed object with paper
 * texture, a perforation, and a barcode rendered from the flight data.
 * Scrolling on tears it in two — the commitment ritual.
 */
export default function BoardingPass() {
  const root = useRef<HTMLElement | null>(null);
  const times = useFlightTimes(FLIGHT.origin.tz, FLIGHT.minutes);

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
        tl.from("[data-pass-eyebrow]", { opacity: 0, y: 16, duration: 0.06 }, 0.02);
        tl.from(
          "[data-pass-wrap]",
          { opacity: 0, y: 80, scale: 0.97, duration: 0.12, ease: "power2.out" },
          0.05
        );
        tl.from(
          "[data-pass-field]",
          { opacity: 0, y: 10, stagger: 0.012, duration: 0.05 },
          0.14
        );
        // hold, then the tear
        tl.to(
          "[data-pass-main]",
          { rotation: -5, xPercent: -9, yPercent: -7, duration: 0.22, ease: "power2.inOut" },
          0.55
        );
        tl.to(
          "[data-pass-stub]",
          { rotation: 8, xPercent: 26, yPercent: 22, duration: 0.22, ease: "power2.inOut" },
          0.55
        );
        tl.from("[data-tear-caption]", { opacity: 0, y: 14, duration: 0.08 }, 0.62);
        tl.to({}, { duration: 0.12 }); // settle
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-mood="light" className="pin-section relative h-[190vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-paper px-gutter py-16 text-ink max-lg:py-24 max-md:px-m">
        <div data-pass-eyebrow className="mb-l text-center max-sm:mb-m">
          <p className="board-caption text-ink/60">02 · BOARD WITH AN INTENTION</p>
          <p className="section-deck mx-auto mt-s max-w-[620px] text-ink/68">
            Choose one task. Focus Terminal turns the next {FLIGHT.minutes} minutes into a flight you
            can finish.
          </p>
        </div>

        <div data-pass-wrap className="grid w-full max-w-[920px] grid-cols-[1fr_240px] max-md:grid-cols-1">
          {/* Main piece */}
          <div
            data-pass-main
            className="paper-texture relative rounded-l-2xl p-l shadow-[0_24px_60px_rgba(20,22,26,0.12)] max-md:rounded-t-2xl max-md:rounded-bl-none max-md:p-m"
          >
            <span className="absolute inset-y-0 left-0 w-1.5 rounded-l-2xl bg-signal" />
            <div className="flex items-baseline justify-between" data-pass-field>
              <p className="board-caption text-ink/60">FOCUS TERMINAL AIR</p>
              <p className="board-caption tnum text-ink/60">{times.date}</p>
            </div>
            <p className="signage signage-md mt-m" data-pass-field>
              {FLIGHT.origin.iata} <span className="font-light text-ink/40">→</span>{" "}
              {FLIGHT.dest.iata}
            </p>
            <div className="mt-1 flex items-baseline justify-between" data-pass-field>
              <p className="board-micro text-ink/60">{FLIGHT.origin.city}</p>
              <p className="board-micro text-ink/60">
                {FLIGHT.origin.iata} → {FLIGHT.dest.iata}
              </p>
            </div>
            <div className="mt-l grid grid-cols-4 gap-m max-md:grid-cols-2" data-pass-field>
              <Field label="FLIGHT" value={FLIGHT.number} />
              <Field label="GATE" value={FLIGHT.gate} />
              <Field label="SEAT" value={FLIGHT.seat} />
              <Field label="CABIN" value={FLIGHT.cabin} />
            </div>
            <div className="mt-m grid grid-cols-4 gap-m max-md:grid-cols-2" data-pass-field>
              <Field label="DEPARTS" value={times.depart} />
              <Field label="ARRIVES" value={`${times.arrive} LOCAL`} />
              <Field label="FOCUS TIME" value={`${FLIGHT.minutes} MIN`} />
              <Field label="MILES" value={`${FLIGHT.mi} MI`} />
            </div>
            <div className="mt-m" data-pass-field>
              <Field label="TASK" value={FLIGHT.task} />
            </div>
          </div>

          {/* Stub — separated by the perforation */}
          <div
            data-pass-stub
            className="paper-texture relative rounded-r-2xl border-l border-dashed border-ink/25 p-m shadow-[0_24px_60px_rgba(20,22,26,0.12)] max-md:rounded-b-2xl max-md:rounded-tr-none max-md:border-l-0 max-md:border-t"
          >
            <p className="board-sm font-bold" data-pass-field>
              {FLIGHT.origin.iata} → {FLIGHT.dest.iata}
            </p>
            <div className="mt-m space-y-s" data-pass-field>
              <Field label="FLIGHT" value={FLIGHT.number} />
              <Field label="SEAT" value={FLIGHT.seat.split(" ")[0]} />
            </div>
            <div className="mt-l" data-pass-field>
              <Barcode className="h-12 w-full" />
              <p className="board-micro tnum mt-2 text-ink/60">
                {FLIGHT.number.replace(" ", "-")} · {FLIGHT.minutes} MIN ·{" "}
                {FLIGHT.origin.iata}
                {FLIGHT.dest.iata}
              </p>
            </div>
          </div>
        </div>

        <p data-tear-caption className="board-caption mt-xl text-ink/60">
          THE TEAR IS THE COMMITMENT — ONCE IT&apos;S TORN, YOU&apos;RE FLYING
        </p>
      </div>
    </section>
  );
}
