import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')
const VUE_ROOT = path.join(ROOT, 'apps/docs/registry/default')

const walk = (dir: string, files: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, files)
    } else if (entry.isFile() && full.endsWith('.vue')) {
      files.push(full)
    }
  }
  return files
}

const vueFiles = walk(VUE_ROOT)
const errors: string[] = []

// Guard against common JSX->Vue transform artifacts:
// e.g. "<PaginationLink) href=...>"
const BROKEN_TAG_PATTERN = /<\s*[A-Za-z][\w-]*\)\s*[^\n>]*>/

for (const file of vueFiles) {
  const source = fs.readFileSync(file, 'utf-8')
  const templateBlocks = source.match(/<template[\s\S]*?<\/template>/g) || []
  const hasArtifact = templateBlocks.some((tpl) => BROKEN_TAG_PATTERN.test(tpl))

  if (hasArtifact) {
    errors.push(path.relative(ROOT, file))
  }
}

if (errors.length) {
  console.error('❌ Vue registry SFC validation failed. Suspicious transform artifacts found in:')
  errors.forEach((f) => console.error(`- ${f}`))
  process.exit(1)
}

console.log(`✅ Vue registry SFC validation passed (${vueFiles.length} files scanned).`)
