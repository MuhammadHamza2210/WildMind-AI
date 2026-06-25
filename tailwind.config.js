/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#080C12',
        accent: '#39FF14',
        amber: '#D4A843',
        'text-primary': '#E8F4EA',
        'text-muted': '#6B7F6E',
        // Conservation status palette
        status: {
          extinct: '#6B7280',
          critical: '#FF4444',
          endangered: '#FF8C00',
          vulnerable: '#FFD700',
          near: '#90EE90',
          least: '#39FF14',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '8px',
      },
      boxShadow: {
        glow: '0 0 24px rgba(57,255,20,0.08)',
        'glow-strong': '0 0 32px rgba(57,255,20,0.18)',
      },
      backdropBlur: {
        glass: '16px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-6px)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        blink: 'blink 1s step-end infinite',
        'bounce-dot': 'bounceDot 1.2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
