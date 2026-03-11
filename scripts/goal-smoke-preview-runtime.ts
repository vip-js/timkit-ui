import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(__dirname, '..')
const DOCS_COMPONENTS_ROOT = path.join(ROOT, 'apps/docs/registry/default/components')
const DOCS_UI_ROOT = path.join(ROOT, 'apps/docs/registry/default/ui')
const DOCS_VUE_ROOT = path.join(ROOT, 'apps/docs/registry/default/vue')
const PACKAGE_VUE_UI_ROOT = path.join(ROOT, 'packages/vue/src/components/ui')
const PREVIEW_DIST_ROOT = path.join(ROOT, 'apps/vue-preview-server/dist/assets')

const VUE_UI_IMPORT_RE = /from\s+['"]@\/components\/ui\/([^'"/]+)['"]/g

const walk = (rootDir: string, ext: '.vue' | '.tsx') => {
  const files: string[] = []
  const stack = [rootDir]

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current || !fs.existsSync(current)) continue
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(full)
        continue
      }
      if (entry.isFile() && entry.name.endsWith(ext)) {
        files.push(full)
      }
    }
  }

  return files
}

const existsAny = (candidates: string[]) => candidates.some((file) => fs.existsSync(file))

const resolveVueUiToken = (token: string) => {
  const docsVueDirect = [
    path.join(DOCS_VUE_ROOT, token),
    path.join(DOCS_VUE_ROOT, `${token}.ts`),
    path.join(DOCS_VUE_ROOT, `${token}.vue`),
    path.join(DOCS_VUE_ROOT, token, 'index.ts'),
    path.join(DOCS_VUE_ROOT, token, 'index.vue'),
    path.join(DOCS_VUE_ROOT, token, `${path.basename(token)}.vue`),
  ]

  const packageUiDirect = [
    path.join(PACKAGE_VUE_UI_ROOT, token),
    path.join(PACKAGE_VUE_UI_ROOT, `${token}.ts`),
    path.join(PACKAGE_VUE_UI_ROOT, `${token}.vue`),
    path.join(PACKAGE_VUE_UI_ROOT, token, 'index.ts'),
    path.join(PACKAGE_VUE_UI_ROOT, token, 'index.vue'),
    path.join(PACKAGE_VUE_UI_ROOT, token, `${path.basename(token)}.vue`),
  ]

  if (existsAny([...docsVueDirect, ...packageUiDirect])) return true

  const allVueFiles = walk(PACKAGE_VUE_UI_ROOT, '.vue')
  return allVueFiles.some((file) => path.basename(file, '.vue') === token)
}

const collectVueUiImports = (filePath: string) => {
  const source = fs.readFileSync(filePath, 'utf8')
  const tokens = new Set<string>()
  let match: RegExpExecArray | null
  while ((match = VUE_UI_IMPORT_RE.exec(source))) {
    tokens.add(match[1])
  }
  VUE_UI_IMPORT_RE.lastIndex = 0
  return Array.from(tokens)
}

const run = (cmd: string, args: string[], label: string) => {
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
  })
  assert.equal(result.status, 0, `${label} failed`)
}

const assertPreviewCss = () => {
  const cssFiles = fs
    .readdirSync(PREVIEW_DIST_ROOT)
    .filter((file) => file.endsWith('.css'))
    .map((file) => path.join(PREVIEW_DIST_ROOT, file))

  assert.ok(cssFiles.length > 0, 'preview build did not emit css assets')

  const css = fs.readFileSync(cssFiles[0], 'utf8')
  assert.ok(css.length > 50_000, `preview css asset unexpectedly small (${css.length} bytes)`)
  assert.match(css, /\.flex\{/, 'preview css missing common flex utility')
  assert.match(css, /--background:/, 'preview css missing theme variables')
  assert.match(css, /body\{color:var\(--foreground\)/, 'preview css missing theme base layer')
}

const smokeVueImports = () => {
  const vueFiles = walk(DOCS_COMPONENTS_ROOT, '.vue')
  const errors: string[] = []

  for (const file of vueFiles) {
    const imports = collectVueUiImports(file)
    for (const token of imports) {
      if (!resolveVueUiToken(token)) {
        errors.push(`${path.relative(ROOT, file)} -> @/components/ui/${token}`)
      }
    }
  }

  assert.equal(
    errors.length,
    0,
    `Unresolved Vue preview ui imports:\n${errors.slice(0, 20).join('\n')}`
  )
}

const smokeReactImports = () => {
  const reactFiles = walk(DOCS_COMPONENTS_ROOT, '.tsx')
  const errors: string[] = []

  for (const file of reactFiles) {
    const source = fs.readFileSync(file, 'utf8')
    let match: RegExpExecArray | null
    while ((match = VUE_UI_IMPORT_RE.exec(source))) {
      const token = match[1]
      const ok = existsAny([
        path.join(DOCS_UI_ROOT, token),
        path.join(DOCS_UI_ROOT, `${token}.ts`),
        path.join(DOCS_UI_ROOT, `${token}.tsx`),
      ])
      if (!ok) {
        errors.push(`${path.relative(ROOT, file)} -> @/components/ui/${token}`)
      }
    }
    VUE_UI_IMPORT_RE.lastIndex = 0
  }

  assert.equal(
    errors.length,
    0,
    `Unresolved React preview ui imports:\n${errors.slice(0, 20).join('\n')}`
  )
}

const main = () => {
  console.log('Preview runtime smoke: START')
  smokeVueImports()
  smokeReactImports()

  run('node', ['scripts/generate-vue-ui-token-entries.cjs'], 'sync vue ui token entries')
  run('pnpm', ['exec', 'tsc', '--noEmit', '-p', 'apps/docs/tsconfig.json'], 'docs typecheck')
  run('pnpm', ['-C', 'apps/vue-preview-server', 'build'], 'vue preview build')
  assertPreviewCss()
  console.log('Preview runtime smoke: PASS')
}

main()
