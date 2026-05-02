"use client";

import { useState, useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseEther } from "viem";
import { base } from "wagmi/chains";
import { NFTPreview } from "./NFTPreview";
import { SuccessScreen } from "./SuccessScreen";
import { WalletButton } from "./WalletButton";
import {
  VIBE_EMOJIS,
  VIBE_NFT_ABI,
  CONTRACT_ADDRESS,
} from "@/lib/contract";

// ─────────────────────────────────────────────────────────────────────────────
// VibeMinter — Main component
// Handles: emoji pick → text input → NFT preview → mint → success
// ─────────────────────────────────────────────────────────────────────────────

type AppState = "minting" | "success";

const MAX_VIBE_LENGTH = 30;

export function VibeMinter() {
  const { address, isConnected, chainId } = useAccount();
  const isBaseNetwork = chainId === base.id;

  // ── Local state ─────────────────────────────────────────────────────────
  const [appState, setAppState] = useState<AppState>("minting");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [vibeText, setVibeText] = useState<string>("");
  const [mintedTxHash, setMintedTxHash] = useState<string>("");

  // ── Contract: read mint price ─────────────────────────────────────────
  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VIBE_NFT_ABI,
    functionName: "mintPrice",
    chainId: base.id,
  });

  // ── Contract: read total supply ───────────────────────────────────────
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VIBE_NFT_ABI,
    functionName: "totalSupply",
    chainId: base.id,
  });

  // ── Contract: write (mint) ────────────────────────────────────────────
  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  // Wait for tx confirmation on-chain
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    onReplaced: () => {}, // handle tx replacement gracefully
  });

  // When tx is confirmed, switch to success screen
  if (isConfirmed && txHash && appState !== "success") {
    setMintedTxHash(txHash);
    setAppState("success");
  }

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      setSelectedEmoji((prev) => (prev === emoji ? "" : emoji));
      if (isWriteError) resetWrite();
    },
    [isWriteError, resetWrite]
  );

  const handleVibeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length <= MAX_VIBE_LENGTH) {
        setVibeText(e.target.value);
      }
      if (isWriteError) resetWrite();
    },
    [isWriteError, resetWrite]
  );

  const handleMint = useCallback(() => {
    if (!selectedEmoji || !vibeText.trim() || !isConnected) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VIBE_NFT_ABI,
      functionName: "mint",
      args: [selectedEmoji, vibeText.trim()],
      // Include mint price if contract requires it
      value: mintPrice ? (mintPrice as bigint) : parseEther("0"),
      chainId: base.id,
    });
  }, [selectedEmoji, vibeText, isConnected, writeContract, mintPrice]);

  const handleMintAnother = useCallback(() => {
    setAppState("minting");
    setSelectedEmoji("");
    setVibeText("");
    setMintedTxHash("");
    resetWrite();
  }, [resetWrite]);

  // ── Error message helper ─────────────────────────────────────────────
  const getErrorMessage = () => {
    if (!writeError) return null;
    const msg = writeError.message || "";
    if (msg.includes("User rejected") || msg.includes("user rejected"))
      return "Transaction cancelled. Try again!";
    if (msg.includes("insufficient funds"))
      return "Not enough ETH on Base for gas. Add some ETH to your wallet.";
    if (msg.includes("execution reverted"))
      return "Contract reverted. Check your inputs or try again.";
    return "Transaction failed. Please try again.";
  };

  // ── Render: Success screen ───────────────────────────────────────────
  if (appState === "success" && mintedTxHash) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] px-4 py-6 overflow-y-auto">
        <div className="max-w-sm mx-auto">
          <SuccessScreen
            emoji={selectedEmoji}
            vibe={vibeText}
            txHash={mintedTxHash}
            address={address || ""}
            onMintAnother={handleMintAnother}
          />
        </div>
      </div>
    );
  }

  // ── Render: Main minting UI ──────────────────────────────────────────
  const canMint =
    isConnected &&
    isBaseNetwork &&
    selectedEmoji !== "" &&
    vibeText.trim().length >= 1 &&
    !isWritePending &&
    !isConfirming;

  const isBusy = isWritePending || isConfirming;

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-6 overflow-y-auto">
      <div className="max-w-sm mx-auto space-y-6 pb-8">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="text-center space-y-1 pt-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">⚡</span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Vibe NFT Minter
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Your vibe. On-chain. Forever.{" "}
            {totalSupply !== undefined && (
              <span className="text-blue-400 font-semibold">
                {Number(totalSupply).toLocaleString()} minted
              </span>
            )}
          </p>
        </div>

        {/* ── Wallet ─────────────────────────────────────────────────── */}
        <WalletButton />

        {/* ── Step 1: Pick Emoji ──────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
              1
            </span>
            <p className="text-white font-semibold text-sm">Pick your vibe emoji</p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {VIBE_EMOJIS.map(({ emoji, label }) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                title={label}
                disabled={isBusy}
                className={`
                  aspect-square flex items-center justify-center text-3xl rounded-2xl
                  transition-all duration-200 active:scale-90
                  ${
                    selectedEmoji === emoji
                      ? "bg-blue-600 ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0A0A0A] scale-105"
                      : "bg-[#1a1a2e] border border-[#2a2a4a] hover:border-blue-500/50 hover:bg-[#1e1e38]"
                  }
                  ${isBusy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                aria-label={label}
                aria-pressed={selectedEmoji === emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 2: Write Vibe ──────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
              2
            </span>
            <p className="text-white font-semibold text-sm">Write your vibe</p>
          </div>

          <div className="relative">
            <input
              type="text"
              value={vibeText}
              onChange={handleVibeChange}
              placeholder="gm, building on Base..."
              maxLength={MAX_VIBE_LENGTH}
              disabled={isBusy}
              className={`
                w-full bg-[#1a1a2e] border rounded-2xl px-4 py-4 text-white
                placeholder-gray-600 text-base font-medium
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                ${
                  vibeText.length === MAX_VIBE_LENGTH
                    ? "border-orange-500/50"
                    : "border-[#2a2a4a] hover:border-[#3a3a6a]"
                }
              `}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
            />
            {/* Character count */}
            <div
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono tabular-nums ${
                vibeText.length === MAX_VIBE_LENGTH
                  ? "text-orange-400"
                  : "text-gray-600"
              }`}
            >
              {vibeText.length}/{MAX_VIBE_LENGTH}
            </div>
          </div>
        </div>

        {/* ── Step 3: Live NFT Preview ─────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
              3
            </span>
            <p className="text-white font-semibold text-sm">Preview your NFT</p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-3xl p-4 flex justify-center">
            <NFTPreview
              emoji={selectedEmoji}
              vibe={vibeText}
              address={address}
            />
          </div>
        </div>

        {/* ── Error ──────────────────────────────────────────────────── */}
        {isWriteError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-xl flex-shrink-0">❌</span>
            <div>
              <p className="text-red-400 text-sm font-semibold">Mint failed</p>
              <p className="text-red-400/70 text-xs mt-0.5">
                {getErrorMessage()}
              </p>
            </div>
          </div>
        )}

        {/* ── Mint Button ─────────────────────────────────────────────── */}
        <button
          onClick={handleMint}
          disabled={!canMint}
          className={`
            w-full py-5 rounded-3xl font-black text-lg tracking-tight
            transition-all duration-300 relative overflow-hidden
            ${
              canMint
                ? "bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white glow-blue shadow-2xl"
                : "bg-[#1a1a2e] border border-[#2a2a4a] text-gray-600 cursor-not-allowed"
            }
          `}
          aria-label="Mint My Vibe NFT"
        >
          {/* Shimmer effect when active */}
          {canMint && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{
                animation: "shimmer 2s linear infinite",
                backgroundSize: "200% 100%",
              }}
            />
          )}

          <span className="relative z-10 flex items-center justify-center gap-2">
            {isWritePending ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Confirm in wallet...
              </>
            ) : isConfirming ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Minting on Base...
              </>
            ) : !isConnected ? (
              "Connect Wallet First"
            ) : !isBaseNetwork ? (
              "Switch to Base Mainnet"
            ) : !selectedEmoji ? (
              "Pick an Emoji First"
            ) : !vibeText.trim() ? (
              "Write Your Vibe First"
            ) : (
              <>
                🚀 Mint My Vibe NFT
              </>
            )}
          </span>
        </button>

        {/* ── Mint price note ──────────────────────────────────────────── */}
        {mintPrice && (mintPrice as bigint) > 0n && (
          <p className="text-center text-gray-600 text-xs">
            Mint price:{" "}
            <span className="text-gray-400 font-mono">
              {Number(mintPrice as bigint) / 1e18} ETH
            </span>{" "}
            + gas
          </p>
        )}

        {/* ── Contract info ────────────────────────────────────────────── */}
        <div className="text-center space-y-1">
          <a
            href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-500 text-xs font-mono transition-colors"
          >
            {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)} ↗
          </a>
          <p className="text-gray-800 text-xs">Base Mainnet · ERC-721</p>
        </div>
      </div>
    </div>
  );
}
