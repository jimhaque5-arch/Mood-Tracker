import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

const APP_URL =
  process.env.NEXT_PUBLIC_URL ?? "https://your-app.vercel.app";

export const metadata: Metadata = {
  title: "Vibe NFT Minter",
  description: "Mint your vibe as an NFT on Base",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${APP_URL}/og.png`,
      button: {
        title: "✨ Mint Your Vibe",
        action: {
          type: "launch_frame",
          name: "Vibe NFT Minter",
          url: APP_URL,
          splashBackgroundColor: "#0f0f1a",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
