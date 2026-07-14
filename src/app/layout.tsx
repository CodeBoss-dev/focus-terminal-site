import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WindowSeat — Focus sessions, flown.",
  description:
    "A native macOS focus app where every session is a flight — book it, board it, fly it, land it, and keep the stamp.",
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
