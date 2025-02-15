/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                rubik: ['Rubik', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
            },
            colors: {
                primary: '#ED1C24',
                accent: '#2B2B2B',
                textlight: '#0F0001',
                textdark: '#FEF9F9',
                bglight: '#FEF9F9',
                bgdark: '#171717',
            },
            screens: {
                'phone': { 'max': '431px' },
                'tablet': { 'min': '1500px' },
                'tabletmax': { 'max': '1500px' },
                'pc': { 'min': '1800px' },
            },
        },
    },
    darkMode: 'class',
    plugins: [],
}