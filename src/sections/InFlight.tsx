"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLIGHT, gcPathD, formatCountdown } from "@/lib/flight";

gsap.registerPlugin(ScrollTrigger);

/* Deterministic star field — same output on server and client. */
const STARS = (() => {
  let seed = 214;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  return Array.from({ length: 70 }, () => ({
    x: rnd() * 100,
    y: rnd() * 100,
    s: rnd() < 0.8 ? 1 : 2,
    o: 0.15 + rnd() * 0.5,
  }));
})();

const FLIGHT_SECONDS = FLIGHT.minutes * 60;

function StarField() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {STARS.map((st, i) => (
        <i
          key={i}
          className="absolute rounded-full bg-starlight"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            opacity: st.o,
          }}
        />
      ))}
    </div>
  );
}

/**
 * The in-flight beat: the real TKS → HND great-circle drawn in route cyan,
 * a plane scrubbed along it, glass HUD capsules at the edges and the big
 * amber Instrument countdown — all numbers tabular so nothing shifts.
 * DOM is authored at the halfway point so reduced-motion reads complete.
 */
export default function InFlight() {
  const root = useRef<HTMLElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const planeRef = useRef<SVGGElement | null>(null);
  const countdownRef = useRef<HTMLParagraphElement | null>(null);
  const distRef = useRef<HTMLParagraphElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const drawn = root.current!.querySelector<SVGPathElement>("[data-arc-drawn]");
        const apply = (fp: number) => {
          if (drawn) drawn.style.strokeDashoffset = String(100 - fp * 100);
          if (countdownRef.current)
            countdownRef.current.textContent = formatCountdown(FLIGHT_SECONDS * (1 - fp));
          if (distRef.current)
            distRef.current.textContent = `${Math.round(FLIGHT.km * (1 - fp))} KM · ${Math.round(
              FLIGHT.mi * (1 - fp)
            )} MI`;
          if (barRef.current) barRef.current.style.width = `${fp * 100}%`;
          const path = pathRef.current;
          const plane = planeRef.current;
          if (path && plane) {
            const len = path.getTotalLength();
            const at = Math.max(0.001, Math.min(0.999, fp));
            const pt = path.getPointAtLength(len * at);
            const ahead = path.getPointAtLength(Math.min(len, len * at + 4));
            const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
            plane.setAttribute("transform", `translate(${pt.x},${pt.y}) rotate(${angle})`);
          }
        };

        const state = { fp: 0 };
        apply(0);
        gsap.set("[data-captain]", { opacity: 0, y: -12 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
        // Takeoff camera push
        tl.fromTo(
          "[data-flight-stage]",
          { scale: 1.06 },
          { scale: 1, duration: 0.1, ease: "power2.out" },
          0
        );
        tl.to("[data-flight-intro]", { opacity: 0, y: -10, duration: 0.08 }, 0.24);
        tl.from(
          "[data-hud]",
          { opacity: 0, y: 16, stagger: 0.02, duration: 0.06 },
          0.03
        );
        tl.to(
          state,
          { fp: 1, duration: 0.85, ease: "none", onUpdate: () => apply(state.fp) },
          0.1
        );
        // Captain's announcement at the halfway mark
        tl.to("[data-captain]", { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" }, 0.5);
        tl.to("[data-captain]", { opacity: 0, y: -12, duration: 0.05 }, 0.75);
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="in-flight" ref={root} data-mood="dark" className="pin-section relative h-[200vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden max-lg:bg-nighttop">
        <div data-flight-stage className="bg-night-grad-flip absolute inset-0 max-lg:hidden">
          {/* Stars */}
          <StarField />

          <div
            data-flight-intro
            className="glass absolute left-1/2 top-24 z-10 w-[min(560px,88vw)] -translate-x-1/2 rounded-2xl border-instrument/25 px-6 py-4 max-md:top-44"
          >
            <p className="board-caption text-instrument">03 · FOCUS IN FLIGHT</p>
            <p className="section-deck mt-2 text-starlight/78">
              The countdown becomes a live route. Keep working while the plane advances; the
              menu bar can keep the flight visible when WindowSeat is in the background.
            </p>
          </div>

          {/* The route — real great-circle, projected */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 1000 520" className="w-[min(1150px,96vw)]" aria-hidden="true">
              {/* full route, faint dashes */}
              <path
                d={gcPathD()}
                fill="none"
                stroke="var(--color-starlight)"
                strokeOpacity="0.22"
                strokeWidth="1.5"
                strokeDasharray="3 9"
              />
              {/* traveled portion */}
              <path
                ref={pathRef}
                data-arc-drawn
                d={gcPathD()}
                pathLength={100}
                fill="none"
                stroke="var(--color-route)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="100"
                style={{
                  strokeDashoffset: 50,
                  filter: "drop-shadow(0 0 7px rgba(90,200,250,0.65))",
                }}
              />
              {/* origin + destination */}
              <circle cx="140" cy="420" r="5" fill="var(--color-starlight)" fillOpacity="0.6" />
              <text
                x="140"
                y="448"
                textAnchor="middle"
                fill="var(--color-starlight)"
                fillOpacity="0.7"
                style={{ font: "600 12px ui-monospace, monospace", letterSpacing: 2 }}
              >
                TKS
              </text>
              <circle cx="859.9" cy="180" r="5" fill="var(--color-instrument)" />
              <text
                x="859.9"
                y="160"
                textAnchor="middle"
                fill="var(--color-instrument)"
                style={{ font: "600 12px ui-monospace, monospace", letterSpacing: 2 }}
              >
                HND
              </text>
              {/* the plane */}
              <g ref={planeRef} transform="translate(519.4,287.9) rotate(-18)">
                <polygon
                  points="10,0 -6,5 -3,0 -6,-5"
                  fill="var(--color-route)"
                  style={{ filter: "drop-shadow(0 0 6px rgba(90,200,250,0.9))" }}
                />
              </g>
            </svg>
          </div>

          {/* HUD — glass capsules pinned to the edges, center stays clear */}
          <div
            data-hud
            className="glass absolute left-10 top-24 rounded-2xl px-5 py-4 max-md:left-4 max-md:top-20"
          >
            <p className="board-sm tnum font-bold text-starlight">{FLIGHT.number}</p>
            <p className="board-sm mt-1 text-starlight">
              <span className="text-instrument">●</span> {FLIGHT.origin.iata} →{" "}
              {FLIGHT.dest.iata}
            </p>
            <p className="board-caption mt-1 text-starlight/60">TASK · {FLIGHT.task}</p>
            <p className="board-caption mt-1 text-boarding">● CABIN MODE ON</p>
          </div>

          <div data-hud className="absolute right-10 top-24 text-right max-md:right-4 max-md:top-20">
            <p className="board font-bold tracking-[3px] text-instrument">CRUISE</p>
            <p className="board-caption tnum mt-1 text-starlight/60">FL370 · 37,000 FT</p>
          </div>

          {/* Captain's announcement */}
          <div
            data-captain
            className="glass absolute left-1/2 top-24 w-[min(560px,88vw)] -translate-x-1/2 rounded-2xl border-instrument/25 px-6 py-4 opacity-0 max-md:top-44"
          >
            <p className="board-caption text-instrument">FLIGHT DECK · CAPTAIN</p>
            <p className="body-text mt-1 text-starlight">Halfway to HND.</p>
          </div>

          <div
            data-hud
            className="glass absolute bottom-10 left-10 rounded-2xl px-5 py-4 max-md:bottom-52 max-md:left-4"
          >
            <p className="board-caption text-starlight/60">DISTANCE TO GO</p>
            <p ref={distRef} className="board tnum mt-1 text-starlight">
              249 KM · 155 MI
            </p>
          </div>

          {/* The countdown — the Instrument role */}
          <div
            data-hud
            className="glass absolute bottom-10 left-1/2 w-[min(420px,90vw)] -translate-x-1/2 rounded-2xl px-8 py-5 text-center max-md:bottom-4"
          >
            <div className="h-0.5 w-full overflow-hidden rounded-full bg-starlight/15">
              <div ref={barRef} className="h-full bg-route" style={{ width: "50%" }} />
            </div>
            <p
              ref={countdownRef}
              className="instrument tnum mt-3 text-[clamp(44px,6vw,64px)] leading-none text-instrument"
            >
              00:25:00
            </p>
            <p className="board-caption mt-2 text-starlight/60">
              TO {FLIGHT.dest.iata} · {FLIGHT.dest.airport} {FLIGHT.dest.city}
            </p>
          </div>

          {/* HUD pill controls, as in the app */}
          <div
            data-hud
            className="absolute bottom-10 right-10 flex gap-2 max-md:hidden"
            aria-hidden="true"
          >
            {["WINDOW SEAT", "AUDIO", "PURE"].map((b) => (
              <span key={b} className="glass rounded-full px-4 py-2">
                <span className="board-caption text-starlight/85">{b}</span>
              </span>
            ))}
            <span className="glass rounded-full border-turbulence/40 px-4 py-2">
              <span className="board-caption text-turbulence">DIVERT</span>
            </span>
          </div>
        </div>

        {/* Phones and tablets get the complete instrument panel in natural
            reading order. The desktop stage above remains the scrubbed scene. */}
        <div className="bg-night-grad-flip relative hidden overflow-hidden px-gutter py-24 text-starlight max-lg:block max-md:px-m max-md:py-20">
          <StarField />
          <div className="relative z-10 mx-auto max-w-[900px]">
            <div className="flex items-start justify-between gap-m border-b border-starlight/15 pb-m">
              <div>
                <p className="board-caption text-instrument">03 · FOCUS IN FLIGHT</p>
                <p className="board-micro mt-2 text-starlight/65">LIVE ROUTE / CABIN MODE ON</p>
              </div>
              <div className="text-right">
                <p className="board-sm font-bold tracking-[2px] text-instrument">CRUISE</p>
                <p className="board-micro tnum mt-1 text-starlight/65">FL370 · 37,000 FT</p>
              </div>
            </div>

            <div className="mt-l grid grid-cols-[220px_1fr] gap-l max-md:grid-cols-1 max-md:gap-m">
              <div className="glass rounded-2xl p-m">
                <p className="board-sm tnum font-bold">{FLIGHT.number}</p>
                <p className="board mt-2">
                  <span className="text-instrument">●</span> {FLIGHT.origin.iata} → {FLIGHT.dest.iata}
                </p>
                <div className="mt-m border-t border-starlight/15 pt-m">
                  <p className="board-micro text-starlight/65">TASK</p>
                  <p className="board-sm mt-1">{FLIGHT.task}</p>
                  <p className="board-micro mt-m text-boarding">● CABIN MODE ON</p>
                </div>
              </div>
              <div className="self-center">
                <h2 className="text-[clamp(32px,5vw,54px)] font-semibold leading-[1.02] tracking-[-0.04em]">
                  Your focus becomes a route you can watch move.
                </h2>
                <p className="section-deck mt-m max-w-[620px] text-starlight/72">
                  Keep working in any app while the aircraft and countdown advance. WindowSeat
                  keeps the flight visible without asking you to keep the main window open.
                </p>
              </div>
            </div>

            <div className="relative mt-l overflow-hidden border-y border-starlight/15 py-m">
              <svg viewBox="0 0 1000 520" className="w-full" aria-hidden="true">
                <path
                  d={gcPathD()}
                  fill="none"
                  stroke="var(--color-starlight)"
                  strokeOpacity="0.22"
                  strokeWidth="2"
                  strokeDasharray="4 12"
                />
                <path
                  d={gcPathD()}
                  pathLength={100}
                  fill="none"
                  stroke="var(--color-route)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  strokeDashoffset="50"
                  style={{ filter: "drop-shadow(0 0 7px rgba(90,200,250,0.65))" }}
                />
                <circle cx="140" cy="420" r="7" fill="var(--color-starlight)" fillOpacity="0.65" />
                <text
                  x="140"
                  y="460"
                  textAnchor="middle"
                  fill="var(--color-starlight)"
                  fillOpacity="0.7"
                  style={{ font: "600 18px ui-monospace, monospace", letterSpacing: 3 }}
                >
                  TKS
                </text>
                <circle cx="859.9" cy="180" r="7" fill="var(--color-instrument)" />
                <text
                  x="859.9"
                  y="140"
                  textAnchor="middle"
                  fill="var(--color-instrument)"
                  style={{ font: "600 18px ui-monospace, monospace", letterSpacing: 3 }}
                >
                  HND
                </text>
                <g transform="translate(519.4,287.9) rotate(-18)">
                  <polygon
                    points="16,0 -9,8 -4,0 -9,-8"
                    fill="var(--color-route)"
                    style={{ filter: "drop-shadow(0 0 8px rgba(90,200,250,0.9))" }}
                  />
                </g>
              </svg>
            </div>

            <div className="mt-l grid grid-cols-[1fr_1.5fr] gap-m max-sm:grid-cols-1">
              <div className="glass rounded-2xl p-m">
                <p className="board-micro text-starlight/65">DISTANCE TO GO</p>
                <p className="board tnum mt-2">249 KM · 155 MI</p>
              </div>
              <div className="glass rounded-2xl p-m text-center">
                <div className="h-0.5 overflow-hidden rounded-full bg-starlight/15">
                  <div className="h-full w-1/2 bg-route" />
                </div>
                <p className="instrument tnum mt-3 text-[clamp(46px,10vw,72px)] leading-none text-instrument">
                  00:25:00
                </p>
                <p className="board-caption mt-2 text-starlight/65">
                  TO {FLIGHT.dest.iata} · {FLIGHT.dest.airport} {FLIGHT.dest.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
