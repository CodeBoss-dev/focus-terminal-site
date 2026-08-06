import BuyButton from "@/components/BuyButton";
import Shot from "@/components/Shot";

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

/**
 * The hero states the product in plain words and proves it with the app.
 *
 * The flight deck is the thesis image: a real map, a route being flown, and a
 * countdown attached to it. It says "focus timer that goes somewhere" faster
 * than the sentence does, which is the point — reviewers skim, and the first
 * thing they should hit is a picture of the thing they would be buying.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      data-mood="dark"
      className="bg-night-grad relative overflow-hidden px-gutter pb-[10vh] pt-36 max-md:px-m max-md:pb-16 max-md:pt-28"
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

      <div className="relative mx-auto max-w-[1200px]">
        <p className="board-caption text-instrument">FOCUS APP FOR MAC</p>

        <h1 className="display mt-m max-w-[18ch] text-starlight">
          Every focus session takes you somewhere new.
        </h1>

        <p className="lede mt-m max-w-[54ch] text-starlight/70">
          Focus Terminal is a Mac timer that turns your work sessions into real flights. Pick your
          task, watch the plane move while you work, and land somewhere you have never been.
        </p>

        <div className="mt-l flex flex-wrap items-center gap-x-l gap-y-m">
          <BuyButton />
          {/* Written in its final case — the board classes uppercase by
              default, which would turn macOS into MACOS. */}
          <p className="board-micro normal-case text-starlight/55">
            MAC APP STORE · macOS 14+ · NO SUBSCRIPTION
          </p>
        </div>

        <div className="mt-[9vh] max-md:mt-xl">
          <Shot
            src="/shots/04-flight-deck.webp"
            alt="The Focus Terminal flight deck: a satellite map with the route drawn from Mumbai to Colombo, a captain announcement reading We've reached our cruising altitude, cruise at FL370, 1,215 km to go, and a countdown of 01:37:42."
            priority
          />
          <div className="mt-s flex flex-wrap items-center justify-between gap-x-l gap-y-2">
            <p className="board-micro text-starlight/45">
              FLIGHT DECK · A 123-MINUTE SESSION IN PROGRESS
            </p>
            <p className="board-micro text-starlight/45">ACTUAL APP · NOT A MOCKUP</p>
          </div>
        </div>
      </div>
    </section>
  );
}
