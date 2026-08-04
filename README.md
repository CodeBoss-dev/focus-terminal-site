This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Production metadata

Set `NEXT_PUBLIC_SITE_URL` to the final public URL before running the production build, including its trailing repository path when applicable, for example `https://codeboss-dev.github.io/focus-terminal-site/`. The build uses that verified URL for the canonical link and absolute Open Graph/Twitter image URL; it deliberately omits them when the deployment URL is unknown.

For GitHub Pages, set `NEXT_PUBLIC_BASE_PATH=/focus-terminal-site`. `next.config.ts` and the public-asset helper apply that prefix consistently while local development continues to use the root path.

## Where the price and store link live

Focus Terminal sells through the Mac App Store only. `APP_STORE_URL`,
`APP_STORE_ID`, and `APP_STORE_PRICE` are constants in `src/lib/site.ts`, and
every CTA on the site reads them — the nav button, the hero, and the boarding-pass
CTA band all render from `APP_STORE_PRICE` rather than a hardcoded string.

Change the price in that one file when the App Store price changes. The site
previously advertised a $1.99 Gumroad download while the store charged $2.99,
because fifteen separate literals had to be kept in step and were not.

## Deploying

```bash
npm run deploy
```

That is the whole procedure. It builds with the three values above already set,
then publishes `out/` to the `gh-pages` branch that GitHub Pages serves. The
publish happens in a temporary git worktree, so your working tree and current
branch are untouched. Pages takes 30–60 seconds to serve the new build.

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
