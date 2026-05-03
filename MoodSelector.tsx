export const CONTRACT_ADDRESS = "0x786943cC2bbC0149A71B63fA1782298E1AA82091" as `0x${string}`;

export const CONTRACT_ABI = [
  { name: "logMood", type: "function", stateMutability: "nonpayable", inputs: [{ name: "_mood", type: "uint8" }], outputs: [] },
  { name: "getUserMoodHistory", type: "function", stateMutability: "view", inputs: [{ name: "_user", type: "address" }], outputs: [{ name: "", type: "tuple[]", components: [{ name: "mood", type: "uint8" }, { name: "timestamp", type: "uint32" }] }] },
  { name: "hasSubmittedToday", type: "function", stateMutability: "view", inputs: [{ name: "_user", type: "address" }], outputs: [{ name: "", type: "bool" }] },
  { name: "getTodayMood", type: "function", stateMutability: "view", inputs: [{ name: "_user", type: "address" }], outputs: [{ name: "mood", type: "uint8" }, { name: "timestamp", type: "uint32" }, { name: "exists", type: "bool" }] },
  { name: "getGlobalStats", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "counts", type: "uint256[7]" }, { name: "total", type: "uint256" }] },
  { name: "getUserStreak", type: "function", stateMutability: "view", inputs: [{ name: "_user", type: "address" }], outputs: [{ name: "streak", type: "uint256" }] },
  { name: "totalSubmissions", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
] as const;

export const MOODS = [
  { id: 0, emoji: "😄", label: "Happy",    color: "from-yellow-400 to-orange-400", bg: "bg-yellow-500/20", border: "border-yellow-500/40", text: "text-yellow-300", chart: "#fbbf24" },
  { id: 1, emoji: "😢", label: "Sad",      color: "from-blue-400 to-indigo-400",   bg: "bg-blue-500/20",   border: "border-blue-500/40",   text: "text-blue-300",   chart: "#60a5fa" },
  { id: 2, emoji: "🤩", label: "Excited",  color: "from-purple-400 to-pink-400",   bg: "bg-purple-500/20", border: "border-purple-500/40", text: "text-purple-300", chart: "#c084fc" },
  { id: 3, emoji: "😡", label: "Angry",    color: "from-red-400 to-rose-400",      bg: "bg-red-500/20",    border: "border-red-500/40",    text: "text-red-300",    chart: "#f87171" },
  { id: 4, emoji: "😌", label: "Calm",     color: "from-green-400 to-teal-400",    bg: "bg-green-500/20",  border: "border-green-500/40",  text: "text-green-300",  chart: "#34d399" },
  { id: 5, emoji: "😰", label: "Anxious",  color: "from-amber-400 to-yellow-400",  bg: "bg-amber-500/20",  border: "border-amber-500/40",  text: "text-amber-300",  chart: "#fb923c" },
  { id: 6, emoji: "🙏", label: "Grateful", color: "from-teal-400 to-cyan-400",     bg: "bg-teal-500/20",   border: "border-teal-500/40",   text: "text-teal-300",   chart: "#2dd4bf" },
] as const;

export function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
export function timeAgo(ts: number) {
  const s = Math.floor(Date.now() / 1000 - ts);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
