import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pr: {
          blue:  "#002868",
          red:   "#EF1828",
          gold:  "#F5C518",
        },
      },
    },
  },
} satisfies Config;
