/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mercado: {
          yellow: '#FFE600',
          blue: '#3483FA',
          green: '#00A650',
          orange: '#FF6900',
          red: '#F23C4D',
          gray: {
            100: '#F5F5F5',
            200: '#EBEBEB',
            300: '#D9D9D9',
            400: '#999999',
            500: '#666666',
            600: '#333333',
          }
        }
      },
    },
  },
  plugins: [],
}