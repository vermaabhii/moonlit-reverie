import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F0E4',
          dark: '#EDE4D4',
        },
        rust: {
          DEFAULT: '#B84A2F',
          dark: '#9A3A28',
          light: '#D46B4F',
        },
        coffee: {
          DEFAULT: '#3D2314',
          muted: '#5C3D2E',
          light: '#6B4C3B',
        },
        mustard: {
          DEFAULT: '#C9A227',
          muted: '#E8C547',
        },
        moon: {
          glow: '#F4D58D',
          dusk: '#8B5E3C',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        sign: '0.375rem',
        card: '0.5rem',
      },
      boxShadow: {
        sign: '3px 3px 0 0 #3D2314',
        'sign-sm': '2px 2px 0 0 #3D2314',
        glow: '0 0 24px rgba(244, 213, 141, 0.45)',
      },
      backgroundImage: {
        checkerboard:
          'linear-gradient(45deg, #3D2314 25%, transparent 25%), linear-gradient(-45deg, #3D2314 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #3D2314 75%), linear-gradient(-45deg, transparent 75%, #3D2314 75%)',
      },
      backgroundSize: {
        checker: '12px 12px',
      },
      backgroundPosition: {
        checker: '0 0, 0 6px, 6px -6px, -6px 0px',
      },
    },
  },
  plugins: [],
};

export default config;
