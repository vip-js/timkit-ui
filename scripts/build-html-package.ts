import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')
const SRC_DIR = path.join(ROOT, 'packages/html/src')
const DIST_DIR = path.join(ROOT, 'packages/html/dist')

async function ensureDir(dir: string) {
  await fs.promises.mkdir(dir, { recursive: true })
}

async function copyComponents() {
  const srcComponents = path.join(SRC_DIR, 'components')
  const distComponents = path.join(DIST_DIR, 'components')

  if (!fs.existsSync(srcComponents)) return

  await ensureDir(distComponents)

  const items = fs.readdirSync(srcComponents)
  await Promise.all(
    items.map((item) =>
      fs.promises.copyFile(path.join(srcComponents, item), path.join(distComponents, item))
    )
  )
}

async function writeIndex() {
  const indexPath = path.join(DIST_DIR, 'index.js')
  const content = `module.exports = { name: '@timui/html', version: '0.0.1' }\n`
  await fs.promises.writeFile(indexPath, content, 'utf-8')
}

async function main() {
  await fs.promises.rm(DIST_DIR, { recursive: true, force: true })
  await ensureDir(DIST_DIR)
  await copyComponents()
  await writeIndex()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
