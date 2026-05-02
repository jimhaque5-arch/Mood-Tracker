"use client";

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { motion } from "framer-motion";
import { WalletButton } from "@/components/WalletButton";
import { MoodSelector } from "@/components/MoodSelector";
import { MoodHistory } from "@/components/MoodHistory";
import { GlobalStats } from "@/components/GlobalStats";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";

type Tab = "log" | "history" | "community";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "log", label: "Log Mood", emoji: "✍️" },
  { id: "history", label: "My History", emoji: "📅" },
  { id: "community", label: "Community", emoji: "🌍" },
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("log");
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: hasSubmittedToday, refetch: refetchSubmitted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasSubmittedToday",
    args: [address!],
    query: { enabled: !!address },
  });

  const { data: todayMoodData, refetch: refetchTodayMood } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTodayMood",
    args: [address!],
    query: { enabled: !!address },
  });

  const todayMoodId = todayMoodData?.[2] ? Number(todayMoodData[0]) : null;

  const handleSuccess = () => {
    refetchSubmitted();
    refetchTodayMood();
    setRefreshKey((k) => k + 1);
    setTimeout(() => setActiveTab("history"), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07070f] text-white selection:bg-indigo-500/30">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[-5%] w-[300px] h-[300px] bg-blue-600/6 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/30 backdrop-blur-md">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
              className="text-2xl"
            >
              🌈
            </motion.div>
            <div>
              <h1 className="font-bold text-white text-sm leading-tight">Mood Tracker</h1>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <p className="text-[10px] text-gray-500">On Base Mainnet</p>
              </div>
            </div>
          </div>
          <WalletButton />
        </div>
      </header>

      <main className="relative max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Hero — only when not connected */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 space-y-4"
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-6xl"
            >
              😄🎭🌟
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Feelings, On-Chain
              </h2>
              <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">
                Log your daily mood on Base blockchain. Permanent, transparent, yours forever.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {["⛓️ Base Mainnet", "🔐 Non-Custodial", "📊 Community Stats", "🔥 Streak System"].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-gray-400 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <span>{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="rounded-3xl bg-white/[0.04] border border-white/8 backdrop-blur-sm p-6"
        >
          {activeTab === "log" && (
            <MoodSelector
              key={refreshKey}
              hasSubmittedToday={!!hasSubmittedToday}
              todayMoodId={todayMoodId}
              onSuccess={handleSuccess}
            />
          )}
          {activeTab === "history" && (
            <div>
              <h3 className="text-base font-bold text-white mb-4">📅 Your Mood Journey</h3>
              <MoodHistory key={refreshKey} />
            </div>
          )}
          {activeTab === "community" && (
            <div>
              <h3 className="text-base font-bold text-white mb-4">🌍 Community Vibes</h3>
              <GlobalStats />
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-gray-700 text-xs pb-4">
          Built on{" "}
          <a
            href="https://base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-400 transition-colors"
          >
            Base
          </a>{" "}
          · Open source · Your moods, your keys 🔑
        </p>
      </main>
    </div>
  );
}
