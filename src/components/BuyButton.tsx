import { APP_STORE_PRICE, APP_STORE_URL } from "@/lib/site";

/**
 * The purchase CTA — the one place signal yellow appears as a filled surface,
 * on either cabin mood, so the action always looks the same.
 *
 * This used to be a Gumroad overlay checkout, which needed a client component
 * to inject `gumroad.js` and an env var to carry the product URL. Focus Terminal
 * now sells through the Mac App Store only, so the whole thing collapses to a
 * link: no script, no state, no configuration that can silently render the
 * button dead when it is missing from a production build.
 */
export default function BuyButton({
  label = `GET IT — ${APP_STORE_PRICE}`,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={APP_STORE_URL}
      className={`board-caption inline-flex min-h-12 items-center gap-3 bg-signal px-7 font-bold text-ink transition-[gap] hover:gap-5 ${className}`}
    >
      {label}
      <span aria-hidden="true">→</span>
    </a>
  );
}
