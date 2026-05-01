"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { VIBE_NFT_ADDRESS, VIBE_NFT_ABI } from "@/lib/contract";

const EMOJIS = ["🔥", "⚡", "💜", "🌊", "✨", "🚀", "💎", "🎯", "🌙", "🦋"];

function NFTPreview({ emoji, vibeText }: { emoji: string; vibeText: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="w-full">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f0f1a" />
          <stop offset="100%" stopColor="#1a0f2e" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="400" height="400" fill="url(#bg)" rx="20" />
      <rect x="10" y="10" width="380" height="380" fill="none" stroke="#7c3aed" strokeWidth="1.5" rx="16" opacity="0.6" />
      <rect x="18" y="18" width="364" height="364" fill="none" stroke="#a855f7" strokeWidth="0.5" rx="12" opacity="0.3" />
      <text x="200" y="210" fontSize="100" textAnchor="middle" dominantBaseline="middle" filter="url(#glow)">
        {emoji}
      </text>
      <text x="200" y="295" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" fill="#e2d9f3" textAnchor="middle">
        {vibeText || "your vibe here"}
      </text>
      <line x1="80" y1="330" x2="320" y2="330" stroke="#7c3aed" strokeWidth="0.8" opacity="0.5" />
      <text x="200" y="355" fontFamily="Arial, sans-serif" fontSize="13" fill="#7c3aed" textAnchor="middle" letterSpacing="2" opacity="0.9">
        MINTED ON BASE
      </text>
      <text x="200" y="375" fontFamily="Arial, sans-serif" fontSize="11" fill="#4c1d95" textAnchor="middle" opacity="0.6">
        VibeNFT #?
      </text>
    </svg>
  );
}

function SuccessScreen({
  txHash,
  emoji,
  vibeText,
  onReset,
}: {
  txHash: string;
  emoji: string;
  vibeText: string;
  onReset: () => void;
}) {
  const basescanUrl = `https://basescan.org/tx/${txHash}`;
  const shareText = `Just minted my Vibe NFT on Base! ${emoji} "${vibeText}" ✨ #VibeNFT #Base`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: shareText, url: basescanUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText} ${basescanUrl}`);
      alert("Copied to clipboard!");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f1a] text-white flex flex-col items-center justify-center px-4 max-w-md mx-auto text-center">
      <div className="text-7xl mb-3 animate-bounce">🎉</div>
      <h1 className="text-3xl font-bold mb-1">Vibe Minted!</h1>
      <p className="text-purple-400 text-sm mb-6">Your NFT is live on Base mainnet</p>

      <div className="w-full max-w-[260px] mb-6 rounded-2xl overflow-hidden border border-purple-700/40 shadow-xl shadow-purple-900/30">
        <NFTPreview emoji={emoji} vibeText={vibeText} />
      </div>

      <a
        href={basescanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full block text-center py-4 rounded-2xl bg-purple-900/40 border border-purple-700/40 text-purple-200 font-semibold mb-3 text-sm px-4 truncate"
      >
        🔍 View on Basescan
      </a>

      <button
        onClick={handleShare}
        className="w-full py-5 rounded-2xl bg-purple-600 text-white font-bold text-xl mb-3 active:scale-95 transition-transform shadow-lg shadow-purple-700/30"
      >
        📤 Share My Vibe
      </button>

      <button
        onClick={onReset}
        className="w-full py-4 rounded-2xl border border-purple-800/50 text-purple-400 font-semibold text-base active:scale-95 transition-transform"
      >
        Mint Another
      </button>
    </main>
  );
}

export default function Home() {
  const [selectedEmoji, setSelectedEmoji] = useState("🔥");
  const [vibeText, setVibeText] = useState("");

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash: txHash });

  const isBusy = isPending || isConfirming;
  const canMint = isConnected && vibeText.trim().length > 0 && !isBusy;

  const handleConnect = () => {
    connect({ connector: coinbaseWallet({ appName: "Vibe NFT Minter" }) });
  };

  const handleMint = () => {
    if (!canMint) return;
    writeContract({
      address: VIBE_NFT_ADDRESS,
      abi: VIBE_NFT_ABI,
      functionName: "mint",
      args: [vibeText.trim(), selectedEmoji],
    });
  };

  const handleReset = () => {
    reset();
    setVibeText("");
    setSelectedEmoji("🔥");
  };

  if (isSuccess && txHash) {
    return (
      <SuccessScreen
        txHash={txHash}
        emoji={selectedEmoji}
        vibeText={vibeText}
        onReset={handleReset}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a] text-white flex flex-col items-center px-4 py-6 max-w-md mx-auto">
      <div className="w-full text-center mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Vibe NFT Minter</h1>
        <p className="text-purple-400 text-sm mt-1">Mint your vibe on Base ✨</p>
      </div>

      <div className="w-full max-w-[270px] mb-6 rounded-2xl overflow-hidden border border-purple-700/40 shadow-lg shadow-purple-900/20">
        <NFTPreview emoji={selectedEmoji} vibeText={vibeText} />
      </div>

      <div className="w-full mb-4">
        <p className="text-xs text-purple-500 uppercase tracking-widest mb-2 text-center">
          Pick Your Vibe
        </p>
        <div className="grid grid-cols-5 gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setSelectedEmoji(e)}
              className={`text-3xl py-3 rounded-xl transition-all active:scale-90 ${
                selectedEmoji === e
                  ? "bg-purple-600 scale-105 shadow-lg shadow-purple-700/40"
                  : "bg-white/5"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full mb-5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-purple-500 uppercase tracking-widest">Vibe Text</p>
          <span className={`text-xs font-mono ${vibeText.length >= 28 ? "text-red-400" : "text-purple-700"}`}>
            {vibeText.length}/30
          </span>
        </div>
        <input
          type="text"
          maxLength={30}
          value={vibeText}
          onChange={(e) => setVibeText(e.target.value)}
          placeholder="gm, based, vibing..."
          className="w-full bg-white/5 border border-purple-800/50 rounded-2xl px-4 py-4 text-white text-lg focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {writeError && (
        <div className="w-full mb-4 px-4 py-3 rounded-xl bg-red-900/30 border border-red-700/40 text-red-300 text-sm text-center">
          {writeError.message.includes("User rejected")
            ? "❌ Transaction cancelled."
            : "⚠️ Something went wrong. Try again."}
        </div>
      )}

      {!isConnected ? (
        <button
          onClick={handleConnect}
          className="w-full py-5 rounded-2xl bg-purple-600 text-white font-bold text-xl active:scale-95 transition-transform shadow-lg shadow-purple-700/30"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={handleMint}
          disabled={!canMint}
          className={`w-full py-5 rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-lg ${
            canMint
              ? "bg-purple-600 text-white shadow-purple-700/30"
              : "bg-purple-900/30 text-purple-700 cursor-not-allowed"
          }`}
        >
          {isPending
            ? "⏳ Confirm in Wallet..."
            : isConfirming
            ? "⛓️ Minting on Base..."
            : "✨ Mint My Vibe NFT"}
        </button>
      )}

      {isConnected && address && (
        <p className="mt-3 text-xs text-purple-800 font-mono">
          {address.slice(0, 6)}···{address.slice(-4)}
        </p>
      )}

      <p className="mt-6 text-xs text-purple-900 text-center">
        Free to mint · only gas fees apply
      </p>
    </main>
  );
}
