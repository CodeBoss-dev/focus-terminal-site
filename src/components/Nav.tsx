"use client";

import { type MouseEvent, useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";

const LINKS = [
  { href: "#departures", label: "DEPARTURES" },
  { href: "#in-flight", label: "IN-FLIGHT" },
  { href: "#passport", label: "PASSPORT" },
];

/**
 * Sticky nav that fades in once the hero is over, and flips between the two
 * moods depending on which section is under it — ink-on-paper glass over
 * terminal sections, starlight-on-night glass over flight sections.
 */
export default function Nav() {
  const [visible, setVisible] = useState(false);
  const [mood, setMood] = useState<"light" | "dark">("dark");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const film = document.getElementById("film");
    const onScroll = () => {
      if (!film) return;
      setVisible(window.scrollY > film.offsetTop + film.offsetHeight - window.innerHeight);
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(distance > 0 ? Math.min(1, window.scrollY / distance) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Whichever mood-tagged section currently crosses the nav strip wins.
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-mood]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMood((e.target as HTMLElement).dataset.mood === "light" ? "light" : "dark");
          }
        }
      },
      { rootMargin: "0px 0px -94% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();

    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const top = target.classList.contains("pin-section") ? targetTop + 1 : targetTop - 56;
    history.pushState(null, "", href);
    if (window.__lenis) {
      window.__lenis.scrollTo(top, { immediate: true, force: true });
    } else {
      window.scrollTo({ top, behavior: "auto" });
    }

    // Scroll-linked chapters must resolve on the same frame as the jump,
    // rather than waiting for the visitor's next wheel event.
    requestAnimationFrame(() => window.dispatchEvent(new Event("scroll")));
  };

  const light = mood === "light";
  return (
    <nav
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0 -translate-y-2"
      } ${
        light
          ? "border-b border-ink/10 bg-paper/80 text-ink"
          : "border-b border-starlight/15 bg-nighttop/70 text-starlight"
      } backdrop-blur-md`}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-gutter max-md:h-14 max-md:px-m">
        <a
          href="#film"
          onClick={(event) => jumpTo(event, "#film")}
          className="board-sm flex items-center gap-3 font-bold"
        >
          <BrandMark size={28} />
          <span>WINDOWSEAT</span>
          <span className={`board-micro border-l pl-3 font-normal max-md:hidden ${light ? "border-ink/15 text-ink/35" : "border-starlight/15 text-starlight/35"}`}>
            TKS → ???
          </span>
        </a>
        <div className="flex items-center gap-6 max-md:gap-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(event) => jumpTo(event, l.href)}
              className={`board-caption transition-opacity hover:opacity-100 max-sm:hidden ${
                light ? "opacity-60" : "opacity-70"
              }`}
            >
              {l.label}
            </a>
          ))}
          {/* TODO: App Store URL */}
          <a
            href="#board"
            className="board-caption bg-signal px-5 py-2.5 font-bold text-ink transition-transform hover:-translate-y-0.5"
          >
            GET WINDOWSEAT
          </a>
        </div>
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-px ${light ? "bg-ink/10" : "bg-starlight/10"}`}>
        <div
          className="relative h-full bg-route transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        >
          <span className="absolute -right-1 -top-[3px] h-[7px] w-[7px] rotate-45 bg-route" />
        </div>
      </div>
    </nav>
  );
}
