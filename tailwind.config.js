/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index-build.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1E2A3A',
        teal: '#2DD4BF',
        coral: '#F87171',
        cream: '#F5EDD8',
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
