"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitFlap from "@/components/SplitFlap";
import { useLocalTime } from "@/hooks/useLocalTime";
import { BOARD_ROWS, SEAT_CLASS_COLOR, FLIGHT } from "@/lib/flight";

gsap.registerPlugin(ScrollTrigger);

function RowLocalTime({ tz }: { tz: string | null }) {
  const t = useLocalTime(tz ?? "UTC");
  return <span className="board-sm tnum">{tz ? t : "--:--"}</span>;
}

/**
 * The departures board, recreated from the app's own screen, then the
 * booking beat: scrolling picks the WS 214 row and the fare unfolds
 * beneath it — a 50-minute session mapped to a real route.
 */
export default function Departures() {
  const root = useRef<HTMLElement | null>(null);
  const clock = useLocalTime(FLIGHT.origin.tz, true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-board-row]");
        const picked = root.current!.querySelector<HTMLElement>("[data-picked]");
        const others = rows.filter((r) => !r.hasAttribute("data-picked"));
        const fare = root.current!.querySelector<HTMLElement>("[data-fare]");
        const arc = root.current!.querySelector<SVGPathElement>("[data-fare-arc]");

        gsap.set(fare, { height: 0, opacity: 0, overflow: "hidden" });
        if (arc) gsap.set(arc, { strokeDashoffset: 100 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
        // The complete board is visible at the anchor. Scrolling then makes
        // the product interaction legible by selecting the 50-minute row.
        tl.to(others, { opacity: 0.35, duration: 0.1 }, 0.22);
        tl.to(
          picked,
          {
            backgroundColor: "#ffffff",
            boxShadow: "0 12px 32px rgba(20,22,26,0.10)",
            duration: 0.1,
          },
          0.22
        );
        tl.to("[data-picked-bar]", { scaleY: 1, duration: 0.08 }, 0.24);
        tl.to(fare, { height: "auto", opacity: 1, duration: 0.2, ease: "power2.out" }, 0.32);
        if (arc) tl.to(arc, { strokeDashoffset: 0, duration: 0.2 }, 0.4);
        tl.to({}, { duration: 0.24 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="departures" ref={root} data-mood="light" className="pin-section relative h-[190vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden bg-paper px-gutter py-16 text-ink max-md:px-m">
        <div data-board-head>
          <div className="flex items-baseline justify-between max-sm:block">
            <p className="board-caption text-ink/50">
              {FLIGHT.origin.airport} · {FLIGHT.origin.iata}
            </p>
            <p className="board-sm tnum font-bold max-sm:mt-2">
              {FLIGHT.origin.iata} {clock}
            </p>
          </div>
          <div className="mt-s flex items-end justify-between gap-l max-md:block">
            <div>
              <p className="board-micro mb-xs text-ink/40">01 · BOOK YOUR FOCUS SESSION</p>
              <h2 className="signage signage-lg">
                <SplitFlap text="DEPARTURES" className="font-sans" />
              </h2>
            </div>
            <p className="section-deck max-w-[430px] pb-1 text-ink/68 max-md:mt-s">
              Start with the time you want to protect. WindowSeat pairs it with a real route and
              destination, turning an abstract timer into somewhere to arrive.
            </p>
          </div>

          <div className="board-caption mt-l grid grid-cols-[110px_1fr_130px_110px_70px_90px_110px] gap-4 pb-3 text-ink/40 max-lg:grid-cols-[90px_1fr_90px_110px] max-md:grid-cols-[80px_1fr_100px] max-sm:grid-cols-[64px_minmax(0,1fr)_76px] max-sm:gap-2">
            <span>FLIGHT</span>
            <span>DESTINATION</span>
            <span className="max-lg:hidden">ROUTE</span>
            <span className="max-md:hidden">CLASS</span>
            <span className="max-lg:hidden">LOCAL</span>
            <span className="max-lg:hidden">DURATION</span>
            <span className="text-right">REMARKS</span>
          </div>
        </div>

        <div className="hairline-t">
          {BOARD_ROWS.map((row) => (
            <div key={row.flight + row.dest}>
              <div
                data-board-row
                {...(row.picked ? { "data-picked": "" } : {})}
                className={`relative grid grid-cols-[110px_1fr_130px_110px_70px_90px_110px] items-center gap-4 py-4 max-lg:grid-cols-[90px_1fr_90px_110px] max-md:grid-cols-[80px_1fr_100px] max-sm:grid-cols-[64px_minmax(0,1fr)_76px] max-sm:gap-2 ${
                  row.standby ? "bg-lifted" : ""
                } ${
                  row.picked
                    ? "row-shimmer max-lg:bg-lifted max-lg:shadow-[0_10px_28px_rgba(20,22,26,0.08)]"
                    : ""
                } hairline-b`}
              >
                {(row.picked || row.standby) && (
                  <span
                    data-picked-bar={row.picked ? "" : undefined}
                    className={`absolute inset-y-0 left-0 w-1 origin-bottom bg-signal ${
                      row.picked ? "scale-y-0 max-lg:scale-y-100" : ""
                    }`}
                  />
                )}
                <span className="min-w-0 pl-2">
                  <span className="board-sm tnum block font-bold">{row.flight}</span>
                  <span className="board-micro text-ink/40">GATE {row.gate}</span>
                </span>
                <span className="min-w-0">
                  <span className="board block font-bold">
                    <SplitFlap text={row.dest} />
                  </span>
                  <span className="board-micro block truncate text-ink/50">
                    {row.sub}
                    {row.newStamp && (
                      <span className="ml-2 inline-flex items-center gap-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
                        NEW STAMP
                      </span>
                    )}
                  </span>
                </span>
                <span className="board-sm max-lg:hidden">{row.route}</span>
                <span className="flex items-center gap-2 max-md:hidden">
                  <span
                    className="inline-block h-2 w-2 rounded-[3px]"
                    style={{ background: SEAT_CLASS_COLOR[row.seatClass] }}
                  />
                  <span className="board-micro text-ink/70">{row.seatClass}</span>
                </span>
                <span className="max-lg:hidden">
                  <RowLocalTime tz={row.tz} />
                </span>
                <span className="board-sm tnum max-lg:hidden">{row.duration}</span>
                <span
                  className={`board-status text-right max-sm:text-[10px] ${
                    row.remark === "BOARDING"
                      ? "text-boarding"
                      : row.standby
                        ? "text-ink/40"
                        : "text-ink/60"
                  }`}
                >
                  {row.remark}
                </span>
              </div>

              {/* The fare unfolds under the picked row */}
              {row.picked && (
                <div data-fare className="hairline-b">
                  <div className="grid grid-cols-[180px_1fr_auto] items-center gap-l px-2 py-s max-md:grid-cols-1 max-md:gap-s">
                    <svg viewBox="0 0 220 80" className="w-full max-w-[180px] max-md:hidden" aria-hidden="true">
                      <path
                        data-fare-arc
                        pathLength={100}
                        d="M18 62 Q110 8 202 46"
                        fill="none"
                        stroke="var(--color-ink)"
                        strokeWidth="1.5"
                        strokeDasharray="100"
                        strokeDashoffset="100"
                      />
                      <circle cx="18" cy="62" r="4" fill="var(--color-ink)" />
                      <circle cx="202" cy="46" r="4" fill="var(--color-signal)" stroke="var(--color-ink)" />
                      <text x="18" y="78" textAnchor="middle" className="fill-ink/60" style={{ font: "600 9px ui-monospace, monospace", letterSpacing: 1 }}>
                        TKS
                      </text>
                      <text x="202" y="34" textAnchor="middle" className="fill-ink" style={{ font: "600 9px ui-monospace, monospace", letterSpacing: 1 }}>
                        HND
                      </text>
                    </svg>
                    <div>
                      <p className="board-caption text-ink/50">
                        A 50-MINUTE SESSION BOOKS A REAL ROUTE
                      </p>
                      <p className="signage signage-sm mt-1">
                        TOKYO HANEDA · {FLIGHT.minutes} MIN
                      </p>
                    </div>
                    <div className="text-right max-md:text-left">
                      <p className="board-sm tnum">
                        {FLIGHT.km} KM · {FLIGHT.mi} MI
                      </p>
                      <p className="board-micro mt-1 flex items-center justify-end gap-1.5 text-ink/60 max-md:justify-start">
                        <span className="inline-block h-2 w-2 rounded-[3px] bg-seatwork" />
                        WORK CLASS · {FLIGHT.number}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="board-caption mt-m text-ink/40">
          IN THE APP, THIS BOARD IS LIVE · CHOOSE A ROUTE OR START FROM SCRATCH
        </p>
      </div>
    </section>
  );
}
