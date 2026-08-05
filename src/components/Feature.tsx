import Shot from "@/components/Shot";
import type { ReactNode } from "react";

/**
 * One feature: a screenshot, a title that states what you get, and a single
 * line of caption. Nothing else is allowed in here.
 *
 * The shape exists because the previous site explained features in paragraphs
 * that nobody read, and the version after it cut the paragraphs but left the
 * page with no landmarks to skim between. A picture per claim fixes both — the
 * eye lands on the screenshot, the title tells it what it just saw.
 *
 * `flip` alternates which side the image sits on so a run of features has a
 * rhythm instead of reading as a table.
 */
export default function Feature({
  eyebrow,
  title,
  caption,
  shot,
  alt,
  ratio,
  visual,
  tone = "night",
  flip = false,
  priority = false,
}: {
  eyebrow: string;
  title: string;
  caption: string;
  shot?: string;
  alt?: string;
  ratio?: [number, number];
  visual?: ReactNode;
  tone?: "night" | "terminal";
  flip?: boolean;
  priority?: boolean;
}) {
  const body = tone === "night" ? "text-starlight/70" : "text-ink/65";
  const accent = tone === "night" ? "text-instrument" : "text-ink/55";

  return (
    <article className="grid grid-cols-12 items-center gap-x-l gap-y-m max-lg:grid-cols-1">
      <div
        className={`col-span-5 max-lg:col-span-1 max-lg:row-start-1 ${
          flip ? "col-start-8" : "col-start-1"
        }`}
      >
        <p className={`board-micro ${accent}`}>{eyebrow}</p>
        <h3 className="headline-md mt-s max-w-[18ch]">{title}</h3>
        <p className={`lede mt-s max-w-[34ch] ${body}`}>{caption}</p>
      </div>

      <div
        className={`col-span-7 max-lg:col-span-1 max-lg:row-start-2 ${
          flip ? "col-start-1 row-start-1" : "col-start-6"
        }`}
      >
        {/* The "actual app, not a mockup" claim is made once, under the hero.
            Repeating it beneath all six screenshots read as noise. */}
        {shot && alt ? (
          <Shot src={shot} alt={alt} tone={tone} priority={priority} ratio={ratio} />
        ) : (
          visual
        )}
      </div>
    </article>
  );
}
