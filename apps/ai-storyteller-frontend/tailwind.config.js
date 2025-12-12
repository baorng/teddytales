/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, storybook-inspired palette
        cream: {
          50: '#FFFEF9',
          100: '#FFF9ED',
          200: '#FFF3D6',
          300: '#FFEDC2',
          400: '#FFE4A3',
          500: '#FFD885',
        },
        earth: {
          50: '#FAF6F1',
          100: '#F3EAE0',
          200: '#E6D5C1',
          300: '#D4B99E',
          400: '#C09E7B',
          500: '#A67C52',
          600: '#8B5C2E',
          700: '#6B4423',
          800: '#4A2F18',
          900: '#2D1E0F',
        },
        sage: {
          50: '#F5F7F4',
          100: '#E8ECE5',
          200: '#D1D9CB',
          300: '#B5C3AB',
          400: '#96AA88',
          500: '#7A9170',
          600: '#5F7356',
        },
        sunset: {
          50: '#FFF5F1',
          100: '#FFE8DF',
          200: '#FFD1BF',
          300: '#FFB399',
          400: '#FF8F6B',
          500: '#FF6B3D',
          600: '#E84A1F',
        },
        sky: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAD9FF',
          300: '#8AC0FF',
          400: '#4DA3FF',
          500: '#1E88E5',
          600: '#1565C0',
        },
        lavender: {
          50: '#F8F5FF',
          100: '#F0E8FF',
          200: '#E0D1FF',
          300: '#C9B3FF',
          400: '#B08FFF',
          500: '#9575CD',
          600: '#7E57C2',
        }
      },
      fontFamily: {
        'display': ['Quicksand', 'sans-serif'],
        'story': ['Crimson Text', 'serif'],
        'hand': ['Caveat', 'cursive'],
        'casual': ['Patrick Hand', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'page-turn': 'page-turn 0.6s ease-in-out',
      },
      boxShadow: {
        'page': '0 4px 6px -1px rgba(139, 92, 46, 0.15), 0 2px 4px -1px rgba(139, 92, 46, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        'book': '0 10px 25px -5px rgba(139, 92, 46, 0.3), 0 6px 10px -3px rgba(139, 92, 46, 0.2)',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}