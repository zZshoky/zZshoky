import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:        "#0F3460",
        "primary-dark": "#0A2647",
        accent:         "#E94560",
        "accent-light": "#FF6B6B",
        success:        "#06D6A0",
        warning:        "#FFD166",
        surface:        "#F8FAFC",
        "surface-dark": "#E2E8F0",
        text:           "#1E293B",
        "text-light":   "#64748B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
