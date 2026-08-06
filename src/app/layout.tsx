import type { Metadata } from "next";
import "./globals.css";
import { APP_STORE_PRICE, withBasePath } from "@/lib/site";

const title = "Focus Terminal — Every focus session takes you somewhere new.";
const description =
  `A Mac timer that turns your work sessions into real flights. Pick a task, watch the plane move while you work, and collect the country when you land. One-time ${APP_STORE_PRICE}, no subscription, macOS 14+.`;

// Canonical and social-image URLs must describe the real deployment.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const siteUrl = rawSiteUrl ? new URL(rawSiteUrl) : undefined;

if (siteUrl && (siteUrl.search || siteUrl.hash)) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must not contain a query string or hash."
  );
}

const socialImage = siteUrl
  ? new URL("focus-terminal-social-preview.png", siteUrl).toString()
  : undefined;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Focus Terminal",
  title,
  description,
  keywords: [
    "Mac focus app",
    "macOS productivity app",
    "focus timer",
    "deep work",
    "Pomodoro alternative",
    "flight focus timer",
    "native Mac app no subscription",
  ],
  category: "productivity",
  creator: "Waaridh Borpujari",
  publisher: "Waaridh Borpujari",
  icons: {
    icon: withBasePath("/focus-terminal-icon.png"),
    apple: withBasePath("/focus-terminal-icon.png"),
  },
  alternates: siteUrl ? { canonical: siteUrl.toString() } : undefined,
  openGraph: {
    type: "website",
    siteName: "Focus Terminal",
    locale: "en_US",
    title,
    description,
    url: siteUrl,
    images: socialImage
      ? [
          {
            url: socialImage,
            width: 1200,
            height: 630,
            alt: "Focus Terminal turns deep work into a flight on Mac",
          },
        ]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: socialImage ? [socialImage] : undefined,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
