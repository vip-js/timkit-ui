import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'
import esbuild from 'esbuild'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC_DIR = path.join(__dirname, 'primitives')
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

    // 2. Compile TypeScript
    const tsFiles = glob.sync('**/*.ts', { cwd: SRC_DIR })
    const entryPoints = tsFiles.map(f => path.join(SRC_DIR, f))

    if (entryPoints.length > 0) {
        await esbuild.build({
            entryPoints,
            outdir: OUT_DIR,
            format: 'cjs', // Miniprogram uses CommonJS
            platform: 'node', // Closest behavior to weapp environment
            target: 'es2019',
            bundle: false, // Do not bundle, keep file structure
            sourcemap: false,
        })
    }

    console.log(`Build complete! Artifacts in ${OUT_DIR}`)
}

build().catch(console.error)
