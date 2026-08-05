const LINKS = [
  { label: "SUPPORT", href: "support.html" },
  { label: "PRIVACY", href: "privacy.html" },
  { label: "TERMS", href: "terms.html" },
  { label: "REFUNDS", href: "refunds.html" },
];

/**
 * One line. The old footer repeated the pitch, the flight strip and a chapter
 * index that no longer exists; everything a visitor still needs down here is
 * legal paperwork and support.
 */
export default function Footer() {
  return (
    <footer
      data-mood="dark"
      className="bg-nighttop px-gutter py-l text-starlight max-md:px-m"
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-l gap-y-m border-t border-starlight/12 pt-l">
        <p className="board-micro normal-case text-starlight/45">
          © 2026 FOCUS TERMINAL · NATIVE macOS
        </p>
        <nav className="flex flex-wrap gap-x-l gap-y-2">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="board-micro text-starlight/60 transition-colors hover:text-instrument"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
