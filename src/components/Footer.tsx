const COLUMNS = [
  {
    title: "PRODUCT",
    links: [
      { label: "THE FILM", href: "#film" },
      { label: "DEPARTURES", href: "#departures" },
      { label: "IN-FLIGHT", href: "#in-flight" },
      { label: "PASSPORT", href: "#passport" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "SUPPORT & FAQ", href: "support.html" },
      { label: "REPORT A PROBLEM", href: "support.html#contact" },
    ],
  },
  {
    title: "PRIVACY",
    links: [
      { label: "PRIVACY POLICY", href: "privacy.html" },
      { label: "ALL DATA STAYS ON YOUR MAC", href: "privacy.html" },
    ],
  },
];

export default function Footer() {
  return (
    <footer data-mood="light" className="bg-paper text-ink">
      <div className="hairline-t mx-auto max-w-[1200px] px-gutter py-xl max-md:px-m">
        <div className="flex flex-wrap justify-between gap-l">
          <div className="max-w-[260px]">
            <p className="board font-bold">
              <span aria-hidden="true">✈</span> WINDOWSEAT
            </p>
            <p className="board-caption mt-xs text-ink/60">FOCUS SESSIONS, FLOWN.</p>
            <p className="body-sm mt-m text-ink/40">
              A native Mac focus app that turns protected time into routes, landings, and
              passport stamps.
            </p>
          </div>
          <div className="flex flex-wrap gap-xl max-md:gap-l">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="board-caption mb-s text-ink/40">{col.title}</p>
                <ul className="space-y-xs">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="board-caption text-ink/70 hover:text-ink">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="board-micro mt-xl text-ink/30">
          © 2026 WINDOWSEAT · MADE FOR MACOS 26+ · TOKENS &amp; TYPE FROM THE APP&apos;S OWN
          DESIGN SYSTEM
        </p>
      </div>
    </footer>
  );
}
