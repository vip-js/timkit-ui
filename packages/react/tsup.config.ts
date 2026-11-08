import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/manifest.ts',
    'src/components/index.ts',
    'src/components/ui/index.ts',
    'src/components/ui/*.tsx',
    '!src/components/ui/*.test.tsx',
    'src/hooks/*.ts',
    'src/agent/index.ts',
    'src/agent/*.tsx',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: false,
  splitting: false,
  treeshake: false,
  sourcemap: false,
})
