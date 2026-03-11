import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/manifest.ts',
    'src/components/index.ts',
    'src/components/ui/index.ts',
    'src/components/ui/*.tsx',
    'src/hooks/*.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: false,
  splitting: false,
  treeshake: false,
})
