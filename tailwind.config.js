/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
      colors: {
        gold: {
          400: '#facc15',
          500: '#c9a84c',
          600: '#b8922a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        shimmer: 'shimmer 1.5s infinite',
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        luxury: '0 4px 40px rgba(0,0,0,0.08)',
        'luxury-lg': '0 8px 60px rgba(0,0,0,0.12)',
        gold: '0 4px 20px rgba(201,168,76,0.3)',
      },
    },
  },
  plugins: [],
};
