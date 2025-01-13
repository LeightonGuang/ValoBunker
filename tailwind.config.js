import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
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
    },
  },
  darkMode: "class",
  darkMode: "class",
  plugins: [
    nextui({ themes: { light: { colors: {} }, dark: { colors: {} } } }),
  ],
};
