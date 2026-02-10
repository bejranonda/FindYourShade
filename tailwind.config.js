/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Kanit': ['Kanit', 'sans-serif'],
        'Press_Start_2P': ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [],
}
