import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  splitting: true,
  treeshake: true,
  banner: {
    js: '"use client";',
  },
})
