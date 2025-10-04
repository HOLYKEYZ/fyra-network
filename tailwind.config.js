/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fire': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        'ember': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        'flame': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        'dark': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      animation: {
        'fire': 'fire 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 1.5s ease-in-out infinite alternate',
        'ember': 'ember 3s ease-in-out infinite',
        'flame-dance': 'flame-dance 2.5s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'burn': 'burn 4s ease-in-out infinite',
      },
      keyframes: {
        fire: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.05) rotate(2deg)' },
          '50%': { transform: 'scale(1.1) rotate(-2deg)' },
          '75%': { transform: 'scale(1.05) rotate(1deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px #f97316, 0 0 40px #f97316' },
          '50%': { boxShadow: '0 0 30px #ef4444, 0 0 60px #ef4444, 0 0 80px #ef4444' },
          '100%': { boxShadow: '0 0 20px #f97316, 0 0 40px #f97316' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        flicker: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.02)' },
        },
        ember: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: 0.8 },
          '25%': { transform: 'translateY(-10px) rotate(2deg)', opacity: 1 },
          '50%': { transform: 'translateY(-20px) rotate(-1deg)', opacity: 0.9 },
          '75%': { transform: 'translateY(-15px) rotate(1deg)', opacity: 0.95 },
        },
        'flame-dance': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '20%': { transform: 'scale(1.1) rotate(3deg)' },
          '40%': { transform: 'scale(0.95) rotate(-2deg)' },
          '60%': { transform: 'scale(1.05) rotate(2deg)' },
          '80%': { transform: 'scale(1.02) rotate(-1deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0, transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: 1, transform: 'scale(1) rotate(180deg)' },
        },
        burn: {
          '0%': { transform: 'scale(1) rotate(0deg)', filter: 'hue-rotate(0deg)' },
          '25%': { transform: 'scale(1.05) rotate(1deg)', filter: 'hue-rotate(10deg)' },
          '50%': { transform: 'scale(1.1) rotate(-1deg)', filter: 'hue-rotate(-5deg)' },
          '75%': { transform: 'scale(1.05) rotate(0.5deg)', filter: 'hue-rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', filter: 'hue-rotate(0deg)' },
        }
      }
    },
  },
  plugins: [],
}
