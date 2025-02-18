/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adicione suporte para TypeScript e JSX
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}

