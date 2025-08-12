/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#1E293B',
        accent: '#14B8A6',
        info: '#64748B',
        success: '#22C55E',
        warning: '#FACC15',
        error: '#EF4444',
        surface: '#F8FAFC',
        'card-bg': '#1E293B',
        'card-border': '#334155',
        'text-primary': '#F8FAFC',
        'text-muted': '#94A3B8',
      },
    },
  },
  plugins: [],
};
