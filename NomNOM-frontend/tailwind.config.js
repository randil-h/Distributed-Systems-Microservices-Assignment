/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light_hover: '#e2eacb',  // Blue
        //light: '#acc7d3',-
        light: '#e8e4cd',
        //dark: '#0d0f05', // Darker Blue
        dark: '#0d0f05', // Darker Blue
        dark_hover: '#4c4c4c', // Darker Blue
        accent: '#1e3a0f',
        accent2: '#cfdbdf',
      },
    },
  },
  plugins: [],
};
