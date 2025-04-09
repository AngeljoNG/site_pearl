/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Segoe UI', 'sans-serif'],
      },
      colors: {
        nature: {
          50: '#edf3ec',
          100: '#dae7d8',
          200: '#a8c6a2',
          300: '#8ab582',
          400: '#6c9463',
          500: '#2e4639',
          600: '#243a2e',
          700: '#1a2d23',
          800: '#102018',
          900: '#06130d',
        },
        grapho: {
          blue: '#235789',
          orange: '#F1A208',
          red: '#C1292E',
          gray: '#020100',
          cream: '#F5F1ED',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};