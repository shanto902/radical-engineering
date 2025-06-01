import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        backgroundDark: "#181818",
        backgroundLight: "#f6f2ed",
        imageBgPrimary: "#3c1100",
        imageBgPrimaryDark: "#ff8533",
      },
    },
  },
  plugins: [],
} satisfies Config;
