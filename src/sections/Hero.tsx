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

/* Skimmers read these before they read the headline, so each one has to be a
   complete claim on its own rather than a fragment of the metaphor. */
const PROOF = [
  "One-time $1.99 — no subscription",
  "No account, nothing leaves your Mac",
  "macOS 14+ · Apple silicon & Intel",
];

/**
 * The hero. Deliberately a server component — with the film lightbox gone there
 * is no state, no effect and no event handler left here, so none of it needs to
 * reach the browser as JavaScript.
 */
export default function Hero() {
  return (
    <section
      id="hero"
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
        <p className="board-micro text-starlight/55 max-sm:hidden">FT 214 · TKS → HND</p>
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
              href="#what-it-is"
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
    </section>
  );
}
