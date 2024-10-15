/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a3e635', // Adjust as needed
          DEFAULT: '#10b981',
          dark: '#047857',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  darkMode: false, // or 'media' or 'class'
  plugins: [],
};

