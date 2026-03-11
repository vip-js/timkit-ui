import { defineConfig } from 'tsup'
import Vue from 'unplugin-vue/esbuild'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/manifest.ts',
    'src/components/**/*.ts',
    'src/components/**/*.vue',
    '!src/components/ui/calendar-rac.vue',
    'src/hooks/*.ts',
  ],
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  bundle: false,
  splitting: false,
  treeshake: false,
  external: ['vue'],
  esbuildPlugins: [Vue()],
})
