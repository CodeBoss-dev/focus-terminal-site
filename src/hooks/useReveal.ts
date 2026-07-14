"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Brand-section reveal: children tagged [data-reveal] fade + rise 24px when
 * the section enters. Under reduced motion nothing is hidden — the DOM is
 * authored in its final state and .from() tweens only run when allowed.
 */
export function useReveal<T extends HTMLElement>() {
  const root = useRef<T | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return root;
}
