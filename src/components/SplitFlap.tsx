"use client";

import { useEffect, useRef, useState } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—→";

/**
 * The app's signature element: split-flap character flips, 40ms stagger,
 * ease-out (each cell cycles then settles). Renders the target text by
 * default (SSR, no-JS, reduced motion) and only scrambles while animating.
 * Plays once when scrolled into view.
 */
export default function SplitFlap({
  text,
  className,
  stagger = 40,
  cycleMs = 45,
  cycles = 7,
}: {
  text: string;
  className?: string;
  stagger?: number;
  cycleMs?: number;
  cycles?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(text);
  const played = useRef(false);

  useEffect(() => {
    setDisplay(text);
    played.current = false;
  }, [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || played.current) return;
        played.current = true;
        io.disconnect();

        const chars = text.split("");
        const start = performance.now();
        let raf = 0;
        const frame = (now: number) => {
          const t = now - start;
          let settled = true;
          const out = chars.map((c, i) => {
            if (c === " ") return " ";
            const begin = i * stagger;
            const end = begin + cycles * cycleMs;
            if (t < begin) return " ";
            if (t < end) {
              settled = false;
              const step = Math.floor((t - begin) / cycleMs) + i * 3;
              return CHARSET[step % CHARSET.length];
            }
            return c;
          });
          setDisplay(out.join(""));
          if (!settled) raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, stagger, cycleMs, cycles]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
