import fs from 'fs'
import path from 'path'

const componentsDir = path.join(__dirname, 'src/components')
const packageJsonPath = path.join(__dirname, 'package.json')

// ─── Helpers ──────────────────────────────────────────────────────────────────

function distEntry(distPath: string) {
  return {
    types: `./dist/${distPath}.d.ts`,
    import: `./dist/${distPath}.mjs`,
    require: `./dist/${distPath}.js`,
  }
}

function componentNames(): string[] {
  return fs
    .readdirSync(componentsDir)
    .filter((name) => fs.statSync(path.join(componentsDir, name)).isDirectory())
    .sort()
}

// ─── Export map builder ───────────────────────────────────────────────────────

function buildExports(): Record<string, unknown> {
  const exports: Record<string, unknown> = {}

  // ─────────────────────────────────────────────────────────────────────────
  // Tier 0 — Core primitives
  //
  // Stable, always-present entry points consumed by framework packages and
  // application code.  These are the only paths that external consumers
  // should hard-code in their imports.
  // ─────────────────────────────────────────────────────────────────────────

  // Full barrel – primary entry for @timui/react, @timui/vue, @timui/weapp
  exports['.'] = distEntry('index')

  // Tailwind preset – re-exported by @timui/react and @timui/vue
  exports['./tailwind-preset'] = {
    types: './src/shared/tailwind.ts',
    import: './src/shared/tailwind.ts',
    require: './src/shared/tailwind.ts',
  }

  // Shared utilities (cn, createTimEvent, AssertNoExtraKeys …)
  exports['./utils'] = distEntry('shared/utils')

  // Preview-iframe postMessage protocol – used by apps/docs and vue-preview-server
  exports['./preview-protocol'] = distEntry('shared/preview-protocol')

  // Static assets
  exports['./styles.css'] = './styles.css'

  // ─────────────────────────────────────────────────────────────────────────
  // Tier 1 — Semantic slices
  //
  // Purpose-scoped bundles for consumers that only need one dimension of the
  // core package.  Each slice has ZERO dependency on the other two slices.
  //
  //  ./variants  – All CVA variant functions. No @zag-js imports.
  //                Ideal for WeApp / HTML where Zag machines are unnecessary.
  //
  //  ./machines  – All Zag.js machine / connect / anatomy re-exports.
  //                No class-variance-authority imports.
  //                Ideal for SSR, unit tests, and framework adapters that
  //                only need state-machine logic.
  //
  //  ./schemas   – All UCS schema metadata + component-names + types.
  //                Zero runtime dependencies (pure data + types).
  //                Ideal for CLI tools, docs generators, and AI code gen
  //                that need machine-readable component specs without
  //                loading Zag or CVA.
  // ─────────────────────────────────────────────────────────────────────────

  exports['./variants'] = distEntry('slices/variants')
  exports['./machines'] = distEntry('slices/machines')
  exports['./schemas'] = distEntry('slices/schemas')

  // ─────────────────────────────────────────────────────────────────────────
  // Tier 2 — Per-component aggregates
  //
  // One entry per component.  Each entry bundles the component's props types,
  // CVA variants, Zag machine (if any), and UCS schema together.
  //
  // Sub-layer paths such as ./button/variants, ./button/machine,
  // ./button/schema, and ./button/props are intentionally NOT exposed.
  // Consumers should import from either:
  //   • @timui/core           (everything)
  //   • @timui/core/button    (one component)
  //   • @timui/core/variants  (all CVA only)
  //   • @timui/core/machines  (all Zag only)
  //   • @timui/core/schemas   (all metadata only)
  // ─────────────────────────────────────────────────────────────────────────

  for (const name of componentNames()) {
    const componentPath = path.join(componentsDir, name)
    const files = fs.readdirSync(componentPath)

    // Only expose the aggregate index – skip components without one
    if (files.includes('index.ts')) {
      exports[`./${name}`] = distEntry(`components/${name}/index`)
    }
  }

  return exports
}

// ─── Write ────────────────────────────────────────────────────────────────────

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
const newExports = buildExports()
pkg.exports = newExports

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n')

const before = 232 // previous entry count (documented for reference)
const after = Object.keys(newExports).length
console.log(`✅  package.json exports updated`)
console.log(`    Before : ${before} entries`)
console.log(`    After  : ${after} entries  (${Math.round((1 - after / before) * 100)}% reduction)`)
console.log()
console.log(
  '    Tier 0  (core primitives) : .  ./tailwind-preset  ./utils  ./preview-protocol  ./styles.css'
)
console.log('    Tier 1  (semantic slices)  : ./variants  ./machines  ./schemas')
console.log(`    Tier 2  (per-component)    : ${after - 8} components`)
