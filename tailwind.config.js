/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#0a3e53', // Existing custom color
        'custom-blue1': '#0a3e53', // New custom color
        'custom-green': '#23a76b', // New custom color
      },
      spacing: {
        '400': '400px'
      },
      animation: {
        blob: "float 20s ease-in-out infinite both alternate",
      },
      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'none',
          },
          '50%': {
            transform: 'translate(50%, 20%) rotateY(10deg) scale(1.2)',
          },
        },
      },
    },
  },
  plugins: [],
}
