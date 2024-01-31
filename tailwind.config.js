/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          'main': '#0D61FF',
          'secondary': '',
          'accent': '#0D61FF',
          'lightblue': '#2F59ED',
          'darkblue': '#02143C',
          'lightgrey': '#3a3a3c',
          'darkgrey': '#131313',
          'dark': '#000000',
          'light': '#DEDEDE',
          'gradient2': '#9F329F',
          'gradient1': '#0F61FF',


      },
      fontFamily: {
        'sans': ['"Inter"', ...defaultTheme.fontFamily.sans],
      }
    },

  },
  plugins: [
    require('@tailwindcss/forms'),
    // ...
  ],
}