/**
 * The page's structural signature: every section divider is a leg of one flight.
 *
 * The previous site explained the aviation metaphor in prose, which is exactly
 * what skimming readers skipped. Here the metaphor lives in the furniture — the
 * solid segment is distance flown, the dashed segment is distance to go, and the
 * aircraft sits a little further right on each successive rule. A visitor who
 * reads nothing still watches a flight complete as they scroll, so every word on
 * the page is free to be plain product language.
 *
 * `progress` is the visitor's position through the page, not a fabricated
 * statistic: 0 at the hero, 1 at arrival.
 */
export default function RouteRule({
  progress,
  from,
  to,
  tone = "night",
}: {
  progress: number;
  from?: string;
  to?: string;
  tone?: "night" | "terminal";
}) {
  const flown = Math.min(100, Math.max(0, progress * 100));
  const line = tone === "night" ? "bg-starlight/20" : "bg-ink/20";
  const dash = tone === "night" ? "border-starlight/25" : "border-ink/25";
  const label = tone === "night" ? "text-starlight/60" : "text-ink/55";
  const dot = tone === "night" ? "bg-starlight/45" : "bg-ink/40";

  return (
    <div
      data-route-rule
      aria-hidden="true"
      className="flex items-center gap-3 select-none"
    >
      {from ? <span className={`board-micro shrink-0 ${label}`}>{from}</span> : null}
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />

      <span className="relative flex h-px flex-1 items-center">
        {/* Distance to go, always present underneath. */}
        <span className={`absolute inset-x-0 border-t border-dashed ${dash}`} />
        {/* Distance flown, drawn on entry. */}
        <span
          className={`route-rule-fill absolute left-0 h-px ${line}`}
          style={{ width: `${flown}%` }}
        />
        <span
          className="route-rule-plane absolute -translate-x-1/2 text-[13px] leading-none text-route"
          style={{ left: `${flown}%` }}
        >
          ✈
        </span>
      </span>

      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          progress >= 1 ? "bg-instrument" : dot
        }`}
      />
      {to ? <span className={`board-micro shrink-0 ${label}`}>{to}</span> : null}
    </div>
  );
}
