import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#E1EEBC",
          soft: "#90C67C",
          DEFAULT: "#328E6E",
          dark: "#245F4B",
        },
      },
      fontFamily: {
        sinhala: ["var(--font-noto-sinhala)", "sans-serif"],
        tamil: ["var(--font-noto-tamil)", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
