import BuyButton from "@/components/BuyButton";
import { FLIGHT } from "@/lib/flight";

/* Deterministic so server and client render the same sky. */
const STARS = (() => {
  let seed = 181;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: 40 }, () => ({
    x: random() * 100,
    y: random() * 100,
    size: random() > 0.86 ? 2 : 1,
    opacity: 0.1 + random() * 0.3,
  }));
})();

/* The departures row is the hero's second half: five columns of the app's own
   furniture, which say "this is a timed session with a destination" without a
   sentence of explanation. */
const ROW = [
  { label: "FLIGHT", value: FLIGHT.number },
  { label: "GATE", value: FLIGHT.gate },
  { label: "DESTINATION", value: `${FLIGHT.dest.city} · ${FLIGHT.dest.iata}` },
  { label: "DURATION", value: `${FLIGHT.minutes} MIN` },
];

/**
 * The hero states the product in plain words and shows the metaphor as an
 * artifact. Reviewers could not tell what Focus Terminal was because every
 * early line was aviation language; the split is now absolute — copy is
 * literal, pictures are aviation.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      data-mood="dark"
      className="bg-night-grad relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-gutter pb-l pt-32 max-md:px-m max-md:pt-28"
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

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center py-xl">
        <p className="board-caption text-instrument">FOCUS APP FOR MAC</p>

        <h1 className="display mt-m max-w-[16ch] text-starlight">
          A focus timer that goes somewhere.
        </h1>

        <p className="lede mt-m max-w-[46ch] text-starlight/70">
          Choose a task and how long. The session becomes a flight to finish.
        </p>

        <div className="mt-l flex flex-wrap items-center gap-x-l gap-y-m">
          <BuyButton />
          {/* Written in its final case — the board classes uppercase by
              default, which would turn macOS into MACOS. */}
          <p className="board-micro normal-case text-starlight/55">
            MAC APP STORE · macOS 14+ · NO SUBSCRIPTION
          </p>
        </div>
      </div>

      {/* One session, as the app lists it. */}
      <div className="relative mx-auto w-full max-w-[1200px]">
        <p className="board-micro text-starlight/45">SELECTED SESSION</p>
        <div className="mt-s grid grid-cols-[repeat(4,auto)_1fr] items-baseline gap-x-xl gap-y-m border-y border-starlight/15 py-m max-md:grid-cols-2 max-md:gap-x-l">
          {ROW.map((cell) => (
            <div key={cell.label}>
              <p className="board-micro text-starlight/45">{cell.label}</p>
              <p className="board mt-2 text-starlight">{cell.value}</p>
            </div>
          ))}
          <div className="justify-self-end max-md:justify-self-start">
            <p className="board-micro text-starlight/45">STATUS</p>
            <p className="board mt-2 text-boarding">● BOARDING</p>
          </div>
        </div>
      </div>
    </section>
  );
}
