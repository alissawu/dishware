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
        paper: '#f2eee5',
        clay: '#9c7457',
        clayDark: '#795741',
        ink: '#34302a',
        muted: '#948a7c',
        line: '#e7e0d3',
        card: '#f8f5ee',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(52,48,42,0.03), 0 6px 20px -14px rgba(52,48,42,0.10)',
        lift: '0 2px 8px rgba(52,48,42,0.05), 0 16px 38px -22px rgba(52,48,42,0.20)',
      },
    },
  },
  plugins: [],
}
