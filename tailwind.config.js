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
        sans: ['KoPubBatang', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
        kopub: ['KoPubBatang', 'serif'],
      },
    },
  },
  plugins: [],
}
