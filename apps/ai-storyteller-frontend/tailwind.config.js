/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899',
          yellow: '#F59E0B',
          green: '#10B981',
        },
        storybook: {
          bg: '#FEF3C7',
          accent: '#F59E0B',
          text: '#92400E'
        }
      },
      fontFamily: {
        'story': ['Comic Neue', 'cursive'],
        'child': ['Fredoka One', 'cursive']
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}