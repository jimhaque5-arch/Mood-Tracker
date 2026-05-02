import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID";

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    // Coinbase Wallet is first — best for Base App / MiniKit
    coinbaseWallet({
      appName: "Vibe NFT Minter",
      appLogoUrl: "https://your-app.vercel.app/icon.png",
      preference: "smartWalletOnly", // Use Coinbase Smart Wallet in Base App
    }),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
