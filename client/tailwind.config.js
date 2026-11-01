/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}