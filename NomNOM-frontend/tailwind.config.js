/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light_hover: '#b0c7d1',  // Blue
        //light: '#acc7d3',-
        light: '#e1e0dd',
        //dark: '#0d0f05', // Darker Blue
        dark: '#0d0f05', // Darker Blue
        dark_hover: '#4c4c4c', // Darker Blue
        accent: '#f45844',      // Green
      },
    },
  },
  plugins: [],
};
