import { FLIGHT } from "@/lib/flight";

/**
 * A barcode rendered deterministically from the flight data — the same
 * string always prints the same bars, like a real pass.
 */
export default function Barcode({
  data = `${FLIGHT.number} ${FLIGHT.origin.iata}${FLIGHT.dest.iata} ${FLIGHT.minutes}`,
  className,
}: {
  data?: string;
  className?: string;
}) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < data.length; i++) {
    const c = data.charCodeAt(i);
    const w1 = (c % 3) + 1;
    const gap = ((c >> 2) % 2) + 1;
    const w2 = ((c >> 3) % 3) + 1;
    bars.push({ x, w: w1 });
    x += w1 + 1;
    bars.push({ x, w: w2 });
    x += w2 + gap;
  }
  return (
    <svg
      viewBox={`0 0 ${x} 40`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={40} fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
