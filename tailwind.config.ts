import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark surfaces — near-black enterprise palette
        base: {
          900: "#0D1117",
          800: "#161B22",
          700: "#1C2333",
          600: "#222B3A",
        },
        // Primary accent — electric cyan
        accent: {
          DEFAULT: "#00D4FF",
          dim: "#0A8FB0",
        },
        // Per-hyperscaler brand colours
        microsoft: "#00BCF2",
        google: "#4285F4",
        aws: "#FF9900",
        anthropic: "#C4622D",
        ink: {
          100: "#E6EDF3",
          300: "#9DA7B3",
          500: "#6B7685",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-overlay":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      boxShadow: {
        glass: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
        "glow-accent": "0 0 0 1px rgba(0,212,255,0.25), 0 18px 50px -12px rgba(0,212,255,0.35)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.85)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(239,68,68,0.55)" },
          "50%": { boxShadow: "0 0 0 8px rgba(239,68,68,0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 1.8s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
