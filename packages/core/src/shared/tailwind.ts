import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'
import { defaultTokens } from './theme'

const config: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        ...defaultTokens.colors,
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      }
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ':root': {
          '--radius': '0.5rem',
        },
      })
    }),
  ],
}

export default config

