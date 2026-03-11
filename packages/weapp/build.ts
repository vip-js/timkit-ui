import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import esbuild from 'esbuild'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC_DIR = path.join(__dirname, 'src')
const OUT_DIR = path.join(__dirname, 'dist')

async function build() {
  console.log('Building @timui/weapp...')

  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true })
  }
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // 1. Copy Static Assets (WXML, WXSS, JSON)
  const staticFiles = glob.sync('**/*.{wxml,wxss,json}', { cwd: SRC_DIR })

  for (const file of staticFiles) {
    const srcPath = path.join(SRC_DIR, file)
    const destPath = path.join(OUT_DIR, file)
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    fs.copyFileSync(srcPath, destPath)
  }

  // 2. Compile TypeScript/JavaScript
  // Preserve module boundaries; consumers handle tree-shaking and bundling.
  const scriptFiles = glob.sync('**/*.{ts,js}', { cwd: SRC_DIR, ignore: ['**/*.d.ts'] })
  const entryByStem = new Map<string, string>()

  for (const file of scriptFiles) {
    const stem = file.replace(/\.(ts|js)$/, '')
    const previous = entryByStem.get(stem)
    if (!previous || (file.endsWith('.ts') && previous.endsWith('.js'))) {
      entryByStem.set(stem, file)
    }
  }

  const entryPoints = Array.from(entryByStem.values()).map((f) => path.join(SRC_DIR, f))

  if (entryPoints.length > 0) {
    await esbuild.build({
      entryPoints,
      outdir: OUT_DIR,
      outbase: SRC_DIR,
      format: 'cjs',
      platform: 'node',
      target: 'es2019',
      bundle: false,
      sourcemap: false,
    })
  }

  console.log(`Build complete! Artifacts in ${OUT_DIR}`)
}

build().catch(console.error)
