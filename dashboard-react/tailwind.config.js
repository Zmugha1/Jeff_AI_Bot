/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#2D4459',
          teal: '#3BBFBF',
          mint: '#C8E8E5',
          coral: '#F05F57',
          burnt: '#C8613F',
          blush: '#E8A99A',
          slate: '#7A8F95',
          cream: '#FEFAF5',
          offwhite: '#F4F7F8',
          white: '#ffffff',
        },
        sidebar: {
          DEFAULT: '#2D4459',
          hover: '#253545',
          active: '#3d5a73',
        },
        primary: {
          50: '#E8F8F8',
          100: '#C8E8E5',
          200: '#9FD9D9',
          300: '#6BC9C9',
          400: '#3BBFBF',
          500: '#2FA8A8',
          600: '#268A8A',
          700: '#1F6F6F',
          800: '#1A5C5C',
          900: '#2D4459',
        },
        success: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        danger: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
