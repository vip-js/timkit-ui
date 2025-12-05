import { defineConfig } from 'tsup'
import vue from 'esbuild-plugin-vue-next'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: false,
    clean: true,
    external: ['vue'],
    esbuildPlugins: [
        vue(),
    ],
})
