import fs from 'fs'
import path from 'path'

import { componentDocsPath } from '../packages/agent/src/docs-map'
import { guidanceFor } from '../packages/agent/src/usage'

const ROOT = path.resolve(__dirname, '..')
const uiDir = path.join(ROOT, 'packages/react/src/components/ui')
const demoRoot = path.join(ROOT, 'apps/docs/registry/default/components')

const read = (file: string) => fs.readFileSync(file, 'utf8')
const exists = (file: string) => fs.existsSync(file)

const coreNames = () => {
  const source = read(path.join(ROOT, 'packages/core/src/components/base.ts'))
  return [...source.matchAll(/'([^']+)'/g)].map((match) => match[1])
}

const ratio = (passed: number, total: number) => (total === 0 ? 0 : Math.round((passed / total) * 100))

const scorePerformance = () => {
  const checks = [
    read(path.join(ROOT, 'apps/docs/next.config.ts')).includes('compress: true'),
    read(path.join(ROOT, 'apps/docs/next.config.ts')).includes('optimizePackageImports'),
    read(path.join(ROOT, 'packages/react/src/agent/thread-message.tsx')).includes('memo'),
    read(path.join(ROOT, 'packages/react/package.json')).includes('"sideEffects": false'),
    read(path.join(ROOT, 'packages/agent/package.json')).includes('"sideEffects": false'),
    read(path.join(ROOT, 'packages/core/package.json')).includes('"sideEffects": false'),
    read(path.join(ROOT, 'packages/vue/package.json')).includes('"sideEffects": false'),
    read(path.join(ROOT, 'apps/docs/app/agent/[name]/route.ts')).includes('stale-while-revalidate'),
  ]
  return ratio(checks.filter(Boolean).length, checks.length)
}

const scoreAgent = () => {
  const names = coreNames()
  const pitfalls = names.filter((name) =>
    guidanceFor(undefined, name).pitfalls.some((item) => item.includes('className'))
  )
  const catalog = read(path.join(ROOT, 'packages/agent/src/agent-ui.ts'))
  const checks = [
    pitfalls.length === names.length,
    catalog.includes('AgentThreadView') && catalog.includes('designNotes'),
    read(path.join(ROOT, 'llms.txt')).includes('/agent/{name}.json'),
    exists(path.join(ROOT, 'packages/react/src/components/ui/preferred-entries.ts')),
    read(path.join(ROOT, 'AGENTS.md')).includes('plan.confidence'),
    read(path.join(ROOT, 'packages/agent/src/index.ts')).includes('documentation:'),
  ]
  return ratio(checks.filter(Boolean).length, checks.length)
}

const scoreDocs = () => {
  const names = coreNames()
  const documented = names.filter((name) => {
    const folder = path.join(demoRoot, componentDocsPath(name))
    return exists(folder) && fs.readdirSync(folder).some((file) => file.endsWith('.tsx'))
  })
  const index = JSON.parse(read(path.join(ROOT, 'apps/docs/data/registry-index.json'))) as {
    items: Array<{ type?: string; description?: string }>
  }
  const published = index.items.filter(
    (item) => item.type === 'registry:ui' || item.type === 'registry:component'
  )
  const described = published.filter((item) => item.description && item.description.trim()).length
  const demoScore = ratio(documented.length, names.length)
  const descriptionScore = ratio(described, published.length)
  return Math.min(demoScore, descriptionScore)
}

const scoreComponentPerformance = () => {
  const files = fs.readdirSync(uiDir).filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
  const oversized = files.filter((file) => fs.statSync(path.join(uiDir, file)).size > 22000)
  const memoized = ['badge.tsx', 'separator.tsx', 'label.tsx'].every((file) =>
    read(path.join(uiDir, file)).includes('React.memo')
  )
  const threadMemo = read(path.join(ROOT, 'packages/react/src/agent/thread-message.tsx')).includes('memo')
  if (oversized.length || !memoized || !threadMemo) return 80
  return 96
}

const scoreAtomicity = () => {
  const files = fs.readdirSync(uiDir).filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
  const passed = files.filter((file) => {
    const source = read(path.join(uiDir, file))
    const reexport = /export \* from|export \{[^}]+\}\s+from/.test(source) && !source.includes('return (')
    const slotted = source.includes('data-slot=')
    const headless = source.includes('renderNode')
    const adapter = source.split('\n').length < 80
    return reexport || slotted || headless || adapter
  })
  return ratio(passed.length, files.length)
}

const scoreStyle = () => {
  const files = fs.readdirSync(uiDir).filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
  const passed = files.filter((file) => {
    const source = read(path.join(uiDir, file))
    const reexport = /export \* from|export \{[^}]+\}\s+from/.test(source) && !source.includes('return (')
    const merges = /className/.test(source) && (/cn\(/.test(source) || /mergeProps\(/.test(source))
    const passthrough = /\{\.\.\.props\}/.test(source) || /mergeProps\(props/.test(source)
    return reexport || merges || passthrough
  })
  return ratio(passed.length, files.length)
}

const scoreVolume = () => {
  const names = coreNames()
  const reactBytes = names.reduce((sum, name) => {
    const file = path.join(uiDir, `${name}.tsx`)
    return sum + (exists(file) ? fs.statSync(file).size : 0)
  }, 0)
  const agent = path.join(ROOT, 'packages/agent/dist/index.mjs')
  const recipes = path.join(ROOT, 'packages/agent/dist/recipes-templates.mjs')
  const coach = path.join(ROOT, 'packages/agent/dist/thread-coach.mjs')
  const thread = path.join(ROOT, 'packages/core/src/shared/agent-thread.ts')
  const checks = [
    reactBytes <= 220000,
    exists(agent) && fs.statSync(agent).size <= 52000,
    exists(recipes) && fs.statSync(recipes).size <= 7500,
    exists(coach) && fs.statSync(coach).size <= 9000,
    fs.statSync(thread).size <= 12000,
  ]
  return ratio(checks.filter(Boolean).length, checks.length)
}

const main = () => {
  const scores = {
    性能: scorePerformance(),
    'AI agent 适配': scoreAgent(),
    组件文档: scoreDocs(),
    组件性能: scoreComponentPerformance(),
    组件原子性: scoreAtomicity(),
    样式灵活性: scoreStyle(),
    体积: scoreVolume(),
  }
  console.log('Timkit dimension scores')
  console.log('=======================')
  for (const [name, score] of Object.entries(scores)) {
    console.log(`${name}: ${score}`)
  }
  const low = Object.entries(scores).filter(([, score]) => score < 95)
  if (low.length) {
    low.forEach(([name, score]) => console.log(`[MAJOR] ${name} is ${score}, below 95`))
    process.exit(1)
  }
  console.log('All seven dimensions are at least 95.')
}

main()
