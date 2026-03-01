import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/shared/utils.ts',
        'src/components/**/index.ts',
        'src/components/**/variants.ts',
        'src/components/**/machine.ts',
        'src/components/**/schema.ts',
        'src/components/**/props.ts',
    ],
    format: ['cjs', 'esm'],
    // DTS is generated separately via `tsc --emitDeclarationOnly --incremental` to avoid
    // ERR_WORKER_OUT_OF_MEMORY in tsup's bundled DTS worker
    dts: false,
    clean: true,
    outDir: 'dist',
    splitting: true,
    treeshake: true,
    sourcemap: true,
    // target:esnext avoids downleveling (no async→generator transforms)
    // since all consumers (Next.js, Vite, Nuxt) handle modern syntax natively
    target: 'esnext',
    external: ['react', 'vue', '@zag-js/react', '@zag-js/vue'],
})
