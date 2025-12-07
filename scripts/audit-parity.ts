import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PACKAGES_DIR = path.join(__dirname, '../packages')
const WEB_COMPONENTS_DIR = path.join(PACKAGES_DIR, 'web/src/components')
const VUE_COMPONENTS_DIR = path.join(PACKAGES_DIR, 'vue/src/components')
const WEAPP_PRIMITIVES_DIR = path.join(PACKAGES_DIR, 'weapp/primitives')
const WEAPP_SRC_DIR = path.join(PACKAGES_DIR, 'weapp/src')

// Components that should exist across all frameworks
// We can auto-discover this from 'web' (Reference implementation)
// OR use a defined list. Let's auto-discover from Web first.

function getComponents(dir: string, extensions: string[]) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((file) => extensions.some((ext) => file.endsWith(ext)))
    .map((file) => path.basename(file, path.extname(file)))
}

function getDirectories(dir: string) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}

function main() {
  const webComponents = getComponents(WEB_COMPONENTS_DIR, ['.tsx']).filter(
    (c) => !c.startsWith('placeholder.')
  )
  const vueComponents = getComponents(VUE_COMPONENTS_DIR, ['.vue']).filter(
    (c) => !c.startsWith('placeholder.')
  )
  const weappPrimitives = getDirectories(WEAPP_PRIMITIVES_DIR)
  const weappSrc = getDirectories(WEAPP_SRC_DIR)

  // Merge and Dedupe
  const weappComponents = Array.from(new Set([...weappPrimitives, ...weappSrc])).filter(
    (c) => !c.startsWith('placeholder.')
  )

  const allComponents = Array.from(
    new Set([...webComponents, ...vueComponents, ...weappComponents])
  ).sort()

  console.log('| Component | React (Web) | Vue | Weapp | Status |')
  console.log('|---|---|---|---|---|')

  let gapCount = 0

  allComponents.forEach((comp) => {
    const hasWeb = webComponents.includes(comp)
    const hasVue = vueComponents.includes(comp)
    const hasWeapp = weappComponents.includes(comp)

    // Simple heuristic: if it's in Web, it's Core.
    // If missing in others, it's a Gap.

    const isGap = hasWeb && (!hasVue || !hasWeapp)

    const status = isGap ? '⚠️ GAP' : '✅ Parity'
    if (isGap) gapCount++

    console.log(
      `| ${comp} | ${hasWeb ? '✅' : '❌'} | ${hasVue ? '✅' : '❌'} | ${hasWeapp ? '✅' : '❌'} | ${status} |`
    )
  })

  console.log(`\n\nTotal Components: ${allComponents.length}`)
  console.log(`Parity Gaps: ${gapCount}`)

  if (gapCount > 0) {
    console.warn(`\nFound ${gapCount} parity gaps. Please prioritize implementation.`)
    // Exit 0 for now to just report, or 1 to fail CI?
    // Let's exit 0 and just report for now until we want strict blocking.
    process.exit(0)
  }
}

main()
