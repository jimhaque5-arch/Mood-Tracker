"use client";

// ─────────────────────────────────────────────────────────────────────────────
// NFTPreview — Live SVG card that shows what the NFT will look like
// Updates in real-time as the user picks an emoji and types their vibe
// ─────────────────────────────────────────────────────────────────────────────

interface NFTPreviewProps {
  emoji: string;
  vibe: string;
  address?: string;
}

// Map emojis to background gradient colors
const EMOJI_GRADIENTS: Record<string, [string, string, string]> = {
  "🔥": ["#FF4500", "#FF8C00", "#FFD700"],
  "✨": ["#7C3AED", "#A855F7", "#EC4899"],
  "💜": ["#4C1D95", "#7C3AED", "#A78BFA"],
  "🚀": ["#1E3A8A", "#1D4ED8", "#3B82F6"],
  "🌊": ["#0C4A6E", "#0284C7", "#38BDF8"],
  "⚡": ["#713F12", "#D97706", "#FCD34D"],
  "🎯": ["#7F1D1D", "#DC2626", "#F87171"],
  "🌙": ["#1E1B4B", "#4338CA", "#818CF8"],
  "💎": ["#164E63", "#0E7490", "#22D3EE"],
  "🦋": ["#701A75", "#C026D3", "#E879F9"],
};

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function wrapText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const lines: string[] = [];
  let remaining = text;
  while (remaining.length > maxChars) {
    const idx = remaining.lastIndexOf(" ", maxChars);
    if (idx === -1) {
      lines.push(remaining.slice(0, maxChars));
      remaining = remaining.slice(maxChars);
    } else {
      lines.push(remaining.slice(0, idx));
      remaining = remaining.slice(idx + 1);
    }
  }
  if (remaining) lines.push(remaining);
  return lines;
}

export function NFTPreview({ emoji, vibe, address }: NFTPreviewProps) {
  const gradient = EMOJI_GRADIENTS[emoji] || ["#1a1a2e", "#2a2a4a", "#3a3a6a"];
  const displayVibe = vibe || "Your vibe here...";
  const vibeLines = wrapText(displayVibe, 16);
  const isEmpty = !vibe && !emoji;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Label */}
      <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
        Live Preview
      </p>

      {/* SVG Card */}
      <div
        className={`relative transition-all duration-500 ${
          isEmpty ? "opacity-40" : "opacity-100"
        }`}
        style={{ filter: isEmpty ? "blur(1px)" : "none" }}
      >
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          xmlns="http://www.w3.org/2000/svg"
          className="rounded-3xl"
          style={{
            boxShadow: isEmpty
              ? "none"
              : `0 0 30px ${gradient[0]}66, 0 0 60px ${gradient[0]}33`,
          }}
        >
          <defs>
            {/* Background gradient */}
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient[0]} />
              <stop offset="50%" stopColor={gradient[1]} />
              <stop offset="100%" stopColor={gradient[2]} />
            </linearGradient>

            {/* Noise texture overlay */}
            <filter id="noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="overlay" />
            </filter>

            {/* Inner glow */}
            <radialGradient id="glow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>

            {/* Card border gradient */}
            <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>

            <clipPath id="roundedRect">
              <rect width="280" height="280" rx="24" ry="24" />
            </clipPath>
          </defs>

          {/* Background */}
          <rect
            width="280"
            height="280"
            rx="24"
            fill="url(#bgGrad)"
          />

          {/* Inner glow layer */}
          <rect
            width="280"
            height="280"
            rx="24"
            fill="url(#glow)"
          />

          {/* Decorative circles */}
          <circle cx="240" cy="40" r="60" fill="rgba(255,255,255,0.05)" />
          <circle cx="40" cy="240" r="80" fill="rgba(0,0,0,0.1)" />
          <circle cx="140" cy="140" r="120" fill="rgba(255,255,255,0.02)" />

          {/* Border */}
          <rect
            width="278"
            height="278"
            rx="23"
            x="1"
            y="1"
            fill="none"
            stroke="url(#borderGrad)"
            strokeWidth="1.5"
          />

          {/* "VIBE NFT" top label */}
          <text
            x="20"
            y="32"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize="10"
            fontWeight="600"
            fill="rgba(255,255,255,0.5)"
            letterSpacing="3"
          >
            VIBE NFT
          </text>

          {/* Base chain label top right */}
          <text
            x="260"
            y="32"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize="10"
            fontWeight="600"
            fill="rgba(255,255,255,0.5)"
            letterSpacing="2"
            textAnchor="end"
          >
            BASE
          </text>

          {/* Divider line */}
          <line
            x1="20"
            y1="42"
            x2="260"
            y2="42"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Giant emoji */}
          <text
            x="140"
            y="145"
            fontFamily="'Apple Color Emoji', 'Segoe UI Emoji', sans-serif"
            fontSize="80"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {emoji || "✨"}
          </text>

          {/* Divider line bottom */}
          <line
            x1="20"
            y1="195"
            x2="260"
            y2="195"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Vibe text */}
          {vibeLines.map((line, i) => (
            <text
              key={i}
              x="140"
              y={215 + i * 20}
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={vibe.length > 20 ? "14" : "16"}
              fontWeight="700"
              fill="rgba(255,255,255,0.95)"
              textAnchor="middle"
            >
              {line}
            </text>
          ))}

          {/* Wallet address at bottom */}
          <text
            x="140"
            y="265"
            fontFamily="'Courier New', monospace"
            fontSize="9"
            fill="rgba(255,255,255,0.35)"
            textAnchor="middle"
            letterSpacing="1"
          >
            {address ? truncateAddress(address) : "0x????...????"}
          </text>
        </svg>
      </div>

      {isEmpty && (
        <p className="text-xs text-gray-600 text-center">
          Pick an emoji and write your vibe to preview
        </p>
      )}
    </div>
  );
}
