import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    // ─── Tier 0: Core primitives ───────────────────────────────────────────
    'src/index.ts',
    'src/shared/utils.ts',
    'src/shared/preview-protocol.ts',

    // ─── Tier 1: Semantic slices ───────────────────────────────────────────
    // Consumers that only need one dimension (e.g. WeApp needs variants only,
    // CLI needs schemas only) import a single small bundle instead of root.
    'src/slices/variants.ts',
    'src/slices/machines.ts',
    'src/slices/schemas.ts',

    // ─── Tier 2: Per-component aggregates ─────────────────────────────────
    // One entry per component – bundles props + variants + machine together.
    // Sub-layer files (variants.ts / machine.ts / schema.ts / props.ts) are
    // no longer individual entry points; they are internal to each aggregate.
    'src/components/**/index.ts',
  ],
  format: ['cjs', 'esm'],
  // DTS is generated separately via `tsc --emitDeclarationOnly --incremental`
  // to avoid ERR_WORKER_OUT_OF_MEMORY in tsup's bundled DTS worker.
  dts: false,
  clean: true,
  outDir: 'dist',
  splitting: true,
  treeshake: true,
  sourcemap: true,
  // esnext avoids downleveling (no async→generator transforms) since all
  // consumers (Next.js, Vite, Nuxt) handle modern syntax natively.
  target: 'esnext',
  external: ['react', 'vue', '@zag-js/react', '@zag-js/vue'],
})
