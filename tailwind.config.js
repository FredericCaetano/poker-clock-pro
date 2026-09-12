/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        felt: {
          bg: "#14181C",
          panel: "#1B2027",
          green: "#1F3D2B",
          gold: "#C9A15A",
          cream: "#EDEAE3",
          alert: "#8C3A3A",
        },
      },
      fontFamily: {
        display: ["'Oswald'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
