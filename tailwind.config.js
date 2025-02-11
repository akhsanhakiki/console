import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./general-components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        brand: {
          100: "#CBFFFF",
          200: "#9EFCFF",
          300: "#5BF6FF",
          400: "#00E5FF",
          500: "#00C9E5",
          600: "#00A0C0",
          700: "#037F9B",
          800: "#0D657D",
          900: "#105469",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              100: "#CBFFFF",
              200: "#9EFCFF",
              300: "#5BF6FF",
              400: "#00E5FF",
              500: "#00C9E5",
              600: "#00A0C0",
              700: "#037F9B",
              800: "#0D657D",
              900: "#105469",
              DEFAULT: "#00C9E5",
            },
            // ... rest of the colors
          },
        },
      },
    }),
  ],
};
