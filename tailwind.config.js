/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: '#060e12',
        background: '#f1f7fa',
        primary: '#000000',
        secondary: '#8d98d9',
        accent: '#716acd',
      },
      fontSize: {
        sm: '0.937rem',
        base: '1rem',
        xl: '1.067rem',
        '2xl': '1.138rem',
        '3xl': '1.214rem',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark"], // Enable light and dark themes
    darkTheme: "dark", // Set the default dark theme
  },
};