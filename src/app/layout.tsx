import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "1001 Movies & Albums",
    template: "%s | 1001 Movies & Albums",
  },
  description:
    "Discover and track your journey through 1001 essential movies and albums. Sign up with Google, experience curated pairs of music and film, rate what you've seen and heard, and explore your cultural journey.",
  keywords: [
    "movies",
    "albums",
    "music",
    "film",
    "tracker",
    "1001 albums",
    "1001 movies",
    "cultural journey",
    "entertainment tracker",
  ],
  authors: [{ name: "1001 Media" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://1001media.app",
    title: "1001 Movies & Albums",
    description:
      "Discover and track your journey through 1001 essential movies and albums",
    siteName: "1001 Movies & Albums",
  },
  twitter: {
    card: "summary_large_image",
    title: "1001 Movies & Albums",
    description:
      "Discover and track your journey through 1001 essential movies and albums",
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
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
