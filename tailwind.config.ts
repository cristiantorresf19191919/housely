import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5EFE6',
          50: '#FBF8F3',
          100: '#F5EFE6',
          200: '#EDE3D2',
          300: '#E0D2B8',
        },
        ink: {
          DEFAULT: '#1F1611',
          50: '#3D2E22',
          100: '#2A1F18',
          900: '#1F1611',
        },
        terracotta: {
          DEFAULT: '#B8543F',
          50: '#E8A593',
          100: '#D88370',
          500: '#B8543F',
          700: '#923D2C',
        },
        sage: {
          DEFAULT: '#7A8A6F',
          100: '#A8B5A0',
          500: '#7A8A6F',
          700: '#566150',
        },
        gold: {
          DEFAULT: '#C9A961',
          100: '#E0CB94',
          500: '#C9A961',
          700: '#9C8146',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        marquee: 'marquee 40s linear infinite',
        'soft-pulse': 'softPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        softPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
