/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light_hover: '#e2eacb',
        light: '#e8e4cd',
        dark: '#0d0f05',
        dark_hover: '#4c4c4c',
        accent2: '#cfdbdf',
        nomnom: '#12250a'
      },
    },
  },
  plugins: [],
}
