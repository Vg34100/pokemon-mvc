import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pokedexRed: "#ff0000",
        pokedexBlack: "#171717",
        pokedexWhite: "#ffffff",
      },
      boxShadow: {
        pokedexGray: "0 4px 6px -1px rgba(128, 128, 128, 0.5), 0 2px 4px -2px rgba(128, 128, 128, 0.25)",
      },
      fontFamily: {
        pokemon: ['"Flexo-Demi"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
