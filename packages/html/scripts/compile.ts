import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as core from '@timui/core'
import Handlebars from 'handlebars'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 自动注册核心的方法作为 Helpers (如 buttonVariants, badgeVariants 等)
for (const [key, value] of Object.entries(core)) {
  if (typeof value === 'function' && key.endsWith('Variants')) {
    Handlebars.registerHelper(key, function (options) {
      return value(options?.hash || {})
    })
  }
}

// 目标文件夹: packages/html/src/components
const componentsDir = path.join(__dirname, '../src/components')
if (!fs.existsSync(componentsDir)) {
  console.warn('Components directory not found.')
  process.exit(0)
}

const files = fs.readdirSync(componentsDir)

let compiledCount = 0
for (const file of files) {
  if (file.endsWith('.hbs')) {
    const templatePath = path.join(componentsDir, file)
    const source = fs.readFileSync(templatePath, 'utf8')
    const template = Handlebars.compile(source)

    // Default rendering (empty hash) to provide a fallback visual in .html
    const htmlOutput = template({})

    const outputPath = path.join(componentsDir, file.replace('.hbs', '.html'))
    fs.writeFileSync(outputPath, htmlOutput, 'utf8')
    compiledCount++
    console.log(`✅ Compiled ${file} -> ${path.basename(outputPath)}`)
  }
}

console.log(`\n🎉 Successfully compiled ${compiledCount} Handlebars templates.`)
