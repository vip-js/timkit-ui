import fs from 'fs'
import path from 'path'

import { getDemoNameCandidates, isDemoLikeName } from '../apps/docs/lib/demo-canonical'

const ROOT = path.resolve(__dirname, '..')
const DOCS_COMPONENTS_DIR = path.join(ROOT, 'apps/docs/registry/default/components')
const OUTPUT_PATH = path.join(ROOT, 'apps/docs/registry/docs-framework-coverage-report.json')

type FrameworkId = 'react' | 'vue' | 'html' | 'weapp'
type DemoCoverageRecord = {
  family: string
  demo: string
  exact: Record<FrameworkId, boolean>
  effective: Record<FrameworkId, boolean>
}
type FamilyCoverageRecord = {
  family: string
  frameworks: FrameworkId[]
  counts: Record<FrameworkId, number>
  fullCoverage: boolean
}
type StandaloneCoverageRecord = {
  name: string
  frameworks: FrameworkId[]
  counts: Record<FrameworkId, number>
  fullCoverage: boolean
  files: string[]
  legacyAlias: boolean
}

const FRAMEWORK_BY_EXT: Record<string, FrameworkId> = {
  '.tsx': 'react',
  '.vue': 'vue',
  '.html': 'html',
  '.wxml': 'weapp',
}

const frameworkIds = Object.values(FRAMEWORK_BY_EXT)

const dirEntries = fs.readdirSync(DOCS_COMPONENTS_DIR, { withFileTypes: true })
const familyDirectories = dirEntries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()
const standaloneFiles = dirEntries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort()

const coverageRecords: FamilyCoverageRecord[] = familyDirectories.map((family) => {
  const familyDir = path.join(DOCS_COMPONENTS_DIR, family)
  const counts: Record<FrameworkId, number> = {
    react: 0,
    vue: 0,
    html: 0,
    weapp: 0,
  }

  for (const fileName of fs.readdirSync(familyDir)) {
    const framework = FRAMEWORK_BY_EXT[path.extname(fileName).toLowerCase()]
    if (framework) {
      counts[framework] += 1
    }
  }

  const frameworks = frameworkIds.filter((framework) => counts[framework] > 0)
  return {
    family,
    frameworks,
    counts,
    fullCoverage: frameworkIds.every((framework) => counts[framework] > 0),
  }
})

const demoRecords: DemoCoverageRecord[] = []

for (const family of familyDirectories) {
  const familyDir = path.join(DOCS_COMPONENTS_DIR, family)
  const files = fs.readdirSync(familyDir)
  const namesByFramework: Record<FrameworkId, Set<string>> = {
    react: new Set(),
    vue: new Set(),
    html: new Set(),
    weapp: new Set(),
  }

  for (const fileName of files) {
    const framework = FRAMEWORK_BY_EXT[path.extname(fileName).toLowerCase()]
    if (!framework) continue
    namesByFramework[framework].add(path.basename(fileName, path.extname(fileName)))
  }

  const reactDemos = Array.from(namesByFramework.react).filter(isDemoLikeName).sort()

  for (const demo of reactDemos) {
    const candidates = getDemoNameCandidates(demo, true)
    demoRecords.push({
      family,
      demo,
      exact: {
        react: namesByFramework.react.has(demo),
        vue: namesByFramework.vue.has(demo),
        html: namesByFramework.html.has(demo),
        weapp: namesByFramework.weapp.has(demo),
      },
      effective: {
        react: candidates.some((candidate) => namesByFramework.react.has(candidate)),
        vue: candidates.some((candidate) => namesByFramework.vue.has(candidate)),
        html: candidates.some((candidate) => namesByFramework.html.has(candidate)),
        weapp: candidates.some((candidate) => namesByFramework.weapp.has(candidate)),
      },
    })
  }
}

const standaloneMap = new Map<string, StandaloneCoverageRecord>()

for (const fileName of standaloneFiles) {
  const framework = FRAMEWORK_BY_EXT[path.extname(fileName).toLowerCase()]
  if (!framework) continue

  const name = path.basename(fileName, path.extname(fileName))
  if (!standaloneMap.has(name)) {
    standaloneMap.set(name, {
      name,
      frameworks: [],
      counts: {
        react: 0,
        vue: 0,
        html: 0,
        weapp: 0,
      },
      fullCoverage: false,
      files: [],
      legacyAlias: /^comp-\d+$/.test(name),
    })
  }

  const record = standaloneMap.get(name)!
  record.counts[framework] += 1
  record.files.push(fileName)
}

const standaloneRecords = Array.from(standaloneMap.values())
  .map((record) => ({
    ...record,
    frameworks: frameworkIds.filter((framework) => record.counts[framework] > 0),
    fullCoverage: frameworkIds.every((framework) => record.counts[framework] > 0),
    files: record.files.sort(),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

const summary = {
  families: coverageRecords.length,
  fullCoverageFamilies: coverageRecords.filter((record) => record.fullCoverage).length,
  missingReactFamilies: coverageRecords.filter((record) => record.counts.react === 0).length,
  missingVueFamilies: coverageRecords.filter((record) => record.counts.vue === 0).length,
  missingHtmlFamilies: coverageRecords.filter((record) => record.counts.html === 0).length,
  missingWeappFamilies: coverageRecords.filter((record) => record.counts.weapp === 0).length,
  demoEntries: demoRecords.length,
  exactVueDemoCoverage: demoRecords.filter((record) => record.exact.vue).length,
  exactHtmlDemoCoverage: demoRecords.filter((record) => record.exact.html).length,
  exactWeappDemoCoverage: demoRecords.filter((record) => record.exact.weapp).length,
  effectiveVueDemoCoverage: demoRecords.filter((record) => record.effective.vue).length,
  effectiveHtmlDemoCoverage: demoRecords.filter((record) => record.effective.html).length,
  effectiveWeappDemoCoverage: demoRecords.filter((record) => record.effective.weapp).length,
  docsVisibleVueDemoCoverage: demoRecords.filter(
    (record) => record.effective.vue || record.exact.react
  ).length,
  docsVisibleHtmlDemoCoverage: demoRecords.filter(
    (record) => record.effective.html || record.exact.react
  ).length,
  standaloneEntries: standaloneRecords.length,
  legacyStandaloneEntries: standaloneRecords.filter((record) => record.legacyAlias).length,
  canonicalStandaloneEntries: standaloneRecords.filter((record) => !record.legacyAlias).length,
  fullCoverageStandaloneEntries: standaloneRecords.filter((record) => record.fullCoverage).length,
  reactOnlyStandaloneEntries: standaloneRecords.filter(
    (record) => record.counts.react > 0 && record.frameworks.length === 1
  ).length,
  multiFrameworkStandaloneEntries: standaloneRecords.filter(
    (record) => record.frameworks.length > 1
  ).length,
  standaloneFiles: standaloneFiles.length,
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
      summary,
      standaloneFiles,
      familyRecords: coverageRecords,
      demoRecords,
      standaloneRecords,
    },
    null,
    2
  )}\n`,
  'utf-8'
)

console.log(`Docs framework coverage report written: ${OUTPUT_PATH}`)
console.log(
  `Families=${summary.families}, fullCoverage=${summary.fullCoverageFamilies}, standaloneEntries=${summary.standaloneEntries}`
)
