/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ], theme: {
    extend: {
      colors: {
        'scrollbar-thumb': '#4a4a4a',
        'scrollbar-track': '#2d2d2d',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'), 
  ],
}

