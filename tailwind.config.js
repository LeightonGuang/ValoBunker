import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["tungsten", "var(--font-sans)"],
        mono: ["tungsten", "var(--font-mono)"],
      },
    },
    colors: {
      darkBlue: "#0f1923",
      valorantRed: "#FD4556",
      white: "#fff",
      black: "#000",
      blurple: "#5865F2",
      radianite: "#60efb7",
      blue: "#87CEEB",
    },
  },
  darkMode: "class",
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        fontSize: {
          tiny: "0.875rem",
          small: "1.125rem",
          medium: "1.25rem",
          large: "1.875rem",
          DEFAULT: "1rem",
        },
      },
      themes: { light: { colors: {} }, dark: { colors: {} } },
    }),
  ],
};
