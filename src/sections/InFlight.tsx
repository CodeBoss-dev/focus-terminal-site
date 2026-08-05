import RouteRule from "@/components/RouteRule";
import { FLIGHT } from "@/lib/flight";

/**
 * The near-wordless chapter. Two pieces of the real interface do the talking:
 * where the session lives while you work, and what happens when you drift.
 * Each gets one mono caption and nothing else.
 *
 * They are laid out the way macOS actually places them — the status item spans
 * the full width of the screen top, the alert sits under the right edge — so
 * the composition itself says where you would meet each one.
 */
export default function InFlight() {
  return (
    <section
      id="in-flight"
      data-mood="dark"
      className="bg-night-grad px-gutter py-[16vh] max-md:px-m max-md:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <RouteRule progress={0.62} from="TKS" to="HND" />

        <div className="mt-xl grid grid-cols-12 gap-x-l max-lg:grid-cols-1 max-lg:gap-y-m">
          <p className="board-caption col-span-2 pt-3 text-instrument max-lg:col-span-1">
            WHILE YOU WORK
          </p>

          <div className="col-span-10 max-lg:col-span-1">
            <h2 className="headline max-w-[20ch] text-starlight" data-reveal>
              It stays out of the way.
            </h2>

            <figure className="mt-xl" data-reveal>
              <div className="flex items-center justify-between gap-m border border-starlight/15 bg-nighttop/70 px-5 py-3">
                <span className="board-micro text-starlight/35 max-sm:hidden">
                  FINDER&ensp;FILE&ensp;EDIT&ensp;VIEW&ensp;WINDOW&ensp;HELP
                </span>
                <span className="board tnum flex items-center gap-2 text-instrument">
                  ✈ {FLIGHT.number.replace(" ", "")} · 42m → {FLIGHT.dest.iata}
                </span>
              </div>
              <figcaption className="board-micro mt-s text-starlight/45">
                ALWAYS IN THE MENU BAR
              </figcaption>
            </figure>

            <figure className="mt-l flex flex-col items-end max-lg:items-stretch" data-reveal>
              <div className="w-full max-w-[420px] border border-turbulence/35 bg-nighttop/70 px-5 py-4">
                <p className="board-micro text-turbulence">● TURBULENCE</p>
                <p className="lede mt-2 text-starlight">Slack has been open for a while.</p>
              </div>
              <figcaption className="board-micro mt-s w-full max-w-[420px] text-starlight/45">
                A NUDGE, NEVER A LOCK
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
