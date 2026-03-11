import fs from 'fs'
import path from 'path'

const componentsDir = path.join(__dirname, '../packages/html/src/components')
const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.hbs'))

for (const file of files) {
  const content = fs.readFileSync(path.join(componentsDir, file), 'utf8')
  const componentNameStr = file.replace('.hbs', '')
  const camelCaseName = componentNameStr.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  const prefix = camelCaseName.toLowerCase()

  const matches = [...content.matchAll(/\{\{([a-zA-Z0-9_]+Variants).*?\}\}/g)]
  for (const match of matches) {
    const variantName = match[1]
    const isShared = ['buttonVariants', 'badgeVariants', 'iconVariants'].includes(variantName)

    // allow match if the variant name starts with the component name prefix
    const isOk =
      variantName.toLowerCase().startsWith(prefix) ||
      isShared ||
      variantName.toLowerCase().includes(prefix)

    if (!isOk) {
      console.log(`Mismatch in ${file}: used {{${variantName}}}`)
    }
  }
}
