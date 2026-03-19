/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
