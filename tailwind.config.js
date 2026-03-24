/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2B3A52', light: '#E8EDF3', dark: '#1A2535' },
        secondary: { DEFAULT: '#6B7B8D', light: '#F0F2F5' },
        bg: { DEFAULT: '#FFFFFF', alt: '#F7F8FA' },
        accent: { DEFAULT: '#3B82F6', light: '#EFF6FF' },
        border: { DEFAULT: '#E5E7EB' },
        dark: { DEFAULT: '#1A1A1A' },
        sale: { DEFAULT: '#EF4444' },
        whatsapp: { DEFAULT: '#25D366' },
      },
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
