import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

// Minimal preset that exposes radix and motion utilities; extend as needed.
const config: Config = {
  // 由消费方指定 content，避免库侧扫描过大范围
  content: [],
  theme: {
    extend: {},
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
