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
        paper: '#f6f3ec',
        clay: '#5c7183',
        clayDark: '#455767',
        ink: '#33302a',
        muted: '#978d7e',
        line: '#ece6da',
        card: '#fbf9f4',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(52,48,42,0.03), 0 6px 20px -14px rgba(52,48,42,0.10)',
        lift: '0 2px 8px rgba(52,48,42,0.05), 0 16px 38px -22px rgba(52,48,42,0.20)',
      },
    },
  },
  plugins: [],
}
