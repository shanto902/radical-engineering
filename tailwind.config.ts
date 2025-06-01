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
      keyframes: {
        "toast-enter-top-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(20px) translateY(-20px) scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0) translateY(0) scale(1)",
          },
        },
        "toast-leave-top-right": {
          "0%": {
            opacity: "1",
            transform: "translateX(0) translateY(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateX(20px) translateY(-10px) scale(0.95)",
          },
        },
      },
      animation: {
        enter: "toast-enter-top-right 0.3s ease-out forwards",
        leave: "toast-leave-top-right 0.3s ease-in forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
