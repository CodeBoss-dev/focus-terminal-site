import type { ReactNode } from "react";
import RouteRule from "@/components/RouteRule";

/**
 * The page's three product bands — before a session, during it, after it.
 *
 * The surface follows the app rather than the page: you book in the Terminal
 * (light), you fly at Night, you land back in the Terminal. That gives a skimmer
 * three unmistakable landmarks on the way down, and the route rule at the top of
 * each one is the leg of the flight it corresponds to.
 */
export default function Band({
  id,
  tone,
  progress,
  label,
  title,
  children,
}: {
  id: string;
  tone: "night" | "terminal";
  progress: number;
  label: string;
  title: string;
  children: ReactNode;
}) {
  const night = tone === "night";

  return (
    <section
      id={id}
      data-mood={night ? "dark" : "light"}
      className={`px-gutter py-[11vh] max-md:px-m max-md:py-20 ${
        night ? "bg-night-grad text-starlight" : "bg-paper text-ink"
      }`}
    >
      <div className="mx-auto max-w-[1200px]">
        <RouteRule progress={progress} from="TKS" to="HND" tone={tone} />

        <div className="mt-xl grid grid-cols-12 gap-x-l max-lg:grid-cols-1 max-lg:gap-y-s">
          <p
            className={`board-caption col-span-3 pt-3 max-lg:col-span-1 ${
              night ? "text-instrument" : "text-ink/55"
            }`}
          >
            {label}
          </p>
          <h2 className="headline col-span-9 max-w-[20ch] max-lg:col-span-1">{title}</h2>
        </div>

        <div className="mt-[7vh] flex flex-col gap-[8vh] max-md:mt-xl max-md:gap-xl">
          {children}
        </div>
      </div>
    </section>
  );
}
