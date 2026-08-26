import type { Config } from "tailwindcss";

// Identidade Camisa 10 FC / Perfil Camisa 10
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        c10: {
          blue: "#1E3A8A",
          "blue-dark": "#16296B",
          orange: "#F97316",
          dark: "#060E20",
          surface: "#0C1B36",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
