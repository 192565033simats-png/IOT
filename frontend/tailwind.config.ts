import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 18px 50px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        brand: '#2563EB',
      },
    },
  },
  plugins: [],
} satisfies Config
