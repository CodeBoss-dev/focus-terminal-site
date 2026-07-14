"use client";

import { useEffect, useState } from "react";

const STARS = (() => {
  let seed = 181;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  return Array.from({ length: 64 }, () => ({
    x: random() * 100,
    y: random() * 100,
    size: random() > 0.82 ? 2 : 1,
    opacity: 0.14 + random() * 0.42,
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
      className="bg-night-grad relative flex min-h-[100svh] items-center justify-center overflow-hidden px-gutter py-28 max-md:px-m"
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

      <button
        onClick={() => setOpen(true)}
        className="glass absolute right-10 top-8 z-20 rounded-full px-5 py-2.5 transition-transform hover:scale-[1.04] max-md:right-6 max-md:top-6"
      >
        <span className="board-caption text-starlight">▶&nbsp; WATCH THE FILM</span>
      </button>

      <div className="relative z-10 mx-auto max-w-[900px] text-center">
        <p className="board-caption text-instrument">WINDOWSEAT · A FOCUS APP FOR MAC</p>
        <h1 className="board-display mt-l text-starlight">
          FOCUS, BOARDED
          <br />
          LIKE A FLIGHT.
        </h1>
        <p className="mx-auto mt-l max-w-[650px] text-[clamp(17px,2vw,21px)] leading-relaxed text-starlight/70">
          WindowSeat turns a focus session into a journey: choose how long you&apos;ll work,
          fly a real route, and land with a passport stamp for the time you protected.
        </p>
        <a
          href="#briefing"
          className="glass board-caption mt-l inline-flex rounded-full px-6 py-3 text-starlight transition-transform hover:scale-[1.03]"
        >
          SEE HOW IT WORKS&nbsp; ↓
        </a>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-1 text-starlight/50">
        <p className="board-caption">SCROLL TO DEPART</p>
        <span aria-hidden="true" className="animate-bounce text-starlight/35">
          ↓
        </span>
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
              <button
                onClick={() => setOpen(false)}
                className="glass rounded-full px-4 py-2"
                autoFocus
              >
                <span className="board-caption text-starlight">CLOSE ✕</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
