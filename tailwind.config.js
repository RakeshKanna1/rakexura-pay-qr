/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#07070a',
        surface: '#11131a',
        'surface-hover': '#151922',
        'surface-card': '#0c0d14',
        accent: '#c299ff',
        primary: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
          dark: '#6d28d9',
          glow: 'rgba(139, 92, 246, 0.35)',
        },
        upi: {
          green: '#00d68f',
          emerald: '#25d366',
          glow: 'rgba(0, 214, 143, 0.35)',
        },
        gold: {
          DEFAULT: '#facc15',
          dark: '#d97706',
        },
        border: 'rgba(255, 255, 255, 0.08)',
        'border-strong': 'rgba(255, 255, 255, 0.15)',
        'text-primary': '#ffffff',
        'text-muted': '#8f96a8',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px rgba(139, 92, 246, 0.25)',
        'glow-upi': '0 0 25px rgba(0, 214, 143, 0.25)',
        'glow-gold': '0 0 25px rgba(250, 204, 21, 0.2)',
        'card-dark': '0 12px 35px -8px rgba(0, 0, 0, 0.7)',
        'standee': '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
