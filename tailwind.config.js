/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#f4efe6',
        clay: '#b6613b',
        clayDark: '#8f4527',
        ink: '#2c2620',
        muted: '#8a8177',
        line: '#e3dccf',
        card: '#fbf8f1',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(44,38,32,0.04), 0 8px 24px -12px rgba(44,38,32,0.14)',
        lift: '0 4px 12px rgba(44,38,32,0.08), 0 18px 40px -18px rgba(44,38,32,0.28)',
      },
    },
  },
  plugins: [],
}
