/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        auralis: {
          blue: '#a8d4e6',
          green: '#7cb083',
          'green-dark': '#5a8f5e',
          'blue-dark': '#5b8fa8',
          purple: '#4a5568',
          'purple-dark': '#2d3748',
        },
      },
      fontFamily: {
        cursive: ['"Dancing Script"', 'cursive'],
      },
    },
  },
  plugins: [],
};
