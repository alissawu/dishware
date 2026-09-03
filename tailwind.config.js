/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#f3ede1',
        clay: '#5c7183',
        clayDark: '#455767',
        ink: '#332e27',
        muted: '#8f8574',
        line: '#e6ddcd',
        card: '#faf6ed',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(52,48,42,0.03), 0 6px 20px -14px rgba(52,48,42,0.10)',
        lift: '0 2px 8px rgba(52,48,42,0.05), 0 16px 38px -22px rgba(52,48,42,0.20)',
      },
    },
  },
  plugins: [],
}
