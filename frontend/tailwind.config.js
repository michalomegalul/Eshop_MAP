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
          50: '#edf8ff',
          100: '#d6ecff',
          200: '#b5deff',
          300: '#83cbff',
          400: '#48adff',
          500: '#1f8fff',
          600: '#0070f3',
          700: '#0057d0',
          800: '#0049a9',
          900: '#003e87',
          950: '#00275a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
    },
  },
  plugins: [],
}
