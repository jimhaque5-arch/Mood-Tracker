"use client";

import { useReadContract } from "wagmi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { CONTRACT_ADDRESS, CONTRACT_ABI, MOODS } from "@/lib/contract";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-white/10 rounded-xl p-3 shadow-xl text-center">
        <p className="text-3xl">{d.emoji}</p>
        <p className="text-white font-bold text-sm">{d.label}</p>
        <p className="text-indigo-300 text-xs mt-0.5">{d.count} submissions</p>
      </div>
    );
  }
  return null;
};

export function GlobalStats() {
  const { data: statsData, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getGlobalStats",
  });

  const { data: totalSubmissions } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "totalSubmissions",
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-12 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-48 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />
      </div>
    );
  }

  const counts = statsData?.[0];
  if (!counts) return null;

  const chartData = MOODS.map((mood, i) => ({
    label: mood.label,
    emoji: mood.emoji,
    count: Number(counts[i]),
    color: mood.chart,
  }));

  const total = chartData.reduce((s, d) => s + d.count, 0);
  const topMood = [...chartData].sort((a, b) => b.count - a.count)[0];
  const sorted = [...chartData].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-gray-400 text-xs mb-1">Total On-Chain Moods</p>
          <p className="text-white text-2xl font-bold">
            {totalSubmissions?.toString() ?? "0"}
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-gray-400 text-xs mb-1">Most Popular</p>
          <p className="text-white text-xl font-bold">
            {total > 0 ? `${topMood.emoji} ${topMood.label}` : "—"}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      {total > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-48"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <XAxis
                dataKey="emoji"
                tick={{ fontSize: 20 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#4b5563", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={44}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} opacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
          No moods logged yet — be the first! 🌟
        </div>
      )}

      {/* Progress bars */}
      <div className="space-y-2">
        {sorted.map((item, i) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg w-7 text-center">{item.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-gray-600">{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: i * 0.07 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
              <span className="text-gray-600 text-xs w-6 text-right">{item.count}</span>
            </div>
          );
        })}
      </div>

      <p className="text-center text-gray-700 text-xs">
        Live data from Base Mainnet ·{" "}
        <a
          href={`https://basescan.org/address/0x786943cC2bbC0149A71B63fA1782298E1AA82091`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-400"
        >
          View contract ↗
        </a>
      </p>
    </div>
  );
}
