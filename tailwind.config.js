/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ffb629",
        secondary: "#555f6c",
      },
      fontFamily: {
        inter: ["inter", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      animation: {
        "fade-left": "fadeLeft 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
