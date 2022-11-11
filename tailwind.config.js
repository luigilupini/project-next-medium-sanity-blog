/** @type {import('tailwindcss').Config} */

const colors = {
  "custom-yellow": {
    medium: "#FFBF17",
  },
};

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        GtSuper: ["GtSuper"],
      },
      colors: colors,
    },
  },
  plugins: [],
};
