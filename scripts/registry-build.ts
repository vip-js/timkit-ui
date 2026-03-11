import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { sha256OfString } from '../packages/cli/src/lib/checksum'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const CACHE_PATH = path.join(ROOT, 'registry-build.cache.json')
const OUTPUT_PATH = path.join(ROOT, 'registry-all.json')
const DOCS_DATA_PATH = path.join(ROOT, 'apps/docs/data/registry-all.json')

const INPUT_PATHS = [
  path.join(ROOT, 'apps/docs/registry.json'),
  path.join(ROOT, 'apps/docs/registry'),
  path.join(ROOT, 'apps/docs/catalog/catalog.json'),
  path.join(ROOT, 'apps/docs/blocks-source.json'),
  path.join(ROOT, 'packages/react/src/components/ui'),
  path.join(ROOT, 'packages/react/src/blocks'),
  path.join(ROOT, 'packages/vue/src/components'),
  path.join(ROOT, 'packages/vue/src/hooks'),
  path.join(ROOT, 'packages/html/src/components'),
  path.join(ROOT, 'packages/weapp/src'),
  path.join(ROOT, 'packages/weapp/primitives'),
  path.join(ROOT, 'packages/core/src/shared/utils.ts'),
  path.join(ROOT, 'packages/core/src/components'),
  path.join(ROOT, 'packages/tokens/dist/theme.css'),
]

type FileSnapshot = {
  path: string
  size: number
  mtimeMs: number
}

const walkDir = (dir: string, acc: string[]) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  entries.forEach((entry) => {
    if (entry.name.startsWith('.')) return
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath, acc)
    } else if (entry.isFile()) {
      acc.push(fullPath)
    }
  })
}

const collectFiles = (): string[] => {
  const files: string[] = []
  INPUT_PATHS.forEach((inputPath) => {
    if (!fs.existsSync(inputPath)) return
    const stat = fs.statSync(inputPath)
    if (stat.isDirectory()) {
      walkDir(inputPath, files)
    } else if (stat.isFile()) {
      files.push(inputPath)
    }
  })
  return files.sort()
}

const readCache = (): { signature: string } | undefined => {
  if (!fs.existsSync(CACHE_PATH)) return undefined
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8')) as { signature: string }
  } catch {
    return undefined
  }
}

const writeCache = (signature: string) => {
  fs.writeFileSync(CACHE_PATH, JSON.stringify({ signature }, null, 2))
}

const buildSignature = (files: string[]): string => {
  const snapshot: FileSnapshot[] = files.map((file) => {
    const stat = fs.statSync(file)
    return {
      path: path.relative(ROOT, file),
      size: stat.size,
      mtimeMs: stat.mtimeMs,
    }
  })
  return sha256OfString(JSON.stringify(snapshot))
}

const runScript = (scriptPath: string, args: string[] = []) => {
  const result = spawnSync('node', ['--import', 'tsx', scriptPath, ...args], { stdio: 'inherit' })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const hasOutputs = () => fs.existsSync(OUTPUT_PATH) && fs.existsSync(DOCS_DATA_PATH)

const args = new Set(process.argv.slice(2))
const isIncremental = args.has('--incremental')
const shouldCheck = args.has('--check')
const shouldReport = args.has('--report')
const isForce = args.has('--force')

const files = collectFiles()
const signature = buildSignature(files)
const cache = readCache()
const unchanged = cache?.signature === signature

if (isIncremental && unchanged && hasOutputs() && !isForce) {
  console.log('Registry sources unchanged. Skipping build.')
  if (shouldCheck) {
    runScript(path.join(ROOT, 'scripts/check-registry-data.ts'))
  }
  if (shouldReport) {
    runScript(path.join(ROOT, 'scripts/report-missing-frameworks.ts'))
  }
  process.exit(0)
}

runScript(path.join(ROOT, 'scripts/build-registry-all.ts'))
writeCache(signature)

if (shouldCheck) {
  runScript(path.join(ROOT, 'scripts/check-registry-data.ts'))
}
if (shouldReport) {
  runScript(path.join(ROOT, 'scripts/report-missing-frameworks.ts'))
}
