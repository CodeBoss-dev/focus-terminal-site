import type { Metadata } from "next";
import "./globals.css";

const title = "WindowSeat — Focus sessions, flown.";
const description =
  "A native macOS 14+ focus app that turns each session into a flight. Launching on the Mac App Store as a one-time purchase, with no subscription or account.";

// Canonical and social-image URLs must describe the real deployment. This
// export currently supports a root-domain deployment only: its chunks, media,
// and public assets use root-relative URLs.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const siteUrl = rawSiteUrl ? new URL(rawSiteUrl) : undefined;

if (siteUrl && (siteUrl.pathname !== "/" || siteUrl.search || siteUrl.hash)) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must be a root-domain URL until basePath and asset-prefix support are configured."
  );
}

const socialImage = siteUrl
  ? new URL("windowseat-social-preview.png", siteUrl).toString()
  : undefined;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "WindowSeat",
  title,
  description,
  keywords: [
    "Mac focus app",
    "macOS productivity app",
    "focus timer",
    "deep work",
    "Pomodoro alternative",
  ],
  category: "productivity",
  creator: "Waaridh Borpujari",
  publisher: "Waaridh Borpujari",
  icons: {
    icon: "/windowseat-icon.png",
    apple: "/windowseat-icon.png",
  },
  alternates: siteUrl ? { canonical: siteUrl } : undefined,
  openGraph: {
    type: "website",
    siteName: "WindowSeat",
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
            alt: "WindowSeat turns deep work into a flight on Mac",
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
