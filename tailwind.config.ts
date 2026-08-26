import type { Config } from "tailwindcss";

// Identidade Camisa 10 FC — ver identidade/design-guide.md no workspace MazyOS
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        c10: {
          blue: "#0B3D91", // destaque / CTA — tom do escudo
          "blue-dark": "#08265C", // texto principal
          orange: "#F5821F", // fundo alternativo / cards
          white: "#FFFFFF", // fundo principal
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
