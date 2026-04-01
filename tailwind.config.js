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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // Medical Blue
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Hospital Green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          orange: '#f97316',
          yellow: '#eab308',
        },
        surface: {
          white: '#ffffff',
          light: '#f8fafc',
          border: '#e2e8f0',
        }
      },
      borderRadius: {
        'large': '20px',
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'medium': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'premium': '0 20px 40px -10px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
