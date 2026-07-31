/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e8f1fb',
                    100: '#c5d9f5',
                    200: '#9ebeed',
                    300: '#77a3e5',
                    400: '#5a8fdf',
                    500: '#3d7bd9',
                    600: '#1a6fc4',
                    700: '#135399',
                    800: '#0d3d73',
                    900: '#08274d',
                },
                sidebar: '#0f2544',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
