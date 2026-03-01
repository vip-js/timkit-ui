const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'apps/docs/data/registry')
const PUBLIC_DIR = path.join(ROOT, 'apps/docs/public/registry')
const HTML_DIR = path.join(ROOT, 'apps/docs/registry/default/html')
const WEAPP_DIR = path.join(ROOT, 'apps/docs/registry/default/weapp')

const files = fs.readdirSync(DATA_DIR).filter((name) => name.startsWith('accordion'))

const loadJson = (dir, name) => {
  const fullPath = path.join(dir, name)
  if (!fs.existsSync(fullPath)) return null
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
}

const writeJson = (dir, name, data) => {
  const fullPath = path.join(dir, name)
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8')
}

const updateFileContent = (filesList, targetPath, srcDir, identifierPrefix) => {
  const entry = filesList.find((file) => file.path === targetPath)
  if (!entry) return
  const filename = path.basename(targetPath)
  const srcPath = path.join(srcDir, filename)
  if (!fs.existsSync(srcPath)) return
  entry.content = fs.readFileSync(srcPath, 'utf-8')
  if (identifierPrefix) {
    entry.content = entry.content.trim() + '\n'
  }
}

const updateRecord = (name, dir) => {
  const data = loadJson(dir, name)
  if (!data) return
  data.files = data.files || []
  updateFileContent(data.files, `registry/default/html/${name.replace('.json', '.html')}`, HTML_DIR)
  updateFileContent(data.files, `registry/default/weapp/${name.replace('.json', '.wxml')}`, WEAPP_DIR)
  writeJson(dir, name, data)
}

files.forEach((name) => {
  if (!name.startsWith('accordion')) return
  updateRecord(name, DATA_DIR)
  updateRecord(name, PUBLIC_DIR)
})
