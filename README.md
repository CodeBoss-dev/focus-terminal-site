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

Set `NEXT_PUBLIC_GUMROAD_PRODUCT_URL` to the Gumroad product URL for the paid
product. Without it the buy button renders a disabled "checkout unavailable"
state, so it must be present in every production build. Use the bare product URL
— appending `?wanted=true` forces Gumroad's hosted checkout page and defeats the
on-domain overlay.

The full GitHub Pages build is therefore:

```bash
NEXT_PUBLIC_GUMROAD_PRODUCT_URL=https://waaridev.gumroad.com/l/focusterminal \
NEXT_PUBLIC_BASE_PATH=/focus-terminal-site \
NEXT_PUBLIC_SITE_URL=https://codeboss-dev.github.io/focus-terminal-site/ \
npm run build
```

The contents of `out/` are then published to the `gh-pages` branch, which is what
GitHub Pages serves.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
