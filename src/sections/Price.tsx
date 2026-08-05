import BuyButton from "@/components/BuyButton";
import RouteRule from "@/components/RouteRule";
import { APP_STORE_PRICE } from "@/lib/site";

/* Three facts, each one an objection answered. No sentence needed. The values
   are written in the case they should appear in, so the row opts out of the
   board classes' uppercasing rather than shouting "MACOS". */
const FACTS = [
  ["PAYMENT", "ONCE"],
  ["ACCOUNT", "NONE"],
  ["REQUIRES", "macOS 14+"],
];

/**
 * Arrival — the page's only surface change, and the reason the rest of it stays
 * on the night cabin. You have been flying since the hero; the daylight of the
 * Terminal palette is what landing looks like. It marks the buying moment
 * without a word of transition copy.
 */
export default function Price() {
  return (
    <section
      id="price"
      data-mood="light"
      className="bg-paper px-gutter py-[16vh] text-ink max-md:px-m max-md:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <RouteRule progress={1} from="TKS" to="HND · ARRIVED" tone="terminal" />

        <div className="mt-xl grid grid-cols-12 gap-x-l max-lg:grid-cols-1 max-lg:gap-y-m">
          <p className="board-caption col-span-2 pt-3 text-ink/55 max-lg:col-span-1">
            ON ARRIVAL
          </p>

          <div className="col-span-10 max-lg:col-span-1">
            <div className="flex flex-wrap items-baseline gap-x-m gap-y-2" data-reveal>
              <p className="display tnum">{APP_STORE_PRICE}</p>
              <p className="board-caption text-ink/55">ONE TIME · US PRICE</p>
            </div>

            <p className="lede mt-m max-w-[38ch] text-ink/70" data-reveal>
              No subscription, no account, no trial to remember to cancel.
            </p>

            <div className="mt-l" data-reveal>
              <BuyButton label="GET IT ON THE MAC APP STORE" />
            </div>

            <dl className="mt-xl grid grid-cols-3 gap-x-l border-t border-ink/15 pt-l max-sm:grid-cols-1 max-sm:gap-y-m">
              {FACTS.map(([term, value]) => (
                <div key={term}>
                  <dt className="board-micro text-ink/45">{term}</dt>
                  <dd className="board normal-case mt-2">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
