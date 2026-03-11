import fs from 'fs'
import path from 'path'

import { getHtmlCapabilityLevel, htmlAdapterTemplateNames } from '../packages/html/src/capabilities'
import { htmlRuntimeSelectorByName } from '../packages/html/src/runtime-metadata'

const ROOT = path.resolve(__dirname, '..')
const HTML_COMPONENTS_DIR = path.join(ROOT, 'packages/html/src/components')
const OUTPUT_PATH = path.join(ROOT, 'apps/docs/registry/html-capability-report.json')

type HtmlCapabilityRecord = {
  name: string
  level: 'template-only' | 'template+adapter'
  templatePath: string
  compiledPath: string
  adapterPath?: string
  selector?: string
}

const failures: string[] = []

const addFailure = (message: string) => {
  failures.push(message)
}

const listFiles = (ext: string) =>
  fs
    .readdirSync(HTML_COMPONENTS_DIR)
    .filter((name) => name.endsWith(ext))
    .sort()

const templateNames = listFiles('.hbs').map((name) => name.replace(/\.hbs$/, ''))
const compiledNames = new Set(listFiles('.html').map((name) => name.replace(/\.html$/, '')))
const adapterNames = new Set(
  listFiles('.adapter.js').map((name) => name.replace(/\.adapter\.js$/, ''))
)

const records: HtmlCapabilityRecord[] = templateNames.map((name) => {
  const level = getHtmlCapabilityLevel(name)
  return {
    name,
    level,
    templatePath: `packages/html/src/components/${name}.hbs`,
    compiledPath: `packages/html/src/components/${name}.html`,
    ...(adapterNames.has(name)
      ? { adapterPath: `packages/html/src/components/${name}.adapter.js` }
      : {}),
    ...(level === 'template+adapter'
      ? { selector: htmlRuntimeSelectorByName[name as keyof typeof htmlRuntimeSelectorByName] }
      : {}),
  }
})

for (const name of templateNames) {
  if (!compiledNames.has(name)) {
    addFailure(`packages/html/src/components/${name}.html is missing for template ${name}.hbs`)
  }
}

for (const name of htmlAdapterTemplateNames) {
  if (!templateNames.includes(name)) {
    addFailure(`HTML adapter capability "${name}" has no matching template file`)
  }
  if (!adapterNames.has(name)) {
    addFailure(`HTML template+adapter capability "${name}" is missing ${name}.adapter.js`)
  }
  if (!htmlRuntimeSelectorByName[name as keyof typeof htmlRuntimeSelectorByName]) {
    addFailure(`HTML template+adapter capability "${name}" is missing runtime selector metadata`)
  }
}

for (const name of adapterNames) {
  if (getHtmlCapabilityLevel(name) !== 'template+adapter') {
    addFailure(
      `HTML adapter file ${name}.adapter.js exists but capability level is not template+adapter`
    )
  }
}

const outputDir = path.dirname(OUTPUT_PATH)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

fs.writeFileSync(
  OUTPUT_PATH,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: {
        templates: templateNames.length,
        templateOnly: records.filter((record) => record.level === 'template-only').length,
        templateWithAdapter: records.filter((record) => record.level === 'template+adapter').length,
      },
      records,
    },
    null,
    2
  )}\n`,
  'utf-8'
)

console.log(`HTML capability report written: ${OUTPUT_PATH}`)

if (failures.length > 0) {
  throw new Error(`HTML capability checks failed:\n- ${failures.join('\n- ')}`)
}

console.log('HTML capability checks: PASS')
