import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Corporate blue accent — matches blue & white logo
        sky: {
          50:  '#EEF4FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#3B82F6',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#1E3459',
        },
        // Deep navy dark backgrounds
        'dark-bg':      '#070C17',
        'dark-card':    '#0D1628',
        'dark-surface': '#131E38',
        'dark-border':  'rgba(59, 130, 246, 0.18)',
        // Alias
        'neon':        '#3B82F6',
        'neon-cyan':   '#93C5FD',
        'neon-dim':    'rgba(59, 130, 246, 0.12)',
      },
      fontFamily: {
        orbitron:   ['Playfair Display', 'serif'],
        rajdhani:   ['DM Sans', 'sans-serif'],
        syne:       ['Playfair Display', 'serif'],
        body:       ['DM Sans', 'sans-serif'],
        inter:      ['DM Sans', 'Inter', 'sans-serif'],
        playfair:   ['Playfair Display', 'serif'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.65' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-14px)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'glow-line': {
          '0%, 100%': { opacity: '0.1' },
          '50%':       { opacity: '0.3' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'pulse-glow':      'pulse-glow 3s ease-in-out infinite',
        float:             'float 7s ease-in-out infinite',
        'slide-up':        'slide-up 0.8s ease-out forwards',
        'fade-in':         'fade-in 1s ease-out forwards',
        'glow-line':       'glow-line 5s ease-in-out infinite',
        'slide-in-right':  'slide-in-right 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
