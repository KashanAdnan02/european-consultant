import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        swedenblue: "#005B99",
        swedenblueDark: "#003f66",
        swedenblueDarker: "#004a7a",
        swedenyellow: "#FECC02",
        swedenyellowDark: "#e5b800",
        ink: "#1a2634",
        muted: "#5a6a7a",
        lightbg: "#f8f9fa",
        border: "#e0e5eb",
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "80%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease",
        popIn: "popIn 0.6s ease",
      },
    },
  },
  plugins: [],
};

export default config;
