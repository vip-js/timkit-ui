import fs from 'fs'
import path from 'path'

type PackageJson = {
  name?: string
  private?: boolean
  peerDependencies?: Record<string, string>
  dependencies?: Record<string, string>
}

const ROOT = path.resolve(__dirname, '..')
const PACKAGES_DIR = path.join(ROOT, 'packages')
const TARGETS = ['core', 'react', 'vue', 'html', 'weapp']

const readPackage = (dir: string): PackageJson => {
  const file = path.join(PACKAGES_DIR, dir, 'package.json')
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as PackageJson
}

const errors: string[] = []
const warnings: string[] = []

for (const target of TARGETS) {
  const pkg = readPackage(target)
  if (pkg.private) continue

  const name = pkg.name || `packages/${target}`
  const deps = pkg.dependencies || {}
  const peers = pkg.peerDependencies || {}

  const hasReactDeps = deps.react || deps['react-dom']
  if (hasReactDeps && (!peers.react || !peers['react-dom'])) {
    errors.push(
      `[${name}] depends on React runtime but missing peerDependencies.react/react-dom`
    )
  }

  if (deps.vue && !peers.vue) {
    errors.push(`[${name}] depends on vue runtime but missing peerDependencies.vue`)
  }

  for (const [dep, range] of Object.entries(peers)) {
    if (!range || range.trim() === '') {
      errors.push(`[${name}] peerDependencies.${dep} is empty`)
      continue
    }
    if (range === '*' || range === 'latest' || range.startsWith('workspace:')) {
      warnings.push(`[${name}] peerDependencies.${dep} uses non-publish-safe range: ${range}`)
    }
  }
}

if (warnings.length) {
  console.log('Peer dependency warnings:')
  warnings.forEach((w) => console.log(`- ${w}`))
}

if (errors.length) {
  console.error('Peer dependency check failed:')
  errors.forEach((e) => console.error(`- ${e}`))
  process.exit(1)
}

console.log('✅ peer dependency check passed for publishable packages.')
