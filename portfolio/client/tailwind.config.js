/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bgDark: "#030712",
        bgCard: "#0f172a",
        bgCardHover: "#1e293b",
        primary: "#06b6d4",
        secondary: "#6366f1",
      },
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(6, 182, 212, 0.15)",
      },
    },
  },
  plugins: [],
}
