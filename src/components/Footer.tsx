import BrandMark from "@/components/BrandMark";

const COLUMNS = [
  {
    title: "FLIGHT PLAN",
    links: [
      { label: "THE FILM", href: "#film" },
      { label: "DEPARTURES", href: "#departures" },
      { label: "IN-FLIGHT", href: "#in-flight" },
      { label: "PASSPORT", href: "#passport" },
    ],
  },
  {
    title: "GROUND CREW",
    links: [
      { label: "SUPPORT & FAQ", href: "support.html" },
      { label: "REPORT A PROBLEM", href: "support.html#contact" },
    ],
  },
  {
    title: "PAPERWORK",
    links: [
      { label: "PRIVACY POLICY", href: "privacy.html" },
      { label: "DATA & PRIVACY", href: "privacy.html" },
    ],
  },
];

export default function Footer() {
  return (
    <footer data-mood="dark" className="bg-nighttop px-gutter py-xl text-starlight max-md:px-m">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex items-center gap-4 border-y border-starlight/15 py-4">
          <span className="h-2 w-2 rounded-full bg-starlight/60" />
          <span className="board-caption">TKS</span>
          <span className="h-px flex-1 bg-starlight/15" />
          <span className="text-route">✈</span>
          <span className="h-px flex-1 border-t border-dashed border-starlight/20" />
          <span className="h-2 w-2 rounded-full bg-instrument" />
          <span className="board-caption text-instrument">YOUR NEXT DESTINATION</span>
        </div>

        <div className="grid grid-cols-12 gap-l py-xl max-lg:grid-cols-1">
          <div className="col-span-6">
            <div className="flex items-center gap-3">
              <BrandMark size={44} />
              <p className="board-micro text-starlight/35">WINDOWSEAT / MACOS</p>
            </div>
            <p className="mt-m text-[clamp(48px,7vw,92px)] font-black leading-[0.82] tracking-[-0.065em]">
              FOCUS
              <span className="block text-instrument">SESSIONS, FLOWN.</span>
            </p>
            <p className="body-sm mt-l max-w-[400px] text-starlight/45">
              A native Mac focus app that turns protected time into routes, landings, and passport
              stamps.
            </p>
          </div>

          <div className="col-span-6 grid grid-cols-3 gap-l self-end max-sm:grid-cols-2">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="board-micro mb-m text-starlight/30">{column.title}</p>
                <ul className="space-y-s">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="board-caption text-starlight/60 transition-colors hover:text-instrument"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between border-t border-starlight/15 pt-m max-md:block">
          <p className="board-micro text-starlight/25">© 2026 WINDOWSEAT · MADE FOR MACOS 26+</p>
          <p className="board-micro text-starlight/25 max-md:mt-s">
            DESIGN TOKENS &amp; TYPE / WINDOWSEAT UI SYSTEM
          </p>
        </div>
      </div>
    </footer>
  );
}
