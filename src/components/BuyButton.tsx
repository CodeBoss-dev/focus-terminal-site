"use client";

import Script from "next/script";

/**
 * Gumroad overlay checkout.
 *
 * `gumroad.js` upgrades any link that points at a Gumroad product and carries
 * `data-gumroad-overlay-checkout` into a modal rendered on top of this page, so
 * the buyer never leaves the site. Without the script the link still works — it
 * just navigates to the hosted product page instead.
 *
 * Set NEXT_PUBLIC_GUMROAD_PRODUCT_URL to the product URL. Pass the bare product
 * URL (no `?wanted=true`): that parameter forces Gumroad's own checkout page and
 * defeats the overlay.
 */
const PRODUCT_URL = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL ?? "";

export default function BuyButton() {
  if (!PRODUCT_URL) {
    return (
      <p className="board-caption mt-l font-bold text-ink/50">
        CHECKOUT UNAVAILABLE · CONFIGURATION PENDING
      </p>
    );
  }

  // Strip `wanted=true` so the overlay is used even if it is supplied.
  const href = PRODUCT_URL.split("?")[0];

  return (
    <>
      <Script src="https://gumroad.com/js/gumroad.js" strategy="afterInteractive" />
      <a
        href={href}
        data-gumroad-overlay-checkout="true"
        className="board-caption mt-l inline-flex min-h-12 items-center gap-3 bg-ink px-6 py-4 font-bold text-paper transition-[gap] hover:gap-5"
      >
        BUY FOCUS TERMINAL · $1.99 <span aria-hidden="true">→</span>
      </a>
      <p className="board-micro mt-3 text-ink/55">
        macOS 14 Sonoma or later · Apple silicon &amp; Intel · 2.9 MB
      </p>
    </>
  );
}
