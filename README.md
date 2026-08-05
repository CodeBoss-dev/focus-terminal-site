# Focus Terminal — marketing site

A Next.js static export for [Focus Terminal](https://apps.apple.com/app/focus-terminal/id6795077264),
a native macOS focus timer that turns each session into a flight.

```bash
npm run dev     # http://localhost:3000
npm run build   # static export into out/
npm run deploy  # build + publish out/ to gh-pages
```

## How the page is built

Four sections and a footer, in the order a skimmer needs them:

| Section | File | Job |
| --- | --- | --- |
| Hero | `src/sections/Hero.tsx` | What it is, the price, one session shown as a departures row |
| How | `src/sections/How.tsx` | Three clock positions inside one 50-minute session |
| In flight | `src/sections/InFlight.tsx` | The menu-bar item and the drift nudge, near-wordless |
| Price | `src/sections/Price.tsx` | The buying moment |

This replaced a thirteen-section scroll narrative that pinned each chapter with
GSAP and Lenis. Reviewers liked how it looked and then skimmed straight past the
product: there was no path through the page that did not involve reading, and
every early heading was aviation language, so visitors could not tell what the
app actually did.

The rule that came out of that, and that new work should keep:

- **Copy is literal, pictures are aviation.** Every sentence on the page names
  the product in ordinary words. The flight metaphor lives in the furniture —
  `RouteRule`, the departures row, the menu-bar strip — where it costs a skimmer
  nothing to absorb.
- **No paragraphs.** `.lede` is the only mid-sized type role, it holds one
  sentence, and there are five of them on the whole page. The wall of 15px body
  copy is what made the previous site unreadable at a glance.
- **One surface change.** The page is the night cabin until `Price`, which flips
  to the Terminal palette. That is the arrival, and it marks the buying moment
  without a word of transition copy.

### The route rule

`src/components/RouteRule.tsx` draws the divider above each section as a leg of
one flight: solid segment for distance flown, dashed for distance to go, aircraft
at the boundary. `progress` is the visitor's real position through the page —
0.28, 0.62, 1 — so scrolling completes a flight. It is the page's signature and
its only motion.

### JavaScript

`src/components/Motion.tsx` is all of it: one `IntersectionObserver` that marks
elements `is-in` once and unobserves them. Reveal styles are scoped to `.js`,
which an inline script in `layout.tsx` sets before first paint, so the page is
fully readable without JavaScript and does not flash. `prefers-reduced-motion`
is honoured in both the CSS and the observer.

### Design tokens

`src/app/globals.css` carries the app's `FT` enum values (`DesignSystem.swift`)
in an `@theme` block. Components must not hardcode a color, size, or spacing
value that is not a token.

The `.board-*` classes uppercase their contents, which turns `macOS` into
`MACOS`. Add `normal-case` alongside them wherever real casing matters.

## Where the price and store link live

Focus Terminal sells through the Mac App Store only. `APP_STORE_URL`,
`APP_STORE_ID`, and `APP_STORE_PRICE` are constants in `src/lib/site.ts`, and
every CTA reads them — the nav button, the hero and the price section all render
from `APP_STORE_PRICE` rather than a hardcoded string.

Change the price in that one file when the App Store price changes. The site
previously advertised a $1.99 Gumroad download while the store charged $2.99,
because fifteen separate literals had to be kept in step and were not.

## Production metadata

Set `NEXT_PUBLIC_SITE_URL` to the final public URL before running the production
build, including its trailing repository path when applicable, for example
`https://codeboss-dev.github.io/focus-terminal-site/`. The build uses that
verified URL for the canonical link and the absolute Open Graph/Twitter image
URL; it deliberately omits them when the deployment URL is unknown.

For GitHub Pages, set `NEXT_PUBLIC_BASE_PATH=/focus-terminal-site`.
`next.config.ts` and the public-asset helper apply that prefix consistently while
local development continues to use the root path.

## Deploying

```bash
npm run deploy
```

That is the whole procedure. It builds with the values above already set, then
publishes `out/` to the `gh-pages` branch that GitHub Pages serves. The publish
happens in a temporary git worktree, so your working tree and current branch are
untouched. Pages takes 30–60 seconds to serve the new build.

To deploy somewhere else, override any of the values inline:

```bash
NEXT_PUBLIC_SITE_URL=https://example.com/ npm run deploy
```

### Why `.nojekyll` matters

GitHub Pages runs published files through Jekyll, and Jekyll strips every
directory whose name begins with an underscore. Next.js emits all of its
JavaScript and CSS into `_next/`, so without an empty `.nojekyll` file at the
root of `gh-pages`, the site publishes as HTML with no styling and no
JavaScript — and the deploy still looks like it succeeded, because `index.html`
itself is served fine.

`next build` does not create this file, and it wipes `out/` on every run. The
`postbuild` script in `package.json` recreates it, and `scripts/deploy.sh`
refuses to publish if it is missing. Both exist because the deploy mirrors
`out/` with `rsync --delete`, which would otherwise remove the `.nojekyll`
already on `gh-pages` and take the live site down.
