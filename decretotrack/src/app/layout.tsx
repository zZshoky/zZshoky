import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DecretoTrack — Act 60 Compliance Made Simple",
  description:
    "Track your Puerto Rico Act 60 tax decree compliance. Monitor presence days, charitable donations, employment requirements, and filing deadlines — all in one dashboard.",
  keywords: [
    "Act 60",
    "Puerto Rico",
    "tax decree",
    "compliance",
    "Act 20",
    "Act 22",
    "presence test",
    "tax incentives",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
