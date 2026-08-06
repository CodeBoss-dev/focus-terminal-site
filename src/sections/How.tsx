import RouteRule from "@/components/RouteRule";

/* The markers are clock positions inside one fifty-minute session, so the
   sequence is real information rather than decorative 01 / 02 / 03. */
const BEATS = [
  {
    clock: "00:00",
    state: "DEPART",
    line: "Choose your task and how long you want.",
  },
  {
    clock: "25:00",
    state: "IN FLIGHT",
    line: "Work anywhere. The plane keeps moving.",
  },
  {
    clock: "50:00",
    state: "ARRIVED",
    line: "You land, and the session is yours to keep.",
  },
];

export default function How() {
  return (
    <section
      id="how"
      data-mood="dark"
      className="bg-nightbottom px-gutter py-[16vh] max-md:px-m max-md:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <RouteRule progress={0.12} from="TKS" to="HND" />

        {/* Interior sections run on the gate-strip grid: mono label in the
            narrow rail, everything else in the wide column. */}
        <div className="mt-xl grid grid-cols-12 gap-x-l max-lg:grid-cols-1 max-lg:gap-y-m">
          <p className="board-caption col-span-2 pt-3 text-instrument max-lg:col-span-1">
            HOW IT WORKS
          </p>

          <div className="col-span-10 max-lg:col-span-1">
            <h2 className="headline max-w-[20ch] text-starlight" data-reveal>
              Here is what an hour looks like.
            </h2>

            <div className="mt-xl grid grid-cols-3 gap-x-l gap-y-xl border-t border-starlight/12 pt-l max-lg:grid-cols-1">
              {BEATS.map((beat) => (
                <div key={beat.clock} data-reveal>
                  <p className="instrument tnum text-[clamp(34px,3.6vw,48px)] leading-none text-instrument">
                    {beat.clock}
                  </p>
                  <p className="board-micro mt-m text-starlight/45">{beat.state}</p>
                  <p className="lede mt-xs max-w-[28ch] text-starlight/80">{beat.line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
