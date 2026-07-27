"use client";

import { useEffect, useRef, useState } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const filmTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const filmTrigger = filmTriggerRef.current;
    const previousOverflow = document.body.style.overflow;

    if (dialog && !dialog.open) dialog.showModal();
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";

    return () => {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
      requestAnimationFrame(() => filmTrigger?.focus());
    };
  }, [open]);

  return (
    <section
      id="film"
      data-mood="dark"
      className="bg-night-grad relative flex min-h-[100svh] flex-col overflow-hidden px-gutter pb-10 pt-8 max-md:px-m max-md:pb-8 max-sm:pt-5"
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
          ref={filmTriggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 border-l border-starlight/15 pl-5 text-left max-lg:min-h-11"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-starlight/25 text-[10px] text-starlight transition-colors group-hover:border-instrument group-hover:text-instrument">
            ▶
          </span>
          <span>
            <span className="board-micro block text-starlight/65 max-sm:hidden">00:50 · SOUND ON</span>
            <span className="board-caption text-starlight">WATCH THE FILM</span>
          </span>
        </button>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-12 items-center gap-6 py-12 max-lg:grid-cols-1 max-lg:gap-10 max-lg:py-20 max-md:pb-20 max-md:pt-16">
        <div className="col-span-9 max-xl:col-span-8 max-lg:col-span-1">
          <p className="mb-6 text-[clamp(16px,1.35vw,20px)] font-semibold tracking-[-0.01em] text-instrument">
            Native Mac focus app <span className="text-starlight/65">· macOS 14+</span>
          </p>
          <h1 className="hero-display text-starlight max-sm:text-[clamp(46px,15vw,58px)] max-sm:leading-[0.86]">
            <span className="block">YOUR NEXT</span>
            <span className="block">HOUR HAS</span>
            <span className="block">SOMEWHERE</span>
            <span className="block text-instrument">TO GO.</span>
          </h1>
        </div>

        <aside className="col-span-3 self-end border-l border-starlight/15 pb-4 pl-6 max-xl:col-span-4 max-lg:col-span-1 max-lg:border-l-0 max-lg:border-t max-lg:pb-0 max-lg:pl-0 max-lg:pt-6">
          <p className="board-micro text-starlight/65">FLIGHT PLAN / WS 214</p>
          <p className="instrument tnum mt-3 text-[clamp(48px,5vw,76px)] leading-none text-starlight">
            50:00
          </p>
          <div className="mt-5 grid grid-cols-2 gap-y-4 border-y border-starlight/15 py-4">
            <div>
              <p className="board-micro text-starlight/65">TASK</p>
              <p className="board-sm mt-1 text-starlight">DEEP WORK</p>
            </div>
            <div>
              <p className="board-micro text-starlight/65">ROUTE</p>
              <p className="board-sm mt-1 text-starlight">TKS → HND</p>
            </div>
            <div>
              <p className="board-micro text-starlight/65">CABIN</p>
              <p className="board-sm mt-1 text-boarding">READY</p>
            </div>
            <div>
              <p className="board-micro text-starlight/65">SEAT</p>
              <p className="board-sm mt-1 text-starlight">WINDOW</p>
            </div>
          </div>
          <p className="section-deck mt-5 text-starlight/72">
            WindowSeat turns each focus session into a flight you want to finish.
          </p>
          <div className="mt-4 border-l-2 border-instrument pl-4">
            <p className="text-[clamp(16px,1.2vw,18px)] font-semibold leading-snug text-starlight">
              No Subscription
            </p>
            <p className="body-sm mt-2 text-starlight/75">
              Launching on the Mac App Store · No account · Your focus data stays on your Mac
            </p>
          </div>
          <a
            href="#briefing"
            className="board-caption mt-6 inline-flex items-center gap-3 bg-signal px-5 py-3 font-bold text-ink transition-[gap] hover:gap-5 max-lg:min-h-11"
          >
            SEE HOW IT WORKS <span aria-hidden="true">↓</span>
          </a>
        </aside>

        <div className="hero-route pointer-events-none absolute inset-x-0 bottom-[8%] -z-10 max-lg:hidden" aria-hidden="true">
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

      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] items-end justify-between gap-8 border-t border-starlight/15 pt-4 max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <div className="flex gap-10">
          <div className="max-sm:hidden">
            <p className="board-micro text-starlight/60">ORIGIN</p>
            <p className="board-caption mt-1 text-starlight">TKS · TOKUSHIMA</p>
          </div>
          <div>
            <p className="board-micro text-starlight/60">DESTINATION</p>
            <p className="board-caption mt-1 text-instrument">HND · HANEDA</p>
          </div>
        </div>
        <p className="board-caption shrink-0 text-starlight/65">SCROLL / PUSH BACK ↓</p>
      </div>

      {open && (
        <dialog
          ref={dialogRef}
          aria-labelledby="film-dialog-title"
          onCancel={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
          onClick={(event) => event.target === event.currentTarget && setOpen(false)}
          className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-transparent p-m text-starlight backdrop:bg-nighttop/90 backdrop:backdrop-blur-md"
        >
          <div className="mx-auto flex h-full w-[min(1100px,94vw)] flex-col justify-center">
            <h2 id="film-dialog-title" className="sr-only">
              WindowSeat film
            </h2>
            <video
              src="film/windowseat-ad.mp4"
              controls
              autoPlay
              playsInline
              className="w-full rounded-xl shadow-2xl"
            />
            <div className="mt-s flex items-center justify-between">
              <p className="board-caption text-starlight/60">WINDOWSEAT — THE FILM · 50 SEC</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="glass px-4 py-2"
                autoFocus
              >
                <span className="board-caption text-starlight">CLOSE ✕</span>
              </button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
