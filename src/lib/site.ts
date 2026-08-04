/**
 * Focus Terminal sells through the Mac App Store only. The price and the store
 * URL live here rather than inline in each section, because the site previously
 * drifted out of sync with the store — every CTA advertised a $1.99 Gumroad
 * download while the App Store listing charged $2.99.
 *
 * `APP_STORE_PRICE` is the US storefront price. Apple shows each visitor their
 * own storefront's price on the listing itself, so the site quotes the US figure
 * and says so rather than pretending to be currency-aware.
 */
export const APP_STORE_ID = "6795077264";
export const APP_STORE_URL = `https://apps.apple.com/app/focus-terminal/id${APP_STORE_ID}`;
export const APP_STORE_PRICE = "$2.99";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const siteBasePath =
  rawBasePath === "/" ? "" : rawBasePath.replace(/\/+$/, "");

export function withBasePath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteBasePath}${normalizedPath}`;
}
