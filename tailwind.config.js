/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['"Bebas Neue"', 'cursive'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
      colors: {
        'iron-red': '#c0392b',
        'iron-gold': '#f39c12',
        'cap-blue': '#2980b9',
        'thor-yellow': '#f1c40f',
        'hulk-green': '#27ae60',
        'widow-red': '#e74c3c',
        'avengers-gold': '#d4af37',
        'dark-base': '#050508',
        'dark-card': '#0a0a14',
        'dark-border': '#1a1a2e',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
