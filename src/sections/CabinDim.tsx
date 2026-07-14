"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The pivotal beat: the page itself dims from terminal paper to the night
 * gradient over ~1.2s of scroll — exactly like the in-app cabin dim.
 */
export default function CabinDim() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
        tl.fromTo("[data-night-layer]", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "none" }, 0.2);
        tl.from("[data-dim-line]", { opacity: 0, y: 16, duration: 0.15 }, 0.55);
        tl.to({}, { duration: 0.2 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="cabin" ref={root} data-mood="dark" className="pin-section relative h-[125vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-paper">
        {/* Light layer copy */}
        <p className="board-caption text-ink/60">CABIN CREW — DOORS TO AUTOMATIC</p>

        {/* Night rises over the paper */}
        <div
          data-night-layer
          className="bg-night-grad absolute inset-0 flex items-center justify-center opacity-100"
        >
          <div className="text-center">
            <p className="board-caption text-starlight/50">CABIN LIGHTS DIMMED · DISTRACTIONS STAY AT THE GATE</p>
            <p data-dim-line className="briefing-line mt-m text-starlight">
              The doors close. The world stays at the gate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
