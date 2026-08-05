"use client";

import { useEffect } from "react";

/**
 * The whole of the page's JavaScript.
 *
 * The previous build shipped GSAP, ScrollTrigger and Lenis to drive pinned
 * scroll choreography across thirteen sections. There are five quiet sections
 * now and one kind of motion, so this is a single IntersectionObserver: mark
 * things `is-in` once, then stop watching them. Native scrolling is left alone.
 */
export default function Motion() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-reveal], [data-route-rule]"
    );
    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
