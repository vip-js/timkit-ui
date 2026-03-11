import type { Config } from 'tailwindcss'

const config: Config = {
  content: [],
  theme: {
    extend: {
      borderRadius: {
        full: 'var(--radius-full)',
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },
      colors: {
        background: 'var(--background-default)',
        foreground: 'var(--foreground-default)',
        primary: {
          DEFAULT: 'var(--primary-DEFAULT)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary-DEFAULT)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive-DEFAULT)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border-default)',
        input: 'var(--border-input)',
        ring: 'var(--ring)',
      },
      // Mobile: safe-area utilities (iOS notch / Android gesture bar)
      // Usage: pb-safe-bottom, pt-safe-top, pl-safe-left, pr-safe-right
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Mobile: WCAG AAA / Apple HIG minimum touch target (44pt/px)
      minHeight: {
        'touch-target': '44px',
      },
      minWidth: {
        'touch-target': '44px',
      },
    },
  },
  plugins: [],
}

export default config
