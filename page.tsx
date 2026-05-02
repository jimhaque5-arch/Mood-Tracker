@tailwind base;
@tailwind components;
@tailwind utilities;

/* Force dark mode — Base App is always dark */
:root {
  color-scheme: dark;
}

body {
  background-color: #0A0A0A;
  color: #ffffff;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  /* Prevent horizontal scroll on mobile */
  overflow-x: hidden;
  /* Better text rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Remove tap highlight on mobile */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #1a1a2e;
}
::-webkit-scrollbar-thumb {
  background: #0052ff;
  border-radius: 2px;
}

/* Base blue glow utility */
@layer utilities {
  .glow-blue {
    box-shadow: 0 0 20px rgba(0, 82, 255, 0.3), 0 0 40px rgba(0, 82, 255, 0.1);
  }
  .glow-purple {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
  .text-gradient {
    background: linear-gradient(135deg, #0052ff, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .card-dark {
    background: #1a1a2e;
    border: 1px solid #2a2a4a;
  }
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-200 active:scale-95;
  }
}

/* Shimmer animation for loading states */
.shimmer {
  background: linear-gradient(
    90deg,
    #1a1a2e 0%,
    #2a2a4a 50%,
    #1a1a2e 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Prevent iOS rubber-band scrolling in the mini app */
body {
  overscroll-behavior: none;
}
