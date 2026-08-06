import SplitFlap from "@/components/SplitFlap";

/**
 * The pivot from feeling to product, and the only centred section on the page.
 *
 * Everything else runs on the left-aligned gate grid because it is information.
 * This is a moment: the page has just made a promise in the hero, and this is
 * where the thing making it gets named. Breaking the grid once is what marks it
 * as different.
 *
 * The name resolves on the split-flap because that is the app's own signature
 * element — a departures board settling on a destination — rather than a
 * generic reveal borrowed from somewhere else.
 */
export default function Introducing() {
  return (
    <section
      id="introducing"
      data-mood="dark"
      className="bg-nighttop px-gutter py-[16vh] text-center max-md:px-m max-md:py-24"
    >
      <div className="mx-auto flex max-w-[900px] flex-col items-center">
        <p data-reveal className="board-caption text-instrument">
          INTRODUCING
        </p>

        <h2 className="flap-display mt-m text-starlight">
          <SplitFlap text="FOCUS TERMINAL" />
        </h2>

        {/* The hero has already said what the app is. Repeating the definition
            here wasted the one moment on the page that can carry weight, so
            these two lines do the turn instead: what is at stake, then what we
            did about it. */}
        <p data-reveal className="headline-md mt-l max-w-[24ch] text-starlight">
          Your time is the one thing you cannot get more of.
        </p>

        <p data-reveal className="lede mt-m max-w-[46ch] text-starlight/65">
          So we built a timer where the same hour gives you a much better reason to finish.
        </p>
      </div>
    </section>
  );
}
