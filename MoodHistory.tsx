import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "On-Chain Mood Tracker 🌈",
  description:
    "Track your daily mood on Base blockchain. Permanent, transparent, yours forever.",
  metadataBase: new URL("https://your-app.vercel.app"),
  openGraph: {
    title: "On-Chain Mood Tracker 🌈",
    description: "How are you feeling today? Log it on Base forever.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "On-Chain Mood Tracker",
    description: "Log your daily mood on Base blockchain ⛓️",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
