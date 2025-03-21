/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light_hover: 'rgba(247,153,94,0.89)',  // Blue
        //light: '#acc7d3',-
        light: '#cdccc9',
        //dark: '#0d0f05', // Darker Blue
        dark: '#0d0f05', // Darker Blue
        dark_hover: '#4c4c4c', // Darker Blue
        accent: '#1b250b',      // Green
      },
    },
  },
  plugins: [],
};
