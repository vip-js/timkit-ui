import fs from 'fs'
import path from 'path'
import * as core from '@timui/core'

const componentsDir = path.join(__dirname, '../src/components')
const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.hbs'))

const allVariants: Record<string, string[]> = {}
for (const [key, value] of Object.entries(core)) {
  if (typeof value === 'function' && key.endsWith('Variants')) {
    try {
      const classesStr = value() as string
      if (typeof classesStr === 'string') {
        const classes = classesStr.split(/\s+/).filter(Boolean).sort()
        allVariants[key] = classes
      }
    } catch (e) {}
  }
}

for (const file of files) {
  let content = fs.readFileSync(path.join(componentsDir, file), 'utf8')
  const componentNameStr = file.replace('.hbs', '')
  const camelCaseName = componentNameStr.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  const prefix = camelCaseName.replace(/^[A-Z]/, (c) => c.toLowerCase())

  const matches = [...content.matchAll(/\{\{([a-zA-Z0-9_]+Variants)[^}]*\}\}/g)]
  let fileChanged = false

  for (const match of matches) {
    const variantName = match[1]
    const isShared = ['buttonVariants', 'badgeVariants', 'iconVariants'].includes(variantName)
    const isOk =
      variantName.toLowerCase().startsWith(prefix.toLowerCase()) ||
      isShared ||
      variantName.toLowerCase().includes(prefix.toLowerCase())

    if (!isOk) {
      // Find the intended variant: it should start with `prefix` and have the SAME classes as the incorrect one.
      const incorrectClasses = allVariants[variantName]
      if (!incorrectClasses) continue

      let bestFix: string | null = null
      let maxScore = -1

      for (const [vName, vClasses] of Object.entries(allVariants)) {
        if (
          vName.toLowerCase().startsWith(prefix.toLowerCase()) ||
          vName.toLowerCase().includes(prefix.toLowerCase())
        ) {
          // Compare arrays
          const overlapSize = incorrectClasses.filter((c) => vClasses.includes(c)).length
          // We want the exact match if possible, or almost exact.
          if (overlapSize > maxScore && overlapSize >= incorrectClasses.length * 0.8) {
            maxScore = overlapSize
            bestFix = vName
          }
        }
      }

      if (bestFix && bestFix !== variantName) {
        content = content.replace(
          new RegExp(`\\{\\{${variantName}(.*?)\\}\\}`, 'g'),
          `{{${bestFix}$1}}`
        )
        fileChanged = true
        console.log(`✅ Fixed in ${file}: ${variantName} -> ${bestFix}`)
      } else {
        console.log(`❌ Could not fix in ${file}: ${variantName}`)
      }
    }
  }

  if (fileChanged) {
    fs.writeFileSync(path.join(componentsDir, file), content, 'utf8')
  }
}
