"use client";

import { NFTPreview } from "./NFTPreview";
import { BASESCAN_URL } from "@/lib/contract";

// ─────────────────────────────────────────────────────────────────────────────
// SuccessScreen — Shown after a successful mint
// ─────────────────────────────────────────────────────────────────────────────

interface SuccessScreenProps {
  emoji: string;
  vibe: string;
  txHash: string;
  address: string;
  onMintAnother: () => void;
}

export function SuccessScreen({
  emoji,
  vibe,
  txHash,
  address,
  onMintAnother,
}: SuccessScreenProps) {
  const basescanUrl = `${BASESCAN_URL}/tx/${txHash}`;
  const shareText = encodeURIComponent(
    `Just minted my Vibe NFT on Base! ${emoji} "${vibe}" ⚡\n\nMint yours 👇`
  );
  const appUrl = encodeURIComponent(
    process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"
  );

  // Warpcast share URL
  const warpcastUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${appUrl}`;

  // Twitter/X share URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${appUrl}`;

  return (
    <div className="flex flex-col items-center gap-6 animate-[fadeUp_0.5s_ease-out]">
      {/* Success badge */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-[bounceIn_0.6s_ease-out]">
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-2xl font-black text-white">Vibe Minted!</h2>
        <p className="text-gray-400 text-sm text-center">
          Your vibe is now permanently on Base blockchain
        </p>
      </div>

      {/* NFT Card */}
      <NFTPreview emoji={emoji} vibe={vibe} address={address} />

      {/* Tx details */}
      <div className="w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Status</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-semibold">Confirmed</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Network</span>
          <span className="text-white text-sm font-semibold">Base Mainnet</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Transaction</span>
          <a
            href={basescanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm font-mono hover:text-blue-300 transition-colors"
          >
            {txHash.slice(0, 8)}...{txHash.slice(-6)} ↗
          </a>
        </div>
      </div>

      {/* Share buttons */}
      <div className="w-full space-y-3">
        <p className="text-gray-500 text-xs text-center uppercase tracking-widest">
          Share your vibe
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Farcaster */}
          <a
            href={warpcastUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-95 transition-all duration-200 rounded-2xl py-3.5 px-4 font-bold text-sm text-white"
          >
            <span className="text-lg">🟣</span>
            Warpcast
          </a>

          {/* Twitter/X */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] active:scale-95 transition-all duration-200 rounded-2xl py-3.5 px-4 font-bold text-sm text-white"
          >
            <span className="text-lg">𝕏</span>
            Twitter
          </a>
        </div>

        {/* View on Basescan */}
        <a
          href={basescanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-transparent border border-[#2a2a4a] hover:border-blue-500/50 active:scale-95 transition-all duration-200 rounded-2xl py-3.5 px-4 font-semibold text-sm text-gray-300 hover:text-blue-400"
        >
          🔍 View on Basescan
        </a>
      </div>

      {/* Mint another */}
      <button
        onClick={onMintAnother}
        className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors py-2"
      >
        ← Mint another vibe
      </button>
    </div>
  );
}
