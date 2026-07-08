/** @type {import('tailwindcss').Config} */
export default {
  // Paths to all template files — Tailwind scans these to remove unused styles
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ── Brand Color Palette ────────────────────────────────
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        accent: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark:  '#d97706',
        },
      },
      // ── Typography ─────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      // ── Border Radius ──────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
      },
      // ── Box Shadow ─────────────────────────────────────────
      boxShadow: {
        'card': '0 4px 24px -4px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 12px 32px -8px rgba(0, 0, 0, 0.18)',
      },
    },
  },
  plugins: [],
};
