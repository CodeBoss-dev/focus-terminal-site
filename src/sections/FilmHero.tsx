"use client";

import { useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";

const STARS = (() => {
  let seed = 181;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  return Array.from({ length: 54 }, () => ({
    x: random() * 100,
    y: random() * 100,
    size: random() > 0.84 ? 2 : 1,
    opacity: 0.12 + random() * 0.36,
  }));
})();

export default function FilmHero() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open]);

  return (
    <section
      id="film"
      data-mood="dark"
      className="bg-night-grad relative flex min-h-[100svh] flex-col overflow-hidden px-gutter pb-10 pt-8 max-md:px-m max-md:pb-8"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {STARS.map((star, index) => (
          <i
            key={index}
            className="absolute rounded-full bg-starlight"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div aria-hidden="true" className="flight-grid pointer-events-none absolute inset-0" />

      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between border-b border-starlight/15 pb-4">
        <p className="board-caption flex items-center gap-2 text-starlight/65">
          <BrandMark size={26} priority />
          <span>WINDOWSEAT</span>
          <span className="max-sm:hidden"> / FLIGHT CONTROL</span>
        </p>
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 border-l border-starlight/15 pl-5 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-starlight/25 text-[10px] text-starlight transition-colors group-hover:border-instrument group-hover:text-instrument">
            ▶
          </span>
          <span>
            <span className="board-micro block text-starlight/40 max-sm:hidden">00:50 · SOUND ON</span>
            <span className="board-caption text-starlight">WATCH THE FILM</span>
          </span>
        </button>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-12 items-center gap-6 py-12 max-lg:py-20 max-md:grid-cols-1 max-md:gap-10 max-md:pb-20 max-md:pt-16">
        <div className="col-span-9 max-xl:col-span-8 max-md:col-span-1">
          <p className="board-caption mb-6 text-instrument">NEXT DEPARTURE · WHEN YOU&apos;RE READY</p>
          <h1 className="hero-display text-starlight">
            <span className="block">YOUR NEXT</span>
            <span className="block">HOUR HAS</span>
            <span className="block">SOMEWHERE</span>
            <span className="block text-instrument">TO GO.</span>
          </h1>
        </div>

        <aside className="col-span-3 self-end border-l border-starlight/15 pb-4 pl-6 max-xl:col-span-4 max-md:col-span-1 max-md:border-l-0 max-md:border-t max-md:pb-0 max-md:pl-0 max-md:pt-6">
          <p className="board-micro text-starlight/40">FLIGHT PLAN / WS 214</p>
          <p className="instrument tnum mt-3 text-[clamp(48px,5vw,76px)] leading-none text-starlight">
            50:00
          </p>
          <div className="mt-5 grid grid-cols-2 gap-y-4 border-y border-starlight/15 py-4">
            <div>
              <p className="board-micro text-starlight/35">TASK</p>
              <p className="board-sm mt-1 text-starlight">DEEP WORK</p>
            </div>
            <div>
              <p className="board-micro text-starlight/35">ROUTE</p>
              <p className="board-sm mt-1 text-starlight">TKS → HND</p>
            </div>
            <div>
              <p className="board-micro text-starlight/35">CABIN</p>
              <p className="board-sm mt-1 text-boarding">READY</p>
            </div>
            <div>
              <p className="board-micro text-starlight/35">SEAT</p>
              <p className="board-sm mt-1 text-starlight">WINDOW</p>
            </div>
          </div>
          <p className="body-sm mt-5 text-starlight/60">
            WindowSeat turns time you mean to protect into a flight you want to finish.
          </p>
          <a
            href="#briefing"
            className="board-caption mt-6 inline-flex items-center gap-3 bg-signal px-5 py-3 font-bold text-ink transition-[gap] hover:gap-5"
          >
            BOARD THE STORY <span aria-hidden="true">↓</span>
          </a>
        </aside>

        <div className="hero-route pointer-events-none absolute inset-x-0 bottom-[8%] -z-10 max-md:hidden" aria-hidden="true">
          <svg viewBox="0 0 1200 500" className="w-full overflow-visible">
            <path
              d="M40 448 C 290 430, 430 305, 615 288 S 910 185, 1160 70"
              fill="none"
              stroke="var(--color-starlight)"
              strokeOpacity="0.18"
              strokeWidth="1.5"
              strokeDasharray="4 12"
            />
            <path
              className="route-draw"
              d="M40 448 C 290 430, 430 305, 615 288 S 910 185, 1160 70"
              pathLength="100"
              fill="none"
              stroke="var(--color-route)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="40" cy="448" r="6" fill="var(--color-starlight)" />
            <circle cx="1160" cy="70" r="6" fill="var(--color-instrument)" />
          </svg>
        </div>
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] items-end justify-between gap-8 border-t border-starlight/15 pt-4">
        <div className="flex gap-10">
          <div className="max-sm:hidden">
            <p className="board-micro text-starlight/30">ORIGIN</p>
            <p className="board-caption mt-1 text-starlight">TKS · TOKUSHIMA</p>
          </div>
          <div>
            <p className="board-micro text-starlight/30">DESTINATION</p>
            <p className="board-caption mt-1 text-instrument">HND · HANEDA</p>
          </div>
        </div>
        <p className="board-caption shrink-0 text-starlight/45">SCROLL / PUSH BACK ↓</p>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-nighttop/90 p-m backdrop-blur-md"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="WindowSeat film"
        >
          <div className="w-[min(1100px,94vw)]" onClick={(event) => event.stopPropagation()}>
            <video
              src="film/windowseat-ad.mp4"
              controls
              autoPlay
              playsInline
              className="w-full rounded-xl shadow-2xl"
            />
            <div className="mt-s flex items-center justify-between">
              <p className="board-caption text-starlight/60">WINDOWSEAT — THE FILM · 50 SEC</p>
              <button onClick={() => setOpen(false)} className="glass px-4 py-2" autoFocus>
                <span className="board-caption text-starlight">CLOSE ✕</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
