/**
 * Tailwind CSS Configuration
 * ==========================
 * This configuration file sets up Tailwind CSS for the FindYourShade project.
 *
 * Build commands:
 *   npm run build:css  - Build minified CSS for production
 *   npm run watch:css  - Watch for changes during development
 *
 * Output: css/tailwind.css
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  // Content paths for purging unused CSS in production
  content: [
    "./index.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      // Custom fonts from Google Fonts
      fontFamily: {
        'Kanit': ['Kanit', 'sans-serif'],           // Thai font for main content
        'Press_Start_2P': ['"Press Start 2P"', 'cursive'],  // 8-bit retro font
      },
    },
  },
  plugins: [],
}
