import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--aetheris-bg) / <alpha-value>)",
        surface: "rgb(var(--aetheris-surface) / <alpha-value>)",
        raised: "rgb(var(--aetheris-raised) / <alpha-value>)",
        edge: "rgb(var(--aetheris-border) / <alpha-value>)",
        ink: "rgb(var(--aetheris-fg) / <alpha-value>)",
        muted: "rgb(var(--aetheris-muted) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--aetheris-accent) / <alpha-value>)",
          strong: "rgb(var(--aetheris-accent-strong) / <alpha-value>)",
          soft: "var(--aetheris-accent-soft)"
        },
        success: "rgb(var(--aetheris-success) / <alpha-value>)",
        danger: "rgb(var(--aetheris-danger) / <alpha-value>)",
        warning: "rgb(var(--aetheris-warning) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fade-in": "fade-in 180ms ease-out"
      }
    }
  },
  plugins: []
};

export default config;
