"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BrandMark from "@/components/BrandMark";
import { withBasePath } from "@/lib/site";

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

/* Skimmers read these before they read the headline, so each one has to be a
   complete claim on its own rather than a fragment of the metaphor. */
const PROOF = [
  "One-time $1.99 — no subscription",
  "No account, nothing leaves your Mac",
  "macOS 14+ · Apple silicon & Intel",
];

export default function FilmHero() {
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  /* The film opens silent. Reviewers consistently found the score unpleasant,
     so sound is opt-in and starts well below full volume. Muting through the
     DOM property rather than the React prop keeps the static export honest —
     the attribute is not serialised into the exported HTML. */
  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node) {
      node.muted = true;
      node.volume = 0.55;
    }
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !soundOn;
    video.muted = !next;
    video.volume = 0.55;
    setSoundOn(next);
  };

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
          <span>FOCUS TERMINAL</span>
          <span className="max-sm:hidden"> / FOCUS APP FOR MAC</span>
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
            <span className="board-micro block text-starlight/65 max-sm:hidden">
              50 SEC · PLAYS SILENT
            </span>
            <span className="board-caption text-starlight">WATCH THE FILM</span>
          </span>
        </button>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-12 items-center gap-x-10 gap-y-12 py-12 max-lg:grid-cols-1 max-lg:py-16 max-md:pb-20 max-md:pt-12">
        <div className="col-span-7 max-xl:col-span-7 max-lg:col-span-1">
          <p className="board-caption text-instrument">FOCUS APP FOR MAC · macOS 14+</p>
          <h1 className="display mt-5 text-starlight">
            A focus timer for Mac that gives your hour{" "}
            <span className="text-instrument">somewhere to go.</span>
          </h1>
          <p className="section-deck mt-6 max-w-[560px] text-starlight/75">
            Pick a task and how long you want to protect. Focus Terminal turns that block into a
            real flight route that moves while you work, nudges you back when you drift to
            something else, and logs the session when the timer lands.
          </p>

          <ul className="mt-7 flex flex-col gap-2.5">
            {PROOF.map((item) => (
              <li key={item} className="body-text flex items-center gap-3 text-starlight/80">
                <span
                  aria-hidden="true"
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-boarding/20 text-[9px] text-boarding"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#board"
              className="board-caption inline-flex min-h-12 items-center gap-3 bg-signal px-6 py-4 font-bold text-ink transition-[gap] hover:gap-5"
            >
              GET FOCUS TERMINAL · $1.99 <span aria-hidden="true">→</span>
            </a>
            <a
              href="#briefing"
              className="board-caption inline-flex min-h-12 items-center gap-3 border border-starlight/30 px-6 py-4 text-starlight transition-colors hover:border-starlight/60"
            >
              SEE HOW IT WORKS <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <aside className="col-span-5 max-xl:col-span-5 max-lg:col-span-1">
          <div className="glass rounded-2xl p-6 max-sm:p-5">
            <div className="flex items-center justify-between border-b border-starlight/15 pb-4">
              <p className="board-micro text-starlight/65">A SESSION IN THE APP</p>
              <p className="board-micro text-boarding">● READY</p>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="board-micro text-starlight/65">TIME PROTECTED</p>
                <p className="instrument tnum mt-2 text-[clamp(44px,4.4vw,64px)] leading-none text-starlight">
                  50:00
                </p>
              </div>
              <p className="board-sm text-right text-starlight/70">
                FT 214
                <span className="board-micro mt-1 block text-starlight/55">FLIGHT NO.</span>
              </p>
            </div>

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
                <p className="board-micro text-starlight/65">FOCUS CLASS</p>
                <p className="board-sm mt-1 text-starlight">WORK</p>
              </div>
              <div>
                <p className="board-micro text-starlight/65">ON LANDING</p>
                <p className="board-sm mt-1 text-starlight">+1 STAMP</p>
              </div>
            </div>

            <p className="body-sm mt-4 text-starlight/65">
              Fifty protected minutes, shown as a route from Tokushima to Tokyo Haneda. Finish it
              and the distance is added to your passport.
            </p>
          </div>
        </aside>

        {/* Ambient only. The route used to run at full strength straight through
            the headline and the buttons; it now sits low and faint so it reads
            as background rather than as something crossing the copy. */}
        <div
          className="hero-route pointer-events-none absolute inset-x-0 bottom-[-4%] -z-10 max-lg:hidden"
          aria-hidden="true"
        >
          <svg viewBox="0 0 1200 500" className="w-full overflow-visible">
            <path
              d="M40 448 C 290 430, 430 305, 615 288 S 910 185, 1160 70"
              fill="none"
              stroke="var(--color-starlight)"
              strokeOpacity="0.1"
              strokeWidth="1.5"
              strokeDasharray="4 12"
            />
            <path
              className="route-draw"
              d="M40 448 C 290 430, 430 305, 615 288 S 910 185, 1160 70"
              pathLength="100"
              fill="none"
              stroke="var(--color-route)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.28"
            />
            <circle cx="40" cy="448" r="5" fill="var(--color-starlight)" fillOpacity="0.35" />
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
              Focus Terminal film
            </h2>
            <video
              ref={attachVideo}
              src={withBasePath("/film/focus-terminal-ad.mp4")}
              controls
              autoPlay
              playsInline
              className="w-full rounded-xl shadow-2xl"
            />
            <div className="mt-s flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch">
              <p className="board-caption text-starlight/60">
                FOCUS TERMINAL — THE FILM · 50 SEC
              </p>
              <div className="flex items-center gap-3 max-sm:justify-between">
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-pressed={soundOn}
                  className="glass px-4 py-2"
                >
                  <span className="board-caption text-starlight">
                    {soundOn ? "🔊 SOUND ON" : "🔇 SOUND OFF · TURN ON"}
                  </span>
                </button>
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
          </div>
        </dialog>
      )}
    </section>
  );
}
