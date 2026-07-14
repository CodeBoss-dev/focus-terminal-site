/**
 * A passport stamp: double ring (outer solid, inner dashed), country code
 * huge, name + date beneath — pressed at a slight angle. feTurbulence
 * roughens the edges like real rubber-stamp ink.
 */
export default function Stamp({
  code,
  country,
  date,
  fresh = false,
  rotate = -8,
  className,
}: {
  code: string;
  country: string;
  date?: string;
  fresh?: boolean;
  rotate?: number;
  className?: string;
}) {
  const color = fresh ? "var(--color-stampfresh)" : "var(--color-stampaged)";
  const fid = `ink-${code}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-label={`${country} passport stamp`}>
      <defs>
        <filter id={fid} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
        </filter>
      </defs>
      <g
        transform={`rotate(${rotate} 100 100)`}
        filter={`url(#${fid})`}
        fill="none"
        stroke={color}
        opacity={fresh ? 0.95 : 0.75}
      >
        <circle cx="100" cy="100" r="92" strokeWidth="3.5" />
        <circle cx="100" cy="100" r="78" strokeWidth="1.5" strokeDasharray="4 5" />
        <text
          x="100"
          y="102"
          textAnchor="middle"
          fill={color}
          stroke="none"
          style={{
            font: "800 56px ui-monospace, 'SF Mono', monospace",
            letterSpacing: "2px",
          }}
        >
          {code}
        </text>
        <text
          x="100"
          y="132"
          textAnchor="middle"
          fill={color}
          stroke="none"
          style={{
            font: "600 13px ui-monospace, 'SF Mono', monospace",
            letterSpacing: "3px",
          }}
        >
          {country}
        </text>
        {date ? (
          <text
            x="100"
            y="152"
            textAnchor="middle"
            fill={color}
            stroke="none"
            style={{
              font: "500 11px ui-monospace, 'SF Mono', monospace",
              letterSpacing: "2px",
            }}
          >
            {date}
          </text>
        ) : null}
      </g>
    </svg>
  );
}
