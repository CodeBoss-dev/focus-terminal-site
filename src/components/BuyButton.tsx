import { APP_STORE_PRICE, APP_STORE_URL } from "@/lib/site";

/**
 * The purchase CTA.
 *
 * This used to be a Gumroad overlay checkout, which needed a client component
 * to inject `gumroad.js` and an env var to carry the product URL. Focus Terminal
 * now sells through the Mac App Store only, so the whole thing collapses to a
 * link: no script, no state, no configuration that can silently render the
 * button dead when it is missing from a production build.
 */
export default function BuyButton() {
  return (
    <>
      <a
        href={APP_STORE_URL}
        className="board-caption mt-l inline-flex min-h-12 items-center gap-3 bg-ink px-6 py-4 font-bold text-paper transition-[gap] hover:gap-5"
      >
        GET IT ON THE MAC APP STORE <span aria-hidden="true">→</span>
      </a>
      <p className="board-micro mt-3 text-ink/55">
        {APP_STORE_PRICE} USD · macOS 14 Sonoma or later · Apple silicon &amp; Intel
      </p>
    </>
  );
}
