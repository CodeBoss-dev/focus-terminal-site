"use client";

import Script from "next/script";

/**
 * Lemon Squeezy overlay checkout.
 *
 * `lemonsqueezy.js` upgrades any link whose href points at a LS checkout and
 * carries the `lemonsqueezy-button` class into a modal that renders on top of
 * this page, so the buyer never leaves the site. Without the script the link
 * still works — it just navigates to the hosted checkout instead.
 *
 * Set NEXT_PUBLIC_LS_CHECKOUT_URL to the product's checkout URL.
 */
const CHECKOUT_URL = process.env.NEXT_PUBLIC_LS_CHECKOUT_URL ?? "";

export default function BuyButton() {
  if (!CHECKOUT_URL) {
    return (
      <p className="board-caption mt-l font-bold text-ink/50">
        CHECKOUT UNAVAILABLE · CONFIGURATION PENDING
      </p>
    );
  }

  // `embed=1` tells LS to render the overlay rather than a full page load.
  const href = `${CHECKOUT_URL}${CHECKOUT_URL.includes("?") ? "&" : "?"}embed=1`;

  return (
    <>
      <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="afterInteractive" />
      <a
        href={href}
        className="lemonsqueezy-button board-caption mt-l inline-flex min-h-12 items-center gap-3 bg-ink px-6 py-4 font-bold text-paper transition-[gap] hover:gap-5"
      >
        BUY FOCUS TERMINAL · $1.99 <span aria-hidden="true">→</span>
      </a>
      <p className="board-micro mt-3 text-ink/55">
        macOS 14 Sonoma or later · Apple silicon &amp; Intel · 2.9 MB
      </p>
    </>
  );
}
