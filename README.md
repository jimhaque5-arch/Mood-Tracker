# ⚡ Vibe NFT Minter

A Base Mini App that lets users mint their daily vibe as an NFT on Base Mainnet.

**Contract:** [`0x786943cC2bbC0149A71B63fA1782298E1AA82091`](https://basescan.org/address/0x786943cC2bbC0149A71B63fA1782298E1AA82091)

---

## Features

- 📱 Mobile-first, dark mode, Base App ready
- 🎨 10 emoji picker with live SVG NFT preview
- ✍️ 30-char vibe text input
- ⛓️ Mint with Coinbase Wallet or MetaMask
- ✅ Success screen with Basescan link + share buttons
- 🟣 Warpcast Frame-ready

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/vibe-nft-minter.git
cd vibe-nft-minter
npm install
```

### 2. Set Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=   # https://cloud.walletconnect.com
NEXT_PUBLIC_CDP_API_KEY=                # https://portal.cdp.coinbase.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0x786943cC2bbC0149A71B63fA1782298E1AA82091
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add your env vars in Vercel dashboard → Settings → Environment Variables.

---

## ABI Note

The contract ABI in `lib/contract.ts` assumes a `mint(string emoji, string vibe)` function.

**If your contract uses different function names**, check your actual ABI on Basescan:
https://basescan.org/address/0x786943cC2bbC0149A71B63fA1782298E1AA82091#code

Then update `VIBE_NFT_ABI` in `lib/contract.ts`.

---

## File Structure

```
vibe-nft-minter/
├── app/
│   ├── globals.css          # Tailwind + dark mode styles
│   ├── layout.tsx           # Root layout + metadata
│   ├── page.tsx             # Entry point
│   └── providers.tsx        # wagmi + React Query providers
├── components/
│   ├── VibeMinter.tsx       # Main minting UI (all state here)
│   ├── NFTPreview.tsx       # Live SVG NFT card preview
│   ├── SuccessScreen.tsx    # Post-mint success + share
│   └── WalletButton.tsx     # Connect / disconnect wallet
├── lib/
│   ├── contract.ts          # ABI, contract address, emojis
│   └── wagmi.ts             # wagmi config for Base
├── public/                  # Add icon.png, og-image.png here
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Web3 hooks | wagmi v2 |
| Contract calls | viem |
| Wallet | Coinbase Wallet + MetaMask |
| Chain | Base Mainnet (chainId: 8453) |
| Animation | Framer Motion + CSS |

---

Built for the Base ecosystem 🔵
