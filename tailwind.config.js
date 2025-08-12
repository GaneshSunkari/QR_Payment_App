/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Crucial for Vite's main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Crucial for all your React components
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define 'inter' as a custom font family
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}