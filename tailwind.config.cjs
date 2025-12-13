/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  corePlugins: {
    preflight: false // Disable Tailwind's base styles to prevent interference with Angular Material
  },
  theme: {
    extend: {}
  },
  plugins: []
};
