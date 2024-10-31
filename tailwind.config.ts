import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tungsten: ["Tungsten", "sans-serif"],
      },
      fontWeight: {
        thin: "100",
        extraLight: "200",
        light: "300",
        normal: "400",
        semiBold: "600",
        bold: "700",
        black: "900",
      },
      colors: {
        background: "#0f1923",
        valorantRed: "#FD4556",
      },
    },
  },
  plugins: [],
};
export default config;
