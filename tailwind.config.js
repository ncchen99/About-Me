/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'theme-yellow': {
                    light: '#fff8e1',
                    DEFAULT: '#ffda85',
                    dark: '#d4b366',
                },
                'theme-amber': {
                    100: '#fff8e1',
                    200: '#ffecb3',
                    300: '#ffe082',
                    400: '#ffd54f',
                    500: '#ffca28',
                    600: '#ffb300',
                    700: '#ffa000',
                }
            },
            backgroundColor: theme => ({
                ...theme('colors'),
            }),
            textColor: theme => ({
                ...theme('colors'),
            }),
            borderColor: theme => ({
                ...theme('colors'),
            }),
            fontFamily: {
                'chenyuluoyan': ['ChenYuluoyan', 'sans-serif'],
            },
        },
    },
    plugins: [],
} 