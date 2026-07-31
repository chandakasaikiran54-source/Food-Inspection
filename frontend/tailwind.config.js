/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                /* ── GVMC Government Palette ── */
                'gov-primary': '#3D405B',  /* Twilight Indigo */
                'gov-secondary': '#81B29A',  /* Muted Teal      */
                'gov-accent': '#E07A5F',  /* Burnt Peach     */
                'gov-highlight': '#F2CC8F',  /* Apricot Cream   */
                'gov-bg': '#F4F1DE',  /* Eggshell        */
                /* ── Legacy aliases kept for any Tailwind usage ── */
                primary: {
                    50: '#ecedf3',
                    100: '#d4d6e4',
                    200: '#b0b2cc',
                    300: '#8b8eb5',
                    400: '#676a9d',
                    500: '#4d5085',
                    600: '#3D405B',
                    700: '#2e3147',
                    800: '#252840',
                    900: '#1c1f36',
                    950: '#13152a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
                'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
                'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(4px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.85' },
                },
            },
        },
    },
    plugins: [],
};

