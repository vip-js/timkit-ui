import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')
const DATA_REGISTRY_DIR = path.join(ROOT, 'apps/docs/data/registry')
const COVERAGE_REPORT_PATH = path.join(
  ROOT,
  'apps/docs/registry/docs-framework-coverage-report.json'
)

type RegistryItem = {
  name: string
  meta?: {
    demoCanonical?: {
      sourceFramework?: string
      frameworks?: Record<
        string,
        {
          sourceFramework?: string
          sourceMode?: string
          matchedName?: string
          path?: string
        }
      >
    }
  }
}

function fail(message: string): never {
  throw new Error(`[docs-demo-canonical] ${message}`)
}

function main() {
  if (!fs.existsSync(DATA_REGISTRY_DIR)) {
    fail(`missing data registry directory: ${DATA_REGISTRY_DIR}`)
  }

  const files = fs.readdirSync(DATA_REGISTRY_DIR).filter((file) => file.endsWith('.json'))
  const demoItems = files
    .map(
      (file) =>
        JSON.parse(fs.readFileSync(path.join(DATA_REGISTRY_DIR, file), 'utf-8')) as RegistryItem
    )
    .filter((item) => item.meta?.demoCanonical)

  if (!demoItems.length) {
    fail('no demoCanonical metadata found in data/registry items')
  }

  const invalidReactSource = demoItems.filter((item) => {
    const reactInfo = item.meta?.demoCanonical?.frameworks?.react
    return !reactInfo || reactInfo.sourceFramework !== 'react' || reactInfo.sourceMode === 'missing'
  })
  if (invalidReactSource.length) {
    fail(
      `found ${invalidReactSource.length} demo items without exact/group react source: ${invalidReactSource
        .slice(0, 10)
        .map((item) => item.name)
        .join(', ')}`
    )
  }

  const invalidWebSource = demoItems.filter((item) => {
    const frameworks = item.meta?.demoCanonical?.frameworks || {}
    return ['vue', 'html'].some((framework) => {
      const info = frameworks[framework]
      return !info || info.sourceMode === 'missing'
    })
  })
  if (invalidWebSource.length) {
    fail(
      `found ${invalidWebSource.length} demo items without docs-visible vue/html source: ${invalidWebSource
        .slice(0, 10)
        .map((item) => item.name)
        .join(', ')}`
    )
  }

  const invalidFrameworkSource = demoItems.filter((item) => {
    const frameworks = item.meta?.demoCanonical?.frameworks || {}
    return ['vue', 'html'].some((framework) => {
      const info = frameworks[framework]
      return !info || info.sourceFramework !== framework || info.sourceMode !== 'exact'
    })
  })
  if (invalidFrameworkSource.length) {
    fail(
      `found ${invalidFrameworkSource.length} demo items where vue/html are not exact framework-native demos: ${invalidFrameworkSource
        .slice(0, 10)
        .map((item) => item.name)
        .join(', ')}`
    )
  }

  if (!fs.existsSync(COVERAGE_REPORT_PATH)) {
    fail(`missing coverage report: ${COVERAGE_REPORT_PATH}`)
  }

  const coverage = JSON.parse(fs.readFileSync(COVERAGE_REPORT_PATH, 'utf-8')) as {
    summary?: {
      demoEntries?: number
      docsVisibleVueDemoCoverage?: number
      docsVisibleHtmlDemoCoverage?: number
    }
  }

  const summary = coverage.summary
  if (!summary) fail('coverage report summary missing')

  if (summary.docsVisibleVueDemoCoverage !== summary.demoEntries) {
    fail(
      `vue docs-visible coverage mismatch: ${summary.docsVisibleVueDemoCoverage}/${summary.demoEntries}`
    )
  }

  if (summary.docsVisibleHtmlDemoCoverage !== summary.demoEntries) {
    fail(
      `html docs-visible coverage mismatch: ${summary.docsVisibleHtmlDemoCoverage}/${summary.demoEntries}`
    )
  }

  console.log(
    `[docs-demo-canonical] PASS demos=${summary.demoEntries} vue=${summary.docsVisibleVueDemoCoverage} html=${summary.docsVisibleHtmlDemoCoverage}`
  )
}

main()
