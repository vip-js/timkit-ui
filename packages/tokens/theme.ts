export const themeTokens = {
  color: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.141 0.005 285.823)',
    primary: 'oklch(0.21 0.006 285.885)',
    onPrimary: 'oklch(0.985 0 0)',
    secondary: 'oklch(0.967 0.001 286.375)',
    onSecondary: 'oklch(0.21 0.006 285.885)',
    destructive: 'oklch(0.637 0.237 25.331)',
    onDestructive: 'oklch(0.985 0 0)',
    border: 'oklch(0.92 0.004 286.32)',
    muted: 'oklch(0.552 0.016 285.938)',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.625rem',
    pill: '999px',
  },
  spacing: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
  },
  typography: {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
  },
} as const

export type ThemeTokens = typeof themeTokens
