"use client";

import { useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";
import { APP_STORE_PRICE, APP_STORE_URL } from "@/lib/site";

/**
 * Two elements: who this is, and how to buy it.
 *
 * The previous nav carried four chapter links, a mobile chapter menu and a
 * scroll-progress rail, all of which were navigation for a thirteen-section
 * page. Four sections do not need a table of contents — they need the price to
 * stay reachable. The only remaining logic is the cabin-mood flip, so the bar
 * stays legible when it crosses the one light section.
 */
export default function Nav() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-mood]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setLight((entry.target as HTMLElement).dataset.mood === "light");
          }
        }
      },
      // Only the strip directly under the bar decides the mood.
      { rootMargin: "0px 0px -94% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${
        light
          ? "border-ink/10 bg-paper/80 text-ink"
          : "border-starlight/12 bg-nighttop/70 text-starlight"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-gutter max-md:h-14 max-md:px-m">
        <a href="#hero" className="board-caption flex items-center gap-2.5 font-bold">
          <BrandMark size={24} priority />
          FOCUS TERMINAL
        </a>
        <a
          href={APP_STORE_URL}
          className={`board-micro inline-flex min-h-10 items-center gap-2 border px-4 transition-colors ${
            light
              ? "border-ink/25 hover:border-ink/60"
              : "border-starlight/25 hover:border-starlight/60"
          }`}
        >
          {APP_STORE_PRICE}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
