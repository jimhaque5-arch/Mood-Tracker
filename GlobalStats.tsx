"use client";

import { useAccount, useReadContract } from "wagmi";
import { motion } from "framer-motion";
import { CONTRACT_ADDRESS, CONTRACT_ABI, MOODS, formatDate, timeAgo } from "@/lib/contract";

export function MoodHistory() {
  const { address, isConnected } = useAccount();

  const { data: history, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserMoodHistory",
    args: [address!],
    query: { enabled: !!address },
  });

  const { data: streak } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserStreak",
    args: [address!],
    query: { enabled: !!address },
  });

  if (!isConnected) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p className="text-4xl mb-2">🔗</p>
        <p>Connect wallet to see your history</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  const entries = history ? [...history].reverse() : [];
  const streakNum = streak ? Number(streak) : 0;

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-white font-bold text-lg leading-none">{streakNum}</p>
            <p className="text-orange-400 text-xs mt-0.5">Day streak</p>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <p className="text-white font-bold text-lg leading-none">{entries.length}</p>
            <p className="text-indigo-400 text-xs mt-0.5">Total moods</p>
          </div>
        </div>
      </div>

      {/* Streak message */}
      {streakNum >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-orange-400 bg-orange-500/10 rounded-xl py-2 px-3 border border-orange-500/20"
        >
          🔥 {streakNum >= 7 ? "You're on fire!" : streakNum >= 3 ? "Great consistency!" : ""}{" "}
          {streakNum}-day streak — keep it going!
        </motion.div>
      )}

      {/* History list */}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <p className="text-4xl">📭</p>
            <p className="text-gray-500 text-sm">No moods logged yet</p>
            <p className="text-gray-600 text-xs">Log your first mood on the Log tab!</p>
          </div>
        ) : (
          entries.map((entry, i) => {
            const mood = MOODS[entry.mood];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${mood.bg} border ${mood.border} transition-colors`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${mood.text}`}>{mood.label}</p>
                  <p className="text-gray-500 text-xs">{formatDate(entry.timestamp)}</p>
                </div>
                <span className="text-gray-600 text-xs shrink-0">
                  {timeAgo(entry.timestamp)}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
