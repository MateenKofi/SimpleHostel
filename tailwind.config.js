/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#060e12',
        'background': '#f1f7fa',
        'primary': '#5099c5',
        'secondary': '#8d98d9',
        'accent': '#716acd',
      },
      fontSize: {
        sm: '0.937rem',
        base: '1rem',
        xl: '1.067rem',
        '2xl': '1.138rem',
        '3xl': '1.214rem',
        '4xl': '1.295rem',
        '5xl': '1.382rem',
      },
      fontFamily: {
        heading: ['poppim', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        bold: '700',
      },
    },
  },
  plugins: [],
}

