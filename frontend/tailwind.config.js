/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C2321",
        slate: "#3A4A45",
        moss: "#4C6B57",
        clay: "#C97B4A",
        sand: "#F4F0E8",
        line: "#DCD5C6",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
