/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-content-theme="dark"]'],
  safelist: [
    'bg-diff-beginner', 'bg-diff-intermediate', 'bg-diff-advanced',
    'text-diff-beginner', 'text-diff-intermediate', 'text-diff-advanced',
    'bg-done', 'bg-progress', 'bg-optional', 'bg-locked', 'bg-streak',
    'text-done', 'text-progress', 'text-optional', 'text-locked', 'text-streak',
  ],
  theme: {
    extend: {
      colors: {
        // hybrid dark chrome
        ink: {
          900: '#06080f',
          800: '#0a0d18',
          700: '#0e1322',
          600: '#141a2c',
        },
        // content surfaces
        page: 'var(--page)',
        card: 'var(--card)',
        'card-2': 'var(--card-2)',
        line: 'var(--line)',
        ringtrack: 'var(--ring-track)',
        // text
        fg: 'var(--fg)',
        'fg-muted': 'var(--fg-muted)',
        'fg-faint': 'var(--fg-faint)',
        // semantic
        done: '#10b981',
        progress: '#0ea5e9',
        optional: '#f59e0b',
        locked: '#94a3b8',
        streak: '#f97316',
        'diff-beginner': '#10b981',
        'diff-intermediate': '#0ea5e9',
        'diff-advanced': '#8b5cf6',
        'grad-from': 'var(--grad-from)',
        'grad-to': 'var(--grad-to)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        chip: '8px',
        btn: '12px',
        card: '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.06)',
        lift: '0 8px 30px rgba(15,23,42,0.12)',
        glow: '0 8px 24px rgba(6,182,212,0.35)',
        'glow-sm': '0 4px 16px rgba(6,182,212,0.28)',
      },
      letterSpacing: {
        eyebrow: '0.16em',
        tight2: '-0.02em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'flame-pulse': {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'flame-pulse': 'flame-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
