/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cdc: {
          green: '#00732E',   // Official AU Green
          gold: '#C69214',    // Official AU Gold
          red: '#D21034',     // Alert Red
          dark: '#1E1E1E',    // Black text
          light: '#F5F5F5',   // Background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Clean, modern font
      }
    },
  },
  plugins: [],
}